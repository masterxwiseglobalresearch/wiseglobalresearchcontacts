import React from 'react';
import { useTranslation } from '../i18nShim';
import { motion } from 'framer-motion';
import { FaLock } from 'react-icons/fa';
import { itemVariants, cardVariants } from '../utils/animationVariants';

const FAQSection = () => {
  const { t } = useTranslation();
  const faqs = t('home.faqSection.sebiFaqs', { returnObjects: true })

  return (
    <section className="py-8 sm:py-12 lg:py-16 px-4 sm:px-6">
      <div className="container">
        <motion.h2
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12"
          variants={itemVariants}
        >
          {t('home.faqSection.sebiHeading')}
        </motion.h2>
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <motion.div
              key={idx}
              className="custom-box-bg rounded-xl p-4 sm:p-6 shadow-md border border-gray-200/20"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div className="flex items-start justify-between">
                <h3 className="text-lg sm:text-xl font-bold mb-2">{faq.question}</h3>
                <FaLock className="ml-3 text-black" aria-hidden="true" title="Locked content" />
              </div>
              <p className="text-sm sm:text-base">{faq.answer}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;