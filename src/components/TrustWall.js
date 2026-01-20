import React, { useState, useEffect } from 'react';
import CountUp from 'react-countup';
import { motion, AnimatePresence } from 'framer-motion';
import trustImg from '../assets/images/trusted-people.png';

const fadeIn = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.8, ease: 'easeOut' },
  viewport: { once: false, amount: 0.5 },
});

const phrases = [
  'India’s Most Trusted Stock Advisory',
  'Helping You Trade With Confidence',
  'Built on Accuracy and Transparency',
  'Your Profits, Our Passion'
];

const TrustWall = () => {
  const [index, setIndex] = useState(0);

  // Text animation changer
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % phrases.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-20 px-6 bg-gradient-to-br from-[#6a11cb] to-[#2575fc] text-white overflow-hidden">
      <motion.div
        className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center"
        {...fadeIn(0.2)}
      >
        {/* Left: Static Image (no animation) */}
        <div className="w-full text-center md:text-left">
          <img
            src={trustImg}
            alt="Trusted by Users"
            className="w-full max-w-sm mx-auto md:mx-0"
            decoding="async"
            loading="lazy"
            onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Trusted'; }}
          />
        </div>

        {/* Right: Content */}
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            <motion.h2
              key={phrases[index]}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-4xl font-bold leading-tight text-center md:text-left"
            >
              {phrases[index]}{' '}
              {index === 0 && (
                <span className="text-green-400">✔</span>
              )}
            </motion.h2>
          </AnimatePresence>

          <motion.p
            className="text-white/80 text-base md:text-lg text-center md:text-left"
            {...fadeIn(0.4)}
          >
            We’ve empowered thousands of traders with accurate stock advice, expert analysis, and a community built on trust and transparency.
          </motion.p>

          {/* CountUp Stats */}
          <motion.div
            className="grid grid-cols-2 gap-6 mt-6 text-center md:text-left"
            {...fadeIn(0.6)}
          >
            <div>
              <h3 className="text-3xl font-extrabold text-green-400">
                <CountUp end={10000} duration={3} separator="," />+
              </h3>
              <p className="text-white/80 text-sm mt-1">Happy Traders</p>
            </div>
            <div>
              <h3 className="text-3xl font-extrabold text-green-400">
                <CountUp end={98} duration={3} suffix="%" />
              </h3>
              <p className="text-white/80 text-sm mt-1">Client Satisfaction</p>
            </div>
            <div>
              <h3 className="text-3xl font-extrabold text-green-400">
                <CountUp end={9} duration={3} suffix="+" />
              </h3>
              <p className="text-white/80 text-sm mt-1">Years of Expertise</p>
            </div>
            <div>
              <h3 className="text-3xl font-extrabold text-green-400">
                <CountUp end={30} duration={3} suffix="+" />
              </h3>
              <p className="text-white/80 text-sm mt-1">Market Analysts</p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default TrustWall;