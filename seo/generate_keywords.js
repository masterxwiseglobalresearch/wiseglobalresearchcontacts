const fs = require('fs');
const path = require('path');

// Simple keyword skeleton generator for stock market related long-tail keywords.
// This will create 40,000 unique keyword phrases in English and Hindi.

const englishSeeds = [
  'stock market', 'Nifty', 'Sensex', 'intraday', 'share tips', 'buy sell', 'stock recommendation', 'equity research', 'IPO', 'options trading', 'futures trading', 'technical analysis', 'fundamental analysis', 'portfolio', 'day trading', 'swing trading'
];

const hindiSeeds = [
  'share bazar', 'nifty', 'sensex', 'intraday tips', 'share salah', 'khareedo', 'becho', 'stocks ki research', 'ipo jankari', 'options trading', 'futures', 'takneeki visleshan', 'moolyaankan', 'portfolio salah', 'din bhar trading'
];

const modifiers = [
  'today', 'tomorrow', 'live', 'analysis', 'tips', 'best', 'top', 'strategy', 'for beginners', 'in India', '2025', 'chart', 'signal', 'buy now', 'sell now', 'intraday strategy', 'long term', 'short term'
];

// Generate permutations with some templates
function generatePhrases(seeds, count) {
  const set = new Set();
  while (set.size < count) {
    const seed = seeds[Math.floor(Math.random() * seeds.length)];
    const mod = modifiers[Math.floor(Math.random() * modifiers.length)];
    const templateType = Math.floor(Math.random() * 4);
    let phrase;
    switch (templateType) {
      case 0:
        phrase = `${seed} ${mod}`;
        break;
      case 1:
        phrase = `${mod} ${seed}`;
        break;
      case 2:
        phrase = `${seed} ${mod} tips`;
        break;
      default:
        phrase = `${seed} ${mod} ${Math.floor(Math.random() * 1000)}`;
    }
    // normalize
    phrase = phrase.replace(/\s+/g, ' ').trim();
    set.add(phrase.toLowerCase());
  }
  return Array.from(set);
}

function main() {
  const total = 40000;
  const half = Math.floor(total / 2);
  const en = generatePhrases(englishSeeds, half);
  const hi = generatePhrases(hindiSeeds, total - half);
  const all = en.concat(hi);

  const outPath = path.resolve(__dirname, 'keywords-40000.json');
  fs.writeFileSync(outPath, JSON.stringify(all, null, 2), 'utf8');
  console.log('Generated', all.length, 'keywords at', outPath);
}

main();
