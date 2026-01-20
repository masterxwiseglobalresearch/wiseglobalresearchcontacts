import React from 'react';
import { motion } from 'framer-motion';
import { itemVariants, cardVariants } from '../utils/animationVariants';

// Heading and richer insights content
const heading = 'Market Insights — Today';

const insights = [
  { title: 'Market Sentiment', desc: 'Measure bullish vs bearish flows, positioning and short-term risk appetite across major markets.', name: 'slide1' },
  { title: 'Top Movers', desc: 'Daily leaders and laggards with on-chain and volume context to spot momentum trades.', name: 'slide2' },
  { title: 'Sector Watch', desc: 'Sector rotation insights and which industries are leading the market this session.', name: 'slide4' },
  { title: 'Macro Trends', desc: 'Key macro indicators and events shaping risk — rates, inflation, and central bank cues.', name: 'slide5' },
];

const widths = [400, 800, 1200];
const buildSrcSet = (name, ext) => widths.map((w) => `/assets/images/${name}-${w}.${ext} ${w}w`).join(', ');

const MarketInsights = () => {
  return (
    <section className="py-8 sm:py-12 lg:py-16 px-4 sm:px-6">
      <div className="container max-w-3xl mx-auto">
        <motion.div
          className="mb-6 rounded-2xl p-6 shadow-2xl"
          style={{
            background: '#fff',
            border: '2px solid #6366f1',
            boxShadow: '0 8px 32px 0 rgba(60,60,120,0.18), 0 1.5px 8px 0 rgba(99,102,241,0.10)'
          }}
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          <div style={{ color: '#000' }}>
            <motion.h2
              className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-indigo-800"
              variants={itemVariants}
            >
              {heading}
            </motion.h2>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                {insights.map((insight) => (
                  <motion.article
                    key={insight.title}
                    className="rounded-2xl overflow-hidden bg-white shadow-2xl"
                    style={{ border: '2px solid #6366f1', color: '#000' }}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover={{ y: -6 }}
                  >
                    <div className="px-4 py-3">
                      {/* Scroll-shaped image frame */}
                      <div className="relative w-full h-36 sm:h-40 mb-4 select-none market-img-frame">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <motion.div
                            className="relative w-[88%] h-[80%] bg-indigo-50 dark:bg-indigo-100/80 border border-indigo-200 rounded-md shadow-inner overflow-hidden"
                            initial={{ scale: 0.98, opacity: 0.95 }}
                            animate={{ scale: [0.98, 1, 0.98] }}
                            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                          >
                            <picture>
                              <source type="image/avif" srcSet={buildSrcSet(insight.name, 'avif')} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" />
                              <source type="image/webp" srcSet={buildSrcSet(insight.name, 'webp')} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" />
                              <img src={`/assets/images/${insight.name}.png`} alt={insight.title} className="w-full h-full object-cover rounded-md market-img" style={{ minWidth: 0, minHeight: 0, objectFit: 'cover' }} loading="lazy" decoding="async" />
                            </picture>
                            {/* Scroll rolls */}
                            <span className="absolute -top-2 left-6 w-12 h-4 bg-indigo-100 border border-indigo-200 rounded-full shadow-sm" />
                            <span className="absolute -bottom-2 right-6 w-12 h-4 bg-indigo-100 border border-indigo-200 rounded-full shadow-sm" />
                          </motion.div>
                        </div>
                      </div>
                      {/* Responsive image fix for mobile */}
                      <style>{`
                        @media (max-width: 640px) {
                          .market-img-frame {
                            height: 28vw !important;
                            min-height: 90px !important;
                            max-height: 120px !important;
                          }
                          .market-img {
                            min-width: 0 !important;
                            min-height: 0 !important;
                            object-fit: cover !important;
                            border-radius: 8px !important;
                          }
                        }
                      `}</style>
                      <h3 className="text-lg sm:text-xl font-semibold mb-1 text-indigo-800">{insight.title}</h3>
                      <p className="text-sm sm:text-base" style={{ color: '#000' }}>{insight.desc}</p>
                    </div>
                  </motion.article>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default MarketInsights;