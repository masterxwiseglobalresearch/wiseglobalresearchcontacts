import React from 'react';
import { motion } from 'framer-motion';
import { cardVariants } from '../animations';

const base = 'bg-white/20 backdrop-blur-lg rounded-xl p-6 border-2 border-white/30 hover:shadow-2xl';
const Card = ({ children, className = '', ...props }) => (
  <motion.div
    variants={cardVariants}
    initial="hidden"
    animate="visible"
    whileHover={{ scale: 1.03 }}
    className={`${base} ${className}`}
    style={{ transformStyle: 'preserve-3d' }}
    {...props}
  >
    {children}
  </motion.div>
);

export default Card;
