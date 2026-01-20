// src/pages/Terms.js
import React from 'react';
// Removed themeFallbacks import — use explicit colors in this component
import { Trans } from '../i18nShim';
import { motion } from 'framer-motion';
import { FaCheckCircle } from 'react-icons/fa';
import { Helmet } from 'react-helmet-async';

import analytics from '../lib/analytics';

// Animation variants used across pillar pages
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.2 },
  },
};

function Terms() {

  React.useEffect(() => {
    try {
      analytics.sendPageView(window.location.pathname, document.title);
      analytics.sendEvent('viewed_pillar_page', {
        page_title: document.title,
        page_path: window.location.pathname,
      });
    } catch (e) {
      // best-effort analytics
    }
  }, []);
  return (
    <>
      <Helmet>
        <title>Terms - Wise Global Research</title>
        <meta name="description" content="Terms page — Wise Global Research." />
        <link rel="canonical" href="https://wiseglobalresearch.com/terms" />
      </Helmet>
      <motion.section
        className="relative py-8 sm:py-10 lg:py-14 px-4 sm:px-6"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        style={{ background: '#ffffff', transition: 'background 0.5s' }}
      >
        <div className="container max-w-4xl mx-auto relative z-10">
          <motion.div
            className="mb-6 rounded-2xl p-6 shadow-2xl"
            style={{
              background: '#fff',
              border: '2px solid #6366f1',
              boxShadow: '0 8px 32px 0 rgba(60,60,120,0.18), 0 1.5px 8px 0 rgba(99,102,241,0.10)'
            }}
            variants={staggerContainer}
          >
            <div style={{ color: '#000000' }}>
              <motion.h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-6 text-center" style={{ color: '#6366f1' }} variants={fadeIn}>
                <Trans i18nKey="pages.Terms.terms-conditions">Terms & Conditions</Trans>
              </motion.h1>
              <motion.div className="space-y-5 text-sm sm:text-base leading-relaxed max-w-3xl mx-auto" variants={staggerContainer} style={{ color: '#000000' }}>
        <section className="mb-8">
            <motion.p
            className="mb-2"
            style={{ color: '#000000' }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            Dear Client, Welcome to Wise Global Research Services Pvt Ltd. By accessing this website and any of its pages, you are agreeing to these Terms and Conditions. You also agree that Wise Global Research Services Pvt Ltd. can modify or alter the Terms and Conditions of the use of this service without any liability and prior notice.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className=""
            style={{ color: '#000000' }}
          >
            <FaCheckCircle className="inline text-green-500 mr-1" /><Trans i18nKey="pages.Terms.please-go-through-the-terms-conditions"><Trans i18nKey="pages.Terms.please-go-through-the-terms-conditions-1">Please go through the terms & conditions.</Trans></Trans></motion.p>
        </section>

        <section className="mb-8">
          <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3, duration: 0.5 }} className="" style={{ color: '#000000' }}>
            Wise Global Research Services Pvt Ltd. always provides recommendations with proper stop loss. It is mandatory for clients to maintain stop loss in each and every trading recommendation of us. Wise Global Research Services Pvt Ltd. will not be liable in cases where client fails to maintain the given stop loss.
          </motion.p>
        </section>

        <section className="mb-8">
          <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4, duration: 0.5 }} className="" style={{ color: '#000000' }}>
            All the services/trading recommendations are shared via your registered contact channel. Telephonic support, where applicable as per service, is provided to address any clarification on the recommendations shared.
          </motion.p>
        </section>

        <section className="mb-8">
          <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5, duration: 0.5 }} className="" style={{ color: '#000000' }}>
            Wise Global Research Services Pvt Ltd. will not be held responsible for any kind of delay in delivery of communications due to third-party technical failures. Please read this term carefully in the Disclaimer.
          </motion.p>
        </section>

        <section className="mb-8">
          <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6, duration: 0.5 }} className="" style={{ color: '#000000' }}><Trans i18nKey="pages.Terms.client-needs-to-trade-on-each-every-reco"><Trans i18nKey="pages.Terms.client-needs-to-trade-on-each-every-reco-1">Client needs to trade on each & every recommendation/trading calls provided by us for better result.</Trans></Trans></motion.p>
        </section>

        <section className="mb-8">
          <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7, duration: 0.5 }} className="" style={{ color: '#000000' }}><Trans i18nKey="pages.Terms.if-you-are-encountering-any-issue-immedi"><Trans i18nKey="pages.Terms.if-you-are-encountering-any-issue-immedi-1">If you are encountering any issue immediately contact us at support@wiseglobalresearch.com</Trans></Trans></motion.p>
        </section>

        <section className="mb-8">
          <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8, duration: 0.5 }} className="" style={{ color: '#000000' }}><Trans i18nKey="pages.Terms.in-order-to-enjoy-full-benefits-of-servi"><Trans i18nKey="pages.Terms.in-order-to-enjoy-full-benefits-of-servi-1">In order to enjoy full benefits of services client needs to complete his package.</Trans></Trans></motion.p>
        </section>

        <section className="mb-8">
          <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.9, duration: 0.5 }} className="" style={{ color: '#000000' }}><Trans i18nKey="pages.Terms.service-will-start-post-completion-of-ky"><Trans i18nKey="pages.Terms.service-will-start-post-completion-of-ky-1">Service will start post completion of KYC as per norms. Service tenure will be applicable as per the package.</Trans></Trans></motion.p>
        </section>

        <section className="mb-8">
          <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.0, duration: 0.5 }} className="" style={{ color: '#000000' }}><Trans i18nKey="pages.Terms.investment-in-nse-bse-mcx-stock-market-i"><Trans i18nKey="pages.Terms.investment-in-nse-bse-mcx-stock-market-i-1">Investment in NSE/BSE/MCX/Stock Market is subject to market risk. Clients need to follow all the given technical levels & instructions in a strict manner.</Trans></Trans></motion.p>
        </section>

        <section className="mb-8">
          <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.1, duration: 0.5 }} className="" style={{ color: '#000000' }}><Trans i18nKey="pages.Terms.we-do-not-offer-any-type-of-guaranteed-s"><Trans i18nKey="pages.Terms.we-do-not-offer-any-type-of-guaranteed-s-1">We do not offer any type of guaranteed service, surety and fixed profit commitment plan. We do not have services related to any type of profit sharing or portfolio management services.</Trans></Trans></motion.p>
        </section>

        <section className="mb-8">
          <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.2, duration: 0.5 }} className="" style={{ color: '#000000' }}>
            We suggest you not to work on personal recommendations given by associates of the company. You have paid the service charges in the company to receive the recommendations via official communication channels.
          </motion.p>
        </section>

        <section className="mb-8">
          <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.3, duration: 0.5 }} className="" style={{ color: '#000000' }}><Trans i18nKey="pages.Terms.you-are-not-supposed-to-give-your-de-mat"><Trans i18nKey="pages.Terms.you-are-not-supposed-to-give-your-de-mat-1">You are not supposed to give your De-mat login id, password to any of our employees. Neither company nor any of the employees are responsible for your losses, it will be at your own risk.</Trans></Trans></motion.p>
        </section>

        <section className="mb-8">
          <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.4, duration: 0.5 }} className="" style={{ color: '#000000' }}><Trans i18nKey="pages.Terms.wise-global-research-services-pvt-ltd-ta"><Trans i18nKey="pages.Terms.wise-global-research-services-pvt-ltd-ta-1">Wise Global Research Services Pvt Ltd. takes all the necessary measures related to risk and rewards involved in markets before delivering any advice to client but we do not take the responsibility of any kind of losses occurred on trades.</Trans></Trans></motion.p>
        </section>

        <section className="mb-8">
          <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.5, duration: 0.5 }} className="" style={{ color: '#000000' }}>
            <strong>Payment of Fee:</strong> Subscription Fee is paid in advance followed by KYC process. It is assumed that client has made payment with his free consent. Profit and loss which is the result of the trading and investment will be totally borne by the client. Subscription fees once paid is Non-Refundable. However, if a client is having any kind of issue, they may raise their complaints regarding refund which may be considered as per the terms & condition of Wise Global Research Services Pvt Ltd. Exceptional cases exclude Profit & Loss incurred on recommendations rendered, Availability of client for placing trades or other market associated reasons affecting capital & same in nature.
          </motion.p>
        </section>

        <section className="mb-8">
          <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.6, duration: 0.5 }} className="" style={{ color: '#000000' }}><Trans i18nKey="pages.Terms.kind-attention-for-all-traders-investors"><Trans i18nKey="pages.Terms.kind-attention-for-all-traders-investors-1">Kind Attention for all traders/investors: Wise Global Research Services Pvt Ltd. will render services only after receiving all credentials i.e., KYC for acknowledgement of mutual well-being.</Trans></Trans></motion.p>
        </section>

        <section className="mb-8">
          <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.7, duration: 0.5 }} className="" style={{ color: '#000000' }}>
            We take the security of our client transactions very seriously. For this reason, we ask that you NOT allow children or other unauthorized family members or friends to access your credit cards, debit cards or your account at the payment site to ensure that no one pays for services without your permission.
          </motion.p>
        </section>

        <section className="mb-8">
          <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.8, duration: 0.5 }} className="" style={{ color: '#000000' }}><Trans i18nKey="pages.Terms.by-making-a-payment-for-services-on-our-"><Trans i18nKey="pages.Terms.by-making-a-payment-for-services-on-our--1">By making a payment for Services on our site, you acknowledge that you have read and agreed to the above our Terms and Conditions along with Refund Policy.</Trans></Trans></motion.p>
        </section>

        <section className="mb-8">
          <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.9, duration: 0.5 }} className="" style={{ color: '#000000' }}>
            We as a merchant shall be under no liability whatsoever in respect of any loss or damage arising directly or indirectly out of the decline of authorization for any Transaction, on Account of the Cardholder having exceeded the preset limit mutually agreed by us with our acquiring bank from time to time.
          </motion.p>
        </section>

        <section className="mb-8">
          <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 2.0, duration: 0.5 }} className="" style={{ color: '#000000' }}><Trans i18nKey="pages.Terms.wise-global-research-services-pvt-ltd-do"><Trans i18nKey="pages.Terms.wise-global-research-services-pvt-ltd-do-1">Wise Global Research Services Pvt Ltd. does not suggest taking loan for investment purpose, as the investment in Equity/Derivative/Commodity market is risky by nature.</Trans></Trans></motion.p>
        </section>

        <section className="mb-8">
          <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 2.1, duration: 0.5 }} className="" style={{ color: '#000000' }}>
            It is hereby voluntarily agreed between the parties hereto that any dispute or difference arising between the parties to this deed with regard to execution, meaning, working or interpretation of this deed including monetary claims etc. shall be subject to the exclusive jurisdiction of the Courts at Indore, Madhya Pradesh (India) and except courts at Indore, no other court in India shall have jurisdiction in this regard.
          </motion.p>
        </section>

        <section className="mb-8">
          <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 2.2, duration: 0.5 }} className="" style={{ color: '#000000' }}><Trans i18nKey="pages.Terms.wise-global-research-services-pvt-ltd-sh"><Trans i18nKey="pages.Terms.wise-global-research-services-pvt-ltd-sh-1">Wise Global Research Services Pvt Ltd. shall not be liable for any misrepresentation, falsification, and deception or for any lack of availability of services through the website, even if the same are advertised for on the website.</Trans></Trans></motion.p>
        </section>

        <section className="mb-8">
          <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 2.3, duration: 0.5 }} className="" style={{ color: '#000000' }}>
            No judgment or warranty or representation is made with respect to the accuracy, timeliness, or suitability of the content of other services or sites to which these screens link, and Wise Global Research Services Pvt Ltd. shall not be responsible therefore Wise Global Research Services Pvt Ltd. shall not be liable if the customer downloads any information from this website.
          </motion.p>
        </section>

        <section className="mb-8">
          <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 2.4, duration: 0.5 }} className="" style={{ color: '#000000' }}><Trans i18nKey="pages.Terms.further-wise-global-research-services-pv"><Trans i18nKey="pages.Terms.further-wise-global-research-services-pv-1">Further, Wise Global Research Services Pvt Ltd. shall not be liable if the customer makes a copy, modifies, uploads, downloads, other notices or legends contained in any such information or otherwise distributes any service or content from this website.</Trans></Trans></motion.p>
        </section>

        <section className="mb-8">
          <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 2.5, duration: 0.5 }} className="" style={{ color: '#000000' }}>
            Wise Global Research Services Pvt Ltd. reserves the right at any time and from time to time to modify or discontinue, temporarily or permanently, the service (or any part thereof) with or without notice at any time. You agree that Wise Global Research Services Pvt Ltd. shall not be liable to you or to any third party for any modification, suspension or discontinuance of the service.
          </motion.p>
        </section>

        <section className="mb-8">
          <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 2.6, duration: 0.5 }} className="" style={{ color: '#000000' }}><Trans i18nKey="pages.Terms.registration-in-order-to-use-wise-global"><Trans i18nKey="pages.Terms.registration-in-order-to-use-wise-global-1">Registration: In order to use Wise Global Research Services Pvt Ltd., you must provide certain personal information as per regulations.</Trans></Trans></motion.p>
        </section>

        <section className="mb-8">
          <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 2.7, duration: 0.5 }} className="" style={{ color: '#000000' }}>
            <Trans i18nKey="pages.Terms.for-all-terms-conditions-please-refer-ou">
              <Trans i18nKey="pages.Terms.for-all-terms-conditions-please-refer-ou-1">For all Terms & Conditions please refer our Webpage</Trans>
            </Trans>
            <a href="https://wiseglobalresearch.com" className="text-blue-600 hover:underline" style={{ color: '#000000' }}>
              <Trans i18nKey="pages.Terms.https-wiseglobalresearch-com"> https://wiseglobalresearch.com </Trans>
            </a>
          </motion.p>
        </section>

        <section className="mb-8">
          <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 2.8, duration: 0.5 }} className="" style={{ color: '#000000' }}><Trans i18nKey="pages.Terms.any-surfing-and-reading-of-the-informati"><Trans i18nKey="pages.Terms.any-surfing-and-reading-of-the-informati-1">Any surfing and reading of the information are the acceptance of this Terms & Condition. All Rights Reserved with Wise Global Research Services Pvt Ltd.</Trans></Trans></motion.p>
        </section>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.section>
    </>
  );
}

export default Terms;
