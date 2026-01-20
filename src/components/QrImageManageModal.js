import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { ref as dbRef, onValue, set, remove } from 'firebase/database';

const QrImageManageModal = ({ isOpen, onClose }) => {
  // Add SBI to state objects
  const [loading, setLoading] = useState({ hdfc: false, idfc: false, sbi: false });
  const [files, setFiles] = useState({ hdfc: null, idfc: null, sbi: null });
  const [urls, setUrls] = useState({ hdfc: null, idfc: null, sbi: null });
  const [previews, setPreviews] = useState({ hdfc: null, idfc: null, sbi: null });
  // Show local preview when file is selected
  // Local preview for HDFC
  useEffect(() => {
    if (files.hdfc) {
      const url = URL.createObjectURL(files.hdfc);
      setPreviews(p => ({ ...p, hdfc: url }));
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviews(p => ({ ...p, hdfc: null }));
    }
    // eslint-disable-next-line
  }, [files.hdfc]);
  // Local preview for IDFC
  useEffect(() => {
    if (files.idfc) {
      const url = URL.createObjectURL(files.idfc);
      setPreviews(p => ({ ...p, idfc: url }));
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviews(p => ({ ...p, idfc: null }));
    }
    // eslint-disable-next-line
  }, [files.idfc]);
  // Local preview for SBI
  useEffect(() => {
    if (files.sbi) {
      const url = URL.createObjectURL(files.sbi);
      setPreviews(p => ({ ...p, sbi: url }));
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviews(p => ({ ...p, sbi: null }));
    }
    // eslint-disable-next-line
  }, [files.sbi]);

  // Fetch URLs from Realtime Database on open and subscribe to changes
  useEffect(() => {
    if (!isOpen) return;
    const hdfcRef = dbRef(db, 'qr/hdfc');
    const idfcRef = dbRef(db, 'qr/idfc');
    const sbiRef = dbRef(db, 'qr/sbi');
    const unsubHdfc = onValue(hdfcRef, snap => {
      setUrls(u => ({ ...u, hdfc: snap.exists() ? snap.val() : null }));
    });
    const unsubIdfc = onValue(idfcRef, snap => {
      setUrls(u => ({ ...u, idfc: snap.exists() ? snap.val() : null }));
    });
    const unsubSbi = onValue(sbiRef, snap => {
      setUrls(u => ({ ...u, sbi: snap.exists() ? snap.val() : null }));
    });
    return () => {
      unsubHdfc();
      unsubIdfc();
      unsubSbi();
    };
  }, [isOpen]);

  // Handles upload for HDFC, IDFC, SBI
  const handleUpload = async (bank, file) => {
    if (!file) return;
    setLoading(l => ({ ...l, [bank]: true }));
    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result;
        await set(dbRef(db, `qr/${bank}`), base64);
        setFiles(f => ({ ...f, [bank]: null }));
      };
      reader.readAsDataURL(file);
    } catch {}
    setLoading(l => ({ ...l, [bank]: false }));
  };

  // Handles delete for HDFC, IDFC, SBI
  const handleDelete = async (bank) => {
    setLoading(l => ({ ...l, [bank]: true }));
    try {
      await remove(dbRef(db, `qr/${bank}`));
    } catch {}
    setLoading(l => ({ ...l, [bank]: false }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md relative">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-xl font-bold"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        <h2 className="text-xl font-bold mb-4 text-indigo-700">Manage QR Images</h2>
        {/* HDFC QR */}
        <div className="mb-6">
          <h3 className="font-semibold mb-2 text-indigo-600">HDFC QR</h3>
          {(previews.hdfc || urls.hdfc) ? (
            <div className="mb-2 flex flex-col items-center">
              <img src={previews.hdfc || urls.hdfc} alt="HDFC QR" className="w-32 h-32 object-contain border rounded mb-2" />
              {urls.hdfc && !previews.hdfc && (
                <button
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs font-semibold mb-2"
                  onClick={() => handleDelete('hdfc')}
                  disabled={loading.hdfc}
                >
                  {loading.hdfc ? 'Deleting...' : 'Delete HDFC QR'}
                </button>
              )}
            </div>
          ) : (
            <div className="mb-2 text-center text-gray-500">No HDFC QR uploaded.</div>
          )}
          <div className="flex flex-col items-center">
            <input
              type="file"
              accept="image/*"
              onChange={e => {
                const file = e.target.files[0];
                if (file) {
                  setFiles(f => ({ ...f, hdfc: file }));
                  handleUpload('hdfc', file);
                }
              }}
              className="mb-2"
              disabled={loading.hdfc}
            />
          </div>
        </div>
        {/* SBI QR */}
        <div className="mb-6">
          <h3 className="font-semibold mb-2 text-green-600">SBI QR</h3>
          {(previews.sbi || urls.sbi) ? (
            <div className="mb-2 flex flex-col items-center">
              <img src={previews.sbi || urls.sbi} alt="SBI QR" className="w-32 h-32 object-contain border rounded mb-2" />
              {urls.sbi && !previews.sbi && (
                <button
                  className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-xs font-semibold mb-2"
                  onClick={() => handleDelete('sbi')}
                  disabled={loading.sbi}
                >
                  {loading.sbi ? 'Deleting...' : 'Delete SBI QR'}
                </button>
              )}
            </div>
          ) : (
            <div className="mb-2 text-center text-gray-500">No SBI QR uploaded.</div>
          )}
          <div className="flex flex-col items-center">
            <input
              type="file"
              accept="image/*"
              onChange={e => {
                const file = e.target.files[0];
                if (file) {
                  setFiles(f => ({ ...f, sbi: file }));
                  handleUpload('sbi', file);
                }
              }}
              className="mb-2"
              disabled={loading.sbi}
            />
          </div>
        </div>
        {/* IDFC QR */}
        <div>
          <h3 className="font-semibold mb-2 text-red-600">IDFC QR</h3>
          {(previews.idfc || urls.idfc) ? (
            <div className="mb-2 flex flex-col items-center">
              <img src={previews.idfc || urls.idfc} alt="IDFC QR" className="w-32 h-32 object-contain border rounded mb-2" />
              {urls.idfc && (
                <button
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs font-semibold mb-2"
                  onClick={() => handleDelete('idfc')}
                  disabled={loading.idfc}
                >
                  {loading.idfc ? 'Deleting...' : 'Delete IDFC QR'}
                </button>
              )}
            </div>
          ) : (
            <div className="mb-2 text-center text-gray-500">No IDFC QR uploaded.</div>
          )}
          <div className="flex flex-col items-center">
            <input
              type="file"
              accept="image/*"
              onChange={e => {
                const file = e.target.files[0];
                if (file) {
                  setFiles(f => ({ ...f, idfc: file }));
                  handleUpload('idfc', file);
                }
              }}
              className="mb-2"
              disabled={loading.idfc}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default QrImageManageModal;
