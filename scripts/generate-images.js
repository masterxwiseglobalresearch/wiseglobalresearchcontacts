// Simple image generator using sharp
// Produces webp and avif variants at responsive widths for each source in src/assets/images
// Also copies the original file to public/assets/images for PNG/JPEG fallback
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const srcDir = path.join(__dirname, '..', 'src', 'assets', 'images');
const outDir = path.join(__dirname, '..', 'public', 'assets', 'images');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

// Include small sizes for logos/icons and larger sizes for hero/headers
const widths = [32, 64, 96, 112, 128, 256, 400, 800, 1200, 1600];

async function processImage(file) {
  const name = path.parse(file).name;
  const srcPath = path.join(srcDir, file);
  const img = sharp(srcPath);

  // Copy original for fallback (PNG/JPG)
  try {
    const fallbackOut = path.join(outDir, file);
    fs.copyFileSync(srcPath, fallbackOut);
    console.log(`Copied original to ${fallbackOut}`);
  } catch (e) {
    console.warn(`Failed to copy original for ${file}:`, e.message);
  }
  for (const w of widths) {
    const webpOut = path.join(outDir, `${name}-${w}.webp`);
    const avifOut = path.join(outDir, `${name}-${w}.avif`);
    await img.resize({ width: w }).webp({ quality: 78 }).toFile(webpOut);
    await img.resize({ width: w }).avif({ quality: 58 }).toFile(avifOut);
    console.log(`Generated ${webpOut} and ${avifOut}`);
  }
}

(async () => {
  const files = fs.readdirSync(srcDir).filter(f => /\.(png|jpe?g)$/i.test(f));
  for (const f of files) {
    try {
      await processImage(f);
    } catch (e) {
      console.error('Failed to process', f, e);
    }
  }
  console.log('Image generation complete');
})();
