const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

async function render(htmlPath, pdfPath) {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  const content = fs.readFileSync(htmlPath, 'utf8');
  await page.setContent(content, { waitUntil: 'networkidle0' });
  await page.pdf({ path: pdfPath, format: 'A4', printBackground: true });
  await browser.close();
}

async function main() {
  const reportsDir = path.join(__dirname, '..', 'reports');
  const files = fs.readdirSync(reportsDir).filter(f => f.endsWith('.html') && f.startsWith('pa11y'));
  for (const f of files) {
    const htmlPath = path.join(reportsDir, f);
    const pdfPath = path.join(reportsDir, f.replace(/\.html$/, '.pdf'));
    console.log('Rendering', htmlPath, '->', pdfPath);
    try {
      await render(htmlPath, pdfPath);
    } catch (e) {
      console.error('Failed to render', htmlPath, e.message);
    }
  }
}

main().catch(err => { console.error(err); process.exit(1); });
