import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Trans } from '../i18nShim';
import { motion } from 'framer-motion';
import { FiInfo, FiAlertTriangle } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';


const Recommendation = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 },
    },
  };

  const handleContactClick = () => {
    navigate('/contact');
  };

  return (
    <motion.div
      className="min-h-screen"
      style={{ background: '#fff', color: '#0b1220', minHeight: '100vh' }}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Helmet>
        <title>Market Research & Stock Recommendations — Wise Global Research</title>
        <meta name="description" content="Research-backed stock recommendations, market insights, and SEBI-compliant disclosures from Wise Global Research. Read disclaimers before acting on any recommendation." />
        <link rel="canonical" href="https://wiseglobalresearch.com/recommendation" />
        <script type="application/ld+json">
          {`{
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Market Research & Stock Recommendations",
            "url": "https://wiseglobalresearch.com/recommendation",
            "description": "Research-backed stock recommendations and market insights for Indian investors."
          }`}
        </script>
      </Helmet>
      {/* Hero Section */}
      <motion.section
        className="text-center py-16 lg:py-20"
        variants={itemVariants}
      >
        <div className="container mx-auto px-4">
          <motion.h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-indigo-700" variants={itemVariants}><Trans i18nKey="pages.Recommendation.market-research-insights"><Trans i18nKey="pages.Recommendation.market-research-insights-1">Market Research Insights</Trans></Trans></motion.h1>
          <motion.p className="text-lg md:text-xl max-w-3xl mx-auto text-black" variants={itemVariants}><Trans i18nKey="pages.Recommendation.explore-our-expert-curated-market-resear"><Trans i18nKey="pages.Recommendation.explore-our-expert-curated-market-resear-1">Explore our expert-curated market research and analysis. Please read all disclaimers and risk disclosures before considering any insights.</Trans></Trans></motion.p>
        </div>
      </motion.section>

      {/* SEBI Disclaimer Section */}
  <motion.section className="py-12" variants={itemVariants}>
        <div className="container mx-auto px-4">
          <div className="p-6 shadow-2xl bg-white rounded-2xl" style={{ border: '2px solid #6366f1' }}>
            <h2 className="text-2xl font-bold mb-4 flex items-center text-indigo-700"><FiAlertTriangle className="mr-3 text-yellow-500" /><Trans i18nKey="pages.Recommendation.important-disclaimer">Important Disclaimer</Trans></h2>
            <p className="text-md mb-4 text-black">
              Wise Global Research is a SEBI Registered Research Analyst (INH000016719). Investment in the securities market is subject to market risks. Read all the related documents carefully before investing. The information provided herein is for educational purposes only and should not be construed as investment advice. We are not responsible for any losses incurred on the basis of these research insights.
            </p>
            <p className="text-md text-black"><Trans i18nKey="pages.Recommendation.the-securities-discussed-are-for-illustr"><Trans i18nKey="pages.Recommendation.the-securities-discussed-are-for-illustr-1">The securities discussed are for illustrative and research purposes only and are not direct recommendations to buy or sell. Past performance is not indicative of future results. Please consult your financial advisor before making any investment decisions.</Trans></Trans></p>
          </div>
        </div>
      </motion.section>

      {/* Market Insights Section */}
  <motion.section className="py-20" variants={containerVariants}>
        <div className="container mx-auto px-4">
          <motion.h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-indigo-700" variants={itemVariants}><Trans i18nKey="pages.Recommendation.market-insights-highlights"><Trans i18nKey="pages.Recommendation.market-insights-highlights-1">Market Insights & Highlights</Trans></Trans></motion.h2>
          <motion.div className="p-6 shadow-2xl text-lg leading-relaxed bg-white rounded-2xl text-black" style={{ border: '2px solid #6366f1' }} variants={itemVariants}>
            <ul className="list-disc list-inside space-y-4">
              <li><Trans i18nKey="pages.Recommendation.indian-stock-markets-have-shown-resilien"><Trans i18nKey="pages.Recommendation.indian-stock-markets-have-shown-resilien-1">Indian stock markets have shown resilience in the first half of the year, with Nifty and Sensex reaching new highs.</Trans></Trans></li>
              <li><Trans i18nKey="pages.Recommendation.it-and-pharma-sectors-have-outperformed-"><Trans i18nKey="pages.Recommendation.it-and-pharma-sectors-have-outperformed--1">IT and Pharma sectors have outperformed, while Banking and Auto sectors have seen healthy corrections and renewed buying interest.</Trans></Trans></li>
              <li><Trans i18nKey="pages.Recommendation.global-cues-including-us-fed-policy-and-"><Trans i18nKey="pages.Recommendation.global-cues-including-us-fed-policy-and--1">Global cues, including US Fed policy and crude oil prices, continue to influence short-term market sentiment.</Trans></Trans></li>
              {/* Portfolio-related content removed as per request */}
              <li><Trans i18nKey="pages.Recommendation.midcap-and-smallcap-stocks-have-delivere"><Trans i18nKey="pages.Recommendation.midcap-and-smallcap-stocks-have-delivere-1">Midcap and smallcap stocks have delivered strong returns, but risk management remains crucial for sustainable growth.</Trans></Trans></li>
              <li><Trans i18nKey="pages.Recommendation.stay-updated-with-our-research-for-actio"><Trans i18nKey="pages.Recommendation.stay-updated-with-our-research-for-actio-1">Stay updated with our research for actionable insights and timely updates on market trends.</Trans></Trans></li>
            </ul>
          </motion.div>
        </div>
      </motion.section>

      {/* Risk Disclosure Section */}
  <motion.section className="py-12" variants={itemVariants}>
        <div className="container mx-auto px-4">
          <div className="p-6 shadow-2xl bg-white rounded-2xl text-black" style={{ border: '2px solid #6366f1' }}>
            <h2 className="text-2xl font-bold mb-4 flex items-center text-indigo-700"><FiInfo className="mr-3 text-blue-500" /><Trans i18nKey="pages.Recommendation.risk-disclosure">Risk Disclosure</Trans></h2>
            <p className="text-md mb-4"><Trans i18nKey="pages.Recommendation.all-investments-involve-risk-and-the-pas"><Trans i18nKey="pages.Recommendation.all-investments-involve-risk-and-the-pas-1">All investments involve risk, and the past performance of a security, industry, sector, market, or financial product does not guarantee future results or returns. As an investor, you should be aware of the risks associated with any investment and consider them carefully before making any decisions.</Trans></Trans></p>
            <ul className="list-disc list-inside space-y-2">
              <li><Trans i18nKey="pages.Recommendation.the-value-of-investments-can-go-up-as-we"><Trans i18nKey="pages.Recommendation.the-value-of-investments-can-go-up-as-we-1">The value of investments can go up as well as down.</Trans></Trans></li>
              <li><Trans i18nKey="pages.Recommendation.you-may-not-get-back-the-amount-you-orig"><Trans i18nKey="pages.Recommendation.you-may-not-get-back-the-amount-you-orig-1">You may not get back the amount you originally invested.</Trans></Trans></li>
              <li><Trans i18nKey="pages.Recommendation.changes-in-exchange-rates-may-have-an-ad"><Trans i18nKey="pages.Recommendation.changes-in-exchange-rates-may-have-an-ad-1">Changes in exchange rates may have an adverse effect on the value, price or income of an investment.</Trans></Trans></li>
              <li><Trans i18nKey="pages.Recommendation.options-and-futures-are-complex-instrume"><Trans i18nKey="pages.Recommendation.options-and-futures-are-complex-instrume-1">Options and futures are complex instruments and are not suitable for all investors.</Trans></Trans></li>
            </ul>
          </div>
        </div>
      </motion.section>

      {/* Call to Action Section */}
  <motion.section className="py-20 text-center" variants={itemVariants}>
        <div className="container mx-auto px-4">
          <motion.h2 className="text-3xl md:text-4xl font-bold mb-4 text-indigo-700" variants={itemVariants}><Trans i18nKey="pages.Recommendation.ready-for-in-depth-research"><Trans i18nKey="pages.Recommendation.ready-for-in-depth-research-1">Ready for In-depth Research?</Trans></Trans></motion.h2>
          <motion.p className="text-lg md:text-xl max-w-3xl mx-auto mb-8 text-black" variants={itemVariants}><Trans i18nKey="pages.Recommendation.subscribe-to-our-premium-research-servic"><Trans i18nKey="pages.Recommendation.subscribe-to-our-premium-research-servic-1">Subscribe to our premium research services for comprehensive market analysis and insights.</Trans></Trans></motion.p>
          <motion.button
            className="btn-purple text-white font-bold py-3 px-8 rounded-full transition duration-300"
            variants={itemVariants}
            whileHover={{ scale: 1.1 }}
            onClick={handleContactClick}
          ><Trans i18nKey="pages.Recommendation.explore-premium-research"><Trans i18nKey="pages.Recommendation.explore-premium-research-1">Enquiry Now</Trans></Trans></motion.button>
        </div>
      </motion.section>
    </motion.div>
  );
};

export default Recommendation;