import React, { useEffect, useRef, useState } from 'react';
import { FiSun, FiZapOff, FiLink, FiType, FiDroplet, FiBookOpen } from 'react-icons/fi';
import { motion } from 'framer-motion';

// Simple universal accessibility icon (stick figure with arms), drawn as pure SVG
const A11yIcon = ({ className = 'w-9 h-9' }) => (
  <svg
    viewBox="0 0 64 64"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    className={className}
  >
    <defs>
      <linearGradient id="a11y-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#8b5cf6" />
        <stop offset="100%" stopColor="#6366f1" />
      </linearGradient>
    </defs>
    {/* Badge background */}
    <circle cx="32" cy="32" r="30" fill="url(#a11y-grad)" />
    {/* Person: head */}
    <circle cx="32" cy="22" r="5" fill="#ffffff" opacity="0.95" />
    {/* Arms */}
    <path d="M14 30 L50 30" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" opacity="0.95" />
    {/* Body */}
    <path d="M32 30 L32 44" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" opacity="0.95" />
    {/* Legs */}
    <path d="M32 44 L22 54" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" opacity="0.95" />
    <path d="M32 44 L42 54" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" opacity="0.95" />
  </svg>
);

// Lightweight global accessibility control panel
// - Persists settings to localStorage
// - Applies attrs/styles on <html> so it works app-wide

const STORAGE_KEY = 'a11ySettings';

// ensure runtime CSS is injected only once
function ensureA11yRuntimeStyle() {
  const STYLE_ID = 'a11y-runtime-style';
  const existing = document.getElementById(STYLE_ID);
  const baseCSS = `
/* Global a11y utility styles injected at runtime */
html[data-reduce-motion="true"] * { animation: none !important; animation-play-state: paused !important; transition: none !important; transition-duration: 0s !important; scroll-behavior: auto !important; }
html[data-highlight-links="true"] a { outline: 2px dashed #22c55e !important; outline-offset: 2px; text-decoration: underline !important; }
html[data-a11y-align-left="true"] * { text-align: left !important; }
html[data-a11y-align-right="true"] * { text-align: right !important; }
/* Dyslexic font when enabled */
html[data-a11y-dyslexic="true"] body { font-family: 'OpenDyslexic3','OpenDyslexic','OpenDyslexic Alta', system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif !important; }
/* Big cursor (PNG generated via canvas; see applySettingsToDocument) */
html[data-a11y-big-cursor="true"], html[data-a11y-big-cursor="true"] * { cursor: var(--a11y-cursor, auto) !important; }
/* Base application via variables; fallback directly applied via JS, but keep here for inheritance */
html { filter: var(--a11y-filter, none); }
body { letter-spacing: var(--a11y-letter-spacing, 0px); line-height: var(--a11y-line-height, normal); font-weight: var(--a11y-font-weight, inherit); }
/* Reading guide overlay */
html[data-a11y-reading-guide="true"] { --rg-y: 50vh; --rg-h: 36px; }
html[data-a11y-reading-guide="true"]::before {
  content: '';
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 8000;
  background:
    linear-gradient(
      to bottom,
      rgba(0,0,0,0.45) calc(var(--rg-y) - var(--rg-h)),
      rgba(0,0,0,0) calc(var(--rg-y) - var(--rg-h)),
      rgba(0,0,0,0) calc(var(--rg-y) + var(--rg-h)),
      rgba(0,0,0,0.45) calc(var(--rg-y) + var(--rg-h))
    );
}
`;
  if (existing) {
    // Update the existing style if RG CSS missing (for hot reloads)
    if (!existing.textContent.includes('data-a11y-reading-guide')) {
      existing.textContent += `\n/* [update] a11y reading guide */\n` + baseCSS.split('/* Reading guide overlay */')[1];
    }
    return;
  }
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = baseCSS;
  document.head.appendChild(style);
}

