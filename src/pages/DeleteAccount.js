import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { FiAlertTriangle, FiCheckCircle, FiClock, FiChevronLeft, FiMail } from 'react-icons/fi';

const QUESTIONS = [
  {
    id: 1,
    question: 'Why do you want to delete your account?',
    options: [
      { id: 'privacy', label: 'Privacy concerns', value: 'privacy' },
      { id: 'not-needed', label: 'No longer needed', value: 'not_needed' },
      { id: 'switch-service', label: 'Switching to another service', value: 'switching_service' },
      { id: 'notifications', label: 'Too many notifications', value: 'excessive_notifications' },
      { id: 'other', label: 'Other reason', value: 'other' },
    ],
    isRequired: true,
  },
  {
    id: 2,
    question: 'What data would you like to delete?',
    options: [
      { 
        id: 'all-data', 
        label: 'Delete all my personal data', 
        value: 'delete_all',
        description: 'Permanently removes all your information from our servers'
      },
      { 
        id: 'account-only', 
        label: 'Delete account only (keep anonymized data)', 
        value: 'delete_account_only',
        description: 'Keeps anonymized usage data for analytics'
      },
      { 
        id: 'download-first', 
        label: 'Download my data first, then delete', 
        value: 'download_then_delete',
        description: 'We\'ll email you a copy of your data before deletion'
      },
    ],
    isRequired: true,
  },
  {
    id: 3,
    question: 'How would you like us to proceed?',
    options: [
      { 
        id: 'immediate', 
        label: 'Delete immediately', 
        value: 'immediate',
        description: 'Account will be deactivated immediately'
      },
      { 
        id: '30-days', 
        label: 'Schedule deletion in 30 days', 
        value: '30_days',
        description: 'You can cancel within this period'
      },
      { 
        id: 'contact-first', 
        label: 'Contact me before deletion', 
        value: 'contact_first',
        description: 'We\'ll confirm before proceeding'
      },
    ],
    isRequired: true,
  },
  {
    id: 4,
    question: 'Final confirmation',
    options: [
      { 
        id: 'confirm', 
        label: 'Yes, I understand this action is irreversible', 
        value: 'confirmed',
        description: 'I understand all my data will be permanently deleted'
      },
      { 
        id: 'cancel', 
        label: 'No, I want to keep my account', 
        value: 'cancelled',
        description: 'I want to continue using Wise Global Research'
      },
    ],
    isRequired: true,
  },
];

