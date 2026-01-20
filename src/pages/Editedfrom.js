import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ref, push } from 'firebase/database';
import { db } from '../firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { toast } from 'react-toastify';

const Editedfrom = () => {
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

  // (Fixed) Only one onChange handler below
  const onChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors(prev => ({ ...prev, [e.target.name]: '' }));
  };

  // Validation function
  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.mobile.trim()) newErrors.mobile = 'Mobile is required';
    if (!form.address.trim()) newErrors.address = 'Address is required';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) newErrors.email = 'Invalid email';
    if (!form.message.trim()) newErrors.message = 'Message is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setIsSubmitting(true);
    const data = {
      name: String(form.name || ''),
      phone: String(form.mobile || ''),
      address: String(form.address || ''),
      email: String(form.email || ''),
      message: String(form.message || ''),
      timestamp: Date.now(),
    };
    try {
      await push(ref(db, 'homeFormSubmissions'), data);
      toast.success('Form submitted', { position: 'top-center' });
  setForm({ name: '', mobile: '', address: '', email: '', message: '' });
      setSuccess(true);
      // close after short delay
      setTimeout(() => {
        setIsOpen(false);
        navigate('/');
      }, 800);
    } catch (err) {
      console.error(err);
      toast.error('Failed to submit form: ' + (err.message || ''), { position: 'top-center' });
    } finally {
      setIsSubmitting(false);
    }
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
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen]);

  return (
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
                      <input id="ef-email" type="email" name="email" value={form.email} onChange={onChange} required placeholder="Email" autoComplete="email" className={`w-full p-3 bg-white border ${errors.email ? 'border-red-500' : 'border-indigo-300'} rounded-lg text-black outline-none placeholder-gray-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500`} />
                      {errors.email && <span className="text-red-500 text-xs absolute left-0 -bottom-5">{errors.email}</span>}
                    </motion.div>

                    <motion.div className="relative mb-4 sm:mb-6" variants={itemVariants}>
                      <label htmlFor="ef-message" className="sr-only">Message</label>
                      <textarea id="ef-message" name="message" value={form.message} onChange={onChange} required placeholder="Message" rows={3} className={`w-full p-3 bg-white border ${errors.message ? 'border-red-500' : 'border-indigo-300'} rounded-lg text-black outline-none placeholder-gray-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500`} />
                      {errors.message && <span className="text-red-500 text-xs absolute left-0 -bottom-5">{errors.message}</span>}
                    </motion.div>

                    <motion.div className="flex justify-end gap-2 mt-4" variants={itemVariants}>
                      <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-green-600 text-white rounded">{isSubmitting ? 'Submitting...' : 'Submit'}</button>
                    </motion.div>
                  </motion.form>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Editedfrom;
