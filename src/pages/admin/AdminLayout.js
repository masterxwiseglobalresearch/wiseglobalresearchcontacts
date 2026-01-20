import React, { Suspense, useState } from 'react';
import { textColor, background } from '../../themeFallbacks';
import { Trans } from '../../i18nShim';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { FaTachometerAlt, FaEnvelope, FaExclamationCircle, FaChartBar, FaSignOutAlt, FaComments, FaHome, FaAppStore } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase';
import { toast } from 'react-toastify';
import { useAdmin } from '../../hooks/useAdmin';
import AdminHeader from './AdminHeader.js';

import '../../styles/admin.css';

// Unified animation variants consistent with site pages
const fadeIn = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const AdminLayout = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const { isAdmin, isSupport, isHrOnly, isSeoOnly, checking } = useAdmin();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const idleTimeoutRef = React.useRef();

  React.useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate('/user-login');
      }
    });
    return () => unsubscribeAuth();
  }, [navigate]);

  const handleLogout = React.useCallback(() => {
    signOut(auth)
      .then(() => {
        localStorage.removeItem('isAuthenticated');
        toast.success('Logged out successfully.', { position: 'top-center' });
        navigate('/user-login');
      })
      .catch((error) => {
        toast.error(`Logout failed: ${error.message}`, { position: 'top-center' });
      });
  }, [navigate]);

  const handleGoHome = () => {
    signOut(auth)
      .then(() => {
        localStorage.removeItem('isAuthenticated');
        navigate('/');
      })
      .catch((error) => {
        toast.error(`Error: ${error.message}`, { position: 'top-center' });
      });
  };

  React.useEffect(() => {
    if (checking || (!isAdmin && !isHrOnly)) return;
    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'];
    const resetTimer = () => {
      if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
      idleTimeoutRef.current = setTimeout(() => handleLogout(), 5 * 60 * 1000);
    };
    events.forEach((e) => window.addEventListener(e, resetTimer));
    resetTimer();
    return () => {
      if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
      events.forEach((e) => window.removeEventListener(e, resetTimer));
    };
  }, [checking, isAdmin, isHrOnly, handleLogout]);

  const getPageTitle = () => {
    const path = location.pathname;
    const item = allNav.find(navItem => navItem.path === path);
    return item ? item.label : 'Dashboard';
  };

  if (checking) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  const allNav = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: <FaTachometerAlt /> },
    { path: '/admin/contacts', label: 'Contact Submissions', icon: <FaEnvelope /> },
    { path: '/admin/home-contacts', label: 'Home Page Contacts', icon: <FaEnvelope /> },
    // { path: '/admin/popups', label: 'Popup Submissions', icon: <FaBullhorn /> },
    { path: '/admin/complaint-box', label: 'Complaint Box Submission', icon: <FaExclamationCircle /> },
    { path: '/admin/complaints', label: 'Complaint Manager', icon: <FaExclamationCircle /> },
    { path: '/admin/reports', label: 'Report Manager', icon: <FaChartBar /> },
    { path: '/admin/app-service', label: 'App Service', icon: <FaAppStore /> },
    { path: '/admin/chatbot-data', label: 'Chatbot Data', icon: <FaComments /> },
    { path: '/admin/a11y-feedback', label: 'A11y Feedback', icon: <FaComments /> },
    { path: '/admin/jobs', label: 'Jobs', icon: <FaComments /> },
  ];

  const supportNav = allNav.filter(item => ['/admin/reports', '/admin/complaint-box', '/admin/complaints', '/admin/app-service'].includes(item.path));
  const hrNav = allNav.filter(item => item.path === '/admin/jobs');
  const seoNav = allNav.filter(item => item.path === '/admin/dashboard');
  const navItems = isAdmin
    ? allNav
    : isHrOnly
    ? hrNav
    : isSupport
    ? supportNav
    : isSeoOnly
    ? seoNav
    : [];

  const sidebarVariants = {
    open: { x: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
    closed: { x: '-100%', transition: { type: 'spring', stiffness: 300, damping: 30 } },
  };

  const Sidebar = () => (
    <motion.aside
      variants={sidebarVariants}
      initial="closed"
      animate="open"
      exit="closed"
      className="absolute top-0 left-0 h-full p-4 flex flex-col z-20 md:relative md:translate-x-0 admin-sidebar-wrapper card-box"
      style={{ background: 'var(--bg-transparent, rgba(255,255,255,0.06))', backdropFilter: 'blur(8px)', borderRight: '1px solid var(--bg-border, rgba(255,255,255,0.08))' }}
    >
      <h2 className="text-2xl font-bold mb-4 text-center heading-purple">
        <Trans i18nKey="pages.admin_AdminLayout.admin-panel">Admin Panel</Trans>
      </h2>
      {/* admin popup launcher removed from sidebar; use dashboard placement instead */}
  <nav className="flex flex-col space-y-2 flex-grow overflow-y-auto pr-1 -mr-1" aria-label="Admin navigation">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            title={item.label}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `group w-full min-w-0 flex items-center gap-3 px-3.5 py-2.5 rounded-lg transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 ${
                isActive ? 'bg-[var(--accent)] text-black shadow-lg' : 'hover:bg-black/5 text-black'
              }`
            }
          >
            <span className="shrink-0" aria-hidden="true">{item.icon}</span>
            <span className="truncate whitespace-nowrap overflow-hidden text-ellipsis flex-1 min-w-0">{item.label}</span>
          </NavLink>
        ))}
      </nav>
      <motion.button
        onClick={handleGoHome}
        className="mt-4 mb-2 w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors btn-purple"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <FaHome />
        <span><Trans i18nKey="pages.admin_AdminLayout.home">Home</Trans></span>
      </motion.button>
      <motion.button
        onClick={handleLogout}
        className="w-full flex items-center justify-center gap-3 px-4 py-2 rounded-lg transition-colors border border-red-200 text-red-700 bg-red-50 hover:bg-red-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <FaSignOutAlt />
        <span><Trans i18nKey="pages.admin_AdminLayout.logout">Logout</Trans></span>
      </motion.button>
    </motion.aside>
  );

  return (
    <motion.div
      className="flex min-h-screen font-sans admin-container"
      style={{ background: background, color: textColor, transition: 'background 0.5s ease-in-out, color 0.5s ease-in-out' }}
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <div
              className="fixed inset-0 z-10 md:hidden admin-overlay-backdrop"
              onClick={() => setSidebarOpen(false)}
              role="button"
              aria-label="Close sidebar"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Escape') setSidebarOpen(false); }}
            ></div>
            <Sidebar />
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex admin-sidebar-wrapper">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col text-adaptive">
        <AdminHeader 
          pageTitle={getPageTitle()} 
          toggleSidebar={() => setSidebarOpen(!isSidebarOpen)} 
        />
        <motion.main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto admin-main" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.00))' }} variants={fadeIn}>
          <Suspense fallback={
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500"></div>
            </div>
          }>
            <Outlet />
          </Suspense>
        </motion.main>
      </div>
    </motion.div>
  );
};

export default AdminLayout;