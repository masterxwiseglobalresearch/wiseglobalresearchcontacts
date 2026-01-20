import React from 'react';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
};

const Layout = ({ children }) => (
  <motion.div
    className="min-h-screen bg-transparent py-12 px-4 sm:px-6 lg:px-8"
    initial="hidden"
    animate="visible"
    variants={containerVariants}
  >
    {children}
  </motion.div>
);

export default Layout;
