import React, { useEffect, useRef, useState } from 'react';
import { Trans } from '../../i18nShim';
import { ref, onValue, update, remove } from 'firebase/database';
import { db } from '../../firebase';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../components/admin/LoadingSpinner';

const ComplaintBox = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedDesc, setExpandedDesc] = useState({});
  const [expandedRes, setExpandedRes] = useState({});
  // Delete confirmation dialog state
  const [deleteDialog, setDeleteDialog] = useState({ open: false, complaint: null });
  const deleteBtnRef = useRef(null);

  const isLong = (text) => (text?.length || 0) > 180;
  const toggleDesc = (id) =>
    setExpandedDesc((prev) => ({ ...prev, [id]: !prev[id] }));
  const toggleRes = (id) =>
    setExpandedRes((prev) => ({ ...prev, [id]: !prev[id] }));

  useEffect(() => {
    const complaintsRef = ref(db, 'complaints');
    const unsub = onValue(
      complaintsRef,
      (snapshot) => {
        const data = snapshot.val() || {};
        const list = Object.entries(data).map(([id, v]) => ({ id, ...v }));
        list.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
        setComplaints(list);
        setLoading(false);

        // Auto-delete complaints that are Closed for >= 48 hours
        const now = Date.now();
        const ttlMs = 48 * 60 * 60 * 1000; // 48 hours
        list.forEach((c) => {
          if ((c.status || '').toLowerCase() === 'closed') {
            const baseTime = c.closedAt || c.statusUpdatedAt || c.timestamp || 0;
            if (baseTime && now - baseTime >= ttlMs) {
              remove(ref(db, `complaints/${c.id}`)).catch(() => {});
            }
          }
        });
      },
      (error) => {
        toast.error('Failed to load complaint submissions: ' + error.message);
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);

  const handleStatusChange = (id, newStatus) => {
    const lower = (newStatus || '').toLowerCase();
    // If setting to Closed, show delete confirmation popup
    if (lower === 'closed') {
      const target = complaints.find((c) => c.id === id) || { id };
      setDeleteDialog({ open: true, complaint: target });
      return; // Defer update until user chooses action
    }

    try {
      const complaintRef = ref(db, `complaints/${id}`);
      const now = Date.now();
      const updatePayload = {
        status: newStatus,
        statusUpdatedAt: now,
      };
      if (lower === 'closed') {
        updatePayload.closedAt = now;
      } else {
        // If reopening, clear closedAt
        updatePayload.closedAt = null;
      }
      update(complaintRef, updatePayload);
      toast.success('Status updated');
    } catch (err) {
      toast.error('Failed to update status: ' + (err?.message || err));
    }
  };

  // Actions for delete dialog
  const closeDeleteDialog = () => setDeleteDialog({ open: false, complaint: null });
  const confirmDelete = async () => {
    const id = deleteDialog.complaint?.id;
    if (!id) return closeDeleteDialog();
    try {
      await remove(ref(db, `complaints/${id}`));
      toast.success('Complaint deleted');
    } catch (err) {
      toast.error('Failed to delete: ' + (err?.message || err));
    } finally {
      closeDeleteDialog();
    }
  };
  const justCloseWithoutDelete = async () => {
    const id = deleteDialog.complaint?.id;
    if (!id) return closeDeleteDialog();
    try {
      const now = Date.now();
      await update(ref(db, `complaints/${id}`), {
        status: 'Closed',
        statusUpdatedAt: now,
        closedAt: now,
      });
      toast.success('Status set to Closed');
    } catch (err) {
      toast.error('Failed to close: ' + (err?.message || err));
    } finally {
      closeDeleteDialog();
    }
  };

  // Accessibility: focus and ESC support when dialog is open
  useEffect(() => {
    if (deleteDialog.open) {
      const t = setTimeout(() => deleteBtnRef.current?.focus(), 0);
      const onKey = (e) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          closeDeleteDialog();
        }
      };
      window.addEventListener('keydown', onKey);
      return () => {
        clearTimeout(t);
        window.removeEventListener('keydown', onKey);
      };
    }
  }, [deleteDialog.open]);

  const getStatusBadgeClass = (status) => {
    switch ((status || 'New').toLowerCase()) {
      case 'new':
        return 'bg-blue-500';
      case 'in review':
      case 'in-progress':
      case 'in progress':
        return 'bg-yellow-500';
      case 'resolved':
        return 'bg-green-500';
      case 'closed':
        return 'bg-gray-500';
      default:
        return 'bg-blue-500';
    }
  };

  return (
    <div className="admin-section bg-indigo-50 min-h-screen p-4 sm:p-8">
      <h2 className="text-3xl font-bold mb-6 text-indigo-700"><Trans i18nKey="pages.admin_ComplaintBox.complaint-box-submission">Complaint Box Submission</Trans></h2>
      {loading ? (
        <div className="p-6 bg-white rounded-2xl shadow-2xl border-2 border-indigo-100 flex justify-center"><LoadingSpinner /></div>
      ) : complaints.length === 0 ? (
        <div className="p-6 bg-white rounded-2xl shadow-2xl border-2 border-indigo-100 text-gray-500">No complaints submitted yet.</div>
      ) : (
        <>
          {/* Delete confirmation dialog */}
          {deleteDialog.open && (
            <div
              className="fixed inset-0 z-[12000] flex items-center justify-center p-4"
              role="dialog"
              aria-modal="true"
              aria-labelledby="delete-title"
            >
              <div className="absolute inset-0 bg-black/60" onClick={closeDeleteDialog} />
              <div className="relative w-full max-w-md rounded-lg bg-gray-800 text-gray-100 shadow-xl border border-gray-700">
                <div className="px-5 py-4 border-b border-gray-700">
                  <h3 id="delete-title" className="text-lg font-semibold">Delete complaint?</h3>
                </div>
                <div className="px-5 py-4 space-y-2 text-sm">
                  <p>
                    {deleteDialog.complaint?.name ? (
                      <>
                        You are about to permanently delete the complaint from <span className="font-semibold">{deleteDialog.complaint.name}</span>.
                      </>
                    ) : (
                      <>You are about to permanently delete this complaint.</>
                    )}
                  </p>
                  <p className="text-gray-300">This action cannot be undone.</p>
                </div>
                <div className="px-5 py-4 flex flex-col sm:flex-row gap-2 sm:justify-end bg-gray-800/70 rounded-b-lg">
                  <button
                    ref={deleteBtnRef}
                    onClick={confirmDelete}
                    className="inline-flex items-center justify-center rounded-md bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 px-4 py-2 text-sm font-semibold"
                  >
                    Delete permanently
                  </button>
                  <button
                    onClick={justCloseWithoutDelete}
                    className="inline-flex items-center justify-center rounded-md bg-gray-600 hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300 px-4 py-2 text-sm font-semibold"
                  >
                    Just Close
                  </button>
                  <button
                    onClick={closeDeleteDialog}
                    className="inline-flex items-center justify-center rounded-md border border-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 py-2 text-sm font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
          {/* Desktop / Tablet table */}
          <div className="hidden md:block overflow-x-auto bg-white rounded-2xl shadow-2xl border-2 border-indigo-100 custom-scrollbar">
            <div className="table-responsive">
              <table className="min-w-full text-sm text-left text-gray-700">
                <thead className="bg-indigo-100 text-xs text-indigo-700 uppercase tracking-wider border-b-2 border-indigo-200">
                  <tr>
                    <th className="px-6 py-3">Date</th>
                    <th className="px-6 py-3">Name</th>
                    <th className="px-6 py-3">Email / Client ID</th>
                    <th className="px-6 py-3">Mobile</th>
                    <th className="px-6 py-3">Type</th>
                    <th className="px-6 py-3">Description</th>
                    <th className="px-6 py-3">Preferred Resolution</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {complaints.map((c) => (
                    <tr key={c.id} className="border-b border-indigo-100 hover:bg-indigo-50 align-top transition">
                      <td className="px-6 py-4 whitespace-nowrap">{c.timestamp ? new Date(c.timestamp).toLocaleString() : '-'}</td>
                      <td className="px-6 py-4 font-medium break-words">{c.name || '-'}</td>
                      <td className="px-6 py-4 break-words">{c.email || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{c.mobile || '-'}</td>
                      <td className="px-6 py-4 break-words">{c.complaintType || '-'}</td>
                      <td className="px-6 py-4 max-w-xs">
                        <div
                          className={`relative whitespace-pre-wrap break-words break-all ${
                            expandedDesc[c.id] ? '' : 'max-h-24 overflow-hidden'
                          }`}
                          title={c.description || ''}
                        >
                          {c.description || '-'}
                        </div>
                        {isLong(c.description) && (
                          <button
                            type="button"
                            onClick={() => toggleDesc(c.id)}
                            className="mt-2 text-xs text-indigo-600 hover:text-indigo-500 focus:outline-none"
                          >
                            {expandedDesc[c.id] ? 'Show less' : 'Show more'}
                          </button>
                        )}
                      </td>
                      <td className="px-6 py-4 max-w-xs">
                        <div
                          className={`relative whitespace-pre-wrap break-words break-all ${
                            expandedRes[c.id] ? '' : 'max-h-24 overflow-hidden'
                          }`}
                          title={c.resolution || ''}
                        >
                          {c.resolution || '-'}
                        </div>
                        {isLong(c.resolution) && (
                          <button
                            type="button"
                            onClick={() => toggleRes(c.id)}
                            className="mt-2 text-xs text-indigo-600 hover:text-indigo-500 focus:outline-none"
                          >
                            {expandedRes[c.id] ? 'Show less' : 'Show more'}
                          </button>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold text-white ${getStatusBadgeClass(c.status)}`}>
                          {c.status || 'New'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={c.status || 'New'}
                          onChange={(e) => handleStatusChange(c.id, e.target.value)}
                          className="bg-indigo-50 border border-indigo-200 rounded-md p-1 text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                        >
                          <option value="New">New</option>
                          <option value="In Review">In Review</option>
                          <option value="Resolved">Resolved</option>
                          <option value="Closed">Closed</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-4">
            {complaints.map((c) => (
              <div key={c.id} className="bg-white rounded-2xl shadow-2xl border-2 border-indigo-100 p-4 text-indigo-900">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-sm text-indigo-400">{c.timestamp ? new Date(c.timestamp).toLocaleString() : '-'}</div>
                    <div className="font-semibold">{c.name || '-'}</div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold text-white h-fit ${getStatusBadgeClass(c.status)}`}>
                    {c.status || 'New'}
                  </span>
                </div>

                <div className="mt-2 text-sm break-words break-all"><span className="text-indigo-400">Email/ID:</span> {c.email || '-'}</div>
                <div className="mt-1 text-sm break-words break-all"><span className="text-indigo-400">Mobile:</span> {c.mobile || '-'}</div>
                <div className="mt-1 text-sm break-words break-all"><span className="text-indigo-400">Type:</span> {c.complaintType || '-'}</div>

                <div className="mt-3">
                  <div className="text-indigo-500 text-xs uppercase">Description</div>
                  <div className={`mt-1 text-sm whitespace-pre-wrap break-words break-all ${expandedDesc[c.id] ? '' : 'max-h-24 overflow-hidden'}`}>{c.description || '-'}</div>
                  {isLong(c.description) && (
                    <button
                      type="button"
                      onClick={() => toggleDesc(c.id)}
                      className="mt-1 text-xs text-indigo-600 hover:text-indigo-500"
                    >
                      {expandedDesc[c.id] ? 'Show less' : 'Show more'}
                    </button>
                  )}
                </div>

                <div className="mt-3">
                  <div className="text-indigo-500 text-xs uppercase">Preferred Resolution</div>
                  <div className={`mt-1 text-sm whitespace-pre-wrap break-words break-all ${expandedRes[c.id] ? '' : 'max-h-24 overflow-hidden'}`}>{c.resolution || '-'}</div>
                  {isLong(c.resolution) && (
                    <button
                      type="button"
                      onClick={() => toggleRes(c.id)}
                      className="mt-1 text-xs text-indigo-600 hover:text-indigo-500"
                    >
                      {expandedRes[c.id] ? 'Show less' : 'Show more'}
                    </button>
                  )}
                </div>

                <div className="mt-4">
                  <label className="text-xs text-indigo-400 mr-2">Update status:</label>
                  <select
                    value={c.status || 'New'}
                    onChange={(e) => handleStatusChange(c.id, e.target.value)}
                    className="bg-indigo-50 border border-indigo-200 rounded-md p-2 text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 w-full transition"
                  >
                    <option value="New">New</option>
                    <option value="In Review">In Review</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ComplaintBox;
