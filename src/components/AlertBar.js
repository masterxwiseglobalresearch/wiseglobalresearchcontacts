import React from 'react';
import { motion } from 'framer-motion';
import { ALERT_BILINGUAL } from '../constants/alertMessage';

const AlertBar = ({ variant = 'attached' }) => {
  const message = ALERT_BILINGUAL;

  // Respect both OS preference and app-level `data-reduce-motion` toggle.
  const [prefersReduced, setPrefersReduced] = React.useState(() => {
    if (typeof window === 'undefined') return false;
    const media = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false;
    const app = document.documentElement && document.documentElement.getAttribute('data-reduce-motion') === 'true';
    return !!(media || app);
  });

  React.useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const mql = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
    const update = () => {
      const mediaVal = mql ? mql.matches : false;
      const appVal = document.documentElement && document.documentElement.getAttribute('data-reduce-motion') === 'true';
      setPrefersReduced(!!(mediaVal || appVal));
    };

    if (mql) {
      if (mql.addEventListener) mql.addEventListener('change', update);
      else if (mql.addListener) mql.addListener(update);
    }

    // Observe app-level attribute changes on <html>
    const obs = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === 'attributes' && m.attributeName === 'data-reduce-motion') {
          update();
          break;
        }
      }
    });
    try {
      obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-reduce-motion'] });
    } catch (e) {
      // fall back silently
    }

    // initial read
    update();

    return () => {
      if (mql) {
        if (mql.removeEventListener) mql.removeEventListener('change', update);
        else if (mql.removeListener) mql.removeListener(update);
      }
      obs.disconnect();
    };
  }, []);

  // Animate the container by 50% of its own width. Since the container holds the message twice,
  // this creates a perfect, seamless loop.
  const marqueeAnimate = !prefersReduced ? { x: ['0%', '-50%'] } : { x: 0 };
  const marqueeTransition = !prefersReduced ? { duration: 40, repeat: Infinity, ease: 'linear' } : { duration: 0 };

  const [navHeight, setNavHeight] = React.useState(0);
  React.useEffect(() => {
    if (variant !== 'attached' || typeof window === 'undefined') return;

    let rafId = null;
    const nav = document.querySelector('nav[role="navigation"]');

    const updateNavHeight = () => {
      const h = nav ? Math.round(nav.getBoundingClientRect().height) : 0;
      setNavHeight(h);
      rafId = null;
    };

    const scheduleUpdate = () => {
      if (rafId === null) {
        rafId = requestAnimationFrame(updateNavHeight);
      }
    };

    scheduleUpdate();

    const resizeObserver = new ResizeObserver(scheduleUpdate);
    if (nav) {
      resizeObserver.observe(nav);
    }
    window.addEventListener('resize', scheduleUpdate, { passive: true });

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('resize', scheduleUpdate);
      if (nav) resizeObserver.unobserve(nav);
    };
  }, [variant]);

  const isAttached = variant === 'attached';
  const alertBackground = '#ff6551f6';
  const alertBorderTop = '#ff6551f6';

  const [shouldRender, setShouldRender] = React.useState(true);
  React.useEffect(() => {
    if (typeof document !== 'undefined') {
      if (document.getElementById('wise-global-alert') || document.documentElement.dataset.wiseAlert) {
        setShouldRender(false);
      } else {
        document.documentElement.dataset.wiseAlert = 'true';
      }
    }
    return () => {
      if (typeof document !== 'undefined') {
        delete document.documentElement.dataset.wiseAlert;
      }
    };
  }, []);

  if (!shouldRender) return null;

  return (
    <div
      id="wise-global-alertbar"
      className="w-screen left-0 right-0 notranslate overflow-hidden"
      translate="no"
      style={{
        position: isAttached ? 'sticky' : 'static',
        // Include any space reserved for the fixed ticker via CSS variable
        top: isAttached ? `calc(var(--nav-offset, 0px) + ${navHeight}px + var(--ticker-height, 0px))` : 'auto',
        zIndex: 49,
        backgroundColor: alertBackground,
        borderTop: `4px solid ${alertBorderTop}`,
        color: 'white',
        minHeight: 44,
      }}
      role="status"
      aria-live="polite"
    >
      <motion.div
        className="inline-flex whitespace-nowrap items-center text-sm md:text-base will-change-transform transform-gpu py-2 lg:py-2"
        style={{ paddingLeft: '1rem', paddingRight: '1rem' }}
        animate={marqueeAnimate}
        transition={marqueeTransition}
      >
        {/* The message is duplicated with padding to create a seamless loop. */}
        <span className="shrink-0 px-8">{message}</span>
        <span className="shrink-0 px-8" aria-hidden="true">{message}</span>
      </motion.div>
    </div>
  );
};

export default AlertBar;