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

const EvaluationStockOption = () => (
  <>
    <Helmet>
      <title>Evaluation Stock Option - Wise Global Research</title>
      <meta name="description" content="Evaluation Stock Option page — Wise Global Research." />
      <link rel="canonical" href="https://wiseglobalresearch.com/evaluationstockoption" />
    </Helmet>

    <motion.section
      aria-labelledby="evaluation-stock-option-title"
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
          <motion.h1 className="text-4xl font-extrabold mb-4 text-center heading-purple" variants={fadeIn}><Trans i18nKey="pages.EvaluationStockOption.evaluation-stock-option">Evaluation Stock Option</Trans></motion.h1>

          <motion.p className="text-lg mb-6 text-center" variants={fadeIn}>
            Evaluation Stock Option service is specifically designed for option traders who want to take advantage of short-term stock price movement. Wise Global Research Analyst provides recommendations to intraday traders to optimize every market movement. Our team of analysts specializes in tracking the F&O market, major sectors, and blends technical analysis with national and international events to predict market moves. Our timely technical recommendations provide adequate time to enter trades and are a supreme blend of technical and fundamental research.
          </motion.p>

          <motion.p className="text-lg mb-6 text-center" variants={fadeIn}>
            <Trans i18nKey="pages.EvaluationStockOption.a-pure-intraday-product-where-customers-">A pure intraday product, where customers receive Stock Option recommendations in NSE. This product is designed for new customers who want to evaluate our recommendations in the Stock Option market.</Trans>
          </motion.p>

          {/* What We Offer */}
          <motion.div className="mb-8" variants={staggerContainer}>
            <h2 className="text-2xl font-bold mb-2 heading-purple"><Trans i18nKey="pages.EvaluationStockOption.what-we-offer">What We Offer</Trans></h2>
            <ul className="list-disc pl-6 text-base mb-4">
              <li><Trans i18nKey="pages.EvaluationStockOption.2-3-intraday-stock-option-recommendation">2-3 Intraday stock option recommendations (as per market conditions).</Trans></li>
              <li><Trans i18nKey="pages.EvaluationStockOption.each-recommendation-will-have-2-targets-">Each recommendation will have 2 targets with proper stop loss.</Trans></li>
              <li><Trans i18nKey="pages.EvaluationStockOption.timely-follow-ups-of-all-trade-signals">Timely follow-ups of all trade signals.</Trans></li>
              <li><Trans i18nKey="pages.EvaluationStockOption.proper-time-for-entry-exit-in-recommenda">Proper time for entry &amp; exit in recommendations.</Trans></li>
              <li><Trans i18nKey="pages.EvaluationStockOption.nifty-and-bank-nifty-trend-support-and-r">Nifty and Bank Nifty trend, support, and resistance levels.</Trans></li>
              <li><Trans i18nKey="pages.EvaluationStockOption.careful-analysis-of-market-direction-and">Careful analysis of market direction and concise domestic &amp; world market information.</Trans></li>
            </ul>
            <div className="bg-white/10 rounded-lg p-4 mt-4 text-left">
              <h2 className="text-2xl font-bold mb-2 heading-purple">Sample Calls</h2>
              <div className="bg-white/10 rounded-lg p-4 text-left text-base font-mono card-box">BUY CENTURYPLY ABOVE 512 TARGET 518 524 STOPLOSS 505</div>
            </div>
          </motion.div>

          {/* Trading Rules */}
          <motion.div className="mb-8" variants={staggerContainer}>
            <h2 className="text-2xl font-bold mb-2 heading-purple"><Trans i18nKey="pages.EvaluationStockOption.trading-rules-every-trader-must-follow">Trading Rules Every Trader Must Follow</Trans></h2>
            <ul className="list-decimal pl-6 text-base mb-4">
              <li><Trans i18nKey="pages.EvaluationStockOption.do-not-over-trade">Do not over trade.</Trans></li>
              <li><Trans i18nKey="pages.EvaluationStockOption.trade-each-recommendation-with-the-same-">Trade each recommendation with the same quantity as advised by the Research Team.</Trans></li>
              <li><Trans i18nKey="pages.EvaluationStockOption.profit-and-loss-are-subject-to-market-ri">Profit and loss are subject to market risk; there is no guarantee or assurance.</Trans></li>
              <li><Trans i18nKey="pages.EvaluationStockOption.never-be-emotional-while-trading">Never be emotional while trading.</Trans></li>
              <li><Trans i18nKey="pages.EvaluationStockOption.beware-of-overnight-risk">Beware of overnight risk.</Trans></li>
              <li><Trans i18nKey="pages.EvaluationStockOption.always-trade-with-a-stop-loss">Always trade with a stop loss.</Trans></li>
              <li><Trans i18nKey="pages.EvaluationStockOption.don-t-look-back-and-regret-past-trades">Don’t look back and regret past trades.</Trans></li>
              <li><Trans i18nKey="pages.EvaluationStockOption.don-t-over-leverage-in-a-volatile-market">Don’t over-leverage in a volatile market.</Trans></li>
              <li><Trans i18nKey="pages.EvaluationStockOption.costs-matter-a-lot-when-you-are-a-trader">Costs matter a lot when you are a trader.</Trans></li>
              <li><Trans i18nKey="pages.EvaluationStockOption.protect-your-capital-first-trading-begin">Protect your capital first—trading begins with risk management.</Trans></li>
              <li><Trans i18nKey="pages.EvaluationStockOption.sometimes-not-trading-is-also-a-valid-st">Sometimes, not trading is also a valid strategy.</Trans></li>
              <li><Trans i18nKey="pages.EvaluationStockOption.profit-is-what-is-booked-all-else-is-jus">Profit is what is booked; all else is just on paper.</Trans></li>
            </ul>
          </motion.div>

          {/* Pricing Plan */}
          <motion.div className="mb-8 text-center" variants={staggerContainer}>
            <h2 className="text-2xl font-bold mb-2 heading-purple"><Trans i18nKey="pages.EvaluationStockOption.pricing-plan-for-evaluation-stock-option">Pricing Plan For Evaluation Stock Option</Trans></h2>
            <div className="flex justify-center">
              <div className="border rounded-xl p-6 shadow-md bg-white/30 flex flex-col items-center max-w-xs w-full card-box" style={{ backdropFilter: 'blur(4px)' }}>
                <h3 className="text-xl font-bold mb-2 heading-purple"><Trans i18nKey="pages.EvaluationStockOption.option-evaluation-pack">Option Evaluation Pack</Trans></h3>
                <div className="text-3xl font-extrabold mb-2">₹5,100 <span className="text-base font-normal">/ weekly</span></div>
                <div className="mb-2">2 to 3 Calls in a Day</div>
                <Link to="/payment">
                  <button type="button" className="btn-purple mt-2"><Trans i18nKey="pages.EvaluationStockOption.payment">Payment</Trans></button>
                </Link>
                <div className="text-xs mt-2"><Trans i18nKey="pages.EvaluationStockOption.note-prices-are-excluding-gst-18">Note: Prices are excluding GST (18%)</Trans></div>
              </div>
            </div>
          </motion.div>

          {/* Why Choose Us Section */}
          <motion.div className="my-12" variants={staggerContainer}>
            <h2 className="text-2xl font-bold mb-4 text-center heading-purple"><Trans i18nKey="pages.EvaluationStockOption.why-choose-evaluation-stock-option">Why Choose Evaluation Stock Option?</Trans></h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/20 rounded-lg p-6 flex flex-col items-center card-box" style={{ background: 'rgba(255,255,255,0.12)' }}>
                <FaChartLine className="text-4xl mb-2 text-blue-300" />
                <h3 className="font-bold text-lg mb-1 heading-purple">Expert Research</h3>
                <p className="text-center">Our team combines technical and fundamental analysis for the most reliable stock option recommendations.</p>
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
            <h2 className="text-2xl font-bold mb-4 text-center heading-purple"><Trans i18nKey="pages.EvaluationStockOption.frequently-asked-questions">Frequently Asked Questions</Trans></h2>
            <div className="max-w-3xl mx-auto">
              <div className="mb-4">
                <h3 className="font-semibold heading-purple"><Trans i18nKey="pages.EvaluationStockOption.q-how-will-i-receive-the-recommendations">Q: How will I receive the recommendations?</Trans></h3>
                <p>A: Recommendations are delivered via SMS on your registered contact channel.</p>
              </div>
              <div className="mb-4">
                <h3 className="font-semibold heading-purple"><Trans i18nKey="pages.EvaluationStockOption.q-can-i-get-support-if-i-have-questions">Q: Can I get support if I have questions?</Trans></h3>
                <p>A: Our support team is available during Indian market hours.</p>
              </div>
              <div className="mb-4">
                <h3 className="font-semibold heading-purple"><Trans i18nKey="pages.EvaluationStockOption.q-is-there-a-refund-policy">Q: Is there a refund policy?</Trans></h3>
                <p><Trans i18nKey="pages.EvaluationStockOption.a-please-refer-to-our-terms-and-conditio">A: Please refer to our terms and conditions or contact support for refund-related queries.</Trans></p>
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

export default EvaluationStockOption;