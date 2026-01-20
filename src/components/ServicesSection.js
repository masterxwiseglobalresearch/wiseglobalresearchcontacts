import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaChartLine, FaExchangeAlt, FaCoins, FaChartBar, FaRegMoneyBillAlt, FaRegChartBar } from 'react-icons/fa';
import { FiCheckCircle } from 'react-icons/fi';
import { itemVariants, cardVariants } from '../utils/animationVariants';

const ServicesSection = () => {
  const navigate = useNavigate();
  const services = [
    {
      title: 'Equity Research',
      desc: 'Comprehensive analysis of stocks with buy/sell recommendations',
      icon: <FaChartLine className="text-3xl sm:text-4xl text-blue-500" />,
      features: ['Fundamental Analysis', 'Valuation Models', 'Sector Reports'],
    },
    {
      title: 'Derivatives',
      desc: 'Futures & options strategies for Nifty and Bank Nifty',
      icon: <FaExchangeAlt className="text-3xl sm:text-4xl text-purple-500" />,
      features: ['Option Chain Analysis','F&O Strategies', 'Hedging Techniques'],
    },
    {
      title: 'Commodities',
      desc: 'Gold, silver and other commodity market analysis',
      icon: <FaCoins className="text-3xl sm:text-4xl text-yellow-500" />,
      features: ['MCX Analysis', 'Global Commodity Trends', 'Seasonal Patterns'],
    },
    {
      title: 'Technical Analysis',
      desc: 'Chart patterns and technical indicators for trading',
      icon: <FaChartBar className="text-3xl sm:text-4xl text-green-500" />,
      features: ['Chart Patterns', 'Indicators', 'Price Action'],
    },

    {
      title: 'Portfolio Management',
      desc: 'Customized portfolio strategies based on risk profile',
      icon: <FaRegMoneyBillAlt className="text-3xl sm:text-4xl text-red-500" />,
      features: ['Asset Allocation', 'Risk Assessment', 'Rebalancing'],
    },
    {
      title: 'Learning Center',
      desc: 'Educational resources for traders and investors',
      icon: <FaRegChartBar className="text-3xl sm:text-4xl text-indigo-500" />,
      features: ['Webinars', 'Courses', 'Market Tutorials'],
    },
  ];

  return (
    <section className="py-8 sm:py-12 lg:py-16 px-4 sm:px-6">
      <div className="container">
        <motion.h2
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12"
          variants={itemVariants}
        >
          Our Research Services
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              className="bg-white/20 backdrop-blur-lg rounded-xl p-4 sm:p-6 shadow-md border-2 border-white/30 hover:shadow-2xl cursor-pointer"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              onClick={() => navigate('/services')}
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div className="flex flex-col">
                <motion.div
                  className="flex items-center mb-4"
                  whileHover={{ rotateY: 360 }}
                  transition={{ duration: 0.8 }}
                >
                  {service.icon}
                  <h3 className="text-lg sm:text-xl font-bold ml-4">{service.title}</h3>
                </motion.div>
                <p className="mb-4 text-sm sm:text-base">{service.desc}</p>
                <ul className="space-y-2">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-center text-sm sm:text-base">
                      <FiCheckCircle className="mr-2 text-green-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;