const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const routes = [
  '/',
  '/client-service-consent-form',
  '/contact',
  '/search'
];

const viewports = [
  { name: 'mobile-xs', width: 360, height: 800, ua: 'Mozilla/5.0 (Linux; Android 9; Pixel Buds) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Mobile Safari/537.36' },
  { name: 'mobile', width: 390, height: 844, ua: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1' },
  { name: 'tablet', width: 768, height: 1024, ua: 'Mozilla/5.0 (iPad; CPU OS 13_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0 Safari/605.1.15' },
  { name: 'desktop', width: 1366, height: 768, ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36' }
];

(async () => {
  const outDir = path.resolve(__dirname, '../reports/responsive');
  fs.mkdirSync(outDir, { recursive: true });

  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();

  for (const vp of viewports) {
    await page.setUserAgent(vp.ua);
    await page.setViewport({ width: vp.width, height: vp.height });

    for (const route of routes) {
      const url = `http://localhost:3000${route}`;
      console.log(`Checking ${route} at ${vp.name} (${vp.width}x${vp.height})`);
      try {
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 20000 });
      } catch (e) {
        console.warn('Failed to load', url, e.message);
        continue;
      }

      // wait briefly for UI to settle
      await new Promise((r) => setTimeout(r, 500));

      // measure document width vs viewport width
      const metrics = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
        bodyScrollWidth: document.body.scrollWidth,
      }));

      // detect large fixed overlays (elements fixed and covering >50% of viewport)
      const overlays = await page.evaluate(() => {
        const els = Array.from(document.querySelectorAll('*'));
        const res = [];
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        for (const el of els) {
          try {
            const style = window.getComputedStyle(el);
            if (style.position === 'fixed' && parseFloat(style.opacity || '1') > 0.01) {
              const rect = el.getBoundingClientRect();
              const area = rect.width * rect.height;
              const varea = vw * vh;
              if (area / varea > 0.45) {
                res.push({ tag: el.tagName, class: el.className, rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height } });
              }
            }
          } catch (e) {
            // ignore
          }
        }
        return res;
      });

      const name = `${route === '/' ? 'home' : route.replace(/\//g, '_')}_${vp.name}`.replace(/^_/, '');
      const pngPath = path.join(outDir, `${name}.png`);
      await page.screenshot({ path: pngPath, fullPage: true });

      console.log(`Result for ${route} @ ${vp.name}: scrollWidth=${metrics.scrollWidth}, clientWidth=${metrics.clientWidth}, bodyScrollWidth=${metrics.bodyScrollWidth}, overlays=${overlays.length}`);
      if (metrics.scrollWidth > metrics.clientWidth + 2) {
        console.warn(`⚠️ Overflow detected on ${route} at ${vp.name}: doc scrollWidth ${metrics.scrollWidth} > clientWidth ${metrics.clientWidth}`);
      }
      if (overlays.length > 0) {
        console.warn(`⚠️ Large overlay(s) detected on ${route} at ${vp.name}:`, overlays.slice(0,3));
      }
    }
  }

  await browser.close();
  console.log('Responsive check done. Screenshots saved in', outDir);
})();
