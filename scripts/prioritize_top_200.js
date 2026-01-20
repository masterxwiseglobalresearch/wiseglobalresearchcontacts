// Generate seo/prioritized-top-200-targets.csv from seo/all-keywords-to-pages.csv
const fs = require('fs');
const path = require('path');
const infile = path.join(__dirname,'..','seo','all-keywords-to-pages.csv');
const outfile = path.join(__dirname,'..','seo','prioritized-top-200-targets.csv');
const csv = fs.readFileSync(infile,'utf8');
const lines = csv.split(/\r?\n/).filter(Boolean);
const out = ['Rank,Keyword,Suggested Page,Action'];
for (let i=1;i<=200 && i<lines.length;i++){
  const line = lines[i];
  // parse CSV simple: Rank,"Keyword","Suggested Page"
  const m = line.match(/^\s*(\d+),"([^"]+)","?([^"]+)"?\s*$/);
  if(!m) continue;
  const rank = m[1];
  const keyword = m[2].replace(/""/g,'"');
  const suggested = m[3];
  const action = suggested === 'create-new' ? 'Create content' : 'Optimize existing page';
  out.push([rank,'"'+keyword.replace(/"/g,'""')+'"','"'+suggested+'"',action].join(','));
}
fs.writeFileSync(outfile,out.join('\n'),'utf8');
console.log('Wrote', outfile);
