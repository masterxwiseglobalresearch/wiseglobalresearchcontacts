// NavbarIcons.js
// Centralized icon and label helpers for Navbar
import React from 'react';
import { MdHome, MdSearch, MdCreditCard, MdMiscellaneousServices, MdBusiness, MdGroup, MdArticle, MdAccessibility, MdDashboard, MdMoreHoriz, MdReport, MdContactMail, MdLibraryBooks } from 'react-icons/md';

// Fallback SVG icons for environments where react-icons is not available
export function IconChevron({ rotate = false, ...props }) {
  return (
    <svg viewBox="0 0 24 24" width={props.width || 18} height={props.height || 18} style={{ transform: rotate ? 'rotate(90deg)' : 'none', ...props.style }} fill="none" aria-hidden><path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
  );
}
export function IconSearch(props) {
  return (
    <svg viewBox="0 0 24 24" width={props.width || 18} height={props.height || 18} fill="none" aria-hidden><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" /><path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
  );
}
export function IconCard(props) {
  return (
    <svg viewBox="0 0 24 24" width={props.width || 18} height={props.height || 18} fill="none" aria-hidden><rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2" /><path d="M2 10h20" stroke="currentColor" strokeWidth="2" /></svg>
  );
}

// Top nav icon map for desktop and mobile
export const topNavIconMap = {
  home: typeof MdHome === 'function' ? MdHome : null,
  services: typeof MdMiscellaneousServices === 'function' ? MdMiscellaneousServices : null,
  company: typeof MdBusiness === 'function' ? MdBusiness : null,
  hrZone: typeof MdGroup === 'function' ? MdGroup : null,
  insights: typeof MdArticle === 'function' ? MdArticle : null,
  accessibility: typeof MdAccessibility === 'function' ? MdAccessibility : null,
  dashboard: typeof MdDashboard === 'function' ? MdDashboard : null,
  more: typeof MdMoreHoriz === 'function' ? MdMoreHoriz : null,
  payment: typeof MdCreditCard === 'function' ? MdCreditCard : null,
  complaint: typeof MdReport === 'function' ? MdReport : null,
  contact: typeof MdContactMail === 'function' ? MdContactMail : null,
  reports: typeof MdLibraryBooks === 'function' ? MdLibraryBooks : null,
  search: typeof MdSearch === 'function' ? MdSearch : null,
};

// Label + icon for nav items
// TopIconLabel: icon above label (vertical stack) for navbar
export function TopIconLabel({ Icon, label, vertical = true }) {
  if (!Icon) return <span>{label}</span>;
  if (vertical) {
    return (
      <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, minWidth: 40 }}>
        <Icon size={22} style={{ marginBottom: 2 }} />
        <span style={{ fontSize: 13, fontWeight: 500, marginTop: 2 }}>{label}</span>
      </span>
    );
  }
  // fallback: horizontal
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
      <Icon size={18} style={{ marginRight: 2 }} />
      <span>{label}</span>
    </span>
  );
}
