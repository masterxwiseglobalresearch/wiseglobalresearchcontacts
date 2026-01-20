import { useState } from 'react';
import { ref, push, serverTimestamp } from 'firebase/database';
import { db } from '@/firebase';
import { sendPopupEmailWithRetry } from '@/utils/email';

/**
 * Hook to submit popup lead with RTDB + optional email.
 */
export function usePopupLead() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  async function submitLead({ name='', mobile='', city='', interest='' }) {
    setLoading(true); setError(null); setSuccess(false);
    try {
      try {
        await push(ref(db, 'popupSubmissions'), {
          name, mobile, city, interest,
          createdAt: serverTimestamp(),
          source: 'popup-hook'
        });
      } catch (dbErr) {
        console.warn('popup-hook: RTDB push failed', dbErr);
        if (dbErr && (dbErr.code === 'PERMISSION_DENIED' || /permission_denied/i.test(dbErr.message || ''))) {
          // attempt server-side email fallback
            try {
              const isLocalhost = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
              const port = (typeof window !== 'undefined' && window.location.port) ? window.location.port : '';
              const useRelative = (process.env.REACT_APP_USE_LOCAL_SEND_EMAIL === 'true') || (isLocalhost && port === '3001');
              const endpoint = useRelative ? '/send-email' : 'https://wise-globle-research-2.onrender.com/send-email';
              await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, mobile, city, interest, source: 'popup-hook-fallback' })
              });
            } catch (fallbackErr) {
            console.warn('popup-hook: fallback email failed', fallbackErr);
            throw fallbackErr;
          }
        } else {
          throw dbErr;
        }
      }
      if (mobile) {
        try {
          await sendPopupEmailWithRetry({
            name,
            phone: mobile,
            message: `City: ${city} | Interest: ${interest}`,
            source: 'popup-hook'
          }, { retries: 1 });
        } catch (e) {
          console.warn('Email failed in hook (continuing):', e);
        }
      }
      setSuccess(true);
    } catch (e) {
      setError(e.message || 'Submit failed');
    } finally {
      setLoading(false);
    }
  }

  return { submitLead, loading, error, success };
}
