import React from 'react';

// Simple humanize fallback for translation keys like 'navbar.home' -> 'Home'
function humanizeKey(key) {
  if (!key || typeof key !== 'string') return '';
  const parts = key.split(/[./]/);
  let last = parts[parts.length - 1];
  last = last.replace(/[-_]/g, ' ');
  last = last.replace(/([a-z])([A-Z])/g, '$1 $2');
  const words = last.split(/[^A-Za-z0-9]+/).filter(Boolean);
  return words.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

// Minimal useTranslation hook compatible surface used across the app.
export function useTranslation() {
  const t = (key, options) => {
    if (!key) return '';
    // If the key is already plain text, return it.
    if (!key.includes('.')) return key;
    return humanizeKey(key);
  };
  return { t, i18n: { language: 'en' } };
}

// Simple Trans component that renders children (falling back to children when no translation is provided).
export const Trans = ({ children }) => <>{children}</>;
