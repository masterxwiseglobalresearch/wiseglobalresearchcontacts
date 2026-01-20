import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { ref, onValue, remove } from 'firebase/database';
import { db } from '../../firebase';

const A11yFeedback = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [sortDesc, setSortDesc] = useState(true);

  useEffect(() => {
    const r = ref(db, 'accessibilityFeedback');
    const unsub = onValue(r, (snap) => {
      const val = snap.val() || {};
      const list = Object.entries(val).map(([id, v]) => ({ id, ...v }));
      setItems(list);
      setLoading(false);
    }, () => setLoading(false));
    return () => unsub();
  }, []);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    let list = items.slice();
    if (term) {
      list = list.filter((r) =>
        [r.name, r.email, r.subject, r.message, r.pageUrl, r.type, r.severity, r.device, r.browser, r.assistiveTech]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
          .includes(term)
      );
    }
    list.sort((a, b) => (sortDesc ? (b.timestamp || 0) - (a.timestamp || 0) : (a.timestamp || 0) - (b.timestamp || 0)));
    return list;
  }, [items, q, sortDesc]);

  const exportCsv = useCallback(() => {
    const cols = ['name','email','subject','pageUrl','type','severity','device','browser','assistiveTech','message','timestamp'];
    const lines = [cols.join(',')];
    filtered.forEach((r) => {
      const row = cols.map((c) => {
        const v = c === 'timestamp' ? (r.timestamp ? new Date(r.timestamp).toLocaleString() : '') : (r[c] ?? '');
        const s = String(v).replaceAll('"', '""');
  return `"${s}"`;
      }).join(',');
      lines.push(row);
    });
    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'a11y_feedback.csv'; a.click(); URL.revokeObjectURL(url);
  }, [filtered]);

  const onDelete = useCallback(async (id) => {
    if (!id) return;
    const ok = window.confirm('Delete this feedback entry permanently? This cannot be undone.');
    if (!ok) return;
    try {
      await remove(ref(db, `accessibilityFeedback/${id}`));
    } catch (e) {
      alert('Failed to delete. Please try again.');
    }
  }, []);

  return (
    <div className="admin-section space-y-4 p-4 rounded-2xl shadow-2xl border" style={{ background: '#fff', border: '2px solid #6366f1', boxShadow: '0 8px 32px 0 rgba(60,60,120,0.18), 0 1.5px 8px 0 rgba(99,102,241,0.10)' }}>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center sm:justify-between gap-3">
        <h2 className="text-2xl font-bold text-indigo-700">A11y Feedback</h2>
        <div className="flex gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search..."
            className="rounded-lg border border-indigo-200 bg-white px-3 py-2 text-sm text-indigo-700 placeholder:text-indigo-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition"
          />
          <button onClick={() => setSortDesc((v) => !v)} className="rounded-lg border border-indigo-200 bg-white px-3 py-2 text-sm text-indigo-700 font-semibold hover:bg-indigo-50 transition">Sort {sortDesc ? '↓' : '↑'}</button>
          <button onClick={exportCsv} className="rounded-lg border border-indigo-200 bg-white px-3 py-2 text-sm text-indigo-700 font-semibold hover:bg-indigo-50 transition">Export CSV</button>
        </div>
      </div>

      {loading ? (
        <div className="text-sm text-indigo-400">Loading…</div>
      ) : (
        <>
          <div className="hidden md:block overflow-x-auto rounded-2xl border border-indigo-100 bg-white shadow-2xl">
            <table className="min-w-full divide-y divide-indigo-100">
              <thead className="bg-white">
                <tr>
                  {['Name','Email','Type','Severity','Device','Page','Message','Submitted','Actions'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-indigo-700">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-indigo-50">
                {filtered.map((r) => (
                  <tr key={r.id} className="align-top hover:bg-indigo-50/30">
                    <td className="px-4 py-3 text-sm text-indigo-900 break-words">{r.name || '—'}</td>
                    <td className="px-4 py-3 text-sm text-indigo-900 break-all">{r.email || '—'}</td>
                    <td className="px-4 py-3 text-sm text-indigo-900">{r.type || '—'}</td>
                    <td className="px-4 py-3 text-sm text-indigo-900">{r.severity || '—'}</td>
                    <td className="px-4 py-3 text-sm text-indigo-900">{r.device || '—'}</td>
                    <td className="px-4 py-3 text-sm text-blue-700 underline break-all">{r.pageUrl ? <a href={r.pageUrl} target="_blank" rel="noreferrer">{r.pageUrl}</a> : '—'}</td>
                    <td className="px-4 py-3 text-sm text-indigo-900 max-w-xs truncate break-words" title={r.message}>{r.message || '—'}</td>
                    <td className="px-4 py-3 text-sm text-indigo-900">{r.timestamp ? new Date(r.timestamp).toLocaleString() : '—'}</td>
                    <td className="px-4 py-3 text-sm">
                      <button onClick={() => onDelete(r.id)} className="rounded-lg border border-red-300 bg-white px-2 py-1 text-xs text-red-700 font-semibold hover:bg-red-50 transition">Delete</button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={9} className="px-4 py-10 text-center text-sm text-indigo-400">No records found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="md:hidden space-y-3">
            {filtered.map((r) => (
              <div key={r.id} className="rounded-2xl border border-indigo-100 bg-white p-4 shadow-2xl">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-indigo-700 break-words">{r.name || '—'}</p>
                    <p className="text-xs text-indigo-400">{r.timestamp ? new Date(r.timestamp).toLocaleString() : '—'}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-200">{(r.type || '—')}/{(r.severity || '—')}</span>
                    <button onClick={() => onDelete(r.id)} className="rounded-lg border border-red-300 bg-white px-2 py-1 text-xs text-red-700 font-semibold hover:bg-red-50 transition">Delete</button>
                  </div>
                </div>
                <div className="mt-2 text-xs text-indigo-500 break-all">{r.email}</div>
                {r.pageUrl && <a className="mt-1 inline-block text-sm text-blue-700 underline break-all" href={r.pageUrl} target="_blank" rel="noreferrer">{r.pageUrl}</a>}
                <div className="mt-2 text-sm text-indigo-900 whitespace-pre-wrap">{r.message}</div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="rounded-2xl border-2 border-dashed border-indigo-100 p-8 text-center text-sm text-indigo-400">No records found.</div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default A11yFeedback;
