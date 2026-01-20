import React from 'react';
import { useTranslation } from '../i18nShim';
import { motion } from 'framer-motion';
import { itemVariants, cardVariants } from '../utils/animationVariants';

const TestimonialsSection = () => {
  const { t } = useTranslation();
  const testimonials = [
    {
      name: t('testimonials.0.name'),
      role: t('testimonials.0.role'),
      quote: t('testimonials.0.quote'),
    },
    {
      name: t('testimonials.1.name'),
      role: t('testimonials.1.role'),
      quote: t('testimonials.1.quote'),
    },
    {
      name: t('testimonials.2.name'),
      role: t('testimonials.2.role'),
      quote: t('testimonials.2.quote'),
    },
  ];

  return (
    <section className="py-8 sm:py-12 lg:py-16 px-4 sm:px-6">
      <div className="container">
        <motion.h2
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12"
          variants={itemVariants}
        >
          {t('testimonials.title')}
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="bg-white/20 backdrop-blur-lg rounded-xl p-4 sm:p-6 shadow-md border-2 border-white/30 hover:shadow-2xl"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <p className="italic mb-4 text-sm sm:text-base">"{testimonial.quote}"</p>
              <div className="flex justify-between items-end">
                <div>
                  <p className="font-bold text-base sm:text-lg">{testimonial.name}</p>
                  <p className="text-xs sm:text-sm">{testimonial.role}</p>
                </div>

              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
