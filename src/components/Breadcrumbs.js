import React from 'react';
import { Link, useLocation } from 'react-router-dom';


// Map route segments to human-friendly labels
const LABELS = {
  '': 'Home',
  home: 'Home',
  about: 'About Us',
  services: 'Services',
  contact: 'Contact',
  payment: 'Payment',
  'research-reports': 'Research Reports',
  blogs: 'Blogs',
  'market-news': 'Market News',
  career: 'Careers',
  'grievance-redressal-process': 'Grievance Redressal Process',
  'complaint-data': 'Complaint Data',
  complaint: 'Complaint Box',
  legal: 'Disclaimer',
  disclosure: 'Disclosure',
  privacy: 'Privacy Policy',
  refund: 'Refund Policy',
  terms: 'Terms & Conditions',
  team: 'Team',
  vision: 'Vision & Mission',
  guide: 'Guide for Investing',
  daily: 'Daily Recommendation',
  'client-service-consent-form': 'Client Service Consent',
  'investor-chart': 'Investor Chart',
  'investor-charter': 'Investor Charter',
  'anti-money-laundering': 'Anti Money Laundering',
  accessibility: 'Accessibility',
  'accessibility-statement': 'Accessibility Statement',
  'accessibility-feedback': 'Accessibility Feedback',
};

function segmentLabel(seg) {
  if (LABELS[seg] !== undefined) return LABELS[seg];
  // Fallback: humanize
  const words = seg.split(/[-_]+/).filter(Boolean);
  return words.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

export default function Breadcrumbs() {
  const location = useLocation();

  const parts = location.pathname.replace(/^\/+|\/+$/g, '').split('/');
  const isRoot = location.pathname === '/' || parts[0] === '';

  if (isRoot) return null; // hide on home

  let pathAcc = '';
  const items = [{ label: 'Home', to: '/' }].concat(
    parts.map((seg, i) => {
      pathAcc += `/${seg}`;
      return { label: segmentLabel(seg), to: i === parts.length - 1 ? null : pathAcc };
    })
  );

  return (
    <nav
      aria-label="Breadcrumb"
      role="navigation"
      className="mb-1 text-sm"
      // reduce the gap from the nav/alert; keep it tied to nav vars but start closer
  style={{ marginTop: 'calc(max(var(--nav-height, 0px), var(--nav-offset, 0px)) + 10px)' }}
    >
      <ol className="flex flex-wrap items-center gap-1" style={{ color: '#111111' }}>
        {items.map((item, idx) => (
          <li key={`${item.label}-${idx}`} className="flex items-center gap-1">
            {item.to ? (
              <Link
                to={item.to}
                className="underline focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400"
                style={{ color: '#111111' }}
              >
                {item.label}
              </Link>
            ) : (
              <span aria-current="page" style={{ color: '#111111' }}>{item.label}</span>
            )}
            {idx < items.length - 1 && (
              <span aria-hidden="true" style={{ color: '#111111', opacity: 0.6 }}>/</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
