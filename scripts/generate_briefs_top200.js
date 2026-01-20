// Generate content briefs for items marked 'Create content' in prioritized-top-200-targets.csv
const fs = require('fs');
const path = require('path');
const infile = path.join(__dirname,'..','seo','prioritized-top-200-targets.csv');
const outfile = path.join(__dirname,'..','seo','content-briefs-top-200.csv');
const csv = fs.readFileSync(infile,'utf8');
const lines = csv.split(/\r?\n/).filter(Boolean);
const out = ['Rank,Keyword,Slug,Title,H1,MetaDescription,WordCount,InternalLinks'];
for (let i=1;i<lines.length;i++){
  const line = lines[i];
  const m = line.match(/^\s*(\d+),"([^"]+)","?([^"]+)"?,(.*)$/);
  if(!m) continue;
  const rank = m[1];
  const keyword = m[2];
  const suggested = (m[3]||'').replace(/^"|"$/g,'');
  const action = (m[4]||'').trim();
  if(action !== 'Create content') continue;
  // create slug from keyword
  const slug = keyword.toLowerCase().replace(/[^a-z0-9\s-]/g,'').replace(/\s+/g,'-').slice(0,80);
  const title = `${keyword} - Expert Guide & Tips`;
  const h1 = `${keyword}`;
  const meta = `${keyword}. Read practical tips, strategies and examples to help you get started and improve results.`.slice(0,155);
  // choose wordcount heuristic
  const wc = /\b(tips|strategy|analysis|guide)\b/i.test(keyword) ? 1200 : 800;
  // internal links heuristic: link to suggested page if exists
  const internal = suggested !== 'create-new' ? suggested : 'src/pages/GuideForInvesting.js';
  out.push([rank,'"'+keyword.replace(/"/g,'""')+'"','"'+slug+'"','"'+title.replace(/"/g,'""')+'"','"'+h1.replace(/"/g,'""')+'"','"'+meta.replace(/"/g,'""')+'"',wc,'"'+internal+'"'].join(','));
}
fs.writeFileSync(outfile,out.join('\n'),'utf8');
console.log('Wrote', outfile);
