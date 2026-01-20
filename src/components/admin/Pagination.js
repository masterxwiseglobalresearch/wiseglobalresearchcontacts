import React from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

const buttonVariants = {
  hover: { scale: 1.05, boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)' },
  tap: { scale: 0.95 },
};

const Pagination = ({
  // Legacy API
  totalPages,
  paginate,
  // Newer API
  totalItems,
  itemsPerPage,
  onPageChange,
  // Shared
  currentPage = 1,
}) => {
  const computedTotalPages = Number.isFinite(totalPages)
    ? totalPages
    : Math.max(1, Math.ceil((Number(totalItems) || 0) / (Number(itemsPerPage) || 1)) || 1);

  const handleChange = (page) => {
    if (typeof onPageChange === 'function') return onPageChange(page);
    if (typeof paginate === 'function') return paginate(page);
  };

  return (
    <div className="mt-6 flex justify-center gap-2">
      {Array.from({ length: computedTotalPages }, (_, i) => (
        <motion.button
          key={i + 1}
          onClick={() => handleChange(i + 1)}
          className={`px-4 py-2 rounded-lg shadow-md transition-all duration-300 ${
            currentPage === i + 1
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
              : 'bg-gray-700/50 text-white hover:bg-indigo-600/30'
          }`}
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          aria-label={`Go to page ${i + 1}`}
        >
          {i + 1}
        </motion.button>
      ))}
    </div>
  );
};

Pagination.propTypes = {
  // Legacy props
  totalPages: PropTypes.number,
  paginate: PropTypes.func,
  // New props
  totalItems: PropTypes.number,
  itemsPerPage: PropTypes.number,
  onPageChange: PropTypes.func,
  // Shared
  currentPage: PropTypes.number,
};

export default Pagination;