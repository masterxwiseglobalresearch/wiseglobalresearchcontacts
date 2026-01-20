import React, { useState } from 'react';
import { db } from '../firebase';
import { ref, push } from 'firebase/database';


import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

export default function AccessibilityFeedback() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    pageUrl: '',
    type: 'issue', // issue | suggestion | question
    severity: 'medium', // low | medium | high
    device: 'desktop', // desktop | mobile | tablet
    browser: '',
    assistiveTech: '',
    message: '',
    consent: true,
  });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submissionId, setSubmissionId] = useState(null);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Please provide your name';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.message.trim()) e.message = 'Describe the accessibility issue or suggestion';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const submission = {
        name: form.name.trim(),
        email: form.email.trim(),
        subject: form.subject.trim() || null,
        pageUrl: form.pageUrl.trim() || (typeof window !== 'undefined' ? window.location.href : ''),
        type: form.type,
        severity: form.severity,
        device: form.device,
        browser: form.browser.trim() || null,
        assistiveTech: form.assistiveTech.trim() || null,
        message: form.message.trim(),
        consent: !!form.consent,
        timestamp: Date.now(),
      };
      let submissionKey = null;
      try {
        const result = await push(ref(db, 'accessibilityFeedback'), submission);
        submissionKey = result && result.key ? result.key : null;
        setSubmissionId(submissionKey);
        setSubmitted(true);
      } catch (dbErr) {
        console.warn('AccessibilityFeedback: RTDB push failed', dbErr);
        if (dbErr && (dbErr.code === 'PERMISSION_DENIED' || /permission_denied/i.test(dbErr.message || ''))) {
          // Email fallback so team receives the feedback
          try {
            const notifyPayload = {
              name: submission.name || form.name,
              email: submission.email || form.email,
              mobile: '',
              city: '',
              interest: 'Accessibility Feedback (fallback)',
              message: `Type: ${form.type}\nSeverity: ${form.severity}\nDevice: ${form.device}\nPage: ${form.pageUrl || (typeof window !== 'undefined' ? window.location.href : '')}\n\n${form.message}`,
              source: 'AccessibilityFeedback-fallback',
              to: 'support@wiseglobalresearch.com'
            };
            const isLocalhost = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
            const port = (typeof window !== 'undefined' && window.location.port) ? window.location.port : '';
            const useRelative = (process.env.REACT_APP_USE_LOCAL_SEND_EMAIL === 'true') || (isLocalhost && port === '3001');
            const endpoint = useRelative ? '/send-email' : 'https://wise-globle-research-2.onrender.com/send-email';
            await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(notifyPayload) });
            setSubmitted(true);
          } catch (fallbackErr) {
            console.warn('Accessibility feedback fallback also failed', fallbackErr);
            setErrors({ submit: 'Failed to submit. Please try again later.' });
          }
        } else {
          setErrors({ submit: 'Failed to submit. Please try again.' });
        }
      }
      // optional: reset form
      setForm({
        name: '',
        email: '',
        subject: '',
        pageUrl: '',
        type: 'issue',
        severity: 'medium',
        device: 'desktop',
        browser: '',
        assistiveTech: '',
        message: '',
        consent: true,
      });
      try{
        if (window.analyticsPush) {
          window.analyticsPush('accessibility_feedback', { submissionId: submissionKey });
        }
      }catch(e){}
      // Best-effort: notify server to send an email copy to the team (non-blocking)
      (async () => {
        try {
          const notifyPayload = {
            name: submission.name || form.name,
            email: submission.email || form.email,
            mobile: '',
            city: '',
            interest: 'Accessibility Feedback',
            message: `Type: ${form.type}\nSeverity: ${form.severity}\nDevice: ${form.device}\nPage: ${form.pageUrl || (typeof window !== 'undefined' ? window.location.href : '')}\n\n${form.message}`,
            source: 'AccessibilityFeedback',
            to: 'support@wiseglobalresearch.com'
          };
            try {
              const isLocalhost = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
              const port = (typeof window !== 'undefined' && window.location.port) ? window.location.port : '';
              const useRelative = (process.env.REACT_APP_USE_LOCAL_SEND_EMAIL === 'true') || (isLocalhost && port === '3001');
              const endpoint = useRelative ? '/send-email' : 'https://wise-globle-research-2.onrender.com/send-email';
              await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(notifyPayload)
              });
            } catch (e) {
              throw e;
            }
        } catch (err) {
          // don't surface to user; log for debugging
          console.warn('Accessibility feedback: failed to notify server', err);
        }
      })();
    } catch (err) {
      setErrors({ submit: 'Failed to submit. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <>
        <Helmet>
          <title>Accessibility Feedback - Wise Global Research</title>
          <meta name="description" content="Accessibility Feedback page — Wise Global Research." />
          <link rel="canonical" href="https://wiseglobalresearch.com/accessibilityfeedback" />
        </Helmet>
        <motion.section className="relative py-8 sm:py-10 lg:py-14 px-4 sm:px-6" initial="hidden" animate="visible" variants={staggerContainer}>
          <div className="container max-w-4xl mx-auto relative z-10">
            <motion.div className="mb-6 rounded-2xl p-4 sm:p-6" style={{ background: '#fff', border: '2px solid #6366f1', boxShadow: '0 8px 32px 0 rgba(60,60,120,0.18), 0 1.5px 8px 0 rgba(99,102,241,0.10)' }}>
              <div style={{ color: '#0b1220' }}>
                  <div className="flex items-center justify-center p-4">
                    <div role="status" aria-live="polite" className="w-full max-w-md p-6 rounded-xl bg-green-900/30 border border-green-600 backdrop-blur">
                    <h1 className="text-2xl font-semibold mb-2 text-gray-900">Thank you</h1>
                    <p className="text-gray-700">Your accessibility feedback has been recorded. We will review and address it as soon as possible.</p>
                    {submissionId && (
                      <p className="text-sm text-gray-700 mt-2">Submission ID: <span className="font-mono">{submissionId}</span></p>
                    )}
                    <a href="/" className="inline-block mt-4 px-4 py-2 rounded bg-green-700 text-white hover:bg-green-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400" aria-label="Go home">Go home</a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.section>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Accessibility Feedback - Wise Global Research</title>
        <meta name="description" content="Accessibility Feedback page — Wise Global Research." />
        <link rel="canonical" href="https://wiseglobalresearch.com/accessibilityfeedback" />
      </Helmet>
      <motion.section className="relative py-8 sm:py-10 lg:py-14 px-4 sm:px-6" initial="hidden" animate="visible" variants={staggerContainer}>
        <div className="container max-w-4xl mx-auto relative z-10">
          <motion.div className="mb-6 rounded-2xl p-4 sm:p-6" style={{ background: '#fff', border: '2px solid #6366f1', boxShadow: '0 8px 32px 0 rgba(60,60,120,0.18), 0 1.5px 8px 0 rgba(99,102,241,0.10)' }}>
            <div style={{ color: '#0b1220' }}>
              <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center" style={{ color: '#6366f1' }}>Accessibility Feedback</h1>
              <div className="space-y-5 text-sm sm:text-base leading-relaxed">
                <p className="text-gray-700 text-center mt-1">Report barriers or suggest improvements. Fields marked * are required.</p>

                {errors.submit && <div className="mt-3 p-3 rounded bg-red-900/40 border border-red-600 text-sm text-white">{errors.submit}</div>}

                <form onSubmit={onSubmit} noValidate className="w-full max-w-2xl mx-auto">
                  <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block mb-1 text-gray-900">Name *</label>
                      <input id="name" name="name" type="text" value={form.name} onChange={onChange} className="w-full rounded-md px-3 py-3 text-gray-900 placeholder-gray-600 border border-gray-300" aria-invalid={!!errors.name} aria-describedby={errors.name ? 'name-err' : undefined} />
                      {errors.name && <div id="name-err" className="text-red-600 text-sm mt-1">{errors.name}</div>}
                    </div>
                    <div>
                      <label htmlFor="email" className="block mb-1 text-gray-900">Email *</label>
                      <input id="email" name="email" type="email" value={form.email} onChange={onChange} className="w-full rounded-md px-3 py-3 text-gray-900 placeholder-gray-600 border border-gray-300" aria-invalid={!!errors.email} aria-describedby={errors.email ? 'email-err' : undefined} />
                      {errors.email && <div id="email-err" className="text-red-600 text-sm mt-1">{errors.email}</div>}
                    </div>

                    <div>
                      <label htmlFor="subject" className="block mb-1 text-gray-900">Subject</label>
                      <input id="subject" name="subject" type="text" value={form.subject} onChange={onChange} className="w-full rounded-md px-3 py-3 text-gray-900 placeholder-gray-600 border border-gray-300" />
                    </div>
                    <div>
                      <label htmlFor="pageUrl" className="block mb-1 text-gray-900">Page URL</label>
                      <input id="pageUrl" name="pageUrl" type="url" value={form.pageUrl} onChange={onChange} placeholder="https://example.com/page" className="w-full rounded-md px-3 py-3 text-gray-900 placeholder-gray-600 border border-gray-300" />
                    </div>

                    <div>
                      <label htmlFor="type" className="block mb-1 text-gray-900">Type</label>
                      <select id="type" name="type" value={form.type} onChange={onChange} className="w-full rounded-md px-3 py-3 text-gray-900 border border-gray-300">
                        <option value="issue">Issue</option>
                        <option value="suggestion">Suggestion</option>
                        <option value="question">Question</option>
                      </select>
                    </div>
                    <div>
                      <label className="block mb-1 text-gray-900">Severity</label>
                      <div className="flex flex-col sm:flex-row gap-2">
                        {['low','medium','high'].map((s) => (
                          <label key={s} className={`inline-flex items-center gap-2 text-sm px-3 py-2 rounded border ${form.severity===s ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'}`}>
                            <input type="radio" name="severity" value={s} checked={form.severity===s} onChange={onChange} className="h-4 w-4" />
                            <span className="capitalize">{s}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="device" className="block mb-1 text-gray-900">Device</label>
                      <select id="device" name="device" value={form.device} onChange={onChange} className="w-full rounded-md px-3 py-3 text-gray-900 border border-gray-300">
                        <option value="desktop">Desktop</option>
                        <option value="mobile">Mobile</option>
                        <option value="tablet">Tablet</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="browser" className="block mb-1 text-gray-900">Browser</label>
                      <input id="browser" name="browser" type="text" value={form.browser} onChange={onChange} placeholder="e.g., Chrome 126" className="w-full rounded-md px-3 py-3 text-gray-900 placeholder-gray-600 border border-gray-300" />
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="assistiveTech" className="block mb-1 text-gray-900">Assistive technology (if any)</label>
                      <input id="assistiveTech" name="assistiveTech" type="text" value={form.assistiveTech} onChange={onChange} placeholder="e.g., NVDA, VoiceOver, keyboard-only" className="w-full rounded-md px-3 py-3 text-gray-900 placeholder-gray-600 border border-gray-300" />
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="message" className="block mb-1 text-gray-900">Issue or suggestion *</label>
                      <textarea id="message" name="message" rows={6} value={form.message} onChange={onChange} className="w-full rounded-md px-3 py-3 text-gray-900 placeholder-gray-600 border border-gray-300" aria-invalid={!!errors.message} aria-describedby={errors.message ? 'msg-err' : undefined} />
                      {errors.message && <div id="msg-err" className="text-red-600 text-sm mt-1">{errors.message}</div>}
                    </div>

                    <div className="sm:col-span-2">
                      <label className="inline-flex items-center gap-2 text-sm text-gray-900 p-2 rounded">
                        <input type="checkbox" name="consent" checked={!!form.consent} onChange={(e)=> setForm((f)=>({...f, consent: e.target.checked}))} className="h-5 w-5" />
                        <span>I agree to be contacted about my feedback</span>
                      </label>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-col sm:flex-row flex-wrap gap-3 justify-center">
                    <button type="submit" disabled={submitting} className="w-full sm:w-auto px-6 py-3 rounded bg-green-600 hover:bg-green-500 disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400 text-white">
                      {submitting ? 'Submitting…' : 'Submit'}
                    </button>
                    <a href="/" className="w-full sm:w-auto px-6 py-3 rounded bg-green-700 text-white hover:bg-green-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400 text-center" aria-label="Cancel and return to home">Cancel</a>
                  </div>
                </form>
              </div>
            </div>
            </motion.div>
          </div>
        </motion.section>
    </>
  );
}