// Load OpenDyslexic font when needed
function ensureDyslexicFont() {
  const LINK_ID = 'a11y-open-dyslexic-font';
  if (document.getElementById(LINK_ID)) return;
  const link = document.createElement('link');
  link.id = LINK_ID;
  link.rel = 'stylesheet';
  // Public CDN for OpenDyslexic
  link.href = 'https://cdn.jsdelivr.net/gh/antijingoist/open-dyslexic/stylesheet.css';
  document.head.appendChild(link);
}

// Build a larger, default-style arrow cursor as a PNG (works across Chrome/Safari/Edge)
// Cached on window to avoid re-creating on every toggle
function makeBigCursorDataUrl() {
  try {
    if (window.__A11Y_BIG_CURSOR_URL) return window.__A11Y_BIG_CURSOR_URL;
  } catch {
    // ignore (e.g., strict CSP sandbox without window write)
  }
  const size = 64; // overall image size for clearer visibility
  const c = document.createElement('canvas');
  c.width = size;
  c.height = size;
  const ctx = c.getContext('2d');
  if (!ctx) return '';

  // High-DPI crispness
  ctx.imageSmoothingEnabled = true;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  // Draw a classic arrow cursor shape (tip near 2,2 so hotspot 0,0 feels right)
  ctx.beginPath();
  ctx.moveTo(2, 2);
  ctx.lineTo(2, 34);
  ctx.lineTo(10, 26);
  ctx.lineTo(16, 44);
  ctx.lineTo(22, 41);
  ctx.lineTo(16, 24);
  ctx.lineTo(34, 24);
  ctx.closePath();

  // Fill white, black outline
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 2.5;
  ctx.fill();
  ctx.stroke();

  const url = c.toDataURL('image/png');
  try { window.__A11Y_BIG_CURSOR_URL = url; } catch {}
  return url;
}

// Ensure a dedicated style tag exists to apply the big cursor URL everywhere (better than relying only on CSS vars)
function ensureOrUpdateBigCursorStyle(url) {
  const STYLE_ID = 'a11y-big-cursor-style';
  let tag = document.getElementById(STYLE_ID);
  const css = `html[data-a11y-big-cursor="true"], html[data-a11y-big-cursor="true"] * { cursor: url("${url}") 0 0, auto !important; }`;
  if (!tag) {
    tag = document.createElement('style');
    tag.id = STYLE_ID;
    tag.textContent = css;
    document.head.appendChild(tag);
  } else {
    tag.textContent = css;
  }
}

function removeBigCursorStyle() {
  const STYLE_ID = 'a11y-big-cursor-style';
  const tag = document.getElementById(STYLE_ID);
  if (tag && tag.parentNode) tag.parentNode.removeChild(tag);
}

const defaultSettings = {
  // Existing
  fontScale: 1.0, // multiplies root font-size
  reduceMotion: false,
  highlightLinks: false,
  // New
  dyslexic: false,
  letterSpacingPx: 0, // -1..4 px
  lineHeightLevel: 0, // 0..3 => normal, 1.5, 1.75, 2
  fontWeightLevel: 0, // 0..3 => 400, 500, 600, 700
  alignLeft: false,
  alignRight: false,
  contrastMode: 'default', // 'default' | 'dark' | 'light'
  saturation: 'normal', // 'normal' | 'high' | 'low'
  monochrome: false,
  bigCursor: false,
  readingGuide: false,
  // Text to speech: speaks hovered or focused content when enabled
  tts: false,
};

function clampFontScale(value) {
  // Allow between 10% and 500% (0.1 - 5.0), keep two decimals for UI
  return Math.max(0.1, Math.min(5.0, parseFloat(value.toFixed(2))));
}

