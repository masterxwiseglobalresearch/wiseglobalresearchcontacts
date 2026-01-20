import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = () => (
  <motion.div
    className="flex justify-center items-center py-6"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
  >
    <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
  </motion.div>
);

export default LoadingSpinner;