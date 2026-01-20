import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { ref, onValue, update, remove } from 'firebase/database';
import { FaWhatsapp } from 'react-icons/fa';
import { toast } from 'react-toastify';

const ChatbotSubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const submissionsRef = ref(db, 'chatbot-submissions');
    const unsubscribe = onValue(submissionsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const cutoff = Date.now() - 72 * 60 * 60 * 1000;
        const entries = Object.entries(data);
        const toDelete = [];
        const keep = [];
        for (const [key, value] of entries) {
          const ts = value?.timestamp ? (typeof value.timestamp === 'number' ? value.timestamp : new Date(value.timestamp).getTime()) : 0;
          if (ts && ts < cutoff) toDelete.push(key);
          else keep.push({ id: key, ...value });
        }
        if (toDelete.length > 0) {
          toDelete.forEach((id) => remove(ref(db, `chatbot-submissions/${id}`)).catch(() => null));
          toast.info(`${toDelete.length} old chatbot submission(s) auto-deleted`);
        }
        const submissionList = keep.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
        setSubmissions(submissionList);
      } else {
        setSubmissions([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleStatusChange = (id, newStatus) => {
    const submissionRef = ref(db, `chatbot-submissions/${id}`);
    update(submissionRef, { status: newStatus });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Delete this submission permanently?');
    if (!confirmed) return;
    try {
      setDeletingId(id);
      await remove(ref(db, `chatbot-submissions/${id}`));
      toast.success('Submission deleted.', { position: 'top-center', autoClose: 1500 });
    } catch (e) {
      console.error('Failed to delete submission:', e);
      toast.error('Failed to delete. Please try again.', { position: 'top-center' });
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <div className="text-center p-10">Loading submissions...</div>;

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="bg-white border border-indigo-200 shadow-lg rounded-xl p-6">
        <h1 className="text-2xl font-bold text-indigo-700 mb-6">Chatbot Submissions</h1>

        {submissions.length === 0 ? (
          <p className="text-sm text-gray-500">No submissions yet.</p>
        ) : (
          <>
            {/* Desktop/table view for sm+ */}
            <div className="hidden sm:block overflow-x-auto rounded-xl">
              <table className="min-w-full text-xs sm:text-sm text-left text-gray-700">
                <thead className="bg-indigo-50 text-xs text-indigo-700 uppercase tracking-wider">
                  <tr>
                    <th scope="col" className="px-6 py-3">Timestamp</th>
                    <th scope="col" className="px-6 py-3">Name</th>
                    <th scope="col" className="px-6 py-3">City</th>
                    <th scope="col" className="px-6 py-3">Address</th>
                    <th scope="col" className="px-6 py-3">Mobile</th>
                    <th scope="col" className="px-6 py-3">Service</th>
                    <th scope="col" className="px-6 py-3">Message</th>
                    <th scope="col" className="px-6 py-3">Status</th>
                    <th scope="col" className="px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((sub) => (
                    <tr key={sub.id} className="border-b border-indigo-50 hover:bg-indigo-50/60">
                      <td className="px-6 py-4 whitespace-nowrap">{new Date(sub.timestamp).toLocaleString()}</td>
                      <td className="px-6 py-4 font-medium break-words">{sub.name}</td>
                      <td className="px-6 py-4 break-words">{sub.city}</td>
                      <td className="px-6 py-4 whitespace-pre-wrap break-words max-w-[12rem] sm:max-w-xs">{sub.address || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <a href={`https://wa.me/91${sub.mobile}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-green-600 hover:text-green-500">
                          <FaWhatsapp />
                          {sub.mobile}
                        </a>
                      </td>
                      <td className="px-6 py-4 break-words">
                        <div className="flex items-center gap-3">
                          <div className="text-sm font-medium break-words">
                            {sub?.service && typeof sub.service === 'object' ? sub.service.title : (sub.service || '-')}
                          </div>
                          {sub?.partial ? (
                            <span className="inline-block text-xs px-2 py-0.5 rounded bg-yellow-400 text-black">Partial</span>
                          ) : null}
                        </div>
                      </td>
                      <td className="px-6 py-4 break-words max-w-[16rem] whitespace-pre-wrap">{sub.message || '-'}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${sub.status === 'New' ? 'bg-blue-500 text-white' : sub.status === 'Contacted' ? 'bg-yellow-500 text-black' : 'bg-green-500 text-white'}`}>
                          {sub.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <select
                            value={sub.status}
                            onChange={(e) => handleStatusChange(sub.id, e.target.value)}
                            className="border border-indigo-200 rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-gray-700 bg-white"
                            disabled={deletingId === sub.id}
                          >
                            <option value="New">New</option>
                            <option value="Contacted">Contacted</option>
                            <option value="Converted">Converted</option>
                            <option value="Closed">Closed</option>
                          </select>
                          <button
                            onClick={() => handleDelete(sub.id)}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md font-semibold shadow disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={deletingId === sub.id}
                            aria-label={`Delete submission ${sub.id}`}
                          >
                            {deletingId === sub.id ? 'Deleting…' : 'Delete'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile stacked cards for small screens */}
            <div className="sm:hidden space-y-3 mt-4">
              {submissions.map((s) => (
                <div key={s.id} className="bg-white border border-indigo-100 rounded-xl p-4 shadow">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-semibold text-indigo-800">{s.name || 'N/A'}</div>
                    <div className="text-xs text-gray-500">{s.timestamp ? new Date(s.timestamp).toLocaleString() : 'N/A'}</div>
                  </div>
                  <div className="text-sm text-gray-700 mb-1"><strong>City:</strong> {s.city || '-'}</div>
                  <div className="text-sm text-gray-700 mb-1"><strong>Address:</strong> {s.address || '-'}</div>
                  <div className="text-sm text-gray-700 mb-1"><strong>Mobile:</strong> <a href={`https://wa.me/91${s.mobile}`} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-500 inline-flex items-center gap-2"><FaWhatsapp />{s.mobile}</a></div>
                  <div className="text-sm text-gray-700 mb-2"><strong>Message:</strong> {s.message || '-'}</div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${s.status === 'New' ? 'bg-blue-500 text-white' : s.status === 'Contacted' ? 'bg-yellow-500 text-black' : 'bg-green-500 text-white'}`}>
                        {s.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <select
                        value={s.status}
                        onChange={(e) => handleStatusChange(s.id, e.target.value)}
                        className="border border-indigo-200 rounded-md p-1 text-sm text-gray-700 bg-white"
                        disabled={deletingId === s.id}
                      >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Converted">Converted</option>
                        <option value="Closed">Closed</option>
                      </select>
                      <button
                        onClick={() => handleDelete(s.id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm font-semibold shadow"
                        disabled={deletingId === s.id}
                      >
                        {deletingId === s.id ? 'Deleting…' : 'Delete'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ChatbotSubmissions;
