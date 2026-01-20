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
const SmartIndexOption = () => (
  <>
      <Helmet>
        <title>Smart Index Option - Wise Global Research</title>
        <meta name="description" content="Smart Index Option page — Wise Global Research." />
        <link rel="canonical" href="https://wiseglobalresearch.com/smartindexoption" />
      </Helmet>
    <motion.section
      aria-labelledby="smart-index-option-title"
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
          <motion.h1 id="smart-index-option-title" className="text-4xl font-extrabold mb-4 text-center heading-purple" variants={fadeIn}>
            <Trans i18nKey="pages.SmartIndexOption.smart-index-option">Smart Index Option</Trans>
          </motion.h1>

          <motion.p className="text-lg mb-6 text-center" variants={fadeIn}>
            Smart Index Option service is specifically designed for option traders trading with precise technical research recommendation for Index Options. We provide the recommendations to intraday traders to optimize every market movement. It offers you nearly 1-2 intraday recommendations in a day as per market conditions with good market opportunity. The recommendations are given in Nifty and Bank Nifty Options only. Our timely generated technical recommendations provide adequate time to enter and exit in trades. We have a team of analysts who are specialized in Tracking the F&amp;O market and keep a complete track of all the national and international events and Major Sectors and blend it with technical analysis to predict the market moves. If you are looking for Index Options research/recommendation and do not want to invest much of times then this pack are perfect for you.
          </motion.p>

          {/* Features */}
          <motion.div className="mb-8" variants={staggerContainer}>
            <h2 className="text-2xl font-bold mb-2 heading-purple"><Trans i18nKey="pages.SmartIndexOption.smart-index-option-features-1">Smart Index Option Features</Trans></h2>
            <ul className="list-disc pl-6 text-base mb-4">
              <li><Trans i18nKey="pages.SmartIndexOption.we-provides-1-2-intraday-positional-reco-1">We provides 1-2 Intraday/Positional recommendation’s (as per market conditions)</Trans></li>
              <li><Trans i18nKey="pages.SmartIndexOption.all-recommendation-will-have-2-tgt-with--1">All recommendation will have 2 TGT with proper Stop loss.</Trans></li>
              <li><Trans i18nKey="pages.SmartIndexOption.timely-follow-ups-of-all-the-trade-signa-1">Timely Follow Ups of all the trade signals</Trans></li>
              <li><Trans i18nKey="pages.SmartIndexOption.proper-time-for-entry-amp-exit-in-recomm-1">Proper time for entry &amp; exit in recommendations.</Trans></li>
              <li><Trans i18nKey="pages.SmartIndexOption.nifty-and-bank-nifty-trend-and-support-a-1">Nifty and Bank Nifty Trend and Support and resistance.</Trans></li>
              <li><Trans i18nKey="pages.SmartIndexOption.carefully-analysis-market-direction-1">Carefully Analysis Market direction.</Trans></li>
              <li><Trans i18nKey="pages.SmartIndexOption.concise-information-of-domestic-amp-worl-1">Concise information of Domestic &amp; World Market.</Trans></li>
            </ul>
          </motion.div>

          {/* Trading Rules */}
          <motion.div className="mb-8" variants={staggerContainer}>
            <h2 className="text-2xl font-bold mb-2 heading-purple"><Trans i18nKey="pages.SmartIndexOption.trading-rules-every-trader-must-follow-1">Trading Rules Every Trader Must Follow</Trans></h2>
            <ul className="list-decimal pl-6 text-base mb-4">
              <li><Trans i18nKey="pages.SmartIndexOption.do-not-over-trade">Do not over trade.</Trans></li>
              <li><Trans i18nKey="pages.SmartIndexOption.have-to-trade-on-each-recommendation-wit-1">Have to trade on each Recommendation with same quantity according to Research Team.</Trans></li>
              <li><Trans i18nKey="pages.SmartIndexOption.profit-and-loss-is-subject-to-market-ris-1">Profit and Loss is subject to market risk and there is no guarantee or assurance for it.</Trans></li>
              <li><Trans i18nKey="pages.SmartIndexOption.never-be-emotional">Never be emotional.</Trans></li>
              <li><Trans i18nKey="pages.SmartIndexOption.beware-of-overnight-risk-1">Beware of overnight risk.</Trans></li>
              <li><Trans i18nKey="pages.SmartIndexOption.always-trade-with-a-stop-loss-1">Always trade with a stop loss.</Trans></li>
              <li><Trans i18nKey="pages.SmartIndexOption.don-t-look-back-and-rue-trades-1">Don’t look back and rue trades.</Trans></li>
              <li><Trans i18nKey="pages.SmartIndexOption.don-t-over-leverage-in-a-volatile-market-1">Don’t over leverage in a volatile market.</Trans></li>
              <li><Trans i18nKey="pages.SmartIndexOption.costs-matter-a-lot-when-you-are-a-trader-1">Costs matter a lot when you are a trader.</Trans></li>
              <li><Trans i18nKey="pages.SmartIndexOption.trading-begins-with-protecting-your-capi-1">Trading begins with protecting your capital.</Trans></li>
              <li><Trans i18nKey="pages.SmartIndexOption.not-doing-anything-is-also-a-trading-str-1">Not doing anything is also a trading strategy.</Trans></li>
              <li><Trans i18nKey="pages.SmartIndexOption.profit-is-what-is-booked-all-else-is-boo-1">Profit is what is booked; all else is book profits.</Trans></li>
            </ul>
          </motion.div>

          {/* Sample Calls */}
          <motion.div className="mb-8" variants={staggerContainer}>
            <h2 className="text-2xl font-bold mb-2 heading-purple"><Trans i18nKey="pages.SmartIndexOption.sample-calls">Sample Calls</Trans></h2>
            <div className="bg-white/10 rounded-lg p-4 text-left text-base font-mono card-box">
              <Trans i18nKey="pages.SmartIndexOption.buy-centuryply-above-512-target-518-524--1">BUY CENTURYPLY ABOVE 512 TARGET 518 524 STOPLOSS 505</Trans>
            </div>
          </motion.div>

          {/* Pricing Plan */}
          <motion.div className="mb-8 text-center" variants={staggerContainer}>
            <h2 className="text-2xl font-bold mb-2 heading-purple"><Trans i18nKey="pages.SmartIndexOption.pricing-plan-for-smart-index-option-1">Pricing Plan For Smart Index Option</Trans></h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-fit mx-auto justify-items-center">
              <div className="border rounded-xl p-6 shadow-md bg-white/30 flex flex-col items-center max-w-xs w-full card-box">
                <h3 className="text-xl font-bold mb-2 heading-purple"><Trans i18nKey="pages.SmartIndexOption.smart-index-option">Smart Index Option</Trans></h3>
                <div className="text-3xl font-extrabold mb-2">₹12,500 <span className="text-base font-normal"><Trans i18nKey="pages.SmartIndexOption.monthly">/ Monthly</Trans></span></div>
                <div className="mb-2"><Trans i18nKey="pages.SmartIndexOption.1-to-2-calls-in-a-day-2">1 to 2 Calls in a Day</Trans></div>
                <Link to="/payment">
                  <button type="button" className="btn-purple mt-2"><Trans i18nKey="pages.SmartIndexOption.payment">Payment</Trans></button>
                </Link>
                <div className="text-xs mt-2"><Trans i18nKey="pages.SmartIndexOption.note-pricing-are-excluding-gst-18-2">Note: Pricing are excluding GST (18%)</Trans></div>
              </div>
              <div className="border rounded-xl p-6 shadow-md bg-white/30 flex flex-col items-center max-w-xs w-full card-box">
                <h3 className="text-xl font-bold mb-2 heading-purple"><Trans i18nKey="pages.SmartIndexOption.smart-index-option">Smart Index Option</Trans></h3>
                <div className="text-3xl font-extrabold mb-2">₹35,500 <span className="text-base font-normal"><Trans i18nKey="pages.SmartIndexOption.quarterly">/ Quarterly</Trans></span></div>
                <div className="mb-2"><Trans i18nKey="pages.SmartIndexOption.1-to-2-calls-in-a-day-1">1 to 2 Calls in a Day</Trans></div>
                <Link to="/payment">
                  <button type="button" className="btn-purple mt-2"><Trans i18nKey="pages.SmartIndexOption.payment">Payment</Trans></button>
                </Link>
                <div className="text-xs mt-2"><Trans i18nKey="pages.SmartIndexOption.note-pricing-are-excluding-gst-18-1">Note: Pricing are excluding GST (18%)</Trans></div>
              </div>
            </div>
          </motion.div>

          {/* Why Choose Us Section */}
          <motion.div className="my-12" variants={staggerContainer}>
            <h2 className="text-2xl font-bold mb-4 text-center heading-purple"><Trans i18nKey="pages.SmartIndexOption.why-choose-smart-index-option-1">Why Choose Smart Index Option?</Trans></h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/20 rounded-lg p-6 flex flex-col items-center card-box" style={{ background: 'rgba(255,255,255,0.12)' }}>
                <FaLightbulb className="text-4xl mb-2 text-yellow-300" />
                <h3 className="font-bold text-lg mb-1 heading-purple"><Trans i18nKey="pages.SmartIndexOption.expert-research">Expert Research</Trans></h3>
                <p className="text-center"><Trans i18nKey="pages.SmartIndexOption.our-analysts-specialize-in-f-o-market-an-1">Our analysts specialize in F&amp;O market and combine technical &amp; fundamental analysis for precise index option recommendations.</Trans></p>
              </div>
              <div className="bg-white/20 rounded-lg p-6 flex flex-col items-center card-box" style={{ background: 'rgba(255,255,255,0.12)' }}>
                <FaBolt className="text-4xl mb-2 text-blue-300" />
                <h3 className="font-bold text-lg mb-1 heading-purple"><Trans i18nKey="pages.SmartIndexOption.timely-calls">Timely Calls</Trans></h3>
                <p className="text-center"><Trans i18nKey="pages.SmartIndexOption.receive-1-2-intraday-positional-calls-pe-1">Receive 1-2 intraday/positional calls per day with clear entry, targets and stop loss.</Trans></p>
              </div>
              <div className="bg-white/20 rounded-lg p-6 flex flex-col items-center card-box" style={{ background: 'rgba(255,255,255,0.12)' }}>
                <FaLock className="text-4xl mb-2 text-green-300" />
                <h3 className="font-bold text-lg mb-1 heading-purple"><Trans i18nKey="pages.SmartIndexOption.trusted-support">Trusted Support</Trans></h3>
                <p className="text-center">Real-time customer support during Indian market hours.</p>
              </div>
            </div>
          </motion.div>

          {/* FAQ Section */}
          <motion.div className="my-12" variants={staggerContainer}>
            <h2 className="text-2xl font-bold mb-4 text-center heading-purple"><Trans i18nKey="pages.SmartIndexOption.frequently-asked-questions-1">Frequently Asked Questions</Trans></h2>
            <div className="max-w-3xl mx-auto">
              <div className="mb-4">
                <h3 className="font-semibold heading-purple"><Trans i18nKey="pages.SmartIndexOption.q-which-symbols-do-you-cover-1">Q: Which symbols do you cover?</Trans></h3>
                <p><Trans i18nKey="pages.SmartIndexOption.a-we-cover-nifty-and-bank-nifty-options--1">A: We cover Nifty and Bank Nifty options only for this pack.</Trans></p>
              </div>
              <div className="mb-4">
                <h3 className="font-semibold heading-purple"><Trans i18nKey="pages.SmartIndexOption.q-how-will-i-receive-the-recommendations-1">Q: How will I receive the recommendations?</Trans></h3>
                <p>A: Recommendations are delivered via SMS on your registered contact channel.</p>
              </div>
              <div className="mb-4">
                <h3 className="font-semibold heading-purple"><Trans i18nKey="pages.SmartIndexOption.q-is-there-a-refund-policy-1">Q: Is there a refund policy?</Trans></h3>
                <p><Trans i18nKey="pages.SmartIndexOption.a-please-refer-to-our-terms-and-conditio-1">A: Please refer to our terms and conditions or contact support for refund-related queries.</Trans></p>
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

export default SmartIndexOption;