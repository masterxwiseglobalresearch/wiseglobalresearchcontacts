import React, { useState, useEffect, useRef, startTransition } from 'react';
// useTranslation removed from this file to rely on translateWithFallback helper
import { Link, useLocation, useNavigate } from 'react-router-dom';
// Removed react-icons usage per requirement to have no icons in the navbar
import wiseLogo from '../assets/images/wise3.png';
import EN_LABELS from '../locales/en.json';
import './Navbar.css';
import TradingViewTicker from './TradingViewTicker';
import AlertBar from './AlertBar';
// Prefer react-icons when available for crisp, scalable icons in the mobile drawer.
// Keep existing inline SVG fallbacks (IconHome, IconClose, etc.) in case react-icons
// cannot be resolved by the bundler for any reason.
import { MdClose, MdHome, MdSearch, MdCreditCard, MdChevronRight } from 'react-icons/md';
import { SocialIconsRow } from './SocialIcons';
import { TopIconLabel, topNavIconMap, IconChevron, IconSearch, IconCard } from './NavbarIcons';

// Contact info for top header bar (update with real company details)
const CONTACT = {
  email: 'support@wiseglobalresearch.com',
  phone: '+91-9977909494',
  socials: {
    facebook: 'https://www.facebook.com/wiseglobalresearch/',
    twitter: 'https://x.com/research221711',
    instagram: 'https://www.instagram.com/wiseglobalresearch/',
    linkedin: 'https://www.linkedin.com/in/wise-global-research-services-63b535317/',
    youtube: 'https://www.youtube.com/@WiseGlobalResearchService',
  },
};


