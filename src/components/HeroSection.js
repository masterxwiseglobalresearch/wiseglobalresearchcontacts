import React, { useState, useEffect } from 'react';
import { gradients, theme } from '../themeFallbacks';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowRight, FiPhone } from 'react-icons/fi';


// Using the exact image URLs you supplied (direct image files extracted from Google imgres)
const sliderImages = [
  'https://t3.ftcdn.net/jpg/03/65/83/00/360_F_365830030_WcVlhdXgKEcgUVKyjXOwr03ZxB7BsfLE.jpg',
  'https://wallpapers.com/images/hd/trading-1920-x-1080-wallpaper-87ccmbpqt47xmi6o.jpg',
  'https://videocdn.cdnpk.net/videos/dd2dec61-e272-5c85-bdb3-b1a8a61f6219/horizontal/thumbnails/small.jpg',
  'https://eu-west-2.graphassets.com/A7DbPYomyRgGvtF2R1Eadz/output=format:webp/FyzKfLjRUSUmImC3F49Z',
  'https://images.unsplash.com/photo-1629339942248-45d4b10c8c2f?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHRyYWRpbmd8ZW58MHx8MHx8fDA='
];

// Animation variants for Framer Motion
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
    },
  },
};

const HeroSection = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [preloaded, setPreloaded] = useState({});
  const [isPaused, setIsPaused] = useState(false);


  // Image slider effect
  useEffect(() => {
    const timer = setInterval(() => {
      if (isPaused) return; // pause auto-scroll on hover
      setCurrentImageIndex((prevIndex) =>
        prevIndex === sliderImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Change image every 5 seconds
    return () => clearInterval(timer);
  }, [isPaused]);

  // Preload images to improve first paint
  useEffect(() => {
    sliderImages.forEach((url) => {
      if (preloaded[url]) return;
      const img = new Image();
      img.src = url;
      img.onload = () => setPreloaded((p) => ({ ...p, [url]: true }));
      img.onerror = () => setPreloaded((p) => ({ ...p, [url]: false }));
    });
  }, [preloaded]);

  // Determine if the current theme is dark based on its text color
  const isDarkTheme = () => {
    if (!theme || !gradients[theme]) return false;
    const textColor = gradients[theme].textColor.toLowerCase();
    return textColor.includes('#fff') || textColor.includes('#e6');
  };

  return (
    <motion.div
      className="flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20 text-gray-900"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="container mx-auto">
        <motion.div className="mb-6 rounded-2xl p-6 shadow-2xl" variants={itemVariants} initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ background: '#fff', border: '2px solid #6366f1', boxShadow: '0 8px 32px 0 rgba(60,60,120,0.18), 0 1.5px 8px 0 rgba(99,102,241,0.10)' }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Side: Text Content */}
          <motion.div className="text-center lg:text-left">
            <motion.h1 
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight"
              variants={itemVariants}
            >
              <span className="block">Actionable Insights for</span>
              <span className="block bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-indigo-800 mt-2">
                Smart Investing
              </span>
            </motion.h1>
            
            <motion.p 
              className="mt-6 max-w-lg mx-auto lg:mx-0 text-lg sm:text-xl"
              variants={itemVariants}
            >
              As a SEBI-registered research firm, we provide in-depth market analysis, stock recommendations, and strategic insights to empower your investment decisions. Navigate the market with confidence.
            </motion.p>
            
            <motion.div 
              className="mt-10 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
              variants={itemVariants}
            >
              <Link to="/services" aria-label="View our services" className="w-full sm:w-auto">
                <motion.button
                  className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-full text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                >
                  Get Service
                  <FiArrowRight className="ml-3 h-5 w-5" />
                </motion.button>
              </Link>
              <Link to="/contact" aria-label="Contact us" className="w-full sm:w-auto">
                <motion.button
                  className={`w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 border text-base font-medium rounded-full shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${isDarkTheme() 
                    ? 'bg-white/10 border-white/20 text-white hover:bg-white/20' 
                    : 'bg-white border border-indigo-200 text-indigo-700 hover:bg-indigo-50'}`}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                >
                  Contact Us
                  <FiPhone className="ml-3 h-5 w-5" />
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Right Side: Image Slider */}
          <div className="flex justify-center items-center">
            <div
              className="w-full max-w-md lg:max-w-none h-auto rounded-3xl overflow-hidden shadow-2xl relative"
              style={{ height: '450px' }}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              <AnimatePresence>
                <motion.img
                  // key by index to ensure a unique element per slide and avoid caching issues
                  key={currentImageIndex}
                  src={sliderImages[currentImageIndex]}
                  alt={`Slide ${currentImageIndex + 1} - Financial Charts and Data`}
                  // prefer eager loading for better UI feedback
                  loading="eager"
                  // fallback to a bundled placeholder if the external image fails
                  onError={(e) => {
                    // try a smaller Unsplash fallback first
                    const fallback = 'https://images.unsplash.com/photo-1559526324-593bc073d938?q=80&w=2070&auto=format&fit=crop';
                    if (e?.target?.src && !e.target.src.includes('fallback-used')) {
                      e.target.src = fallback + '&fallback-used=1';
                    }
                  }}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.8 }}
                  className="w-full h-full object-cover absolute top-0 left-0"
                />
              </AnimatePresence>
            </div>
          </div>

        </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default HeroSection;
