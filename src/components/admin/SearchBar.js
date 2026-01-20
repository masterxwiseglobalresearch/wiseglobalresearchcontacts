import React from 'react';
import { motion } from 'framer-motion';
import { FiSearch } from 'react-icons/fi';
import PropTypes from 'prop-types';

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const SearchBar = ({ searchQuery, setSearchQuery, placeholder = "Search..." }) => (
  <motion.div
    className="relative w-full max-w-md mb-6"
    variants={itemVariants}
  >
    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
    <input
      type="text"
      placeholder={placeholder}
      className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-800/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-md transition-all duration-300"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      aria-label="Search"
    />
  </motion.div>
);

SearchBar.propTypes = {
  searchQuery: PropTypes.string.isRequired,
  setSearchQuery: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
};

export default SearchBar;