// Minimal inline SVG icons used by the redesigned mobile drawer.
function IconHome(props) {
  return (
    <svg viewBox="0 0 24 24" width={props.width || 20} height={props.height || 20} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M3 11.5L12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-8.5z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconClose(props) {
  return (
    <svg viewBox="0 0 24 24" width={props.width || 20} height={props.height || 20} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Removed unused labelsFallbacks

// Minimal inline translation fallback helper (inlined from translateWithFallback.js)
function getEnglishLabel(key) {
  if (!key) return null;
  const parts = key.split('.');
  let val = EN_LABELS;
  for (const p of parts) {
    if (val && typeof val === 'object' && p in val) val = val[p];
    else return null;
  }
  return typeof val === 'string' ? val : null;
}

function translateWithFallback(i18n, key) {
  if (typeof window !== 'undefined' && window.i18next) {
    const t = window.i18next.t(key);
    if (t && t !== key) return t;
  }
  const enLabel = getEnglishLabel(key);
  if (enLabel) return enLabel;
  if (typeof key === 'string') {
    let label = key.replace(/^navbar\./, '').replace(/\./g, ' ');
    label = label.replace(/([A-Z])/g, ' $1').replace(/\s+/g, ' ').trim();
    return label.charAt(0).toUpperCase() + label.slice(1);
  }
  return key;
}

const servicesMenu = [
  {
    labelKey: 'services.cash.title',
    items: [
      { path: '/EvaluationStockCash', labelKey: 'services.cash.evaluationStockCash' },
      { path: '/SmartCash', labelKey: 'services.cash.smartCash' },
    ],
  },
  {
    labelKey: 'services.option.title',
    items: [
      { path: '/EvaluationStockOption', labelKey: 'services.option.evaluationStockOption' },
      { path: '/ImpulseOption', labelKey: 'services.option.impulseOption' },
      { path: '/SmartFuture', labelKey: 'services.option.smartFuture' },
      { path: '/SmartOptions', labelKey: 'services.option.smartOptions' },
    ],
  },
  {
    labelKey: 'services.specialization.title',
    items: [
      { path: '/InfinityClub', labelKey: 'services.specialization.infinityClub' },
      { path: '/UniversalCash', labelKey: 'services.specialization.universalCash' },
    ],
  },
  {
    labelKey: 'services.index.title',
    items: [
      { path: '/EvaluationIndexOptions', labelKey: 'services.index.evaluationIndexOptions' },
      { path: '/ImpulseIndexOptions', labelKey: 'services.index.impulseIndexOptions' },
      { path: '/services/smart-index-option', labelKey: 'services.index.smartIndexOption' },
    ],
  },
  {
    labelKey: 'services.mcx.title',
    items: [
      { path: '/MCXSupreme', labelKey: 'services.specialization.mcxSupreme' },
      { path: '/GalaxyMCX', labelKey: 'services.specialization.galaxyMCX' },
    ],
  },
];

const dropdownLinks = {
  company: {
    labelKey: 'company.title',
    items: [
      { path: '/about', labelKey: 'company.aboutUs' },
      { path: '/vision', labelKey: 'company.visionMission' },
    ]
  },
  hrZone: {
    labelKey: 'hrZone.title',
    items: [
      { path: '/career', labelKey: 'hrZone.career' },
    ]
  },
  insights: {
    labelKey: 'insights.title',
    items: [
      { path: '/blogs', labelKey: 'insights.blogs' },
      { path: '/market-news', labelKey: 'insights.marketNews' },
      { path: '/complaint-data', labelKey: 'insights.complaintData' },
      { path: '/grievance-redressal-process', labelKey: 'insights.grievanceRedressalProcess' },
    ]
  },
  accessibility: {
    labelKey: 'accessibility.title',
    items: [
      { path: '/accessibility-statement', labelKey: 'accessibility.statement' },
      { path: '/accessibility-feedback', labelKey: 'accessibility.feedback' },
      { path: '/media', labelKey: 'accessibility.media' },
    ]
  },
  dashboard: {
    labelKey: 'dashboard.title',
    items: [
      { path: '/admin', labelKey: 'dashboard.adminPanel' },
      { path: '/client-panel', labelKey: 'dashboard.clientPanel' },
      { path: '/client-service-consent-form', labelKey: 'dashboard.clientServiceConsent' },
      { path: '/investor-chart', labelKey: 'dashboard.investorChart' },
      { path: '/anti-money-laundering', labelKey: 'dashboard.antiMoneyLaundering' },
    ]
  },
  more: {
    labelKey: 'more',
    items: [
      { path: '/legal', labelKey: 'disclaimer' },
      { path: '/disclosure', labelKey: 'disclosure' },
      { path: '/privacy', labelKey: 'privacy' },
      { path: '/refund', labelKey: 'refund' },
      { path: '/terms', labelKey: 'terms' },
    ]
  },
};

const navLinks = [
  { path: '/payment', labelKey: 'payment' },
  { path: '/complaint', labelKey: 'complaintBox' },
  { path: '/research-reports', labelKey: 'researchReports' },
];

// Helper to map labelKey to topNavIconMap key for standalone navLinks
function navLinkToIconKey(labelKey) {
  if (!labelKey) return null;
  if (labelKey.includes('payment')) return 'payment';
  if (labelKey.includes('complaint')) return 'complaint';
  if (labelKey.includes('research') || labelKey.includes('reports')) return 'reports';
  // fallback: use last segment
  const parts = labelKey.split('.');
  return parts[parts.length - 1];
}

const MegaMenu = React.memo(({ labelKey, categories, location, textColor, isMobile, mobileOpen, setMobileOpen, closeDrawer, categoryIcon: CategoryIcon, categoryIconColor }) => {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutId = useRef(null);
  const menuRef = useRef(null);

  const handleMouseEnter = () => {
    if (!isMobile) {
      clearTimeout(timeoutId.current);
      setIsOpen(true);
    }
  };
  const handleMouseLeave = () => {
    if (!isMobile) {
      timeoutId.current = setTimeout(() => setIsOpen(false), 300);
    }
  };
  const handleMenuMouseEnter = () => {
    if (!isMobile) {
      clearTimeout(timeoutId.current);
      setIsOpen(true);
    }
  };
  const handleClick = () => {
    if (isMobile) {
      setMobileOpen((prev) => !prev);
    } else {
      setIsOpen((prev) => !prev);
    }
  };

  const handleLinkClick = () => {
    if (isMobile) {
      closeDrawer();
    } else {
      setIsOpen(false);
    }
  };

  if (!isMobile) {
    return (
      <div
        className="relative group"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        ref={menuRef}
      >
        <button
          className={`nav-item font-semibold text-sm md:text-base px-2 py-1${location.pathname.startsWith('/services') ? ' active' : ''}`}
          style={{ color: `var(--navbar-color, var(--text-color, ${textColor || "'#0b1220'"}))` }}
          aria-expanded={isOpen}
          aria-label={`Toggle ${translateWithFallback(null, labelKey)} menu`}
          onClick={handleClick}
        >
          <TopIconLabel Icon={topNavIconMap.services} label={translateWithFallback(null, labelKey)} />
        </button>
          <div
          className={`absolute top-full left-0 mt-0 bg-white/90 backdrop-blur-lg border border-[var(--primary-green)] text-black shadow-lg rounded-xl z-50 flex flex-row p-4 w-[90vw] lg:w-[84vw] max-w-[1000px] transition-opacity duration-300 ${
            isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
          } animate-slideDown`}
          style={{
            overflowX: 'auto',
            wordBreak: 'break-word',
            minWidth: '250px',
            maxWidth: '1000px',
          }}
          onMouseEnter={handleMenuMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {categories.map((cat, idx) => (
            <React.Fragment key={cat.labelKey}>
              <div className="min-w-[180px] max-w-[220px] px-2 break-words">
                <div className="font-semibold text-sm md:text-base mb-2 text-[var(--primary-green)] break-words">
                  {translateWithFallback(null, cat.labelKey)}
                </div>
                <div className="space-y-1 text-xs md:text-sm break-words">
                  {cat.items.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`block hover:text-blue-600 py-1 transition-all duration-300 break-words ${
                        location.pathname === item.path ? 'text-[var(--primary-green)] font-semibold' : ''
                      }`}
                      onClick={handleLinkClick}
                      style={{ wordBreak: 'break-word', whiteSpace: 'normal' }}
                    >
                      {/* If item.icon is a React element, render it smaller and colorful */}
                      {translateWithFallback(null, item.labelKey)}
                    </Link>
                  ))}
                </div>
              </div>
              {idx !== categories.length - 1 && (
                <div className="border-l border-gray-300 mx-2 h-auto" style={{ minHeight: 60 }} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  }

  // Mobile MegaMenu
  return (
    <div className="w-full">
      <button
        className="w-full flex justify-between items-center font-bold text-base py-2 text-[var(--primary-green)] focus:outline-none"
        onClick={handleClick}
        aria-expanded={mobileOpen}
        aria-label={`Toggle ${translateWithFallback(null, labelKey)} menu`}
      >
        {translateWithFallback(null, labelKey)}
        <span className={`ml-2 transition-transform duration-200 ${mobileOpen ? 'rotate-90' : ''}`}>▶</span>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${mobileOpen ? 'max-h-[1000px] py-2' : 'max-h-0 py-0'}`}>
        {categories.map((cat) => (
          <div key={cat.labelKey} className="pl-2">
            <div className="font-semibold text-sm mt-2 mb-1 text-[var(--primary-green)]">{translateWithFallback(null, cat.labelKey)}</div>
            {cat.items.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="nav-item block py-1 pl-2 flex items-center gap-2"
                onClick={handleLinkClick}
                style={{ color: 'var(--text-color)' }}
              >
                {item.icon ? (
                  <span style={{ display: 'inline-flex', width: 16, height: 16, color: 'currentColor' }}>
                    {React.cloneElement(item.icon, { style: { width: 16, height: 16, color: 'inherit' } })}
                  </span>
                ) : null}
                {translateWithFallback(null, item.labelKey)}
              </Link>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
});

function TopContactBar() {
  // Match footer gradient background
  const barBg = 'linear-gradient(90deg, #3474eaff, #5688f5ff 50%, #4e75f1ff)';
  const barText = '#fff';
  const iconStyle = { display: 'block', verticalAlign: 'middle', position: 'relative', top: 0, marginRight: 6, overflow: 'visible' };
  return (
    <div style={{ background: barBg, color: barText }} className="text-[11px] sm:text-xs w-full">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-1.5 flex flex-wrap items-center justify-between gap-2" style={{ minHeight: 24, lineHeight: 1 }}>
        <div className="flex items-center flex-wrap gap-x-3 gap-y-1 min-w-0 w-full sm:w-auto overflow-x-auto" style={{ minHeight: 24 }}>
          <a
            href={`mailto:${CONTACT.email}`}
            className="hover:text-[var(--primary-green)] focus:outline-none focus:ring-1 focus:ring-[var(--primary-green)] rounded px-1 inline-flex items-center gap-2 h-6 whitespace-nowrap"
            aria-label={`Email: ${CONTACT.email}`}
            style={{ color: barText, fontWeight: 'bold', letterSpacing: '0.5px' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" role="img" aria-label="Email" style={iconStyle} className="w-6 h-6">
              <path d="M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2zm0 3.2l-8 5-8-5V6h16v1.2zM4 18V9.6l7.4 4.63a1 1 0 001.2 0L20 9.6V18H4z" />
            </svg>
            <span className="truncate">{CONTACT.email}</span>
          </a>
          <span className="hidden sm:inline mx-2" aria-hidden style={{ color: barText, fontWeight: 'bold' }}>│</span>
          <a
            href={`tel:${CONTACT.phone}`}
            className="hover:text-[var(--primary-green)] focus:outline-none focus:ring-1 focus:ring-[var(--primary-green)] rounded px-1 inline-flex items-center gap-2 h-6 whitespace-nowrap"
            aria-label={`Call: ${CONTACT.phone}`}
            style={{ color: barText, fontWeight: 'bold', letterSpacing: '0.5px' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" role="img" aria-label="Phone" style={iconStyle} className="w-6 h-6">
              <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.05-.24c1.12.37 2.33.57 3.54.57.55 0 1 .45 1 1V21a1 1 0 01-1 1C10.4 22 2 13.6 2 3a1 1 0 011-1h3.5a1 1 0 011 1c0 1.21.2 2.42.57 3.54a1 1 0 01-.24 1.05l-2.2 2.2z" />
            </svg>
            <span className="truncate">{CONTACT.phone}</span>
          </a>
          <span className="hidden sm:inline mx-2" aria-hidden style={{ color: barText, fontWeight: 'bold' }}>│</span>
          <SocialIconsRow className="ml-2 gap-2" iconClass="text-white" size="w-7 h-7" />
        </div>
      </div>
    </div>
  );
}
function Navbar() {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [servicesMobileOpen, setServicesMobileOpen] = useState(false);
  // mobileDropdownsOpen removed — redesigned drawer uses native details/summary and grouped lists
  const location = useLocation();
  const drawerRef = useRef();
  const firstFocusableRef = useRef(null);
  const lastFocusableRef = useRef(null);
  // Removed unused navColorFallback and defaultNavTextColor
  const navRef = useRef(null);
  // Split dropdowns so we can render 'more' after the primary nav links
  const dropdownEntriesWithoutMore = Object.entries(dropdownLinks).filter(([k]) => k !== 'more');
  const moreDropdown = dropdownLinks.more || null;




  const closeDrawer = () => {
    startTransition(() => {
      setDrawerOpen(false);
      setServicesMobileOpen(false);
      // mobileDropdownsOpen state removed in refactor
    });
  };

  // Build search index (label -> path) from nav structures
  const buildIndex = () => {
    const entries = [];
    // navLinks
    navLinks.forEach(l => entries.push({ label: translateWithFallback(null, l.labelKey).toLowerCase(), path: l.path }));
    // dropdownLinks
    Object.values(dropdownLinks).forEach(dd => {
      entries.push({ label: translateWithFallback(null, dd.labelKey).toLowerCase(), path: '#' });
      dd.items.forEach(it => entries.push({ label: translateWithFallback(null, it.labelKey).toLowerCase(), path: it.path }));
    });
    // servicesMenu
    servicesMenu.forEach(cat => {
      entries.push({ label: translateWithFallback(null, cat.labelKey).toLowerCase(), path: '#' });
      cat.items.forEach(it => entries.push({ label: translateWithFallback(null, it.labelKey).toLowerCase(), path: it.path }));
    });
    // Also include common labels
  entries.push({ label: translateWithFallback(null, 'home').toLowerCase(), path: '/' });
    return entries;
  };
  React.useMemo(() => buildIndex(), []);

  // toggleMobileDropdown removed (no longer used)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        closeDrawer();
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target)) {
        closeDrawer();
      }
    };
    const handleKeydown = (e) => {
      if (!drawerOpen) return;
      if (e.key === 'Escape') {
        e.preventDefault();
        closeDrawer();
      } else if (e.key === 'Tab') {
        // Basic focus trap within drawer
        const focusables = drawerRef.current?.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])');
        if (!focusables || !focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    if (drawerOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeydown);
      // set initial focus into the drawer for accessibility
      setTimeout(() => {
        const focusables = drawerRef.current?.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])');
        if (focusables && focusables.length) {
          firstFocusableRef.current = focusables[0];
          lastFocusableRef.current = focusables[focusables.length - 1];
          firstFocusableRef.current.focus();
        }
      }, 0);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeydown);
    };
  }, [drawerOpen]);

  // Close the drawer automatically on route change (mobile navigation)
  useEffect(() => {
    if (drawerOpen) closeDrawer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  // Prevent background scroll when the drawer is open (mobile)
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    const originalTouchAction = document.body.style.touchAction;
    if (drawerOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      document.body.style.overflow = originalOverflow || '';
      document.body.style.touchAction = originalTouchAction || '';
    }
    return () => {
      document.body.style.overflow = originalOverflow || '';
      document.body.style.touchAction = originalTouchAction || '';
    };
  }, [drawerOpen]);

  // When Google Translate injects its top banner (usually an iframe with
  // class `goog-te-banner-frame` or an iframe whose src contains `translate`),
  // move the fixed navbar down so it doesn't overlap. This keeps behavior
  // responsive and works on mobile.
  useEffect(() => {
    const navEl = navRef.current;
    if (!navEl) return undefined;

  // Smooth transition for top changes
  navEl.style.transition = navEl.style.transition || 'top 0.18s ease';

    const getBannerHeight = () => {
      // Common selectors for Google Translate UI
      const iframeByClass = document.querySelector('iframe.goog-te-banner-frame');
      if (iframeByClass) return Math.round(iframeByClass.getBoundingClientRect().height) || 0;

      // Fallback: any iframe that looks like a translate banner
      const iframes = Array.from(document.querySelectorAll('iframe'));
      for (const f of iframes) {
        try {
          const src = f.getAttribute('src') || '';
          if (/translate|googlesyndication|translate.googleusercontent/.test(src)) {
            const h = Math.round(f.getBoundingClientRect().height);
            if (h > 0) return h;
          }
        } catch (e) {
          // ignore cross-origin access errors
        }
      }

      // Another possible element is the banner wrapper div
      const bannerDiv = document.querySelector('.goog-te-banner-frame') || document.querySelector('.goog-te-banner');
      if (bannerDiv) return Math.round(bannerDiv.getBoundingClientRect().height) || 0;

      return 0;
    };

  // Apply by setting CSS variables on the root element. The navbar
  // and mobile drawer read `--nav-offset` and `--nav-height` so the
  // layout updates responsively (desktop and mobile) without fighting utility classes.
    // Throttle layout reads (getBoundingClientRect) to once per frame
    let rafId = null;
    let pending = false;
    const apply = () => {
      if (pending) return; // already scheduled
      pending = true;
      rafId = requestAnimationFrame(() => {
        pending = false;
          const h = getBannerHeight();
          const docEl = document.documentElement;
          // Preserve any existing offset (for example from a fixed top ticker).
          // Use the larger of the currently-set --nav-offset and the banner height
          // so we don't accidentally move the navbar under the ticker.
          try {
            const existingOffsetStr = getComputedStyle(docEl).getPropertyValue('--nav-offset') || '0px';
            const existingOffset = parseInt(existingOffsetStr, 10) || 0;
            const finalOffset = Math.max(existingOffset, h || 0);
            docEl.style.setProperty('--nav-offset', `${finalOffset}px`);
          } catch (e) {
            // Fallback to banner height if computed style cannot be read
            if (h) {
              docEl.style.setProperty('--nav-offset', `${h}px`);
            } else {
              docEl.style.setProperty('--nav-offset', '0px');
            }
          }
        try {
          const navH = Math.round(navEl.getBoundingClientRect().height) || 0;
          docEl.style.setProperty('--nav-height', `${navH}px`);
        } catch (e) {
          docEl.style.setProperty('--nav-height', '0px');
        }
      });
    };

    // Observe DOM changes since translate banner is injected dynamically
  const mo = new MutationObserver(() => apply());
    mo.observe(document.documentElement || document.body, { childList: true, subtree: true });

    // Also apply immediately and on resize
    apply();
    const onResize = () => apply();
  window.addEventListener('resize', onResize, { passive: true });
    // Track whether this effect wrote nav variables so cleanup doesn't clear
    // offsets set by other components (e.g., the fixed ticker).
    let didWriteNavVars = false;
    const originalApply = apply;
    const wrappedApply = () => {
      originalApply();
      didWriteNavVars = true;
    };

    // Replace listeners to use the wrapped apply
    window.removeEventListener('resize', onResize);
    window.addEventListener('resize', wrappedApply, { passive: true });

    return () => {
      mo.disconnect();
      window.removeEventListener('resize', wrappedApply);
      if (rafId) cancelAnimationFrame(rafId);
      const docEl = document.documentElement;
      if (docEl) {
        if (didWriteNavVars) {
          // Only clear values if this effect wrote them
          docEl.style.setProperty('--nav-offset', '0px');
          docEl.style.setProperty('--nav-height', '0px');
        }
      }
      if (navEl) navEl.style.top = '';
    };
  }, [navRef]);

  const mobileDrawerStyles = {
    position: 'fixed',
    top: 'calc(var(--nav-offset, 0px) + env(safe-area-inset-top, 0px))',
    left: 0,
    height: 'calc(100dvh - var(--nav-offset, 0px) - env(safe-area-inset-top, 0px) - env(safe-area-inset-bottom, 0px))',
    width: 'min(80vw, 350px)',
    maxWidth: '100vw',
    background: '#EA344F',
    color: '#fff',
    border: '1px solid rgba(0,0,0,0.06)',
    boxShadow: '0 0 15px rgba(0,0,0,0.2)',
    zIndex: 9999,
    transform: drawerOpen ? 'translateX(0)' : 'translateX(-100%)',
    transition: 'transform 0.3s ease-in-out',
    overflowY: 'auto',
    display: 'block',
    willChange: 'transform',
    contain: 'content',
    overscrollBehavior: 'contain'
  };

  return (
    <>

      <nav
        role="navigation"
        ref={navRef}
        style={{
          background: 'linear-gradient(90deg, #3474eaff, #5688f5ff 50%, #4e75f1ff)',
          color: '#fff',
          top: `var(--nav-offset, 0px)`,
          zIndex: 110,
        }}
        className="fixed w-full z-50 shadow-md border-b-4 border-[var(--primary-green)] rounded-none"
      >
  <TradingViewTicker />
  <TopContactBar />
    <div className="max-w-7xl mx-auto px-2 sm:px-4 py-2 flex justify-between items-center">
      <Link to="/" className="flex items-center rotate-logo" style={{ color: '#fff' }}>
              <div className="rounded-full p-1 border-2 border-[var(--primary-green)] bg-white">
                <img
                  src={wiseLogo}
                  alt="Wise Logo"
                  className="wise-logo h-10 sm:h-12 md:h-14 w-auto rounded-full logo-hover"
                  loading="eager"
                  decoding="async"
                  fetchpriority="high"
                />
              </div>
            </Link>

          {/* Desktop Menu */}
      <div className="desktop-menu hidden lg:block font-medium flex-grow animate-fadeIn">
  <div className="nav-scroll w-full flex items-center justify-center gap-4 xl:gap-6" style={{ color: '#fff' }}>

                <Link
                  to="/"
                  className={`nav-item font-semibold text-xs xl:text-base px-2 py-1${location.pathname==='/' ? ' active' : ''}`}
                >
                  <TopIconLabel Icon={topNavIconMap.home} label={translateWithFallback(null, 'home')} vertical />
                </Link>

                <Link
                  to="/search"
                  className={`nav-item font-semibold text-xs xl:text-base px-2 py-1 flex flex-col items-center${location.pathname==='/search' ? ' active' : ''}`}
                  style={{ color: '#fff' }}
                >
                  <TopIconLabel Icon={topNavIconMap.search} label={translateWithFallback(null, 'accessibility.search')} vertical />
                </Link>

                <MegaMenu labelKey="services.title" categories={servicesMenu} location={location} isMobile={false} closeDrawer={closeDrawer} TopIconLabel={TopIconLabel} topNavIconMap={topNavIconMap} verticalIcons textColor="#fff" />

            {dropdownEntriesWithoutMore.map(([key, dropdown]) => (
              <div className="relative group" key={key}>
                <button
                  className={`nav-item font-semibold text-xs xl:text-base px-2 py-1 flex flex-col items-center${dropdown.items.some(item => location.pathname.startsWith(item.path)) ? ' active' : ''}`}
                  style={{ color: '#fff' }}
                  aria-label={`Toggle ${translateWithFallback(null, dropdown.labelKey)} menu`}
                  aria-haspopup="true"
                  aria-expanded={undefined}
                  onKeyDown={(e) => {
                    const menu = e.currentTarget.nextElementSibling;
                    if (!menu) return;
                    const items = menu.querySelectorAll('a');
                    if (e.key === 'ArrowDown') {
                      e.preventDefault();
                      items[0]?.focus();
                    }
                  }}
                >
                  <TopIconLabel Icon={topNavIconMap[key]} label={translateWithFallback(null, dropdown.labelKey)} vertical />
                </button>
                <div className="absolute top-full left-0 mt-0 bg-white/90 backdrop-blur-md border border-[var(--primary-green)] text-black shadow-md z-50 group-hover:flex flex-col min-w-[180px] xl:min-w-[200px] p-2 hidden transition-opacity duration-300 opacity-0 group-hover:opacity-100 group-hover:visible animate-slideDown" role="menu" onKeyDown={(e) => {
                  const links = e.currentTarget.querySelectorAll('a');
                  const first = links[0];
                  const last = links[links.length - 1];
                  if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    if (document.activeElement === last) first?.focus(); else {
                      const i = Array.from(links).indexOf(document.activeElement);
                      links[i + 1]?.focus();
                    }
                  } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    if (document.activeElement === first) last?.focus(); else {
                      const i = Array.from(links).indexOf(document.activeElement);
                      links[i - 1]?.focus();
                    }
                  } else if (e.key === 'Escape') {
                    e.preventDefault();
                    e.currentTarget.previousElementSibling?.focus();
                  }
                }}>
                  {dropdown.items.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`px-3 xl:px-4 py-2 hover:bg-gray-200 text-xs xl:text-sm flex items-center gap-2 transition-all duration-300 ${
                        location.pathname === item.path ? 'text-[var(--primary-green)] font-semibold' : ''
                      }`}
                      role="menuitem"
                      tabIndex={-1}
                    >
                      {translateWithFallback(null, item.labelKey)}
                    </Link>
                  ))}
                </div>
              </div>
            ))}

          {navLinks.map((link) => (
        <Link
          key={link.path}
          to={link.path}
              className={`nav-item font-semibold text-xs xl:text-base px-2 py-1 flex flex-col items-center${location.pathname===link.path ? ' active' : ''}`}
              style={{ color: '#fff' }}
        >
          <TopIconLabel Icon={topNavIconMap[navLinkToIconKey(link.labelKey)]} label={translateWithFallback(null, link.labelKey)} vertical />
        </Link>
      ))}

          {/* Render 'more' dropdown last on desktop */}
            {moreDropdown && (
            <div className="relative group" key="more">
              <button
                className={`nav-item font-semibold text-xs xl:text-base px-2 py-1 flex flex-col items-center${moreDropdown.items.some(item => location.pathname.startsWith(item.path)) ? ' active' : ''}`}
                style={{ color: '#fff' }}
                aria-label={`Toggle ${translateWithFallback(null, moreDropdown.labelKey)} menu`}
                aria-haspopup="true"
              >
                <TopIconLabel Icon={topNavIconMap.more} label={translateWithFallback(null, moreDropdown.labelKey)} vertical />
              </button>
              <div className="absolute top-full left-0 mt-0 bg-white/90 backdrop-blur-md border border-[var(--primary-green)] text-black shadow-md z-50 group-hover:flex flex-col min-w-[180px] xl:min-w-[200px] p-2 hidden transition-opacity duration-300 opacity-0 group-hover:opacity-100 group-hover:visible animate-slideDown" role="menu">
                {moreDropdown.items.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-3 xl:px-4 py-2 hover:bg-gray-200 text-xs xl:text-sm flex items-center gap-2 transition-all duration-300 ${
                      location.pathname === item.path ? 'text-[var(--primary-green)] font-semibold' : ''
                    }`}
                    role="menuitem"
                    tabIndex={-1}
                  >
                    {translateWithFallback(null, item.labelKey)}
                  </Link>
                ))}
              </div>
            </div>
          )}
            </div>
          </div>
            <button
              className="lg:hidden z-[10000] drawer-toggle"
              onClick={() => startTransition(() => setDrawerOpen(prev => !prev))}
              aria-label={drawerOpen ? 'Close mobile menu' : 'Open mobile menu'}
              aria-expanded={drawerOpen}
              aria-controls="mobile-menu"
            >
                <div className={`drawer-toggle ${drawerOpen ? 'open' : ''}`} aria-hidden>
                  {/* When closed show hamburger, when open show close icon (animated via CSS) */}
                  {!drawerOpen ? (
                    <div className={`hamburger ${drawerOpen ? 'open' : ''}`} style={{ minHeight: 44, display: 'inline-flex', alignItems: 'center' }}>
                      <div className="bar" />
                      <div className="bar" />
                      <div className="bar" />
                    </div>
                  ) : (
                    <span className="toggle-icon" style={{ display: 'inline-flex', alignItems: 'center' }}>
                      {typeof MdClose === 'function' ? <MdClose size={20} /> : <IconClose width={20} height={20} />}
                    </span>
                  )}
                </div>
          </button>
        </div>
      </nav>

  {/* Attached alert bar: sticks below the navbar when present */}
  <AlertBar variant="attached" />

      {/* Mobile overlay to close on outside click */}
      {drawerOpen && (
        <div
          onClick={closeDrawer}
          aria-hidden
          style={{
              position: 'fixed',
              // start the overlay below the navbar so the navbar remains interactive
              top: 'calc(var(--nav-offset, 0px) + var(--nav-height, 0px))',
              left: 0,
              width: '100vw',
              height: 'calc(100vh - var(--nav-offset, 0px) - var(--nav-height, 0px))',
              background: 'rgba(0,0,0,0.4)',
              zIndex: 9998,
              opacity: drawerOpen ? 1 : 0,
              transition: 'opacity 0.25s ease'
          }}
        />
      )}

      {/* Redesigned Mobile Menu */}
  <div style={mobileDrawerStyles} ref={drawerRef} className={`mobile-menu ${drawerOpen ? 'open' : ''}`} id="mobile-menu" role="dialog" aria-modal="true" aria-labelledby="mobile-menu-title">
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header: logo + title + close */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 44, height: 44, borderRadius: 10, overflow: 'hidden', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src={wiseLogo} alt="Wise" style={{ width: 36, height: 36, objectFit: 'cover' }} />
          </div>
          <div style={{ fontWeight: 700, fontSize: 16, color: '#fff' }}>Menu</div>
        </div>
  <button aria-label="Close menu" onClick={closeDrawer} style={{ background: 'transparent', border: 'none', padding: 8, color: '#fff' }}>
          {/* Use react-icons where possible; fall back to inline IconClose when necessary */}
          {typeof MdClose === 'function' ? <MdClose size={20} /> : <IconClose width={20} height={20} />}
        </button>
      </div>

      {/* Content: scrollable lists */}
      <div style={{ padding: 12, overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* Home */}
  <button onClick={() => { closeDrawer(); navigate('/'); }} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '10px 12px', borderRadius: 10, background: 'transparent', border: 'none', color: '#fff' }}>
          <div style={{ width: 40, height: 40, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.04)' }}>
            {typeof MdHome === 'function' ? <MdHome size={18} style={{ color: '#fff' }} /> : <IconHome width={18} height={18} style={{ color: '#fff' }} />}
          </div>
          <div style={{ fontWeight: 600 }}>{translateWithFallback(null, 'home')}</div>
        </button>

        <div style={{ height: 1, background: 'rgba(128,128,128,0.12)', borderRadius: 2 }} />

        {/* Services collapsible */}
        <div>
          <details open={servicesMobileOpen} onToggle={(e) => setServicesMobileOpen(e.target.open)}>
              <summary style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 10, cursor: 'pointer', listStyle: 'none', color: 'var(--primary-green)' }}>
              <div style={{ width: 40, height: 40, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.04)' }}>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none"><path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zM13 21h8v-10h-8v10zm0-18v6h8V3h-8z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </div>
              <div style={{ fontWeight: 700 }}>{translateWithFallback(null, 'services.title')}</div>
              <span style={{ marginLeft: 'auto' }}>{typeof MdChevronRight === 'function' ? <MdChevronRight size={18} style={{ transform: servicesMobileOpen ? 'rotate(90deg)' : 'none', transition: 'transform .18s' }} /> : <IconChevron rotate={servicesMobileOpen} />}</span>
            </summary>
            <div style={{ paddingLeft: 8, paddingTop: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {servicesMenu.map((cat) => (
                <div key={cat.labelKey}>
                  <div style={{ fontWeight: 700, color: 'var(--primary-green)', padding: '6px 8px', fontSize: 13 }}>{translateWithFallback(null, cat.labelKey)}</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {cat.items.map(item => (
                      <Link key={item.path} to={item.path} onClick={closeDrawer} style={{ padding: '8px 10px', borderRadius: 8, color: '#fff', textDecoration: 'none', display: 'block' }}>{translateWithFallback(null, item.labelKey)}</Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </details>
        </div>

        {/* Other dropdowns rendered as grouped links */}
        {dropdownEntriesWithoutMore.map(([key, dropdown]) => (
          <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ fontWeight: 700, padding: '6px 8px', color: 'var(--primary-green)' }}>{translateWithFallback(null, dropdown.labelKey)}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {dropdown.items.map(item => (
                <Link key={item.path} to={item.path} onClick={closeDrawer} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 8, color: '#fff', textDecoration: 'none' }}>{translateWithFallback(null, item.labelKey)}</Link>
              ))}
            </div>
          </div>
        ))}

        {/* Quick actions: search + contact + navLinks */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 6 }}>
          <Link to="/search" onClick={closeDrawer} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 8, color: '#fff', textDecoration: 'none' }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.04)' }}>
              {typeof MdSearch === 'function' ? <MdSearch size={18} style={{ color: '#fff' }} /> : <IconSearch />}
            </div>
            <div>{translateWithFallback(null, 'accessibility.search')}</div>
          </Link>
          {navLinks.map(link => (
            <Link key={link.path} to={link.path} onClick={closeDrawer} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 8, color: '#fff', textDecoration: 'none' }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.04)' }}>{link.path === '/payment' ? (typeof MdCreditCard === 'function' ? <MdCreditCard size={18} style={{ color: '#fff' }} /> : <IconCard />) : (typeof MdChevronRight === 'function' ? <MdChevronRight size={18} style={{ color: '#fff' }} /> : <IconChevron />)}</div>
              <div>{translateWithFallback(null, link.labelKey)}</div>
            </Link>
          ))}
        </div>

        {/* Social row */}
        <SocialIconsRow className="mt-2 gap-2" iconClass="text-white" size="w-9 h-9" />
      </div>
    </div>
  </div>
    </>
  );
}

export default Navbar;