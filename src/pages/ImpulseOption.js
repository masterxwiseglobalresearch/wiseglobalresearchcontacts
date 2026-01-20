
import React from 'react';
import { FaLightbulb, FaBolt, FaLock } from 'react-icons/fa';
import { Trans } from '../i18nShim';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import '../styles/headings.css';


import { Helmet } from 'react-helmet-async';
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.12 } },
};

const ImpulseOption = () => (
  <>
    <Helmet>
      <title>Impulse Option - Wise Global Research</title>
      <meta name="description" content="Impulse Option page — Wise Global Research." />
      <link rel="canonical" href="https://wiseglobalresearch.com/impulseoption" />
    </Helmet>

    <motion.section
      aria-labelledby="impulse-option-title"
      className="relative py-6 sm:py-10 lg:py-14 px-2 sm:px-4 md:px-6"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <motion.div
        className="mb-4 sm:mb-6 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-2xl card-heading"
        style={{
          background: '#fff',
          border: '2px solid #6366f1',
          boxShadow: '0 8px 32px 0 rgba(60,60,120,0.18), 0 1.5px 8px 0 rgba(99,102,241,0.10)',
          overflowX: 'auto',
          maxWidth: '100vw',
        }}
        variants={staggerContainer}
      >
        <motion.div className="container mx-auto max-w-4xl text-left card-text" variants={staggerContainer}>
          <motion.h1 className="text-4xl font-extrabold mb-4 text-center heading-purple" variants={fadeIn}>
            <Trans i18nKey="pages.ImpulseOption.impulse-option">Impulse Option</Trans>
          </motion.h1>

          <motion.p className="text-lg mb-6 text-center" variants={fadeIn}>
            This pack is specially design for those who cannot invest much of their time &amp; money in the Option market and therefore only want to trade on selected liquid stocks by leveraging their position. This pack will help the client to sustain rational profit in the Options market segment. This is our value pack in which traders will get filtered research-based intraday/positional option market recommendation signals on their mobile phones. We have a team of analysts who are specialized in Tracking the F&amp;O market with keen observation and keep a complete track of all the national and international events and Major Sectors and blend it with technical analysis to predict the market moves.
            <br /><br />
            <Trans i18nKey="pages.ImpulseOption.if-you-are-looking-for-best-research-rec-1">If you are looking for best research/recommendation and do not want to invest much of times, then this pack is perfect for you.</Trans>
          </motion.p>

          <motion.div className="mb-8" variants={staggerContainer}>
            <h2 className="text-2xl font-bold mb-2 heading-purple">Impulse Option Features</h2>
            <ul className="list-disc pl-6 text-base mb-4">
              <li>We provides 1-2 Intraday/Positional stock options recommendation’s (as per market conditions)</li>
              <li>All recommendation will have 2 TGT with proper Stop loss.</li>
              <li>Timely Follow Ups of all the trade signals</li>
              <li>Proper time for entry &amp; exit in recommendations.</li>
              <li>Carefully Analysis Market direction.</li>
              <li>Concise information of Domestic &amp; World Market.</li>
            </ul>
          </motion.div>

          <motion.div className="mb-8" variants={staggerContainer}>
            <h2 className="text-2xl font-bold mb-2 heading-purple">Trading Rules Every Trader Must Follow</h2>
            <ul className="list-decimal pl-6 text-base mb-4">
              <li>Do not over trade.</li>
              <li>Have to trade on each Recommendation with same quantity according to Research Team.</li>
              <li>Profit and Loss is subject to market risk and there is no guarantee or assurance for it.</li>
              <li>Never be emotional.</li>
              <li>Beware of overnight risk</li>
              <li>Always trade with a stop loss.</li>
              <li>Don’t look back and rue trades.</li>
              <li>Don’t over leverage in a volatile market.</li>
              <li>Costs matter a lot when you are a trader.</li>
              <li>Not doing anything is also a trading strategy.</li>
              <li>Profit is what is booked; all else is book profits.</li>
            </ul>
          </motion.div>

          <motion.div className="mb-8 text-center" variants={staggerContainer}>
            <h2 className="text-2xl font-bold mb-2 heading-purple">Pricing Plan For Impulse Option</h2>
            <div className="flex justify-center">
              <div className="border rounded-xl p-6 shadow-md bg-white/30 flex flex-col items-center max-w-xs w-full card-box">
                <h3 className="text-xl font-bold mb-2 heading-purple">Impulse Options</h3>
                <div className="text-3xl font-extrabold mb-2">₹49,000 <span className="text-base font-normal">/ Monthly</span></div>
                <div className="mb-2">1 to 2 Calls in a day</div>
                <Link to="/payment">
                  <button type="button" className="btn-purple mt-2">Payment</button>
                </Link>
                <div className="text-xs mt-2">Note: Pricing are excluding GST (18%)</div>
              </div>
            </div>
          </motion.div>

          <motion.div className="my-12" variants={staggerContainer}>
            <h2 className="text-2xl font-bold mb-4 text-center heading-purple">Why Choose Impulse Option?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/20 rounded-lg p-6 flex flex-col items-center card-box">
                <FaLightbulb className="text-4xl mb-2 text-yellow-300" />
                <h3 className="font-bold text-lg mb-1">Expert Research</h3>
                <p className="text-center">Our team combines technical and fundamental analysis for the most reliable recommendations.</p>
              </div>
              <div className="bg-white/20 rounded-lg p-6 flex flex-col items-center card-box">
                <FaBolt className="text-4xl mb-2 text-blue-300" />
                <h3 className="font-bold text-lg mb-1">Real-Time Support</h3>
                <p className="text-center">Get instant help and trade updates during Indian market hours.</p>
              </div>
              <div className="bg-white/20 rounded-lg p-6 flex flex-col items-center card-box">
                <FaLock className="text-4xl mb-2 text-green-300" />
                <h3 className="font-bold text-lg mb-1">Trusted by Traders</h3>
                <p className="text-center">Hundreds of options traders rely on our signals for consistent results.</p>
              </div>
            </div>
          </motion.div>

          <motion.div className="my-12" variants={staggerContainer}>
            <h2 className="text-2xl font-bold mb-4 text-center heading-purple">Frequently Asked Questions</h2>
            <div className="max-w-3xl mx-auto">
              <div className="mb-4">
                <h3 className="font-semibold heading-purple">Q: How will I receive the recommendations?</h3>
                <p>A: Recommendations are delivered via SMS on your registered contact channel.</p>
              </div>
              <div className="mb-4">
                <h3 className="font-semibold heading-purple">Q: Can I get support if I have questions?</h3>
                <p>A: Our support team is available during Indian market hours.</p>
              </div>
              <div className="mb-4">
                <h3 className="font-semibold heading-purple">Q: Is there a refund policy?</h3>
                <p>A: Please refer to our terms and conditions or contact support for refund-related queries.</p>
              </div>
            </div>
            <div className="flex justify-center mt-8">
              <Link to="/contact">
                <button type="button" className="btn-purple px-8 py-3 rounded-lg font-bold text-lg shadow transition">Enquiry Now</button>
              </Link>
            </div>
          </motion.div>

        </motion.div>
      </motion.div>
    </motion.section>
  </>
);

export default ImpulseOption;
