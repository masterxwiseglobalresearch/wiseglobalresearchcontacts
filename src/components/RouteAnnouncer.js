import React, { useEffect, useRef, useState, useCallback } from 'react';
import { FaVolumeUp, FaPause, FaPlay, FaStop, FaBell } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import { FiX } from 'react-icons/fi';

// --- CONSTANTS ---
const ROUTE_ANNOUNCEMENT_DELAY = 150;
const LANGUAGE_AUTO_OVERRIDE_COOLDOWN = 5000;
const SPEECH_SYNTHESIS_ERROR_COOLDOWN = 10000;
const SPEECH_SYNTHESIS_MAX_ERRORS = 3;
const GOOGLE_TRANSLATE_POLL_INTERVAL = 1000;
const SPEECH_QUEUE_INTERVAL = 80;
const READ_ALL_START_DELAY = 500;
const BEEP_OSC_FREQUENCY = 880;
const BEEP_DURATION = 0.2;
const BEEP_VOLUME_RAMP_UP_TIME = 0.01;
const BEEP_VOLUME_RAMP_DOWN_TIME = 0.18;
const BEEP_DISABLE_DELAY = 120;


// --- HELPER HOOKS ---

/**
 * A custom hook to manage state that is persisted in localStorage.
 * @param {string} key The localStorage key.
 * @param {*} defaultValue The default value if the key is not in localStorage.
 * @returns {[*, function]} A state and a function to update it.
 */
function useLocalStorage(key, defaultValue) {
  const [value, setValue] = useState(() => {
    if (typeof window === 'undefined') return defaultValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading localStorage key “${key}”:`, error);
      return defaultValue;
    }
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.error(`Error setting localStorage key “${key}”:`, error);
      }
    }
  }, [key, value]);

  return [value, setValue];
}

/**
 * A custom hook to encapsulate speech synthesis logic.
 */
function useSpeechSynthesis({ lang, rate, pitch, voiceName, synthErrorCountRef, lastSynthErrorAtRef }) {
  const [voices, setVoices] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const utteranceRef = useRef([]);

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const loadVoices = () => {
      try {
        const vs = window.speechSynthesis.getVoices() || [];
        setVoices(vs);
      } catch (e) {
        setVoices([]);
      }
    };
    loadVoices();
    if (window.speechSynthesis) window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  const pause = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis.speaking) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  const speak = useCallback((text, { onstart, onend, onerror } = {}) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window) || !text) return null;
    try {
      const utter = new SpeechSynthesisUtterance(text);
      utter.rate = pitch || 1; // note: using pitch variable for compatibility; outer code uses rate/pitch
      utter.pitch = pitch || 1;
      // try to pick matching voice if voiceName provided
      if (voiceName && voices && voices.length) {
        const v = voices.find(vv => vv.name === voiceName);
        if (v) utter.voice = v;
      }
      utter.onstart = (e) => {
        setIsSpeaking(true);
        setIsPaused(false);
        if (typeof onstart === 'function') onstart(e);
      };
      utter.onend = (e) => {
        setIsSpeaking(false);
        setIsPaused(false);
        if (typeof onend === 'function') onend(e);
      };
      utter.onerror = (e) => {
        setIsSpeaking(false);
        setIsPaused(false);
        if (typeof onerror === 'function') onerror(e);
      };
      utteranceRef.current.push(utter);
      window.speechSynthesis.speak(utter);
      return utter;
    } catch (err) {
      if (typeof onerror === 'function') onerror(err);
      return null;
    }
  }, [voices, voiceName, pitch]);

  const resume = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    }
  };

  const cancel = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setIsPaused(false);
  };

  return { speak, pause, resume, cancel, voices, isSpeaking, isPaused };
}

// --- HELPER FUNCTIONS ---

const deriveFromPath = (p) => {
  let clean = p || '';
  while (clean.startsWith('/')) clean = clean.slice(1);
  while (clean.endsWith('/')) clean = clean.slice(0, -1);
  if (!clean) return 'Home';
  return clean
    .split('/')
    .map((seg) => seg.split(/[-_]+/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '))
    .join(' · ');
};

const getAnnouncementMessage = (lang, pathname) => {
  const title = (typeof document !== 'undefined' && document.title) ? document.title : '';
  const baseLabel = title || `${deriveFromPath(pathname)} page`;
  if (lang === 'hi') return `आप अभी ${baseLabel} पर हैं।`;
  return `You are now on ${baseLabel}.`;
};


// --- MAIN COMPONENT ---

export default function RouteAnnouncer() {
  const { pathname } = useLocation();
  // Admin path detection: don't show floating controls on any admin pages
  const isAdminPath = (() => {
    if (!pathname) return false;
    const p = pathname.toLowerCase();
    return p === '/admin' || p.startsWith('/admin/') || p.includes('/admin-panel') || p.includes('/wp-admin');
  })();
  
  const [message, setMessage] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [accessibilityOpen, setAccessibilityOpen] = useState(() => {
    if (typeof document === 'undefined') return false;
    return document.body && document.body.getAttribute('data-accessibility-open') === 'true';
  });

  const [lang, setLang] = useLocalStorage('route.lang', 'en');
  const [voiceEnabled, setVoiceEnabled] = useLocalStorage('route.voice', false);
  const [beepEnabled, setBeepEnabled] = useLocalStorage('route.beep', false);
  const [manualLangSelection, setManualLangSelection] = useLocalStorage('route.langManual', false);
  const [rate, setRate] = useLocalStorage('route.rate', 1);
  const [pitch, setPitch] = useLocalStorage('route.pitch', 1);
  const [voiceName, setVoiceName] = useLocalStorage('route.voiceName', '');

  const synthErrorCountRef = useRef(0);
  const lastSynthErrorAtRef = useRef(0);
  const manualLangChangeAtRef = useRef(0);

  const voiceEnabledRef = useRef(voiceEnabled);
  useEffect(() => { voiceEnabledRef.current = voiceEnabled; }, [voiceEnabled]);

  const beepEnabledRef = useRef(beepEnabled);
  useEffect(() => { beepEnabledRef.current = beepEnabled; }, [beepEnabled]);

  const { speak, pause, resume, cancel, isSpeaking, isPaused, voices } = useSpeechSynthesis({ lang, rate, pitch, voiceName, synthErrorCountRef, lastSynthErrorAtRef });

  const immediateSpeak = useCallback((text, utterLang, voice = null) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (synthErrorCountRef.current > SPEECH_SYNTHESIS_MAX_ERRORS && (Date.now() - (lastSynthErrorAtRef.current || 0)) < SPEECH_SYNTHESIS_ERROR_COOLDOWN) {
      return;
    }
    try {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = utterLang === 'hi' ? 'hi-IN' : 'en-US';
      u.rate = rate || 1;
      u.pitch = pitch || 1;
      if (voice) {
        u.voice = voice;
      }
      window.speechSynthesis.speak(u);
    } catch (e) {
      console.error('immediateSpeak failed', e);
    }
  }, [rate, pitch]);

  const readGoogleTranslateCookie = useCallback(() => {
    if (typeof document === 'undefined') return null;
    const cookies = document.cookie.split(';').map(c => c.trim());
    const raw = cookies.find(c => c.startsWith('googtrans=')) || cookies.find(c => c.startsWith('_googtrans='));
    if (!raw) return null;
    const val = decodeURIComponent((raw.split('=')[1] || '').trim());
    const parts = val.split('/').filter(Boolean);
    const last = parts.length ? parts[parts.length - 1] : (val || '').trim();
    if (!last) return null;
    return last;
  }, []);

  const langRef = useRef(lang);
  useEffect(() => { langRef.current = lang; }, [lang]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mapToSimple = (g) => {
      if (!g) return null;
      const code = g.toLowerCase();
      if (code.includes('hi')) return 'hi';
      if (code.includes('en')) return 'en';
      return null;
    };

    const check = () => {
      const g = readGoogleTranslateCookie();
      if (!g) return;
      const mapped = mapToSimple(g);
      if (mapped && mapped !== langRef.current) {
        if (manualLangSelection) return;
        const sinceManual = Date.now() - (manualLangChangeAtRef.current || 0);
        if (sinceManual < LANGUAGE_AUTO_OVERRIDE_COOLDOWN) return;
        setLang(mapped);
        langRef.current = mapped;
        if (voiceEnabledRef.current) {
          if (mapped === 'hi') immediateSpeak('भाषा अब हिंदी पर है', 'hi');
          else immediateSpeak('Language switched to English', 'en');
        }
      }
    };

    const id = setInterval(check, GOOGLE_TRANSLATE_POLL_INTERVAL);
    check();
    return () => clearInterval(id);
  }, [readGoogleTranslateCookie, immediateSpeak, setLang, manualLangSelection]);

  const readingQueueRef = useRef([]);
  const [isReadingAll, setIsReadingAll] = useState(false);
  const beepCtxRef = useRef(null);
  const userGestureRef = useRef(false);
  const beepPendingRef = useRef(false);

  const playBeep = useCallback(() => {
    if (typeof window === 'undefined') return;
    try {
      if (!beepCtxRef.current) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return;
        try {
          beepCtxRef.current = new AC();
        } catch (err) {
          console.warn('AudioContext creation blocked', err);
          beepPendingRef.current = true;
          return;
        }
      }
      const ctx = beepCtxRef.current;
      if (ctx.state === 'suspended' && !userGestureRef.current) {
        beepPendingRef.current = true;
        return;
      }
      if (ctx.state === 'suspended' && userGestureRef.current) {
        try { ctx.resume(); } catch(_) {}
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = BEEP_OSC_FREQUENCY;
      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + BEEP_VOLUME_RAMP_UP_TIME);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + BEEP_VOLUME_RAMP_DOWN_TIME);
      osc.connect(gain).connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + BEEP_DURATION);
    } catch(e) {
      console.error("Beep failed.", e);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      const finalMsg = getAnnouncementMessage(lang, pathname);
      setMessage(finalMsg);

      if (voiceEnabledRef.current) {
        speak(finalMsg);
      }

      if (beepEnabledRef.current) {
        playBeep();
      }
    }, ROUTE_ANNOUNCEMENT_DELAY);

    return () => clearTimeout(timer);
  }, [pathname, lang, speak, playBeep]);

  // Close the floating panel when the route changes (unless user re-opened it)
  useEffect(() => {
    // When navigation happens, hide the menu so it doesn't overlay other screens.
    setMenuOpen(false);
  // Ensure the floating menu is closed on navigation.
  }, [pathname]);

  // Helper to mark that a user gesture occurred and flush any pending audio actions.
  // We keep a stable function via ref so effects can safely reference it without
  // triggering redeclaration/use-before-define issues.
  const markUserGestureAndFlushRef = useRef(null);
  if (!markUserGestureAndFlushRef.current) {
    markUserGestureAndFlushRef.current = () => {
      // mark that a user gesture occurred. Audio resume/creation must happen
      // inside a user gesture — handlers that receive click/touch should call
      // tryInitOrResumeAudio directly. This ref only records the gesture.
      userGestureRef.current = true;
    };
  }
  const markUserGestureAndFlush = markUserGestureAndFlushRef.current;

  // Helper to create or resume AudioContext inside a user gesture. Safe to call
  // from click/touch handlers — it will attempt to create/resume and set
  // beepPendingRef if creation is blocked.
  const tryInitOrResumeAudio = useCallback(() => {
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return false;
      if (!beepCtxRef.current) {
        try {
          beepCtxRef.current = new AC();
        } catch (err) {
          // creation blocked
          beepPendingRef.current = true;
          return false;
        }
      }
      const ctx = beepCtxRef.current;
      if (ctx && ctx.state === 'suspended' && typeof ctx.resume === 'function') {
        try { ctx.resume(); } catch (err) { /* may still be blocked */ }
      }
      // If we resumed and had pending beep, play it now
      if (beepPendingRef.current) {
        try { playBeep(); } catch(_) {}
        beepPendingRef.current = false;
      }
      return true;
    } catch (_) {
      return false;
    }
  }, [playBeep]);

  // Listen for external 'open-speaker-panel' events (dispatched by other controls)
  // so the panel opens when mobile/floating buttons dispatch the event.
  const panelRef = useRef(null);
  useEffect(() => {
    // The 'open-speaker-panel' event may be dispatched programmatically and
    // therefore is not guaranteed to be a user gesture. Creating or resuming
    // an AudioContext here can trigger the browser autoplay policy error
    // "The AudioContext was not allowed to start...". To avoid that, keep
    // audio init/resume only inside actual user gesture handlers (see the
    // touchstart/click first-touch listeners below that call
    // tryInitOrResumeAudio()). Here we only open the panel and set focus.
    if (typeof document === 'undefined') return undefined;
    const onOpen = (e) => {
      setMenuOpen(true);
      // focus the panel for keyboard users (if available)
      try { if (panelRef.current && typeof panelRef.current.focus === 'function') panelRef.current.focus(); } catch(_) {}
    };

    document.addEventListener('open-speaker-panel', onOpen);
    if (window && window.addEventListener) window.addEventListener('open-speaker-panel', onOpen);
    return () => {
      try { document.removeEventListener('open-speaker-panel', onOpen); } catch(_) {}
      try { if (window && window.removeEventListener) window.removeEventListener('open-speaker-panel', onOpen); } catch(_) {}
    };
  }, []);

  // Observe accessibility open flag so we don't render floating controls when AccessibilityMenu is active
  useEffect(() => {
    if (typeof document === 'undefined') return undefined;
    const body = document.body;
    const update = () => setAccessibilityOpen(body.getAttribute('data-accessibility-open') === 'true');
    update();
    const mo = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === 'attributes' && m.attributeName === 'data-accessibility-open') {
          update();
        }
      }
    });
    mo.observe(body, { attributes: true });
  }, []);

  // Close on Escape key when menu is open
  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  // Mobile tray opener for speaker panel
  useEffect(() => {
    // Mobile/first-touch: add listeners so we can mark a user gesture and resume audio contexts.
    // Note: we intentionally DO NOT auto-open the panel via custom events. The panel must open
    // only when the user clicks/taps the button.
    const onFirstTouch = (e) => {
      try {
          // We must create/resume AudioContext inside this user gesture
          tryInitOrResumeAudio();
          markUserGestureAndFlush();
      } catch (_) {}
      // remove after first use
      try { document.removeEventListener('touchstart', onFirstTouch); } catch(_) {}
      try { document.removeEventListener('click', onFirstTouch); } catch(_) {}
    };
    // use non-passive listeners so this handler runs as an active user gesture
    document.addEventListener('touchstart', onFirstTouch, { passive: false });
    document.addEventListener('click', onFirstTouch, { passive: false });

    return () => {
      document.removeEventListener('touchstart', onFirstTouch);
      document.removeEventListener('click', onFirstTouch);
    };
  }, [markUserGestureAndFlush, tryInitOrResumeAudio]);

  // Add a body attribute while the panel is open so global CSS can hide page logo
  useEffect(() => {
    try {
      if (menuOpen) {
        document.body.setAttribute('data-route-announcer-open', 'true');
      } else {
        document.body.removeAttribute('data-route-announcer-open');
      }
    } catch (e) {
      // ignore server-side or restricted envs
    }
    return () => {
      try { document.body.removeAttribute('data-route-announcer-open'); } catch(_) {}
    };
  }, [menuOpen]);

  const playNextInQueue = useCallback(() => {
    if (readingQueueRef.current.length === 0) {
      setIsReadingAll(false);
      return;
    }
    const nextText = readingQueueRef.current.shift();
    speak(nextText, {
      onend: () => {
        if (readingQueueRef.current.length > 0) {
          setTimeout(playNextInQueue, SPEECH_QUEUE_INTERVAL);
        } else {
          setIsReadingAll(false);
        }
      },
      onerror: (err) => {
        // Don't kill the whole reading session on transient errors (e.g., 'interrupted').
        console.warn('Error speaking item — skipping to next.', err);
        if (readingQueueRef.current.length > 0) {
          setTimeout(playNextInQueue, SPEECH_QUEUE_INTERVAL);
        } else {
          setIsReadingAll(false);
        }
      }
    });
  }, [speak]);

  const startReading = useCallback(() => {
    if (typeof document === 'undefined') return;
    cancel(); 
    const selectors = ['main', '[role="main"]', 'article', 'section'];
    const container = selectors.map(s => document.querySelector(s)).find(el => el) || document.body;
  const texts = ((container && (container.innerText || container.textContent)) || '').trim();
    const items = texts.split(/\r?\n|[.?!]+/).map(s => s.trim()).filter(s => s.length > 3);

    readingQueueRef.current = items;
    setIsReadingAll(true);

    const startMsg = lang === 'hi' ? 'पेज पढ़ना शुरू हो रहा है।' : 'Starting to read the page.';
    speak(startMsg, { onend: () => setTimeout(playNextInQueue, READ_ALL_START_DELAY) });

  }, [playNextInQueue, speak, cancel, lang]);

  const stopReading = useCallback(() => {
    readingQueueRef.current = [];
    cancel();
    setIsReadingAll(false);
  }, [cancel]);




  // ...existing code...

  const visuallyHiddenStyle = { position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', whiteSpace: 'nowrap', border: 0 };
  
  const baseButtonStyle = {
    padding: '0.5rem 0.75rem',
    fontSize: '14px',
    borderRadius: '8px',
    border: '1px solid #e9e5ff',
    background: '#ffffff',
    color: '#000000',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'background-color 0.2s, border-color 0.2s',
  };

  // Small floating button style for the Route Announcer toggle
  const labelRef = useRef(null);
  const iconRef = useRef(null);

  const handleRouteAnnouncerToggle = () => {
    markUserGestureAndFlush();
    setMenuOpen(m => !m);
  };

  // Pulse / attention: small state to control pulse effect
  const [pulse, setPulse] = useState(false);
  // Peek state: when true, the button remains partially visible (small peek) and icon is shown
  const [peek, setPeek] = useState(false);

  // Hide the route announcer on small screens (mobile)
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const mq = window.matchMedia('(max-width: 768px)');
    const onChange = () => setIsMobile(mq.matches);
    onChange();
    if (mq.addEventListener) mq.addEventListener('change', onChange);
    else mq.addListener(onChange);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', onChange);
      else mq.removeListener(onChange);
    };
  }, []);



  // Small floating button style for the Route Announcer toggle
  const routeAnnouncerButtonStyle = {
    position: 'fixed',
    top: '50%',
  // default: half-hidden (approx half of 44px width = 22px outside)
  right: peek ? '-8px' : '-22px',
    transform: 'translateY(-50%)',
    zIndex: 9003,
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 14px',
    height: '56px',
    borderRadius: '12px',
  background: 'linear-gradient(135deg,#6366f1 100%,#6366f1 100%)',
    color: '#6366f1',
    fontWeight: 700,
    cursor: 'pointer',
    boxShadow: '0 6px 18px rgba(2,6,23,0.18)',
    border: 'none',
    transition: 'right 200ms ease, width 200ms ease, transform 160ms ease, box-shadow 160ms ease, background-color 160ms ease',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    width: '44px',
  };

  // One-time-per-session: briefly highlight the button (pulse) and then collapse to 'peek'
  // Note: do NOT auto-open the full menu on page load/refresh — this caused the menu to appear unexpectedly.
  useEffect(() => {
    try {
      const seen = sessionStorage.getItem('routeAnnouncerSeen');
      if (!seen) {
        try { sessionStorage.setItem('routeAnnouncerSeen', '1'); } catch(_) {}
        // Pulse for attention but keep menu closed
        setPulse(true);
        const el = document.querySelector('[aria-label="Route Announcer"]');
        if (el) {
          try { el.style.width = '200px'; el.style.transform = 'translateY(-50%) scale(1.03)'; el.style.boxShadow = '0 12px 34px rgba(2,6,23,0.26)'; } catch(_) {}
        }
        const t = setTimeout(() => {
          // after 4s, collapse but leave a small peek visible and show icon
          // ensure menu remains closed
          setMenuOpen(false);
          setPeek(true);
          setPulse(false);
          try {
            if (el) {
              el.style.width = '56px';
              el.style.right = '-8px';
              el.style.transform = 'translateY(-50%) scale(1)';
              el.style.boxShadow = '0 6px 18px rgba(2,6,23,0.18)';
            }
            if (iconRef.current) iconRef.current.style.opacity = '1';
          } catch(_) {}
        }, 4000);
        return () => clearTimeout(t);
      }
    } catch (_) {}
  }, []);

  // Inject keyframes for pulse if not present and respect prefers-reduced-motion
  useEffect(() => {
    try {
      if (typeof window === 'undefined' || typeof document === 'undefined') return;
      if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      if (document.getElementById('ra-pulse-styles')) return;
      const style = document.createElement('style');
      style.id = 'ra-pulse-styles';
  style.innerHTML = `@keyframes ra-pulse { 0% { transform: translateY(-50%) scale(1); box-shadow: 0 6px 18px rgba(2,6,23,0.18); } 50% { transform: translateY(-50%) scale(1.03); box-shadow: 0 12px 30px rgba(2,6,23,0.22); } 100% { transform: translateY(-50%) scale(1); box-shadow: 0 6px 18px rgba(2,6,23,0.18); } } @keyframes ra-peek { 0% { right: -40px; } 50% { right: -2px; } 100% { right: -40px; } }`;
      document.head.appendChild(style);
    } catch (_) {}
  }, []);

  // When opened on mobile, focus the panel so keyboard users land inside and
  // resume any audio contexts safely after the user gesture that opened it.
  useEffect(() => {
    try {
      if (isMobile && menuOpen && panelRef.current && typeof panelRef.current.focus === 'function') {
        panelRef.current.focus();
      }
    } catch (_) {}
  }, [isMobile, menuOpen]);

  // When the panel opens on mobile as a result of a user gesture, speak the announcement
  useEffect(() => {
    if (!menuOpen || !isMobile) return;
    try {
      const finalMsg = getAnnouncementMessage(lang, pathname);
      if (typeof window !== 'undefined' && voiceEnabledRef.current) {
        // speak respects selected voice/rate/pitch
        speak(finalMsg);
      }
      if (beepEnabledRef.current) {
        playBeep();
      }
    } catch (_) {}
  }, [menuOpen, isMobile, lang, pathname, speak, playBeep]);

  // do not render the floating toggle on small/mobile screens (keep component mounted so it can
  // listen for open-speaker-panel and user-gesture events dispatched by MobileActionTray)

  return (
    <div>
      <div aria-live="polite" aria-atomic="true" style={visuallyHiddenStyle}>{message}</div>
      {menuOpen && isMobile && (
        <div aria-hidden="true" onClick={() => setMenuOpen(false)} style={{position: 'fixed', inset: 0, background: 'rgba(2,6,23,0.35)', zIndex: 9000}} />
      )}
      {menuOpen && (
        <div
          ref={panelRef}
          tabIndex={-1}
          className="route-announcer-panel"
          role="dialog"
          aria-label={lang==='hi' ? 'स्पीकर आइकन पैनल' : 'Speaker icon panel'}
          onMouseEnter={() => setMenuOpen(true)}
          onMouseLeave={() => setMenuOpen(false)}
            style={ isMobile ? {
              position: 'fixed',
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 9001,
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              padding: '0.5rem',
              borderRadius: '12px 12px 0 0',
              boxShadow: '0 -12px 34px rgba(99,102,241,0.12)',
              alignItems: 'center',
              background: '#fff',
              borderTop: '1px solid rgba(99,102,241,0.08)',
              backdropFilter: 'blur(6px)',
              minWidth: '100%',
              maxWidth: '100%',
              height: '48vh',
              overflow: 'auto',
            } : {
              position: 'fixed',
              // place panel above the button and aligned with accessibility panel
              bottom: '288px',
              right: '24px',
              zIndex: 9001,
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              padding: '0.15rem',
              borderRadius: '12px',
              boxShadow: '0 12px 34px rgba(99,102,241,0.08)',
              alignItems: 'center',
              background: '#fff',
              border: '1px solid rgba(99,102,241,0.06)',
              backdropFilter: 'blur(6px)',
              minWidth: '140px',
              maxWidth: '220px',
            }}
        >
          {/* inner purple-bordered card to match AccessibilityMenu */}
          <div style={{width: '100%', boxSizing: 'border-box', borderRadius: '10px', padding: isMobile ? '10px' : '8px', background: '#fff', border: '2px solid #6366f1', boxShadow: '0 12px 34px rgba(99,102,241,0.08)'}}>
            <button
              type="button"
              aria-label={lang==='hi' ? 'बंद करें' : 'Close'}
              onClick={() => { setMenuOpen(false); }}
              style={{
                position: 'absolute',
                top: isMobile ? '10px' : '-10px',
                right: isMobile ? '12px' : '-10px',
                width: isMobile ? '36px' : '28px',
                height: isMobile ? '36px' : '28px',
                borderRadius: '9999px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#ffffff',
                border: '1px solid #e6e6e6',
                boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                cursor: 'pointer',
                zIndex: 9002
              }}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { setMenuOpen(false); } }}
            >
              <FiX aria-hidden="true" style={{color: '#6366f1'}} />
            </button>
          <button
            type="button"
            aria-pressed={voiceEnabled}
            onClick={() => {
              markUserGestureAndFlush();
              const next = !voiceEnabled;
              setVoiceEnabled(next);
              if (next) {
                speak(lang === 'hi' ? 'आवाज़ चालू हो गई' : 'Voice turned on');
              } else {
                cancel();
              }
            }}
            title={lang==='hi' ? (voiceEnabled ? 'आवाज़ बंद करें' : 'आवाज़ चालू करें') : (voiceEnabled ? 'Voice Off' : 'Voice On')}
            aria-label={lang==='hi' ? (voiceEnabled ? 'आवाज़ बंद करें' : 'आवाज़ चालू करें') : (voiceEnabled ? 'Voice Off' : 'Voice On')}
            style={{...baseButtonStyle, width: isMobile ? '44px' : '36px', height: isMobile ? '44px' : '36px', borderRadius: '8px', justifyContent: 'center', background: '#f3f4f6'}}
            onMouseEnter={(e)=> { e.currentTarget.style.transform = 'scale(1.08)'; e.currentTarget.style.background = '#e6e9ee'; }}
            onMouseLeave={(e)=> { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.background = '#f3f4f6'; }}
          >
            <FaVolumeUp aria-hidden="true" style={{color: '#6366f1'}} />
          </button>

          <button
            type="button"
            aria-pressed={beepEnabled}
            onClick={() => {
              markUserGestureAndFlush();
              const next = !beepEnabled;
              setBeepEnabled(next);
              if (next) {
                try { playBeep(); } catch(_) {}
              } else {
                try { playBeep(); setTimeout(playBeep, BEEP_DISABLE_DELAY); } catch(_) {}
              }
            }}
            title={lang==='hi' ? (beepEnabled ? 'बीप बंद करें' : 'बीप चालू करें') : (beepEnabled ? 'Beep Off' : 'Beep On')}
            aria-label={lang==='hi' ? (beepEnabled ? 'बीप बंद करें' : 'बीप चालू करें') : (beepEnabled ? 'Beep Off' : 'Beep On')}
            style={{...baseButtonStyle, width: isMobile ? '44px' : '36px', height: isMobile ? '44px' : '36px', borderRadius: '8px', justifyContent: 'center', background: '#f3f4f6'}}
            onMouseEnter={(e)=> { e.currentTarget.style.transform = 'scale(1.08)'; e.currentTarget.style.background = '#e6e9ee'; }}
            onMouseLeave={(e)=> { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.background = '#f3f4f6'; }}
          >
            <FaBell aria-hidden="true" style={{color: '#6366f1'}} />
          </button>

          <button
            type="button"
            onClick={()=> isReadingAll ? stopReading() : startReading()}
            title={lang==='hi' ? (isReadingAll ? 'रोकें' : 'पूरा पढ़ें') : (isReadingAll ? 'Stop' : 'Read All')}
            aria-label={lang==='hi' ? (isReadingAll ? 'रोकें' : 'पूरा पढ़ें') : (isReadingAll ? 'Stop' : 'Read All')}
            style={{...baseButtonStyle, width: isMobile ? '44px' : '36px', height: isMobile ? '44px' : '36px', borderRadius: '8px', justifyContent: 'center', background: '#f3f4f6'}}
            onMouseEnter={(e)=> { e.currentTarget.style.transform = 'scale(1.08)'; e.currentTarget.style.background = '#e6e9ee'; }}
            onMouseLeave={(e)=> { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.background = '#f3f4f6'; }}
          >
            {isReadingAll ? <FaStop aria-hidden="true" style={{color: '#6366f1'}} /> : <FaPlay aria-hidden="true" style={{color: '#6366f1'}} />}
          </button>

          <button
            type="button"
            onClick={() => { markUserGestureAndFlush(); pause(); }}
            disabled={!isSpeaking || isPaused}
            title={lang==='hi' ? 'ठहरें' : 'Pause'}
            aria-label={lang==='hi' ? 'ठहरें' : 'Pause'}
            style={{...baseButtonStyle, width: isMobile ? '44px' : '36px', height: isMobile ? '44px' : '36px', borderRadius: '8px', justifyContent: 'center', background: '#f3f4f6'}}
          >
            <FaPause aria-hidden="true" style={{color: '#6366f1'}} />
          </button>

          <button
            type="button"
            onClick={() => { markUserGestureAndFlush(); resume(); }}
            disabled={!isSpeaking || !isPaused}
            title={lang==='hi' ? 'जारी रखें' : 'Resume'}
            aria-label={lang==='hi' ? 'जारी रखें' : 'Resume'}
            style={{...baseButtonStyle, width: '36px', height: '36px', borderRadius: '8px', justifyContent: 'center', background: '#f3f4f6'}}
          >
            <FaPlay aria-hidden="true" style={{color: '#6366f1'}} />
          </button>

          <div style={{width: '140px', padding: '0 0.25rem', boxSizing: 'border-box'}}>
            <label htmlFor="voice-select" style={{fontSize: '12px', display: 'block', marginBottom: '4px', textAlign: 'center', color: '#000000'}}>{lang === 'hi' ? 'आवाज़' : 'Voice'}</label>
            <select
              id="voice-select"
              value={voiceName}
              onChange={(e) => {
                const newVoiceName = e.target.value;
                setVoiceName(newVoiceName);
                const selectedVoice = voices.find(v => v.name === newVoiceName);
                if (selectedVoice) {
                  const sampleUtter = new SpeechSynthesisUtterance(lang === 'hi' ? 'यह नई आवाज़ है।' : 'This is the new voice.');
                  sampleUtter.voice = selectedVoice;
                  sampleUtter.lang = selectedVoice.lang;
                  sampleUtter.rate = rate;
                  sampleUtter.pitch = pitch;
                  window.speechSynthesis.cancel();
                  window.speechSynthesis.speak(sampleUtter);
                }
              }}
              style={{
                  ...baseButtonStyle,
                  width: '100%',
                  padding: '0.3rem',
                  color: '#000000',
                  backgroundColor: '#fff',
                  fontSize: '13px'
                }}
            >
              <option value="">{lang === 'hi' ? 'डिफ़ॉल्ट' : 'Default'}</option>
              {voices
                  .filter(v => v.lang.startsWith(lang))
                  .map(voice => (
                    <option key={voice.name} value={voice.name} style={{color: '#000000', backgroundColor: '#FFF'}}>
                      {voice.name.length > 25 ? `${voice.name.substring(0,22)}...` : voice.name}
                    </option>
                  ))}
            </select>
          </div>

          <div style={{width: '140px', padding: '0.25rem', boxSizing: 'border-box'}}>
              <label htmlFor="rate-slider" style={{fontSize: '12px', display: 'block', marginBottom: '4px', textAlign: 'center', color: '#000000'}}>{lang === 'hi' ? 'गति' : 'Rate'}: {rate.toFixed(1)}</label>
              <input
                type="range"
                id="rate-slider"
                min="0.5"
                max="2"
                step="0.1"
                value={rate}
                onChange={(e) => setRate(parseFloat(e.target.value))}
                style={{width: '100%'}}
              />
          </div>

          <div style={{width: '140px', padding: '0.25rem', boxSizing: 'border-box'}}>
              <label htmlFor="pitch-slider" style={{fontSize: '12px', display: 'block', marginBottom: '4px', textAlign: 'center', color: '#000000'}}>{lang === 'hi' ? 'पिच' : 'Pitch'}: {pitch.toFixed(1)}</label>
              <input
                type="range"
                id="pitch-slider"
                min="0"
                max="2"
                step="0.1"
                value={pitch}
                onChange={(e) => setPitch(parseFloat(e.target.value))}
                style={{width: '100%'}}
              />
          </div>

          <button
            type="button"
            onClick={() => {
              markUserGestureAndFlush();
              const nextLang = lang === 'hi' ? 'en' : 'hi';
              setLang(nextLang);
              setManualLangSelection(true);
              manualLangChangeAtRef.current = Date.now();
              if (voiceEnabled) {
                if (nextLang === 'hi') {
                  immediateSpeak('भाषा अब हिंदी पर है', 'hi');
                } else {
                  immediateSpeak('Language switched to English', 'en');
                }
              }
            }}
            title={lang==='hi' ? 'Switch to English' : 'हिंदी में बदलें'}
            aria-label={lang==='hi' ? 'Switch to English' : 'हिंदी में बदलें'}
            style={{...baseButtonStyle, padding: '0.4rem 0.6rem', borderRadius: '8px'}}
          >
            {lang === 'hi' ? 'EN' : 'हिंदी'}
          </button>
          </div>
        </div>
      )}

  {/* Small Route Announcer toggle button (right side) */}
  {!isAdminPath && !accessibilityOpen && !isMobile && (
          <button
            type="button"
            onClick={handleRouteAnnouncerToggle}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleRouteAnnouncerToggle(); } }}
            onMouseEnter={(e) => {
              // slide fully into view and expand
              e.currentTarget.style.right = '12px';
              e.currentTarget.style.width = '200px';
              e.currentTarget.style.transform = 'translateY(-50%) scale(1.03)';
              e.currentTarget.style.boxShadow = '0 12px 34px rgba(2,6,23,0.26)';
              try { if (labelRef.current) { labelRef.current.style.opacity = '1'; labelRef.current.style.transform = 'translateX(0)'; } } catch(_) {}
              try { if (iconRef.current) { iconRef.current.style.opacity = '1'; } } catch(_) {}
            }}
            onMouseLeave={(e) => {
              // return to half-hidden state
              e.currentTarget.style.right = peek ? '-22px' : '-22px';
              e.currentTarget.style.width = '44px';
              e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
              e.currentTarget.style.boxShadow = '0 6px 18px rgba(2,6,23,0.18)';
              try { if (labelRef.current) { labelRef.current.style.opacity = '0'; labelRef.current.style.transform = 'translateX(-6px)'; } } catch(_) {}
              try { if (iconRef.current) { iconRef.current.style.opacity = peek ? '1' : '0'; } } catch(_) {}
            }}
            onFocus={(e) => {
              // keyboard focus should also slide it fully into view
              e.currentTarget.style.right = '12px';
              e.currentTarget.style.width = '200px';
              e.currentTarget.style.transform = 'translateY(-50%) scale(1.03)';
              e.currentTarget.style.boxShadow = '0 12px 34px rgba(2,6,23,0.26)';
              try { if (labelRef.current) { labelRef.current.style.opacity = '1'; labelRef.current.style.transform = 'translateX(0)'; } } catch(_) {}
              try { if (iconRef.current) { iconRef.current.style.opacity = '1'; } } catch(_) {}
            }}
            onBlur={(e) => {
              // return to half-hidden state on blur
              e.currentTarget.style.right = peek ? '-22px' : '-22px';
              e.currentTarget.style.width = '44px';
              e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
              e.currentTarget.style.boxShadow = '0 6px 18px rgba(2,6,23,0.18)';
              try { if (labelRef.current) { labelRef.current.style.opacity = '0'; labelRef.current.style.transform = 'translateX(-6px)'; } } catch(_) {}
              try { if (iconRef.current) { iconRef.current.style.opacity = peek ? '1' : '0'; } } catch(_) {}
            }}
            aria-pressed={menuOpen}
            aria-label={lang === 'hi' ? 'रूट अनाउंसर' : 'Route Announcer'}
            style={{...routeAnnouncerButtonStyle, ...(pulse ? { animation: 'ra-pulse 2200ms ease-in-out' } : {}), ...(peek ? { animation: 'ra-peek 1600ms ease-in-out infinite' } : {})}}
            title={lang === 'hi' ? 'रूट अनाउंसर' : 'Route Announcer'}
          >
            <span style={{display: 'inline-flex', alignItems: 'center', gap: '8px', alignSelf: 'center'}}>
              {/* small attention badge */}
              <span aria-hidden="true" style={{width: '10px', height: '10px', borderRadius: '99px', background: '#ffffffff', boxShadow: '0 0 10px rgba(251, 251, 255, 1)', marginLeft: '-10px', marginRight: '6px'}} />
              {/* label is visually clipped by default; reveal on hover/focus by expanding button width; force English text */}
              {/* visually-hidden label for screen readers; keep aria-label/title on button */}
              <span ref={labelRef} className="sr-only" style={{fontSize: '15px'}}>Route Announcer</span>
              {/* speaker icon using FaVolumeUp; wrap in span so we can attach a ref to a DOM node */}
              <span ref={iconRef} aria-hidden="true" style={{display: 'inline-flex', width: '20px', height: '20px', transition: 'opacity 220ms ease, transform 200ms ease', opacity: (peek ? 1 : 0), color: '#ffffffff'}}>
                <FaVolumeUp style={{color: 'inherit'}} />
              </span>
            </span>
          </button>
        )}
    </div>
  );
}
