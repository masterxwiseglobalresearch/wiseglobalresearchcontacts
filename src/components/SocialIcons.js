// src/components/SocialIcons.js
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn, FaYoutube } from 'react-icons/fa';

// Centralized social icon data for reuse
export const SOCIAL_ICONS = [
  { icon: FaFacebookF, bg: 'bg-blue-600', link: 'https://www.facebook.com/wiseglobalresearch/', label: 'Facebook' },
  { icon: FaInstagram, bg: 'bg-pink-500', link: 'https://www.instagram.com/wiseglobalresearch/', label: 'Instagram' },
  { icon: FaTwitter, bg: 'bg-sky-500', link: 'https://x.com/research221711', label: 'Twitter' },
  { icon: FaLinkedinIn, bg: 'bg-blue-800', link: 'https://www.linkedin.com/in/wise-global-research-services-63b535317/', label: 'LinkedIn' },
  { icon: FaYoutube, bg: 'bg-red-600', link: 'https://www.youtube.com/@WiseGlobalResearchService', label: 'YouTube' },
];

// Reusable SocialIcons row component
export function SocialIconsRow({ className = '', iconClass = 'text-white', size = 'w-11 h-11', gap = 'gap-4', style = {}, ...props }) {
  return (
    <div className={`flex justify-center ${gap} ${className}`} style={style} {...props}>
      {SOCIAL_ICONS.map(({ icon: Icon, bg, link, label }, i) => (
        <a
          key={i}
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className={`${size} inline-flex items-center justify-center rounded-full ${iconClass} ${bg} shadow-lg hover:scale-105 transition-transform duration-200`}
          aria-label={label}
        >
          <Icon aria-hidden="true" />
          <span className="sr-only">{label}</span>
        </a>
      ))}
    </div>
  );
}
