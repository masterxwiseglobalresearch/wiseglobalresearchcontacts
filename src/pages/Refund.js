// src/pages/Refund.js
import React from 'react';
import { Trans, useTranslation } from '../i18nShim';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FaPhoneAlt, FaEnvelope, FaInfoCircle, FaGavel } from 'react-icons/fa';
import analytics from '../lib/analytics';


// Animation variants for smooth transitions
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.2 },
  },
};


function Refund() {
  const { t } = useTranslation();

  React.useEffect(() => {
    try {
      analytics.sendPageView(window.location.pathname, document.title);
      analytics.sendEvent('viewed_pillar_page', {
        page_title: document.title,
        page_path: window.location.pathname,
      });
    } catch (e) {
      // fail silently - analytics should be best-effort
    }
  }, []);

  return (
    <>
      <Helmet>
        <title>{t('pages.Refund.refund-policy-wise-global-research', 'Refund Policy | Wise Global Research')}</title>
        <meta name="description" content="Read our refund policy for Wise Global Research Services Pvt. Ltd. to understand eligibility and process." />
        <meta property="og:title" content="Refund Policy | Wise Global Research" />
        <meta property="og:description" content="Read our refund policy for Wise Global Research Services Pvt. Ltd. to understand eligibility and process." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://wiseglobalresearch.com/refund" />
        <meta name="twitter:title" content="Refund Policy | Wise Global Research" />
        <meta name="twitter:description" content="Read our refund policy for Wise Global Research Services Pvt. Ltd. to understand eligibility and process." />
      </Helmet>

      <motion.section
        className="relative py-8 sm:py-10 lg:py-14 px-4 sm:px-6"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <div className="container max-w-4xl mx-auto relative z-10">
          <motion.div
            className="mb-6 rounded-2xl p-4 sm:p-6 shadow-2xl text-black"
            style={{
              background: '#fff',
              border: '2px solid #6366f1',
              boxShadow: '0 8px 32px 0 rgba(60,60,120,0.18), 0 1.5px 8px 0 rgba(99,102,241,0.10)'
            }}
          >
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-indigo-700"><Trans i18nKey="pages.Refund.refund-policy">Refund Policy</Trans></h1>
              <div className="space-y-5 text-sm sm:text-base leading-relaxed">
                <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1, duration: 0.5 }}>
                  We at Wise Global Research Services Pvt Ltd. value our clients and are committed to providing unsurpassed services. While we take our accuracy seriously, our clients also need to realize that we do not offer a 100% guarantee on our recommendation. Once a service has been subscribed to and payment has been made for the same, the client will start receiving the Recommendation that they asked for. If for some unforeseen reason, the client is not satisfied with our services, they may contact us to seek oversight on future Recommendations.
                </motion.p>
                <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2, duration: 0.5 }}>
                  We at Wise Global Research Services Pvt Ltd. will put our best effort to increase the satisfaction levels in such cases. However, in the unlikely event that the client is not able to receive communications on the contact details provided (for example, due to DND or account settings), and our service provider logs indicate that communications were sent to those details, it will be deemed as delivery of service from our end and will not entitle the client to a refund for non-delivery. We advise clients to ensure their registered contact channel can receive service communications before or as soon as the service is started.
                </motion.p>
                <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3, duration: 0.5 }}>
                  All sales are final, and we do not offer refunds for the paid period of services already availed by the client. Complaints or dissatisfaction regarding the quality of services during the paid period shall not entitle the client to any refund or compensation.
                </motion.p>
                <div className="flex items-center mb-2 mt-8">
                  <FaGavel className="mr-3 text-xl" />
                  <h2 className="text-2xl font-semibold">SEBI Guidelines for Cancellation</h2>
                </div>
                <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4, duration: 0.5 }}>
                  As per SEBI guidelines, if a client requests to cancel the subscription, a refund shall only be issued for the unused portion of the subscription period. The refund will be calculated on a pro-rata basis, deducting the charges for the services already availed, including applicable taxes and administrative fees.
                </motion.p>
                <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5, duration: 0.5 }}>
                  Refunds will not be provided for the period of services already availed, irrespective of the client’s satisfaction with the recommendations or the outcome of trades.
                </motion.p>
                <div className="flex items-center mb-2 mt-8">
                  <FaInfoCircle className="text-blue-600 mr-3 text-xl" />
                  <h2 className="text-2xl font-semibold">Market Risks & User Acknowledgement</h2>
                </div>
                <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6, duration: 0.5 }}>
                  Investment in securities markets are subject to market risks. Profits and losses incurred due to the use of our recommendations are solely the responsibility of the client.
                </motion.p>
                <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7, duration: 0.5 }}>
                  By subscribing to our services and making payment, the client acknowledges that they have read, understood, and agreed to the refund policy, as well as the disclaimer, disclosure, and other terms mentioned on our website.
                </motion.p>

                <div className="mt-12 text-center">
                  <h2 className="text-2xl font-semibold mb-4"><Trans i18nKey="pages.Refund.contact-for-assistance">Contact for Assistance</Trans></h2>
                  <motion.p className="mb-4" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8, duration: 0.5 }}><Trans i18nKey="pages.Refund.for-any-questions-or-assistance-regardin-1">For any questions or assistance regarding our refund policy, please contact us at:</Trans></motion.p>
                  <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-6">
                    <div className="flex items-center">
                      <FaPhoneAlt className="mr-2 text-green-500" />
                      <a href="tel:919977909494" className="hover:underline">91-9977909494</a>
                    </div>
                    <div className="flex items-center">
                      <FaEnvelope className="mr-2 text-blue-500" />
                      <a href="mailto:support@wiseglobalresearch.com" className="hover:underline"><Trans i18nKey="pages.Refund.support-wiseglobalresearch-com">support@wiseglobalresearch.com</Trans></a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>
    </>
  );
}

export default Refund;
