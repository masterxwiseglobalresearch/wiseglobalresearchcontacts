import React, { useEffect, useState } from 'react';
import '../styles/headings.css';
import { Trans } from '../i18nShim';
import { motion } from 'framer-motion';
import { FaMoneyCheckAlt, FaUniversity } from 'react-icons/fa';
// import qrImage from '../assets/images/QR.png';
import { db } from '../firebase';
import { ref as dbRef, onValue } from 'firebase/database';
import { Helmet } from 'react-helmet-async';


const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.8,
      ease: "easeOut"
    },
  }),
};

const PaymentInfo = () => {

  // Bank details for all supported banks. Theme controls color for border/icon.
  const bankDetails = [
    {
      bankName: "HDFC BANK",
      details: [
        { label: "Account Holder", value: "Wise Global Research Services Pvt Ltd" },
        { label: "Account Number", value: "50200098347178" },
        { label: "IFSC Code", value: "HDFC0008125" },
        { label: "Account Type", value: "Current" },
        { label: "Branch", value: "AB Road, Indore" },
      ],
      theme: "blue"
    },
    {
      bankName: "SBI BANK",
      details: [
        { label: "Account Holder", value: "Wise Global Research Services Pvt Ltd" },
        { label: "Account Number", value: "44688887003" },
        { label: "IFSC Code", value: "SBIN0000387" },
        { label: "Account Type", value: "Current" },
        { label: "Branch", value: "Near GPO AB Road, Indore" },
      ],
      theme: "green" // SBI branding is green
    },
    {
      bankName: "IDFC FIRST BANK",
      details: [
        { label: "Account Holder", value: "Wise Global Research Services Pvt Ltd" },
        { label: "Account Number", value: "80123123121" },
        { label: "IFSC Code", value: "IDFB0041269" },
        { label: "Account Type", value: "Current" },
        { label: "Branch", value: "Vijay Nagar, Indore" },
      ],
      theme: "red"
    }
  ];


  // QR code URLs for each bank
  const [hdfcQrUrl, setHdfcQrUrl] = useState(null); // HDFC
  const [sbiQrUrl, setSbiQrUrl] = useState(null);   // SBI
  const [idfcQrUrl, setIdfcQrUrl] = useState(null); // IDFC

  // Fetch QR codes from Firebase Realtime Database
  useEffect(() => {
    const hdfcRef = dbRef(db, 'qr/hdfc');
    const sbiRef = dbRef(db, 'qr/sbi');
    const idfcRef = dbRef(db, 'qr/idfc');
    // Listen for HDFC QR updates
    const unsubHdfc = onValue(hdfcRef, snap => {
      setHdfcQrUrl(snap.exists() ? snap.val() : null);
    });
    // Listen for SBI QR updates
    const unsubSbi = onValue(sbiRef, snap => {
      setSbiQrUrl(snap.exists() ? snap.val() : null);
    });
    // Listen for IDFC QR updates
    const unsubIdfc = onValue(idfcRef, snap => {
      setIdfcQrUrl(snap.exists() ? snap.val() : null);
    });
    // Cleanup listeners on unmount
    return () => {
      unsubHdfc();
      unsubSbi();
      unsubIdfc();
    };
  }, []);

  return (
    <>
      <Helmet>
        <title>Payment Info - Wise Global Research</title>
        <meta name="description" content="Payment information for Wise Global Research services. Pay via QR code, bank transfer, or payment gateways." />
        <link rel="canonical" href="https://wiseglobalresearch.com/paymentinfo" />
      </Helmet>

      <motion.section
        className="relative py-8 sm:py-10 lg:py-14 px-4 sm:px-6"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
      >
            <div className="text-black">
              <h1 className="text-2xl sm:text-3xl font-extrabold mb-6 text-center text-indigo-700"><Trans i18nKey="pages.PaymentInfo.payment-information">Payment Information</Trans></h1>
              <div className="space-y-5 text-sm sm:text-base leading-relaxed">
                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1, duration: 0.5 }}
                  className="text-center mx-auto max-w-2xl text-sm sm:text-base text-black"
                >
                  <Trans i18nKey="pages.PaymentInfo.payment-intro">Choose your preferred method to complete the payment. We accept payments via QR Code, Bank Transfer, and popular payment gateways.</Trans>
                </motion.p>

                {/* QR / Bank panels - fully responsive grid */}
                <motion.div
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12 mb-8 sm:mb-12"
                >
                  {bankDetails.map((bank, index) => {
                    // For tablet: center last item if odd number of items
                    const isTablet = typeof window !== 'undefined' && window.innerWidth >= 640 && window.innerWidth < 1024;
                    const isLastOddTablet = isTablet && bankDetails.length % 2 !== 0 && index === bankDetails.length - 1;
                    return (
                      <motion.div
                        key={index}
                        className={
                          `bg-white p-4 xs:p-5 sm:p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col items-center border border-indigo-50` +
                          (isLastOddTablet ? ' sm:col-span-2 sm:mx-auto' : '')
                        }
                        variants={fadeInUp}
                        custom={2 + index * 0.5}
                      >
                        {/* Logo removed as per user request */}
                        <h3 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-800 dark:text-white mb-1 sm:mb-2"><Trans i18nKey="pages.PaymentInfo.scan-pay">Scan & Pay</Trans></h3>
                        <div className="w-48 h-48 xs:w-56 xs:h-56 sm:w-64 sm:h-64 p-2 rounded-lg">
                          <div
                            className="rounded-md p-2 w-full h-full flex items-center justify-center shadow-inner bg-white border border-indigo-200"
                          >
                            <img
                              src={
                                bank.bankName === 'HDFC BANK' ? (hdfcQrUrl || '') :
                                bank.bankName === 'SBI BANK' ? (sbiQrUrl || '') :
                                bank.bankName === 'IDFC FIRST BANK' ? (idfcQrUrl || '') :
                                ''
                              }
                              alt="QR Code"
                              className="max-w-full max-h-full object-contain filter contrast-125"
                              style={{ imageRendering: 'auto' }}
                              loading="lazy"
                              onError={e => { e.target.style.display = 'none'; }}
                            />
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>

                <motion.div className="mb-8 sm:mb-12">
                  <h2 className="text-2xl xs:text-3xl sm:text-3xl font-bold text-center text-indigo-700 mb-5 sm:mb-8">
                    <Trans i18nKey="pages.PaymentInfo.bank-transfer-details">Bank Transfer Details</Trans>
                  </h2>
                  {/* Bank transfer details panel, border and icon color by theme */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
                    {bankDetails.map((bank, index) => {
                      // For tablet: center last item if odd number of items
                      const isTablet = typeof window !== 'undefined' && window.innerWidth >= 640 && window.innerWidth < 1024;
                      const isLastOddTablet = isTablet && bankDetails.length % 2 !== 0 && index === bankDetails.length - 1;
                      return (
                        <motion.div
                          key={index}
                          className={`bg-white p-4 xs:p-5 sm:p-6 rounded-2xl shadow-lg border-t-4
                            ${bank.theme === 'blue' ? 'border-indigo-600' :
                              bank.theme === 'red' ? 'border-red-500' :
                              bank.theme === 'green' ? 'border-green-600' :
                              'border-gray-300'}
                            ${isLastOddTablet ? ' sm:col-span-2 sm:mx-auto' : ''}`}
                          variants={fadeInUp}
                          custom={4 + index * 0.5}
                        >
                          <div className="flex items-center mb-3 sm:mb-4">
                            <FaUniversity className={`text-2xl xs:text-3xl mr-3 sm:mr-4
                              ${bank.theme === 'blue' ? 'text-indigo-600' :
                                bank.theme === 'red' ? 'text-red-500' :
                                bank.theme === 'green' ? 'text-green-600' :
                                'text-gray-400'}`}
                            />
                            <h3 className="text-lg xs:text-xl sm:text-2xl font-bold text-gray-900">{bank.bankName}</h3>
                          </div>
                          <ul className="space-y-2 xs:space-y-3">
                            {bank.details.map((item, itemIndex) => (
                              <li key={itemIndex} className="flex flex-row justify-between items-center text-xs xs:text-sm">
                                <strong className="text-gray-600 dark:text-gray-400"><Trans i18nKey={`pages.PaymentInfo.${item.label.toLowerCase().replace(/ /g, '-')}`}>{item.label}:</Trans></strong>
                                <span className="text-gray-800 dark:text-gray-200 font-medium text-right">{item.value}</span>
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>

                <motion.div className="text-center mb-8 sm:mb-12">
                  <h2 className="text-2xl xs:text-3xl sm:text-3xl font-bold text-center text-indigo-700 mb-5 sm:mb-8">
                    <Trans i18nKey="pages.PaymentInfo.payment-gateways">Payment Gateways</Trans>
                  </h2>
                  <div className="flex flex-col xs:flex-row items-center justify-center gap-4 xs:gap-6">
                    <motion.a
                      href="https://formbuilder.ccavenue.com/live/au-small-finance-bank/wise-global-research-services-pvt-ltd"
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ y: -5, boxShadow: "0 12px 30px rgba(79,70,229,0.12)" }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center justify-center gap-2 xs:gap-3 w-full xs:w-auto px-6 xs:px-8 py-3 xs:py-4 bg-indigo-600 text-white font-semibold rounded-xl shadow hover:bg-indigo-700 transition-all duration-300 text-sm xs:text-base"
                    >
                      <FaMoneyCheckAlt className="text-xl xs:text-2xl" />
                      <span><Trans i18nKey="pages.PaymentInfo.pay-via-ccavenue">Pay via CCAvenue</Trans></span>
                    </motion.a>
                    <motion.a
                      href="https://u.payu.in/hr313T3SHfRR"
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ y: -5, boxShadow: "0 12px 30px rgba(79,70,229,0.12)" }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center justify-center gap-2 xs:gap-3 w-full xs:w-auto px-6 xs:px-8 py-3 xs:py-4 bg-indigo-50 text-indigo-700 font-semibold rounded-xl shadow-sm hover:bg-indigo-100 transition-all duration-300 text-sm xs:text-base border border-indigo-100"
                    >
                      <FaMoneyCheckAlt className="text-xl xs:text-2xl text-indigo-700" />
                      <span><Trans i18nKey="pages.PaymentInfo.pay-via-payu">Pay via PayU</Trans></span>
                    </motion.a>
                  </div>
                </motion.div>

                <motion.div className="max-w-3xl mx-auto bg-white border border-indigo-100 p-4 xs:p-5 rounded-lg shadow-sm">
                  <p className="font-semibold text-sm text-indigo-700">
                    <strong><Trans i18nKey="pages.PaymentInfo.note">Note:</Trans></strong>
                  </p>
                  <p className="text-sm text-gray-700 mt-2">
                    <Trans i18nKey="pages.PaymentInfo.payment-warning">We accept payments only through the details listed above. Do not transfer to any personal account to avoid fraud.</Trans>
                  </p>
                </motion.div>

                {/* SEBI-validated UPI ID notice and FAQ section */}
                <motion.div className="max-w-3xl mx-auto bg-white border border-green-200 p-4 xs:p-5 rounded-lg shadow-sm mt-8">
                  <h2 className="text-xl sm:text-2xl font-bold text-green-700 mb-3">Dear Investors,</h2>
                  <p className="text-gray-800 mb-2">We would like to inform you that we have obtained a <span className="font-semibold">SEBI-validated UPI ID handle</span> for secure payment collection, as mandated by SEBI.</p>
                  <p className="text-gray-800 mb-4">For any UPI payment, you can make the payment on the following validated UPI ID:</p>
                  <ul className="list-disc pl-6 mb-4 text-gray-900">
                    <li><span className="font-mono font-semibold">wiseglobal.ra@valididfc</span></li>
                    <li><span className="font-mono font-semibold">wiseglobal.ra@validsbi</span></li>
                    <li><span className="font-mono font-semibold">wiseglobalresearch.ra@validhdfc</span></li>
                  </ul>
                  <h3 className="text-lg font-bold text-green-700 mb-2 mt-4">1. Please Read the FAQs Below to Understand the Validated UPI Handle System</h3>
                  <div className="bg-green-50 border border-green-200 rounded p-3 mb-4">
                    <h4 className="font-semibold mb-2">Frequently Asked Questions (FAQs)</h4>
                    <p className="mb-2"><span className="font-bold">Q. Is it compulsory for the investors to use the new handle only?</span><br />
                    <span className="text-gray-700">Ans. The investors can choose their preferred mode of payment, such as UPI, IMPS, NEFT, RTGS, or Cheques. If an investor opts to use UPI for the payment to registered intermediaries, then they have to do so only using the new UPI IDs allotted to registered intermediaries.</span></p>
                    <p className="mb-2"><span className="font-bold">Q. What should I check while making payment using the new UPI IDs/ QR Code?</span><br />
                    <span className="text-gray-700">Ans. Investors need to keep following things into consideration:
                      <ol className="list-decimal pl-5">
                        <li>The UPI ID should properly show the name of the intermediary, followed by the short abbreviation of their category for example “brk” for Brokers, “mf” for Mutual Funds to the left of the “@” character.</li>
                        <li>On the right side of the “@”, the new and exclusive handle “@valid” should be present, followed by the bank name.</li>
                        <li>On the confirmation screen, the app should show a white thumbs-up icon inside a green triangle.</li>
                        <li>The QR code generated using the utility will have a white thumbs-up icon inside a green triangle. It will also display the UPI ID just below the QR code.</li>
                      </ol>
                    </span></p>
                    <p className="mb-2"><span className="font-bold">Q. Do investors also need to obtain new UPI handles to transact in the securities market?</span><br />
                    <span className="text-gray-700">Ans. No, the new UPI IDs are only for intermediaries to obtain and investors can continue to use their existing UPI IDs.</span></p>
                    <p className="mb-2"><span className="font-bold">Q. Whom to approach if my transaction/ payment fails with the new UPI ID?</span><br />
                    <span className="text-gray-700">Ans. The secure validated UPI ID of intermediaries will use the same banking channel as the earlier generic UPI handles. In case of any technical difficulty, investors are requested to approach their respective bank.</span></p>
                  </div>
                  <h3 className="text-lg font-bold text-green-700 mb-2 mt-4">2. Verify Our UPI ID Using SEBI’s Online Verification Tool</h3>
                  <p className="mb-2">For complete transparency, investors may verify whether the UPI ID shared by us is official and SEBI-validated by visiting the link below:</p>
                  <a href="https://siportal.sebi.gov.in/intermediary/sebi-check" target="_blank" rel="noopener noreferrer" className="text-green-700 underline font-semibold">➡️ SEBI UPI Handle Verification Facility</a>
                  <ul className="list-disc pl-6 mt-2 text-gray-900">
                    <li>Whether our UPI ID is SEBI-registered</li>
                    <li>Whether it is officially validated</li>
                    <li>The intermediary name and category</li>
                  </ul>
                </motion.div>

              </div>
            </div>
      </motion.section>
    </>
  );
};

export default PaymentInfo;