import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ref as dbRef, onValue } from 'firebase/database';
import { db } from '../firebase';

// Simplified media popup. Shows image/video/embed and a close button.
// Accepts optional `imageUrl` prop. If not provided, it will use the Realtime DB value at `admin/popupMedia`.
const PopupForm = ({ onClose, forceShow = false, imageUrl: propImageUrl }) => {
  const [visible, setVisible] = useState(false);
  const [imageUrl, setImageUrl] = useState(propImageUrl || '');
  const [mediaType, setMediaType] = useState('image'); // 'image' | 'video' | 'embed'
  // natural image dimensions and computed scaled size to fit viewport
  const [naturalSize, setNaturalSize] = useState({ width: 0, height: 0 });
  const [scaledSize, setScaledSize] = useState({ width: 0, height: 0 });
  const location = useLocation();

  useEffect(() => {
    let timer;
    // If explicitly forced, only show immediately when media is available.
    // This avoids showing an empty popup (for example due to stale localStorage values)
    // while still allowing tests/admins to force the popup when an image/video is present.
    if (forceShow) {
      const hasMediaNow = Boolean(propImageUrl || imageUrl);
      if (hasMediaNow) {
        setVisible(true);
      } else {
        setVisible(false);
      }
      return () => clearTimeout(timer);
    }

    const showIfAllowed = async () => {
      // Check disclaimer acceptance in localStorage; if not accepted, don't show.
      let allowed = true;
      try {
        allowed = localStorage.getItem('disclaimerAccepted') === 'true';
      } catch (e) {
        // If access to localStorage fails, default to allowing popup so user still sees it
        allowed = true;
      }

      // Only show the popup when we're on the homepage, the disclaimer is accepted,
      // AND there is media to display (either from prop or admin DB). We explicitly do
      // not read any `popupImage` key from localStorage here — admin media should come
      // from the Realtime DB or be passed in via props.
      const hasImage = Boolean(propImageUrl || imageUrl);
      if (location.pathname === '/' && allowed && hasImage) {
        // Reset visibility then show after a small delay for nicer UX
        setVisible(false);
        timer = setTimeout(() => setVisible(true), 1000);
      } else {
        setVisible(false);
      }
    };

    showIfAllowed();
    return () => clearTimeout(timer);
  }, [location.pathname, forceShow, imageUrl, propImageUrl]);

  // recompute scaled size when naturalSize changes or window resizes
  useEffect(() => {
    const compute = () => {
      const vw = typeof window !== 'undefined' ? window.innerWidth : 1200;
      const vh = typeof window !== 'undefined' ? window.innerHeight : 800;
      const maxW = Math.min(800, vw * 0.92);
      const maxH = vh * 0.8;
      const nw = naturalSize.width || 0;
      const nh = naturalSize.height || 0;
      if (!nw || !nh) {
        setScaledSize({ width: maxW, height: Math.min(maxH, 600) });
        return;
      }
      const scale = Math.min(1, maxW / nw, maxH / nh);
      setScaledSize({ width: Math.round(nw * scale), height: Math.round(nh * scale) });
    };

    compute();
    window.addEventListener('resize', compute);
    return () => window.removeEventListener('resize', compute);
  }, [naturalSize]);

  // Subscribe to Realtime DB value for admin popup media (if prop not provided)
  useEffect(() => {
    if (propImageUrl) return; // prop takes precedence
    try {
      const r = dbRef(db, 'admin/popupMedia');
      const off = onValue(r, (snapshot) => {
        if (snapshot.exists()) {
          const val = snapshot.val();
          if (val && typeof val === 'object' && val.url) {
            setImageUrl(val.url);
            setMediaType(val.type === 'video' ? 'video' : (val.type === 'embed' ? 'embed' : 'image'));
          } else if (typeof val === 'string') {
            setImageUrl(val);
            setMediaType(val.startsWith('data:video') ? 'video' : (val.includes('canva.com') ? 'embed' : 'image'));
          } else {
            setImageUrl('');
            setMediaType('image');
          }
        } else {
          setImageUrl('');
          setMediaType('image');
        }
      }, (err) => {
        console.warn('Failed to subscribe to popupMedia DB value', err);
      });
      return () => off();
    } catch (e) {
      // If Firebase not configured in this environment, ignore
      console.warn('Could not subscribe to popupMedia', e);
    }
  }, [propImageUrl]);

  // Close on Escape for accessibility. Use a ref to avoid effect dependency on `onClose`.
  const onCloseRef = React.useRef(onClose);
  React.useEffect(() => { onCloseRef.current = onClose; }, [onClose]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setVisible(false);
        if (onCloseRef.current) onCloseRef.current();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const handleClose = () => {
    setVisible(false);
    if (onCloseRef.current) onCloseRef.current();
  };

  if (!visible) return null;

  const popupContent = (
    <AnimatePresence>
      <motion.div
        className="fixed top-0 left-0 right-0 bottom-0 z-[99999] flex items-center justify-center bg-black/50 p-4"
        onClick={handleClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="relative rounded-xl shadow-2xl bg-white/90 backdrop-blur-sm overflow-hidden mx-auto"
          onClick={(e) => e.stopPropagation()}
          initial={{ scale: 0.975, y: 12, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.975, y: 12, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 25 }}
          style={{
            width: scaledSize.width ? scaledSize.width + 'px' : '100%',
            height: scaledSize.height ? scaledSize.height + 'px' : 'auto',
            maxWidth: 'min(800px, 92vw)',
            maxHeight: '80vh',
            padding: 0,
            margin: '0 auto'
          }}
          role="dialog"
          aria-modal="true"
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
            {mediaType === 'video' ? (
              <video
                src={imageUrl || ''}
                muted
                autoPlay
                loop
                playsInline
                style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
                onLoadedMetadata={(e) => {
                  try {
                    const v = e.currentTarget;
                    setNaturalSize({ width: v.videoWidth, height: v.videoHeight });
                  } catch (err) {}
                }}
              />
            ) : mediaType === 'embed' ? (
              <iframe
                src={imageUrl || ''}
                title="popup-embed"
                style={{ width: '100%', height: '100%', border: 0 }}
                onLoad={() => { /* nothing */ }}
              />
            ) : (
              <img
                // Use the admin-provided imageUrl when present. If not present, leave src undefined
                // so we don't load or display a placeholder image.
                src={imageUrl || undefined}
                alt="wiseglobalresearch"
                decoding="async"
                loading="lazy"
                /* Improve clarity: cap height, use contain to preserve aspect ratio and let container size match */
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  display: 'block',
                  imageRendering: 'auto',
                  WebkitFontSmoothing: 'antialiased'
                }}
                onLoad={(e) => {
                  try {
                    const img = e.currentTarget;
                    setNaturalSize({ width: img.naturalWidth, height: img.naturalHeight });
                  } catch (err) {
                    // ignore
                  }
                }}
                onError={(e) => { try { e.currentTarget.onerror = null; e.currentTarget.style.display = 'none'; } catch (err) {} }}
              />
            )}
          </div>

          <button
            onClick={handleClose}
            aria-label="Close popup"
            title="Close popup"
            className="absolute right-3 top-3 bg-black rounded-full p-2 text-white hover:bg-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            style={{ backdropFilter: 'blur(6px)', boxShadow: '0 2px 10px rgba(0,0,0,0.12)' }}
          >
            <span style={{ fontSize: '18px', lineHeight: 1 }}>✕</span>
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );

  // Render into document.body to avoid stacking context problems (navbars, transforms)
  if (typeof document !== 'undefined') {
    return createPortal(popupContent, document.body);
  }

  return popupContent;
};

export default PopupForm;