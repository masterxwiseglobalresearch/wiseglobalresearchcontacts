
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

const SmartCash = () => (
  <>
    <Helmet>
      <title>Smart Cash - Wise Global Research</title>
      <meta name="description" content="Smart Cash page — Wise Global Research." />
      <link rel="canonical" href="https://wiseglobalresearch.com/smartcash" />
    </Helmet>

    <motion.section
      aria-labelledby="smart-cash-title"
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
          <motion.h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-4 text-center heading-purple" variants={fadeIn}><Trans i18nKey="pages.SmartCash.smart-cash">Smart Cash</Trans></motion.h1>
          <motion.p className="text-base sm:text-lg mb-6 text-center" variants={fadeIn}>
            Wise Global Research Analyst provides Equity research in the NSE cash segment by dedicated and experienced Research Analysts after in-depth technical analysis to our client. Our Equity trading research are produced with a high level of accuracy. We believe in such kind of volatile market our customers should only focus on intraday recommendations and should not carry forward any position for the next day. Stock cash is designed and destined to deliver returns that you deserve. It offers you nearly 2 to 3 intraday recommendations with a good level of accuracy. The recommendations are given in script traded on NSE. Our timely generated technical recommendations provide adequate time to enter in trades. Our recommendations are supreme blend of Technical and fundamental research. A pure intraday product, where customer receives stock recommendations in NSE cash segment.
          </motion.p>

          <motion.div className="mb-8 px-2 sm:px-0" variants={staggerContainer}>
            <h2 className="text-2xl font-bold mb-2 heading-purple"><Trans i18nKey="pages.SmartCash.what-you-will-get">What You Will Get</Trans></h2>
            <ul className="list-disc pl-6 text-sm sm:text-base mb-4">
              <li><Trans i18nKey="pages.SmartCash.daily-pure-intraday-stock-recommendation">Daily pure intraday stock recommendation’s frequency is limited to 2 to 3 (as per market conditions)</Trans></li>
              <li><Trans i18nKey="pages.SmartCash.all-recommendation-will-have-2-tgt-with-">All recommendation will have 2 TGT with proper Stop loss.</Trans></li>
              <li><Trans i18nKey="pages.SmartCash.timely-follow-ups-of-all-the-trade-signa">Timely Follow Ups of all the trade signals</Trans></li>
              <li><Trans i18nKey="pages.SmartCash.proper-time-for-entry-amp-exit-in-recomm">Proper time for entry &amp; exit in recommendations.</Trans></li>
              <li><Trans i18nKey="pages.SmartCash.carefully-analysis-market-direction">Carefully Analysis Market direction.</Trans></li>
            </ul>
          </motion.div>

          <motion.div className="mb-8 px-2 sm:px-0" variants={staggerContainer}>
            <h2 className="text-2xl font-bold mb-2 heading-purple"><Trans i18nKey="pages.SmartCash.trading-rules-every-trader-must-follow">Trading Rules Every Trader Must Follow</Trans></h2>
            <ul className="list-decimal pl-6 text-sm sm:text-base mb-4">
              <li><Trans i18nKey="pages.SmartCash.do-not-over-trade">Do not over trade.</Trans></li>
              <li><Trans i18nKey="pages.SmartCash.have-to-trade-on-each-recommendation-wit">Have to trade on each Recommendation with same quantity according to Research Team.</Trans></li>
              <li><Trans i18nKey="pages.SmartCash.profit-and-loss-is-subject-to-market-ris">Profit and Loss is subject to market risk and there is no guarantee or assurance for it.</Trans></li>
              <li><Trans i18nKey="pages.SmartCash.never-be-emotional">Never be emotional.</Trans></li>
              <li><Trans i18nKey="pages.SmartCash.beware-of-overnight-risk">Beware of overnight risk.</Trans></li>
              <li><Trans i18nKey="pages.SmartCash.always-trade-with-a-stop-loss">Always trade with a stop loss.</Trans></li>
              <li><Trans i18nKey="pages.SmartCash.don-t-look-back-and-rue-trades">Don’t look back and rue trades.</Trans></li>
              <li><Trans i18nKey="pages.SmartCash.don-t-over-leverage-in-a-volatile-market">Don’t over leverage in a volatile market.</Trans></li>
              <li><Trans i18nKey="pages.SmartCash.costs-matter-a-lot-when-you-are-a-trader">Costs matter a lot when you are a trader.</Trans></li>
              <li><Trans i18nKey="pages.SmartCash.trading-begins-with-protecting-your-capi">Trading begins with protecting your capital.</Trans></li>
              <li><Trans i18nKey="pages.SmartCash.not-doing-anything-is-also-a-trading-str">Not doing anything is also a trading strategy.</Trans></li>
              <li><Trans i18nKey="pages.SmartCash.profit-is-what-is-booked-all-else-is-boo">Profit is what is booked; all else is book profits.</Trans></li>
            </ul>
          </motion.div>

          <motion.div className="mb-8 px-2 sm:px-0" variants={staggerContainer}>
            <h2 className="text-2xl font-bold mb-2 heading-purple"><Trans i18nKey="pages.SmartCash.sample-calls">Sample Calls</Trans></h2>
            <div className="bg-white/10 rounded-lg p-4 text-left text-base font-mono card-box"><Trans i18nKey="pages.SmartCash.buy-centuryply-above-512-target-518-524-">BUY CENTURYPLY ABOVE 512 TARGET 518 524 STOPLOSS 505</Trans></div>
          </motion.div>

          <motion.div className="mb-8" variants={staggerContainer}>
            <h2 className="text-2xl font-bold mb-2 heading-purple text-center"><Trans i18nKey="pages.SmartCash.pricing-plan-for-smart-cash">Pricing Plan For Smart Cash</Trans></h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-fit mx-auto justify-items-center">
              <div className="w-full border rounded-xl p-6 shadow-md flex flex-col items-center card-box" style={{ background: 'rgba(255,255,255,0.3)', backdropFilter: 'blur(4px)' }}>
                <h3 className="text-xl font-bold mb-2 heading-purple"><Trans i18nKey="pages.SmartCash.smart-cash">Smart Cash</Trans></h3>
                <div className="text-3xl font-extrabold mb-2">₹12,500 <span className="text-base font-normal"><Trans i18nKey="pages.SmartCash.monthly">/ Monthly</Trans></span></div>
                <div className="mb-2">2 to 3 Calls in a Day</div>
                <Link to="/payment">
                  <button type="button" className="btn-purple mt-2"><Trans i18nKey="pages.SmartCash.payment">Payment</Trans></button>
                </Link>
                <div className="text-xs mt-2"><Trans i18nKey="pages.SmartCash.note-pricing-are-excluding-gst-18">Note: Pricing are excluding GST (18%)</Trans></div>
              </div>
              <div className="w-full border rounded-xl p-6 shadow-md flex flex-col items-center card-box" style={{ background: 'rgba(255,255,255,0.3)', backdropFilter: 'blur(4px)' }}>
                <h3 className="text-xl font-bold mb-2 heading-purple"><Trans i18nKey="pages.SmartCash.smart-cash">Smart Cash</Trans></h3>
                <div className="text-3xl font-extrabold mb-2">₹35,500 <span className="text-base font-normal"><Trans i18nKey="pages.SmartCash.quarterly">/ Quarterly</Trans></span></div>
                <div className="mb-2">2 to 3 Calls in a Day</div>
                <Link to="/payment">
                  <button type="button" className="btn-purple mt-2"><Trans i18nKey="pages.SmartCash.payment">Payment</Trans></button>
                </Link>
                <div className="text-xs mt-2"><Trans i18nKey="pages.SmartCash.note-pricing-are-excluding-gst-18">Note: Pricing are excluding GST (18%)</Trans></div>
              </div>
            </div>
          </motion.div>

          <motion.div className="my-12 px-2 sm:px-0" variants={staggerContainer}>
            <h2 className="text-2xl font-bold mb-4 text-center heading-purple"><Trans i18nKey="pages.SmartCash.why-choose-smart-cash">Why Choose Smart Cash?</Trans></h2>
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 gap-6">
              <div className="rounded-lg p-6 flex flex-col items-center w-full card-box" style={{ background: 'rgba(255,255,255,0.3)' }}>
                <FaLightbulb className="text-4xl mb-2 text-yellow-300" />
                <h3 className="font-bold text-lg mb-1 heading-purple"><Trans i18nKey="pages.SmartCash.expert-research">Expert Research</Trans></h3>
                <p className="text-center">Our team combines technical and fundamental analysis for the most reliable recommendations.</p>
              </div>
              <div className="rounded-lg p-6 flex flex-col items-center w-full card-box" style={{ background: 'rgba(255,255,255,0.3)' }}>
                <FaBolt className="text-4xl mb-2 text-blue-300" />
                <h3 className="font-bold text-lg mb-1 heading-purple"><Trans i18nKey="pages.SmartCash.real-time-support">Real-Time Support</Trans></h3>
                <p className="text-center">Get instant help and trade updates during Indian market hours.</p>
              </div>
              <div className="rounded-lg p-6 flex flex-col items-center w-full card-box" style={{ background: 'rgba(255,255,255,0.3)' }}>
                <FaLock className="text-4xl mb-2 text-green-300" />
                <h3 className="font-bold text-lg mb-1 heading-purple"><Trans i18nKey="pages.SmartCash.trusted-by-traders">Trusted by Traders</Trans></h3>
                <p className="text-center">Hundreds of cash segment traders rely on our signals for consistent results.</p>
              </div>
            </div>
          </motion.div>

          <motion.div className="my-12 px-2 sm:px-0" variants={staggerContainer}>
            <h2 className="text-2xl font-bold mb-4 text-center heading-purple"><Trans i18nKey="pages.SmartCash.frequently-asked-questions">Frequently Asked Questions</Trans></h2>
            <div className="max-w-3xl mx-auto">
              <div className="mb-4">
                <h3 className="font-semibold heading-purple"><Trans i18nKey="pages.SmartCash.q-how-will-i-receive-the-recommendations">Q: How will I receive the recommendations?</Trans></h3>
                <p>A: Recommendations are delivered via SMS on your registered contact channel.</p>
              </div>
              <div className="mb-4">
                <h3 className="font-semibold heading-purple"><Trans i18nKey="pages.SmartCash.q-can-i-get-support-if-i-have-questions">Q: Can I get support if I have questions?</Trans></h3>
                <p>A: Our support team is available during Indian market hours.</p>
              </div>
              <div className="mb-4">
                <h3 className="font-semibold heading-purple"><Trans i18nKey="pages.SmartCash.q-is-there-a-refund-policy">Q: Is there a refund policy?</Trans></h3>
                <p><Trans i18nKey="pages.SmartCash.a-please-refer-to-our-terms-and-conditio">A: Please refer to our terms and conditions or contact support for refund-related queries.</Trans></p>
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

export default SmartCash;