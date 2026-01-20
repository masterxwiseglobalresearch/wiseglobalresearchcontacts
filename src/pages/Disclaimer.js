import React from 'react';
import { Trans, useTranslation } from '../i18nShim';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import analytics from '../lib/analytics';


const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

function Disclaimer() {
  const { t } = useTranslation();

  React.useEffect(() => {
    try {
      // explicit page_view for GA4/GTM and a custom "viewed_pillar_page" event
      analytics.sendPageView(window.location.pathname, document.title);
      analytics.sendEvent('viewed_pillar_page', {
        page_title: document.title,
        page_path: window.location.pathname,
      });
    } catch (e) {
      // fail silently - analytics should be best-effort
      // console.debug('analytics init error', e);
    }
  }, []);

  return (
    <>
      <Helmet>
        <title>{t('pages.Disclaimer.disclaimer-wise-global-research', 'Disclaimer | Wise Global Research')}</title>
        <meta name="description" content="Read the disclaimer and important information for Wise Global Research Services Pvt. Ltd." />
        <meta property="og:title" content="Disclaimer | Wise Global Research" />
        <meta property="og:description" content="Read the disclaimer and important information for Wise Global Research Services Pvt. Ltd." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://wiseglobalresearch.com/disclaimer" />
        <meta name="twitter:title" content="Disclaimer | Wise Global Research" />
        <meta name="twitter:description" content="Read the disclaimer and important information for Wise Global Research Services Pvt. Ltd." />
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
              <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-indigo-700"><Trans i18nKey="pages.Disclaimer.disclaimer">Disclaimer</Trans></h1>
              <div className="space-y-5 text-sm sm:text-base leading-relaxed">
                <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1, duration: 0.5 }}>
                  Wise Global Research Services Pvt Ltd. recommendations are believed to be reliable, but we do not represent or warrant the accuracy, completeness, or reliability of the information contained in our Research Information. Investors and clients are advised to independently evaluate the market conditions/ risks involved, before making any trading/investment decisions. The Research Information is not intended to be an exhaustive statement on the financial instruments, issuers, markets, or developments referred to therein. Reasonable care has been taken to ensure that the Research Information is not misleading or untrue at the time of publication. Any opinions expressed in the Research Information are subject to change without notice. The analysis contained in the Research Information is based on numerous assumptions. Different assumptions could result in materially different results. Information in the specific research reports is for the private use of the person to whom it has been provided without any liability whatsoever on the part of the company, its partners, employees, and associated entities. The research material published on this website does not constitute an offer or solicitation to buy or sell any securities referred to therein. It should not be so construed, nor should it or any part of it form the basis of, or be relied on in connection with, any contract or commitment whatsoever.
                </motion.p>
            <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2, duration: 0.5 }}>
              The information and views on this website Wise Global Research & all the services and reports that we provide are believed to be reliable, but we do not accept any responsibility (or liability) for errors of fact or opinion. Users have the right to choose the product/s that suit them/ their profile.
            </motion.p>
            <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3, duration: 0.5 }}>
              Investment/Trading in Securities markets has its own risks. Sincere efforts have been made to present the right investment perspective. The information contained here in is based on analysis and on sources that we consider reliable. We, however, do not vouch for the accuracy or the completeness there of. This material is for personal information and we are not responsible for any loss incurred due to it & take no responsibility whatsoever for any financial profits or loss which may arise from the recommendations above.
            </motion.p>
            <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4, duration: 0.5 }}>
              Registration granted by SEBI and certification from NISM in no way guarantee performance of the intermediary or provide any assurance of returns to investors.
            </motion.p>
            <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5, duration: 0.5 }}>
              You agree and understand that the information and material contained on this website imply and constitute your consent to the terms and conditions. You also agree that Wise Global Research Services Pvt Ltd. can modify or alter the terms and conditions of the use of this service without any liability.
            </motion.p>
            <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6, duration: 0.5 }}>
              The content of the site and the interpretation of data are solely the personal views of the contributors. Wise Global Research Services Pvt Ltd. reserves the right to make modifications and alterations to the content of the website. Users are advised to use the data for the purpose of information only and rely on their own judgment while making investment decisions. The investments discussed or recommended may not be suitable for all investors. Wise Global Research Services Pvt Ltd. The analyst does not warranty the timeliness, accuracy, or quality of the electronic content.
            </motion.p>
            <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7, duration: 0.5 }}>
              Our clients (Paid or Unpaid), any third party, or anyone else has no right to forward or share our calls, reports, or any information provided by us to/with anyone which is received directly or indirectly by them. If found so then serious legal actions can be taken. By accessing Wise Global Research Services Pvt Ltd. you have read, understood, and agree to be legally bound by the terms of the following disclaimer and user agreement:
            </motion.p>
            <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8, duration: 0.5 }}>
              Wise Global Research Services Pvt Ltd. is not responsible for any errors, omissions, representations, or links on any of our pages. Wise Global Research Services Pvt Ltd. does not endorse any advertisers on our web pages. Please verify the veracity of all information on your own before undertaking any alliance. This website contains articles contributed by several individuals. The views are exclusively their own and do not necessarily represent the views of the website or its management. The linked sites are not under our control and we are not responsible for the contents of any linked site or any link contained in a linked site, or any changes or updates to such sites. Wise Global Research Services Pvt Ltd. analysis provides these links to you only as a convenience, and the inclusion of any link does not imply endorsement by us of the site.
            </motion.p>
            <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.9, duration: 0.5 }}>
              The information on this website is updated from time to time. https://wiseglobalresearch.com/ however excludes any warranties (whether expressed or implied), as to the quality, accuracy, efficacy, completeness, performance, fitness, or any of the contents of the website, including (but not limited to) any comments, feedback, and advertisements contained within the Site.
            </motion.p>
            <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.0, duration: 0.5 }}>
              There are risks associated with utilizing internet and electronic communications-based information and research dissemination services. Subscriber are advised to understand that services can fail due to the failure of hardware, software, networks, or connectivity. While we try our best to deliver communications in time, the final delivery to customer devices is dependent on third-party providers and may be delayed or not delivered on certain days due to technical reasons. Wise Global Research Services Pvt Ltd. cannot be held responsible for the same.
            </motion.p>
            <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.1, duration: 0.5 }}>
              Wise Global Research Services Pvt Ltd. hereby expressly disclaims any implied warranties imputed by the laws of any jurisdiction. We consider ourselves and intend to be subject to the jurisdiction only of the court of Indore in India. If you don’t agree with any of our disclaimers above please do not read the material on any of our pages. This site is specifically for users in the territory of India. Although access to users outside India is not denied, https://wiseglobalresearch.com shall have no legal liabilities whatsoever in any laws of any jurisdiction other than India. We reserve the right to make changes to our site and these disclaimers, terms, and conditions at any time.
            </motion.p>
            <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.2, duration: 0.5 }}>
              All information is for educational and informational use only. You are solely responsible for making your own investment decisions.
            </motion.p>
            <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.3, duration: 0.5 }}>
              Wise Global Research Services Pvt Ltd. , its management, its associate companies, and/or their employees take no responsibility for the veracity, validity, and correctness of the expert recommendations or other information or research. Although we attempt to research thoroughly on information provided herein, there are no guarantees in accuracy. The information presented on the site has been gathered from various sources believed to be providing correct information. Wise Global Research Services Pvt Ltd., groups, companies, associates, and/or employees are not responsible for errors, or inaccuracies if any in the content provided on the site. Any prediction made on the direction of the stock/commodity market or on the direction of individual stocks/commodities may prove to be incorrect. Users/visitors are expected to refer to other investment resources to verify the accuracy of the data posted on this site on their own.
            </motion.p>
            <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.4, duration: 0.5 }}>
              Wise Global Research Services Pvt Ltd. and its owners/affiliates are not liable for damages caused by any performance, failure of performance, error, omission, interruption, deletion, defect, delay in transmission or operations, computer virus, communications line failure, and unauthorized access to personal accounts. Wise Global Research Services Pvt Ltd. is not responsible for any technical failure or malfunctioning of the software or delays of any kind. The share price projections shown are not necessarily indicative of future price performance. The information herein, together with all estimates and forecasts, can change without notice. Analyst or any person related to Wise Global Research Services Pvt Ltd. might be holding positions in the securities recommended.
            </motion.p>
            <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.5, duration: 0.5 }}>
              “We as a merchant shall be under no liability whatsoever in respect of any loss or damage arising directly or indirectly out of the decline of authorization for any Transaction, on Account of the Cardholder having exceeded the preset limit mutually agreed by us with our acquiring bank from time to time”. All disputes will be subject, first to mediation, and then by arbitration by a sole arbitrator by Wise Global Research Services Pvt Ltd. in accordance with Indian Law, Indian Arbitration and Conciliation Act, 1996, for the time being in force. The venue of arbitration or/and other further courts, legal and other proceedings will be in the jurisdiction of Indore, Indore courts.”
            </motion.p>
          </div>
        </div>
      </motion.div>
      </div>
    </motion.section>
    </>
  );
}

export default Disclaimer;
