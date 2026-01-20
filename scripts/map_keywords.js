/* maps keywords to site pages using overrides and simple heuristics
   Usage: node scripts/map_keywords.js
   Output: seo/all-keywords-to-pages.csv
*/
const fs = require('fs');
const path = require('path');

const workspaceRoot = path.resolve(__dirname, '..');
const keywordsPath = path.join(workspaceRoot, 'seo', 'keywords-40000.json');
const overridesPath = path.join(workspaceRoot, 'seo', 'keyword-to-page-map.csv');
const pagesDir = path.join(workspaceRoot, 'src', 'pages');
const outPath = path.join(workspaceRoot, 'seo', 'all-keywords-to-pages.csv');

function readKeywords() {
  const raw = fs.readFileSync(keywordsPath, 'utf8');
  try {
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse keywords JSON:', e.message);
    process.exit(1);
  }
}

function readOverrides() {
  if (!fs.existsSync(overridesPath)) return {};
  const csv = fs.readFileSync(overridesPath, 'utf8');
  const lines = csv.split(/\r?\n/).filter(Boolean);
  const map = new Map();
  // Expect header: Rank,Keyword,Cluster,Suggested Page
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    // naive CSV split (commas inside values unlikely for this file)
    const parts = line.split(',');
    if (parts.length < 3) continue;
    const keyword = parts[1] ? parts[1].trim().replace(/^"|"$/g, '') : null;
    const suggested = parts[3] ? parts[3].trim().replace(/^"|"$/g, '') : (parts[2] || '').trim();
    if (keyword) map.set(keyword.toLowerCase(), suggested);
  }
  return map;
}

function listPages() {
  if (!fs.existsSync(pagesDir)) return [];
  return fs.readdirSync(pagesDir).filter(f => f.endsWith('.js') || f.endsWith('.jsx') || f.endsWith('.ts') || f.endsWith('.tsx'));
}

function buildTokenMap(pages) {
  const tokenMap = new Map();
  // manual high-priority tokens mapping to common pages
  const manual = {
    intraday: 'src/pages/Intraday.js',
    intradaystrategy: 'src/pages/Intraday.js',
    market: 'src/pages/MarketNews.js',
    news: 'src/pages/MarketNews.js',
    sensex: 'src/pages/MarketNews.js',
    nifty: 'src/pages/MarketNews.js',
    live: 'src/pages/MarketNews.js',
    chart: 'src/pages/LiveChart.js',
    charting: 'src/pages/LiveChart.js',
    charttools: 'src/pages/LiveChart.js',
    guide: 'src/pages/GuideForInvesting.js',
    investing: 'src/pages/GuideForInvesting.js',
    guideforinvesting: 'src/pages/GuideForInvesting.js',
    recommendation: 'src/pages/Recommendation.js',
    recommend: 'src/pages/Recommendation.js',
    recommendationdaily: 'src/pages/DailyRecommendation.js',
    daily: 'src/pages/DailyRecommendation.js',
    equity: 'src/pages/Equity.js',
    stock: 'src/pages/Recommendation.js',
    option: 'src/pages/StockOption.js',
    options: 'src/pages/StockOption.js',
    future: 'src/pages/Future.js',
    futures: 'src/pages/Future.js',
    ipo: 'src/pages/MarketNews.js',
    portfolio: 'src/pages/GuideForInvesting.js',
    buy: 'src/pages/LiveChart.js',
    sell: 'src/pages/LiveChart.js'
  };
  Object.keys(manual).forEach(t => tokenMap.set(t, manual[t]));

  // Add pages based on filename tokens as a fallback
  pages.forEach(p => {
    const name = p.replace(/\.[^.]+$/, '').toLowerCase();
    tokenMap.set(name, path.join('src','pages', p));
    // also split camel/words
    name.split(/[-_ ]|(?=[A-Z])/).forEach(piece => { if(piece) tokenMap.set(piece.toLowerCase(), path.join('src','pages', p)); });
  });

  return tokenMap;
}

function mapKeywords(keywords, overrides, tokenMap) {
  const output = [];
  let rank = 1;
  for (const kw of keywords) {
    const k = (kw || '').toString().trim();
    const kl = k.toLowerCase();
    let suggested = 'create-new';
    if (overrides.has(kl)) {
      suggested = overrides.get(kl);
    } else {
      // try tokens in keyword
      const tokens = kl.split(/[^a-z0-9]+/).filter(Boolean);
      for (const t of tokens) {
        if (tokenMap.has(t)) {
          suggested = tokenMap.get(t);
          break;
        }
      }
      // as a fallback try longest substring matches to page keys
      if (suggested === 'create-new') {
        for (const [key, val] of tokenMap) {
          if (key.length > 3 && kl.includes(key)) { suggested = val; break; }
        }
      }
    }
    output.push({ rank, keyword: k, suggested });
    rank++;
  }
  return output;
}

function writeCSV(rows) {
  const lines = ['Rank,Keyword,Suggested Page'];
  for (const r of rows) {
    // escape quotes
    const kw = '"' + (r.keyword.replace(/"/g, '""')) + '"';
    const sp = '"' + (r.suggested.replace(/"/g, '""')) + '"';
    lines.push(`${r.rank},${kw},${sp}`);
  }
  fs.writeFileSync(outPath, lines.join('\n'), 'utf8');
}

function main() {
  console.log('Reading keywords...');
  const keywords = readKeywords();
  console.log('Reading overrides...');
  const overrides = readOverrides();
  console.log('Listing pages...');
  const pages = listPages();
  console.log('Found', pages.length, 'pages');
  const tokenMap = buildTokenMap(pages);
  console.log('Mapping', keywords.length, 'keywords...');
  const rows = mapKeywords(keywords, overrides, tokenMap);
  console.log('Writing output to', outPath);
  writeCSV(rows);
  console.log('Done.');
}

main();
