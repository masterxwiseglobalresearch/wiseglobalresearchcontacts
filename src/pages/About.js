
import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Trans } from '../i18nShim';
import '../styles/headings.css';
const steps = [
  {
    img: 'https://www.mvmgroup.rs/wp-content/uploads/2023/01/istrazivanje-trzista-copy-1024x1024.webp',
    titleKey: 'pages.About.steps.research.title',
    title: 'Research & Analysis',
    descKey: 'pages.About.steps.research.desc',
    desc: 'In-depth market research and data-driven analysis focused on Indian markets.'
  },
  {
    img: 'https://corporater.com/wp-content/uploads/2023/10/Corporater_Strategy-Execution-Process.webp',
    titleKey: 'pages.About.steps.strategy.title',
    title: 'Strategy & Execution',
    descKey: 'pages.About.steps.strategy.desc',
    desc: 'Tailored trading and investment strategies designed to meet client goals.'
  },
  {
    img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmFxpK-nU4qoM4tWU5Yj-nCQde18ePj9NDBQ&s',
    titleKey: 'pages.About.steps.support.title',
    title: 'Ongoing Support',
    descKey: 'pages.About.steps.support.desc',
    desc: 'Continuous monitoring, reporting, and client support to adapt to market changes.'
  }
];

const About = () => {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.12 } },
  };
  return (
  <div className="min-h-screen bg-transparent">
    <Helmet>
      <title>About Wise Global Research</title>
      <meta name="description" content="Wise Global Research — market insights, recommendations and research for Indian financial markets." />
      <link rel="canonical" href="https://wiseglobalresearch.com/about" />
    </Helmet>
    <motion.section
      aria-labelledby="about-title"
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
        <motion.div className="container mx-auto px-4 py-12 max-w-5xl card-text" variants={staggerContainer}>
          <motion.h1 id="about-title" className="text-4xl md:text-5xl font-extrabold mb-4 text-center heading-purple" variants={fadeIn}>
            <Trans i18nKey="pages.About.title">About Wise Global Research </Trans>
          </motion.h1>
          <motion.p className="text-lg text-center mb-8" variants={fadeIn}>
            <Trans i18nKey="pages.About.subtitle">We provide market research, analytics, and actionable investment insights tailored for Indian investors and traders.</Trans>
          </motion.p>

          <motion.div className="max-w-3xl mx-auto text-center mb-8" variants={staggerContainer}>
            <p className="text-lg"><Trans i18nKey="pages.About.intro.lead">We prioritize what matters most: clear, practical, and research-backed guidance so you can make confident investment decisions.</Trans></p>
            <div className="mt-4 text-left md:text-center">
              <p>
                <Trans i18nKey="pages.About.intro.body">Wise Global Research is a SEBI registered analyst company dedicated to empowering you with straightforward, meaningful, and actionable recommendations and solutions, enabling you to confidently build wealth for any purpose. Committed to offering unbiased opinions backed by thorough research, we focus on providing valuable insights to participants in the Indian market.</Trans>
              </p>
            </div>
          </motion.div>

          <motion.div className="flex flex-col md:flex-row justify-center gap-8 mb-10" variants={staggerContainer}>
            <div className="bg-white/30 rounded-xl p-6 flex-1 text-center transition duration-300 ease-in-out hover:scale-105 hover:shadow-xl card-box">
              <h2 className="text-2xl font-bold mb-2 heading-purple"><Trans i18nKey="pages.About.sections.whoWeAre.title">Who we are</Trans></h2>
              <p><Trans i18nKey="pages.About.sections.whoWeAre.desc">A SEBI-registered analyst firm focused on delivering unbiased, actionable market research for Indian exchanges.</Trans></p>
            </div>
            <div className="bg-white/30 rounded-xl p-6 flex-1 text-center transition duration-300 ease-in-out hover:scale-105 hover:shadow-xl card-box">
              <h2 className="text-2xl font-bold mb-2 heading-purple"><Trans i18nKey="pages.About.sections.ourMission.title">Our mission</Trans></h2>
              <p><Trans i18nKey="pages.About.sections.ourMission.desc">To empower retail and institutional investors with clear, compliance-aware research and strategies.</Trans></p>
            </div>
            <div className="bg-white/30 rounded-xl p-6 flex-1 text-center transition duration-300 ease-in-out hover:scale-105 hover:shadow-xl card-box">
              <h2 className="text-2xl font-bold mb-2 heading-purple"><Trans i18nKey="pages.About.sections.ourVision.title">Our vision</Trans></h2>
              <p><Trans i18nKey="pages.About.sections.ourVision.desc">To become a trusted source of market intelligence for Indian financial participants.</Trans></p>
            </div>
          </motion.div>

          <motion.div className="text-center my-12" variants={staggerContainer}>
            <h2 className="text-3xl font-bold mb-6 text-center heading-purple"><Trans i18nKey="pages.About.values.title">Our Core Values</Trans></h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="bg-white/30 rounded-xl p-6 text-center shadow transition duration-300 ease-in-out hover:scale-105 hover:shadow-xl card-box">
                <h3 className="text-xl font-bold mb-2 heading-purple"><Trans i18nKey="pages.About.values.integrity.title">Integrity</Trans></h3>
                <p><Trans i18nKey="pages.About.values.integrity.desc">We uphold the highest standards of integrity in all of our actions.</Trans></p>
              </div>
              <div className="bg-white/30 rounded-xl p-6 text-center shadow transition duration-300 ease-in-out hover:scale-105 hover:shadow-xl card-box">
                <h3 className="text-xl font-bold mb-2 heading-purple"><Trans i18nKey="pages.About.values.clientFocus.title">Client Focus</Trans></h3>
                <p><Trans i18nKey="pages.About.values.clientFocus.desc">Our clients' success is our success. We are committed to their goals.</Trans></p>
              </div>
              <div className="bg-white/30 rounded-xl p-6 text-center shadow transition duration-300 ease-in-out hover:scale-105 hover:shadow-xl card-box">
                <h3 className="text-xl font-bold mb-2 heading-purple"><Trans i18nKey="pages.About.values.innovation.title">Innovation</Trans></h3>
                <p><Trans i18nKey="pages.About.values.innovation.desc">We constantly innovate to provide the best research and insights.</Trans></p>
              </div>
            </div>
          </motion.div>

          <motion.div className="text-center mb-10" variants={fadeIn}>
            <span className="inline-block bg-green-600 px-6 py-3 rounded-lg text-lg font-semibold shadow transition duration-300 ease-in-out hover:scale-105 hover:shadow-xl text-white">
              <Trans i18nKey="pages.About.contact.cta">Need help?</Trans>
              <a href="tel:+919977909494" className="underline ml-2" aria-label="Call Wise Global Research">+91 9977909494</a>
            </span>
          </motion.div>

          <motion.h2 className="text-3xl font-bold mb-6 text-center heading-purple" variants={fadeIn}>
            <Trans i18nKey="pages.About.howWeWork">How we work</Trans>
          </motion.h2>
          <motion.div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto" variants={staggerContainer}>
            {steps.map((step, idx) => (
              <div key={idx} className="bg-white/30 rounded-xl p-6 text-center flex flex-col items-center shadow transition duration-300 ease-in-out hover:scale-105 hover:shadow-xl card-box">
                <div className="w-16 h-16 mb-4 flex items-center justify-center bg-green-700 rounded-full overflow-hidden">
                  <img
                    src={step.img}
                    alt={step.title}
                    className="object-cover w-16 h-16"
                    decoding="async"
                    loading="lazy"
                    onError={(e) => { e.currentTarget.onerror = null; }}
                  />
                </div>
                <h3 className="text-xl font-bold mb-2 heading-purple"><Trans i18nKey={step.titleKey}>{step.title}</Trans></h3>
                <p><Trans i18nKey={step.descKey}>{step.desc}</Trans></p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.section>
  </div>
);}
export default About;
