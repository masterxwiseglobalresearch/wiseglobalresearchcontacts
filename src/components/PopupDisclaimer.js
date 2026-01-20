import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import wiseLogo from '../assets/images/wise3.png';

// Disclaimer popup shown before other popups. Writes localStorage key `disclaimerAccepted` = 'true' when accepted.
const PopupDisclaimer = ({ onAccept, forceShow = false }) => {
  const [visible, setVisible] = useState(false);

  // Always show the disclaimer when this component mounts (so user sees it on each refresh).
  useEffect(() => {
    setVisible(true);
  }, []);

  const onAcceptRef = useRef(onAccept);
  useEffect(() => { onAcceptRef.current = onAccept; }, [onAccept]);

  // ref for the Agree button to autofocus for keyboard users
  const agreeBtnRef = useRef(null);

  // Language state: 'en' or 'hi'
  const [lang, setLang] = useState('en');

  const setEnglish = () => setLang('en');
  const setHindi = () => setLang('hi');

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setVisible(false);
        // call onAccept so caller can show next popup in this session
        if (onAcceptRef.current) onAcceptRef.current();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (visible) {
      // small delay to ensure the element is in DOM
      setTimeout(() => agreeBtnRef.current?.focus(), 80);
    }
  }, [visible]);

  const handleAccept = () => {
    // Do not persist acceptance - show popup for this session only.
    setVisible(false);
    if (onAcceptRef.current) onAcceptRef.current();
  };

  const handleClose = () => {
    // Close without persisting; allow caller to proceed in this session.
    setVisible(false);
    if (onAcceptRef.current) onAcceptRef.current();
  };

  if (!visible) return null;

  const content = (
    <AnimatePresence>
      <motion.div
        className="fixed top-0 left-0 right-0 bottom-0 z-[99999] flex items-center justify-center bg-black/50 p-4"
        onClick={handleClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
          <motion.div
          className="relative rounded-2xl shadow-2xl border text-black mx-auto flex flex-col"
          onClick={(e) => e.stopPropagation()}
          // prevent text selection and copying inside the popup
          onCopy={(e) => e.preventDefault()}
          onCut={(e) => e.preventDefault()}
          onPaste={(e) => e.preventDefault()}
          onContextMenu={(e) => e.preventDefault()}
          onDragStart={(e) => e.preventDefault()}
          initial={{ scale: 0.975, y: 12, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.975, y: 12, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 25 }}
          style={{
            width: '100%',
            maxWidth: 'min(900px, 96vw)',
            maxHeight: '92vh',
            padding: '16px',
            // unified white surface with indigo border and soft shadow
            background: '#fff',
            border: '2px solid #6366f1',
            boxShadow: '0 8px 32px 0 rgba(60,60,120,0.18), 0 1.5px 8px 0 rgba(99,102,241,0.10)',
            // disallow text selection across browsers
            userSelect: 'none',
            WebkitUserSelect: 'none',
            MozUserSelect: 'none',
          }}
          role="dialog"
          aria-modal="true"
        >
          {/* Watermark - decorative and non-interactive */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              pointerEvents: 'none',
              zIndex: 0,
            }}
          >
            <div
              style={{
                transform: 'rotate(-28deg)',
                opacity: 0.06,
                fontSize: 64,
                fontWeight: 700,
                color: '#000',
                letterSpacing: 6,
                userSelect: 'none',
                WebkitUserSelect: 'none',
                MozUserSelect: 'none',
                mixBlendMode: 'multiply',
                whiteSpace: 'nowrap',
                textTransform: 'uppercase',
                padding: '8px 12px',
              }}
            >
              WISE GLOBAL RESEARCH
            </div>
          </div>
          <button
            onClick={handleClose}
            aria-label="Close disclaimer"
            title="Close disclaimer"
            className="absolute right-3 top-3 bg-white rounded-full p-2 text-gray-800 hover:bg-white z-30"
            style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.12)' }}
          >
            <span style={{ fontSize: '18px', lineHeight: 1 }}>✕</span>
          </button>

          <div style={{ paddingTop: 6 }} className="px-2 sm:px-0 overflow-hidden flex flex-col" >
            {/* add right padding so header content doesn't flow under the close button */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-6 pr-0 sm:pr-16 relative">
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className="w-14 h-14 sm:w-20 sm:h-20 flex-shrink-0 rounded-full bg-white p-2 shadow-sm" style={{ overflow: 'hidden' }}>
                  <img src={wiseLogo} alt="Wise Global Logo" className="w-full h-full object-contain" loading="lazy" decoding="async" />
                </div>
                <h2 className="text-base sm:text-xl font-bold text-indigo-700 mb-0">
                  {lang === 'en' ? 'WISE GLOBAL RESEARCH SERVICES PRIVATE LIMITED — Important Notice' : 'वाईज़ ग्लोबल रिसर्च सर्विसेज़ प्राइवेट लिमिटेड — महत्वपूर्ण सूचना'}
                </h2>
              </div>

              {/* Language toggle (kept inside header but positioned away from close by padding) */}
              <div className="flex items-center gap-2 z-10 mt-2 sm:mt-0">
                <button
                  onClick={setEnglish}
                  aria-pressed={lang === 'en'}
                  className={`px-2 py-1 rounded-md text-sm ${lang === 'en' ? 'bg-gray-100 font-semibold' : 'bg-transparent'}`}
                >
                  EN
                </button>
                <button
                  onClick={setHindi}
                  aria-pressed={lang === 'hi'}
                  className={`px-2 py-1 rounded-md text-sm ${lang === 'hi' ? 'bg-gray-100 font-semibold' : 'bg-transparent'}`}
                >
                  हिंदी
                </button>
              </div>
            </div>

            <div className="mt-3 text-sm sm:text-base leading-6 space-y-3" style={{ whiteSpace: 'pre-line', flex: '1 1 auto', overflowY: 'auto', paddingRight: 6 }}>
              {lang === 'en' ? (
                <>
                  <p>
                    WISE GLOBAL RESEARCH SERVICES PRIVATE LIMITED is a Registered Research Analyst (Registered No. INH000016719). This company is purely a research-based company in the stock market. The recommendations of the company make no commitment, representation, warranty or guarantee as to the quality, accuracy or performance provided on or through the Website/Email (collectively, the Services and Information). The company also does not provide any profit-sharing service.
                  </p>

                  <p>
                    Do not share your DEMAT account details (like User ID and Password) with any person; it may lead to financial fraud.
                  </p>

                  <p>
                    Company provides research recommendations via text SMS only, and Research Reports via Website only. Trade only on company-generated SMS services obtained by you with proper Target and Stop Loss (TGT and SL). Refer telephonic advice from the support desk only with respect to company-generated SMS. Telephonic trading advices shall be ignored until confirmation of paid services via emailed invoice. The Company will not be responsible if you do not act on company-generated SMS during telephonic advice.
                  </p>

                  <p>
                    Always make payments only through the company’s official website. If any representative asks you for personal payment, inform the company on the number written on the website. In such cases the company will not be responsible for any cost or loss arising from payments made outside the website.
                  </p>

                  <p>
                    The Services and Information provided on or through the website/email are for general guidance and information purposes only and are subject to market risk. They do not in any manner indicate any assurance, commitment or opinion of any kind whatsoever.
                  </p>

                  <p>
                    Contact us: +91-9977909494  |  Email:  support@wiseglobalresearch.com
                  </p>
                </>
              ) : (
                <>
                  <p>
                    वाईज़ ग्लोबल रिसर्च सर्विसेज़ प्राइवेट लिमिटेड एक पंजीकृत रिसर्च एनालिस्ट है (रजिस्ट्रेशन नंबर: INH000016719)। यह कंपनी केवल शेयर बाजार पर रिसर्च-आधारित सेवाएँ प्रदान करती है। कंपनी की सिफारिशें, वेबसाइट/ईमेल (सामूहिक रूप से, सेवाएँ और सूचनाएँ) पर प्रदान की जा रही जानकारी की गुणवत्ता, सटीकता या प्रदर्शन के संबंध में कोई प्रतिबद्धता, प्रतिनिधित्व, वारंटी या गारंटी नहीं देतीं। कंपनी किसी प्रकार की प्रॉफिट-शेयरिंग सेवा प्रदान नहीं करती।
                  </p>

                  <p>
                    अपना DEMAT खाता विवरण (जैसे उपयोगकर्ता आईडी और पासवर्ड) किसी के साथ साझा न करें; इससे वित्तीय धोखाधड़ी हो सकती है।
                  </p>

                  <p>
                    कंपनी केवल टेक्स्ट SMS के माध्यम से रिसर्च सिफारिशें प्रदान करती है, और रिसर्च रिपोर्ट केवल वेबसाइट पर उपलब्ध कराई जाती हैं। केवल कंपनी द्वारा जनरेट किए गए SMS के अनुसार ही ट्रेड करें और उचित Target और Stop Loss (TGT और SL) का पालन करें। सपोर्ट डेस्क से टेलीफोनिक सलाह केवल उन्हीं SMS के संदर्भ में मान्य होगी जो कंपनी द्वारा जनरेट की गई हों। टेलीफोनिक ट्रेडिंग सलाह को तब तक माना नहीं जाएगा जब तक भुगतान सेवाओं की पुष्टि ईमेल द्वारा प्राप्त नहीं हो जाती। यदि आपने कंपनी द्वारा जनरेट किए गए SMS पर कार्रवाई नहीं की, तो कंपनी उत्तरदायी नहीं होगी।
                  </p>

                  <p>
                    हमेशा कंपनी की आधिकारिक वेबसाइट के माध्यम से ही भुगतान करें। यदि कोई प्रतिनिधि आपसे व्यक्तिगत भुगतान माँगता है, तो वेबसाइट पर लिखे नंबर पर कंपनी को सूचित करें। ऐसे मामलों में कंपनी उन भुगतानों से उत्पन्न किसी भी लागत या नुकसान के लिए जिम्मेदार नहीं होगी जो वेबसाइट के बाहर किए गए हों।
                  </p>

                  <p>
                    वेबसाइट/ईमेल के माध्यम से प्रदान की गई सेवाएँ और सूचनाएँ सामान्य मार्गदर्शन और जानकारी हेतु हैं और बाजार जोखिम के अधीन हैं। वे किसी भी प्रकार का आश्वासन, प्रतिबद्धता या राय प्रकट नहीं करतीं।
                  </p>

                  <p>
                    संपर्क करें: +91-9977909494  |  ईमेल: support@wiseglobalresearch.com
                  </p>
                </>
              )}
            </div>

            <div className="mt-4 flex items-center justify-end gap-3 sm:gap-3 pt-2 sm:pt-0">
              <button
                ref={agreeBtnRef}
                onClick={handleAccept}
                className="btn-purple px-4 py-3 rounded-md w-full sm:w-auto text-center"
                aria-label="Agree to disclaimer and continue"
              >
                I Agree
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );

  if (typeof document !== 'undefined') {
    return createPortal(content, document.body);
  }
  return content;
};

export default PopupDisclaimer;