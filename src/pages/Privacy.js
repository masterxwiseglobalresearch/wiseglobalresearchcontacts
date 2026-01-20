// src/pages/Privacy.js
import React from 'react';
import { Trans, useTranslation } from '../i18nShim';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FaShieldAlt, FaEnvelope } from 'react-icons/fa';
import analytics from '../lib/analytics';

// container-level stagger is used inline in the motion.section

function Privacy() {
    const { t } = useTranslation();

    React.useEffect(() => {
      try {
        analytics.sendPageView(window.location.pathname, document.title);
        analytics.sendEvent('viewed_pillar_page', {
          page_title: document.title,
          page_path: window.location.pathname,
        });
      } catch (e) {
        // best-effort
      }
    }, []);

    return (
      <>
        <Helmet>
          <title>{t('pages.Privacy.privacy-policy-wise-global-research', 'Privacy Policy | Wise Global Research')}</title>
          <meta name="description" content="Read the privacy policy of Wise Global Research Services. Learn how we protect your data and privacy as a SEBI registered research analyst." />
          <meta property="og:title" content="Privacy Policy | Wise Global Research" />
          <meta property="og:description" content="Read the privacy policy of Wise Global Research Services. Learn how we protect your data and privacy as a SEBI registered research analyst." />
          <meta property="og:url" content="https://wiseglobalresearch.com/privacy" />
          <meta property="og:image" content="https://wiseglobalresearch.com/og-image.jpg" />
          <meta name="twitter:title" content="Privacy Policy | Wise Global Research" />
          <meta name="twitter:description" content="Read the privacy policy of Wise Global Research Services. Learn how we protect your data and privacy as a SEBI registered research analyst." />
          <meta name="twitter:image" content="https://wiseglobalresearch.com/og-image.jpg" />
        </Helmet>

        <motion.section
          className="relative py-8 sm:py-10 lg:py-14 px-4 sm:px-6"
          initial="hidden"
          animate="visible"
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.3 } } }}
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
                <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-indigo-700">
                  <FaShieldAlt className="inline mr-2" />
                  <Trans i18nKey="pages.Privacy.privacy-policy">Privacy Policy</Trans>
                </h1>

                <div className="space-y-5 text-sm sm:text-base leading-relaxed">
                  <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1, duration: 0.5 }}>
                    <Trans i18nKey="pages.Privacy.wise-global-research-services-pvt-ltd-wo"><Trans i18nKey="pages.Privacy.wise-global-research-services-pvt-ltd-wo-1">Wise Global Research Services Pvt Ltd. would like to thank you for visiting our website. Respecting the privacy and choices of our online customers and visitors is important for us. We hope that the information provided below will address any questions or concerns you may have about privacy issues.</Trans></Trans>
                  </motion.p>

                  <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2, duration: 0.5 }}>
                    From time to time, we may request your valuable feedback for the evaluation of the services that Wise Global Research Services Pvt Ltd. provides and changes if you prefer any. We might invite you to actively participate in polls or surveys that may be posted on our website or mailed to you directly. Participation in survey or polls is completely voluntary.
                  </motion.p>

                  <h2 className="text-lg font-semibold">Website Visits</h2>
                  <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3, duration: 0.5 }}>
                    <Trans i18nKey="pages.Privacy.generally-you-may-visit">Generally, you may visit </Trans>
                    <a href="https://wiseglobalresearch.com/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline"> <Trans i18nKey="pages.Privacy.https-wiseglobalresearch-com"> https://wiseglobalresearch.com/ </Trans></a>
                    <Trans i18nKey="pages.Privacy.anonymously-and-obtain-information-about"><Trans i18nKey="pages.Privacy.anonymously-and-obtain-information-about-1">anonymously and obtain information about our organization and products and services without providing any personal information, such as your phone number or postal or e-mail address.</Trans></Trans>
                  </motion.p>

                  <h2 className="text-lg font-semibold">Personal Information</h2>
                  <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4, duration: 0.5 }}>
                    <Trans i18nKey="pages.Privacy.in-few-sections-of-our-website-we-ask-yo"><Trans i18nKey="pages.Privacy.in-few-sections-of-our-website-we-ask-yo-1">In few sections of our Website, we ask you to provide information that will enable us to enhance your site visit or to follow up with you after your visit. It is completely optional for you to participate. For example, we request information from you when you:</Trans></Trans>
                  </motion.p>
                  <ul className="list-disc pl-5 mt-2">
                    <li><Trans i18nKey="pages.Privacy.register-with">Register with </Trans><a href="https://wiseglobalresearch.com/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline"> <Trans i18nKey="pages.Privacy.https-wiseglobalresearch-com"> https://wiseglobalresearch.com/ </Trans></a></li>
                    <li><Trans i18nKey="pages.Privacy.transact-on-the-site">Transact on the Site</Trans></li>
                  </ul>

                  <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5, duration: 0.5 }}>
                    <Trans i18nKey="pages.Privacy.in-each-of-the-above-instances-we-may-as"><Trans i18nKey="pages.Privacy.in-each-of-the-above-instances-we-may-as-1">In each of the above instances, we may ask for your name, e-mail address, telephone number, address and other personal information that is needed to register or subscribe you to services or offers.</Trans></Trans>
                  </motion.p>

                  <h2 className="text-lg font-semibold">Use of Personal Information</h2>
                  <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6, duration: 0.5 }}>
                    <Trans i18nKey="pages.Privacy.the-personal-information-you-provide-wil"><Trans i18nKey="pages.Privacy.the-personal-information-you-provide-wil-1">The personal information you provide will be kept confidential and used to support our customer relationship with you. We may use the information you provide to inform you of special offers, upgrades and other services that may be of interest to you.</Trans></Trans>
                  </motion.p>

                  <h2 className="text-lg font-semibold">Changes to this Policy</h2>
                  <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7, duration: 0.5 }}>
                    <Trans i18nKey="pages.Privacy.we-may-from-time-to-time-update-this-pol"><Trans i18nKey="pages.Privacy.we-may-from-time-to-time-update-this-pol-1">We may from time to time update this Policy. When we do so, we will post notice of any revisions on this site. We encourage you to review our Privacy Policy whenever you visit our Web Site</Trans></Trans>
                    <a href="https://wiseglobalresearch.com/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline"> <Trans i18nKey="pages.Privacy.https-wiseglobalresearch-com-1"><Trans i18nKey="pages.Privacy.https-wiseglobalresearch-com-2"> https://wiseglobalresearch.com/ </Trans></Trans></a>
                  </motion.p>

                  <div className="mt-6 text-center">
                    <h3 className="text-lg font-semibold mb-2"><Trans i18nKey="pages.Privacy.contact-us">Contact Us</Trans></h3>
                    <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8, duration: 0.5 }} className="mb-2"><Trans i18nKey="pages.Privacy.if-you-have-any-questions-about-this-pri"><Trans i18nKey="pages.Privacy.if-you-have-any-questions-about-this-pri-1">If you have any questions about this Privacy Policy, please contact us:</Trans></Trans></motion.p>
                    <div className="flex items-center justify-center">
                      <FaEnvelope className="mr-2" />
                      <a href="mailto:support@wiseglobalresearch.com" className="hover:underline"><Trans i18nKey="pages.Privacy.support-wiseglobalresearch-com"><Trans i18nKey="pages.Privacy.support-wiseglobalresearch-com-1"> support@wiseglobalresearch.com </Trans></Trans></a>
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

export default Privacy;
