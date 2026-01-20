// src/components/TimeBasedThemeWrapper.js
import React, { useEffect } from 'react';
import { gradients, theme } from '../themeFallbacks';


const TimeBasedThemeWrapper = ({ children }) => {

  const { background: themeBackground } = gradients[theme] || gradients.default;

  // default background (light subtle gradient) when no theme background provided
  const defaultBackground = 'linear-gradient(to right, #f7fafc, #eef2f7)';

  // If theme provides a background, use it; otherwise use the default image with a dark overlay color fallback
  const background = themeBackground || defaultBackground;

  useEffect(() => {
    // Apply background with sensible positioning and fallback.
    // NOTE: Do not write global text color here — we must not change
    // document/body text color from a theme so icons/text aren't overridden.
    document.body.style.background = background;
    document.body.style.backgroundRepeat = 'no-repeat';
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center center';
    // Intentionally avoid setting document.body.style.color
  }, [background]);

  return (
    <div
      style={{
        position: 'relative',
        transition: '0.6s ease-in-out',
        minHeight: '100vh',
        zIndex: 0,
        overflow: 'hidden',
      }}
    >
  {/* Removed image-based overlay as requested */}

      {/* 🧠 Actual Content */}
      <div style={{ position: 'relative', zIndex: 2 }}>{children}</div>
    </div>
  );
};

export default TimeBasedThemeWrapper;