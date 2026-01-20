// src/utils/api.js
// Lightweight API helper used by components. It writes known routes to Firebase
// Realtime Database and falls back to fetch for any other backend route.

import { db } from '../firebase';
import { ref, push, set } from 'firebase/database';

const writeToDb = async (collection, payload) => {
  const nodeRef = push(ref(db, collection));
  const data = {
    ...payload,
    // Ensure a numeric timestamp for indexing/rules
    timestamp: payload?.timestamp ?? Date.now(),
    ...(collection === 'chatbot-submissions' && typeof payload?.message !== 'string'
      ? { message: 'Chatbot submission' }
      : {}),
  };
  await set(nodeRef, data);
  return nodeRef.key;
};

export const api = {
  post: async (path, payload) => {
    try {
      // Handle known logical routes directly via Firebase
      if (path === '/chatbot-submissions') {
        const id = await writeToDb('chatbot-submissions', payload);
        return { ok: true, status: 200, json: async () => ({ id }) };
      }
      if (path === '/popup') {
        // RTDB rules use the node name 'popoForms'
        const id = await writeToDb('popoForms', payload);
        return { ok: true, status: 200, json: async () => ({ id }) };
      }

      // Fallback to standard POST (e.g., your Express server routes under /api)
      const res = await fetch(path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload ?? {}),
      });
      return res;
    } catch (err) {
      console.error('api.post error:', err);
      // Normalize to a Response-like shape expected by callers
      return {
        ok: false,
        status: 500,
        json: async () => ({ error: err?.message || 'Unknown error' }),
      };
    }
  },
};

export default api;
