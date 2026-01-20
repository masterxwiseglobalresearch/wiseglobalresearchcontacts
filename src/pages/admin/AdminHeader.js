import React from 'react';
import { FaBars } from 'react-icons/fa';
import { motion } from 'framer-motion';

import '../../styles/admin.css';

const AdminHeader = ({ pageTitle, toggleSidebar }) => {

  return (
    <header
      className="admin-header sticky top-0 z-10 flex items-center justify-between"
      style={{ padding: '1rem', background: 'var(--bg-transparent)', color: 'var(--text-body)' }}
      role="banner"
    >
      {/* Mobile Sidebar Toggle */}
      <button onClick={toggleSidebar} className="md:hidden toggle-btn text-2xl" aria-label="Open sidebar">
        <FaBars />
      </button>

      {/* Page Title */}
      <motion.h1
        key={pageTitle}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="text-xl sm:text-2xl font-semibold"
        style={{ color: 'var(--text-body)' }}
      >
        {pageTitle}
      </motion.h1>

      {/* Placeholder for other header items like user avatar, notifications etc */}
      <div className="w-8" aria-hidden="true"></div>
    </header>
  );
};

export default AdminHeader;
