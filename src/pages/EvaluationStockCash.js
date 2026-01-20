
import React from 'react';
import { Trans } from '../i18nShim';
import { FaChartLine, FaRegClock, FaUserCheck } from 'react-icons/fa';
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

const EvaluationStockCash = () => (
  <>
    <Helmet>
      <title>Evaluation Stock Cash - Wise Global Research</title>
      <meta name="description" content="Evaluation Stock Cash page — Wise Global Research." />
      <link rel="canonical" href="https://wiseglobalresearch.com/evaluationstockcash" />
    </Helmet>

    <motion.section
      aria-labelledby="evaluation-stock-cash-title"
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
            <Trans i18nKey="pages.EvaluationStockCash.evaluation-stock-cash">Evaluation Stock Cash</Trans>
          </motion.h1>

          <motion.p className="text-lg mb-6 text-center" variants={fadeIn}>
            Wise Global Research Analyst provides equity research in the NSE cash segment by dedicated and experienced Research Analysts after in-depth technical analysis. Our equity trading recommendations are produced after proper analysis of the stock market. These technical levels are generated for recommendations that can provide good movement in the market. In a volatile market, our customers should only focus on intraday research and should not carry forward any position for the next day. A pure intraday product, where customers receive stock recommendations in the NSE cash segment. This product is designed for new customers who want to evaluate our recommendations in the cash market.
          </motion.p>

          {/* What You Will Get */}
          <motion.div className="mb-8" variants={staggerContainer}>
            <h2 className="text-2xl font-bold mb-2 heading-purple">What You Will Get</h2>
            <ul className="list-disc pl-6 text-base mb-4">
              <li>Daily pure intraday stock recommendations, frequency limited to 2 to 3 (as per market conditions).</li>
              <li>Each recommendation will have 2 targets with proper stop loss.</li>
              <li>Timely follow-ups of all trade signals.</li>
              <li>Proper time for entry & exit in recommendations.</li>
              <li>Careful analysis of market direction.</li>
            </ul>
            <div className="bg-white/10 rounded-lg p-4 mt-4">
              <h2 className="text-2xl font-bold mb-2 heading-purple">Sample Calls</h2>
              <div className="bg-white/10 rounded-lg p-4 text-left text-base font-mono card-box">BUY CENTURYPLY ABOVE 512 TARGET 518 524 STOPLOSS 505</div>
            </div>
          </motion.div>

          {/* Trading Rules */}
          <motion.div className="mb-8" variants={staggerContainer}>
            <h2 className="text-2xl font-bold mb-2 heading-purple">Trading Rules Every Trader Must Follow</h2>
            <ul className="list-decimal pl-6 text-base mb-4">
              <li>Do not over trade.</li>
              <li>Trade each recommendation with the same quantity as advised by the Research Team.</li>
              <li>Profit and loss are subject to market risk; there is no guarantee or assurance.</li>
              <li>Never be emotional while trading.</li>
              <li>Beware of overnight risk.</li>
              <li>Always trade with a stop loss.</li>
              <li>Don’t look back and regret past trades.</li>
              <li>Don’t over-leverage in a volatile market.</li>
              <li>Costs matter a lot when you are a trader.</li>
              <li>Protect your capital first—trading begins with risk management.</li>
              <li>Sometimes, not trading is also a valid strategy.</li>
              <li>Profit is what is booked; all else is just on paper.</li>
            </ul>
          </motion.div>

          {/* Pricing Plan */}
          <motion.div className="mb-8 text-center" variants={staggerContainer}>
            <h2 className="text-2xl font-bold mb-2 heading-purple">Pricing Plan For Evaluation Stock Cash</h2>
            <div className="flex justify-center">
              <div className="border rounded-xl p-6 shadow-md bg-white/30 flex flex-col items-center max-w-xs w-full card-box">
                <h3 className="text-xl font-bold mb-2 heading-purple">Cash Evaluation Pack</h3>
                <div className="text-3xl font-extrabold mb-2">₹5,100 <span className="text-base font-normal">/ weekly</span></div>
                <div className="mb-2">2 to 3 Calls in a Day</div>
                <Link to="/payment">
                  <button type="button" className="btn-purple mt-2">Payment</button>
                </Link>
                <div className="text-xs mt-2">Note: Prices are excluding GST (18%)</div>
              </div>
            </div>
          </motion.div>

          {/* Why Choose Us Section */}
          <motion.div className="my-12" variants={staggerContainer}>
            <h2 className="text-2xl font-bold mb-4 text-center heading-purple">Why Choose Evaluation Stock Cash?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/20 rounded-lg p-6 flex flex-col items-center card-box">
                <FaChartLine className="text-4xl mb-2 text-blue-300" />
                <h3 className="font-bold text-lg mb-1">Expert Research</h3>
                <p className="text-center">Our team combines technical and fundamental analysis for the most reliable stock recommendations.</p>
              </div>
              <div className="bg-white/20 rounded-lg p-6 flex flex-col items-center card-box">
                <FaRegClock className="text-4xl mb-2 text-yellow-300" />
                <h3 className="font-bold text-lg mb-1">Timely Updates</h3>
                <p className="text-center">Get instant trade signals and support during Indian market hours.</p>
              </div>
              <div className="bg-white/20 rounded-lg p-6 flex flex-col items-center card-box">
                <FaUserCheck className="text-4xl mb-2 text-green-400" />
                <h3 className="font-bold text-lg mb-1">Trusted by Traders</h3>
                <p className="text-center">Hundreds of stock traders rely on our signals for consistent results.</p>
              </div>
            </div>
          </motion.div>

          {/* FAQ Section */}
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

export default EvaluationStockCash;
