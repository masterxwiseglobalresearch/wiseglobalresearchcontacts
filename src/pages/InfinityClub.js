
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
const InfinityClub = () => (
  <>
    <Helmet>
      <title>Infinity Club - Wise Global Research</title>
      <meta name="description" content="Infinity Club page — Wise Global Research." />
      <link rel="canonical" href="https://wiseglobalresearch.com/infinityclub" />
    </Helmet>
    <motion.section
      aria-labelledby="infinity-club-title"
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
          <motion.h1 id="infinity-club-title" className="text-4xl font-extrabold mb-4 text-center heading-purple" variants={fadeIn}>
            <Trans i18nKey="pages.InfinityClub.infinity-club">Infinity Club</Trans>
          </motion.h1>
          <motion.p className="text-lg mb-6 text-center" variants={fadeIn}>
            In Infinity Club, we provide you Future and Option intraday recommendations with proper target &amp; Stop loss in NSE Stock Market. The Pack is specially designed for traders who’s working in all segment of NSE market with proper research-based recommendations and believes in limited but quality trades. Our highly experienced teams always focus on proper entry and exit time of customer; we provide you research on the in-depth analysis using technical and fundamental analysis.
          </motion.p>

          {/* Features */}
          <motion.div className="mb-8" variants={staggerContainer}>
            <h2 className="text-2xl font-bold mb-2 heading-purple"><Trans i18nKey="pages.InfinityClub.infinity-club-features">Infinity Club Features</Trans></h2>
            <ul className="list-disc pl-6 text-base mb-4">
              <li><Trans i18nKey="pages.InfinityClub.we-provides-2-3-intraday-positional-reco-1">We provides 2-3 Intraday/Positional recommendation’s (as per market conditions).</Trans></li>
              <li><Trans i18nKey="pages.InfinityClub.all-recommendation-will-have-2-tgt-with--1">All recommendation will have 2 TGT with proper Stop loss.</Trans></li>
              <li><Trans i18nKey="pages.InfinityClub.timely-follow-ups-of-all-the-trade-signa-1">Timely Follow Ups of all the trade signals</Trans></li>
              <li><Trans i18nKey="pages.InfinityClub.proper-time-for-entry-amp-exit-in-recomm-1">Proper time for entry &amp; exit in recommendations.</Trans></li>
              <li><Trans i18nKey="pages.InfinityClub.nifty-and-bank-nifty-trend-and-support-a-1">Nifty and Bank Nifty Trend and Support and resistance.</Trans></li>
              <li><Trans i18nKey="pages.InfinityClub.carefully-analysis-market-direction-1">Carefully Analysis Market direction.</Trans></li>
              <li><Trans i18nKey="pages.InfinityClub.concise-information-of-domestic-amp-worl-1">Concise information of Domestic &amp; World Market.</Trans></li>
            </ul>
          </motion.div>

          {/* Trading Rules */}
          <motion.div className="mb-8" variants={staggerContainer}>
            <h2 className="text-2xl font-bold mb-2 heading-purple"><Trans i18nKey="pages.InfinityClub.trading-rules-every-trader-must-follow-1">Trading Rules Every Trader Must Follow</Trans></h2>
            <ul className="list-decimal pl-6 text-base mb-4">
              <li><Trans i18nKey="pages.InfinityClub.do-not-over-trade">Do not over trade.</Trans></li>
              <li><Trans i18nKey="pages.InfinityClub.have-to-trade-on-each-recommendation-wit-1">Have to trade on each Recommendation with same quantity according to Research Team.</Trans></li>
              <li><Trans i18nKey="pages.InfinityClub.profit-and-loss-is-subject-to-market-ris-1">Profit and Loss is subject to market risk and there is no guarantee or assurance for it.</Trans></li>
              <li><Trans i18nKey="pages.InfinityClub.never-be-emotional">Never be emotional.</Trans></li>
              <li><Trans i18nKey="pages.InfinityClub.beware-of-overnight-risk">Beware of overnight risk.</Trans></li>
              <li><Trans i18nKey="pages.InfinityClub.always-trade-with-a-stop-loss-1">Always trade with a stop loss.</Trans></li>
              <li><Trans i18nKey="pages.InfinityClub.don-t-look-back-and-rue-trades-1">Don’t look back and rue trades.</Trans></li>
              <li><Trans i18nKey="pages.InfinityClub.don-t-over-leverage-in-a-volatile-market-1">Don’t over leverage in a volatile market.</Trans></li>
              <li><Trans i18nKey="pages.InfinityClub.costs-matter-a-lot-when-you-are-a-trader-1">Costs matter a lot when you are a trader.</Trans></li>
              <li><Trans i18nKey="pages.InfinityClub.trading-begins-with-protecting-your-capi-1">Trading begins with protecting your capital.</Trans></li>
              <li><Trans i18nKey="pages.InfinityClub.not-doing-anything-is-also-a-trading-str-1">Not doing anything is also a trading strategy.</Trans></li>
              <li><Trans i18nKey="pages.InfinityClub.profit-is-what-is-booked-all-else-is-boo-1">Profit is what is booked; all else is book profits.</Trans></li>
            </ul>
          </motion.div>

          {/* Sample Calls */}
          <motion.div className="mb-8" variants={staggerContainer}>
            <h2 className="text-2xl font-bold mb-2 heading-purple"><Trans i18nKey="pages.InfinityClub.sample-calls">Sample Calls</Trans></h2>
            <div className="bg-white/10 rounded-lg p-4 text-left text-base font-mono card-box">
              <Trans i18nKey="pages.InfinityClub.buy-centuryply-above-512-target-518-524--1">BUY CENTURYPLY ABOVE 512 TARGET 518 524 STOPLOSS 505</Trans>
            </div>
          </motion.div>

          {/* Pricing Plan */}
          <motion.div className="mb-8 text-center" variants={staggerContainer}>
            <h2 className="text-2xl font-bold mb-2 heading-purple"><Trans i18nKey="pages.InfinityClub.pricing-plan-for-infinity-club-1">Pricing Plan For Infinity Club</Trans></h2>
            <div className="flex justify-center">
              <div className="border rounded-xl p-6 shadow-md bg-white/30 flex flex-col items-center w-full max-w-md card-box">
                <h3 className="text-xl font-bold mb-2 heading-purple"><Trans i18nKey="pages.InfinityClub.infinity-club">Infinity Club</Trans></h3>
                <div className="text-3xl font-extrabold mb-2">₹1,51,000 <span className="text-base font-normal"><Trans i18nKey="pages.InfinityClub.quarterly">/ Quarterly</Trans></span></div>
                <div className="mb-2"><Trans i18nKey="pages.InfinityClub.2-to-3-calls-in-a-day">2 to 3 Calls in a Day</Trans></div>
                <Link to="/payment">
                  <button type="button" className="btn-purple mt-2"><Trans i18nKey="pages.InfinityClub.payment">Payment</Trans></button>
                </Link>
                <div className="text-xs mt-2"><Trans i18nKey="pages.InfinityClub.note-pricing-are-excluding-gst-18-1">Note: Pricing are excluding GST (18%)</Trans></div>
              </div>
            </div>
          </motion.div>

          {/* Why Choose Us Section */}
          <motion.div className="my-12" variants={staggerContainer}>
            <h2 className="text-2xl font-bold mb-4 text-center heading-purple"><Trans i18nKey="pages.InfinityClub.why-choose-infinity-club">Why Choose Infinity Club?</Trans></h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/20 rounded-lg p-6 flex flex-col items-center card-box" style={{ background: 'rgba(255,255,255,0.12)' }}>
                <FaLightbulb className="text-4xl mb-2 text-yellow-300" />
                <h3 className="font-bold text-lg mb-1 heading-purple"><Trans i18nKey="pages.InfinityClub.expert-research">Expert Research</Trans></h3>
                <p className="text-center"><Trans i18nKey="pages.InfinityClub.our-team-combines-technical-and-fundamen-1">Our team combines technical and fundamental analysis for the most reliable recommendations.</Trans></p>
              </div>
              <div className="bg-white/20 rounded-lg p-6 flex flex-col items-center card-box" style={{ background: 'rgba(255,255,255,0.12)' }}>
                <FaBolt className="text-4xl mb-2 text-blue-300" />
                <h3 className="font-bold text-lg mb-1 heading-purple"><Trans i18nKey="pages.InfinityClub.real-time-support">Real-Time Support</Trans></h3>
                <p className="text-center">Get help and trade updates during Indian market hours.</p>
              </div>
              <div className="bg-white/20 rounded-lg p-6 flex flex-col items-center card-box" style={{ background: 'rgba(255,255,255,0.12)' }}>
                <FaLock className="text-4xl mb-2 text-green-300" />
                <h3 className="font-bold text-lg mb-1 heading-purple"><Trans i18nKey="pages.InfinityClub.trusted-by-traders">Trusted by Traders</Trans></h3>
                <p className="text-center"><Trans i18nKey="pages.InfinityClub.hundreds-of-f-amp-o-traders-rely-on-our--1">Hundreds of F&amp;O traders rely on our signals for consistent results.</Trans></p>
              </div>
            </div>
          </motion.div>

          {/* FAQ Section */}
          <motion.div className="my-12" variants={staggerContainer}>
            <h2 className="text-2xl font-bold mb-4 text-center heading-purple"><Trans i18nKey="pages.InfinityClub.frequently-asked-questions-1">Frequently Asked Questions</Trans></h2>
            <div className="max-w-3xl mx-auto">
              <div className="mb-4">
                <h3 className="font-semibold heading-purple"><Trans i18nKey="pages.InfinityClub.q-how-will-i-receive-the-recommendations-1">Q: How will I receive the recommendations?</Trans></h3>
                <p>A: Recommendations are delivered via SMS on your registered contact channel.</p>
              </div>
              <div className="mb-4">
                <h3 className="font-semibold heading-purple"><Trans i18nKey="pages.InfinityClub.q-can-i-get-support-if-i-have-questions-1">Q: Can I get support if I have questions?</Trans></h3>
                <p>A: Yes, support is available during Indian market hours for any queries.</p>
              </div>
              <div className="mb-4">
                <h3 className="font-semibold heading-purple"><Trans i18nKey="pages.InfinityClub.q-is-there-a-refund-policy-1">Q: Is there a refund policy?</Trans></h3>
                <p><Trans i18nKey="pages.InfinityClub.a-please-refer-to-our-terms-and-conditio-1">A: Please refer to our terms and conditions or contact support for refund-related queries.</Trans></p>
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

export default InfinityClub;
