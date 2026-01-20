import React from 'react';
import { motion } from 'framer-motion';
import { FaCalendarAlt } from 'react-icons/fa';
import { itemVariants, cardVariants } from '../utils/animationVariants';

const TimelineSection = () => {
  const timeline = [
    {
      year: '2010',
      event: 'Company Founded',
      detail: 'Started with 3 analysts focusing on equity research',
    },
    {
      year: '2013',
      event: 'SEBI Registration',
      detail: 'Obtained SEBI research analyst registration',
    },
    {
      year: '2016',
      event: 'Mobile Platform Launch',
      detail: 'Launched our first mobile app for clients',
    },
    {
      year: '2019',
      event: '10,000 Clients',
      detail: 'Crossed milestone of 10,000 active clients',
    },
    {
      year: '2022',
      event: 'AI Integration',
      detail: 'Implemented machine learning in our research process',
    },
  ];

  return (
    <section className="py-8 sm:py-12 lg:py-16 px-4 sm:px-6">
      <div className="container">
        <motion.h2
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12"
          variants={itemVariants}
        >
          Our Journey
        </motion.h2>
        <div className="relative">
          <div className="absolute left-1/2 w-1 h-full bg-gradient-to-b from-blue-500 to-purple-500 transform -translate-x-1/2 sm:block hidden"></div>
          {timeline.map((item, index) => (
            <motion.div
              key={index}
              className={`relative mb-8 sm:mb-12 ${index % 2 === 0 ? 'sm:pr-8 sm:text-right' : 'sm:pl-8'} flex flex-col sm:flex-row`}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div
                className={`absolute top-0 ${index % 2 === 0 ? 'sm:-right-2 right-1/2' : 'sm:-left-2 left-1/2'} w-4 h-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transform sm:-translate-x-0 -translate-x-1/2`}
              ></div>
              <div
                className={`custom-box-bg p-4 sm:p-6 rounded-lg shadow-md border border-gray-200/20 ${index % 2 === 0 ? 'ml-auto' : 'mr-auto'} max-w-full sm:max-w-[400px]`}
              >
                <div className="flex items-center mb-2">
                  <FaCalendarAlt className="mr-2 text-blue-500" />
                  <span className="font-bold">{item.year}</span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-2">{item.event}</h3>
                <p className="text-sm sm:text-base">{item.detail}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TimelineSection;