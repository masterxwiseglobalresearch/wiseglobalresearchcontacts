
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
const GalaxyMCX = () => (
  <>
      <Helmet>
        <title>Galaxy M C X - Wise Global Research</title>
        <meta name="description" content="Galaxy M C X page — Wise Global Research." />
        <link rel="canonical" href="https://wiseglobalresearch.com/galaxymcx" />
      </Helmet>
    <motion.section
      aria-labelledby="galaxy-mcx-title"
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
          <motion.h1 id="galaxy-mcx-title" className="text-4xl font-extrabold mb-4 text-center heading-purple" variants={fadeIn}>
            <Trans i18nKey="pages.GalaxyMCX.galaxy-mcx">Galaxy MCX</Trans>
          </motion.h1>
          <motion.p className="text-lg mb-6 text-center" variants={fadeIn}>
            Our MCX Commodity Service provides real-time trading insights, research-backed recommendations, and expert research recommendations for F&amp;O commodities such as gold, silver, crude oil, natural gas, and base metals. Designed for both beginners and experienced traders, whether you’re trading for short-term profits or long-term investments, our MCX Commodity Service is your reliable partner in navigating the Indian commodities market with confidence.
          </motion.p>
          <motion.p className="text-base mb-6 text-center" variants={fadeIn}>
            <Trans i18nKey="pages.GalaxyMCX.galaxy-mcx-is-ideal-for-traders-who-want-1">Galaxy MCX is ideal for traders who want detailed technical and fundamental market analysis in one pack.</Trans>
          </motion.p>

          {/* Features */}
          <motion.div className="mb-8" variants={staggerContainer}>
            <h2 className="text-2xl font-bold mb-2 heading-purple"><Trans i18nKey="pages.GalaxyMCX.galaxy-mcx-features">Galaxy MCX Features</Trans></h2>
            <ul className="list-disc pl-6 text-base mb-4">
              <li><Trans i18nKey="pages.GalaxyMCX.1-2-intraday-positional-recommendations--1">1-2 Intraday/Positional recommendations in Bullions, Base Metals, and Energy traded in MCX F&amp;O (as per market conditions).</Trans></li>
              <li><Trans i18nKey="pages.GalaxyMCX.each-recommendation-includes-2-targets-w-1">Each recommendation includes 2 targets with proper stop loss.</Trans></li>
              <li><Trans i18nKey="pages.GalaxyMCX.timely-follow-ups-and-updates-on-all-tra-1">Timely follow-ups and updates on all trade signals.</Trans></li>
              <li><Trans i18nKey="pages.GalaxyMCX.clear-entry-and-exit-timings-for-every-r-1">Clear entry and exit timings for every recommendation.</Trans></li>
              <li><Trans i18nKey="pages.GalaxyMCX.careful-analysis-of-market-direction-1">Careful analysis of market direction.</Trans></li>
              <li><Trans i18nKey="pages.GalaxyMCX.concise-information-of-domestic-world-ma-1">Concise information of domestic &amp; world market.</Trans></li>
            </ul>
          </motion.div>

          {/* Trading Rules */}
          <motion.div className="mb-8" variants={staggerContainer}>
            <h2 className="text-2xl font-bold mb-2 heading-purple"><Trans i18nKey="pages.GalaxyMCX.trading-rules-every-trader-must-follow-1">Trading Rules Every Trader Must Follow</Trans></h2>
            <ul className="list-decimal pl-6 text-base mb-4">
              <li><Trans i18nKey="pages.GalaxyMCX.do-not-over-trade">Do not over trade.</Trans></li>
              <li><Trans i18nKey="pages.GalaxyMCX.trade-each-recommendation-with-the-same--1">Trade each recommendation with the same quantity as advised by the Research Team.</Trans></li>
              <li><Trans i18nKey="pages.GalaxyMCX.profit-and-loss-are-subject-to-market-ri-1">Profit and loss are subject to market risk; there is no guarantee or assurance.</Trans></li>
              <li><Trans i18nKey="pages.GalaxyMCX.never-be-emotional-while-trading-1">Never be emotional while trading.</Trans></li>
              <li><Trans i18nKey="pages.GalaxyMCX.beware-of-overnight-risk">Beware of overnight risk.</Trans></li>
              <li><Trans i18nKey="pages.GalaxyMCX.always-trade-with-a-stop-loss-1">Always trade with a stop loss.</Trans></li>
              <li><Trans i18nKey="pages.GalaxyMCX.don-t-look-back-and-regret-past-trades-1">Don’t look back and regret past trades.</Trans></li>
              <li><Trans i18nKey="pages.GalaxyMCX.don-t-over-leverage-in-a-volatile-market-1">Don’t over-leverage in a volatile market.</Trans></li>
              <li><Trans i18nKey="pages.GalaxyMCX.costs-matter-a-lot-when-you-are-a-trader-1">Costs matter a lot when you are a trader.</Trans></li>
              <li><Trans i18nKey="pages.GalaxyMCX.protect-your-capital-first-trading-begin-1">Protect your capital first—trading begins with risk management.</Trans></li>
              <li><Trans i18nKey="pages.GalaxyMCX.sometimes-not-trading-is-also-a-valid-st-1">Sometimes, not trading is also a valid strategy.</Trans></li>
              <li><Trans i18nKey="pages.GalaxyMCX.profit-is-what-is-booked-all-else-is-jus-1">Profit is what is booked; all else is just on paper.</Trans></li>
            </ul>
          </motion.div>

          {/* Sample Calls */}
          <motion.div className="mb-8" variants={staggerContainer}>
            <h2 className="text-2xl font-bold mb-2 heading-purple"><Trans i18nKey="pages.GalaxyMCX.sample-calls">Sample Calls</Trans></h2>
            <div className="bg-white/10 rounded-lg p-4 text-left text-base font-mono card-box">
              BUY CENTURYPLY ABOVE 512 TARGET 518 524 STOPLOSS 505
            </div>
          </motion.div>

          {/* Pricing Plan */}
          <motion.div className="mb-8 text-center" variants={staggerContainer}>
            <h2 className="text-2xl font-bold mb-2 heading-purple"><Trans i18nKey="pages.GalaxyMCX.pricing-plan-for-galaxy-mcx">Pricing Plan For Galaxy MCX</Trans></h2>
            <div className="flex justify-center">
              <div className="border rounded-xl p-6 shadow-md bg-white/30 flex flex-col items-center w-full max-w-md card-box">
                <h3 className="text-xl font-bold mb-2 heading-purple"><Trans i18nKey="pages.GalaxyMCX.quarterly-plan">Quarterly Plan</Trans></h3>
                <div className="text-3xl font-extrabold mb-2">₹1,51,000</div>
                <div className="mb-2"><Trans i18nKey="pages.GalaxyMCX.1-to-2-calls-in-a-day">1 to 2 Calls in a Day</Trans></div>
                <Link to="/payment">
                  <button type="button" className="btn-purple mt-2"><Trans i18nKey="pages.GalaxyMCX.payment">Payment</Trans></button>
                </Link>
                <div className="text-xs mt-2"><Trans i18nKey="pages.GalaxyMCX.note-prices-are-excluding-gst-18-1">Note: Prices are excluding GST (18%)</Trans></div>
              </div>
            </div>
          </motion.div>

          {/* Why Choose Us */}
          <motion.div className="my-12" variants={staggerContainer}>
            <h2 className="text-2xl font-bold mb-4 text-center heading-purple"><Trans i18nKey="pages.GalaxyMCX.why-choose-galaxy-mcx">Why Choose Galaxy MCX?</Trans></h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/20 rounded-lg p-6 flex flex-col items-center card-box" style={{ background: 'rgba(255,255,255,0.12)' }}>
                <FaLightbulb className="text-4xl mb-2 text-yellow-300" />
                <h3 className="font-bold text-lg mb-1 heading-purple"><Trans i18nKey="pages.GalaxyMCX.expert-research">Expert Research</Trans></h3>
                <p className="text-center"><Trans i18nKey="pages.GalaxyMCX.our-team-combines-technical-and-fundamen-1">Our team combines technical and fundamental analysis for the most reliable recommendations.</Trans></p>
              </div>
              <div className="bg-white/20 rounded-lg p-6 flex flex-col items-center card-box" style={{ background: 'rgba(255,255,255,0.12)' }}>
                <FaBolt className="text-4xl mb-2 text-blue-300" />
                <h3 className="font-bold text-lg mb-1 heading-purple"><Trans i18nKey="pages.GalaxyMCX.real-time-support">Real-Time Support</Trans></h3>
                <p className="text-center"><Trans i18nKey="pages.GalaxyMCX.get-instant-help-and-trade-updates-from--1">Get instant help and trade updates during Indian market hours.</Trans></p>
              </div>
              <div className="bg-white/20 rounded-lg p-6 flex flex-col items-center card-box" style={{ background: 'rgba(255,255,255,0.12)' }}>
                <FaLock className="text-4xl mb-2 text-green-300" />
                <h3 className="font-bold text-lg mb-1 heading-purple"><Trans i18nKey="pages.GalaxyMCX.trusted-by-traders">Trusted by Traders</Trans></h3>
                <p className="text-center"><Trans i18nKey="pages.GalaxyMCX.hundreds-of-commodity-traders-rely-on-ou-1">Hundreds of commodity traders rely on our signals for consistent results.</Trans></p>
              </div>
            </div>
          </motion.div>

          {/* FAQ */}
          <motion.div className="my-12" variants={staggerContainer}>
            <h2 className="text-2xl font-bold mb-4 text-center heading-purple"><Trans i18nKey="pages.GalaxyMCX.frequently-asked-questions">Frequently Asked Questions</Trans></h2>
            <div className="max-w-3xl mx-auto">
              <div className="mb-4">
                <h3 className="font-semibold heading-purple"><Trans i18nKey="pages.GalaxyMCX.q-how-will-i-receive-the-recommendations-1">Q: How will I receive the recommendations?</Trans></h3>
                <p>A: Recommendations are delivered via SMS on your registered contact channel.</p>
              </div>
              <div className="mb-4">
                <h3 className="font-semibold heading-purple"><Trans i18nKey="pages.GalaxyMCX.q-can-i-get-support-if-i-have-questions-1">Q: Can I get support if I have questions?</Trans></h3>
                <p>A: Our support team is available during Indian market hours.</p>
              </div>
              <div className="mb-4">
                <h3 className="font-semibold heading-purple"><Trans i18nKey="pages.GalaxyMCX.q-is-there-a-refund-policy">Q: Is there a refund policy?</Trans></h3>
                <p><Trans i18nKey="pages.GalaxyMCX.a-please-refer-to-our-terms-and-conditio-1">A: Please refer to our terms and conditions or contact support for refund-related queries.</Trans></p>
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

export default GalaxyMCX;
