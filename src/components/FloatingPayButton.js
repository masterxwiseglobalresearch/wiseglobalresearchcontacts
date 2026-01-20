import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaMoneyBillWave, FaUniversity, FaCreditCard } from 'react-icons/fa';


const FloatingPayButton = () => {
  const [showOptions, setShowOptions] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    const openHandler = () => setChatOpen(true);
    const closeHandler = () => setChatOpen(false);
    document.addEventListener('open-chat-widget', openHandler);
    document.addEventListener('close-chat-widget', closeHandler);
    if (typeof window !== 'undefined') {
      const origOpen = window.openChatWidget;
      window.openChatWidget = function(...args) {
        setChatOpen(true);
        if (typeof origOpen === 'function') origOpen.apply(this, args);
      };
    }
    const escHandler = (e) => {
      if (e.key === 'Escape') setChatOpen(false);
    };
    window.addEventListener('keydown', escHandler);
    return () => {
      document.removeEventListener('open-chat-widget', openHandler);
      document.removeEventListener('close-chat-widget', closeHandler);
      window.removeEventListener('keydown', escHandler);
    };
  }, []);

  const handleMouseEnter = () => setShowOptions(true);
  const handleMouseLeave = () => setShowOptions(false);
  const toggleClick = () => setShowOptions((prev) => !prev);

  // Animation variants for dropdown options
  const optionVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: i * 0.08,
        type: 'spring',
        stiffness: 250,
        damping: 18,
      },
    }),
    exit: { opacity: 0, y: 20, scale: 0.95, transition: { duration: 0.15 } },
  };

  const buttonHoverEffect = {
    scale: 1.05,
    boxShadow: '0 0 18px rgba(255,255,255,0.3)',
  };

  const buttonTapEffect = {
    scale: 0.95,
  };

  // Hide pay button if chat is open (on mobile or always, as needed)
  if (chatOpen) return null;

  return (
    <div
      className="fixed bottom-6 left-6 z-50 flex flex-col items-start"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Payment Dropdown Options */}
      <AnimatePresence>
        {showOptions && (
          <div className="flex flex-col items-start mb-3 space-y-2">
            {/* CCAvenue Option */}
            <motion.a
              key="ccavenue"
              href="https://formbuilder.ccavenue.com/live/au-small-finance-bank/wise-global-research-services-pvt-ltd"
              target="_blank"
              rel="noopener noreferrer"
              variants={optionVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              custom={0}
              whileHover={buttonHoverEffect}
              whileTap={buttonTapEffect}
              className="flex items-center gap-3 px-4 py-3 rounded-lg shadow-xl border border-white/30 text-white bg-gradient-to-r from-green-400/80 to-green-600/80 backdrop-blur-md transition-all duration-300"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
              >
                <FaUniversity className="text-white" />
              </motion.div>
              <span className="font-medium">Pay via CCAvenue</span>
            </motion.a>

            {/* PayU Option */}
            <motion.a
              key="payu"
              href="https://u.payu.in/hr313T3SHfRR"
              target="_blank"
              rel="noopener noreferrer"
              variants={optionVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              custom={1}
              whileHover={buttonHoverEffect}
              whileTap={buttonTapEffect}
              className="flex items-center gap-3 px-4 py-3 rounded-lg shadow-xl border border-white/30 text-white bg-gradient-to-r from-yellow-400/80 to-yellow-600/80 backdrop-blur-md transition-all duration-300"
            >
              <motion.div
                animate={{ y: [0, -3, 3, 0] }}
                transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
              >
                <FaCreditCard className="text-white" />
              </motion.div>
              <span className="font-medium">Pay via PayU</span>
            </motion.a>
          </div>
        )}
      </AnimatePresence>

      {/* Main Floating Pay Button */}
      <motion.button
        onClick={toggleClick}
        whileHover={{ scale: 1.12, rotate: 1 }}
        whileTap={{ scale: 0.95 }}
        className="bg-gradient-to-r from-green-500 via-green-600 to-green-700 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 text-sm md:text-base backdrop-blur-lg border border-white/20 hover:shadow-[0_0_25px_rgba(0,255,0,0.4)] transition-all duration-300"
      >
        <FaMoneyBillWave className="text-white text-xl animate-bounce" />
        Quick Pay
      </motion.button>
    </div>
  );
};

export default FloatingPayButton;
