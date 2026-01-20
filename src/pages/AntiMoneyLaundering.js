import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import ant2Image from '../assets/images/Ant2.png';
import mlImage from '../assets/images/MoneyLaundering.png';
// Breadcrumbs removed per request

// Animation variants
const containerVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.08, delayChildren: 0.12, duration: 0.6, ease: 'easeOut' }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45 } }
};

const AntiMoneyLaundering = () => {
  return (
    <div className="min-h-screen bg-transparent">
      <motion.section
        className="relative py-6 sm:py-8 lg:py-12 px-3 sm:px-6"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="container max-w-4xl mx-auto relative z-10">
          <motion.div
            className="mb-6 rounded-2xl p-3 sm:p-6 shadow-2xl"
            style={{
              background: '#fff',
              border: '2px solid #6366f1',
              boxShadow: '0 8px 32px 0 rgba(60,60,120,0.18), 0 1.5px 8px 0 rgba(99,102,241,0.10)'
            }}
            variants={itemVariants}
          >
            <div className="text-black">
              <Helmet>
                <title>Anti-Money Laundering (AML) — Wise Global</title>
                <meta name="description" content="Anti-Money Laundering (AML) overview, controls, KYC and monitoring practices as implemented by financial institutions and regulators." />
                <meta name="keywords" content="anti money laundering, AML, KYC, transaction monitoring, financial compliance" />
                <link rel="canonical" href="https://wiseglobalresearch.com/anti-money-laundering" />
                <meta property="og:title" content="Anti-Money Laundering (AML) — Wise Global" />
                <meta property="og:description" content="Overview of AML policies, KYC processes, transaction monitoring, and controls used by financial institutions to prevent money laundering." />
                <meta name="twitter:card" content="summary" />
              </Helmet>

              <motion.div className="text-center mb-6 px-1" variants={itemVariants}>
                <h1 className="mt-2 text-xl sm:text-2xl md:text-3xl font-extrabold text-indigo-700">Anti-Money Laundering (AML)</h1>
              </motion.div>

              <motion.div className="mb-6" variants={itemVariants}>
                <img
                  src={ant2Image}
                  alt="Anti-Money Laundering Overview"
                  className="w-full rounded-lg shadow object-contain max-h-44 sm:max-h-64 md:max-h-80"
                  decoding="async"
                  loading="eager"
                  fetchpriority="high"
                  onError={(e) => { e.currentTarget.onerror = null; }}
                  style={{ width: '100%', height: 'auto' }}
                />
              </motion.div>

              <motion.div className="prose dark:prose-dark max-w-none space-y-4 px-1">
                <motion.p variants={itemVariants} className="text-xs sm:text-sm md:text-base leading-relaxed">
                  Anti-Money Laundering (AML) is a set of policies, procedures, and technologies that prevents money laundering. It is implemented within government systems and large financial institutions to monitor potentially fraudulent activity.
                </motion.p>

                <motion.p variants={itemVariants} className="text-sm sm:text-base leading-relaxed">
                  AML policies are guidelines and processes developed by financial organizations to detect, prevent, and report potential money laundering activities. These rules maintain regulatory compliance and contribute to worldwide efforts to prevent financial crime.
                </motion.p>

                <motion.h2 variants={itemVariants} className="text-base sm:text-lg font-semibold text-indigo-600">Money Laundering — Overview</motion.h2>
                <motion.p variants={itemVariants} className="text-xs sm:text-sm md:text-base leading-relaxed">
                  There are three major steps in money laundering: placement, layering, and integration. The process typically involves placing illicit funds into the financial system (placement), carrying out transactions to disguise the origin (layering), and returning the cleaned funds to the economy (integration).
                </motion.p>

                <motion.p variants={itemVariants} className="text-sm sm:text-base leading-relaxed">
                  Financial institutions apply various controls to monitor suspicious activity that could be involved in money laundering. Common controls include customer due diligence, software filtering, transaction monitoring and holding periods.
                </motion.p>

                {/* Process figure */}
                <motion.div variants={itemVariants} className="mb-4">
                  <img
                    src={mlImage}
                    alt="Money Laundering Process"
                    className="w-full rounded-lg shadow max-h-48 sm:max-h-72 object-contain"
                    decoding="async"
                    loading="lazy"
                    onError={(e) => { e.currentTarget.onerror = null; }}
                  />
                </motion.div>

                <motion.h2 variants={itemVariants} className="text-lg font-semibold text-indigo-600">Anti-Money Laundering — Controls</motion.h2>

                <motion.ol variants={itemVariants} className="list-decimal list-inside space-y-2 text-xs sm:text-sm md:text-base">
                  <li>
                    <strong>Criminalization:</strong> Many governments, financial institutions, and businesses impose controls to prevent money laundering. Criminalization by authorities enables prosecution of individuals involved in laundering schemes and is supported by international agreements such as the United Nations conventions.
                  </li>

                  <li>
                    <strong>Know Your Customer (KYC):</strong> Financial institutions must implement KYC policies to verify and monitor customer identities, understand normal transaction behavior, and identify transactions that raise red flags. Suspicious activity must be reported to the appropriate financial investigation unit.
                  </li>

                  <li>
                    <strong>Record Management & Software Filtering:</strong> Institutions keep detailed transaction records and use software to flag suspicious activity. Customer data may be classified by risk level and transactions blocked or reviewed when certain criteria are met.
                  </li>

                  <li>
                    <strong>Holding Periods:</strong> Some banks require deposits to remain in an account for a designated number of days (commonly around five) to reduce the speed at which funds are moved and to help detect suspicious flows.
                  </li>

                  <li>
                    <strong>New Technology:</strong> Emerging technologies such as AI and big-data analytics improve detection accuracy. They enable sophisticated pattern recognition and real-time monitoring to identify laundering techniques more effectively.
                  </li>
                </motion.ol>

                <motion.h2 variants={itemVariants} className="text-base sm:text-lg font-semibold text-indigo-600">Conclusion</motion.h2>

                <motion.p variants={itemVariants} className="text-xs sm:text-sm md:text-base leading-relaxed">
                  By combining legal frameworks, careful customer screening, robust record-keeping, technology-driven monitoring, and staff training, AML programs help reduce financial crime and ensure compliance with regulatory requirements.
                </motion.p>
              </motion.div>

            </div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};
export default AntiMoneyLaundering;