import React from 'react';
import { Trans, useTranslation } from '../i18nShim';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

function Disclosure() {
  const { t } = useTranslation();
  return (
    <>
      <Helmet>
        <title>{t('pages.Disclosure.disclosure-wise-global-research', 'Disclosure | Wise Global Research')}</title>
        <meta name="description" content="Read the disclosure and important information for Wise Global Research Services Pvt. Ltd." />
        <meta property="og:title" content="Disclosure | Wise Global Research" />
        <meta property="og:description" content="Read the disclosure and important information for Wise Global Research Services Pvt. Ltd." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://wiseglobalresearch.com/disclosure" />
        <meta name="twitter:title" content="Disclosure | Wise Global Research" />
        <meta name="twitter:description" content="Read the disclosure and important information for Wise Global Research Services Pvt. Ltd." />
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
              <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-indigo-700"><Trans i18nKey="pages.Disclosure.disclosure">Disclosure</Trans></h1>
              <div className="space-y-5 text-sm sm:text-base leading-relaxed">
            <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1, duration: 0.5 }}><Trans i18nKey="pages.Disclosure.the-purpose-of-the-document-is-to-provid"><Trans i18nKey="pages.Disclosure.the-purpose-of-the-document-is-to-provid-1">The purpose of the Document is to provide essential information about the Research and recommendation Services in a manner to assist and enable the prospective client/client in making an informed decision for engaging in Research and recommendation services before investing.</Trans></Trans></motion.p>
            <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2, duration: 0.5 }}>
              <strong><Trans i18nKey="pages.Disclosure.descriptions-about-wise-global-research-"><Trans i18nKey="pages.Disclosure.descriptions-about-wise-global-research--1">Descriptions about “Wise Global Research Services Pvt Ltd.”</Trans></Trans></strong><br /><Trans i18nKey="pages.Disclosure.wise-global-research-services-pvt-ltd-ai"><Trans i18nKey="pages.Disclosure.wise-global-research-services-pvt-ltd-ai-1">Wise Global Research Services Pvt Ltd. aims to provide research and recommendations services to the clients. Analyst aligns its interests with those of the client and seeks to provide the best-suited services.</Trans></Trans>
            </motion.p>
            <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3, duration: 0.5 }}>
              <strong><Trans i18nKey="pages.Disclosure.terms-and-conditions-of-research-and-rec"><Trans i18nKey="pages.Disclosure.terms-and-conditions-of-research-and-rec-1">Terms and conditions of Research and Recommendation Services.</Trans></Trans></strong><br />
              Recommendations are shared via official, registered communication channels. Please act only on recommendations shared through official channels. Telephonic support, where applicable, is provided to clarify recommendations; no separate recommendations are provided over phone calls.
            </motion.p>
            <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4, duration: 0.5 }}>
              The information or advice or consultation provided on the site or by us is purely an area of research, which is susceptible to the constant changes in the market. No such information or recommendations or consultation can be held against us and the same is nothing more than our professional service based on our technical expertise, which may vary from other experts. The subscriber or user voluntarily agrees to take into consideration our inputs while making investments. Wise Global Research Services Pvt Ltd. shall not be responsible or liable for any loss.
            </motion.p>
            <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5, duration: 0.5 }}>
              We at Wise Global Research Services Pvt Ltd. hold all rights to terminate or modify the subscription of any subscribers from our services at any time.Wise Global Research Services Pvt Ltd. will have the exclusive right to change or modify our policies, disclosures, and information provided on our platform without any notice. All visitors and subscribers to our site shall deem to have accepted the same.
            </motion.p>
            <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6, duration: 0.5 }}>
              Wise Global Research Services Pvt Ltd. does not provide any guarantees in the stock market/share market. Every individual will be responsible for his or her own fund/buying/selling. We at Wise Global Research Services Pvt Ltd. will have no legal responsibility or liability towards any loss of health, wealth, or damages.
            </motion.p>
            <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7, duration: 0.5 }}>
              Recommendations given to you are based on Wise Global Research Services Pvt Ltd. judgments and the information available at a particular point in time. However, Wise Global Research Services Pvt Ltd. or its employees are not responsible for the losses or gains made through the recommendations. Clients are advised to exercise our recommendations at their own risk. Wise Global Research Services Pvt Ltd. shall not be responsible for the failure of connectivity of network and internet for any reason. Stock market investments and trading are subject to market risk, in case of any full or partial capital loss, Wise Global Research Services Pvt Ltd. or any of its employees are not responsible and not liable for any compensation.
            </motion.p>
            <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8, duration: 0.5 }}><Trans i18nKey="pages.Disclosure.user-visitor-or-subscriber-agrees-by-mak"><Trans i18nKey="pages.Disclosure.user-visitor-or-subscriber-agrees-by-mak-1">User, visitor, or subscriber agrees by making a fee payment that he has read and agreed to our terms & conditions and various disclosures.</Trans></Trans></motion.p>
            <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.9, duration: 0.5 }}>
              <strong><Trans i18nKey="pages.Disclosure.disclosures-with-respect-to-research-and"><Trans i18nKey="pages.Disclosure.disclosures-with-respect-to-research-and-1">Disclosures with respect to Research and Recommendations Services</Trans></Trans></strong><br /><Trans i18nKey="pages.Disclosure.wise-global-research-services-pvt-ltd-ma"><Trans i18nKey="pages.Disclosure.wise-global-research-services-pvt-ltd-ma-1">Wise Global Research Services Pvt Ltd. may have a financial interest or actual/beneficial ownership in the securities recommended in its personal portfolio. Details of the same may be referred to through the disclosures made at the time of advice.</Trans></Trans>
            </motion.p>
            <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.0, duration: 0.5 }}>
              There are no actual or potential conflicts of interest arising from any connection to or association with any issuer of products/ securities, including any material information or facts that might compromise its objectivity or independence in the carrying on of Research Analyst services. Such conflict of interest shall be disclosed to the client as and when they arise.
            </motion.p>
            <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.1, duration: 0.5 }}><Trans i18nKey="pages.Disclosure.wise-global-research-services-pvt-ltd-or"><Trans i18nKey="pages.Disclosure.wise-global-research-services-pvt-ltd-or-5">Wise Global Research Services Pvt Ltd. or its employee or its associates have not received any compensation from the subject company in the past 12 months.</Trans></Trans></motion.p>
            <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.2, duration: 0.5 }}>
              Wise Global Research Services Pvt Ltd. or its employee or its associates have received any compensation for investment banking or merchant banking or brokerage services from the subject company in the past 12 months. Wise Global Research Services Pvt Ltd. or its employee or its associates have not received any compensation for products or services other than above from the subject company in the past 12 months.
            </motion.p>
            <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.3, duration: 0.5 }}><Trans i18nKey="pages.Disclosure.wise-global-research-services-pvt-ltd-or-1"><Trans i18nKey="pages.Disclosure.wise-global-research-services-pvt-ltd-or-4">Wise Global Research Services Pvt Ltd. or its employee or its associates have not received any compensation or other benefits from the Subject Company or 3rd party in connection with the research report/ recommendation.</Trans></Trans></motion.p>
            <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.4, duration: 0.5 }}><Trans i18nKey="pages.Disclosure.the-subject-company-was-not-a-client-of-"><Trans i18nKey="pages.Disclosure.the-subject-company-was-not-a-client-of--1">The subject company was not a client of Wise Global Research Services Pvt Ltd. t or its employee or its associates during twelve months preceding the date of distribution of the research report and recommendation services provided.</Trans></Trans></motion.p>
            <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.5, duration: 0.5 }}><Trans i18nKey="pages.Disclosure.wise-global-research-services-pvt-ltd-or-2"><Trans i18nKey="pages.Disclosure.wise-global-research-services-pvt-ltd-or-3">Wise Global Research Services Pvt Ltd. or its employee or its associates has not served as an officer, director, or employee of the subject company.</Trans></Trans></motion.p>
            <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.6, duration: 0.5 }}><Trans i18nKey="pages.Disclosure.wise-global-research-services-pvt-ltd-ha"><Trans i18nKey="pages.Disclosure.wise-global-research-services-pvt-ltd-ha-1">Wise Global Research Services Pvt Ltd. have not been engaged in the market-making activity of the subject company</Trans></Trans></motion.p>
          </div>
        </div>
      </motion.div>
        </div>
      </motion.section>
    </>
  );
}

export default Disclosure;
