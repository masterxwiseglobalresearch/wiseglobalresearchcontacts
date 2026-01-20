// src/pages/Vision.js
import React from 'react';
import { FaChartLine, FaShieldAlt, FaBookOpen, FaLightbulb, FaBullseye, FaArrowRight } from 'react-icons/fa';
import Layout from '../components/Layout';
import Card from '../components/Card';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import analytics from '../lib/analytics';
import { Link } from 'react-router-dom';
import '../styles/headings.css';
// Vision pillars and core values data (same as before)
const visionPillars = [
  {
    id: 1,
    title: 'Empowering Wealth Creation',
    description: 'We aim to empower Indian traders and investors with strategies to build wealth through NSE, BSE, and MCX markets, focusing on stocks like RELIANCE and commodities like GOLD.',
    icon: <FaChartLine className="text-4xl mb-4" style={{ color: '#6366f1' }} />,
  },
  {
    id: 2,
    title: 'Ethical Guidance',
    description: 'Our commitment to SEBI-compliant, transparent advice ensures trust and integrity in every recommendation, from Smart Options to MCX Supreme.',
    icon: <FaShieldAlt className="text-4xl mb-4" style={{ color: '#6366f1' }} />,
  },
  {
    id: 3,
    title: 'Education and Insights',
    description: 'We provide regular blogs, and demos to educate investors on market trends, helping them navigate NIFTY and BANKNIFTY with confidence.',
    icon: <FaBookOpen className="text-4xl mb-4" style={{ color: '#6366f1' }} />,
  },
  {
    id: 4,
    title: 'Innovative Technology',
    description: 'Leveraging AI and real-time data, we deliver cutting-edge tools for Indian traders, enhancing profitability in services like Universal Cash and Infinity Club.',
    icon: <FaLightbulb className="text-4xl mb-4" style={{ color: '#6366f1' }} />,
  },
];

const coreValues = [
  {
    id: 1,
    title: 'Transparency',
    description: 'We provide clear, honest, and SEBI-compliant advice, ensuring clients understand every recommendation and its risks.',
  },
  {
    id: 2,
    title: 'Client-Centric Approach',
  description: 'Our strategies are tailored to the needs of Indian investors all over India, from beginners to seasoned traders.',
  },
  {
    id: 3,
    title: 'Innovation',
    description: 'We use advanced analytics and AI to deliver high-probability trading signals for NSE, BSE, and MCX markets.',
  },
  {
    id: 4,
    title: 'Education',
    description: 'We empower clients with knowledge through, blogs, and market updates, fostering informed decision-making.',
  },
  {
    id: 5,
    title: 'Integrity',
    description: 'Our commitment to ethical practices ensures we prioritize client trust and long-term success over short-term gains.',
  },
  {
    id: 6,
    title: 'Excellence',
    description: 'We strive for excellence in every service, from daily recommendations to personalized support for Indian traders.',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const cardVariants = {
  hidden: { scale: 0.95, opacity: 0, y: 10 },
  visible: { scale: 1, opacity: 1, y: 0, transition: { duration: 0.45 } },
  hover: { scale: 1.03, boxShadow: '0 10px 30px rgba(0,0,0,0.12)' },
};

const Vision = () => {
  React.useEffect(() => {
    try {
      analytics.sendPageView(window.location.pathname, document.title);
      analytics.sendEvent('viewed_pillar_page', { page_title: document.title, page_path: window.location.pathname });
    } catch (e) {
      // best-effort
    }
  }, []);

  // no image handlers required on this page currently

  return (
    <>
      <Helmet>
        <title>Vision - Wise Global Research</title>
        <meta name="description" content="Vision page — Wise Global Research." />
        <link rel="canonical" href="https://wiseglobalresearch.com/vision" />
      </Helmet>
      <Layout>
        <motion.section className="relative py-6 sm:py-10 lg:py-14 px-2 sm:px-4 md:px-6" initial="hidden" animate="visible" variants={containerVariants}>
          <div className="container max-w-4xl mx-auto relative z-10">
            <motion.div
              className="mb-6 rounded-2xl p-4 sm:p-6 shadow-2xl card-heading"
              style={{
                background: '#fff',
                border: '2px solid #6366f1',
                boxShadow: '0 8px 32px 0 rgba(60,60,120,0.18), 0 1.5px 8px 0 rgba(99,102,241,0.10)'
              }}
            >
        <div className="card-text">
          <motion.h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center heading-purple" variants={cardVariants}>Our Vision & Mission</motion.h1>

                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05, duration: 0.45 }}>
                  <p className="text-sm sm:text-base leading-relaxed text-center mb-6" style={{ color: '#000000' }}>We empower Indian traders and investors with SEBI-compliant research, advanced analytics, and educational resources across NSE, BSE and MCX markets.</p>
                </motion.div>

                <motion.div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6" initial="hidden" animate="visible" variants={containerVariants}>
                  {visionPillars.map(p => (
                    <motion.div key={p.id} className="col-span-1" variants={cardVariants} whileHover="hover">
                      <Card className="p-6 card-box">
                        <div className="text-center mb-4">{p.icon}</div>
                        <h3 className="text-xl font-semibold mb-2 heading-purple">{p.title}</h3>
                        <p>{p.description}</p>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>

                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25, duration: 0.45 }} className="mt-8">
                  <h2 className="text-2xl font-bold mb-6 text-center heading-purple">Core Values</h2>
                  <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {coreValues.map(v => (
                      <motion.div key={v.id} variants={cardVariants} whileHover="hover">
                        <Card className="p-6 card-box">
                          <div className="text-center mb-4"><FaBullseye className="text-4xl" style={{ color: '#6366f1' }} /></div>
                          <h3 className="text-xl font-semibold mb-2 heading-purple">{v.title}</h3>
                          <p>{v.description}</p>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4, duration: 0.45 }} className="mt-8">
                  <div className="rounded-xl p-8 text-center card-box">
                    <h2 className="text-3xl font-bold mb-4 heading-purple">Stay Ahead with Wise Global</h2>
                    <p className="max-w-2xl mx-auto mb-6">Contact our team to explore trading solutions like Smart Options and MCX Supreme, tailored for Indian markets.</p>
                    <Link to="/contact" className="inline-block btn-purple px-6 py-3 font-semibold">Enquiry Now<FaArrowRight className="inline ml-2" /></Link>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.section>
      </Layout>
    </>
  );
};

export default Vision;