import React, { useEffect, useMemo, useState } from 'react';
import { background, textColor } from '../themeFallbacks';
import { useTranslation } from '../i18nShim';
import { db } from '../firebase';
import { ref, onValue } from 'firebase/database';

// Use responsive public assets for logo
const logoName = 'wise3';
const logoSrcSetAvif = ['/assets/images/wise3-64.avif 64w','/assets/images/wise3-96.avif 96w','/assets/images/wise3-112.avif 112w','/assets/images/wise3-128.avif 128w','/assets/images/wise3-256.avif 256w'].join(', ');
const logoSrcSetWebp = ['/assets/images/wise3-64.webp 64w','/assets/images/wise3-96.webp 96w','/assets/images/wise3-112.webp 112w','/assets/images/wise3-128.webp 128w','/assets/images/wise3-256.webp 256w'].join(', ');

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

function formatDate(value) {
  if (!value) return '-';
  try {
    const ts = typeof value === 'number' ? value : Date.parse(value);
    if (Number.isNaN(ts)) return '-';
    return new Date(ts).toLocaleString();
  } catch {
    return '-';
  }
}

const SortIcon = ({ dir }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="ml-1 h-4 w-4 inline-block align-middle">
    {dir === 'asc' ? (
      <path d="M10 3l4 5H6l4-5zm0 14l-4-5h8l-4 5z" />
    ) : (
      <path d="M10 3l4 5H6l4-5zm0 14l-4-5h8l-4 5z" className="transform rotate-180 origin-center" />
    )}
  </svg>
);

const BurgerIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={classNames('h-6 w-6', props.className)}>
    <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const CloseIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={classNames('h-6 w-6', props.className)}>
    <path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const DownloadIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={classNames('h-5 w-5', props.className)}>
    <path d="M12 3v10m0 0l4-4m-4 4L8 9M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const AdminPanel = () => {
  const { t } = useTranslation();


  const [entries, setEntries] = useState([]);
  const [submissions, setSubmissions] = useState({});
  const [a11yFeedback, setA11yFeedback] = useState({});

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('contacts');
  const [query, setQuery] = useState('');
  const [sortKey, setSortKey] = useState('timestamp');
  const [sortDir, setSortDir] = useState('desc');

  useEffect(() => {
    const entriesRef = ref(db, 'contactEntries');
    const unsubscribe = onValue(
      entriesRef,
      (snapshot) => {
        const data = snapshot.val() || {};
        const list = Object.entries(data).map(([id, record]) => ({ id, ...record }));
        setEntries(list);
      },
      (error) => {
        console.error('Failed to load submissions:', error);
      }
    );
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const submissionsRef = ref(db, 'homeFormSubmissions');
    const unsubscribeSubmissions = onValue(submissionsRef, (snapshot) => {
      setSubmissions(snapshot.val() || {});
    });
    return () => {
      if (typeof unsubscribeSubmissions === 'function') unsubscribeSubmissions();
    };
  }, []);

  useEffect(() => {
    const a11yRef = ref(db, 'accessibilityFeedback');
    const unsub = onValue(a11yRef, (snapshot) => {
      setA11yFeedback(snapshot.val() || {});
    }, (err) => console.error('Failed to load a11y feedback:', err));
    return () => { if (typeof unsub === 'function') unsub(); };
  }, []);

  const filteredEntries = useMemo(() => {
    const q = query.trim().toLowerCase();
    const base = entries || [];
    const filtered = q
      ? base.filter((e) => {
          const haystack = [e.name, e.mobile, e.city, e.experience, e.email]
            .filter(Boolean)
            .join(' ')
            .toLowerCase();
          return haystack.includes(q);
        })
      : base;
    const safeGet = (obj, key) => (obj?.[key] ?? obj?.[key?.toLowerCase?.()] ?? null);
    const getTs = (e) => {
      const v = e.timestamp ?? e.createdAt ?? e.created_at ?? e.time ?? e.date ?? null;
      if (!v) return 0;
      return typeof v === 'number' ? v : Date.parse(v) || 0;
    };
    const getVal = (e, key) => {
      if (key === 'timestamp') return getTs(e);
      const v = safeGet(e, key);
      return typeof v === 'string' ? v.toLowerCase() : v ?? '';
    };
    const sorted = [...filtered].sort((a, b) => {
      const va = getVal(a, sortKey);
      const vb = getVal(b, sortKey);
      if (va < vb) return sortDir === 'asc' ? -1 : 1;
      if (va > vb) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [entries, query, sortKey, sortDir]);

  const homeFormList = useMemo(() => {
    const data = submissions || {};
    return Object.entries(data).map(([id, record]) => ({ id, ...record }));
  }, [submissions]);

  const a11yList = useMemo(() => {
    const data = a11yFeedback || {};
    return Object.entries(data).map(([id, record]) => ({ id, ...record })).sort((a,b)=> (b.timestamp||0)-(a.timestamp||0));
  }, [a11yFeedback]);

  const toggleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const downloadCsv = () => {
    const cols = ['name', 'mobile', 'city', 'experience', 'newsletter', 'timestamp'];
    const lines = [cols.join(',')];
    filteredEntries.forEach((e) => {
      const row = cols
        .map((c) => {
          let v = e[c];
          if (c === 'timestamp') v = formatDate(e.timestamp ?? e.createdAt ?? e.time);
          if (typeof v === 'boolean') v = v ? 'Yes' : 'No';
          if (v == null) v = '';
          const s = String(v).replaceAll('"', '""');
          return `"${s}"`;
        })
        .join(',');
      lines.push(row);
    });
    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'contact_submissions.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className="min-h-screen flex"
      style={{ background: background, color: textColor, transition: 'background 0.5s ease-in-out, color 0.5s ease-in-out' }}
    >
      <div className={classNames(
        'fixed inset-y-0 left-0 z-40 w-72 transform bg-white shadow-lg transition-transform duration-200 ease-in-out md:translate-x-0 md:static md:inset-auto',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="h-full flex flex-col">
          <div className="flex items-center gap-3 px-4 py-4 border-b">
            <picture>
              <source type="image/avif" srcSet={logoSrcSetAvif} sizes="40px" />
              <source type="image/webp" srcSet={logoSrcSetWebp} sizes="40px" />
              <img src={`/assets/images/${logoName}.png`} alt="Logo" className="h-10 w-10 object-contain rounded" loading="eager" decoding="async" fetchpriority="high" importance="high" width="40" height="40" />
            </picture>
            <div>
              <p className="font-semibold text-gray-900">Wise Global Admin</p>
              <p className="text-xs text-gray-500">Research Services</p>
            </div>
            <button
              className="ml-auto md:hidden inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close menu"
            >
              <CloseIcon />
            </button>
          </div>
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            <button
              className={classNames(
                'w-full flex items-center gap-2 rounded-md px-3 py-2 text-left text-sm font-medium',
                activeTab === 'contacts' ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-100'
              )}
              onClick={() => {
                setActiveTab('contacts');
                setSidebarOpen(false);
              }}
            >
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
              {t('admin.contactSubmissions')}
            </button>
            <button
              className={classNames(
                'w-full flex items-center gap-2 rounded-md px-3 py-2 text-left text-sm font-medium',
                activeTab === 'homeform' ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-100'
              )}
              onClick={() => {
                setActiveTab('homeform');
                setSidebarOpen(false);
              }}
            >
              <span className="inline-block h-2 w-2 rounded-full bg-indigo-500" />
              Home Form Submissions
              <span className="ml-auto text-xs text-gray-500 font-normal">{homeFormList.length}</span>
            </button>
            <button
              className={classNames(
                'w-full flex items-center gap-2 rounded-md px-3 py-2 text-left text-sm font-medium',
                activeTab === 'a11y' ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-100'
              )}
              onClick={() => {
                setActiveTab('a11y');
                setSidebarOpen(false);
              }}
            >
              <span className="inline-block h-2 w-2 rounded-full bg-amber-500" />
              A11y Feedback
              <span className="ml-auto text-xs text-gray-500 font-normal">{a11yList.length}</span>
            </button>
          </nav>
          <div className="p-4 border-t text-xs text-gray-500">
            © {new Date().getFullYear()} Wise Global Research
          </div>
        </div>
      </div>

      <div className="flex-1 min-w-0 md:ml-0">
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b">
          <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-3">
            <button
              className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              <BurgerIcon />
            </button>
            <div className="flex items-center gap-3">
              <img src={`/assets/images/${logoName}.png`} alt="Logo" className="h-7 w-7 object-contain rounded" />
              <span className="font-semibold text-gray-900 hidden sm:block">Admin Dashboard</span>
            </div>
            <div className="ml-auto flex items-center gap-2">
              {activeTab === 'contacts' && (
                <button
                  onClick={downloadCsv}
                  className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  <DownloadIcon />
                  Export CSV
                </button>
              )}
              {activeTab === 'a11y' && (
                <button
                  onClick={() => {
                    const cols = ['name','email','subject','pageUrl','type','severity','device','browser','assistiveTech','message','timestamp'];
                    const lines = [cols.join(',')];
                    a11yList.forEach((r)=>{
                      const row = cols.map((c)=>{
                        const v = c==='timestamp' ? formatDate(r.timestamp) : (r[c] ?? '');
                        const s = String(v).replaceAll('"','""');
                        return `"${s}"`;
                      }).join(',');
                      lines.push(row);
                    });
                    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url; a.download = 'a11y_feedback.csv'; a.click(); URL.revokeObjectURL(url);
                  }}
                  className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  <DownloadIcon />
                  Export CSV
                </button>
              )}
            </div>
          </div>
        </header>

        <main className="px-4 sm:px-6 lg:px-8 py-6">
          {activeTab === 'contacts' ? (
            <section>
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="flex items-baseline gap-3">
                  <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">{t('admin.contactSubmissions')}</h1>
                  <span className="text-sm text-gray-500">{filteredEntries.length} records</span>
                </div>
                <div className="relative w-full md:w-80">
                  <input
                    type="text"
                    placeholder="Search name, mobile, city..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 pr-10 text-sm placeholder:text-gray-400 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
                  />
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.9 14.32a8 8 0 111.414-1.414l4.387 4.387a1 1 0 01-1.414 1.415l-4.387-4.388zM14 8a6 6 0 11-12 0 6 6 0 0112 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                </div>
              </div>

              <div className="mt-4 hidden md:block">
                <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        {[
                          { key: 'name', label: t('admin.table.name') },
                          { key: 'mobile', label: t('admin.table.mobile') },
                          { key: 'city', label: t('admin.table.city') },
                          { key: 'experience', label: t('admin.table.experience') },
                          { key: 'newsletter', label: t('admin.table.newsletter') },
                          { key: 'timestamp', label: t('admin.table.submittedAt') },
                        ].map((col) => (
                          <th
                            key={col.key}
                            scope="col"
                            className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 select-none"
                          >
                            <button
                              className="inline-flex items-center gap-1 hover:text-gray-900"
                              onClick={() => toggleSort(col.key)}
                            >
                              {col.label}
                              {sortKey === col.key && <SortIcon dir={sortDir} />}
                            </button>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredEntries.map((e) => (
                        <tr key={e.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-gray-900">{e.name || '-'}</td>
                          <td className="px-4 py-3 text-sm text-gray-700 break-words">{e.mobile || '-'}</td>
                          <td className="px-4 py-3 text-sm text-gray-700 break-words">{e.city || '-'}</td>
                          <td className="px-4 py-3 text-sm text-gray-700 break-words">{e.experience || '-'}</td>
                          <td className="px-4 py-3 text-sm text-gray-700">{e.newsletter ? t('common.yes') : t('common.no')}</td>
                          <td className="px-4 py-3 text-sm text-gray-700">{formatDate(e.timestamp ?? e.createdAt ?? e.time)}</td>
                        </tr>
                      ))}
                      {filteredEntries.length === 0 && (
                        <tr>
                          <td colSpan={6} className="px-4 py-10 text-center text-sm text-gray-500">
                            No records found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mt-4 space-y-3 md:hidden">
                {filteredEntries.map((e) => (
                  <div key={e.id} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 break-words">{e.name || '-'}</p>
                        <p className="text-xs text-gray-500">{formatDate(e.timestamp ?? e.createdAt ?? e.time)}</p>
                      </div>
                      <span className={classNames(
                        'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
                        e.newsletter ? 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200' : 'bg-gray-50 text-gray-600 ring-1 ring-inset ring-gray-200'
                      )}>
                        {e.newsletter ? t('common.yes') : t('common.no')} Newsletter
                      </span>
                    </div>
                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-gray-500">Mobile</p>
                        <p className="font-medium text-gray-900 break-words">{e.mobile || '-'}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">City</p>
                        <p className="font-medium text-gray-900 break-words">{e.city || '-'}</p>
                      </div>
                      <div className="col-span-1 sm:col-span-2">
                        <p className="text-gray-500">Experience</p>
                        <p className="font-medium text-gray-900 break-words">{e.experience || '-'}</p>
                      </div>
                    </div>
                  </div>
                ))}
                {filteredEntries.length === 0 && (
                  <div className="rounded-lg border border-dashed border-gray-200 p-8 text-center text-sm text-gray-500">
                    No records found.
                  </div>
                )}
              </div>
            </section>
          ) : activeTab === 'homeform' ? (
            <section>
              <div className="flex items-baseline justify-between gap-3">
                <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Home Form Submissions</h1>
                <span className="text-sm text-gray-500">{homeFormList.length} records</span>
              </div>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {homeFormList.map((item) => (
                  <div key={item.id} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 break-words">{item.name || '—'}</p>
                        <p className="text-xs text-gray-500">{formatDate(item.timestamp ?? item.createdAt ?? item.time)}</p>
                      </div>
                      {item.city && (
                        <span className="inline-flex items-center rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-200">
                          {item.city}
                        </span>
                      )}
                    </div>
                    <div className="mt-3 space-y-1 text-sm">
                      {Object.entries(item).map(([k, v]) => {
                        if (['id', 'timestamp', 'createdAt', 'time', 'name', 'city'].includes(k)) return null;
                        return (
                          <div key={k} className="flex items-start justify-between gap-3">
                            <span className="text-gray-500 capitalize break-words">{k.replace(/[_-]/g, ' ')}</span>
                            <span className="font-medium text-gray-900 break-words sm:truncate sm:max-w-[60%] text-right">{String(v)}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
                {homeFormList.length === 0 && (
                  <div className="rounded-lg border border-dashed border-gray-200 p-8 text-center text-sm text-gray-500">
                    No records available.
                  </div>
                )}
              </div>
            </section>
          ) : (
            <section>
              <div className="flex items-baseline justify-between gap-3">
                <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">A11y Feedback</h1>
                <span className="text-sm text-gray-500">{a11yList.length} records</span>
              </div>
              <div className="mt-4 hidden md:block">
                <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        {['Name','Email','Type','Severity','Device','Page','Submitted'].map((h)=> (
                          <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {a11yList.map((r)=> (
                        <tr key={r.id} className="hover:bg-gray-50 align-top">
                          <td className="px-4 py-3 text-sm text-gray-900 break-words">{r.name || '-'}</td>
                          <td className="px-4 py-3 text-sm text-gray-700 break-words">{r.email || '-'}</td>
                          <td className="px-4 py-3 text-sm text-gray-700">{r.type || '-'}</td>
                          <td className="px-4 py-3 text-sm text-gray-700">{r.severity || '-'}</td>
                          <td className="px-4 py-3 text-sm text-gray-700">{r.device || '-'}</td>
                          <td className="px-4 py-3 text-sm text-blue-700 underline break-all"><a href={r.pageUrl} target="_blank" rel="noreferrer">{r.pageUrl || '—'}</a></td>
                          <td className="px-4 py-3 text-sm text-gray-700">{formatDate(r.timestamp)}</td>
                        </tr>
                      ))}
                      {a11yList.length === 0 && (
                        <tr>
                          <td colSpan={7} className="px-4 py-10 text-center text-sm text-gray-500">No records available.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="mt-4 space-y-3 md:hidden">
                {a11yList.map((r)=> (
                  <div key={r.id} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 break-words">{r.name || '—'}</p>
                        <p className="text-xs text-gray-500">{formatDate(r.timestamp)}</p>
                      </div>
                      <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-200">{r.type}/{r.severity}</span>
                    </div>
                    <div className="mt-2 text-xs text-gray-600 break-all">{r.email}</div>
                    {r.pageUrl && <a className="mt-1 inline-block text-sm text-blue-700 underline break-all" href={r.pageUrl} target="_blank" rel="noreferrer">{r.pageUrl}</a>}
                    <div className="mt-2 text-sm text-gray-900 whitespace-pre-wrap">{r.message}</div>
                  </div>
                ))}
                {a11yList.length === 0 && (
                  <div className="rounded-lg border border-dashed border-gray-200 p-8 text-center text-sm text-gray-500">No records available.</div>
                )}
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminPanel;