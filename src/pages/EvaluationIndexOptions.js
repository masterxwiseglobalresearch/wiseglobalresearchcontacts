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

const EvaluationIndexOptions = () => (
  <>
    <Helmet>
      <title>Evaluation Index Options - Wise Global Research</title>
      <meta name="description" content="Evaluation Index Options page — Wise Global Research." />
      <link rel="canonical" href="https://wiseglobalresearch.com/evaluationindexoptions" />
    </Helmet>

    <motion.section
      aria-labelledby="evaluation-index-options-title"
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
        <motion.div className="container mx-auto py-8 px-4 sm:px-6 max-w-4xl card-text" variants={staggerContainer}>
          <motion.h1 className="text-4xl font-extrabold mb-4 text-center heading-purple" variants={fadeIn}><Trans i18nKey="pages.EvaluationIndexOptions.evaluation-index-options">Evaluation Index Options</Trans></motion.h1>

          <motion.p className="text-lg mb-6 text-center" variants={fadeIn}>
            Evaluation Index Options service is specifically designed for option traders trading with precise technical research recommendations for Index Options. We provide recommendations to intraday traders to optimize every market movement. Nearly 1-2 intraday recommendations are given daily in Nifty and Bank Nifty Options, as per market conditions. Our timely technical recommendations provide adequate time to enter and exit trades. Our team of analysts specializes in tracking the F&O market, major sectors, and blends technical analysis with national and international events to predict market moves.
          </motion.p>

          <motion.p className="text-base mb-6 text-center" variants={fadeIn}><Trans i18nKey="pages.EvaluationIndexOptions.a-pure-intraday-product-where-customers-">A pure intraday product, where customers receive Index Option recommendations in NSE. This product is designed for new customers who want to evaluate our recommendations in the Stock Option market.</Trans></motion.p>

          {/* What We Offer */}
          <motion.div className="mb-8" variants={staggerContainer}>
            <h2 className="text-2xl font-bold mb-2 heading-purple"><Trans i18nKey="pages.EvaluationIndexOptions.what-we-offer">What We Offer</Trans></h2>
            <ul className="list-disc pl-6 text-base mb-4">
              <li><Trans i18nKey="pages.EvaluationIndexOptions.1-2-intraday-positional-recommendations-">1-2 Intraday/Positional recommendations in Nifty and Bank Nifty Options (as per market conditions).</Trans></li>
              <li><Trans i18nKey="pages.EvaluationIndexOptions.each-recommendation-includes-2-targets-a">Each recommendation includes 2 targets and a proper stop loss.</Trans></li>
              <li><Trans i18nKey="pages.EvaluationIndexOptions.timely-follow-ups-and-updates-on-all-tra">Timely follow-ups and updates on all trade signals.</Trans></li>
              <li><Trans i18nKey="pages.EvaluationIndexOptions.clear-entry-and-exit-timings-for-every-r">Clear entry and exit timings for every recommendation.</Trans></li>
              <li><Trans i18nKey="pages.EvaluationIndexOptions.nifty-and-bank-nifty-trend-support-and-r">Nifty and Bank Nifty trend, support, and resistance levels.</Trans></li>
              <li><Trans i18nKey="pages.EvaluationIndexOptions.careful-analysis-of-market-direction-and">Careful analysis of market direction and concise domestic & world market information.</Trans></li>
            </ul>
          </motion.div>

          {/* Trading Rules */}
          <motion.div className="mb-8" variants={staggerContainer}>
            <h2 className="text-2xl font-bold mb-2 heading-purple"><Trans i18nKey="pages.EvaluationIndexOptions.trading-rules-every-trader-must-follow">Trading Rules Every Trader Must Follow</Trans></h2>
            <ul className="list-decimal pl-6 text-base mb-4">
              <li><Trans i18nKey="pages.EvaluationIndexOptions.do-not-over-trade">Do not over trade.</Trans></li>
              <li><Trans i18nKey="pages.EvaluationIndexOptions.trade-each-recommendation-with-the-same-">Trade each recommendation with the same quantity as advised by the Research Team.</Trans></li>
              <li><Trans i18nKey="pages.EvaluationIndexOptions.profit-and-loss-are-subject-to-market-ri">Profit and loss are subject to market risk; there is no guarantee or assurance.</Trans></li>
              <li><Trans i18nKey="pages.EvaluationIndexOptions.never-be-emotional-while-trading">Never be emotional while trading.</Trans></li>
              <li><Trans i18nKey="pages.EvaluationIndexOptions.beware-of-overnight-risk">Beware of overnight risk.</Trans></li>
              <li><Trans i18nKey="pages.EvaluationIndexOptions.always-trade-with-a-stop-loss">Always trade with a stop loss.</Trans></li>
              <li><Trans i18nKey="pages.EvaluationIndexOptions.don-t-look-back-and-regret-past-trades">Don’t look back and regret past trades.</Trans></li>
              <li><Trans i18nKey="pages.EvaluationIndexOptions.don-t-over-leverage-in-a-volatile-market">Don’t over-leverage in a volatile market.</Trans></li>
              <li><Trans i18nKey="pages.EvaluationIndexOptions.costs-matter-a-lot-when-you-are-a-trader">Costs matter a lot when you are a trader.</Trans></li>
              <li><Trans i18nKey="pages.EvaluationIndexOptions.protect-your-capital-first-trading-begin">Protect your capital first—trading begins with risk management.</Trans></li>
              <li><Trans i18nKey="pages.EvaluationIndexOptions.sometimes-not-trading-is-also-a-valid-st">Sometimes, not trading is also a valid strategy.</Trans></li>
              <li><Trans i18nKey="pages.EvaluationIndexOptions.profit-is-what-is-booked-all-else-is-jus">Profit is what is booked; all else is just on paper.</Trans></li>
            </ul>
          </motion.div>

          {/* Sample Calls */}
          <motion.div className="mb-8" variants={staggerContainer}>
            <h2 className="text-2xl font-bold mb-2 heading-purple"><Trans i18nKey="pages.EvaluationIndexOptions.sample-calls">Sample Calls</Trans></h2>
            <div className="bg-white/10 rounded-lg p-4 text-left text-base font-mono card-box">BUY CENTURYPLY ABOVE 512 TARGET 518 524 STOPLOSS 505</div>
          </motion.div>

          {/* Pricing Plan */}
          <motion.div className="mb-8 text-center" variants={staggerContainer}>
            <h2 className="text-2xl font-bold mb-2 heading-purple"><Trans i18nKey="pages.EvaluationIndexOptions.pricing-plan-for-evaluation-index-option">Pricing Plan For Evaluation Index Options</Trans></h2>
            <div className="flex justify-center">
              <div className="border rounded-xl p-6 shadow-md bg-white/30 flex flex-col items-center max-w-xs w-full card-box" style={{ backdropFilter: 'blur(4px)' }}>
                <h3 className="text-xl font-bold mb-2 heading-purple"><Trans i18nKey="pages.EvaluationIndexOptions.index-evaluation-pack">Index Evaluation Pack</Trans></h3>
                <div className="text-3xl font-extrabold mb-2">₹5,100 <span className="text-base font-normal">/ weekly</span></div>
                <div className="mb-2">1 to 2 Calls in a Day</div>
                <Link to="/payment">
                  <button type="button" className="btn-purple mt-2"><Trans i18nKey="pages.EvaluationIndexOptions.payment">Payment</Trans></button>
                </Link>
                <div className="text-xs mt-2"><Trans i18nKey="pages.EvaluationIndexOptions.note-prices-are-excluding-gst-18">Note: Prices are excluding GST (18%)</Trans></div>
              </div>
            </div>
          </motion.div>

          {/* Why Choose Us Section */}
          <motion.div className="my-12" variants={staggerContainer}>
            <h2 className="text-2xl font-bold mb-4 text-center heading-purple"><Trans i18nKey="pages.EvaluationIndexOptions.why-choose-evaluation-index-options">Why Choose Evaluation Index Options?</Trans></h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/20 rounded-lg p-6 flex flex-col items-center card-box" style={{ background: 'rgba(255,255,255,0.12)' }}>
                <FaChartLine className="text-4xl mb-2 text-blue-300" />
                <h3 className="font-bold text-lg mb-1 heading-purple">Expert Research</h3>
                <p className="text-center">Our team combines technical and fundamental analysis for the most reliable index option recommendations.</p>
              </div>
              <div className="bg-white/20 rounded-lg p-6 flex flex-col items-center card-box" style={{ background: 'rgba(255,255,255,0.12)' }}>
                <FaRegClock className="text-4xl mb-2 text-yellow-300" />
                <h3 className="font-bold text-lg mb-1 heading-purple">Timely Updates</h3>
                <p className="text-center">Get instant trade signals and support during Indian market hours.</p>
              </div>
              <div className="bg-white/20 rounded-lg p-6 flex flex-col items-center card-box" style={{ background: 'rgba(255,255,255,0.12)' }}>
                <FaUserCheck className="text-4xl mb-2 text-green-400" />
                <h3 className="font-bold text-lg mb-1 heading-purple">Trusted by Traders</h3>
                <p className="text-center">Hundreds of option traders rely on our signals for consistent results.</p>
              </div>
            </div>
          </motion.div>

          {/* FAQ Section */}
          <motion.div className="my-12" variants={staggerContainer}>
            <h2 className="text-2xl font-bold mb-4 text-center heading-purple"><Trans i18nKey="pages.EvaluationIndexOptions.frequently-asked-questions">Frequently Asked Questions</Trans></h2>
            <div className="max-w-3xl mx-auto">
              <div className="mb-4">
                <h3 className="font-semibold heading-purple"><Trans i18nKey="pages.EvaluationIndexOptions.q-how-will-i-receive-the-recommendations">Q: How will I receive the recommendations?</Trans></h3>
                <p>A: Recommendations are delivered via SMS on your registered contact channel.</p>
              </div>
              <div className="mb-4">
                <h3 className="font-semibold heading-purple"><Trans i18nKey="pages.EvaluationIndexOptions.q-can-i-get-support-if-i-have-questions">Q: Can I get support if I have questions?</Trans></h3>
                <p>A: Our support team is available during Indian market hours.</p>
              </div>
              <div className="mb-4">
                <h3 className="font-semibold heading-purple"><Trans i18nKey="pages.EvaluationIndexOptions.q-is-there-a-refund-policy">Q: Is there a refund policy?</Trans></h3>
                <p><Trans i18nKey="pages.EvaluationIndexOptions.a-please-refer-to-our-terms-and-conditio">A: Please refer to our terms and conditions or contact support for refund-related queries.</Trans></p>
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

export default EvaluationIndexOptions;