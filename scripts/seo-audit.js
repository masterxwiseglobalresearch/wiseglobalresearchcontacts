#!/usr/bin/env node
// Simple SEO audit for src/components/seo-config.js
// - Reports title length > 60 and description length > 155
// - With --fix it writes a fixed file at src/components/seo-config.fixed.js (does not overwrite original)

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const repoRoot = path.resolve(__dirname, '..');
const seoPath = path.join(repoRoot, 'src', 'components', 'seo-config.js');

if (!fs.existsSync(seoPath)) {
  console.error('seo-config.js not found at', seoPath);
  process.exit(2);
}

const src = fs.readFileSync(seoPath, 'utf8');

// Find the ROUTE_META object text by locating 'export const ROUTE_META' and matching braces
const marker = 'export const ROUTE_META';
const idx = src.indexOf(marker);
if (idx === -1) {
  console.error('Could not find ROUTE_META in seo-config.js');
  process.exit(2);
}

const braceStart = src.indexOf('{', idx);
if (braceStart === -1) {
  console.error('Malformed ROUTE_META: no opening brace found');
  process.exit(2);
}

let i = braceStart;
let depth = 0;
let endIdx = -1;
for (; i < src.length; i++) {
  const ch = src[i];
  if (ch === '{') depth++;
  else if (ch === '}') {
    depth--;
    if (depth === 0) { endIdx = i; break; }
  }
}
if (endIdx === -1) {
  console.error('Could not find end of ROUTE_META object');
  process.exit(2);
}

const objText = src.slice(braceStart, endIdx + 1);
// Create a safe eval context: wrap into module exports
const wrapped = 'const ROUTE_META = ' + objText + '; module.exports = ROUTE_META;';
let ROUTE_META;
try {
  const script = new vm.Script(wrapped, { filename: 'route-meta.vm.js' });
  const sandbox = { module: {} };
  const context = vm.createContext(sandbox);
  script.runInContext(context);
  ROUTE_META = sandbox.module.exports;
} catch (err) {
  console.error('Failed to parse ROUTE_META:', err.message);
  process.exit(2);
}

const MAX_TITLE = 60;
const MAX_DESC = 155;

const report = [];
for (const route of Object.keys(ROUTE_META)) {
  const meta = ROUTE_META[route] || {};
  const title = (meta.title || '').trim();
  const desc = (meta.description || '').trim();
  const problems = [];
  if (title.length > MAX_TITLE) problems.push({ field: 'title', length: title.length });
  if (desc.length > MAX_DESC) problems.push({ field: 'description', length: desc.length });
  if (problems.length) report.push({ route, titleLength: title.length, descLength: desc.length, problems });
}

if (report.length === 0) {
  console.log('SEO audit: all route titles and descriptions are within recommended lengths.');
} else {
  console.log('SEO audit: found issues in the following routes:\n');
  for (const r of report) {
    console.log(`- ${r.route}`);
    if (r.titleLength > MAX_TITLE) console.log(`  - title length: ${r.titleLength} (recommended <= ${MAX_TITLE})`);
    if (r.descLength > MAX_DESC) console.log(`  - description length: ${r.descLength} (recommended <= ${MAX_DESC})`);
  }
  console.log('\nRun with --fix to create a fixed file at src/components/seo-config.fixed.js (does not overwrite original).');
}

if (process.argv.includes('--fix')) {
  // Create a shallow fixed copy truncating title/description
  const fixed = JSON.parse(JSON.stringify(ROUTE_META));
  for (const route of Object.keys(fixed)) {
    const m = fixed[route];
    if (m.title && m.title.length > MAX_TITLE) m.title = m.title.slice(0, MAX_TITLE - 3).trim() + '...';
    if (m.description && m.description.length > MAX_DESC) m.description = m.description.slice(0, MAX_DESC - 3).trim() + '...';
  }
  const prefix = src.slice(0, idx);
  const suffix = src.slice(endIdx + 1);
  const newObjText = JSON.stringify(fixed, null, 2);
  const replacement = `export const ROUTE_META = ${newObjText};`;
  const newContent = prefix + replacement + suffix;
  const outPath = path.join(repoRoot, 'src', 'components', 'seo-config.fixed.js');
  fs.writeFileSync(outPath, newContent, 'utf8');
  console.log('\nFixed file written to', outPath);
}
