// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getDatabase, forceWebSockets, goOffline } from 'firebase/database';
import { getStorage } from 'firebase/storage'; // Added for Storage
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyD0lzKH48zPo9hjYCRZ77mb-uUJ3Xtt8Cs",
  authDomain: "web-wiseglobalresearch.firebaseapp.com",
  databaseURL: "https://web-wiseglobalresearch-default-rtdb.firebaseio.com",
  projectId: "web-wiseglobalresearch",
  storageBucket: "web-wiseglobalresearch.firebasestorage.app",
  messagingSenderId: "527218730081",
  appId: "1:527218730081:web:133dfd8d5ac505fffa3620",
  measurementId: "G-XX5KCQT6KB"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
// Prefer WebSockets to avoid long-polling transport that relies on deprecated unload events
try {
  if (typeof window !== 'undefined') {
    forceWebSockets();
  }
} catch (_) {
  // no-op: if not supported, SDK will choose the best available transport
}

export const db = getDatabase(app);

// Gracefully close RTDB connections on pagehide (recommended over unload)
if (typeof window !== 'undefined') {
  window.addEventListener('pagehide', () => {
    try {
      goOffline(db);
    } catch (_) {
      // ignore
    }
  });
}
export const storage = getStorage(app); // Added storage export