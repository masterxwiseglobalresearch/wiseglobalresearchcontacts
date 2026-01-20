const puppeteer = require('puppeteer');

(async () => {
  const url = process.env.TEST_URL || 'http://localhost:3000/client-service-consent-form';
  console.log('Testing URL:', url);

  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();

  // Emulate a mobile device (iPhone-like viewport + touch)
  await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1');
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 3, isMobile: true, hasTouch: true });

  page.on('console', (msg) => console.log('PAGE LOG:', msg.text()));

  try {
    // Try multiple candidate routes in case the app uses a different path
    const candidates = [
      url,
      'http://localhost:3000/client-service-consent-form',
      'http://localhost:3000/clientserviceconsent',
      'http://localhost:3000/client-service-consent',
      'http://localhost:3000/clientserviceconsent-form',
      'http://localhost:3000/client-service-consent-form/',
      'http://localhost:3000/'
    ];

    let found = false;
    for (const u of candidates) {
      try {
        console.log('Trying', u);
        await page.goto(u, { waitUntil: 'networkidle2', timeout: 20000 });
        await page.waitForSelector('#clientName', { timeout: 5000 });
        console.log('Found form at', u);
        found = true;
        break;
      } catch (e) {
        // try next
      }
    }
    if (!found) throw new Error('Could not find clientName input on any candidate route.');

    // Get the bounding box of the icon span (left icon of clientName input)
    const iconHandle = await page.$('#clientName ~ .relative .absolute, #clientName').catch(() => null);

    // Safer: query the input's parent .relative then the left span inside it
    const spanHandle = await page.$('label[for="clientName"] + div .relative .absolute, #clientName').catch(() => null);

    // Try to compute a tap position near the left padding area (20px from left of input)
    const input = await page.$('#clientName');
    const box = await input.boundingBox();
    console.log('Input box:', box);

    const tapX = box.x + 18; // within the icon area
    const tapY = box.y + box.height / 2;

    // Tap the area
    await page.touchscreen.tap(tapX, tapY);

  // Wait a bit
  await new Promise((res) => setTimeout(res, 500));

    // Check document.activeElement id
    const activeId = await page.evaluate(() => document.activeElement && document.activeElement.id);
    console.log('Active element after tap:', activeId);

    // Also check if the clientName input has focus
    const hasFocus = await page.evaluate(() => document.activeElement && document.activeElement.id === 'clientName');
    console.log('clientName has focus?', hasFocus);

    if (hasFocus) {
      console.log('SUCCESS: Tapping icon area focused the input.');
    } else {
      console.log('FAIL: Input did not receive focus. Active element:', activeId);
    }

  } catch (err) {
    console.error('Test failed:', err);
    process.exitCode = 2;
  } finally {
    await browser.close();
  }
})();
