/*
  scripts/helmify_pages.js
  - Scans src/pages/*.js
  - If a file does not import Helmet, adds: import { Helmet } from 'react-helmet-async';
  - If a file's component return does not include a <Helmet> block, inserts a minimal Helmet block near top-level return.

  WARNING: Operates with simple heuristics; review changes before committing.
*/

const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, '..', 'src', 'pages');

function listJsFiles(dir) {
  return fs.readdirSync(dir).filter(f => f.endsWith('.js'));
}

function ensureHelmetImport(content) {
  if (/import\s*\{\s*Helmet\s*\}\s*from\s*['\"]react-helmet-async['\"];?/.test(content)) return content;
  // Try to insert after other imports (place after the last import)
  const importRegex = /(^import[\s\S]*?;\s*)+/m;
  const match = content.match(importRegex);
  if (match) {
    const importsBlock = match[0];
    const idx = match.index + importsBlock.length;
    return content.slice(0, idx) + "\nimport { Helmet } from 'react-helmet-async';\n" + content.slice(idx);
  }
  // Fallback: prepend
  return "import { Helmet } from 'react-helmet-async';\n" + content;
}

function ensureHelmetBlock(content, filename) {
  // If already contains <Helmet> return
  if (/\<Helmet[\s\S]*?\<\/Helmet\>/.test(content)) return content;

  // Find the first top-level return start ("return (" or "=> (") and insert Helmet after the opening tag
  // We'll search for patterns like "return (" or "=> (" followed by a tag like <div or <motion.div or <section
  const returnRegex = /(return\s*\(|=>\s*\()([\s\S]*?)(<[^>\n]+)/m;
  const m = content.match(returnRegex);
  if (!m) {
    // Could not find return; skip
    return content;
  }
  const insertPos = m.index + m[0].length - m[3].length; // position before the first tag

  // Simple title from filename
  const base = path.basename(filename, '.js');
  const niceTitle = base.replace(/([A-Z])/g, ' $1').replace(/^\s+/, '').replace(/\b(\w)/g, s => s.toUpperCase());
  const titleText = `${niceTitle} - Wise Global Research`;
  const canonical = `https://wiseglobalresearch.com/${base.toLowerCase()}`;

  const helmetBlock = `\n      <Helmet>\n        <title>${titleText}</title>\n        <meta name="description" content="${niceTitle} page — Wise Global Research." />\n        <link rel=\"canonical\" href=\"${canonical}\" />\n      </Helmet>\n`;

  const newContent = content.slice(0, insertPos) + helmetBlock + content.slice(insertPos);
  return newContent;
}

function processFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  let updated = content;
  updated = ensureHelmetImport(updated);
  updated = ensureHelmetBlock(updated, filePath);
  if (updated !== content) {
    fs.writeFileSync(filePath, updated, 'utf8');
    return true;
  }
  return false;
}

function main() {
  const files = listJsFiles(pagesDir);
  const modified = [];
  files.forEach(f => {
    const full = path.join(pagesDir, f);
    try {
      const changed = processFile(full);
      if (changed) modified.push(f);
    } catch (e) {
      console.error('Failed', f, e.message);
    }
  });
  console.log('Processed', files.length, 'files. Modified:', modified.length);
  if (modified.length) console.log(modified.join('\n'));
}

if (require.main === module) main();
