import React, { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from '../firebase';
import { FiExternalLink } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const ComplaintsWidget = () => {
  const [latest, setLatest] = useState([]);

  useEffect(() => {
    const complaintsRef = ref(db, 'complaints');
    const unsubscribe = onValue(complaintsRef, (snap) => {
      const data = snap.val() || {};
      const list = Object.entries(data).map(([id, r]) => ({ id, ...r }));
      list.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
      setLatest(list.slice(0, 5));
    });
    return () => { if (typeof unsubscribe === 'function') unsubscribe(); };
  }, []);

  return (
    <div className="mt-6 bg-white/5 rounded-lg p-4 shadow-sm border border-gray-200/10">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold">Recent Complaints</h4>
        <Link to="/admin/complaints" className="text-xs text-indigo-300 hover:underline flex items-center gap-1"><span>View all</span><FiExternalLink /></Link>
      </div>
      {latest.length === 0 ? (
        <p className="text-sm text-gray-400">No complaints yet.</p>
      ) : (
        <ul className="space-y-2 text-sm">
          {latest.map(c => (
            <li key={c.id} className="bg-gray-800/20 p-2 rounded">
              <div className="font-medium text-white truncate">{c.name || '—'}</div>
              <div className="text-xs text-gray-300 truncate">{c.complaintType || '—'} • {c.email || c.mobile || '—'}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ComplaintsWidget;