function applySettingsToDocument(settings) {
  const root = document.documentElement;
  ensureA11yRuntimeStyle();

  // Root font size scaling (affects rem)
  root.style.fontSize = `${clampFontScale(settings.fontScale) * 100}%`;

  // Helper to set boolean data attributes as "true" so CSS selectors like
  // html[data-high-contrast="true"] match correctly across the site.
  const setBoolAttr = (name, isOn) => {
    if (isOn) root.setAttribute(name, 'true');
    else root.removeAttribute(name);
  };

  // Data attributes for CSS toggles
  setBoolAttr('data-reduce-motion', !!settings.reduceMotion);
  setBoolAttr('data-highlight-links', !!settings.highlightLinks);
  setBoolAttr('data-a11y-dyslexic', !!settings.dyslexic);
  setBoolAttr('data-a11y-align-left', !!settings.alignLeft);
  setBoolAttr('data-a11y-align-right', !!settings.alignRight);
  setBoolAttr('data-a11y-big-cursor', !!settings.bigCursor);
  setBoolAttr('data-a11y-reading-guide', !!settings.readingGuide);
  // Expose TTS enabled state for CSS/other scripts
  setBoolAttr('data-a11y-tts', !!settings.tts);

  // Load dyslexic font dynamically
  if (settings.dyslexic) ensureDyslexicFont();

  // Prepare big cursor asset and expose via CSS var + dedicated style for broad support
  if (settings.bigCursor) {
    const url = makeBigCursorDataUrl();
    if (url) {
      root.style.setProperty('--a11y-cursor', `url("${url}") 0 0, auto`);
      ensureOrUpdateBigCursorStyle(url);
    }
  } else {
    root.style.removeProperty('--a11y-cursor');
    removeBigCursorStyle();
  }

  // Variables for typographic adjustments
  const lineHeights = ['normal', '1.5', '1.75', '2'];
  const fontWeights = ['400', '500', '600', '700'];
  root.style.setProperty('--a11y-letter-spacing', `${settings.letterSpacingPx || 0}px`);
  root.style.setProperty('--a11y-line-height', lineHeights[settings.lineHeightLevel || 0] || 'normal');
  root.style.setProperty('--a11y-font-weight', fontWeights[settings.fontWeightLevel || 0] || 'inherit');
  // Default reading guide band height (can be adjusted in future)
  root.style.setProperty('--rg-h', '36px');

  // Also apply to body directly for better inheritance coverage
  if (document.body) {
    document.body.style.letterSpacing = `${settings.letterSpacingPx || 0}px`;
    document.body.style.lineHeight = lineHeights[settings.lineHeightLevel || 0] || 'normal';
    document.body.style.fontWeight = fontWeights[settings.fontWeightLevel || 0] || '';
    if (settings.alignLeft) document.body.style.textAlign = 'left';
    else document.body.style.textAlign = '';
  }

  // Compose filter for contrast, saturation, and monochrome
  const filters = [];
  if (settings.monochrome) filters.push('grayscale(1)');
  if (settings.saturation === 'high') filters.push('saturate(2)');
  if (settings.saturation === 'low') filters.push('saturate(0.5)');
  if (settings.contrastMode === 'dark') filters.push('contrast(1.2)', 'brightness(0.9)');
  if (settings.contrastMode === 'light') filters.push('contrast(1.2)', 'brightness(1.1)');
  const filterStr = filters.length ? filters.join(' ') : 'none';
  root.style.setProperty('--a11y-filter', filterStr);
  root.style.filter = filterStr;
}

// Lightweight speech controller to speak text content with debouncing
const Speech = (() => {
  let synth = typeof window !== 'undefined' && window.speechSynthesis ? window.speechSynthesis : null;
  let utter = null;
  let lastSpoken = 0;
  const minInterval = 600; // ms between utterances
  function speak(text) {
    if (!synth || !text) return;
    const now = Date.now();
    if (now - lastSpoken < minInterval) return; // debounce
    try {
      synth.cancel();
      utter = new SpeechSynthesisUtterance(text);
      utter.rate = 1.0;
      utter.pitch = 1.0;
      synth.speak(utter);
      lastSpoken = now;
    } catch (e) {
      // ignore speech errors
    }
  }
  function stop() { if (synth) try { synth.cancel(); } catch(e){} }
  return { speak, stop };
})();

