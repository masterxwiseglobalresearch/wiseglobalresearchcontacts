import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Trans } from '../i18nShim';
import { motion } from 'framer-motion';
import '../styles/headings.css';
import { toast } from 'react-toastify';
import {
  FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn, FaYoutube, FaWhatsapp, FaPhone
} from 'react-icons/fa';
// ...existing imports...
import Layout from '../components/Layout';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.12 } },
};

function ClientPanel() {
  const [clientId, setClientId] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ clientId: '', password: '' });

  const [loginError, setLoginError] = useState('');
  const [showSupport, setShowSupport] = useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = { clientId: '', password: '' };
    if (!clientId) newErrors.clientId = 'Client ID is required';
    if (!password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    if (!newErrors.clientId && !newErrors.password) {
      // Dummy credential check
      const validId = 'client123';
      const validPass = 'password123';
      if (clientId !== validId || password !== validPass) {
        setLoginError('Wrong ID or password. Please re-enter.');
        return;
      }
      toast.success('Form submitted successfully', { position: 'top-center' });
      setClientId('');
      setPassword('');
    }
  };

  return (
    <Layout>
      <Helmet>
        <title>Client Panel — Wise Global</title>
        <meta name="description" content="Client login panel for Wise Global clients. Access your account, reports, and subscription details." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <motion.section
        className="relative py-8 sm:py-10 lg:py-14 px-4 sm:px-6"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <div className="container max-w-lg mx-auto">
          <motion.div
            className="rounded-2xl p-6 sm:p-8 shadow-2xl text-black"
            style={{
              background: '#fff',
              border: '2px solid #6366f1',
              boxShadow: '0 8px 32px 0 rgba(60,60,120,0.18), 0 1.5px 8px 0 rgba(99,102,241,0.10)'
            }}
            variants={staggerContainer}
          >
            <motion.h1
              className="text-3xl sm:text-4xl font-extrabold text-center text-indigo-700 mb-4"
              variants={fadeIn}
            >
              <Trans i18nKey="pages.ClientPanel.coming-soon">Coming Soon</Trans>
            </motion.h1>

            <motion.p className="text-center text-black/80 mb-6" variants={fadeIn}>
              <Trans i18nKey="pages.ClientPanel.enter-your-client-id-and-password-to-acc-1">Enter your Client ID and password to access your panel.</Trans>
            </motion.p>

            <motion.form
              onSubmit={handleSubmit}
              className="space-y-5"
              variants={staggerContainer}
            >
              <div>
                <label htmlFor="clientId" className="block text-sm font-medium mb-1 text-black">
                  <Trans i18nKey="pages.ClientPanel.client-id">Client ID</Trans>
                </label>
                <input
                  id="clientId"
                  type="text"
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  placeholder="Enter your Client ID"
                  className="w-full px-4 py-2 rounded-md bg-white border border-indigo-300 text-black placeholder-gray-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                />
                {errors.clientId && (
                  <p className="text-red-600 text-sm mt-1" role="alert">{errors.clientId}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-1 text-black">
                  <Trans i18nKey="pages.ClientPanel.password">Password</Trans>
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-2 rounded-md bg-white border border-indigo-300 text-black placeholder-gray-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                />
                {errors.password && (
                  <p className="text-red-600 text-sm mt-1" role="alert">{errors.password}</p>
                )}
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="btn-purple w-full py-2 font-semibold"
              >
                <Trans i18nKey="pages.ClientPanel.login">Login</Trans>
              </motion.button>
            </motion.form>

            {/* Error Popup */}
            {loginError && (
              <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-white text-black p-6 rounded-2xl shadow-2xl max-w-sm w-[90%] border-2 border-indigo-500 text-center"
                >
                  <p className="mb-4">{loginError}</p>
                  <button
                    onClick={() => setLoginError('')}
                    className="btn-purple px-4 py-2"
                  >
                    <Trans i18nKey="pages.ClientPanel.ok">OK</Trans>
                  </button>
                </motion.div>
              </div>
            )}

            {/* Support Popup */}
            {showSupport && (
              <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white p-6 rounded-2xl shadow-2xl text-center text-black max-w-sm w-[90%] border-2 border-indigo-500"
                >
                  <h3 className="text-xl font-bold mb-4 text-indigo-700"><Trans i18nKey="pages.ClientPanel.contact-support">Contact Support</Trans></h3>
                  <div className="flex justify-center gap-4 mb-4 text-2xl">
                    <a href="https://www.facebook.com/people/MRXads/61576945584326/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600" aria-label="Facebook">
                      <FaFacebookF />
                    </a>
                    <a href="https://www.instagram.com/mrx_ads?igsh=YndwZjQ0NmF3bGl0" target="_blank" rel="noopener noreferrer" className="hover:text-pink-600" aria-label="Instagram">
                      <FaInstagram />
                    </a>
                    <a href="https://x.com/Durgesh31971176" target="_blank" rel="noopener noreferrer" className="hover:text-sky-500" aria-label="Twitter/X">
                      <FaTwitter />
                    </a>
                    <a href="https://www.linkedin.com/in/durgesh-rathor-85b529190/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-700" aria-label="LinkedIn">
                      <FaLinkedinIn />
                    </a>
                    <a href="https://www.youtube.com/@Durgesh_122" target="_blank" rel="noopener noreferrer" className="hover:text-red-600" aria-label="YouTube">
                      <FaYoutube />
                    </a>
                    <a href="https://wa.me/+917631657827" target="_blank" rel="noopener noreferrer" className="hover:text-green-600" aria-label="WhatsApp">
                      <FaWhatsapp />
                    </a>
                    <a href="tel:+917631657827" className="hover:text-yellow-600" aria-label="Phone">
                      <FaPhone />
                    </a>
                  </div>
                  <button
                    onClick={() => setShowSupport(false)}
                    className="btn-purple px-4 py-2"
                  >
                    <Trans i18nKey="pages.ClientPanel.close">Close</Trans>
                  </button>
                </motion.div>
              </div>
            )}

            <motion.div className="text-sm text-center mt-6 text-black/80" variants={fadeIn}>
              <p>
                <Trans i18nKey="pages.ClientPanel.don-t-have-an-account">Don't have an account?</Trans>
                <button type="button" onClick={() => setShowSupport(true)} className="ml-2 underline text-indigo-600 hover:text-indigo-700">
                  <Trans i18nKey="pages.ClientPanel.contact-support">Contact Support</Trans>
                </button>
              </p>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>
    </Layout>
  );
}

export default ClientPanel;
