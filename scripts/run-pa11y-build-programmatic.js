#!/usr/bin/env node
const http = require('http');
const handler = require('serve-handler');
const pa11y = require('pa11y');
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const BUILD_DIR = path.join(__dirname, '..', 'build');
const REPORTS_DIR = path.join(__dirname, '..', 'reports');
if (!fs.existsSync(REPORTS_DIR)) fs.mkdirSync(REPORTS_DIR, { recursive: true });

// Lightweight static server: serve files directly, and fall back to index.html for SPA routes.
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
  '.map': 'application/octet-stream'
};

const server = http.createServer((req, res) => {
  try {
    const reqUrl = decodeURIComponent(req.url.split('?')[0]);
    // normalize and prevent path traversal
    let relPath = reqUrl.replace(/^\//, '');
    if (!relPath || relPath.endsWith('/')) relPath = path.join(relPath, 'index.html');
    const filePath = path.join(BUILD_DIR, relPath);
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath).toLowerCase();
      const type = MIME[ext] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': type });
      fs.createReadStream(filePath).pipe(res);
      return;
    }
    // Fallback to build/index.html for SPA routes
    const indexPath = path.join(BUILD_DIR, 'index.html');
    if (fs.existsSync(indexPath)) {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      fs.createReadStream(indexPath).pipe(res);
      return;
    }
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Not found');
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Server error');
  }
});

server.listen(0, '127.0.0.1', async () => {
  const port = server.address().port;
  const base = `http://127.0.0.1:${port}`;
  console.log('Serving build at', base);

  // Add optional wait/readySelector per-route so client-side head updates (Helmet) are applied
  const routes = [
    { path: '/', name: 'home' },
    { path: '/contact', name: 'contact', wait: 2000 }, // wait 2s for Helmet to update title/meta
    { path: '/accessibility-statement', name: 'accessibility-statement' }
  ];
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  for (const route of routes) {
    const name = typeof route === 'string' ? (route === '/' ? 'home' : route.replace(/^\//, '').replace(/\//g, '-')) : route.name;
    const htmlPath = path.join(REPORTS_DIR, `pa11y-build-${name}.html`);
    const snapshotPath = path.join(REPORTS_DIR, `pa11y-build-${name}.snapshot.html`);
    const errPath = path.join(REPORTS_DIR, `pa11y-build-${name}.err`);
    try {
      const pageUrl = `${base}${typeof route === 'string' ? route : route.path}`;

      // Pre-render with puppeteer so client-side head updates (Helmet / inline scripts) are applied
      const page = await browser.newPage();
      await page.goto(pageUrl, { waitUntil: 'networkidle2', timeout: 30000 });
      // Wait for title or lang to be set by client-side code (max 5s)
      try {
        await page.waitForFunction("(document.title && document.title.length > 0) || document.documentElement.lang", { timeout: 5000 });
      } catch (e) {
        // ignore timeout; we'll still capture the snapshot
      }
      const snapshotHtml = await page.content();
      fs.writeFileSync(snapshotPath, snapshotHtml, 'utf8');
      await page.close();

  // Run pa11y against the snapshot HTML file to ensure head/title/lang are inspected
  const pa11yOptions = { standard: 'WCAG2AA' };
  const snapshotFileUrl = `file://${snapshotPath}`;
  const result = await pa11y(snapshotFileUrl, pa11yOptions);

      const jsonPath = path.join(REPORTS_DIR, `pa11y-build-${name}.json`);
      fs.writeFileSync(jsonPath, JSON.stringify(result, null, 2), 'utf8');
      fs.writeFileSync(htmlPath, snapshotHtml, 'utf8');
      fs.writeFileSync(errPath, '', 'utf8');
      console.log(`Saved ${jsonPath} (snapshot -> ${snapshotPath})`);
    } catch (err) {
      const msg = (err && (err.stack || err.message)) || String(err);
      fs.writeFileSync(errPath, msg, 'utf8');
      console.error(`Error running pa11y on ${route}:`, msg);
    }
  }
  await browser.close();

  server.close(() => process.exit(0));
});
