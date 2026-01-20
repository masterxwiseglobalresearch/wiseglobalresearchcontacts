
import React from 'react';
import { Trans } from '../i18nShim';
import { FaLightbulb, FaBolt, FaLock } from 'react-icons/fa';
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
const MCXSupreme = () => (
  <>
      <Helmet>
        <title>M C X Supreme - Wise Global Research</title>
        <meta name="description" content="M C X Supreme page — Wise Global Research." />
        <link rel="canonical" href="https://wiseglobalresearch.com/mcxsupreme" />
      </Helmet>
    <motion.section
      aria-labelledby="mcx-supreme-title"
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
          <motion.h1 id="mcx-supreme-title" className="text-4xl font-extrabold mb-4 text-center heading-purple" variants={fadeIn}>
            <Trans i18nKey="pages.MCXSupreme.mcx-supreme">MCX Supreme</Trans>
          </motion.h1>
          <motion.p className="text-lg mb-6 text-center" variants={fadeIn}>
            MCX Supreme is designed and destined to deliver recommendations with good market moves. Its unique blend of technical and fundamental research makes it one of the most exciting and rewarding products for commodity traders. Receive 1-2 intraday recommendations daily in Bullions, Base Metals, and Energy traded on MCX. Our timely technical recommendations provide you with adequate time to enter trades, while our supreme blend of technical and globally covered fundamental research ensures you stay ahead in the market.
          </motion.p>
          <motion.p className="text-base mb-6 text-center" variants={fadeIn}>
            <Trans i18nKey="pages.MCXSupreme.mcx-supreme-services-are-ideal-for-trade-1">MCX Supreme Services are ideal for traders who primarily deal in MCX commodities and want detailed technical and fundamental market analysis in one pack.</Trans>
          </motion.p>

          {/* What We Offer */}
          <motion.div className="mb-8" variants={staggerContainer}>
            <h2 className="text-2xl font-bold mb-2 heading-purple"><Trans i18nKey="pages.MCXSupreme.what-we-offer">What We Offer</Trans></h2>
            <ul className="list-disc pl-6 text-base mb-4">
              <li><Trans i18nKey="pages.MCXSupreme.1-2-intraday-positional-recommendations--1">1-2 Intraday/Positional recommendations in Bullions, Base Metals, and Energy (as per market conditions).</Trans></li>
              <li><Trans i18nKey="pages.MCXSupreme.each-recommendation-includes-2-targets-a-1">Each recommendation includes 2 targets and a proper stop loss.</Trans></li>
              <li><Trans i18nKey="pages.MCXSupreme.timely-follow-ups-and-updates-on-all-tra-1">Timely follow-ups and updates on all trade signals.</Trans></li>
              <li><Trans i18nKey="pages.MCXSupreme.clear-entry-and-exit-timings-for-every-r-1">Clear entry and exit timings for every recommendation.</Trans></li>
              <li><Trans i18nKey="pages.MCXSupreme.nifty-and-bank-nifty-trend-support-and-r-1">Nifty and Bank Nifty trend, support, and resistance levels.</Trans></li>
              <li><Trans i18nKey="pages.MCXSupreme.careful-analysis-of-market-direction-and-1">Careful analysis of market direction and concise domestic &amp; world market information.</Trans></li>
            </ul>
          </motion.div>

          {/* Trading Rules */}
          <motion.div className="mb-8" variants={staggerContainer}>
            <h2 className="text-2xl font-bold mb-2 heading-purple"><Trans i18nKey="pages.MCXSupreme.trading-rules-every-trader-must-follow-1">Trading Rules Every Trader Must Follow</Trans></h2>
            <ul className="list-decimal pl-6 text-base mb-4">
              <li><Trans i18nKey="pages.MCXSupreme.do-not-over-trade">Do not over trade.</Trans></li>
              {/* Removed SMS-only rule per policy */}
              <li><Trans i18nKey="pages.MCXSupreme.trade-each-recommendation-with-the-same--1">Trade each recommendation with the same quantity as advised by the Research Team.</Trans></li>
              <li><Trans i18nKey="pages.MCXSupreme.profit-and-loss-are-subject-to-market-ri-1">Profit and loss are subject to market risk; there is no guarantee or assurance.</Trans></li>
              <li><Trans i18nKey="pages.MCXSupreme.never-be-emotional-while-trading-1">Never be emotional while trading.</Trans></li>
              <li><Trans i18nKey="pages.MCXSupreme.beware-of-overnight-risk">Beware of overnight risk.</Trans></li>
              <li><Trans i18nKey="pages.MCXSupreme.always-trade-with-a-stop-loss-1">Always trade with a stop loss.</Trans></li>
              <li><Trans i18nKey="pages.MCXSupreme.don-t-look-back-and-regret-past-trades-1">Don’t look back and regret past trades.</Trans></li>
              <li><Trans i18nKey="pages.MCXSupreme.don-t-over-leverage-in-a-volatile-market-1">Don’t over-leverage in a volatile market.</Trans></li>
              <li><Trans i18nKey="pages.MCXSupreme.costs-matter-a-lot-when-you-are-a-trader-1">Costs matter a lot when you are a trader.</Trans></li>
              <li><Trans i18nKey="pages.MCXSupreme.protect-your-capital-first-trading-begin-1">Protect your capital first—trading begins with risk management.</Trans></li>
              <li><Trans i18nKey="pages.MCXSupreme.sometimes-not-trading-is-also-a-valid-st-1">Sometimes, not trading is also a valid strategy.</Trans></li>
              <li><Trans i18nKey="pages.MCXSupreme.profit-is-what-is-booked-all-else-is-jus-1">Profit is what is booked; all else is just on paper.</Trans></li>
            </ul>
          </motion.div>

          {/* Sample Calls */}
          <motion.div className="mb-8" variants={staggerContainer}>
            <h2 className="text-2xl font-bold mb-2 heading-purple"><Trans i18nKey="pages.MCXSupreme.sample-calls">Sample Calls</Trans></h2>
            <div className="bg-white/10 rounded-lg p-4 text-left text-base font-mono card-box">
              BUY CENTURYPLY ABOVE 512 TARGET 518 524 STOPLOSS 505
            </div>
          </motion.div>

          {/* Pricing */}
          <motion.div className="mb-8 text-center" variants={staggerContainer}>
            <h2 className="text-2xl font-bold mb-2 heading-purple"><Trans i18nKey="pages.MCXSupreme.pricing-plan-for-mcx-supreme-1">Pricing Plan For MCX Supreme</Trans></h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-fit mx-auto justify-items-center">
              <div className="border rounded-xl p-6 shadow-md bg-white/30 flex flex-col items-center max-w-xs w-full card-box">
                <h3 className="text-xl font-bold mb-2 heading-purple"><Trans i18nKey="pages.MCXSupreme.monthly-plan">Monthly Plan</Trans></h3>
                <div className="text-3xl font-extrabold mb-2">₹12,500</div>
                <div className="mb-2"><Trans i18nKey="pages.MCXSupreme.1-to-2-calls-in-a-day">1 to 2 Calls in a Day</Trans></div>
                <Link to="/payment">
                  <button type="button" className="btn-purple mt-2"><Trans i18nKey="pages.MCXSupreme.payment">Payment</Trans></button>
                </Link>
                <div className="text-xs mt-2"><Trans i18nKey="pages.MCXSupreme.note-prices-are-excluding-gst-18-2">Note: Prices are excluding GST (18%)</Trans></div>
              </div>
              <div className="border rounded-xl p-6 shadow-md bg-white/30 flex flex-col items-center max-w-xs w-full card-box">
                <h3 className="text-xl font-bold mb-2 heading-purple"><Trans i18nKey="pages.MCXSupreme.quarterly-plan">Quarterly Plan</Trans></h3>
                <div className="text-3xl font-extrabold mb-2">₹35,500</div>
                <div className="mb-2"><Trans i18nKey="pages.MCXSupreme.1-to-2-calls-in-a-day">1 to 2 Calls in a Day</Trans></div>
                <Link to="/payment">
                  <button type="button" className="btn-purple mt-2"><Trans i18nKey="pages.MCXSupreme.payment">Payment</Trans></button>
                </Link>
                <div className="text-xs mt-2"><Trans i18nKey="pages.MCXSupreme.note-prices-are-excluding-gst-18-1">Note: Prices are excluding GST (18%)</Trans></div>
              </div>
            </div>
          </motion.div>

          {/* Why Choose Us */}
          <motion.div className="my-12" variants={staggerContainer}>
            <h2 className="text-2xl font-bold mb-4 text-center heading-purple"><Trans i18nKey="pages.MCXSupreme.why-choose-mcx-supreme">Why Choose MCX Supreme?</Trans></h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/20 rounded-lg p-6 flex flex-col items-center card-box" style={{ background: 'rgba(255,255,255,0.12)' }}>
                <FaLightbulb className="text-4xl mb-2 text-yellow-300" />
                <h3 className="font-bold text-lg mb-1 heading-purple"><Trans i18nKey="pages.MCXSupreme.expert-research">Expert Research</Trans></h3>
                <p className="text-center"><Trans i18nKey="pages.MCXSupreme.our-team-combines-technical-and-fundamen-1">Our team combines technical and fundamental analysis for the most reliable recommendations.</Trans></p>
              </div>
              <div className="bg-white/20 rounded-lg p-6 flex flex-col items-center card-box" style={{ background: 'rgba(255,255,255,0.12)' }}>
                <FaBolt className="text-4xl mb-2 text-blue-300" />
                <h3 className="font-bold text-lg mb-1 heading-purple"><Trans i18nKey="pages.MCXSupreme.real-time-support">Real-Time Support</Trans></h3>
                <p className="text-center">Get help and trade updates during Indian market hours.</p>
              </div>
              <div className="bg-white/20 rounded-lg p-6 flex flex-col items-center card-box" style={{ background: 'rgba(255,255,255,0.12)' }}>
                <FaLock className="text-4xl mb-2 text-green-300" />
                <h3 className="font-bold text-lg mb-1 heading-purple"><Trans i18nKey="pages.MCXSupreme.trusted-by-traders">Trusted by Traders</Trans></h3>
                <p className="text-center"><Trans i18nKey="pages.MCXSupreme.hundreds-of-commodity-traders-rely-on-ou-1">Hundreds of commodity traders rely on our signals for consistent results.</Trans></p>
              </div>
            </div>
          </motion.div>

          {/* FAQ */}
          <motion.div className="my-12" variants={staggerContainer}>
            <h2 className="text-2xl font-bold mb-4 text-center heading-purple"><Trans i18nKey="pages.MCXSupreme.frequently-asked-questions">Frequently Asked Questions</Trans></h2>
            <div className="max-w-3xl mx-auto">
              <div className="mb-4">
                <h3 className="font-semibold heading-purple"><Trans i18nKey="pages.MCXSupreme.q-how-will-i-receive-the-recommendations-1">Q: How will I receive the recommendations?</Trans></h3>
                <p>A: Recommendations are delivered via SMS on your registered contact channel.</p>
              </div>
              <div className="mb-4">
                <h3 className="font-semibold heading-purple"><Trans i18nKey="pages.MCXSupreme.q-can-i-get-support-if-i-have-questions-1">Q: Can I get support if I have questions?</Trans></h3>
                <p>A: Yes, support is available during Indian market hours for any queries.</p>
              </div>
              <div className="mb-4">
                <h3 className="font-semibold heading-purple"><Trans i18nKey="pages.MCXSupreme.q-is-there-a-refund-policy">Q: Is there a refund policy?</Trans></h3>
                <p><Trans i18nKey="pages.MCXSupreme.a-please-refer-to-our-terms-and-conditio-1">A: Please refer to our terms and conditions or contact support for refund-related queries.</Trans></p>
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

export default MCXSupreme;
