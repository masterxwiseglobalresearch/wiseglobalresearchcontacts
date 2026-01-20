// Auto-maps keywords to suggested pages using existing mapping and clusters
// Usage: node seo/auto-map-keywords.js > seo/auto-keyword-to-page-map.csv

const fs = require('fs');
const path = require('path');

const KEYWORDS_PATH = path.join(__dirname, 'keywords-40000.json');
const EXISTING_MAP_PATH = path.join(__dirname, 'keyword-to-page-map.csv');

// Read all keywords
const keywords = JSON.parse(fs.readFileSync(KEYWORDS_PATH, 'utf8'));

// Read existing mapping (CSV)
const csv = fs.readFileSync(EXISTING_MAP_PATH, 'utf8');
const lines = csv.split(/\r?\n/).filter(Boolean);
const header = lines[0].split(',');
const map = {};
for (let i = 1; i < lines.length; ++i) {
  const cols = lines[i].split(',');
  if (cols.length < 4) continue;
  map[cols[1].toLowerCase()] = {
    cluster: cols[2],
    page: cols[3]
  };
}

// Fallback page if not mapped
const DEFAULT_PAGE = 'src/pages/GuideForInvesting.js';

// Output CSV header
console.log('Keyword,Cluster,Suggested Page');

for (const kw of keywords) {
  const key = kw.toLowerCase();
  if (map[key]) {
    console.log(`"${kw}","${map[key].cluster}","${map[key].page}"`);
  } else {
    // Fallback: assign to default cluster/page
    console.log(`"${kw}","General","${DEFAULT_PAGE}"`);
  }
}
