// Optional simple sitemap generator script (node) for CRA builds
// Usage: node src/utils/generateSitemap.js > public/sitemap.xml

const fs = require('fs');
const path = require('path');

// Read routes directly from src/App.js so sitemap reflects current visible pages
const APP_PATH = path.join(__dirname, '..', '..', 'src', 'App.js');
let appSrc = '';
try {
  appSrc = fs.readFileSync(APP_PATH, 'utf8');
} catch (e) {
  console.error('Could not read src/App.js to auto-detect routes:', e.message);
  process.exit(2);
}

// Regex to capture route path values like path="/example" or path='/example'
const PATH_RE = /path\s*=\s*{?\s*['"]([^'"]+)['"]\s*}?/g;

const extracted = [];
let m;
while ((m = PATH_RE.exec(appSrc)) !== null) {
  const p = m[1];
  // Only include absolute public paths (start with '/') — skip relative admin child routes like 'dashboard'
  if (p && p.startsWith('/')) extracted.push(p);
}

// Fallback: if no routes extracted, include root
if (extracted.length === 0) extracted.push('/');

const BASE = 'https://wiseglobalresearch.com';

// Exclude private/admin paths
const EXCLUDE_PREFIXES = ['/admin', '/admin/'];
const EXCLUDE_EXACT = new Set(['/client-panel']);

const normalize = (r) => {
  let p = String(r).trim();
  if (!p.startsWith('/')) p = `/${p}`;
  if (p.length > 1 && p.endsWith('/')) p = p.slice(0, -1);
  return p === '/' ? '/' : p.toLowerCase();
};

const isExcluded = (p) => {
  if (EXCLUDE_EXACT.has(p)) return true;
  return EXCLUDE_PREFIXES.some((pre) => p === pre || p.startsWith(pre));
};

const routes = Array.from(new Set(extracted.map(normalize).filter((p) => !isExcluded(p))));

const PAGE_META = {
  '/': { changefreq: 'daily', priority: '1.0' },
  '/blogs': { changefreq: 'daily', priority: '0.8' },
  '/research-reports': { changefreq: 'weekly', priority: '0.6' }
};

const lastmod = new Date().toISOString().slice(0, 10);

const xmlParts = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'];

for (const r of routes) {
  const loc = `${BASE}${r === '/' ? '/' : r}`;
  xmlParts.push('  <url>');
  xmlParts.push(`    <loc>${loc}</loc>`);
  xmlParts.push(`    <lastmod>${lastmod}</lastmod>`);
  const meta = PAGE_META[r];
  if (meta && meta.changefreq) xmlParts.push(`    <changefreq>${meta.changefreq}</changefreq>`);
  if (meta && meta.priority) xmlParts.push(`    <priority>${meta.priority}</priority>`);
  xmlParts.push('  </url>');
}

xmlParts.push('</urlset>');

process.stdout.write(xmlParts.join('\n') + '\n');
