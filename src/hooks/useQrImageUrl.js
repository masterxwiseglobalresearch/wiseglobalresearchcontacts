import { useEffect, useState } from 'react';
import { getDownloadURL, ref as storageRef } from 'firebase/storage';
import { storage } from '../firebase';

// Usage: const url = useQrImageUrl();
export default function useQrImageUrl() {
  const [url, setUrl] = useState(null);
  useEffect(() => {
    let isMounted = true;
    const fetchUrl = async () => {
      try {
        const qrRef = storageRef(storage, 'qr/qr.png');
        const downloadUrl = await getDownloadURL(qrRef);
        if (isMounted) setUrl(downloadUrl);
      } catch (e) {
        if (isMounted) setUrl(null); // Not found or error
      }
    };
    fetchUrl();
    return () => { isMounted = false; };
  }, []);
  return url;
}