export default function AccessibilityMenu() {
  const [open, setOpen] = useState(false);
  // We toggle a body attribute for CSS on resize instead of storing
  // a component-level `isNarrow` state to avoid extra re-renders.
  const firstInteractiveRef = useRef(null);
  // `panelRef` and `firstInteractiveRef` remain refs used for focus management
  const panelRef = useRef(null);
  const [settings, setSettings] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultSettings;
      const parsed = JSON.parse(raw);
      // Backwards compatibility: map old fields to new ones where possible
      const migrated = { ...parsed };
      if (parsed.highContrast && !parsed.contrastMode) migrated.contrastMode = 'dark';
      if (parsed.grayscale && typeof parsed.monochrome === 'undefined') migrated.monochrome = !!parsed.grayscale;
      if (parsed.lineHeight && typeof parsed.lineHeightLevel === 'undefined') migrated.lineHeightLevel = parsed.lineHeight === 'relaxed' ? 1 : 0;
      return { ...defaultSettings, ...migrated };
    } catch {
      return defaultSettings;
    }
  });

  useEffect(() => {
    applySettingsToDocument(settings);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // ignore persistence errors
    }
  }, [settings]);

  // Wire TTS listeners when tts setting changes
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return undefined;
    let lastTarget = null;
    // speak the element's accessible text: aria-label, alt, textContent trimmed
    const getTextForEl = (el) => {
      if (!el) return '';
      if (el.getAttribute && el.getAttribute('aria-label')) return el.getAttribute('aria-label');
      if (el.alt) return el.alt;
      // prefer visible text
      const txt = (el.innerText || el.textContent || '').trim();
      return txt.split('\n').join(' ').trim();
    };

    const onHover = (e) => {
      const t = e.target;
      if (!t || t === lastTarget) return;
      lastTarget = t;
      const txt = getTextForEl(t);
      if (txt && txt.length < 300) Speech.speak(txt);
    };

    const onFocus = (e) => {
      const t = e.target;
      const txt = getTextForEl(t);
      if (txt && txt.length < 800) Speech.speak(txt);
    };

    if (settings.tts) {
      window.addEventListener('mouseover', onHover, { passive: true });
      window.addEventListener('focusin', onFocus);
      // also speak when user hovers via keyboard by capturing mousemove for small moves
    } else {
      Speech.stop();
    }

    return () => {
      window.removeEventListener('mouseover', onHover);
      window.removeEventListener('focusin', onFocus);
      Speech.stop();
    };
  }, [settings.tts]);

  // Keep a simple responsive flag to help force layout changes when viewport resizes.
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const check = () => {
  const narrow = window.innerWidth < 768; // Tailwind md breakpoint ~768px
      try {
        if (narrow) document.body.setAttribute('data-accessibility-mobile', 'true');
        else document.body.removeAttribute('data-accessibility-mobile');
      } catch (e) {}
    };
    check();
    window.addEventListener('resize', check, { passive: true });
    return () => {
      try { document.body.removeAttribute('data-accessibility-mobile'); } catch(_) {}
      window.removeEventListener('resize', check);
    };
  }, []);

  // Ensure body attribute reflects panel open/closed state (keeps logo hidden while panel open)
  useEffect(() => {
    try {
      if (open) document.body.setAttribute('data-accessibility-open', 'true');
      else document.body.removeAttribute('data-accessibility-open');
    } catch (e) {}
    return () => { try { document.body.removeAttribute('data-accessibility-open'); } catch(_) {} };
  }, [open]);

  // Reading guide: move horizontal band with cursor or arrow keys
  useEffect(() => {
    if (!settings.readingGuide) return;
    const root = document.documentElement;
    let raf = 0;
    const setY = (y) => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => root.style.setProperty('--rg-y', `${y}px`));
    };
    const onMove = (e) => setY(e.clientY || (e.touches && e.touches[0]?.clientY) || window.innerHeight / 2);
    const onKey = (e) => {
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'PageUp' || e.key === 'PageDown') {
        e.preventDefault();
        const current = parseFloat(getComputedStyle(root).getPropertyValue('--rg-y')) || (window.innerHeight / 2);
        const delta = e.key === 'ArrowUp' ? -10 : e.key === 'ArrowDown' ? 10 : e.key === 'PageUp' ? -50 : 50;
        setY(Math.max(0, Math.min(window.innerHeight, current + delta)));
      }
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('keydown', onKey);
    setY(window.innerHeight / 2);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('keydown', onKey);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [settings.readingGuide]);

  useEffect(() => {
    // Close on Escape
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (!open) return;
    // Focus first button inside menu for accessibility
    const id = setTimeout(() => firstInteractiveRef.current?.focus(), 0);
    return () => clearTimeout(id);
  }, [open]);

  // Allow mobile tray to open the accessibility menu via custom event
  useEffect(() => {
    const h = () => setOpen(true);
    document.addEventListener('open-accessibility-menu', h);
    return () => document.removeEventListener('open-accessibility-menu', h);
  }, []);

  // Very small focus trap: loop focus within panel when open
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (e.key !== 'Tab') return;
      const root = panelRef.current;
      if (!root) return;
      const foci = root.querySelectorAll(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
      );
      if (foci.length === 0) return;
      const first = foci[0];
      const last = foci[foci.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open]);

  const btnCommon = 'px-2 py-1 sm:px-2 sm:py-1 rounded-md bg-gray-50 hover:bg-[#f3eefc] text-gray-900 text-[11px] sm:text-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c7b7ff] transition transform active:scale-95 border border-[#e9e5ff]';
  const switchCls = (active) => `flex items-center justify-between w-full text-left whitespace-normal break-words ${btnCommon} ${active ? 'ring-1 ring-[#c7b7ff]' : ''}`;

  const increaseFont = () => setSettings((s) => ({ ...s, fontScale: clampFontScale(s.fontScale + 0.1) }));
  const decreaseFont = () => setSettings((s) => ({ ...s, fontScale: clampFontScale(s.fontScale - 0.1) }));
  const resetFont = () => setSettings((s) => ({ ...s, fontScale: 1.0 }));

  const toggle = (key) => setSettings((s) => ({ ...s, [key]: !s[key] }));

  // Enhanced toggle for mutually exclusive alignment choices
  const toggleAlign = (dir) => setSettings((s) => {
    if (dir === 'left') return { ...s, alignLeft: !s.alignLeft, alignRight: false };
    if (dir === 'right') return { ...s, alignRight: !s.alignRight, alignLeft: false };
    return s;
  });
  const setContrast = (val) => setSettings((s) => ({ ...s, contrastMode: val }));
  const setSaturation = (val) => setSettings((s) => ({ ...s, saturation: val }));
  const inc = (key, min, max, by = 1) => setSettings((s) => ({ ...s, [key]: Math.max(min, Math.min(max, (s[key] || 0) + by)) }));

  // Note: Reset is handled inline via setSettings({ ...defaultSettings }) to avoid stale references

  // Place on the right, just above the chat widget
  return (
  <div aria-live="polite" aria-relevant="additions text" className="z-[9000] pointer-events-none">
      {/* Floating trigger button */}
      <motion.button
        type="button"
        aria-label="Accessibility options"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls="accessibility-menu-panel"
        onClick={() => setOpen((v) => !v)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.96 }}
  className="hidden md:flex fixed bottom-40 right-6 md:right-6 z-[9000] bg-gradient-to-br from-[#7c3aed] to-[#6366f1] text-white rounded-full shadow-lg hover:opacity-95 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#c7b7ff] w-14 h-14 items-center justify-center pointer-events-auto"
      >
        <A11yIcon className="w-9 h-9" />
      </motion.button>

      {/* Panel */}
      {open && (
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Accessibility menu"
          id="accessibility-menu-panel"
          className="fixed left-0 right-0 bottom-0 sm:left-auto sm:right-6 sm:bottom-48 w-full max-w-[100vw] sm:max-w-[24rem] max-h-[55vh] sm:max-h-[70vh] overflow-y-auto rounded-t-lg sm:rounded-xl bg-white text-black shadow-2xl p-1 sm:p-1 md:p-2 space-y-2 sm:space-y-2 z-[9001] pointer-events-auto box-border mx-3 sm:mx-0 min-h-0"
        >
          <div style={{ border: '2px solid rgba(99,102,241,0.18)', borderRadius: '0.875rem' }} className="p-1 sm:p-2 min-w-0">
            <div style={{ border: '2px solid #6366f1', boxShadow: '0 8px 32px 0 rgba(99,102,241,0.12), 0 1.5px 8px 0 rgba(99,102,241,0.06)', borderRadius: '0.75rem' }} className="p-3 min-w-0 text-black">
            <div className="flex items-center justify-between gap-2 min-w-0">
            <div className="flex items-center gap-2 min-w-0">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#ede9fe] to-[#efefff] border border-[#e9e5ff] flex items-center justify-center">
                  <A11yIcon className="w-5 h-5" />
                </div>
              <div>
                  <h2 className="text-sm font-semibold leading-tight" style={{ color: '#000000' }}>Accessibility</h2>
                <span className="sr-only">Adjust for better readability</span>
              </div>
            </div>
              <button onClick={() => setOpen(false)} className={btnCommon} aria-label="Close accessibility menu">✕</button>
            </div>
          </div>

          {/* Text size */}
          <div className="space-y-2">
            <div className="text-xs opacity-80">Text size</div>
            <div className="flex items-center gap-2">
              <button ref={firstInteractiveRef} onClick={decreaseFont} className={`${btnCommon} py-1.5`} aria-label="Decrease text size">A−</button>
              <button onClick={resetFont} className={`${btnCommon} py-1.5`} aria-label="Reset text size">A</button>
              <button onClick={increaseFont} className={`${btnCommon} py-1.5`} aria-label="Increase text size">A+</button>
              <div className="ml-auto text-xs opacity-80" aria-live="polite">{Math.round(settings.fontScale * 100)}%</div>
            </div>
          </div>

          <hr className="border-t-[1px] border-[#ebe8ff] my-2" />

          {/* Letter spacing */}
          <div className="space-y-2">
            <div className="text-xs opacity-80">Letter spacing</div>
            <div className="grid grid-cols-4 gap-1 sm:flex sm:items-center">
              <button onClick={() => inc('letterSpacingPx', -1, 4, -1)} className={`${btnCommon} w-full py-1.5`} aria-label="Decrease letter spacing">−</button>
              <div className="text-xs opacity-80 min-w-[3rem] text-center sm:w-auto w-full py-2 bg-gray-50 rounded" aria-live="polite">{settings.letterSpacingPx}px</div>
              <button onClick={() => inc('letterSpacingPx', -1, 4, 1)} className={`${btnCommon} w-full py-1.5`} aria-label="Increase letter spacing">+</button>
              <button onClick={() => setSettings((s)=>({ ...s, letterSpacingPx: 0 }))} className={`${btnCommon} sm:ml-auto w-full py-1.5`} aria-label="Reset letter spacing">Reset</button>
            </div>
          </div>

          {/* Line height (levels) */}
          <div className="space-y-2">
            <div className="text-xs opacity-80">Line height</div>
            <div className="grid grid-cols-4 gap-1 sm:flex sm:items-center">
              <button onClick={() => inc('lineHeightLevel', 0, 3, -1)} className={`${btnCommon} w-full py-1.5`} aria-label="Decrease line height">−</button>
              <div className="text-xs opacity-80 min-w-[3rem] text-center sm:w-auto w-full py-2 bg-gray-50 rounded" aria-live="polite">{['Normal','1.5','1.75','2'][settings.lineHeightLevel || 0]}</div>
              <button onClick={() => inc('lineHeightLevel', 0, 3, 1)} className={`${btnCommon} w-full py-1.5`} aria-label="Increase line height">+</button>
              <button onClick={() => setSettings((s)=>({ ...s, lineHeightLevel: 0 }))} className={`${btnCommon} sm:ml-auto w-full py-1.5`} aria-label="Reset line height">Reset</button>
            </div>
          </div>

          {/* Font weight */}
          <div className="space-y-2">
            <div className="text-xs opacity-80">Font weight</div>
            <div className="grid grid-cols-4 gap-1 sm:flex sm:items-center">
              <button onClick={() => inc('fontWeightLevel', 0, 3, -1)} className={`${btnCommon} w-full py-1.5`} aria-label="Decrease font weight">−</button>
              <div className="text-xs opacity-80 min-w-[3rem] text-center sm:w-auto w-full py-2 bg-gray-50 rounded" aria-live="polite">{['400','500','600','700'][settings.fontWeightLevel || 0]}</div>
              <button onClick={() => inc('fontWeightLevel', 0, 3, 1)} className={`${btnCommon} w-full py-1.5`} aria-label="Increase font weight">+</button>
              <button onClick={() => setSettings((s)=>({ ...s, fontWeightLevel: 0 }))} className={`${btnCommon} sm:ml-auto w-full py-1.5`} aria-label="Reset font weight">Reset</button>
            </div>
          </div>

          {/* Toggles */}
          <div className="space-y-2">
            <div className="text-xs opacity-80">Contrast</div>
            <div className="grid grid-cols-3 gap-2">
            {/* Contrast: Default / Dark / Light */}
              <button onClick={() => setContrast('default')} className={`${switchCls(settings.contrastMode === 'default')} min-h-[2rem] sm:min-h-[2.25rem]`} aria-pressed={settings.contrastMode === 'default'}>
                <span className="flex items-center gap-2 whitespace-normal"><FiSun className="text-[#6d28d9] opacity-95 flex-shrink-0" /> <span>Default</span></span>
              </button>
              <button onClick={() => setContrast('dark')} className={`${switchCls(settings.contrastMode === 'dark')} min-h-[2rem] sm:min-h-[2.25rem]`} aria-pressed={settings.contrastMode === 'dark'}>
                <span className="flex items-center gap-2 whitespace-normal"><FiSun className="text-[#6d28d9] opacity-95 flex-shrink-0" /> <span>Dark</span></span>
              </button>
              <button onClick={() => setContrast('light')} className={`${switchCls(settings.contrastMode === 'light')} min-h-[2rem] sm:min-h-[2.25rem]`} aria-pressed={settings.contrastMode === 'light'}>
                <span className="flex items-center gap-2 whitespace-normal"><FiSun className="text-[#6d28d9] opacity-95 flex-shrink-0" /> <span>Light</span></span>
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-xs opacity-80">Saturation</div>
            <div className="grid grid-cols-3 gap-2">
              <button onClick={() => setSaturation('normal')} className={`${switchCls(settings.saturation === 'normal')} min-h-[2rem] sm:min-h-[2.25rem]`} aria-pressed={settings.saturation === 'normal'}>
                <span className="flex items-center gap-2 whitespace-normal"><FiDroplet className="text-[#6d28d9] opacity-95 flex-shrink-0" /> <span>Normal</span></span>
              </button>
              <button onClick={() => setSaturation('high')} className={`${switchCls(settings.saturation === 'high')} min-h-[2rem] sm:min-h-[2.25rem]`} aria-pressed={settings.saturation === 'high'}>
                <span className="flex items-center gap-2 whitespace-normal"><FiDroplet className="text-[#6d28d9] opacity-95 flex-shrink-0" /> <span>High</span></span>
              </button>
              <button onClick={() => setSaturation('low')} className={`${switchCls(settings.saturation === 'low')} min-h-[2rem] sm:min-h-[2.25rem]`} aria-pressed={settings.saturation === 'low'}>
                <span className="flex items-center gap-2 whitespace-normal"><FiDroplet className="text-[#6d28d9] opacity-95 flex-shrink-0" /> <span>Low</span></span>
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-xs opacity-80">Display</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {/* Monochrome */}
              <button onClick={() => toggle('monochrome')} className={`${switchCls(settings.monochrome)} min-h-[2rem] sm:min-h-[2.5rem]`} aria-pressed={settings.monochrome}>
                <span className="flex items-center gap-2 whitespace-normal"><FiDroplet className="text-[#6d28d9] opacity-95 flex-shrink-0" /> <span>Monochrome</span></span>
              </button>
              {/* Align Left */}
              <button onClick={() => toggleAlign('left')} className={`${switchCls(settings.alignLeft)} min-h-[2rem] sm:min-h-[2.5rem]`} aria-pressed={settings.alignLeft}>
                <span className="flex items-center gap-2 whitespace-normal"><span className="text-[#6d28d9] flex-shrink-0">↤</span> <span>Align left</span></span>
              </button>
              {/* Align Right */}
              <button onClick={() => toggleAlign('right')} className={`${switchCls(settings.alignRight)} min-h-[2rem] sm:min-h-[2.5rem]`} aria-pressed={settings.alignRight}>
                <span className="flex items-center gap-2 whitespace-normal"><span className="text-[#6d28d9] flex-shrink-0">↦</span> <span>Align right</span></span>
              </button>
              {/* Reading guide */}
              <button onClick={() => toggle('readingGuide')} className={`${switchCls(settings.readingGuide)} min-h-[2rem] sm:min-h-[2.5rem]`} aria-pressed={settings.readingGuide} aria-label="Toggle reading guide (horizontal reading ruler)">
                <span className="flex items-center gap-2 whitespace-normal"><FiBookOpen className="text-[#6d28d9] opacity-95 flex-shrink-0" /> <span>Reading guide</span></span>
              </button>
              {/* Dyslexic font */}
              <button onClick={() => toggle('dyslexic')} className={`${switchCls(settings.dyslexic)} min-h-[2rem] sm:min-h-[2.5rem]`} aria-pressed={settings.dyslexic}>
                <span className="flex items-center gap-2 whitespace-normal"><FiType className="text-[#6d28d9] opacity-95 flex-shrink-0" /> <span>Dyslexic font</span></span>
              </button>
              {/* Reduce motion (Stop animations) */}
              <button onClick={() => toggle('reduceMotion')} className={`${switchCls(settings.reduceMotion)} min-h-[2rem] sm:min-h-[2.5rem]`} aria-pressed={settings.reduceMotion}>
                <span className="flex items-center gap-2 whitespace-normal"><FiZapOff className="text-[#6d28d9] opacity-95 flex-shrink-0" /> <span>Stop animations</span></span>
              </button>
              {/* Big cursor */}
              <button onClick={() => toggle('bigCursor')} className={`${switchCls(settings.bigCursor)} min-h-[2rem] sm:min-h-[2.5rem]`} aria-pressed={settings.bigCursor}>
                <span className="flex items-center gap-2 whitespace-normal"><span className="text-[#6d28d9] flex-shrink-0">🖱️</span> <span>Big cursor</span></span>
              </button>
              {/* Optional: Highlight links retained */}
              <button onClick={() => toggle('highlightLinks')} className={`${switchCls(settings.highlightLinks)} min-h-[2rem] sm:min-h-[2.5rem]`} aria-pressed={settings.highlightLinks}>
                <span className="flex items-center gap-2 whitespace-normal"><FiLink className="text-[#6d28d9] opacity-95 flex-shrink-0" /> <span>Highlight links</span></span>
              </button>
              {/* Text-to-speech */}
              <button onClick={() => toggle('tts')} className={`${switchCls(settings.tts)} min-h-[2rem] sm:min-h-[2.5rem]`} aria-pressed={settings.tts} aria-label="Toggle text to speech">
                <span className="flex items-center gap-2 whitespace-normal"><span className="text-[#6d28d9] flex-shrink-0">🔊</span> <span>Text to speech</span></span>
              </button>
            </div>
          </div>

          <div className="pt-1 flex items-center justify-between gap-2">
            <button onClick={() => setSettings({ ...defaultSettings })} className={`${btnCommon} w-full py-2`} aria-label="Reset accessibility settings">Reset</button>
            <button onClick={() => setOpen(false)} className={`${btnCommon} w-full py-2`} aria-label="Done and close">Done</button>
          </div>

          <p className="text-[10px] opacity-60 mt-1">Settings are saved on this device.</p>
        </div>
      </div>
      )}
    </div>
  );
}
