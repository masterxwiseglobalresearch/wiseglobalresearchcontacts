import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import step1 from '../assets/images/imgStep01.png';
import step2 from '../assets/images/imgStep02.png';
import step3 from '../assets/images/slide5.png';

const MethodologySection = () => {
  const [loaded, setLoaded] = useState([false, false, false]);

  // Proactively prefetch the heavier third image to reduce perceived delay
  useEffect(() => {
    const img = new Image();
    img.src = step3;
  }, []);

  // removed react-i18next for this component per request
  const heading = 'Methodology';
  const steps = [
    {
      title: 'Data Collection',
      desc: 'We gather verified data from multiple reliable sources to ensure coverage and accuracy.',
    },
    {
      title: 'Analysis',
      desc: 'Our team applies quantitative models and qualitative expertise to extract meaningful insights.',
    },
    {
      title: 'Reporting',
      desc: 'Insights are validated and presented as clear, actionable recommendations for stakeholders.',
    },
  ];
  const images = [step1, step2, step3];

  // Framer-motion variants to match ComplaintManager styling/feel

  const itemVariants = {
    hidden: { opacity: 0, y: 6 },
    visible: { opacity: 1, y: 0 },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };

  return (
    <motion.section
      className="relative py-10 sm:py-14 lg:py-20 px-4 sm:px-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Decorative blobs behind the section to give a free, airy feel */}
      <div className="pointer-events-none absolute -left-10 -top-10 opacity-30">
        <svg width="240" height="240" viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g filter="url(#a)">
            <path d="M56 14C85 2 124-6 156 12c32 18 48 58 34 88-14 30-52 46-90 56-38 10-86 8-106-22C-20 78 27 26 56 14z" fill="#c7d2fe" />
          </g>
          <defs>
            <filter id="a" x="-20" y="-20" width="280" height="280" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
              <feGaussianBlur stdDeviation="18" result="blur" />
            </filter>
          </defs>
        </svg>
      </div>

      <div className="container max-w-3xl mx-auto relative z-10">
        <motion.div
          className="mb-6 rounded-2xl p-6 shadow-2xl"
          variants={itemVariants}
          style={{ background: '#fff', border: '2px solid #6366f1', boxShadow: '0 8px 32px 0 rgba(60,60,120,0.18), 0 1.5px 8px 0 rgba(99,102,241,0.10)' }}
        >
          <div style={{ color: '#000' }}>
        <motion.h2
          className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center mb-4 sm:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-indigo-800"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {heading}
        </motion.h2>
  <p className="text-center text-sm sm:text-base max-w-2xl mx-auto mb-8" style={{ color: '#000' }}>
          A clear, repeatable process — from verified data sources to actionable recommendations.
          Designed for transparency and reproducibility.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-4">
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              className="relative rounded-2xl overflow-hidden shadow-2xl"
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.08 * idx, duration: 0.5 }}
              whileHover={{ y: -6 }}
              style={{
                background: '#fff',
                border: '2px solid #6366f1',
                color: '#000',
                boxShadow: '0 8px 32px 0 rgba(60,60,120,0.18), 0 1.5px 8px 0 rgba(99,102,241,0.10)'
              }}
            >
              {/* soft circular accent behind the image */}
              <div className="absolute -right-10 -top-10 w-44 h-44 rounded-full bg-gradient-to-br from-indigo-100/40 to-indigo-200/20 blur-3xl opacity-60 transform rotate-12"></div>

              <div className="flex flex-col items-center text-center relative z-10 px-4 py-6">
                <div
                  className="relative w-24 h-24 rounded-full overflow-hidden mb-4 shadow-md"
                  style={{ background: 'rgba(238,242,255,0.6)', border: '2px solid #6366f1' }}
                >
                  {/* Shimmer placeholder */}
                  {!loaded[idx] && (
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 animate-pulse bg-gradient-to-r from-indigo-100 via-indigo-200 to-indigo-100"
                    />
                  )}
                  <img
                    src={images[idx] || images[0]}
                    alt={step.title || ''}
                    className={`w-full h-full object-cover rounded-full transition-opacity duration-500 ${loaded[idx] ? 'opacity-100' : 'opacity-0'}`}
                    width={96}
                    height={96}
                    decoding="async"
                    loading="lazy"
                    fetchpriority={idx === 2 ? 'low' : 'auto'}
                    onLoad={() => setLoaded((arr) => arr.map((v, i) => (i === idx ? true : v)))}
                    onError={(e) => { e.currentTarget.onerror = null; setLoaded((arr) => arr.map((v, i) => (i === idx ? true : v))); }}
                  />
                </div>

                <h3 className="text-lg sm:text-xl font-semibold mb-2 text-indigo-800">{step.title}</h3>
                <p className="text-sm sm:text-base max-w-md" style={{ color: '#000' }}>{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default MethodologySection;