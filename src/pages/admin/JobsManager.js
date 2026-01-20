import React, { useEffect, useMemo, useState } from 'react';
import { auth, db } from '../../firebase';
import { ref as dbRef, onValue, push, remove, set, update, query, orderByChild, equalTo } from 'firebase/database';
import { toast } from 'react-toastify';
import { FaPlus, FaTrash, FaEdit, FaList } from 'react-icons/fa';

const emptyJob = { title: '', location: '', description: '', requirements: '', active: true };

export default function JobsManager() {
  const [jobs, setJobs] = useState({});
  const [form, setForm] = useState(emptyJob);
  const [editingId, setEditingId] = useState(null);
  const [viewAppsFor, setViewAppsFor] = useState(null); // jobId to view applications
  const [apps, setApps] = useState([]);
  const [loadingApps, setLoadingApps] = useState(false);
  const [appsError, setAppsError] = useState('');
  const appsUnsubRef = React.useRef(null);

  useEffect(() => {
    const r = dbRef(db, 'jobs');
    const off = onValue(r, (snap) => {
      setJobs(snap.val() || {});
    });
    return () => off();
  }, []);

  const jobList = useMemo(() => Object.entries(jobs).map(([id, j]) => ({ id, ...j })), [jobs]);

  const resetForm = () => { setForm(emptyJob); setEditingId(null); };

  const saveJob = async (e) => {
    e.preventDefault();
    try {
    const uid = auth.currentUser ? auth.currentUser.uid : null;
      const payload = {
        title: String(form.title || ''),
        location: String(form.location || ''),
        description: String(form.description || ''),
        requirements: String(form.requirements || ''), // comma or newline separated
        active: Boolean(form.active),
  updatedAt: Date.now(),
  updatedBy: uid,
      };
      if (editingId) {
        await update(dbRef(db, `jobs/${editingId}`), payload);
        toast.success('Job updated');
      } else {
        const node = push(dbRef(db, 'jobs'));
  await set(node, { ...payload, createdAt: Date.now(), createdBy: uid });
        toast.success('Job created');
      }
      resetForm();
    } catch (e) {
      toast.error(`Failed to save job: ${e?.message || e}`);
    }
  };

  const editJob = (job) => {
    setEditingId(job.id);
    setForm({
      title: job.title || '',
      location: job.location || '',
      description: job.description || '',
      requirements: Array.isArray(job.requirements) ? job.requirements.join('\n') : (job.requirements || ''),
      active: job.active !== false,
    });
  };

  const deleteJob = async (id) => {
    if (!window.confirm('Delete this job? Applications remain in submissions.')) return;
    try { await remove(dbRef(db, `jobs/${id}`)); toast.success('Job deleted'); }
    catch (e) { toast.error(`Failed: ${e?.message || e}`); }
  };

  // Delete a single application by id
  const deleteApplication = async (appId) => {
    if (!window.confirm('Delete this application? This cannot be undone.')) return;
    try {
      await remove(dbRef(db, `jobApplications/${appId}`));
      setApps((prev) => prev.filter((a) => a.id !== appId));
      toast.success('Application deleted');
    } catch (e) {
      toast.error(`Failed to delete application: ${e?.message || e}`);
    }
  };

  const loadApplications = async (jobId) => {
    // Clean previous listener if any
    if (appsUnsubRef.current) {
      try { appsUnsubRef.current(); } catch (_) {}
      appsUnsubRef.current = null;
    }
    setViewAppsFor(jobId);
    setApps([]);
    setAppsError('');
    setLoadingApps(true);
    try {
      // Read from jobApplications filtered by jobId
      const q = query(dbRef(db, 'jobApplications'), orderByChild('jobId'), equalTo(jobId));
      const unsub = onValue(
        q,
        (snap) => {
          const val = snap.val() || {};
          const cutoff = Date.now() - 72 * 60 * 60 * 1000; // 72 hours
          const entries = Object.entries(val);
          const toDelete = [];
          const keep = [];
          for (const [id, v] of entries) {
            const ts = v?.timestamp || 0;
            if (ts && ts < cutoff) toDelete.push(id);
            else keep.push({ id, ...v });
          }
          if (toDelete.length > 0) {
            // remove old entries (fire-and-forget)
            toDelete.forEach((id) => remove(dbRef(db, `jobApplications/${id}`)).catch(()=>null));
            toast.info(`${toDelete.length} old application(s) auto-deleted`);
          }
          const list = keep.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
          setApps(list);
          setAppsError('');
          setLoadingApps(false);
        },
        (err) => {
          const msg = err?.message || String(err);
          setAppsError(msg);
          toast.error(msg);
          setLoadingApps(false);
        }
      );
      appsUnsubRef.current = unsub;
    } catch (e) {
      const msg = e?.message || String(e);
      setAppsError(msg);
      toast.error(`Failed to load applications: ${msg}`);
      setLoadingApps(false);
    }
  };

  // Cleanup listener on unmount
  useEffect(() => {
    return () => {
      if (appsUnsubRef.current) {
        try { appsUnsubRef.current(); } catch (_) {}
        appsUnsubRef.current = null;
      }
    };
  }, []);

  return (
    <div className="admin-section text-black">
      {/* Page Heading */}
      <h1 className="text-3xl font-bold mb-6 text-indigo-700">Jobs Manager</h1>

      {/* Create / Edit Form */}
      <form
        onSubmit={saveJob}
        className="rounded-2xl shadow-2xl border p-6 grid grid-cols-1 md:grid-cols-2 gap-4"
        style={{ background: '#fff', border: '2px solid #6366f1', boxShadow: '0 8px 32px 0 rgba(60,60,120,0.18), 0 1.5px 8px 0 rgba(99,102,241,0.10)' }}
      >
        <div>
          <label htmlFor="job-title" className="block text-sm font-medium text-indigo-700 mb-1">Title</label>
          <input
            id="job-title"
            name="job-title"
            className="w-full p-2 rounded border border-indigo-200 focus:ring-2 focus:ring-indigo-400 focus:outline-none text-gray-900 bg-white"
            value={form.title}
            onChange={e=>setForm({...form,title:e.target.value})}
            required
          />
        </div>
        <div>
          <label htmlFor="job-location" className="block text-sm font-medium text-indigo-700 mb-1">Location</label>
          <input
            id="job-location"
            name="job-location"
            className="w-full p-2 rounded border border-indigo-200 focus:ring-2 focus:ring-indigo-400 focus:outline-none text-gray-900 bg-white"
            value={form.location}
            onChange={e=>setForm({...form,location:e.target.value})}
            required
          />
        </div>
        <div className="md:col-span-2">
          <label htmlFor="job-description" className="block text-sm font-medium text-indigo-700 mb-1">Description</label>
          <textarea
            id="job-description"
            name="job-description"
            className="w-full p-2 rounded border border-indigo-200 focus:ring-2 focus:ring-indigo-400 focus:outline-none text-gray-900 bg-white"
            rows={3}
            value={form.description}
            onChange={e=>setForm({...form,description:e.target.value})}
          />
        </div>
        <div className="md:col-span-2">
          <label htmlFor="job-requirements" className="block text-sm font-medium text-indigo-700 mb-1">Requirements (one per line)</label>
          <textarea
            id="job-requirements"
            name="job-requirements"
            className="w-full p-2 rounded border border-indigo-200 focus:ring-2 focus:ring-indigo-400 focus:outline-none text-gray-900 bg-white"
            rows={4}
            value={form.requirements}
            onChange={e=>setForm({...form,requirements:e.target.value})}
          />
        </div>
        <label htmlFor="job-active" className="inline-flex items-center gap-2 text-indigo-700 font-medium">
          <input
            id="job-active"
            name="job-active"
            type="checkbox"
            checked={form.active}
            onChange={e=>setForm({...form,active:e.target.checked})}
            className="accent-indigo-600"
          />
          <span>Active</span>
        </label>
        <div className="md:col-span-2 flex gap-2 mt-2">
          <button
            className="px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-700 text-white font-semibold flex items-center gap-2 shadow"
            type="submit"
          >
            {editingId ? (<><FaEdit/> Update</>) : (<><FaPlus/> Create</>)}
          </button>
          {editingId && (
            <button
              type="button"
              className="px-3 py-2 rounded bg-indigo-100 hover:bg-indigo-200 text-indigo-700 font-semibold"
              onClick={resetForm}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Jobs List */}
  <div className="rounded-2xl shadow-2xl border" style={{ background: '#fff', border: '2px solid #6366f1', boxShadow: '0 8px 32px 0 rgba(60,60,120,0.18), 0 1.5px 8px 0 rgba(99,102,241,0.10)' }}>
        <div className="p-4 flex items-center justify-between border-b border-indigo-100">
          <div className="font-semibold text-indigo-700">All Jobs</div>
          <div>
            <button
              className="px-3 py-2 rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-700 flex items-center gap-2 text-sm font-semibold border border-indigo-200"
              onClick={() => loadApplications('general')}
            >
              <FaList/> General Applications
            </button>
          </div>
        </div>
        <div>
          {jobList.length === 0 && (
            <div className="p-4 text-gray-500">No jobs yet. Create one above.</div>
          )}
          <ul className="p-0 divide-y divide-indigo-50">
            {jobList.map(job => (
              <li key={job.id} className="p-4 flex flex-col md:flex-row md:items-center gap-3 md:gap-6">
                <div className="flex-1">
                  <div className="font-bold text-indigo-800">
                    {job.title} {job.active === false && <span className="ml-2 text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded">Inactive</span>}
                  </div>
                  <div className="text-indigo-700 text-sm">{job.location}</div>
                  <div className="text-gray-700 text-sm line-clamp-2">{job.description}</div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="px-3 py-2 rounded bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2 font-semibold shadow"
                    onClick={()=>editJob(job)}
                  >
                    <FaEdit/> Edit
                  </button>
                  <button
                    type="button"
                    className="px-3 py-2 rounded bg-red-600 hover:bg-red-700 text-white flex items-center gap-2 font-semibold shadow"
                    onClick={()=>deleteJob(job.id)}
                  >
                    <FaTrash/> Delete
                  </button>
                  <button
                    type="button"
                    className="px-3 py-2 rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-700 flex items-center gap-2 font-semibold border border-indigo-200"
                    onClick={()=>loadApplications(job.id)}
                  >
                    <FaList/> Applications
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Applications drawer */}
      {viewAppsFor && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30">
          <div className="rounded-2xl shadow-2xl border w-full max-w-2xl mx-auto" style={{ background: '#fff', border: '2px solid #6366f1', boxShadow: '0 8px 32px 0 rgba(60,60,120,0.18), 0 1.5px 8px 0 rgba(99,102,241,0.10)' }}>
            <div className="p-4 border-b border-indigo-100 flex items-center justify-between">
              <div className="font-semibold text-indigo-700">
                {viewAppsFor === 'general' ? 'General Applications' : (`Applications for ${jobs?.[viewAppsFor]?.title || `Job #${viewAppsFor}`}`)}
              </div>
              <button
                className="text-sm underline text-indigo-600 hover:text-indigo-800"
                onClick={() => {
                  if (appsUnsubRef.current) {
                    try { appsUnsubRef.current(); } catch (_) {}
                    appsUnsubRef.current = null;
                  }
                  setViewAppsFor(null);
                  setApps([]);
                  setAppsError('');
                }}
              >
                Close
              </button>
            </div>
            {loadingApps ? (
              <div className="p-4">Loading…</div>
            ) : (
              <div className="divide-y divide-indigo-50">
                {appsError && (
                  <div className="p-4 text-red-500 text-sm">{appsError}</div>
                )}
                {apps.length === 0 && <div className="p-4 text-gray-500">No applications yet.</div>}
                {apps.map(a => (
                  <div key={a.id} className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-semibold text-indigo-800">{a.name} • {a.email} • {a.phone}</div>
                        <div className="text-gray-500 text-sm mb-2">{new Date(a.timestamp||0).toLocaleString()}</div>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <button type="button" className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm text-white font-semibold" onClick={()=>deleteApplication(a.id)}>Delete</button>
                      </div>
                    </div>
                    {a.resumeData && a.resumeMeta && (
                      <a
                        className="text-indigo-600 underline hover:text-indigo-800"
                        href={`data:${a.resumeMeta.contentType||'application/octet-stream'};base64,${a.resumeData}`}
                        download={a.resumeMeta.name || 'resume'}
                      >
                        Download Resume
                      </a>
                    )}
                    {a.whyHire && <p className="mt-2 whitespace-pre-wrap text-gray-700">{a.whyHire}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
