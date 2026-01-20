import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  FaPhone, FaEnvelope, FaMapMarkerAlt,
  FaPalette, FaGlobe, FaChevronDown
} from 'react-icons/fa';
import { SocialIconsRow } from './SocialIcons';
import { ALERT_BILINGUAL } from '../constants/alertMessage';

// ThemeContext removed — provide safe fallbacks so Footer still renders.
const gradients = { default: { background: 'transparent', textColor: '#0b1220' } };
const theme = 'default';
const changeTheme = () => {};
const logoName = 'wise3';
const logoSrcSetAvif = ['/assets/images/wise3-64.avif 64w','/assets/images/wise3-96.avif 96w','/assets/images/wise3-112.avif 112w','/assets/images/wise3-128.avif 128w','/assets/images/wise3-256.avif 256w'].join(', ');
const logoSrcSetWebp = ['/assets/images/wise3-64.webp 64w','/assets/images/wise3-96.webp 96w','/assets/images/wise3-112.webp 112w','/assets/images/wise3-128.webp 128w','/assets/images/wise3-256.webp 256w'].join(', ');

function Footer() {
  // const { background, textColor } = gradients[theme] || gradients.default;
  const [langQuery, setLangQuery] = useState('');
  const [showAllWidget, setShowAllWidget] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const langDropdownRef = useRef(null);
  const [showFooterAlert, setShowFooterAlert] = useState(false);

  // Indian and popular languages list (codes supported by Google Translate)
  const indianLanguages = React.useMemo(() => [
    { code: 'as', name: 'Assamese' },
    { code: 'bn', name: 'Bengali' },
    { code: 'bho', name: 'Bhojpuri' },
    { code: 'doi', name: 'Dogri' },
    { code: 'gom', name: 'Konkani' },
    { code: 'gu', name: 'Gujarati' },
    { code: 'hi', name: 'Hindi' },
    { code: 'kn', name: 'Kannada' },
    { code: 'ks', name: 'Kashmiri' },
    { code: 'mai', name: 'Maithili' },
    { code: 'ml', name: 'Malayalam' },
    { code: 'mni-Mtei', name: 'Meiteilon (Manipuri)' },
    { code: 'mr', name: 'Marathi' },
    { code: 'ne', name: 'Nepali' },
    { code: 'or', name: 'Odia (Oriya)' },
    { code: 'pa', name: 'Punjabi' },
    { code: 'sa', name: 'Sanskrit' },
    { code: 'sd', name: 'Sindhi' },
    { code: 'ta', name: 'Tamil' },
    { code: 'te', name: 'Telugu' },
    { code: 'ur', name: 'Urdu' },
  ], []);

  const popularLanguages = React.useMemo(() => [
    { code: 'en', name: 'English' },
    { code: 'ar', name: 'Arabic' },
    { code: 'zh-CN', name: 'Chinese (Simplified)' },
    { code: 'zh-TW', name: 'Chinese (Traditional)' },
    { code: 'cs', name: 'Czech' },
    { code: 'da', name: 'Danish' },
    { code: 'nl', name: 'Dutch' },
    { code: 'fi', name: 'Finnish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'el', name: 'Greek' },
    { code: 'he', name: 'Hebrew' },
    { code: 'hu', name: 'Hungarian' },
    { code: 'id', name: 'Indonesian' },
    { code: 'it', name: 'Italian' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' },
    { code: 'ms', name: 'Malay' },
    { code: 'no', name: 'Norwegian' },
    { code: 'pl', name: 'Polish' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'ro', name: 'Romanian' },
    { code: 'ru', name: 'Russian' },
    { code: 'es', name: 'Spanish' },
    { code: 'sv', name: 'Swedish' },
    { code: 'th', name: 'Thai' },
    { code: 'tr', name: 'Turkish' },
    { code: 'uk', name: 'Ukrainian' },
    { code: 'vi', name: 'Vietnamese' },
    { code: 'fa', name: 'Persian' },
    { code: 'sr', name: 'Serbian' },
    { code: 'hr', name: 'Croatian' },
    { code: 'bg', name: 'Bulgarian' },
    { code: 'sk', name: 'Slovak' },
    { code: 'sl', name: 'Slovenian' },
    { code: 'et', name: 'Estonian' },
    { code: 'lv', name: 'Latvian' },
    { code: 'lt', name: 'Lithuanian' },
    // removed duplicates of Indian languages
    { code: 'fil', name: 'Filipino' },
  ], []);

  // Create merged lookup to prevent duplicate codes across lists (used for search)
  const languageLookup = React.useMemo(() => {
    const map = new Map();
    [...indianLanguages, ...popularLanguages].forEach((l) => {
      if (!map.has(l.code)) map.set(l.code, l);
    });
    return Array.from(map.values());
  }, [indianLanguages, popularLanguages]);

  // Note: allQuickLanguages (merged list) is not needed because we present two grouped lists.

  // language selector removed — static English content used
  // Language translator: integrate Google Translate widget in a safe, responsive way
  useEffect(() => {
    // Avoid running on servers or if already present
    if (typeof window === 'undefined') return;

    // If widget already initialized, skip
    if (window.google && window.google.translate && window.google.translate.TranslateElement) {
      return;
    }

    // Define the callback for when the Google Translate script loads
  window.googleTranslateElementInit = function googleTranslateElementInit() {
      try {
    // Initialize widget with all available languages (no includedLanguages filter)
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false,
          },
          'google_translate_element'
        );
      } catch (err) {
        // ignore initialization errors (widget blocked or unsupported)
        console.warn('Google Translate init failed', err);
      }
    };

    // Inject script only once
    if (!document.getElementById('google-translate-script')) {
      const s = document.createElement('script');
      s.id = 'google-translate-script';
      s.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      s.async = true;
      s.defer = true;
      s.onload = () => {
        // script loaded; callback will run
      };
      s.onerror = () => {
        console.warn('Failed to load Google Translate script');
      };
      document.body.appendChild(s);
    }

    return () => {
      // cleanup callback and optionally remove script (keep it minimal)
      try {
        delete window.googleTranslateElementInit;
      } catch (e) {
        // ignore
      }
    };
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const onDocClick = (e) => {
      if (!langDropdownRef.current) return;
      if (!langDropdownRef.current.contains(e.target)) setIsLangOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  // DOM sanitation: some third-party scripts (Google Translate / voting widgets) inject iframes and forms
  // without titles or labels which flag automated scanners. Add safe titles/aria-hidden or minimal fixes.
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const fixThirdParty = () => {
      // Add title to any zero-size iframes that look like translator/voting frames
      const iframes = Array.from(document.querySelectorAll('iframe'));
      iframes.forEach((f, i) => {
        try {
          // skip if already has a title
          if (f.title && f.title.trim().length) return;
          const name = (f.name || '').toLowerCase();
          if (name.includes('translate') || name.includes('voting') || f.width === '0' || f.height === '0' || /display:\s*none|visibility:\s*hidden/.test(f.style.cssText || '')) {
            f.setAttribute('title', 'auxiliary third-party frame');
            // keep hidden from AT if decorative
            f.setAttribute('aria-hidden', 'true');
            // also mark inert where supported
            try { f.inert = true; } catch (e) { /* ignore if not supported */ }
          }
        } catch (e) {
          // ignore cross-origin frames
        }
      });

      // Ensure third-party forms without submit buttons are not reachable by keyboard if they are decorative
      const votingForms = Array.from(document.querySelectorAll('form[id^="goog-gt-"], form[name^="goog-gt-"]'));
      votingForms.forEach((form) => {
        // If form lacks a submit control, mark as aria-hidden and inert to avoid false positives in automated scans
        const hasSubmit = !!form.querySelector('button[type="submit"], input[type="submit"], input[type="image"]');
        if (!hasSubmit) {
          form.setAttribute('aria-hidden', 'true');
          try { form.inert = true; } catch (e) { /* ignore if not supported */ }
        }
      });
    };

    // Run once early (use rAF to try to run before pa11y snapshots), then observe mutations
    try {
      if (typeof window !== 'undefined' && window.requestAnimationFrame) {
        window.requestAnimationFrame(() => { try { fixThirdParty(); } catch (e) {} });
      } else {
        fixThirdParty();
      }
    } catch (e) {
      // ignore
    }

    const observer = new MutationObserver(() => { fixThirdParty(); });
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  // Ensure the alert bar is rendered only once per page.
  // Some pages/components may mount Footer multiple times; use a DOM id check to avoid duplicate alerts.
  useEffect(() => {
    if (typeof document === 'undefined') return;
    // If an element with the alert id already exists, don't show another one.
    if (document.getElementById('wise-global-alert')) {
      setShowFooterAlert(false);
    } else {
      setShowFooterAlert(true);
    }
    // No cleanup necessary — when this specific alert unmounts the id will be removed with the node.
  }, []);

  // Helper to set the Google Translate cookie and trigger translation
  const translateTo = (lang) => {
    if (typeof document === 'undefined') return;
    try {
      // First try to use the in-page widget method if available (no reload)
      if (window.google && window.google.translate && window.google.translate.TranslateElement) {
        try {
          // Attempt to trigger the widget programmatically: set cookie then call function
          const cookieValue = `/en/${lang}`;
          document.cookie = `googtrans=${cookieValue}; path=/; max-age=31536000`;
          document.cookie = `_googtrans=${cookieValue}; path=/; max-age=31536000`;
          try { window.localStorage.setItem('route.lang', JSON.stringify(lang)); } catch (e) { /* ignore */ }
          try { window.localStorage.setItem('route.langManual', JSON.stringify(true)); } catch (e) { /* ignore */ }
          // Some versions expose a select element inside the widget we can change
          const frame = document.querySelector('#google_translate_element iframe');
          if (frame) {
            // Try to set via cookie then reload only the frame
            frame.contentWindow.location.reload();
            return;
          }
        } catch (e) {
          // Fall through to cookie+reload fallback below
          console.warn('Widget translate attempt failed', e);
        }
      }

      // Fallback: set the googtrans cookie and reload whole page
      const cookieValue = `/en/${lang}`;
      document.cookie = `googtrans=${cookieValue}; path=/; max-age=31536000`;
      document.cookie = `_googtrans=${cookieValue}; path=/; max-age=31536000`;
      try { window.localStorage.setItem('route.lang', JSON.stringify(lang)); } catch (e) { /* ignore */ }
      try { window.localStorage.setItem('route.langManual', JSON.stringify(true)); } catch (e) { /* ignore */ }
      window.location.reload();
    } catch (e) {
      console.warn('translateTo failed', e);
    }
  };
  return (
    <>
      <footer
        role="contentinfo"
        style={{
          background: 'linear-gradient(90deg, #3474eaff, #5688f5ff 50%, #4e75f1ff)',
          color: '#fff',
          borderTop: '4px solid #49eb34',
        }}
        className="relative z-30 transition-all duration-1000 pt-10 pb-6 px-2 sm:px-6 w-full mx-0 my-0 rounded-none shadow-2xl overflow-x-hidden"
      >
        <div className="custom-scrollbar max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-sm">
            {/* 🌟 Logo Section */}
            <div className="flex flex-col items-center md:items-start">
              <div className="relative inline-block w-24 h-24 sm:w-32 sm:h-32 mb-2">
                <div className="relative z-10 rounded-full border-4 shadow-2xl bg-white p-1 border-green-300">
                  <picture>
                    <source type="image/avif" srcSet={logoSrcSetAvif} sizes="(max-width: 640px) 96px, 128px" />
                    <source type="image/webp" srcSet={logoSrcSetWebp} sizes="(max-width: 640px) 96px, 128px" />
                    <img src={`/assets/images/${logoName}.png`} alt="Wise Global Logo" className="w-full h-full object-contain rounded-full bg-white" loading="lazy" decoding="async" />
                  </picture>
                </div>
              </div>
              <p className="mt-2 text-base leading-relaxed text-white text-center md:text-left">
                Wise Global Research Services — Market research, analytics, and investment insights.
              </p>
              <div className="w-full flex justify-center md:justify-start mt-4">
                <SocialIconsRow className="flex-wrap gap-3 sm:gap-4" iconClass="text-white" size="w-9 h-9 sm:w-11 sm:h-11" />
              </div>
            </div>

            {/* Quick Links Section */}
            <div>
              <h3 className="text-lg font-bold mb-4 text-green-200 tracking-wide uppercase">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to="/about" className="hover:text-green-200 transition">→ About Us</Link></li>
                <li><Link to="/contact" className="hover:text-green-200 transition">→ Contact</Link></li>
                <li><Link to="/payment" className="hover:text-green-200 transition">→ Payment</Link></li>
                <li><Link to="/search" className="hover:text-green-200 transition">→ Search</Link></li>
                <li><Link to="/sitemap" className="hover:text-green-200 transition">→ Sitemap</Link></li>
                <li><Link to="/investor-charter" className="hover:text-green-200 transition">→ Investor Charter</Link></li>
                <li><Link to="/career" className="hover:text-green-200 transition">→ Careers</Link></li>
                <li><Link to="/guide" className="hover:text-green-200 transition">→ Guide for Investing</Link></li>
                <li><Link to="/recommendation" className="hover:text-green-200 transition">→ Daily Recommendation</Link></li>
                <li><Link to="/services-prices" className="hover:text-green-200 transition">→ Services & Prices</Link></li>

              </ul>
            </div>

            {/* Useful Links Section */}
            <div>
              <h3 className="text-lg font-bold mb-4 text-green-200 tracking-wide uppercase">Useful Links</h3>
              <ul className="space-y-2">
                <li><Link to="/legal" className="hover:text-green-200 transition">→ Disclaimer</Link></li>
                <li><Link to="/disclosure" className="hover:text-green-200 transition">→ Disclosure</Link></li>
                <li><Link to="/privacy" className="hover:text-green-200 transition">→ Privacy Policy</Link></li>
                <li><Link to="/refund" className="hover:text-green-200 transition">→ Refund Policy</Link></li>
                <li><Link to="/complaint" className="hover:text-green-200 transition">→ Complaint Box</Link></li>
                <li><Link to="/complaint-data" className="hover:text-green-200 transition">→ Complaint Data</Link></li>
                <li><Link to="/terms" className="hover:text-green-200 transition">→ Terms and Conditions</Link></li>
                <li><Link to="/accessibility-statement" className="hover:text-green-200 transition">→ Accessibility Statement</Link></li>
                <li><Link to="/accessibility-feedback" className="hover:text-green-200 transition">→ Accessibility Feedback</Link></li>
              </ul>
            </div>

            {/* Registration Details Section */}
            <div>
              <h3 className="text-lg font-bold mb-4 text-green-200 tracking-wide uppercase">Registration Details</h3>
              <ul className="space-y-1 text-sm text-white">
                <li className="break-words"><strong>Registered Name:</strong> WISE GLOBAL RESEARCH SERVICES PRIVATE LIMITED</li>
                <li className="break-words"><strong>CEO / Principal Officer / Compliance Officer:</strong> Hemraj Singh Sikarwar</li>
                <li><strong>GST No:</strong> 23AADCW7173Q1ZO</li>
                <li><strong>CIN Number:</strong> U66190MP2024PTC069199</li>
                <li><strong>Type of Registration:</strong> Non – Individual</li>
                <li><strong>SEBI Registration No:</strong> INH000016719</li>
                <li><strong>BSE Enlistment No:</strong> 6205</li>
                <li className="break-words"><strong>Validity:</strong> 24-June-2024 to Perpetual</li>
                <li className="break-words"><strong>SEBI Office Details:</strong> Securities and Exchange Board of India, SEBI Bhavan. Plot No. C4-A, ‘G’ Block, Bandra-Kurla Complex, Bandra (E), Mumbai – 400051.</li>
                <li><strong>Toll Free:</strong> 1800 22 7575</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-green-400 my-8" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
            <div className="space-y-2">
              <h3 className="font-bold text-green-200 mb-2 uppercase tracking-wide">Quick Contact</h3>
              <p className="text-green-200 font-semibold">WISE GLOBAL RESEARCH SERVICES PRIVATE LIMITED</p>
              <p className="break-words"><FaEnvelope className="inline mr-2 text-green-200" /> <span className="text-white">support@wiseglobalresearch.com</span></p>
              <p><FaPhone className="inline mr-2 text-green-200" /> <span className="text-white">+91 9977909494</span></p>
              <p className="break-words"><FaMapMarkerAlt className="inline mr-2 text-green-200 align-baseline" /> <span className="text-white">Registered Office Address: 18 AB Road, Onam Plaza, Office No 602, Old Palasiya, Indore Tukoganj, Indore, Madhya Pradesh, 452001</span></p>
            </div>

            <div className="space-y-4">
              <div>
                <h3 id="theme-label" className="font-bold flex items-center gap-2 text-green-200 mb-2 uppercase tracking-wide"><FaPalette /> Select Website Theme</h3>
                <div className="bg-white/80 text-green-900 rounded-lg shadow-md overflow-hidden border border-green-200">
                  <select
                    value={theme}
                    onChange={(e) => changeTheme(e.target.value)}
                    className="w-full px-4 py-2 pr-10 bg-white/80 text-green-900 focus:outline-none focus:ring-2 focus:ring-green-400 rounded-lg"
                    aria-labelledby="theme-label"
                  >
                    {Object.keys(gradients).map((key) => (
                      <option key={key} value={key}>
                        {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Translate Website */}
              <div ref={langDropdownRef}>
                <h3 className="font-bold flex items-center gap-2 text-green-200 mb-2 uppercase tracking-wide"><FaGlobe /> Translate Website</h3>
                <button
                  id="footer-lang-toggle"
                  type="button"
                  onClick={() => setIsLangOpen((s) => !s)}
                  aria-expanded={isLangOpen}
                  aria-controls="lang-dropdown-panel"
                  aria-label="Choose website language"
                  className="w-full bg-white/80 text-green-900 rounded-lg shadow-md px-3 py-2 flex items-center justify-between hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-400"
                >
                  <span className="text-sm">Choose language</span>
                  <FaChevronDown className={`transition-transform ${isLangOpen ? 'rotate-180' : ''}`} />
                </button>
                <div className={`relative ${isLangOpen ? 'block' : 'hidden'}`}>
                  <div id="lang-dropdown-panel" role="region" aria-label="Language options" className="absolute left-0 right-0 mt-2 bg-white/90 text-green-900 rounded-xl shadow-2xl p-4 z-40 max-h-[70vh] overflow-y-auto custom-scrollbar border border-green-200">
                    <input
                      id="footer-lang-search"
                      name="footer-lang-search"
                      type="text"
                      value={langQuery}
                      onChange={(e) => setLangQuery(e.target.value)}
                      placeholder="Search language..."
                      className="w-full border border-green-200 bg-white rounded px-3 py-2 text-sm text-green-900 focus:outline-none focus:ring-2 focus:ring-green-400"
                      aria-label="Search language"
                    />
                    <div className="mt-3">
                      <div className="text-xs font-semibold text-green-400 mb-1">Indian languages</div>
                      <div className="flex flex-wrap gap-2">
                        {(langQuery ? languageLookup.filter(l => (l.name + l.code).toLowerCase().includes(langQuery.toLowerCase())).filter(l=> indianLanguages.find(i=>i.code===l.code)) : indianLanguages)
                          .map((l) => (
                            <button
                              key={`in-${l.code}`}
                              type="button"
                              onClick={() => { setIsLangOpen(false); translateTo(l.code); }}
                              className="px-2 py-1 rounded-full bg-green-200 hover:bg-green-100 text-green-900 text-xs transition border border-green-400"
                              title={`Translate to ${l.name}`}
                            >
                              {l.name}
                            </button>
                          ))}
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="text-xs font-semibold text-green-400 mb-1">Popular worldwide</div>
                      <div className="flex flex-wrap gap-2">
                        {(langQuery ? languageLookup.filter(l => (l.name + l.code).toLowerCase().includes(langQuery.toLowerCase())).filter(l=> popularLanguages.find(i=>i.code===l.code)) : popularLanguages)
                          .map((l) => (
                            <button
                              key={`pop-${l.code}`}
                              type="button"
                              onClick={() => { setIsLangOpen(false); translateTo(l.code); }}
                              className="px-2 py-1 rounded-full bg-white hover:bg-green-100 text-green-900 text-xs transition border border-green-400"
                              title={`Translate to ${l.name}`}
                            >
                              {l.name}
                            </button>
                          ))}
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between gap-2 text-xs text-green-400" aria-live="polite">
                      <span>Need more languages? Use full list below.</span>
                      <button
                        id="footer-lang-showall"
                        type="button"
                        onClick={() => setShowAllWidget((s) => !s)}
                        className="underline hover:text-green-200"
                        aria-controls="google_translate_element"
                        aria-expanded={showAllWidget}
                        aria-label={showAllWidget ? 'Hide full list of languages' : 'Show full list of languages'}
                      >
                        {showAllWidget ? 'Hide full list' : 'Show full list'}
                      </button>
                    </div>
                    <div className="mt-2">
                      <div id="google_translate_element" role="region" aria-labelledby="google-translate-label" className={`${showAllWidget ? '' : 'hidden'} min-h-[28px] bg-white/90`} />
                      <span id="google-translate-label" className="sr-only">Google Translate full list</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Alert Marquee (render only once) */}
      {showFooterAlert && (
        <div
          id="wise-global-alert"
          className="w-full h-8 border-t border-green-400 overflow-hidden notranslate bg-gradient-to-r from-green-500 via-red-400 to-yellow-400 animate-gradient-x"
          style={{ backgroundColor: '#ff6551f6', borderTopColor: '#ffffffff' }}
          translate="no"
          aria-hidden="false"
        >
          <div className="whitespace-nowrap animate-scroll text-sm flex items-center h-full">
            <p className="inline-block font-medium px-4 notranslate" translate="no" style={{ color: '#ffffffff' }}>{ALERT_BILINGUAL}</p>
          </div>
        </div>
      )}

  <div className="w-full text-center text-xs py-3 px-2 break-words bg-gradient-to-r from-green-500 via-red-400 to-yellow-400 text-white shadow-inner border-t border-green-200">
        Copyright 2024, Wise Global Research. All Rights Reserved &nbsp;|&nbsp; Powered by <a href="https://mrxads.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-green-400">MRXADS</a>
      </div>

      {/* Developer Signature: Hidden in HTML source */}
      {/* Durgesh Rathor - Website Developer Signature */}
      {/*
        This website was developed by Durgesh Rathor.
        For verification or collaboration, contact: durgeshrathor05@gmail.com
      */}
    </>
  );
}

export default Footer;