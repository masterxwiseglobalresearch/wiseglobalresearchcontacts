
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
const ImpulseIndexOptions = () => (
  <>
    <Helmet>
      <title>Impulse Index Options - Wise Global Research</title>
      <meta name="description" content="Impulse Index Options page — Wise Global Research." />
      <link rel="canonical" href="https://wiseglobalresearch.com/impulseindexoptions" />
    </Helmet>
    <motion.section
      aria-labelledby="impulse-index-options-title"
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
          <motion.h1 id="impulse-index-options-title" className="text-4xl font-extrabold mb-4 text-center heading-purple" variants={fadeIn}>
            <Trans i18nKey="pages.ImpulseIndexOptions.impulse-index-options-3">Impulse Index Options</Trans>
          </motion.h1>

          <motion.p className="text-lg mb-6 text-center" variants={fadeIn}>
            Impulse Index Options focuses on high-volatility index trading, capitalizing on rapid index movements. Our expert team provides intraday and positional recommendations in index options, with a focus on timely entry and exit, proper targets, and stop loss. The service is designed for traders who want to benefit from sharp index moves with research-backed signals and disciplined risk management.
          </motion.p>

          {/* What You Will Get */}
          <motion.div className="mb-8" variants={staggerContainer}>
            <h2 className="text-2xl font-bold mb-2 heading-purple"><Trans i18nKey="pages.ImpulseIndexOptions.what-you-will-get">What You Will Get</Trans></h2>
            <ul className="list-disc pl-6 text-base mb-4">
              <li><Trans i18nKey="pages.ImpulseIndexOptions.2-3-intraday-positional-index-option-rec-1">1-2 Intraday/Positional index option recommendations per day (as per market conditions)</Trans></li>
              <li><Trans i18nKey="pages.ImpulseIndexOptions.each-recommendation-includes-2-targets-a-1">Each recommendation includes 2 targets and a proper stop loss</Trans></li>
              <li><Trans i18nKey="pages.ImpulseIndexOptions.timely-follow-ups-on-all-trade-signals-1">Timely follow-ups on all trade signals</Trans></li>
              <li><Trans i18nKey="pages.ImpulseIndexOptions.clear-entry-and-exit-timing-in-recommend-1">Clear entry and exit timing in recommendations</Trans></li>
              <li><Trans i18nKey="pages.ImpulseIndexOptions.careful-analysis-of-market-direction-and-1">Careful analysis of market direction and volatility</Trans></li>
              <li><Trans i18nKey="pages.ImpulseIndexOptions.concise-information-on-nifty-bank-nifty--1">Concise information on Nifty, Bank Nifty, and global indices</Trans></li>
            </ul>
          </motion.div>

          {/* Trading Rules */}
          <motion.div className="mb-8" variants={staggerContainer}>
            <h2 className="text-2xl font-bold mb-2 heading-purple"><Trans i18nKey="pages.ImpulseIndexOptions.trading-rules-every-trader-must-follow-1">Trading Rules Every Trader Must Follow</Trans></h2>
            <ul className="list-decimal pl-6 text-base mb-4">
              <li><Trans i18nKey="pages.ImpulseIndexOptions.do-not-over-trade">Do not over trade.</Trans></li>
              <li><Trans i18nKey="pages.ImpulseIndexOptions.trade-each-recommendation-with-the-same--1">Trade each recommendation with the same quantity as advised.</Trans></li>
              <li><Trans i18nKey="pages.ImpulseIndexOptions.profit-and-loss-are-subject-to-market-ri-1">Profit and loss are subject to market risk; no guarantee or assurance.</Trans></li>
              <li><Trans i18nKey="pages.ImpulseIndexOptions.never-be-emotional-1">Never be emotional.</Trans></li>
              <li><Trans i18nKey="pages.ImpulseIndexOptions.beware-of-overnight-risk-1">Beware of overnight risk.</Trans></li>
              <li><Trans i18nKey="pages.ImpulseIndexOptions.always-trade-with-a-stop-loss-1">Always trade with a stop loss.</Trans></li>
              <li><Trans i18nKey="pages.ImpulseIndexOptions.don-t-look-back-and-rue-trades-1">Don’t look back and rue trades.</Trans></li>
              <li><Trans i18nKey="pages.ImpulseIndexOptions.don-t-over-leverage-in-a-volatile-market-1">Don’t over leverage in a volatile market.</Trans></li>
              <li><Trans i18nKey="pages.ImpulseIndexOptions.costs-matter-a-lot-when-you-are-a-trader-1">Costs matter a lot when you are a trader.</Trans></li>
              <li><Trans i18nKey="pages.ImpulseIndexOptions.trading-begins-with-protecting-your-capi-1">Trading begins with protecting your capital.</Trans></li>
              <li><Trans i18nKey="pages.ImpulseIndexOptions.not-doing-anything-is-also-a-trading-str-1">Not doing anything is also a trading strategy.</Trans></li>
              <li><Trans i18nKey="pages.ImpulseIndexOptions.profit-is-what-is-booked-all-else-is-boo-1">Profit is what is booked; all else is book profits.</Trans></li>
            </ul>
          </motion.div>

          {/* Sample Calls */}
          <motion.div className="mb-8" variants={staggerContainer}>
            <h2 className="text-2xl font-bold mb-2 heading-purple"><Trans i18nKey="pages.ImpulseIndexOptions.sample-calls">Sample Calls</Trans></h2>
            <div className="bg-white/10 rounded-lg p-4 text-base font-mono text-left card-box">BUY CENTURYPLY ABOVE 512 TARGET 518 524 STOPLOSS 505</div>
          </motion.div>

          {/* Pricing Plan */}
          <motion.div className="mb-8 text-center" variants={staggerContainer}>
            <h2 className="text-2xl font-bold mb-2 heading-purple"><Trans i18nKey="pages.ImpulseIndexOptions.pricing-plan-for-impulse-index-options-1">Pricing Plan For Impulse Index Options</Trans></h2>
            <div className="grid grid-cols-1 gap-6 w-fit mx-auto justify-items-center">
              <div className="border rounded-xl p-6 shadow-md bg-white/30 flex flex-col items-center max-w-xs w-full card-box">
                <h3 className="text-xl font-bold mb-2 heading-purple"><Trans i18nKey="pages.ImpulseIndexOptions.impulse-index-options-2">Impulse Index Options</Trans></h3>
                <div className="text-3xl font-extrabold mb-2">₹49000<span className="text-base font-normal"><Trans i18nKey="pages.ImpulseIndexOptions.monthly">/ Monthly</Trans></span></div>
                <div className="mb-2"><Trans i18nKey="pages.ImpulseIndexOptions.2-to-3-calls-in-a-day-2">1 to 2 Calls in a Day</Trans></div>
                <Link to="/payment">
                  <button type="button" className="btn-purple mt-2"><Trans i18nKey="pages.ImpulseIndexOptions.payment">Payment</Trans></button>
                </Link>
                <div className="text-xs mt-2"><Trans i18nKey="pages.ImpulseIndexOptions.note-pricing-are-excluding-gst-18-2">Note: Pricing are excluding GST (18%)</Trans></div>
              </div>
            </div>
          </motion.div>

          {/* Why Choose Us Section */}
          <motion.div className="my-12" variants={staggerContainer}>
            <h2 className="text-2xl font-bold mb-4 text-center heading-purple"><Trans i18nKey="pages.ImpulseIndexOptions.why-choose-impulse-index-options-1">Why Choose Impulse Index Options?</Trans></h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/20 rounded-lg p-6 flex flex-col items-center card-box" style={{ background: 'rgba(255,255,255,0.12)' }}>
                <FaLightbulb className="text-4xl mb-2 text-yellow-300" />
                <h3 className="font-bold text-lg mb-1 heading-purple"><Trans i18nKey="pages.ImpulseIndexOptions.expert-research">Expert Research</Trans></h3>
                <p className="text-center"><Trans i18nKey="pages.ImpulseIndexOptions.our-team-combines-technical-and-fundamen-1">Our team combines technical and fundamental analysis for the most reliable recommendations.</Trans></p>
              </div>
              <div className="bg-white/20 rounded-lg p-6 flex flex-col items-center card-box" style={{ background: 'rgba(255,255,255,0.12)' }}>
                <FaBolt className="text-4xl mb-2 text-blue-300" />
                <h3 className="font-bold text-lg mb-1 heading-purple"><Trans i18nKey="pages.ImpulseIndexOptions.real-time-support">Real-Time Support</Trans></h3>
                <p className="text-center"><Trans i18nKey="pages.ImpulseIndexOptions.get-instant-help-and-trade-updates-from--1">Get instant help and trade updates during Indian market hours.</Trans></p>
              </div>
              <div className="bg-white/20 rounded-lg p-6 flex flex-col items-center card-box" style={{ background: 'rgba(255,255,255,0.12)' }}>
                <FaLock className="text-4xl mb-2 text-green-300" />
                <h3 className="font-bold text-lg mb-1 heading-purple"><Trans i18nKey="pages.ImpulseIndexOptions.trusted-by-traders-1">Trusted by Traders</Trans></h3>
                <p className="text-center"><Trans i18nKey="pages.ImpulseIndexOptions.hundreds-of-index-options-traders-rely-o-1">Hundreds of index options traders rely on our signals for consistent results.</Trans></p>
              </div>
            </div>
          </motion.div>

          {/* FAQ Section */}
          <motion.div className="my-12" variants={staggerContainer}>
            <h2 className="text-2xl font-bold mb-4 text-center heading-purple"><Trans i18nKey="pages.ImpulseIndexOptions.frequently-asked-questions-1">Frequently Asked Questions</Trans></h2>
            <div className="max-w-3xl mx-auto">
              <div className="mb-4">
                <h3 className="font-semibold heading-purple"><Trans i18nKey="pages.ImpulseIndexOptions.q-how-will-i-receive-the-recommendations-1">Q: How will I receive the recommendations?</Trans></h3>
                <p>A: Recommendations are delivered via SMS on your registered contact channel.</p>
              </div>
              <div className="mb-4">
                <h3 className="font-semibold heading-purple"><Trans i18nKey="pages.ImpulseIndexOptions.q-can-i-get-support-if-i-have-questions-1">Q: Can I get support if I have questions?</Trans></h3>
                <p>A: Our support team is available during Indian market hours.</p>
              </div>
              <div className="mb-4">
                <h3 className="font-semibold heading-purple"><Trans i18nKey="pages.ImpulseIndexOptions.q-is-there-a-refund-policy-1">Q: Is there a refund policy?</Trans></h3>
                <p><Trans i18nKey="pages.ImpulseIndexOptions.a-please-refer-to-our-terms-and-conditio-1">A: Please refer to our terms and conditions or contact support for refund-related queries.</Trans></p>
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

export default ImpulseIndexOptions;
