import React, { useState, useEffect, useRef } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ref, push } from 'firebase/database';
import { db } from '../firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { toast } from 'react-toastify';

const LeadsForm = () => {
  // Show modal-only page centered like Contact page
  const [isOpen, setIsOpen] = useState(true);
  const [form, setForm] = useState({ name: '', mobile: '', address: '', email: '', message: '' });
  // Auto-fill form with user details if logged in
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setForm((prev) => ({
          ...prev,
          name: user.displayName || prev.name,
          email: user.email || prev.email,
          mobile: user.phoneNumber || prev.mobile,
        }));
      }
    });
    return () => unsubscribe();
  }, []);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  // Only allow closing after successful submit. Do not expose a public close.
  const modalRef = useRef(null);

  const validateField = (name, value) => {
    let error = '';
    if (name === 'name' && !value.trim()) {
      error = 'Name is required';
    } else if (name === 'mobile') {
      if (!value.trim()) {
        error = 'Mobile is required';
      } else if (!/^[6-9]\d{9}$/.test(value.trim())) {
        error = 'Valid Indian 10-digit mobile required';
      }
    } else if (name === 'address' && !value.trim()) {
      error = 'Address is required';
    } else if (name === 'email' && value.trim() && !/^\S+@\S+\.\S+$/.test(value)) {
      error = 'Invalid email';
    } else if (name === 'message' && !value.trim()) {
      error = 'Message is required';
    }
    return error;
  };

  // (Fixed) Only one onChange handler below
  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  // Validation function
  const validate = () => {
    const newErrors = {};
    Object.keys(form).forEach((key) => {
      const error = validateField(key, form[key]);
      if (error) newErrors[key] = error;
    });
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsSubmitting(false);
      return;
    }

    // Track form submission event
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'form_submission', {
        event_category: 'LeadsForm',
        event_label: 'Form Submitted',
      });
    }

    // Make submission optimistic / non-blocking so UI responds immediately.
    const data = {
      name: String(form.name || ''),
      phone: String(form.mobile || ''),
      address: String(form.address || ''),
      email: String(form.email || ''),
      message: String(form.message || ''),
      timestamp: Date.now(),
    };

    // Start Firebase push but don't await - handle errors in background
    try {
      push(ref(db, 'homeFormSubmissions'), data).catch(err => {
        console.error('Leedsfrom: firebase push failed (background):', err);
      });
    } catch (err) {
      console.error('Leedsfrom: push start failed:', err);
    }

    // Fire-and-forget email send; do not await so slow external endpoint won't block UX
    try {
      const isLocalhost = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
      const port = (typeof window !== 'undefined' && window.location.port) ? window.location.port : '';
      const useRelative = (process.env.REACT_APP_USE_LOCAL_SEND_EMAIL === 'true') || (isLocalhost && port === '3001');
      const endpoint = useRelative ? '/send-email' : 'https://wise-globle-research-2.onrender.com/send-email';
      // start fetch but don't await - log any failures
      try {
        fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: data.name,
            email: data.email || '',
            mobile: data.phone || '',
            city: data.address || '',
            interest: 'Leedsfrom Page',
            message: data.message || '',
            source: 'LeedsfromPage',
            // Ensure hemraj receives a copy even if server env differs
            to: 'hemraj@wiseglobalresearch.com'
          })
        }).catch(err => console.warn('Leedsfrom: send-email failed (background)', err));
      } catch (err) {
        console.warn('Leedsfrom: failed to start send-email', err);
      }
    } catch (err) {
      console.warn('Leedsfrom: email trigger failed', err);
    }

    // Trigger Google Ads conversion tracking
    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', 'conversion', {
        'send_to': 'AW-16988798063',
        'value': 1.0,
        'currency': 'INR'
      });
    } else {
      console.log('GTM/Google Ads tracking not available');
    }

    // Immediately update UI (optimistic success)
    toast.success('Form submitted', { position: 'top-center' });
    setForm({ name: '', mobile: '', address: '', email: '', message: '' });
    setSuccess(true);
    setIsSubmitting(false);

    // close after short delay
    setTimeout(() => {
      setIsOpen(false);
      navigate('/');
    }, 800);
  };

  useEffect(() => {
    // Hide ChatWidget.js root (by class or id)
    const chatWidgetRoots = [
      ...document.querySelectorAll('.chat-widget, #chat-widget, [data-chat-widget], .fixed.bottom-24.right-6.z-50, .fixed.inset-0.z-50')
    ];
    // Hide FloatingPayButton.js root (by class or id)
    const floatingPayRoots = [
      ...document.querySelectorAll('.floating-pay-btn, #floating-pay-btn, [data-floating-pay], .fixed.bottom-6.left-6.z-50')
    ];
    chatWidgetRoots.forEach(el => { el.dataset.prevDisplay = el.style.display; el.style.display = 'none'; });
    floatingPayRoots.forEach(el => { el.dataset.prevDisplay = el.style.display; el.style.display = 'none'; });
    if (success) {
      const t = setTimeout(() => setSuccess(false), 3000);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [success]);

  // Prevent navigation / page unload while modal is open
  useEffect(() => {
    if (!isOpen) return undefined;

    const onBeforeUnload = (e) => {
      const message = 'Please complete the form before leaving the page.';
      e.preventDefault();
      // Chrome requires returnValue set
      e.returnValue = message;
      return message;
    };

    // Prevent clicks on links (react-router Links are anchors)
    const onDocumentClick = (e) => {
      if (!isOpen) return;
      // If the click target or any parent is an anchor, prevent navigation
      let el = e.target;
      while (el && el !== document.body) {
        if (el.tagName === 'A') {
          e.preventDefault();
          e.stopPropagation();
          return;
        }
        el = el.parentElement;
      }
    };

    // Trap Escape key so user can't dismiss
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
      }
      // Focus trap handling for Tab navigation
      if (e.key === 'Tab' && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll('a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])');
        if (!focusable || focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    window.addEventListener('beforeunload', onBeforeUnload);
    document.addEventListener('click', onDocumentClick, true);
    document.addEventListener('keydown', onKeyDown, true);

    // Focus first input
    const focusFirst = () => {
      try {
        const el = modalRef.current && modalRef.current.querySelector('input, textarea, select, button');
        if (el) el.focus();
      } catch (e) {
        // ignore
      }
    };
    focusFirst();

    return () => {
      window.removeEventListener('beforeunload', onBeforeUnload);
      document.removeEventListener('click', onDocumentClick, true);
      document.removeEventListener('keydown', onKeyDown, true);
    };
  }, [isOpen]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  // Hide nav, footer, alert bar, pay button, plotting button, and floating buttons when this page is open
  useEffect(() => {
    if (!isOpen) return;
  // Hide nav and footer
  const navs = document.querySelectorAll('nav, header, .navbar, .main-nav');
  const footers = document.querySelectorAll('footer, .footer');
  // Hide MobileActionTray.js root (by class)
  const mobileActionTrays = document.querySelectorAll('.mobile-action-tray');
    // Hide WhatsApp buttons (common classes/ids/text)
    const whatsappBtns = [
      ...document.querySelectorAll('.whatsapp, .whatsapp-btn, .wa-btn, #whatsapp, [href*="wa.me"], [href*="whatsapp"], [aria-label*="whatsapp" i], [class*="whatsapp" i]'),
      ...Array.from(document.querySelectorAll('button, a, div, span')).filter(el => {
        const txt = (el.innerText || '').toLowerCase();
        return txt.includes('whatsapp');
      })
    ];
    // Hide any element containing the message 'hii iam dudu'
    const duduMsgs = Array.from(document.querySelectorAll('body *')).filter(el => {
      return (el.innerText || '').toLowerCase().includes('hii iam dudu');
    });
    // Hide alert bars (broader selectors)
    const alerts = [
      ...document.querySelectorAll('.alert, .alert-bar, .MuiAlert-root, .alertbar, [role="alert"], [aria-live], [aria-label*="alert" i], [class*="alert" i]'),
      ...Array.from(document.querySelectorAll('div, section, aside')).filter(el => {
        const style = window.getComputedStyle(el);
        return (el.className && el.className.toLowerCase().includes('alert')) || (style.backgroundColor && style.backgroundColor.toLowerCase().includes('rgb(255, 235, 59)'));
      })
    ];
    // Hide pay buttons (including quick pay)
    const payBtns = [
      ...document.querySelectorAll('.pay-btn, .pay-button, #pay, [data-pay], button[name="pay" i], [aria-label*="pay" i], [class*="pay" i], .quick-pay, #quickpay, [data-quickpay], button[name="quickpay" i], [aria-label*="quick pay" i], [class*="quickpay" i]'),
      ...Array.from(document.querySelectorAll('button, a, div')).filter(el => {
        const cls = el.className ? el.className.toLowerCase() : '';
        return cls.includes('pay') || cls.includes('quickpay') || cls.includes('quick-pay');
      })
    ];
    // Hide plotting buttons
    const plotBtns = [
      ...document.querySelectorAll('.plot-btn, .plotting-btn, #plot, [data-plot], button[name="plot" i], [aria-label*="plot" i], [class*="plot" i]'),
      ...Array.from(document.querySelectorAll('button, a, div')).filter(el => {
        return (el.className && el.className.toLowerCase().includes('plot'));
      })
    ];
    // Hide floating buttons (broader, including quick pay)
    const floatingBtns = [
      ...document.querySelectorAll('.floating-btn, .float-btn, .MuiFab-root, .fab, .floating-action, .quick-pay, .quickpay-float, [class*="float" i], [class*="fab" i], [class*="quickpay" i], [aria-label*="float" i], [aria-label*="fab" i], [aria-label*="quick pay" i]'),
      ...Array.from(document.querySelectorAll('button, a, div')).filter(el => {
        const style = window.getComputedStyle(el);
        const cls = el.className ? el.className.toLowerCase() : '';
        return (style.position === 'fixed' || style.position === 'absolute') && (cls.includes('float') || cls.includes('fab') || cls.includes('quickpay') || cls.includes('quick-pay'));
      }),
      ...Array.from(document.querySelectorAll('[style*="position:fixed"], [style*="position: absolute"]')).filter(el => {
        // Only hide if looks like a button
        const cls = el.className ? el.className.toLowerCase() : '';
        return ['BUTTON','A','DIV'].includes(el.tagName) && (cls.includes('float') || cls.includes('fab') || cls.includes('quickpay') || cls.includes('quick-pay'));
      })
    ];
    // Hide ChatWidget.js root (by class or id)
    const chatWidgetRoots = [
      ...document.querySelectorAll('.chat-widget, #chat-widget, [data-chat-widget], .fixed.bottom-24.right-6.z-50, .fixed.inset-0.z-50')
    ];
  navs.forEach(el => { el.dataset.prevDisplay = el.style.display; el.style.display = 'none'; });
  footers.forEach(el => { el.dataset.prevDisplay = el.style.display; el.style.display = 'none'; });
  alerts.forEach(el => { el.dataset.prevDisplay = el.style.display; el.style.display = 'none'; });
  payBtns.forEach(el => { el.dataset.prevDisplay = el.style.display; el.style.display = 'none'; });
  plotBtns.forEach(el => { el.dataset.prevDisplay = el.style.display; el.style.display = 'none'; });
  floatingBtns.forEach(el => { el.dataset.prevDisplay = el.style.display; el.style.display = 'none'; });
  whatsappBtns.forEach(el => { el.dataset.prevDisplay = el.style.display; el.style.display = 'none'; });
  duduMsgs.forEach(el => { el.dataset.prevDisplay = el.style.display; el.style.display = 'none'; });
  chatWidgetRoots.forEach(el => { el.dataset.prevDisplay = el.style.display; el.style.display = 'none'; });
  mobileActionTrays.forEach(el => { el.dataset.prevDisplay = el.style.display; el.style.display = 'none'; });
    // Prevent scroll on body
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      navs.forEach(el => { el.style.display = el.dataset.prevDisplay || ''; });
      footers.forEach(el => { el.style.display = el.dataset.prevDisplay || ''; });
      alerts.forEach(el => { el.style.display = el.dataset.prevDisplay || ''; });
      payBtns.forEach(el => { el.style.display = el.dataset.prevDisplay || ''; });
      plotBtns.forEach(el => { el.style.display = el.dataset.prevDisplay || ''; });
      floatingBtns.forEach(el => { el.style.display = el.dataset.prevDisplay || ''; });
      whatsappBtns.forEach(el => { el.style.display = el.dataset.prevDisplay || ''; });
      duduMsgs.forEach(el => { el.style.display = el.dataset.prevDisplay || ''; });
      const chatWidgetRoots = [
        ...document.querySelectorAll('.chat-widget, #chat-widget, [data-chat-widget], .fixed.bottom-24.right-6.z-50, .fixed.inset-0.z-50')
      ];
      const floatingPayRoots = [
        ...document.querySelectorAll('.floating-pay-btn, #floating-pay-btn, [data-floating-pay], .fixed.bottom-6.left-6.z-50')
      ];
      chatWidgetRoots.forEach(el => { el.style.display = el.dataset.prevDisplay || ''; });
      floatingPayRoots.forEach(el => { el.style.display = el.dataset.prevDisplay || ''; });
      // Restore MobileActionTray
      const mobileActionTrays = document.querySelectorAll('.mobile-action-tray');
      mobileActionTrays.forEach(el => { el.style.display = el.dataset.prevDisplay || ''; });
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen]);

  return (
    <HelmetProvider>
      <Helmet>
        <title>LeadsForm | Wise Global Research</title>
        <meta name="description" content="Submit your details to Wise Global Research for expert trading guidance, personalized support, and the latest updates. We help you achieve your financial goals with trusted research and advisory services." />
        <meta name="keywords" content="Wise Global Research, trading, financial research, advisory, submit details, contact, support, stock market, investment, SEBI registered" />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="LeadsForm | Wise Global Research" />
        <meta property="og:description" content="Submit your details to Wise Global Research for expert trading guidance, personalized support, and the latest updates. We help you achieve your financial goals with trusted research and advisory services." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://wiseglobalresearch.com/leadsform" />
        <meta property="og:image" content="https://wiseglobalresearch.com/assets/og-image.jpg" />
        <meta property="og:site_name" content="Wise Global Research" />
        <meta property="og:locale" content="en_IN" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="LeadsForm | Wise Global Research" />
        <meta name="twitter:description" content="Submit your details to Wise Global Research for expert trading guidance, personalized support, and the latest updates. We help you achieve your financial goals with trusted research and advisory services." />
        <meta name="twitter:image" content="https://wiseglobalresearch.com/assets/og-image.jpg" />
        <meta name="twitter:site" content="@wiseglobalresearch" />
        <link rel="canonical" href="https://wiseglobalresearch.com/leadsform" />
        <script type="application/ld+json">{`
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "LeadsForm | Wise Global Research",
            "description": "Submit your details to Wise Global Research for expert trading guidance, personalized support, and the latest updates. We help you achieve your financial goals with trusted research and advisory services.",
            "url": "https://wiseglobalresearch.com/leadsform",
            "publisher": {
              "@type": "Organization",
              "name": "Wise Global Research",
              "url": "https://wiseglobalresearch.com",
              "logo": {
                "@type": "ImageObject",
                "url": "https://wiseglobalresearch.com/assets/og-image.jpg"
              }
            }
          }
        `}</script>
        <script type="application/ld+json">{`
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Wise Global Research",
            "url": "https://wiseglobalresearch.com",
            "logo": "https://wiseglobalresearch.com/assets/og-image.jpg",
            "contactPoint": [{
              "@type": "ContactPoint",
              "telephone": "+91-XXXXXXXXXX",
              "contactType": "customer support",
              "areaServed": "IN",
              "availableLanguage": ["English", "Hindi"]
            }],
            "sameAs": [
              "https://www.facebook.com/wiseglobalresearch",
              "https://twitter.com/wiseglobalresearch",
              "https://www.linkedin.com/company/wiseglobalresearch"
            ]
          }
        `}</script>
      </Helmet>
      {/* Website-related short description for users */}
      <div className="w-full text-center py-4 bg-indigo-50 text-indigo-800 text-lg font-medium">
        Welcome to Wise Global Research! Fill out the form below to get personalized trading support, expert research, and the latest updates from our SEBI-registered team.
      </div>
      <div className="relative min-h-screen" style={{ background: '#fff' }}>
        {/* Fullscreen white overlay */}
        {isOpen && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',   
            height: '100vh',
            background: '#fff',
            zIndex: 1000,
          }} />
        )}
        <div className="flex justify-center items-center min-h-screen px-2 sm:px-4 md:px-6 lg:px-8 py-8" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 1010 }}>
          <div className="w-full max-w-3xl">
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  ref={modalRef}
                  className="rounded-2xl overflow-hidden w-full bg-white"
                  style={{ border: '2px solid #6366f1', borderRadius: 20, boxShadow: '0 12px 48px rgba(60,60,120,0.08)', padding: 'clamp(10px, 4vw, 36px)', margin: '0 auto', maxWidth: 720 }}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                >
                  {success ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <h2 className="text-3xl sm:text-4xl font-bold text-green-500 mb-4 text-center">Thank you!</h2>
                      <p className="text-center">Your details have been submitted. We will contact you shortly.</p>
                    </motion.div>
                  ) : (
                    <motion.form onSubmit={handleSubmit} variants={containerVariants} initial="hidden" animate="visible">
                      <motion.h2 className="text-4xl sm:text-5xl font-extrabold text-center mb-8 text-indigo-700" variants={itemVariants}>Submit your details</motion.h2>

                      <motion.div className="relative mb-4 sm:mb-6" variants={itemVariants}>
                        <label htmlFor="ef-name" className="sr-only">Full Name</label>
                        <input id="ef-name" name="name" value={form.name} onChange={onChange} required placeholder="Full Name" autoComplete="name" className={`w-full p-3 bg-white border ${errors.name ? 'border-red-500' : 'border-indigo-300'} rounded-lg text-black outline-none placeholder-gray-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500`} />
                        {errors.name && <span className="text-red-500 text-xs absolute left-0 -bottom-5">{errors.name}</span>}
                      </motion.div>

                      <motion.div className="relative mb-4 sm:mb-6" variants={itemVariants}>
                        <label htmlFor="ef-mobile" className="sr-only">Mobile</label>
                        <input id="ef-mobile" name="mobile" value={form.mobile} onChange={onChange} required placeholder="Mobile" inputMode="tel" autoComplete="tel" className={`w-full p-3 bg-white border ${errors.mobile ? 'border-red-500' : 'border-indigo-300'} rounded-lg text-black outline-none placeholder-gray-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500`} />
                        {errors.mobile && <span className="text-red-500 text-xs absolute left-0 -bottom-5">{errors.mobile}</span>}
                      </motion.div>

                      <motion.div className="relative mb-4 sm:mb-6" variants={itemVariants}>
                        <label htmlFor="ef-address" className="sr-only">Address</label>
                        <input id="ef-address" name="address" value={form.address} onChange={onChange} required placeholder="Address" className={`w-full p-3 bg-white border ${errors.address ? 'border-red-500' : 'border-indigo-300'} rounded-lg text-black outline-none placeholder-gray-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500`} />
                        {errors.address && <span className="text-red-500 text-xs absolute left-0 -bottom-5">{errors.address}</span>}
                      </motion.div>


                      <motion.div className="relative mb-4 sm:mb-6" variants={itemVariants}>
                        <label htmlFor="ef-email" className="sr-only">Email</label>
                        <input id="ef-email" type="email" name="email" value={form.email} onChange={onChange} placeholder="Email (optional)" autoComplete="email" className={`w-full p-3 bg-white border ${errors.email ? 'border-red-500' : 'border-indigo-300'} rounded-lg text-black outline-none placeholder-gray-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500`} />
                        {errors.email && <span className="text-red-500 text-xs absolute left-0 -bottom-5">{errors.email}</span>}
                      </motion.div>

                      <motion.div className="relative mb-4 sm:mb-6" variants={itemVariants}>
                        <label htmlFor="ef-message" className="sr-only">Message</label>
                        <textarea id="ef-message" name="message" value={form.message} onChange={onChange} required placeholder="Message" rows={3} className={`w-full p-3 bg-white border ${errors.message ? 'border-red-500' : 'border-indigo-300'} rounded-lg text-black outline-none placeholder-gray-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500`} />
                        {errors.message && <span className="text-red-500 text-xs absolute left-0 -bottom-5">{errors.message}</span>}
                      </motion.div>

                      <motion.div className="flex justify-end gap-2 mt-4" variants={itemVariants}>
                        <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-green-600 text-white rounded">
                          {isSubmitting ? <span className="spinner-border animate-spin inline-block w-4 h-4 border-4 rounded-full" role="status"><span className="visually-hidden">Loading...</span></span> : 'Submit'}
                        </button>
                      </motion.div>
                    </motion.form>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </HelmetProvider>
  );
};

export default LeadsForm;
