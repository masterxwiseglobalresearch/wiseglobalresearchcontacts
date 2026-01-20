
import React from 'react';
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

const UniversalCash = () => (
  <>
    <Helmet>
      <title>Universal Cash Recommendations | Wise Global</title>
      <meta name="description" content="Universal Cash: Cash-segment recommendations (intraday/BTST/positional) for NSE with clear targets and stop-loss levels. Research-backed trades delivered to registered channels." />
      <meta name="keywords" content="universal cash, cash segment recommendations, intraday calls, BTST recommendations, positional trades, NSE stock recommendations" />
      <link rel="canonical" href="https://wiseglobal.com/universal-cash" />
      <meta property="og:title" content="Universal Cash Recommendations | Wise Global" />
      <meta property="og:description" content="High-quality cash-segment recommendations for NSE traders, including intraday, BTST and positional calls with clear entry, targets and stop-loss." />
      <meta property="og:url" content="https://wiseglobal.com/universal-cash" />
      <meta name="twitter:card" content="summary_large_image" />
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: 'Universal Cash',
          description: 'Universal Cash provides cash-segment recommendations for NSE stocks with clear targets and stop-loss levels, delivered by Wise Global.',
        })}
      </script>
    </Helmet>

    <motion.section
      aria-labelledby="universal-cash-title"
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
          <motion.h1 id="universal-cash-title" className="text-4xl font-extrabold mb-4 text-center heading-purple" variants={fadeIn}>
            Universal Cash
          </motion.h1>
          <motion.p className="text-lg mb-6 text-center" variants={fadeIn}>
            Universal Cash provides cash-segment recommendations (intraday / BTST / positional) for the NSE stock market with clear targets and stop‑loss levels. This pack is designed for traders focused on the cash segment who prefer a small number of high‑quality, research-backed trades. Our experienced research team provides in-depth technical and fundamental analysis and shares recommendations via your registered contact channel.
          </motion.p>

          {/* Features */}
          <motion.div className="mb-8" variants={staggerContainer}>
            <h2 className="text-2xl font-bold mb-2 heading-purple">Universal Cash</h2>
            <ul className="list-disc pl-6 text-base mb-4">
              <li>We provide 2–3 intraday/positional recommendations per day (subject to market conditions).</li>
              <li>All recommendations include two targets and a clear stop‑loss.</li>
              <li>Timely follow-ups for all trade signals.</li>
              <li>Precise entry and exit timing for recommendations.</li>
              <li>NIFTY and Bank NIFTY trend analysis with support and resistance levels.</li>
              <li>Careful analysis of market direction.</li>
              <li>Concise domestic and global market updates.</li>
            </ul>
          </motion.div>

          {/* Trading Rules */}
          <motion.div className="mb-8" variants={staggerContainer}>
            <h2 className="text-2xl font-bold mb-2 heading-purple">Trading Rules Every Trader Must Follow</h2>
            <ul className="list-decimal pl-6 text-base mb-4">
              <li>Do not overtrade.</li>
              <li>Trade each recommendation with the same quantity as advised by the Research Team.</li>
              <li>Profit and loss are subject to market risk; there is no guarantee.</li>
              <li>Do not trade emotionally.</li>
              <li>Be mindful of overnight risk.</li>
              <li>Always use a stop‑loss.</li>
              <li>Don't revisit closed trades to regret them.</li>
              <li>Avoid over‑leveraging in volatile markets.</li>
              <li>Minimize costs; they materially affect trading returns.</li>
              <li>Protect your capital first.</li>
              <li>Sometimes the best action is to do nothing.</li>
              <li>Only booked profits count; unrealized gains are not realized until closed.</li>
            </ul>
          </motion.div>

          {/* Sample Calls */}
          <motion.div className="mb-8" variants={staggerContainer}>
            <h2 className="text-2xl font-bold mb-2 heading-purple">Sample Calls</h2>
            <div className="bg-white/10 rounded-lg p-4 text-left text-base font-mono card-box">BUY CENTURYPLY ABOVE 512 TARGET 518 524 STOPLOSS 505</div>
          </motion.div>

          {/* Pricing Plan */}
          <motion.div className="mb-8 text-center" variants={staggerContainer}>
            <h2 className="text-2xl font-bold mb-4 text-center heading-purple">Pricing Plan For Universal Cash</h2>
            <div className="flex justify-center mb-4">
              <div className="border rounded-xl p-6 shadow-md bg-white/30 flex flex-col items-center w-full max-w-md mx-auto card-box">
                <h3 className="text-xl font-bold mb-2 heading-purple">Universal Cash</h3>
                <div className="text-3xl font-extrabold mb-2">₹1,51,000 <span className="text-base font-normal">/ Quarterly</span></div>
                <div className="mb-2">2 to 3 Calls in a Day</div>
                <Link to="/payment" className="w-full">
                  <button type="button" className="w-full btn-purple mt-2">Payment</button>
                </Link>
                <div className="text-xs mt-2">Note: Pricing excludes GST (18%)</div>
              </div>
            </div>
          </motion.div>

          {/* Why Choose Us */}
          <motion.div className="my-12" variants={staggerContainer}>
            <h2 className="text-2xl font-bold mb-4 text-center heading-purple">Why Choose Universal Cash?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/20 rounded-lg p-6 flex flex-col items-center card-box" style={{ background: 'rgba(255,255,255,0.12)' }}>
                <FaLightbulb className="text-4xl mb-2 text-yellow-300" />
                <h3 className="font-bold text-lg mb-1 heading-purple">Expert Research</h3>
                <p className="text-center">Our team combines technical and fundamental analysis for the most reliable recommendations.</p>
              </div>
              <div className="bg-white/20 rounded-lg p-6 flex flex-col items-center card-box" style={{ background: 'rgba(255,255,255,0.12)' }}>
                <FaBolt className="text-4xl mb-2 text-blue-300" />
                <h3 className="font-bold text-lg mb-1 heading-purple">Real-Time Support</h3>
                <p className="text-center">Get help and trade updates during Indian market hours.</p>
              </div>
              <div className="bg-white/20 rounded-lg p-6 flex flex-col items-center card-box" style={{ background: 'rgba(255,255,255,0.12)' }}>
                <FaLock className="text-4xl mb-2 text-green-300" />
                <h3 className="font-bold text-lg mb-1 heading-purple">Trusted by Traders</h3>
                <p className="text-center">Hundreds of cash segment traders rely on our signals for consistent results.</p>
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
                <p>A: Yes, support is available during Indian market hours for any queries.</p>
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

export default UniversalCash;