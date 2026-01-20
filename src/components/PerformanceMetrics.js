import React from 'react';
import { motion } from 'framer-motion';
import { FaPercent, FaHandshake, FaDatabase } from 'react-icons/fa';
import { itemVariants, cardVariants } from '../utils/animationVariants';
import PerformanceChart from './PerformanceChart';

const PerformanceMetrics = () => {
  const metrics = [
    {
      title: 'Accuracy Rate',
      value: '87%',
      icon: <FaPercent className="text-3xl sm:text-4xl text-blue-500" />,
      desc: 'Of our recommendations have been profitable',
    },
    {
      title: 'Client Retention',
      value: '94%',
      icon: <FaHandshake className="text-3xl sm:text-4xl text-purple-500" />,
      desc: 'Of clients continue with our services annually',
    },
    {
      title: 'Research Coverage',
      value: '500+',
      icon: <FaDatabase className="text-3xl sm:text-4xl text-green-500" />,
      desc: 'Stocks and derivatives covered in our research',
    },
    {
      title: 'Clients All Over India',
      value: '5,000+',
      icon: <FaHandshake className="text-3xl sm:text-4xl text-orange-400" />,
      desc: 'Clients served across India',
    },
  ];

  return (
    <section className="py-8 sm:py-12 lg:py-16 px-4 sm:px-6">
      <div className="container">
        <motion.h2
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12"
          variants={itemVariants}
        >
          All Over India Metrics
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12">
          {metrics.map((metric, index) => (
            <motion.div
              key={index}
              className="custom-box-bg rounded-xl p-4 sm:p-6 shadow-md border border-gray-200/20 text-center"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div className="flex justify-center mb-4">{metric.icon}</div>
              <h3 className="text-3xl sm:text-4xl font-bold mb-2">{metric.value}</h3>
              <p className="text-lg sm:text-xl font-semibold mb-2">{metric.title}</p>
              <p className="text-sm sm:text-base">{metric.desc}</p>
            </motion.div>
          ))}
        </div>
        <motion.div
          className="custom-box-bg rounded-xl p-4 sm:p-6 shadow-lg border border-gray-200/20"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          style={{ transformStyle: 'preserve-3d' }}
        >
          <h3 className="text-lg sm:text-xl font-bold mb-4 text-center">Annual Performance vs Benchmark</h3>
          <div className="h-64 sm:h-80 w-full">
            <PerformanceChart />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PerformanceMetrics;