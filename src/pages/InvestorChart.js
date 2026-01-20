import React from 'react';
import { Trans } from '../i18nShim';
import { motion } from 'framer-motion';
import '../styles/headings.css';


import { Helmet } from 'react-helmet-async';
// Animation variants
const containerVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.1, delayChildren: 0.2, duration: 0.7, ease: 'easeOut' }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const InvestorCharter = () => {
  return (
    <>
      <Helmet>
        <title>Investor Chart - Wise Global Research</title>
        <meta name="description" content="Investor Chart page — Wise Global Research." />
        <link rel="canonical" href="https://wiseglobalresearch.com/investorchart" />
      </Helmet>

      <motion.section
        className="relative py-6 sm:py-8 lg:py-12 px-4 sm:px-6"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="container max-w-4xl mx-auto relative z-10">
            <motion.div
              className="mb-6 rounded-2xl p-4 sm:p-6 shadow-2xl"
              style={{
                background: '#fff',
                border: '2px solid #6366f1',
                boxShadow: '0 8px 32px 0 rgba(60,60,120,0.18), 0 1.5px 8px 0 rgba(99,102,241,0.10)'
              }}
            >
              <div className="text-black">
                {/* Header */}
                <motion.div className="text-center mb-6" variants={itemVariants}>
                  <h2 className="text-2xl sm:text-3xl font-extrabold mb-2 text-center text-indigo-700">
                    <Trans i18nKey="pages.InvestorChart.investor-charter">Investor Charter</Trans>
                  </h2>
                  <motion.p variants={itemVariants} className="mt-2 text-xs sm:text-sm md:text-base leading-relaxed text-black/80">
                    <Trans i18nKey="pages.InvestorChart.in-respect-of-research-analysts-ras"><Trans i18nKey="pages.InvestorChart.in-respect-of-research-analysts-ras-1">In Respect of Research Analysts (RAs)</Trans></Trans>
                  </motion.p>
                </motion.div>

                {/* Section A: Vision and Mission */}
                <motion.div className="mb-6" variants={itemVariants}>
                  <div className="bg-white/0 p-6 rounded-xl">
                    <h3 className="text-lg font-semibold mb-3"><Trans i18nKey="pages.InvestorChart.a-vision-and-mission-statements-for-inve"><Trans i18nKey="pages.InvestorChart.a-vision-and-mission-statements-for-inve-1">A. Vision and Mission Statements for Investors</Trans></Trans></h3>
                    <div className="space-y-4 text-sm sm:text-base leading-relaxed">
                      <div>
                        <h4 className="text-base font-medium text-indigo-600"><Trans i18nKey="pages.InvestorChart.vision">Vision</Trans></h4>
                        <motion.p variants={itemVariants}>
                          <Trans i18nKey="pages.InvestorChart.invest-with-knowledge-safety"><Trans i18nKey="pages.InvestorChart.invest-with-knowledge-safety-1">Invest with knowledge & safety.</Trans></Trans>
                        </motion.p>
                      </div>
                      <div>
                        <h4 className="text-base font-medium text-indigo-600"><Trans i18nKey="pages.InvestorChart.mission">Mission</Trans></h4>
                        <motion.p variants={itemVariants}>
                          <Trans i18nKey="pages.InvestorChart.every-investor-should-be-able-to-invest-"><Trans i18nKey="pages.InvestorChart.every-investor-should-be-able-to-invest--1">Every investor should be able to invest in right investment products based on their needs, manage and monitor them to meet their goals, access reports and enjoy financial wellness.</Trans></Trans>
                        </motion.p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Section B: Business Transacted */}
                <motion.div className="mb-6" variants={itemVariants}>
                  <h3 className="text-lg font-semibold mb-3"><Trans i18nKey="pages.InvestorChart.b-details-of-business-transacted-by-the-"><Trans i18nKey="pages.InvestorChart.b-details-of-business-transacted-by-the--1">B. Details of Business Transacted by the Research Analyst with Respect to the Investors</Trans></Trans></h3>
                  <ul className="list-disc pl-5 mt-2 space-y-2">
                    <li><Trans i18nKey="pages.InvestorChart.to-publish-research-report-based-on-the-"><Trans i18nKey="pages.InvestorChart.to-publish-research-report-based-on-the--1">To publish research report based on the research activities of the RA.</Trans></Trans></li>
                    <li><Trans i18nKey="pages.InvestorChart.to-provide-an-independent-unbiased-view-"><Trans i18nKey="pages.InvestorChart.to-provide-an-independent-unbiased-view--1">To provide an independent unbiased view on securities.</Trans></Trans></li>
                    <li><Trans i18nKey="pages.InvestorChart.to-offer-unbiased-recommendation-disclos"><Trans i18nKey="pages.InvestorChart.to-offer-unbiased-recommendation-disclos-1">To offer unbiased recommendation, disclosing the financial interests in recommended securities.</Trans></Trans></li>
                    <li><Trans i18nKey="pages.InvestorChart.to-provide-research-recommendation-based"><Trans i18nKey="pages.InvestorChart.to-provide-research-recommendation-based-1">To provide research recommendation, based on analysis of publicly available information and known observations.</Trans></Trans></li>
                    <li><Trans i18nKey="pages.InvestorChart.to-conduct-audit-annually"><Trans i18nKey="pages.InvestorChart.to-conduct-audit-annually-1">To conduct audit annually.</Trans></Trans></li>
                    <li><Trans i18nKey="pages.InvestorChart.to-ensure-that-all-advertisements-are-in"><Trans i18nKey="pages.InvestorChart.to-ensure-that-all-advertisements-are-in-1">To ensure that all advertisements are in adherence to the provisions of the Advertisement Code for Research Analysts.</Trans></Trans></li>
                    <li><Trans i18nKey="pages.InvestorChart.to-maintain-records-of-interactions-with"><Trans i18nKey="pages.InvestorChart.to-maintain-records-of-interactions-with-1">To maintain records of interactions, with all clients including prospective clients (prior to onboarding), where any conversation related to the research services has taken place.</Trans></Trans></li>
                  </ul>
                </motion.div>

                {/* Section C: Services Provided */}
                <motion.div className="mb-6" variants={itemVariants}>
                  <h3 className="text-lg font-semibold mb-3"><Trans i18nKey="pages.InvestorChart.c-details-of-services-provided-to-invest"><Trans i18nKey="pages.InvestorChart.c-details-of-services-provided-to-invest-1">C. Details of Services Provided to Investors (No Indicative Timelines)</Trans></Trans></h3>
                  <div className="space-y-4 text-sm sm:text-base leading-relaxed">
                    <div>
                      <h4 className="text-base font-medium text-indigo-600"><Trans i18nKey="pages.InvestorChart.onboarding-of-clients">Onboarding of Clients</Trans></h4>
                      <ul className="list-disc pl-5 mt-2">
                        <li><Trans i18nKey="pages.InvestorChart.sharing-of-terms-and-conditions-of-resea"><Trans i18nKey="pages.InvestorChart.sharing-of-terms-and-conditions-of-resea-1">Sharing of terms and conditions of research services.</Trans></Trans></li>
                        <li><Trans i18nKey="pages.InvestorChart.completing-kyc-of-fee-paying-clients"><Trans i18nKey="pages.InvestorChart.completing-kyc-of-fee-paying-clients-1">Completing KYC of fee-paying clients.</Trans></Trans></li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-base font-medium text-indigo-600"><Trans i18nKey="pages.InvestorChart.disclosure-to-clients">Disclosure to Clients</Trans></h4>
                      <ul className="list-disc pl-5 mt-2">
                        <li><Trans i18nKey="pages.InvestorChart.to-disclose-information-that-is-material"><Trans i18nKey="pages.InvestorChart.to-disclose-information-that-is-material-1">To disclose information that is material for the client to make an informed decision, including details of its business activity, disciplinary history, the terms and conditions of research services, details of associates, risks and conflicts of interest, if any.</Trans></Trans></li>
                        <li><Trans i18nKey="pages.InvestorChart.to-disclose-the-extent-of-use-of-artific"><Trans i18nKey="pages.InvestorChart.to-disclose-the-extent-of-use-of-artific-1">To disclose the extent of use of Artificial Intelligence tools in providing research services.</Trans></Trans></li>
                        <li><Trans i18nKey="pages.InvestorChart.to-disclose-while-distributing-a-third-p"><Trans i18nKey="pages.InvestorChart.to-disclose-while-distributing-a-third-p-1">To disclose, while distributing a third-party research report, any material conflict of interest of such third-party research provider or provide web address that directs a recipient to the relevant disclosures.</Trans></Trans></li>
                        <li><Trans i18nKey="pages.InvestorChart.to-disclose-any-conflict-of-interest-of-"><Trans i18nKey="pages.InvestorChart.to-disclose-any-conflict-of-interest-of--1">To disclose any conflict of interest of the activities of providing research services with other activities of the research analyst.</Trans></Trans></li>
                      </ul>
                    </div>
                    <ul className="list-disc pl-5 mt-2 space-y-2">
                      <li><Trans i18nKey="pages.InvestorChart.to-distribute-research-reports-and-recom"><Trans i18nKey="pages.InvestorChart.to-distribute-research-reports-and-recom-1">To distribute research reports and recommendations to the clients without discrimination.</Trans></Trans></li>
                      <li><Trans i18nKey="pages.InvestorChart.to-maintain-confidentiality-w-r-t-public"><Trans i18nKey="pages.InvestorChart.to-maintain-confidentiality-w-r-t-public-1">To maintain confidentiality w.r.t publication of the research report until made available in the public domain.</Trans></Trans></li>
                      <li><Trans i18nKey="pages.InvestorChart.to-respect-data-privacy-rights-of-client"><Trans i18nKey="pages.InvestorChart.to-respect-data-privacy-rights-of-client-1">To respect data privacy rights of clients and take measures to protect unauthorized use of their confidential information.</Trans></Trans></li>
                      <li><Trans i18nKey="pages.InvestorChart.to-disclose-the-timelines-for-the-servic"><Trans i18nKey="pages.InvestorChart.to-disclose-the-timelines-for-the-servic-1">To disclose the timelines for the services provided by the research analyst to clients and ensure adherence to the said timelines.</Trans></Trans></li>
                      <li><Trans i18nKey="pages.InvestorChart.to-provide-clear-guidance-and-adequate-c"><Trans i18nKey="pages.InvestorChart.to-provide-clear-guidance-and-adequate-c-1">To provide clear guidance and adequate caution notice to clients when providing recommendations for dealing in complex and high-risk financial products/services.</Trans></Trans></li>
                      <li><Trans i18nKey="pages.InvestorChart.to-treat-all-clients-with-honesty-and-in"><Trans i18nKey="pages.InvestorChart.to-treat-all-clients-with-honesty-and-in-1">To treat all clients with honesty and integrity.</Trans></Trans></li>
                      <li><Trans i18nKey="pages.InvestorChart.to-ensure-confidentiality-of-information"><Trans i18nKey="pages.InvestorChart.to-ensure-confidentiality-of-information-1">To ensure confidentiality of information shared by clients unless such information is required to be provided in furtherance of discharging legal obligations or a client has provided specific consent to share such information.</Trans></Trans></li>
                    </ul>
                  </div>
                </motion.div>

                {/* Section D: Grievance Redressal Mechanism */}
                <motion.div className="mb-6" variants={itemVariants}>
                  <h3 className="text-lg font-semibold mb-3"><Trans i18nKey="pages.InvestorChart.d-details-of-grievance-redressal-mechani"><Trans i18nKey="pages.InvestorChart.d-details-of-grievance-redressal-mechani-1">D. Details of Grievance Redressal Mechanism and How to Access It</Trans></Trans></h3>
                  <div className="space-y-3 text-sm sm:text-base leading-relaxed">
                    <motion.p variants={itemVariants}>
                      <Trans i18nKey="pages.InvestorChart.1-investor-can-lodge-complaint-grievance"><Trans i18nKey="pages.InvestorChart.1-investor-can-lodge-complaint-grievance-1">1. Investor can lodge complaint/grievance against Research Analyst in the following ways:</Trans></Trans>
                    </motion.p>
                    <div>
                      <h4 className="text-base font-medium text-indigo-600"><Trans i18nKey="pages.InvestorChart.mode-of-filing-the-complaint-with-resear"><Trans i18nKey="pages.InvestorChart.mode-of-filing-the-complaint-with-resear-1">Mode of Filing the Complaint with Research Analyst</Trans></Trans></h4>
                      <motion.p variants={itemVariants}>
                        <Trans i18nKey="pages.InvestorChart.in-case-of-any-grievance-complaint-an-in"><Trans i18nKey="pages.InvestorChart.in-case-of-any-grievance-complaint-an-in-1">In case of any grievance/complaint, an investor may approach the concerned Research Analyst who shall strive to redress the grievance immediately, but not later than 21 days of the receipt of the grievance.</Trans></Trans>
                      </motion.p>
                    </div>
                    <div>
                      <h4 className="text-base font-medium text-indigo-600"><Trans i18nKey="pages.InvestorChart.mode-of-filing-the-complaint-on-scores-o"><Trans i18nKey="pages.InvestorChart.mode-of-filing-the-complaint-on-scores-o-1">Mode of Filing the Complaint on SCORES or with Research Analyst Administration and Supervisory Body (RAASB)</Trans></Trans></h4>
                      <ul className="list-disc pl-5 mt-2 space-y-2">
                        <li>
                          <Trans i18nKey="pages.InvestorChart.scores-2-0-a-web-based-centralized-griev"><Trans i18nKey="pages.InvestorChart.scores-2-0-a-web-based-centralized-griev-1">SCORES 2.0 (a web-based centralized grievance redressal system of SEBI for facilitating effective grievance redressal in time-bound manner) (</Trans></Trans>
                          <a href="https://scores.sebi.gov.in" className="text-indigo-600 hover:text-indigo-700 underline"> <Trans i18nKey="pages.InvestorChart.https-scores-sebi-gov-in"><Trans i18nKey="pages.InvestorChart.https-scores-sebi-gov-in-1">https://scores.sebi.gov.in</Trans></Trans></a>)
                        </li>
                        <li>
                          <Trans i18nKey="pages.InvestorChart.two-level-review-for-complaint-grievance"><Trans i18nKey="pages.InvestorChart.two-level-review-for-complaint-grievance-1">Two-level review for complaint/grievance against Research Analyst:</Trans></Trans>
                          <ul className="list-circle pl-5 mt-2">
                            <li><Trans i18nKey="pages.InvestorChart.first-review-done-by-designated-body-raa"><Trans i18nKey="pages.InvestorChart.first-review-done-by-designated-body-raa-1">First review done by designated body (RAASB)</Trans></Trans></li>
                            <li><Trans i18nKey="pages.InvestorChart.second-review-done-by-sebi"><Trans i18nKey="pages.InvestorChart.second-review-done-by-sebi-1">Second review done by SEBI</Trans></Trans></li>
                          </ul>
                        </li>
                        <li><Trans i18nKey="pages.InvestorChart.email-to-designated-email-id-of-raasb"><Trans i18nKey="pages.InvestorChart.email-to-designated-email-id-of-raasb-1">Email to designated email ID of RAASB</Trans></Trans></li>
                      </ul>
                    </div>
                    <motion.p variants={itemVariants}>
                      <Trans i18nKey="pages.InvestorChart.2-if-the-investor-is-not-satisfied-with-"><Trans i18nKey="pages.InvestorChart.2-if-the-investor-is-not-satisfied-with--1">2. If the Investor is not satisfied with the resolution provided by the Market Participants, then the Investor has the option to file the complaint/grievance on SMARTODR platform for its resolution through online conciliation or arbitration.</Trans></Trans>
                    </motion.p>
                    <motion.p variants={itemVariants}>
                      <Trans i18nKey="pages.InvestorChart.with-regard-to-physical-complaints-inves"><Trans i18nKey="pages.InvestorChart.with-regard-to-physical-complaints-inves-1">With regard to physical complaints, investors may send their complaints to:</Trans></Trans>
                    </motion.p>
                    <p className="font-medium"><Trans i18nKey="pages.InvestorChart.office-of-investor-assistance-and-educat"><Trans i18nKey="pages.InvestorChart.office-of-investor-assistance-and-educat-1">Office of Investor Assistance and Education, Securities and Exchange Board of India, SEBI Bhavan, Plot No.C4-A, ‘G’ Block, Bandra – Kurla Complex, Bandra (E), Mumbai-400051</Trans></Trans></p>
                  </div>
                </motion.div>

                {/* Section E: Rights of Investors */}
                <motion.div className="mb-6" variants={itemVariants}>
                  <h3 className="text-lg font-semibold mb-3"><Trans i18nKey="pages.InvestorChart.e-rights-of-investors">E. Rights of Investors</Trans></h3>
                  <ul className="list-disc pl-5 mt-2 space-y-2">
                    <li><Trans i18nKey="pages.InvestorChart.right-to-privacy-and-confidentiality"><Trans i18nKey="pages.InvestorChart.right-to-privacy-and-confidentiality-1">Right to Privacy and Confidentiality</Trans></Trans></li>
                    <li><Trans i18nKey="pages.InvestorChart.right-to-transparent-practices"><Trans i18nKey="pages.InvestorChart.right-to-transparent-practices-1">Right to Transparent Practices</Trans></Trans></li>
                    <li><Trans i18nKey="pages.InvestorChart.right-to-adequate-information"><Trans i18nKey="pages.InvestorChart.right-to-adequate-information-1">Right to Adequate Information</Trans></Trans></li>
                    <li><Trans i18nKey="pages.InvestorChart.right-to-initial-and-continuing-disclosu"><Trans i18nKey="pages.InvestorChart.right-to-initial-and-continuing-disclosu-1">Right to Initial and Continuing Disclosure</Trans></Trans></li>
                    <li><Trans i18nKey="pages.InvestorChart.right-to-receive-information-about-all-t"><Trans i18nKey="pages.InvestorChart.right-to-receive-information-about-all-t-1">Right to receive information about all the statutory and regulatory disclosures</Trans></Trans></li>
                    <li><Trans i18nKey="pages.InvestorChart.right-to-awareness-about-service-paramet"><Trans i18nKey="pages.InvestorChart.right-to-awareness-about-service-paramet-1">Right to Awareness about Service Parameters and Turnaround Times</Trans></Trans></li>
                    <li><Trans i18nKey="pages.InvestorChart.right-to-be-informed-of-the-timelines-fo"><Trans i18nKey="pages.InvestorChart.right-to-be-informed-of-the-timelines-fo-1">Right to be informed of the timelines for each service</Trans></Trans></li>
                    <li><Trans i18nKey="pages.InvestorChart.right-to-be-heard-and-satisfactory-griev"><Trans i18nKey="pages.InvestorChart.right-to-be-heard-and-satisfactory-griev-1">Right to be Heard and Satisfactory Grievance Redressal</Trans></Trans></li>
                    <li><Trans i18nKey="pages.InvestorChart.right-to-have-timely-redressal"><Trans i18nKey="pages.InvestorChart.right-to-have-timely-redressal-1">Right to have timely redressal</Trans></Trans></li>
                    <li><Trans i18nKey="pages.InvestorChart.right-to-exit-from-financial-product-or-"><Trans i18nKey="pages.InvestorChart.right-to-exit-from-financial-product-or--1">Right to Exit from Financial product or service in accordance with the terms and conditions agreed with the research analyst</Trans></Trans></li>
                    <li><Trans i18nKey="pages.InvestorChart.right-to-receive-clear-guidance-and-caut"><Trans i18nKey="pages.InvestorChart.right-to-receive-clear-guidance-and-caut-1">Right to receive clear guidance and caution notice when dealing in Complex and High-Risk Financial Products and Services</Trans></Trans></li>
                    <li>
                      <Trans i18nKey="pages.InvestorChart.additional-rights-to-vulnerable-consumer"><Trans i18nKey="pages.InvestorChart.additional-rights-to-vulnerable-consumer-1">Additional Rights to vulnerable consumers</Trans></Trans>
                      <ul className="list-circle pl-5 mt-2">
                        <li><Trans i18nKey="pages.InvestorChart.right-to-get-access-to-services-in-a-sui"><Trans i18nKey="pages.InvestorChart.right-to-get-access-to-services-in-a-sui-1">Right to get access to services in a suitable manner even if differently abled</Trans></Trans></li>
                      </ul>
                    </li>
                    <li><Trans i18nKey="pages.InvestorChart.right-to-provide-feedback-on-the-financi"><Trans i18nKey="pages.InvestorChart.right-to-provide-feedback-on-the-financi-1">Right to provide feedback on the financial products and services used</Trans></Trans></li>
                  </ul>
                </motion.div>

                {/* Section F: Expectations from Investors */}
                <motion.div className="mb-6" variants={itemVariants}>
                  <h3 className="text-lg font-semibold mb-3"><Trans i18nKey="pages.InvestorChart.f-expectations-from-the-investors-respon"><Trans i18nKey="pages.InvestorChart.f-expectations-from-the-investors-respon-1">F. Expectations from the Investors (Responsibilities of Investors)</Trans></Trans></h3>
                  <div className="space-y-4 text-sm sm:text-base leading-relaxed">
                    <div>
                      <h4 className="text-base font-medium text-indigo-600"><Trans i18nKey="pages.InvestorChart.do-s">Do’s</Trans></h4>
                      <ul className="list-decimal pl-5 mt-2 space-y-2">
                        <li><Trans i18nKey="pages.InvestorChart.always-deal-with-sebi-registered-researc"><Trans i18nKey="pages.InvestorChart.always-deal-with-sebi-registered-researc-1">Always deal with SEBI registered Research Analyst.</Trans></Trans></li>
                        <li><Trans i18nKey="pages.InvestorChart.ensure-that-the-research-analyst-has-a-v"><Trans i18nKey="pages.InvestorChart.ensure-that-the-research-analyst-has-a-v-1">Ensure that the Research Analyst has a valid registration certificate.</Trans></Trans></li>
                        <li><Trans i18nKey="pages.InvestorChart.check-for-sebi-registration-number"><Trans i18nKey="pages.InvestorChart.check-for-sebi-registration-number-1">Check for SEBI registration number.</Trans></Trans></li>
                        <li>
                          <Trans i18nKey="pages.InvestorChart.please-refer-to-the-list-of-all-sebi-reg"><Trans i18nKey="pages.InvestorChart.please-refer-to-the-list-of-all-sebi-reg-1">Please refer to the list of all SEBI registered Research Analyst which is available on SEBI website in the following link:</Trans></Trans>
                          <a href="https://www.sebi.gov.in/sebiweb/other/OtherAction.do?doRecognisedFpi=yes&intmId=14" className="text-indigo-600 hover:text-indigo-700 underline"> <Trans i18nKey="pages.InvestorChart.https-www-sebi-gov-in">https://www.sebi.gov.in</Trans></a>
                        </li>
                        <li><Trans i18nKey="pages.InvestorChart.always-pay-attention-towards-disclosures"><Trans i18nKey="pages.InvestorChart.always-pay-attention-towards-disclosures-1">Always pay attention towards disclosures made in the research reports before investing.</Trans></Trans></li>
                        <li>Pay your Research Analyst through banking channels only and maintain duly signed receipts mentioning the details of your payments. You may make payment of fees through Centralized Fee Collection Mechanism (CeFCoM) of RAASB if research analyst has opted for the mechanism. (Applicable for fee-paying clients only)</li>
                        <li><Trans i18nKey="pages.InvestorChart.before-buying-selling-securities-or-appl"><Trans i18nKey="pages.InvestorChart.before-buying-selling-securities-or-appl-1">Before buying/selling securities or applying in public offer, check for the research recommendation provided by your Research Analyst.</Trans></Trans></li>
                        <li><Trans i18nKey="pages.InvestorChart.ask-all-relevant-questions-and-clear-you"><Trans i18nKey="pages.InvestorChart.ask-all-relevant-questions-and-clear-you-1">Ask all relevant questions and clear your doubts with your Research Analyst before acting on recommendation.</Trans></Trans></li>
                        <li><Trans i18nKey="pages.InvestorChart.seek-clarifications-and-guidance-on-rese"><Trans i18nKey="pages.InvestorChart.seek-clarifications-and-guidance-on-rese-1">Seek clarifications and guidance on research recommendations from your Research Analyst, especially if it involves complex and high-risk financial products and services.</Trans></Trans></li>
                        <li><Trans i18nKey="pages.InvestorChart.always-be-aware-that-you-have-the-right-"><Trans i18nKey="pages.InvestorChart.always-be-aware-that-you-have-the-right--3">Always be aware that you have the right to stop availing the service of a Research Analyst as per the terms of service agreed between you and your Research Analyst.</Trans></Trans></li>
                        <li><Trans i18nKey="pages.InvestorChart.always-be-aware-that-you-have-the-right--1"><Trans i18nKey="pages.InvestorChart.always-be-aware-that-you-have-the-right--2">Always be aware that you have the right to provide feedback to your Research Analyst in respect of the services received.</Trans></Trans></li>
                        <li><Trans i18nKey="pages.InvestorChart.always-be-aware-that-you-will-not-be-bou"><Trans i18nKey="pages.InvestorChart.always-be-aware-that-you-will-not-be-bou-1">Always be aware that you will not be bound by any clause, prescribed by the research analyst, which is contravening any regulatory provisions.</Trans></Trans></li>
                        <li><Trans i18nKey="pages.InvestorChart.inform-sebi-about-research-analyst-offer"><Trans i18nKey="pages.InvestorChart.inform-sebi-about-research-analyst-offer-1">Inform SEBI about Research Analyst offering assured or guaranteed returns.</Trans></Trans></li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-base font-medium text-indigo-600"><Trans i18nKey="pages.InvestorChart.don-ts">Don’ts</Trans></h4>
                      <ul className="list-decimal pl-5 mt-2 space-y-2">
                        <li><Trans i18nKey="pages.InvestorChart.do-not-provide-funds-for-investment-to-t"><Trans i18nKey="pages.InvestorChart.do-not-provide-funds-for-investment-to-t-1">Do not provide funds for investment to the Research Analyst.</Trans></Trans></li>
                        <li><Trans i18nKey="pages.InvestorChart.don-t-fall-prey-to-luring-advertisements"><Trans i18nKey="pages.InvestorChart.don-t-fall-prey-to-luring-advertisements-1">Don’t fall prey to luring advertisements or market rumors.</Trans></Trans></li>
                        <li><Trans i18nKey="pages.InvestorChart.do-not-get-attracted-to-limited-period-d"><Trans i18nKey="pages.InvestorChart.do-not-get-attracted-to-limited-period-d-1">Do not get attracted to limited period discount or other incentive, gifts, etc. offered by Research Analyst.</Trans></Trans></li>
                        <li><Trans i18nKey="pages.InvestorChart.do-not-share-login-credential-and-passwo"><Trans i18nKey="pages.InvestorChart.do-not-share-login-credential-and-passwo-1">Do not share login credential and password of your trading, demat or bank accounts with the Research Analyst.</Trans></Trans></li>
                      </ul>
                    </div>
                  </div>
                </motion.div>

              </div>
            </motion.div>
        </div>
      </motion.section>
    </>
  );
};

export default InvestorCharter;