const fs = require('fs');
const path = require('path');

const reportsDir = path.join(__dirname, '..', 'reports');
const files = fs.readdirSync(reportsDir).filter(f => f.startsWith('pa11y-build-') && f.endsWith('.json'));
if (!files.length) {
  console.error('No pa11y JSON files found in reports/');
  process.exit(1);
}

for (const file of files) {
  const p = path.join(reportsDir, file);
  const json = JSON.parse(fs.readFileSync(p, 'utf8'));
  const name = file.replace('.json', '.html');
  const htmlPath = path.join(reportsDir, name);

  const issues = json.issues || [];
  const counts = issues.reduce((acc, it) => { acc[it.type] = (acc[it.type] || 0) + 1; return acc; }, {});

  const html = `<!doctype html><html><head><meta charset="utf-8"><title>pa11y report - ${file}</title><style>body{font-family:Arial,Helvetica,sans-serif;padding:18px}table{border-collapse:collapse;width:100%}th,td{border:1px solid #ddd;padding:8px}th{background:#f4f4f4}</style></head><body>
  <h1>pa11y report — ${file}</h1>
  <p>Page: <code>${json.pageUrl || ''}</code></p>
  <h2>Summary</h2>
  <ul>
    <li>Total issues: ${issues.length}</li>
    <li>Errors: ${counts.error || 0}</li>
    <li>Warnings: ${counts.warning || 0}</li>
    <li>Notices: ${counts.notice || 0}</li>
  </ul>
  <h2>Issues</h2>
  <table>
  <thead><tr><th>#</th><th>Type</th><th>Code</th><th>Message</th><th>Context (snippet)</th><th>Selector</th></tr></thead>
  <tbody>
  ${issues.map((it, i) => `<tr><td>${i+1}</td><td>${it.type}</td><td>${it.code}</td><td>${it.message}</td><td><pre style="white-space:pre-wrap;max-height:120px;overflow:auto">${(it.context||'').replace(/</g,'&lt;')}</pre></td><td>${(it.selector||'')}</td></tr>`).join('')}
  </tbody>
  </table>
  </body></html>`;

  fs.writeFileSync(htmlPath, html, 'utf8');
  console.log('Wrote', htmlPath);
}
