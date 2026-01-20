const fs = require('fs');
const path = require('path');

const reportsDir = path.join(__dirname, '..', 'reports');

function cleanContent(s) {
  if (!s) return s;
  s = s.trim();
  // remove leading BOM (UTF-8)
  if (s.charCodeAt(0) === 0xfeff) s = s.slice(1);
  // strip fenced codeblocks like ```json ... ```
  if (s.startsWith('```')) {
    s = s.replace(/^```json\s*/i, '').replace(/```\s*$/,'').trim();
  }
  return s;
}

function main() {
  const files = fs.readdirSync(reportsDir).filter(f => f.endsWith('.json') && f.startsWith('pa11y'));
  const summary = [];
  if (!files.length) {
    console.log('No pa11y JSON files found in', reportsDir);
    return;
  }

  for (const f of files) {
    const p = path.join(reportsDir, f);
    try {
      // Read raw buffer first to detect BOM/encoding
      const raw = fs.readFileSync(p);
      let s;
      const beforeSize = raw.length;
      // detect BOM for UTF-16 LE/BE
      if (raw[0] === 0xff && raw[1] === 0xfe) {
        // UTF-16 LE
        s = raw.toString('utf16le');
      } else if (raw[0] === 0xfe && raw[1] === 0xff) {
        // UTF-16 BE (Node doesn't support utf16be directly; swap bytes)
        const swapped = Buffer.alloc(raw.length - 2);
        for (let i = 2; i < raw.length; i += 2) {
          if (i + 1 < raw.length) {
            swapped[i-2] = raw[i+1];
            swapped[i-1] = raw[i];
          }
        }
        s = swapped.toString('utf16le');
      } else {
        // default to utf8
        s = raw.toString('utf8');
      }

      s = cleanContent(s);
      // Try parse
      let data = null;
      try {
        data = JSON.parse(s);
      } catch (e) {
        console.error('ERROR parsing JSON for', f + ':', e.message);
        summary.push({ file: f, ok: false, error: e.message });
        continue;
      }

      // write pretty JSON back to file (UTF-8)
  const out = JSON.stringify(data, null, 2);
  fs.writeFileSync(p, out, 'utf8');
  const afterSize = Buffer.byteLength(out, 'utf8');
      console.log(`${f}: cleaned, issues=${Array.isArray(data)?data.length:'N/A'} (before ${beforeSize} bytes, after ${afterSize} bytes)`);
      summary.push({ file: f, ok: true, issues: Array.isArray(data)?data.length:null, beforeSize, afterSize });
    } catch (err) {
      console.error('Failed processing', f + ':', err.message);
      summary.push({ file: f, ok: false, error: err.message });
    }
  }

  try {
    fs.writeFileSync(path.join(reportsDir, 'pa11y-cleaning-summary.json'), JSON.stringify(summary, null, 2), 'utf8');
    console.log('Wrote pa11y-cleaning-summary.json');
  } catch (e) {
    console.error('Failed to write summary:', e.message);
  }
}

main();
