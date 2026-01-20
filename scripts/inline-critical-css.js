#!/usr/bin/env node
/**
 * Inline small main CSS into index.html to reduce render-blocking request.
 * Strategy:
 * 1. Find build/static/css/main.*.css
 * 2. If file size <= 30KB (customizable via INLINE_CSS_MAX bytes env), inline entire content.
 * 3. Replace <link href="/static/css/main.*.css" rel="stylesheet"> with
 *    <style data-inlined-main-css>...</style>
 * 4. If larger than threshold, extract first ~15KB of rules as critical (rudimentary) and keep the link:
 *    - Insert <style data-critical-css>...</style> before the link
 *    - Add rel="preload" as="style" on original link + JS snippet to swap rel after load for non-blocking load.
 */

const fs = require('fs');
const path = require('path');

const buildDir = path.resolve(__dirname, '..', 'build');
const indexPath = path.join(buildDir, 'index.html');

if (!fs.existsSync(indexPath)) {
  console.error('[inline-critical-css] index.html not found, aborting');
  process.exit(0); // Not fatal for CI
}

const cssDir = path.join(buildDir, 'static', 'css');
if (!fs.existsSync(cssDir)) {
  console.error('[inline-critical-css] css directory not found, aborting');
  process.exit(0);
}

const files = fs.readdirSync(cssDir).filter(f => /^main\..+\.css$/.test(f));
if (!files.length) {
  console.log('[inline-critical-css] No main.*.css found');
  process.exit(0);
}
const mainCssFile = files[0];
const mainCssPath = path.join(cssDir, mainCssFile);
const cssContent = fs.readFileSync(mainCssPath, 'utf8');
const cssSize = Buffer.byteLength(cssContent);
const maxInline = parseInt(process.env.INLINE_CSS_MAX || '30720', 10); // 30KB default

let indexHtml = fs.readFileSync(indexPath, 'utf8');

// Normalize link tag pattern (CRA builds typically use /static/css/...)
const linkRegex = new RegExp(`<link[^>]+href="/static/css/${mainCssFile.replace(/\./g, '\\.')}(?:\?[^"']*)?"[^>]*>`, 'i');
const match = indexHtml.match(linkRegex);
if (!match) {
  console.warn('[inline-critical-css] main css link tag not found');
  process.exit(0);
}

if (cssSize <= maxInline) {
  const styleTag = `<style data-inlined-main-css>${cssContent}</style>`;
  indexHtml = indexHtml.replace(linkRegex, styleTag);
  console.log(`[inline-critical-css] Inlined full main CSS (${(cssSize/1024).toFixed(1)}KB)`);
} else {
  // crude critical extraction: first 15KB boundaries at rule end
  const criticalSlice = cssContent.slice(0, 15 * 1024);
  // try extend to next closing brace
  const lastBrace = criticalSlice.lastIndexOf('}');
  const criticalCss = criticalSlice.slice(0, lastBrace + 1);
  const criticalTag = `<style data-critical-css>${criticalCss}</style>`;
  const preloadLink = match[0]
    .replace(/rel="stylesheet"/i, 'rel="preload" as="style"')
    .replace(/>$/, ' onload="this.rel=\'stylesheet\'">');
  indexHtml = indexHtml.replace(linkRegex, `${criticalTag}\n${preloadLink}`);
  console.log(`[inline-critical-css] Added critical CSS (~${(criticalCss.length/1024).toFixed(1)}KB) and preload for main CSS (${(cssSize/1024).toFixed(1)}KB total)`);
}

fs.writeFileSync(indexPath, indexHtml, 'utf8');
console.log('[inline-critical-css] Done');
