// src/pages/GrievanceRedressalProcess.js
import React from 'react';
import { Trans } from '../i18nShim';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import '../styles/headings.css';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.12 } },
};

const GrievanceRedressalProcess = () => (
  <>
    <Helmet>
      <title>Grievance Redressal Process - Wise Global Research</title>
      <meta name="description" content="Grievance Redressal Process page — Wise Global Research." />
      <link rel="canonical" href="https://wiseglobalresearch.com/grievanceredressalprocess" />
    </Helmet>

    {/* Responsive table CSS (scoped) */}
    <style>{`
      @media (max-width: 640px) {
        .stack-table thead { display: none; }
        .stack-table, .stack-table tbody, .stack-table tr, .stack-table td { display: block; width: 100%; }
        .stack-table tr { margin-bottom: 1rem; border: 1px solid #e5e7eb; border-radius: 0.75rem; overflow: hidden; background: #fff; }
        .stack-table td { padding: 0.5rem 0.75rem; border: 0; border-bottom: 1px solid #f3f4f6; display: flex; justify-content: space-between; gap: 1rem; }
        .stack-table td:last-child { border-bottom: 0; }
        .stack-table td::before { content: attr(data-label); font-weight: 600; color: #374151; }
      }
    `}</style>

    <motion.section
      aria-labelledby="grievance-redressal-process-title"
      className="relative py-6 sm:py-10 lg:py-14 px-2 sm:px-4 md:px-6"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <motion.div
        className="mb-4 sm:mb-6 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-2xl text-black"
        style={{
          background: '#fff',
          border: '2px solid #6366f1',
          boxShadow: '0 8px 32px 0 rgba(60,60,120,0.18), 0 1.5px 8px 0 rgba(99,102,241,0.10)',
          overflowX: 'auto',
          maxWidth: '100vw',
        }}
        variants={staggerContainer}
      >
        <motion.div className="container mx-auto max-w-4xl card-text" variants={staggerContainer}>
          <motion.h1 id="grievance-redressal-process-title" className="text-3xl sm:text-4xl font-extrabold mb-6 text-center text-indigo-700" variants={fadeIn}>
            <Trans i18nKey="pages.GrievanceRedressalProcess.grievance-redressal-process">Grievance Redressal Process</Trans>
          </motion.h1>

          <motion.h2 className="text-2xl font-bold mb-4 heading-purple" variants={fadeIn}>
            <Trans i18nKey="pages.GrievanceRedressalProcess.about-us">About Us</Trans>
          </motion.h2>
          <motion.p className="mb-6 text-black/80" variants={fadeIn}>
            We believe that Investor service is a vital element for sustained business growth and we want to ensure that our Investors receive exemplary service across different touch points. Prompt and efficient service is essential for retaining existing relationships and therefore Investor satisfaction becomes critical to us, especially since we follow the Direct‐to‐Investor model. Investor queries and complaints constitute an important voice of Investor, and this policy details grievance handling through a structured grievance redressal framework. Grievance redressal is supported by a review mechanism, to minimize the recurrence of similar issues in future.
          </motion.p>

          <motion.h2 className="text-2xl font-bold mb-2 heading-purple" variants={fadeIn}>
            <Trans i18nKey="pages.GrievanceRedressalProcess.the-grievance-redressal-policy-follows-t-1">The Grievance Redressal policy follows the following principles:</Trans>
          </motion.h2>
          <ul className="list-disc pl-6 text-black/80 mb-6">
            <li><Trans i18nKey="pages.GrievanceRedressalProcess.investors-will-be-treated-fairly-at-all--1">Investors will be treated fairly at all times</Trans></li>
            <li><Trans i18nKey="pages.GrievanceRedressalProcess.complaints-raised-by-investors-will-be-d-1">Complaints raised by Investors will be dealt with courtesy and in a timely manner</Trans></li>
            <li><Trans i18nKey="pages.GrievanceRedressalProcess.queries-and-complaints-will-be-treated-e-1">Queries and Complaints will be treated efficiently and fairly.</Trans></li>
            <li><Trans i18nKey="pages.GrievanceRedressalProcess.the-research-analyst-and-employees-work--1">The Research Analyst and employees work in good faith and without prejudice, towards the interests of the Investors.</Trans></li>
          </ul>

          <motion.h2 className="text-2xl font-bold mb-2 heading-purple" variants={fadeIn}>
            <Trans i18nKey="pages.GrievanceRedressalProcess.grievance-redressal-escalation-matrix-1">Grievance Redressal / Escalation Matrix</Trans>
          </motion.h2>
          <p className="mb-3 text-black/80"><Trans i18nKey="pages.GrievanceRedressalProcess.if-you-have-a-grievance-you-can-reach-ou-1">If you have a grievance, you can reach out to our Support Team for assistance.</Trans></p>

          <div className="overflow-x-auto mb-8">
            <table className="stack-table w-full border border-gray-200 text-sm">
              <thead className="bg-gray-100 text-gray-900">
                <tr>
                  <th className="border px-2 py-1"><Trans i18nKey="pages.GrievanceRedressalProcess.designation">Designation</Trans></th>
                  <th className="border px-2 py-1"><Trans i18nKey="pages.GrievanceRedressalProcess.contact-person-name-1">Contact Person Name</Trans></th>
                  <th className="border px-2 py-1"><Trans i18nKey="pages.GrievanceRedressalProcess.address">Address</Trans></th>
                  <th className="border px-2 py-1"><Trans i18nKey="pages.GrievanceRedressalProcess.contact-no">Contact No.</Trans></th>
                  <th className="border px-2 py-1"><Trans i18nKey="pages.GrievanceRedressalProcess.email-id">Email-ID</Trans></th>
                  <th className="border px-2 py-1"><Trans i18nKey="pages.GrievanceRedressalProcess.working-hours-1">Working hours</Trans></th>
                </tr>
              </thead>
              <tbody className="bg-white">
                <tr>
                  <td className="border px-2 py-1" data-label="Designation"><Trans i18nKey="pages.GrievanceRedressalProcess.customer-care-1">Customer Care</Trans></td>
                  <td className="border px-2 py-1" data-label="Contact Person Name"><Trans i18nKey="pages.GrievanceRedressalProcess.ms-gauri-shukla-1">Ms. Gauri Shukla</Trans></td>
                  <td className="border px-2 py-1" data-label="Address"><Trans i18nKey="pages.GrievanceRedressalProcess.indore">Indore</Trans></td>
                  <td className="border px-2 py-1" data-label="Contact No.">99779-09494</td>
                  <td className="border px-2 py-1" data-label="Email-ID"><Trans i18nKey="pages.GrievanceRedressalProcess.services-wiseglobalresearch-com-2">services@wiseglobalresearch.com</Trans></td>
                  <td className="border px-2 py-1" data-label="Working hours"><Trans i18nKey="pages.GrievanceRedressalProcess.mon-fri-09-30-am-05-00-pm-2">Mon-Fri 09:30 AM – 05:00 PM</Trans></td>
                </tr>
                <tr>
                  <td className="border px-2 py-1" data-label="Designation"><Trans i18nKey="pages.GrievanceRedressalProcess.head-of-customer-care-1">Head of Customer Care</Trans></td>
                  <td className="border px-2 py-1" data-label="Contact Person Name"><Trans i18nKey="pages.GrievanceRedressalProcess.mr-d-sahu">Mr. D. Sahu</Trans></td>
                  <td className="border px-2 py-1" data-label="Address"><Trans i18nKey="pages.GrievanceRedressalProcess.indore">Indore</Trans></td>
                  <td className="border px-2 py-1" data-label="Contact No.">99779-08989</td>
                  <td className="border px-2 py-1" data-label="Email-ID"><Trans i18nKey="pages.GrievanceRedressalProcess.support-wiseglobalresearch-com-2">support@wiseglobalresearch.com</Trans></td>
                  <td className="border px-2 py-1" data-label="Working hours"><Trans i18nKey="pages.GrievanceRedressalProcess.mon-fri-09-30-am-05-00-pm-1">Mon-Fri 09:30 AM – 05:00 PM</Trans></td>
                </tr>
                <tr>
                  <td className="border px-2 py-1" data-label="Designation"><Trans i18nKey="pages.GrievanceRedressalProcess.compliance-officer-1">Compliance Officer</Trans></td>
                  <td className="border px-2 py-1" data-label="Contact Person Name"><Trans i18nKey="pages.GrievanceRedressalProcess.mr-hemraj-singh-sikarwar-3">Mr. Hemraj Singh Sikarwar</Trans></td>
                  <td className="border px-2 py-1" data-label="Address"><Trans i18nKey="pages.GrievanceRedressalProcess.indore">Indore</Trans></td>
                  <td className="border px-2 py-1" data-label="Contact No.">90099-09963</td>
                  <td className="border px-2 py-1" data-label="Email-ID"><Trans i18nKey="pages.GrievanceRedressalProcess.hemraj-wiseglobalresearch-com-4">hemraj@wiseglobalresearch.com</Trans></td>
                  <td className="border px-2 py-1" data-label="Working hours"><Trans i18nKey="pages.GrievanceRedressalProcess.mon-fri-11-00-am-05-00-pm-3">Mon-Fri 11:00 AM – 05:00 PM</Trans></td>
                </tr>
                <tr>
                  <td className="border px-2 py-1" data-label="Designation"><Trans i18nKey="pages.GrievanceRedressalProcess.ceo">CEO</Trans></td>
                  <td className="border px-2 py-1" data-label="Contact Person Name"><Trans i18nKey="pages.GrievanceRedressalProcess.mr-hemraj-singh-sikarwar-2">Mr. Hemraj Singh Sikarwar</Trans></td>
                  <td className="border px-2 py-1" data-label="Address"><Trans i18nKey="pages.GrievanceRedressalProcess.indore">Indore</Trans></td>
                  <td className="border px-2 py-1" data-label="Contact No.">90099-09963</td>
                  <td className="border px-2 py-1" data-label="Email-ID"><Trans i18nKey="pages.GrievanceRedressalProcess.hemraj-wiseglobalresearch-com-3">hemraj@wiseglobalresearch.com</Trans></td>
                  <td className="border px-2 py-1" data-label="Working hours"><Trans i18nKey="pages.GrievanceRedressalProcess.mon-fri-11-00-am-05-00-pm-2">Mon-Fri 11:00 AM – 05:00 PM</Trans></td>
                </tr>
                <tr>
                  <td className="border px-2 py-1" data-label="Designation"><Trans i18nKey="pages.GrievanceRedressalProcess.principal-officer-1">Principal Officer</Trans></td>
                  <td className="border px-2 py-1" data-label="Contact Person Name"><Trans i18nKey="pages.GrievanceRedressalProcess.mr-hemraj-singh-sikarwar-1">Mr. Hemraj Singh Sikarwar</Trans></td>
                  <td className="border px-2 py-1" data-label="Address"><Trans i18nKey="pages.GrievanceRedressalProcess.indore">Indore</Trans></td>
                  <td className="border px-2 py-1" data-label="Contact No.">90099-09963</td>
                  <td className="border px-2 py-1" data-label="Email-ID"><Trans i18nKey="pages.GrievanceRedressalProcess.hemraj-wiseglobalresearch-com-2">hemraj@wiseglobalresearch.com</Trans></td>
                  <td className="border px-2 py-1" data-label="Working hours"><Trans i18nKey="pages.GrievanceRedressalProcess.mon-fri-11-00-am-05-00-pm-1">Mon-Fri 11:00 AM – 05:00 PM</Trans></td>
                </tr>
              </tbody>
            </table>
          </div>

          <motion.h2 className="text-2xl font-bold mb-2 heading-purple" variants={fadeIn}>
            <Trans i18nKey="pages.GrievanceRedressalProcess.dear-valued-client-1">Dear Valued Client,</Trans>
          </motion.h2>
          <motion.p className="mb-4 text-black/80" variants={fadeIn}>
            <Trans i18nKey="pages.GrievanceRedressalProcess.thank-you-for-reaching-out-to-us-to-ensu-1">Thank you for reaching out to us. To ensure a seamless and transparent resolution process, we request you to follow the steps outlined below for escalating any query or complaint:</Trans>
          </motion.p>
          <ol className="list-decimal pl-6 mb-6 text-black/80">
            <li className="mb-3">
              <strong><Trans i18nKey="pages.GrievanceRedressalProcess.initial-query-or-complaint-1">Initial Query or Complaint:</Trans></strong><br />
              <Trans i18nKey="pages.GrievanceRedressalProcess.you-can-seek-clarification-or-lodge-a-co-1">You can seek clarification or lodge a complaint in writing, orally, telephonically, or by filling out the complaint box available on our website.</Trans><br />
              <span className="block"><Trans i18nKey="pages.GrievanceRedressalProcess.email">Email:</Trans> <a href="mailto:services@wiseglobalresearch.com" className="underline text-blue-600">services@wiseglobalresearch.com</a></span>
              <span className="block"><Trans i18nKey="pages.GrievanceRedressalProcess.phone">Phone:</Trans> <a href="tel:+919977909494" className="underline text-blue-600">+91 99779 09494</a></span>
              <span className="block"><Trans i18nKey="pages.GrievanceRedressalProcess.expected-resolution-time-within-7-busine-1">Expected resolution time: Within 7 business days.</Trans></span>
            </li>
            <li className="mb-3">
              <strong><Trans i18nKey="pages.GrievanceRedressalProcess.escalation-to-the-head-of-customer-care-1">Escalation to the Head of Customer Care:</Trans></strong><br />
              <Trans i18nKey="pages.GrievanceRedressalProcess.if-you-do-not-receive-a-response-within--1">If you do not receive a response within 7 business days, you may escalate the issue to the Head of Customer Care.</Trans><br />
              <span className="block"><Trans i18nKey="pages.GrievanceRedressalProcess.email">Email:</Trans> <a href="mailto:support@wiseglobalresearch.com" className="underline text-blue-600">support@wiseglobalresearch.com</a></span>
              <span className="block"><Trans i18nKey="pages.GrievanceRedressalProcess.phone">Phone:</Trans> <a href="tel:+919977908989" className="underline text-blue-600">+91 99779 08989</a></span>
              <span className="block"><Trans i18nKey="pages.GrievanceRedressalProcess.expected-reply-within-7-business-days-2">Expected reply: Within 7 business days.</Trans></span>
            </li>
            <li className="mb-3">
              <strong><Trans i18nKey="pages.GrievanceRedressalProcess.further-escalation-to-the-compliance-off-1">Further Escalation to the Compliance Officer/ CEO/ Principal Officer:</Trans></strong><br />
              <Trans i18nKey="pages.GrievanceRedressalProcess.if-unresolved-after-14-business-days-esc-1">If unresolved after 14 business days, escalate the matter to the Compliance Officer/ CEO/ Principal Officer.</Trans><br />
              <span className="block"><Trans i18nKey="pages.GrievanceRedressalProcess.email">Email:</Trans> <a href="mailto:hemraj@wiseglobalresearch.com" className="underline text-blue-600">hemraj@wiseglobalresearch.com</a></span>
              <span className="block"><Trans i18nKey="pages.GrievanceRedressalProcess.phone">Phone:</Trans> <a href="tel:+919009909963" className="underline text-blue-600">+91 90099 09963</a></span>
              <span className="block"><Trans i18nKey="pages.GrievanceRedressalProcess.expected-reply-within-7-business-days-1">Expected reply: Within 7 business days.</Trans></span>
            </li>
          </ol>

          <ul className="list-disc pl-6 mb-2 text-black/80">
            <li>
              <Trans i18nKey="pages.GrievanceRedressalProcess.if-the-resolution-is-unsatisfactory-the--1">If the resolution is unsatisfactory, the client can also lodge grievances through SEBI’s SCORES platform at:</Trans>
              <a href="https://www.scores.sebi.gov.in" className="underline text-blue-600" target="_blank" rel="noopener noreferrer"> www.scores.sebi.gov.in</a>
            </li>
            <li>
              <Trans i18nKey="pages.GrievanceRedressalProcess.the-client-may-also-consider-the-online--1">The client may also consider the Online Dispute Resolution (ODR) through the Smart ODR portal at:</Trans>
              <a href="https://smartodr.in" className="underline text-blue-600" target="_blank" rel="noopener noreferrer"> https://smartodr.in</a>
            </li>
          </ul>
        </motion.div>
      </motion.div>
    </motion.section>
  </>
);

export default GrievanceRedressalProcess;
