import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaChartLine } from 'react-icons/fa';
import { marketSymbols, generateChartData } from '../utils/chartUtils';
import { itemVariants, cardVariants } from '../utils/animationVariants';
import AnimatedChart from './AnimatedChart';

const MarketOverview = () => {
  // removed react-i18next for this component per request
  // ...existing code...
  const [marketData, setMarketData] = useState(
    marketSymbols.map((symbol) => ({
      ...symbol,
      value: generateChartData(symbol.symbol).values[6]?.toFixed(2) || '0.00',
      change: '+0.00 (0.00%)',
      isUp: true,
    }))
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setMarketData((prev) =>
        prev.map((item) => {
          const change = Math.random() * 200 - 100;
          const newValue = parseFloat(item.value) + change;
          const percentChange = (change / parseFloat(item.value)) * 100;
          return {
            ...item,
            value: newValue.toFixed(2),
            change: `${change >= 0 ? '+' : ''}${change.toFixed(2)} (${percentChange.toFixed(2)}%)`,
            isUp: change >= 0,
          };
        })
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // ...existing code...
  return (
    <section className="py-8 sm:py-12 lg:py-16 px-4 sm:px-6">
  <div className="container max-w-3xl mx-auto relative z-10">
        <motion.div className="mb-6 rounded-2xl p-6 shadow-2xl" style={{ background: '#fff', border: '2px solid #6366f1', boxShadow: '0 8px 32px 0 rgba(60,60,120,0.18), 0 1.5px 8px 0 rgba(99,102,241,0.10)' }} variants={itemVariants}>
          <div style={{ color: '#000' }}>
        <motion.h2
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-indigo-800"
          variants={itemVariants}
        >
          Market Overview
        </motion.h2>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
            {marketData.map((item, index) => (
              <motion.div
                key={index}
                className="rounded-2xl overflow-hidden bg-white shadow-2xl"
                style={{ border: '2px solid #6366f1', color: '#000' }}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
              >
                <div className="px-4 py-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-base sm:text-lg text-indigo-800">{item.name}</h3>
                    <span aria-hidden="false" className="sr-only">{item.isUp ? 'Rising' : 'Falling'}</span>
                    <FaChartLine className={`text-xl sm:text-2xl`} aria-hidden="true" style={{ color: item.isUp ? '#00692d' : '#a30000' }} />
                  </div>
                  <div className="mt-4">
                    <p className="text-xl sm:text-2xl font-bold" style={{ color: '#000' }}>{item.value}</p>
                    <p className={`text-base font-semibold`} style={{ color: item.isUp ? '#00692d' : '#a30000' }}>{item.change}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {marketSymbols.slice(0, 6).map((symbol, index) => (
              <motion.div
                key={index}
                className="rounded-2xl overflow-hidden bg-white shadow-2xl"
                style={{ border: '2px solid #6366f1', color: '#000' }}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
              >
                <div className="px-4 py-3">
                  <h3 className="text-lg sm:text-xl font-bold mb-4 text-center text-indigo-800">{symbol.name} Trend</h3>
                  <div className="h-48 sm:h-64 w-full">
                    <AnimatedChart symbol={symbol.symbol} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        </div>
        </motion.div>
      </div>
    </section>
  );
};

export default MarketOverview;