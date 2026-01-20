
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaHome,
  FaInfoCircle,
  FaUniversalAccess,
  FaCommentDots,
  FaMoneyCheckAlt,
  FaBlog,
  FaBriefcase,
  FaUserShield,
  FaHandshake,
  FaExclamationTriangle,
  FaPhoneAlt,
  FaDatabase,
  FaEye,
  FaBalanceScale,
  FaChartPie,
  FaChartBar,
  FaStar,
  FaGavel,
  FaBookOpen,
  FaBolt,
  FaLightbulb,
  FaInfinity,
  FaChartArea,
  FaLandmark,
  FaNewspaper,
  FaCrown,
  FaVideo,
  FaCreditCard,
  FaUserSecret,
  FaThumbsUp,
  FaUndo,
  FaFileAlt,
  FaSearch,
  FaServicestack,
  FaMoneyBillWave,
  FaRocket,
  FaLayerGroup,
  FaCube,
  FaUserLock,
  FaEye as FaEye2
} from 'react-icons/fa';

const pageFiles = [
  { path: '/', name: 'Home', icon: <FaHome className="text-indigo-600" /> },
  { path: '/about', name: 'About', icon: <FaInfoCircle className="text-indigo-600" /> },
  { path: '/accessibility-statement', name: 'Accessibility Statement', icon: <FaUniversalAccess className="text-indigo-600" /> },
  { path: '/accessibility-feedback', name: 'Accessibility Feedback', icon: <FaCommentDots className="text-indigo-600" /> },
  { path: '/anti-money-laundering', name: 'Anti Money Laundering', icon: <FaMoneyCheckAlt className="text-indigo-600" /> },
  { path: '/blogs', name: 'Blogs', icon: <FaBlog className="text-indigo-600" /> },
  { path: '/career', name: 'Career', icon: <FaBriefcase className="text-indigo-600" /> },
  { path: '/client-panel', name: 'Client Panel', icon: <FaUserShield className="text-indigo-600" /> },
  { path: '/client-service-consent-form', name: 'Client Service Consent', icon: <FaHandshake className="text-indigo-600" /> },
  { path: '/complaint', name: 'Complaint', icon: <FaExclamationTriangle className="text-indigo-600" /> },
  { path: '/complaint-data', name: 'Complaint Data', icon: <FaDatabase className="text-indigo-600" /> },
  { path: '/contact', name: 'Contact', icon: <FaPhoneAlt className="text-indigo-600" /> },
  { path: '/disclosure', name: 'Disclosure', icon: <FaEye className="text-indigo-600" /> },
  { path: '/EvaluationIndexOptions', name: 'Evaluation Index Options', icon: <FaBalanceScale className="text-indigo-600" /> },
  { path: '/EvaluationStockCash', name: 'Evaluation Stock Cash', icon: <FaChartPie className="text-indigo-600" /> },
  { path: '/EvaluationStockOption', name: 'Evaluation Stock Option', icon: <FaChartBar className="text-indigo-600" /> },
  { path: '/GalaxyMCX', name: 'Galaxy MCX', icon: <FaStar className="text-indigo-600" /> },
  { path: '/grievance-redressal-process', name: 'Grievance Redressal Process', icon: <FaGavel className="text-indigo-600" /> },
  { path: '/guide', name: 'Guide For Investing', icon: <FaBookOpen className="text-indigo-600" /> },
  { path: '/ImpulseIndexOptions', name: 'Impulse Index Options', icon: <FaBolt className="text-indigo-600" /> },
  { path: '/ImpulseOption', name: 'Impulse Option', icon: <FaLightbulb className="text-indigo-600" /> },
  { path: '/InfinityClub', name: 'Infinity Club', icon: <FaInfinity className="text-indigo-600" /> },
  { path: '/investor-chart', name: 'Investor Chart', icon: <FaChartArea className="text-indigo-600" /> },
  { path: '/disclaimer', name: 'Disclaimer', icon: <FaLandmark className="text-indigo-600" /> },
  { path: '/market-news', name: 'Market News', icon: <FaNewspaper className="text-indigo-600" /> },
  { path: '/MCXSupreme', name: 'MCX Supreme', icon: <FaCrown className="text-indigo-600" /> },
  { path: '/media', name: 'Media', icon: <FaVideo className="text-indigo-600" /> },
  { path: '/notfound', name: 'Not Found', icon: <FaFileAlt className="text-indigo-600" /> },
  { path: '/payment', name: 'Payment Info', icon: <FaCreditCard className="text-indigo-600" /> },
  { path: '/privacy', name: 'Privacy', icon: <FaUserSecret className="text-indigo-600" /> },
  { path: '/recommendation', name: 'Recommendation', icon: <FaThumbsUp className="text-indigo-600" /> },
  { path: '/refund', name: 'Refund', icon: <FaUndo className="text-indigo-600" /> },
  { path: '/research-reports', name: 'Reports', icon: <FaFileAlt className="text-indigo-600" /> },
  { path: '/search', name: 'Search', icon: <FaSearch className="text-indigo-600" /> },
  { path: '/services', name: 'Services', icon: <FaServicestack className="text-indigo-600" /> },
  { path: '/SmartCash', name: 'Smart Cash', icon: <FaMoneyBillWave className="text-indigo-600" /> },
  { path: '/SmartFuture', name: 'Smart Future', icon: <FaRocket className="text-indigo-600" /> },
  { path: '/services/smart-index-option', name: 'Smart Index Option', icon: <FaLayerGroup className="text-indigo-600" /> },
  { path: '/SmartOptions', name: 'Smart Options', icon: <FaCube className="text-indigo-600" /> },
  { path: '/terms', name: 'Terms', icon: <FaUserLock className="text-indigo-600" /> },
  { path: '/UniversalCash', name: 'Universal Cash', icon: <FaMoneyBillWave className="text-indigo-600" /> },
  { path: '/admin-login', name: 'Admin Login', icon: <FaUserSecret className="text-indigo-600" /> },
  { path: '/vision', name: 'Vision', icon: <FaEye2 className="text-indigo-600" /> }
];

function Sitemap() {
  const [search, setSearch] = useState('');
  const filteredPages = pageFiles.filter(
    (page) =>
      page.name.toLowerCase().includes(search.toLowerCase()) ||
      page.path.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 py-6 sm:py-10">
      <h1 className="text-3xl sm:text-4xl font-extrabold mb-6 sm:mb-8 text-center text-indigo-700">Sitemap</h1>
      <div className="flex justify-center mb-6 sm:mb-8 w-full">
        <input
          id="sitemap-search"
          name="sitemap-search"
          type="text"
          placeholder="Search pages..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full max-w-xs sm:max-w-md md:max-w-lg px-3 sm:px-4 py-2 bg-white border border-indigo-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base sm:text-lg text-black placeholder-gray-500"
          aria-label="Search sitemap"
        />
      </div>
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
        {filteredPages.map((page, idx) => (
          <Link
            key={idx}
            to={page.path}
            className="flex flex-col items-center justify-center p-4 sm:p-6 bg-white rounded-2xl shadow-2xl hover:scale-105 hover:bg-indigo-50 transition-all duration-300 min-h-[120px] sm:min-h-[150px] w-full"
            style={{ border: '2px solid #6366f1' }}
          >
            <div className="mb-2 sm:mb-3 text-2xl sm:text-3xl text-indigo-600">{page.icon || <FaFileAlt className="text-indigo-600" />}</div>
            <span className="text-base sm:text-lg font-semibold text-black text-center break-words">{page.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Sitemap;

