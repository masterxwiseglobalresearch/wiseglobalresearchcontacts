import React from 'react';
import { motion } from 'framer-motion';
import { FiCheckCircle } from 'react-icons/fi';
import { itemVariants, cardVariants } from '../utils/animationVariants';
import { useTranslation } from '../i18nShim';

const SubscriptionPlans = () => {
  const { t } = useTranslation();
  const plans = [
    {
      name: 'Basic',
      price: '₹4,999',
      period: '/month',
      features: ['Equity Research Reports', 'Daily Market Updates', 'Technical Analysis', 'Email Support'],
      popular: false,
    },
    {
      name: 'Professional',
      price: '₹9,999',
      period: '/month',
      features: [
        'All Basic Features',
        'Derivatives Strategies',
        'Portfolio Recommendations',
        'Priority Support',
        'Weekly Webinars',
      ],
      popular: true,
    },
    {
      name: 'Institutional',
      price: '₹24,999',
      period: '/month',
      features: [
        'All Professional Features',
        'Custom Research Requests',
        '1-on-1 Analyst Calls',
        'Portfolio Review',
        'Advanced Tools Access',
      ],
      popular: false,
    },
  ];

  return (
    <section className="py-8 sm:py-12 lg:py-16 px-4 sm:px-6">
      <div className="container">
        <motion.h2
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12"
          variants={itemVariants}
        >
          Choose Your Plan
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              className={`relative bg-white/20 backdrop-blur-lg rounded-xl p-4 sm:p-6 shadow-lg border-2 ${
                plan.popular ? 'border-blue-500 bg-blue-500/10' : 'border-white/30'
              } hover:shadow-2xl`}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-blue-500 text-white px-3 sm:px-4 py-1 rounded-bl-lg rounded-tr-lg text-xs sm:text-sm font-bold">
                  MOST POPULAR
                </div>
              )}
              <h3 className="text-xl sm:text-2xl font-bold mb-2">{plan.name}</h3>
              <div className="flex items-end mb-4 sm:mb-6">
                <span className="text-2xl sm:text-4xl font-bold">{plan.price}</span>
                <span className="ml-1 text-sm sm:text-base">{plan.period}</span>
              </div>
              <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start text-sm sm:text-base">
                    <FiCheckCircle className="mt-1 mr-2 text-green-500 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <motion.button
                className="shine-hover w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 sm:py-3 rounded-lg shadow-md text-sm sm:text-base"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {t('home.subscriptionPlans.cta')}
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SubscriptionPlans;