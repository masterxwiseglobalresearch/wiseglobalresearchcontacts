import React, { useState } from 'react';
import '../styles/headings.css';
import { Trans } from '../i18nShim';
import { motion } from 'framer-motion';
import {
  RiUserLine, RiUser2Line, RiIdCardLine, RiMailLine, RiCalendar2Line,
  RiBankCardLine, RiContactsBookLine, RiArrowRightSLine, RiCheckboxCircleFill, RiCloseCircleFill, RiLoader4Line
} from 'react-icons/ri';



import { Helmet } from 'react-helmet-async';

// Animation variants for container and items
const containerVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
      duration: 0.7,
      ease: 'easeOut',
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const ClientServiceConsent = () => {
  const [formData, setFormData] = useState({
    clientName: '',
    clientId: '',
    fatherName: '',
    email: '',
    dob: '',
    pan: '',
    aadhaar: '',
    address: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showPopup, setShowPopup] = useState(false);
  // Location state
  const [location, setLocation] = useState({ state: '', city: '' });
  const [locationChecked, setLocationChecked] = useState(false);

  // Get user location from IPinfo Standard API (city/state)
  React.useEffect(() => {
    if (!locationChecked) {
      fetch('https://ipinfo.io/json?token=e7e84c1f3f7cd7')
        .then(res => res.json())
        .then(data => {
          setLocation({ state: data.region || '', city: data.city || '' });
          setLocationChecked(true);
        })
        .catch(() => {
          setLocationChecked(true);
        });
    }
  }, [locationChecked]);

  // no file fields: only form inputs

  // No file uploads — form only

  // Handle form input changes with light normalization (PAN/Aadhaar)
  const handleChange = (e) => {
    const { name, value } = e.target;
    let v = value;
    // Auto-format DOB as DD-MM-YYYY while typing
    if (name === 'dob') {
      const digits = value.replace(/\D/g, '').slice(0, 8); // keep max 8 digits
      if (digits.length <= 2) {
        v = digits;
      } else if (digits.length <= 4) {
        v = `${digits.slice(0, 2)}-${digits.slice(2)}`;
      } else {
        v = `${digits.slice(0, 2)}-${digits.slice(2, 4)}-${digits.slice(4)}`;
      }
    }
    if (name === 'pan') {
      v = value.toUpperCase().replace(/\s/g, '').slice(0, 10);
    }
    if (name === 'aadhaar') {
      v = value.replace(/\D/g, '').slice(0, 12);
    }
    // Client ID/Mobile No validation on input
    if (name === 'clientId') {
      if (locationChecked && location.city === 'Indore') {
        // Allow any value, but max 7 characters for Client ID in Indore
        v = v.slice(0, 7);
      } else if (locationChecked && location.state !== 'Madhya Pradesh') {
        // Only allow up to 7 digits for Client ID outside MP
        v = v.replace(/\D/g, '').slice(0, 7);
      }
    }
    setFormData((prev) => ({ ...prev, [name]: v }));
  };

  // Validate form and return list of English error messages
  const validateForm = (data) => {
    const errors = [];
    const isEmpty = (v) => !v || !String(v).trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  // DD-MM-YYYY or DD/MM/YYYY
  const dobRegex = /^(0[1-9]|[12][0-9]|3[01])[/-](0[1-9]|1[0-2])[/-](19|20)\d{2}$/;
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]$/i; // e.g., ABCDE1234F
    const aadhaarRegex = /^\d{12}$/; // 12 digits

    if (isEmpty(data.clientName)) errors.push('Client Name is required.');
    if (isEmpty(data.fatherName)) errors.push("Father's Name is required.");
    // Client ID/Mobile No validation
    if (locationChecked && location.city === 'Indore') {
      if (isEmpty(data.clientId)) {
        errors.push('Client ID is required.');
      } else if (data.clientId.length > 7) {
        errors.push('Client ID must be up to 7 characters.');
      }
    } else if (locationChecked && location.state !== 'Madhya Pradesh') {
      if (isEmpty(data.clientId)) {
        errors.push('Client ID is required.');
      } else if (!/^\d{7}$/.test(data.clientId)) {
        errors.push('Client ID must be exactly 7 digits.');
      }
    }

    if (isEmpty(data.email)) {
      errors.push('Email is required.');
    } else if (!emailRegex.test(data.email)) {
      errors.push('Please enter a valid email address.');
    }

    if (isEmpty(data.dob)) {
      errors.push('Date of Birth is required.');
    } else if (!dobRegex.test(data.dob)) {
      errors.push('Date of Birth must be in DD-MM-YYYY format.');
    }

    if (isEmpty(data.pan)) {
      errors.push('PAN is required.');
    } else if (!panRegex.test(data.pan)) {
      errors.push('PAN must be 10 characters (e.g., ABCDE1234F).');
    }

    if (isEmpty(data.aadhaar)) {
      errors.push('Aadhaar is required.');
    } else if (!aadhaarRegex.test(data.aadhaar)) {
      errors.push('Aadhaar must be 12 digits.');
    }

    if (isEmpty(data.address)) errors.push('Address is required.');

    return errors;
  };

  // Handle form submission (posts to local server like the provided ClientForm.jsx)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    // Custom validation to ensure all messages are shown in our popup
    const errors = validateForm(formData);
    if (errors.length > 0) {
      setMessage({
        type: 'error',
        text: `Please fix the following:\n- ${errors.join('\n- ')}`,
      });
      setShowPopup(true);
      return;
    }

    setIsSubmitting(true);

    // Prepare data for Digio (external API) - remove clientId/mobile no
    const digioPayload = { ...formData };
    delete digioPayload.clientId;

    try {
      // Send to Digio API without clientId/mobile no
      const response = await fetch('https://masterxservers.onrender.com/api/submit-client-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(digioPayload)
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: '✅ Please check your mail. Redirecting...' });
        setShowPopup(true);
        setTimeout(() => {
          window.location.href = 'https://wiseglobalresearch.com/client-service-consent-form/';
        }, 2000);
      } else {
        const errorCode = (data.error && data.error.code) || 'UNKNOWN_ERROR';
        setMessage({
          type: 'error',
          text: `We couldn't submit your form at the moment.\nError Code: ${errorCode}. Please try again later.`,
        });
        setShowPopup(true);
      }
    } catch (err) {
      setMessage({ type: 'error', text: `Network error: ${err.message}. Please check your connection and try again.` });
      setShowPopup(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Build Digio-compatible payload from form data. Matches PHP example structure.
  // Render input field with icon (binds to formData and handleChange)
  const renderInput = (id, label, icon, type = 'text', attrs = {}, note) => (
    <>
<motion.div variants={itemVariants} className="w-full">
      <label htmlFor={id} className="block text-sm font-medium text-gray-900 mb-2">
        {label}
      </label>
      <div className="relative">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-700 text-xl pointer-events-none">
          {icon}
        </span>
        <input
          id={id}
          name={id}
          type={type}
          value={formData[id] || ''}
          onChange={handleChange}
          placeholder={attrs.placeholder || `Enter your ${label.replace('*', '').toLowerCase()}`}
          className={`w-full pl-11 pr-4 py-3 rounded-lg border bg-white/0 text-gray-900 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300`}
          {...(id === 'email' ? { autoComplete: 'email' } : {})}
          {...(id === 'clientName' ? { autoComplete: 'name' } : {})}
          {...(id === 'fatherName' ? { autoComplete: 'additional-name' } : {})}
          {...(id === 'clientId' ? { autoComplete: 'off' } : {})}
          {...(id === 'dob' ? { autoComplete: 'bday', inputMode: 'numeric', pattern: '\\d{2}[-/]\\d{2}[-/]\\d{4}' } : {})}
          {...(id === 'pan' ? { autoComplete: 'off', inputMode: 'text', autoCapitalize: 'characters', pattern: '[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}', maxLength: 10, style: { textTransform: 'uppercase' } } : {})}
          {...(id === 'aadhaar' ? { autoComplete: 'off', inputMode: 'numeric', pattern: '\\d{12}', maxLength: 12 } : {})}
          {...attrs}
        />
      </div>
      {note && <p className="text-xs text-gray-400 mt-1">{note}</p>}
    </motion.div>
    </>
  );

  // no file inputs required anymore

  return (
    <div className="py-6 xs:py-8 sm:py-12 relative">
      <Helmet>
        <title>Client Service Consent - Wise Global Research</title>
        <meta name="description" content="Client Service Consent page — Wise Global Research." />
        <link rel="canonical" href="https://wiseglobalresearch.com/clientserviceconsent" />
      </Helmet>
      // ...existing code...
      <motion.div
        className="max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-12"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Breadcrumb removed as requested */}
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
            <div className="text-center mb-6 xs:mb-8">
              <h2 className="text-2xl xs:text-3xl font-extrabold text-indigo-700"><Trans i18nKey="pages.ClientServiceConsent.client-service-consent">Client Service Consent Form</Trans></h2>
              <p className="mt-1 xs:mt-2 text-xs xs:text-sm text-black">Please fill out the form below.</p>
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-4 sm:space-y-6">
            <motion.div
              variants={containerVariants}
              className="p-3 sm:p-6 rounded-lg bg-white border border-indigo-50 shadow-sm"
            >
              <h3 className="text-lg xs:text-xl font-semibold text-gray-900 border-b border-gray-300/40 pb-2 mb-4 xs:mb-6"><Trans i18nKey="pages.ClientServiceConsent.client-information">Client Information</Trans></h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
                {renderInput(
                  'clientName',
                  'Client Name*',
                  <RiUserLine />,
      'text',
      { required: true, placeholder: 'Enter Name' }
                )}
                {renderInput(
                  'fatherName',
                  "Father's Name*",
                  <RiUser2Line />,
      'text',
      { required: true, placeholder: "Enter Father's Name" }
                )}
                {/* Geolocation logic for Mobile No/Client ID field */}
                {locationChecked && (
                  location.city === 'Indore'
                    ? renderInput(
                        'clientId',
                        'Client ID*',
                        <RiIdCardLine />,
                        'text',
                        { maxLength: 50, placeholder: 'Enter Client ID' },
                        undefined
                      )
                    : location.state !== 'Madhya Pradesh'
                      ? renderInput(
                          'clientId',
                          'Client ID*',
                          <RiIdCardLine />,
                          'text',
                          { maxLength: 50, placeholder: 'Enter Client ID' },
                          'Ask your representative for the client ID.'
                        )
                      : null
                )}
                {renderInput(
                  'email',
                  'Email ID*',
                  <RiMailLine />,
      'email',
      { required: true, placeholder: 'Enter Email' }
                )}
                {renderInput(
                  'dob',
                  'Date Of Birth*',
                  <RiCalendar2Line />,
      'text',
  { required: true, placeholder: '31-12-2000', maxLength: 10 }
                )}
                {renderInput(
                  'pan',
                  'PAN*',
                  <RiBankCardLine />,
      'text',
      { required: true, maxLength: 10, placeholder: 'Enter PAN' }
                )}
                {renderInput(
                  'aadhaar',
                  'Aadhaar*',
                  <RiContactsBookLine />,
      'text',
      { required: true, maxLength: 12, placeholder: 'Enter Aadhaar' }
                )}
              </div>
            </motion.div>

            <motion.div
              variants={containerVariants}
              className="p-3 sm:p-6 rounded-lg bg-white border border-indigo-50 shadow-sm"
            >
              <motion.div variants={itemVariants}>
                <label
                  htmlFor="address"
                  className="block text-xs xs:text-sm font-medium text-gray-900 mb-2"
                ><Trans i18nKey="pages.ClientServiceConsent.address">Address*</Trans></label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Enter Full Address"
                  autoComplete="street-address"
                  className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-md border border-indigo-300 bg-white text-black placeholder-gray-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transition-all duration-300 text-xs sm:text-sm`}
                ></textarea>
              </motion.div>
            </motion.div>

            {/* Loader overlay while submitting */}
            {isSubmitting && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" role="alert" aria-busy="true" aria-live="assertive">
                <div className="p-6 rounded-2xl shadow-2xl border-2 flex flex-col items-center max-w-xs w-full bg-white/95 border-indigo-400 animate-fade-in">
                  <RiLoader4Line className="animate-spin text-indigo-600 text-4xl mb-2" />
                  <span className="text-indigo-700 font-semibold">Submitting your form...</span>
                </div>
              </div>
            )}

            {/* Popup Modal for messages */}
            {showPopup && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal="true">
                <div className="relative w-full max-w-lg mx-auto rounded-2xl shadow-2xl border-2 overflow-hidden animate-fade-in bg-white border-indigo-500">
                  <div className="p-6 sm:p-8 text-center bg-white">
                    <div className="flex items-center justify-center mb-4">
                      <div className={`flex items-center justify-center rounded-full h-16 w-16 ${message.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
                        {message.type === 'success' ? <RiCheckboxCircleFill className="text-white text-3xl" /> : <RiCloseCircleFill className="text-white text-3xl" />}
                      </div>
                    </div>
                    <div className="text-black font-semibold text-base sm:text-lg whitespace-pre-line" aria-live="assertive">
                      {message.text}
                    </div>
                    <div className="mt-5 flex justify-center">
                      <button
                        className="btn-purple inline-flex items-center gap-2 px-5 py-2 rounded-md"
                        onClick={() => setShowPopup(false)}
                        aria-label="Close message"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <motion.div variants={itemVariants}>
              <motion.button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-purple font-bold rounded-lg py-2 sm:py-3 px-3 disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-300 text-sm sm:text-base"
                whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
                {!isSubmitting && <RiArrowRightSLine className="inline ml-2" />}
              </motion.button>
            </motion.div>
          </form>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ClientServiceConsent;