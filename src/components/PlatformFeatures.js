import React from 'react';
import { motion } from 'framer-motion';
import { FaMobileAlt, FaDesktop, FaChartBar, FaRegChartBar, FaBullseye, FaLightbulb } from 'react-icons/fa';
import { itemVariants, cardVariants } from '../utils/animationVariants';

const PlatformFeatures = () => {
  const features = [
    {
      title: 'Real-time Alerts',
      desc: 'Instant notifications for trading opportunities',
  icon: <FaMobileAlt className="text-2xl sm:text-3xl" aria-hidden="true" focusable="false" />,
      animation: {
        whileHover: { scale: 1.05, rotateY: 10 },
        transition: { type: 'spring', stiffness: 300 },
      },
    },
    {
      title: 'Advanced Charts',
      desc: 'Interactive charts with multiple indicators',
  icon: <FaDesktop className="text-2xl sm:text-3xl" aria-hidden="true" focusable="false" />,
      animation: {
        whileHover: { rotateY: 5 },
        transition: { duration: 0.3 },
      },
    },
    {
      title: 'Portfolio Tracker',
      desc: 'Monitor all your investments in one place',
  icon: <FaChartBar className="text-2xl sm:text-3xl" aria-hidden="true" focusable="false" />,
      animation: {
        whileHover: { y: -5 },
        transition: { duration: 0.2 },
      },
    },
    {
      title: 'Research Reports',
      desc: 'In-depth analysis of stocks and sectors',
  icon: <FaRegChartBar className="text-2xl sm:text-3xl" aria-hidden="true" focusable="false" />,
      animation: {
        whileHover: { scale: 1.03 },
        transition: { duration: 0.2 },
      },
    },
    {
      title: 'Market Scanners',
      desc: 'Custom filters to find trading opportunities',
  icon: <FaBullseye className="text-2xl sm:text-3xl" aria-hidden="true" focusable="false" />,
      animation: {
        whileHover: { rotateY: -5 },
        transition: { duration: 0.3 },
      },
    },
    {
      title: 'Educational Content',
      desc: 'Learn from our experts through videos and articles',
  icon: <FaLightbulb className="text-2xl sm:text-3xl" aria-hidden="true" focusable="false" />,
      animation: {
        whileHover: { y: -5 },
        transition: { duration: 0.2 },
      },
    },
  ];

  return (
    <section className="py-8 sm:py-12 lg:py-16 px-4 sm:px-6">
      <div className="container">
        <motion.h2
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12"
          variants={itemVariants}
        >
          Our Platform Features
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-white/20 backdrop-blur-lg rounded-xl p-4 sm:p-6 shadow-md border-2 border-white/30 hover:shadow-2xl"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              style={{ transformStyle: 'preserve-3d' }}
              {...feature.animation}
            >
              <div className="flex items-center mb-4">
                {feature.icon}
                <h3 className="text-lg sm:text-xl font-bold ml-4">{feature.title}</h3>
              </div>
              <p className="text-sm sm:text-base">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PlatformFeatures;