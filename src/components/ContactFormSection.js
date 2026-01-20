
import React from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { ref, push } from 'firebase/database';
import { toast } from 'react-toastify';
import { db } from '../firebase';
import { itemVariants } from '../utils/animationVariants';
import blog01 from '../assets/images/blog01.png';

const ContactForm = ({ contactFormRef }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [submitting, setSubmitting] = React.useState(false);
  const [honeypot, setHoneypot] = React.useState('');
  const [sendError, setSendError] = React.useState(null);

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const formData = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        interest: data.interest,
        message: data.message,
        timestamp: Date.now(),
        honeypot: honeypot || ''
      };
      // Try to push to RTDB. If PERMISSION_DENIED occurs, fallback to server email copy.
      try {
        await push(ref(db, 'homePageContactSubmissions'), formData);
      } catch (dbErr) {
        console.warn('ContactForm: RTDB push failed:', dbErr && dbErr.code ? dbErr.code : dbErr);
        // Best-effort fallback: POST to /send-email whenever a DB push fails
        try {
          const payload = {
            name: formData.name,
            email: formData.email || '',
            mobile: formData.phone || '',
            city: '',
            interest: formData.interest || 'Contact Form',
            message: formData.message || '',
            source: 'ContactFormSection-fallback',
            pageUrl: typeof window !== 'undefined' ? window.location.href : ''
          };
          // Only use relative '/send-email' when running from API server port 3001
          // or when explicitly enabled via REACT_APP_USE_LOCAL_SEND_EMAIL=true.
          const isLocalhost = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
          const port = (typeof window !== 'undefined' && window.location.port) ? window.location.port : '';
          const useRelative = (process.env.REACT_APP_USE_LOCAL_SEND_EMAIL === 'true') || (isLocalhost && port === '3001');
          const endpoint = useRelative ? '/send-email' : 'https://wise-globle-research-2.onrender.com/send-email';
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 20000); // increased timeout to 20s for cold starts
          try {
            const r = await fetch(endpoint, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload),
              signal: controller.signal,
            });
            clearTimeout(timeout);
            if (!r.ok) {
              let body = null;
              try { body = await r.json(); } catch (_) { body = await r.text().catch(() => null); }
              console.warn('ContactForm: fallback /send-email returned non-ok', r.status, body);
              toast.error('We could not save your submission to the database and email fallback failed. Please try again or contact support.', { position: 'top-center' });
            } else {
              toast.success('Form submitted (email fallback used). We will contact you soon.', { position: 'top-center' });
            }
          } catch (fetchErr) {
            // Log detailed error info to help triage AbortError vs network/CORS
            try {
              console.warn('ContactForm: fallback fetch to /send-email failed', {
                message: fetchErr && fetchErr.message,
                name: fetchErr && fetchErr.name,
                stack: fetchErr && fetchErr.stack,
                endpoint
              });
            } catch (logErr) {
              console.warn('ContactForm: fetchErr logging failed', logErr);
            }
            toast.error('We could not save your submission to the database and email fallback failed due to network. Please try again later.', { position: 'top-center' });
          }
        } catch (fallbackErr) {
          console.error('ContactForm: unexpected error during fallback', fallbackErr);
          toast.error('Submission failed. Please try again later.', { position: 'top-center' });
        }
      }
      // Clear any previous send errors on new attempt
      setSendError(null);

      // Google Ads Conversion Tracking
      // Push analytics event (works with GTM dataLayer helper)
      try {
        if (window.analyticsPush) {
          window.analyticsPush('contact_form_submit', { formId: 'contactForm' });
        }
      } catch (e) { /* ignore */ }

  toast.success('Form submitted successfully! We will contact you soon.', { position: 'top-center' });
  reset();
  // Send an email copy to server (best-effort, non-blocking)
  async function sendEmailCopy() {
    // Endpoint candidates in preferred order. Try each until one succeeds.
    const endpoints = [];
    const canonicalApis = [
      'https://wise-globle-research-2.onrender.com',
      'https://wiseglobalresearch.com'
    ];
  // Only use the relative endpoint when the browser is actually served from the
  // backend port (3001). Many dev setups run CRA on :3000 while the API runs
  // on :3001; calling a relative '/send-email' from :3000 will hit the CRA
  // static server and often return 500. To avoid noisy errors, require port
  // 3001 for the relative endpoint. If you intentionally want to test
  // local relative proxying, run the frontend on port 3001 or set
  // REACT_APP_USE_LOCAL_SEND_EMAIL=true at build time and adjust the check.
  const isLocalhost = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
  const port = (typeof window !== 'undefined' && window.location.port) ? window.location.port : '';
  const useRelative = isLocalhost && port === '3001';
  if (useRelative) endpoints.push('/send-email');
    // prefer Render then canonical production
    endpoints.push(`${canonicalApis[0].replace(/\/$/, '')}/send-email`);
    endpoints.push(`${canonicalApis[1].replace(/\/$/, '')}/send-email`);

    const payload = {
      name: formData.name,
      email: formData.email || '',
      mobile: formData.phone || '',
      city: '',
      interest: formData.interest || 'Contact Form',
      message: formData.message || '',
      source: 'ContactFormSection',
      pageUrl: (typeof window !== 'undefined' && window.location.href) || ''
    };

    const doFetchWithTimeout = async (url) => {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 20000); // 20s timeout
      try {
        const r = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          signal: controller.signal,
        });
        return r;
      } catch (err) {
        // surface richer debug data to console so we can see if this was a timeout (AbortError) or network/CORS
        try {
          console.warn('ContactForm: doFetchWithTimeout error for', url, {
            name: err && err.name,
            message: err && err.message,
            stack: err && err.stack,
          });
        } catch (logErr) {
          console.warn('ContactForm: error while logging fetch error', logErr);
        }
        throw err;
      } finally {
        clearTimeout(timeout);
      }
    };

    let lastError = null;
    let sent = false;
    for (const url of endpoints) {
      try {
        console.debug('ContactForm: attempting send-email ->', url);
        const res = await doFetchWithTimeout(url);
        // If we got a truthy response object, interpret status
        if (res && res.ok) {
          let body = null;
          try { body = await res.json(); } catch (_) { body = await res.text().catch(() => null); }
          console.debug('ContactForm: email copy sent via', url, body);
          sent = true;
          break;
        } else {
          // Non-2xx response - record and try next
          let body = null;
          try { body = await res.json(); } catch (_) { body = await res.text().catch(() => null); }
          console.warn('ContactForm: send-email returned non-OK from', url, res && res.status, body);
          lastError = `non-ok ${res && res.status}`;
          // continue to next endpoint
        }
      } catch (err) {
        // Network/CORS/timeout errors surface here as TypeError or DOMException
        console.warn('ContactForm: send-email attempt failed for', url, err && err.message ? err.message : err);
        lastError = err && err.message ? err.message : String(err);
        // try next endpoint instead of throwing immediately
      }
    }

    if (!sent) {
      console.warn('ContactForm: all send-email endpoints failed. Last error:', lastError);
      // Only surface a user-visible error if all endpoints failed
      toast.error('Could not send email copy (all endpoints failed). Your submission may still have been received; if not, please contact support.', { position: 'top-center' });
      setSendError(`Email copy failed: ${lastError}`);
    }
  }
  // Avoid calling remote /send-email endpoints while developing on localhost:3000
  // to prevent noisy CORS/network errors in the browser console. Only run
  // the email-copy when the site is running on a production-like host.
  try {
    const hostname = (typeof window !== 'undefined' && window.location.hostname) || '';
    const isDevLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';
    if (isDevLocalhost) {
      // In local development, still run the email-copy fallback but avoid using
      // a relative '/send-email' endpoint (which hits CRA :3000 and causes 500).
      // sendEmailCopy already only adds the relative endpoint when the page is
      // actually served from port 3001. So calling it here will attempt the
      // Render/production absolute endpoints and allow local testing without
      // noisy relative errors.
      console.debug('ContactForm: running sendEmailCopy in localhost dev (using absolute endpoints)');
      sendEmailCopy();
    } else {
      sendEmailCopy();
    }
  } catch (e) {
    // If anything unexpectedly fails deciding environment, skip the send to avoid blocking the UX
    console.warn('ContactForm: error deciding whether to send email copy (skipping):', e && e.message ? e.message : e);
  }
    } catch (error) {
      console.error('Error submitting form:', error);
      const errorMessage = error.message ? error.message : String(error);
      setSendError(`Form submission failed: ${errorMessage}`);
      toast.error(`Failed to submit form: ${errorMessage}`, { position: 'top-center' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      ref={contactFormRef}
      className="py-12 px-4 sm:px-6"
    >
      <div className="container max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-8 md:gap-12">
        {/* Image section */}
        <div className="w-full md:w-1/2 flex justify-center mb-8 md:mb-0">
          <img
            src={blog01}
            alt="Contact Us"
            className="rounded-xl shadow-lg max-h-96 object-cover border-2 border-indigo-200 bg-white"
          />
        </div>
        {/* Form section */}
        <div className="w-full md:w-1/2">
          <div className="rounded-2xl overflow-hidden shadow-2xl bg-white" style={{ border: '2px solid #6366f1', color: '#000' }}>
            <div className="px-6 py-8">
                <motion.h2
                className="text-3xl sm:text-4xl font-extrabold text-center mb-8 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-indigo-800"
                variants={itemVariants}
                id="contact-form-heading"
              >
                Get in Touch
              </motion.h2>
              {/* Visible error banner for send/submit errors */}
              {sendError && (
                <div role="alert" className="mb-4 p-3 rounded border bg-red-50 border-red-200 text-red-800">
                  <div className="flex items-start justify-between gap-3">
                    <div className="text-sm whitespace-pre-wrap">{sendError}</div>
                    <button
                      type="button"
                      onClick={() => setSendError(null)}
                      className="text-sm underline ml-2"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              )}
              <form
                id="contactForm"
                data-gtm-event="contact_form_submit"
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-5 sm:space-y-7"
                aria-labelledby="contact-form-heading"
              >
                <hr className="mb-6 border-t border-indigo-200/60" />
                {/* Honeypot field for bots */}
                <input
                  id="contact-honeypot"
                  type="text"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  name="honeypot"
                  autoComplete="off"
                  tabIndex="-1"
                  aria-hidden="true"
                  className="hidden"
                />
                <div>
                  <label className="block text-sm font-semibold mb-1" htmlFor="name" style={{ color: '#000' }}>Name</label>
                  <input
                    id="name"
                    {...register('name', {
                      required: 'Name is required',
                      minLength: { value: 2, message: 'Name must be at least 2 characters' },
                    })}
                    type="text"
                    autoComplete="name"
                      className={`w-full px-4 py-2 rounded-lg border-2 border-indigo-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-300 bg-white placeholder-gray-400 ${errors.name ? 'border-red-500' : ''}`}
                    style={{ color: '#000' }}
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? 'name-error' : undefined}
                  />
                  {errors.name && <p id="name-error" className="text-red-500 text-xs sm:text-sm mt-1">{errors.name.message}</p>}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                      <label className="block text-sm font-semibold mb-1" htmlFor="email" style={{ color: '#000' }}>Email</label>
                    <input
                      id="email"
                      {...register('email', {
                        required: 'Email is required',
                        pattern: {
                          value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                          message: 'Invalid email address',
                        },
                      })}
                      type="email"
                      autoComplete="email"
                      className={`w-full px-4 py-2 rounded-lg border-2 border-indigo-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-300 bg-white placeholder-gray-400 ${errors.email ? 'border-red-500' : ''}`}
                      style={{ color: '#000' }}
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? 'email-error' : undefined}
                    />
                    {errors.email && <p id="email-error" className="text-red-500 text-xs sm:text-sm mt-1">{errors.email.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1" htmlFor="phone" style={{ color: '#000' }}>Phone</label>
                    <input
                      id="phone"
                      {...register('phone', {
                        required: 'Phone number is required',
                        pattern: {
                          value: /^[6-9][0-9]{9}$/,
                          message: 'Phone number must be 10 digits starting with 6, 7, 8, or 9',
                        },
                      })}
                      type="tel"
                      autoComplete="tel"
                      className={`w-full px-4 py-2 rounded-lg border-2 border-indigo-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-300 bg-white placeholder-gray-400 ${errors.phone ? 'border-red-500' : ''}`}
                      style={{ color: '#000' }}
                      aria-invalid={!!errors.phone}
                      aria-describedby={errors.phone ? 'phone-error' : undefined}
                    />
                    {errors.phone && <p id="phone-error" className="text-red-500 text-xs sm:text-sm mt-1">{errors.phone.message}</p>}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1" htmlFor="interest" style={{ color: '#000' }}>Area of Interest</label>
                  <select
                    id="interest"
                    {...register('interest', { required: 'Please select an area of interest' })}
                    className={`w-full px-4 py-2 rounded-lg border-2 border-indigo-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-300 bg-white ${errors.interest ? 'border-red-500' : ''}`}
                    style={{ color: '#000' }}
                    aria-invalid={!!errors.interest}
                    aria-describedby={errors.interest ? 'interest-error' : undefined}
                  >
                    <option value="" className="text-gray-400">Select an option</option>
                    <option value="equity" className="text-gray-900">Equity</option>
                    <option value="derivatives" className="text-gray-900">Derivatives</option>
                    <option value="commodity" className="text-gray-900">Commodity</option>
                  </select>
                  {errors.interest && <p id="interest-error" className="text-red-500 text-xs sm:text-sm mt-1">{errors.interest.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1" htmlFor="message" style={{ color: '#000' }}>Message</label>
                  <textarea
                    id="message"
                    {...register('message', {
                      required: 'Message is required',
                      minLength: { value: 10, message: 'Message must be at least 10 characters' },
                    })}
                    rows={4}
                    autoComplete="off"
                    className={`w-full px-4 py-2 rounded-lg border-2 border-indigo-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-300 bg-white placeholder-gray-400 ${errors.message ? 'border-red-500' : ''}`}
                    style={{ color: '#000' }}
                    aria-invalid={!!errors.message}
                    aria-describedby={errors.message ? 'message-error' : undefined}
                  ></textarea>
                  {errors.message && <p id="message-error" className="text-red-500 text-xs sm:text-sm mt-1">{errors.message.message}</p>}
                </div>
                <motion.button
                  type="submit"
                  disabled={submitting}
                  className={`shine-hover w-full py-3 rounded-lg shadow-md text-base font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${submitting ? 'bg-indigo-300 cursor-not-allowed' : 'bg-gradient-to-r from-indigo-600 to-indigo-800'} text-white`}
                  whileHover={{ scale: submitting ? 1 : 1.02, rotateY: submitting ? 0 : 10 }}
                  whileTap={{ scale: submitting ? 1 : 0.98 }}
                >
                  {submitting ? 'Submitting...' : 'Submit'}
                </motion.button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;