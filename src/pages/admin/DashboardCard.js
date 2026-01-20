import React from 'react';
import QrImageManageButton from '../../components/QrImageManageButton';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const DashboardCard = ({ icon, title, value, color, to, onClick, showQrManageButton, onQrManageClick }) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };
  // Tailwind doesn't support arbitrary dynamic class names like `bg-${color}-500` at runtime.
  // Map supported color tokens to explicit class strings so PurgeCSS/Tailwind keep them.
  const colorMap = {
    blue: { bg: 'bg-blue-500/20', text: 'text-blue-400' },
    cyan: { bg: 'bg-cyan-500/20', text: 'text-cyan-400' },
    purple: { bg: 'bg-purple-500/20', text: 'text-purple-400' },
    red: { bg: 'bg-red-500/20', text: 'text-red-400' },
    rose: { bg: 'bg-rose-500/20', text: 'text-rose-400' },
    emerald: { bg: 'bg-emerald-500/20', text: 'text-emerald-400' },
    yellow: { bg: 'bg-yellow-500/20', text: 'text-yellow-400' },
    indigo: { bg: 'bg-indigo-500/20', text: 'text-indigo-400' },
    // fallback
    default: { bg: 'bg-gray-500/10', text: 'text-gray-400' },
  };

  const token = colorMap[color] || colorMap.default;

  const formatNumber = (n) => {
    if (n === null || n === undefined) return '-';
    if (typeof n !== 'number') return n;
    if (Math.abs(n) >= 1000000) return (n / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    if (Math.abs(n) >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    return String(n);
  };

  const Content = (
    <motion.div
      className={`p-4 sm:p-6 rounded-2xl shadow-2xl border-2 border-indigo-100 bg-white flex items-center sm:items-center space-x-3 sm:space-x-4 hover:shadow-indigo-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-400 w-full transition`}
      variants={cardVariants}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className={`flex-shrink-0 flex items-center justify-center rounded-full ${token.bg} ${token.text} w-12 h-12 sm:w-14 sm:h-14 text-2xl sm:text-3xl shadow`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-indigo-700 truncate">{title}</p>
        <p className="text-2xl sm:text-3xl font-extrabold text-indigo-900 mt-1 truncate">{formatNumber(value)}</p>
      </div>
      {showQrManageButton && (
        <div className="ml-auto">
          <QrImageManageButton onClick={onQrManageClick} />
        </div>
      )}
    </motion.div>
  );

  return to ? (
    <Link to={to} onClick={onClick} aria-label={title} className="block">
      {Content}
    </Link>
  ) : (
    <div onClick={onClick} role="button" aria-label={title} className="block">
      {Content}
    </div>
  );
};

export default DashboardCard;