const DeleteAccount = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [additionalReason, setAdditionalReason] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [deletionType, setDeletionType] = useState(null);

  const currentQuestion = QUESTIONS[currentStep];

  const handleOptionSelect = (option) => {
    const newAnswers = { ...answers, [currentQuestion.id]: option.value };
    setAnswers(newAnswers);

    if (option.value === 'cancelled') {
      setShowWarning(true);
      return;
    }

    if (currentStep === 0 && option.value === 'other') {
      setDeletionType('other');
    }

    // If last step and confirmed, go to feedback step
    if (currentStep === QUESTIONS.length - 1 && option.value === 'confirmed') {
      setCurrentStep(currentStep + 1); // Go to feedback step
      return;
    }

    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleGoBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const validateForm = () => {
    return QUESTIONS.every(q => answers[q.id]) && email && password;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const submissionData = {
        answers,
        additionalReason: additionalReason || null,
        email,
        timestamp: new Date().toISOString(),
        requestId: `DEL-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      };
      
      console.log('Submission data:', submissionData);
      
      // Store in localStorage for demo purposes
      localStorage.setItem('account_deletion_request', JSON.stringify(submissionData));
      
      setIsSubmitted(true);
      
      // Send confirmation email (simulated)
      if (answers[2] === 'download_then_delete') {
        console.log('Data export email would be sent to:', email);
      }
      
    } catch (error) {
      console.error('Submission error:', error);
      alert('There was an error processing your request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelRequest = () => {
    setShowWarning(false);
    setCurrentStep(0);
    setAnswers({});
  };

  const getProgressPercentage = () => {
    return ((currentStep + 1) / (QUESTIONS.length + 1)) * 100;
  };

  useEffect(() => {
    if (currentStep === QUESTIONS.length) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentStep]);

  const renderStepIndicator = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold text-gray-700">
          Step {currentStep + 1} of {QUESTIONS.length}
        </h2>
        <span className="text-sm font-medium text-red-600">
          {Math.round(getProgressPercentage())}% Complete
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <motion.div
          className="bg-red-600 h-2.5 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${getProgressPercentage()}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </div>
  );

  const renderWarningModal = () => (
    <AnimatePresence>
      {showWarning && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-xl max-w-md w-full p-6"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
          >
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-yellow-100">
              <FiAlertTriangle className="w-6 h-6 text-yellow-600" />
            </div>
            <h3 className="text-lg font-bold text-center mb-3">Keep Your Account?</h3>
            <p className="text-gray-600 text-center mb-6">
              Are you sure you want to cancel the deletion process? Your account will remain active.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowWarning(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Continue Deletion
              </button>
              <button
                onClick={handleCancelRequest}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Keep Account
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const renderConfirmationStep = () => (
    <motion.div
      className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-6 md:p-8 border border-red-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 rounded-full bg-red-100">
        <FiAlertTriangle className="w-8 h-8 text-red-600" />
      </div>
      <h2 className="text-2xl font-bold text-center mb-6 text-red-700">Final Verification</h2>
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="font-semibold text-red-800 mb-2">Important Information</h3>
          <ul className="space-y-2 text-sm text-red-700">
            <li className="flex items-start">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 mr-2 flex-shrink-0" />
              This action is permanent and cannot be undone
            </li>
            <li className="flex items-start">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 mr-2 flex-shrink-0" />
              All your data will be deleted within 30 days
            </li>
            <li className="flex items-start">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 mr-2 flex-shrink-0" />
              You will lose access to all paid features immediately
            </li>
          </ul>
        </div>
      </div>
    </motion.div>
  );

  const renderSuccessScreen = () => (
    <motion.div
      className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8 text-center border border-green-200"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 rounded-full bg-green-100">
        <FiCheckCircle className="w-10 h-10 text-green-600" />
      </div>
      
      <h2 className="text-2xl font-bold mb-4 text-green-700">Request Submitted Successfully</h2>
      
      <div className="space-y-4 mb-8">
        <p className="text-gray-600">
          We've received your account deletion request and will process it according to your preferences.
        </p>
        
        <div className="bg-gray-50 rounded-lg p-4 inline-block">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-700">
            <FiClock className="w-4 h-4" />
            <span>Request ID: <strong>DEL-{Date.now().toString().slice(-8)}</strong></span>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <h3 className="font-semibold text-blue-800 mb-3 flex items-center justify-center gap-2">
          <FiMail className="w-5 h-5" />
          What happens next?
        </h3>
        <ul className="space-y-3 text-left text-sm text-blue-700">
          <li className="flex items-start">
            <span className="inline-block w-2 h-2 rounded-full bg-blue-500 mt-1.5 mr-3 flex-shrink-0" />
            You'll receive a confirmation email within 24 hours
          </li>
          <li className="flex items-start">
            <span className="inline-block w-2 h-2 rounded-full bg-blue-500 mt-1.5 mr-3 flex-shrink-0" />
            If you requested data download, check your email for the download link
          </li>
          <li className="flex items-start">
            <span className="inline-block w-2 h-2 rounded-full bg-blue-500 mt-1.5 mr-3 flex-shrink-0" />
            Account will be deactivated according to your chosen timeline
          </li>
          <li className="flex items-start">
            <span className="inline-block w-2 h-2 rounded-full bg-blue-500 mt-1.5 mr-3 flex-shrink-0" />
            Complete data deletion occurs within 30 days
          </li>
        </ul>
      </div>

      <div className="text-sm text-gray-500">
        Need help? <a href="mailto:support@wiseglobalresearch.com" className="text-red-600 hover:underline">Contact our support team</a>
      </div>
    </motion.div>
  );

  return (
    <>
      <Helmet>
        <title>Delete Account - Wise Global Research</title>
        <meta name="description" content="Request account deletion and understand Wise Global Research's data deletion process. Your privacy matters to us." />
        <link rel="canonical" href="https://wiseglobalresearch.com/delete-account" />
        <meta name="robots" content="noindex, follow" />
      </Helmet>

      {renderWarningModal()}

      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              Account Deletion Request
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We're sorry to see you go. Please help us understand your decision and choose how you'd like us to handle your data.
            </p>
          </motion.div>

          {!isSubmitted ? (
            <>
              {renderStepIndicator()}
              {/* Steps 1-4: questions */}
              {currentStep < QUESTIONS.length ? (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    className="max-w-2xl mx-auto"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 border border-gray-100">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-600 font-semibold">
                            {currentStep + 1}
                          </div>
                          <h2 className="text-xl font-bold text-gray-900">
                            {currentQuestion.question}
                          </h2>
                        </div>
                        {currentStep > 0 && (
                          <button
                            onClick={handleGoBack}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            <FiChevronLeft className="w-5 h-5" />
                          </button>
                        )}
                      </div>

                      <div className="space-y-3">
                        {currentQuestion.options.map((option) => (
                          <button
                            key={option.id}
                            onClick={() => handleOptionSelect(option)}
                            className="w-full text-left p-4 rounded-lg border border-gray-200 hover:border-red-300 hover:bg-red-50 transition-all duration-200 group"
                          >
                            <div className="flex items-start gap-3">
                              <div className="flex items-center justify-center w-5 h-5 mt-0.5 rounded-full border border-gray-300 group-hover:border-red-400">
                                {answers[currentQuestion.id] === option.value && (
                                  <div className="w-2.5 h-2.5 rounded-full bg-red-600" />
                                )}
                              </div>
                              <div className="flex-1">
                                <div className="font-medium text-gray-900 group-hover:text-red-700">
                                  {option.label}
                                </div>
                                {option.description && (
                                  <div className="mt-1 text-sm text-gray-500">
                                    {option.description}
                                  </div>
                                )}
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              ) : currentStep === QUESTIONS.length ? (
                // Step 5: feedback + submit form
                <motion.div
                  className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-6 md:p-8 border border-green-100"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h2 className="text-2xl font-bold text-center mb-6 text-green-700">Final Step: Feedback & Submit</h2>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Please share any feedback or suggestions to help us improve:
                    </label>
                    <textarea
                      value={additionalReason}
                      onChange={e => setAdditionalReason(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white placeholder-gray-400"
                      rows="3"
                      placeholder="Type your feedback here..."
                    />
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white placeholder-gray-400"
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Password *
                      </label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white placeholder-gray-400"
                        placeholder="Enter your password to confirm"
                        required
                      />
                    </div>
                    <div className="flex gap-3 pt-4">
                      <button
                        type="button"
                        onClick={handleGoBack}
                        className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                      >
                        <FiChevronLeft className="w-4 h-4" />
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? 'Processing...' : 'Submit Request'}
                      </button>
                    </div>
                  </form>
                </motion.div>
              ) : (
                renderSuccessScreen()
              )}
            </>
          ) : (
            renderSuccessScreen()
          )}

          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="grid md:grid-cols-3 gap-6 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-red-600 font-bold text-lg mb-1">Secure Process</div>
                <div className="text-sm text-gray-600">Encrypted and GDPR compliant</div>
              </div>
              <div className="text-center">
                <div className="text-red-600 font-bold text-lg mb-1">30-Day Window</div>
                <div className="text-sm text-gray-600">Cancel anytime before final deletion</div>
              </div>
              <div className="text-center">
                <div className="text-red-600 font-bold text-lg mb-1">Support Available</div>
                <div className="text-sm text-gray-600">We're here to help if needed</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeleteAccount;