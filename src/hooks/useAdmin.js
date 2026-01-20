import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../firebase';
import { ref, get } from 'firebase/database';

// Determines if current user is an admin by checking RTDB: /admins/{uid} === true
export const useAdmin = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSupport, setIsSupport] = useState(false);
  const [isHrOnly, setIsHrOnly] = useState(false);
  const [isSeoOnly, setIsSeoOnly] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setIsAdmin(false);
        setIsSupport(false);
        setChecking(false);
        return;
      }
      // Compute support, HR, and SEO roles by email and RTDB flag
      const email = (user.email || '').toLowerCase();
      let support = email === 'support@wiseglobalresearch.com';
      const hrOnly = email === 'carrier@wiseglobalresearch.com';
      const seoOnly = email === 'info@wiseglobalresearch.in';
      try {
        const s = await get(ref(db, `supportUsers/${user.uid}`));
        if (s.exists() && s.val() === true) support = true;
      } catch (_) {}
      setIsSupport(support);
      setIsHrOnly(hrOnly);
      setIsSeoOnly(seoOnly);
      try {
        const snap = await get(ref(db, `admins/${user.uid}`));
        setIsAdmin(snap.exists() && snap.val() === true);
      } catch (_) {
        setIsAdmin(false);
      } finally {
        setChecking(false);
      }
    });
    return () => unsub();
  }, []);

  return { isAdmin, isSupport, isHrOnly, isSeoOnly, checking };
};

export default useAdmin;
