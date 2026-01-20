const fs = require('fs');
const path = require('path');
const inPath = path.join(__dirname, 'keyword-to-page-map.generated.csv');
const outCounts = path.join(__dirname, 'page-keyword-counts.csv');
const outUnique = path.join(__dirname, 'unique-pages.txt');

if (!fs.existsSync(inPath)) {
  console.error('Input file missing:', inPath);
  process.exit(1);
}
const raw = fs.readFileSync(inPath, 'utf8').split(/\r?\n/).slice(1).filter(Boolean);
const counts = {};
for (const line of raw) {
  // split on commas not inside quotes
  const cols = line.split(/,(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/);
  let page = cols[2] || '';
  page = page.replace(/^\"|\"$/g, '');
  counts[page] = (counts[page] || 0) + 1;
}
const rows = Object.keys(counts).map(p => `${p},${counts[p]}`).join('\n');
fs.writeFileSync(outCounts, 'Page,Count\n' + rows);
fs.writeFileSync(outUnique, Object.keys(counts).join('\n'));
console.log('Wrote', Object.keys(counts).length, 'unique pages to', outUnique);