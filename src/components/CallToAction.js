import { motion } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';
import { cardVariants } from '../utils/animationVariants';

const CallToAction = ({ scrollToContactForm }) => (
  <section className="py-8 sm:py-12 lg:py-16 px-4 sm:px-6">
  <div className="container max-w-3xl mx-auto">
      <motion.div
        className="rounded-2xl p-6 shadow-2xl"
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        style={{ background: '#fff', border: '2px solid #6366f1', boxShadow: '0 8px 32px 0 rgba(60,60,120,0.18), 0 1.5px 8px 0 rgba(99,102,241,0.10)' }}
      >
  <div className="px-4 py-6 text-center" style={{ color: '#000' }}>
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-indigo-800">Start Your Investment Journey Today</h2>
          <p className="mb-4 sm:mb-6 text-sm sm:text-base" style={{ color: '#000' }}>
            Join thousands of investors who trust our SEBI-registered research for financial success.
          </p>
          <motion.button
            onClick={scrollToContactForm}
            className="shine-hover px-6 py-2 sm:px-8 sm:py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-base sm:text-lg font-bold focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            whileHover={{ scale: 1.05, rotateY: 10 }}
            whileTap={{ scale: 0.95 }}
          >
            Sign Up Now <FaArrowRight className="inline ml-2" />
          </motion.button>
        </div>
      </motion.div>
    </div>
  </section>
);

export default CallToAction;