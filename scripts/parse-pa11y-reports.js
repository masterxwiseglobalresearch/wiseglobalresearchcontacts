const fs = require('fs');
const path = require('path');

const reportsDir = path.join(__dirname, '..', 'reports');

function readJSONSafe(p) {
  try {
    const s = fs.readFileSync(p, 'utf8').trim();
    if (!s) return null;
    return JSON.parse(s);
  } catch (e) {
    console.error('Failed to read/parse', p, e.message);
    return null;
  }
}

function topCounts(arr, keyFn, topN = 10) {
  const counts = new Map();
  for (const it of arr) {
    const k = keyFn(it) || 'UNKNOWN';
    counts.set(k, (counts.get(k) || 0) + 1);
  }
  const items = Array.from(counts.entries()).sort((a,b)=>b[1]-a[1]);
  return items.slice(0, topN).map(([k,v])=>({ key:k, count:v }));
}

function main() {
  const files = fs.readdirSync(reportsDir).filter(f => f.endsWith('.json') && f.startsWith('pa11y'));
  const summary = { generatedAt: new Date().toISOString(), reports: {} };

  for (const f of files) {
    const p = path.join(reportsDir, f);
    const data = readJSONSafe(p);
    if (!data) continue;
    const issues = Array.isArray(data) ? data : (data.issues || []);
    const total = issues.length;
    const byType = topCounts(issues, i => i.code || i.rule || i.message);
    const byMessage = topCounts(issues, i => i.message);
    const bySelector = topCounts(issues, i => i.selector);

    summary.reports[f] = {
      total,
      byType,
      byMessage: byMessage.slice(0,10),
      bySelector: bySelector.slice(0,10)
    };

    console.log(`${f}: ${total} issues`);
  }

  const outPath = path.join(reportsDir, 'pa11y-summary.json');
  fs.writeFileSync(outPath, JSON.stringify(summary, null, 2), 'utf8');
  console.log('Wrote', outPath);
}

main();
