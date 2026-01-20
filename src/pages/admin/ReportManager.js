import React, { useState, useEffect } from 'react';
import { Trans } from '../../i18nShim';
import { ref, onValue, push, remove } from 'firebase/database';
import { motion } from 'framer-motion';
import { FiUpload, FiEye, FiTrash2 } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { db, auth } from '../../firebase';
import PropTypes from 'prop-types';

import LoadingSpinner from '../../components/admin/LoadingSpinner';
import ConfirmationModal from '../../components/admin/ConfirmationModal';

const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const buttonVariants = {
  hover: { scale: 1.05 },
  tap: { scale: 0.95 },
};

const WEEK_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const REPORT_CATEGORIES = ['Market', 'Technical', 'Financial', 'Competitor', 'Other'];

const ReportUploadCard = ({ day, reports, onUpload, onDelete, onPreview }) => {
  const [newReport, setNewReport] = useState({ title: '', description: '', category: 'Market', file: null });
  const [uploading, setUploading] = useState(false);
  const [lastOtp, setLastOtp] = useState('');

  const handleUpload = async () => {
    if (!newReport.file) {
      toast.error('Please select a file.');
      return;
    }
    // 10MB size limit
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (newReport.file.size > maxSize) {
      toast.error('File size must be 10MB or less.');
      return;
    }
    setUploading(true);
    try {
      const result = await onUpload(day, newReport);
      if (result?.otp) setLastOtp(result.otp);
      setNewReport({ title: '', description: '', category: 'Market', file: null });
      const fileInput = document.getElementById(`file-input-${day}`);
      if (fileInput) fileInput.value = '';
    } catch (error) {
      toast.error(`Failed to upload report: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <motion.div
      className="rounded-2xl shadow-2xl border p-6 flex flex-col gap-4"
      style={{ background: '#fff', border: '2px solid #6366f1', boxShadow: '0 8px 32px 0 rgba(60,60,120,0.18), 0 1.5px 8px 0 rgba(99,102,241,0.10)' }}
      variants={itemVariants}
    >
      <h4 className="text-xl font-bold text-indigo-700 mb-2 tracking-wide">{day}</h4>
      <div className="mb-2 space-y-3">
        <input
          type="text"
          placeholder="Report Title"
          className="w-full p-3 rounded-lg border border-indigo-200 bg-indigo-50 text-indigo-900 placeholder-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          value={newReport.title}
          onChange={(e) => setNewReport({ ...newReport, title: e.target.value })}
        />
        <textarea
          placeholder="Report Description"
          className="w-full p-3 rounded-lg border border-indigo-200 bg-indigo-50 text-indigo-900 placeholder-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          rows="3"
          value={newReport.description}
          onChange={(e) => setNewReport({ ...newReport, description: e.target.value })}
        />
        <select
          className="w-full p-3 rounded-lg border border-indigo-200 bg-indigo-50 text-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          value={newReport.category}
          onChange={(e) => setNewReport({ ...newReport, category: e.target.value })}
        >
          {REPORT_CATEGORIES.map((cat) => (
            <option key={cat} value={cat} className="text-indigo-900">{cat}</option>
          ))}
        </select>
        <input
          id={`file-input-${day}`}
          type="file"
          accept=".pdf"
          className="w-full p-3 border border-indigo-200 rounded-lg bg-indigo-50 text-indigo-900 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:bg-indigo-600 file:text-white file:border-0 file:hover:bg-indigo-700"
          onChange={(e) => setNewReport({ ...newReport, file: e.target.files[0] })}
        />
        <motion.button
          onClick={handleUpload}
          disabled={uploading}
          className="w-full px-4 py-2 bg-gradient-to-r from-indigo-500 to-indigo-700 text-white rounded-lg shadow flex items-center justify-center gap-2 font-semibold text-base disabled:opacity-50"
          variants={buttonVariants}
          whileHover="hover"
        >
          <FiUpload /> {uploading ? 'Uploading...' : 'Upload'}
        </motion.button>
        {lastOtp && (
          <div className="mt-2 text-sm text-emerald-700">
            <span className="inline-flex items-center px-2 py-1 rounded bg-emerald-100 border border-emerald-200">New OTP: <strong className="ml-1 tracking-widest">{lastOtp}</strong></span>
          </div>
        )}
      </div>
      <div>
        <h5 className="text-sm font-semibold text-indigo-700 mb-2"><Trans i18nKey="pages.admin_ReportManager.uploaded-reports">Uploaded Reports</Trans></h5>
        {reports[day]?.length > 0 ? (
          <ul className="space-y-2">
            {reports[day].map((report) => (
              <motion.li
                key={report.id}
                className="flex justify-between items-center p-3 bg-indigo-50 border border-indigo-100 rounded-lg"
                variants={itemVariants}
              >
                <div className="min-w-0">
                  <p className="text-sm text-indigo-900 font-medium truncate" title={report.title}>{report.title}</p>
                  {report.otp && (
                    <p className="text-xs text-emerald-700 mt-1">OTP: <span className="font-mono tracking-widest">{report.otp}</span></p>
                  )}
                </div>
                <div className="flex gap-2">
                  <motion.button
                    onClick={() => onPreview(report)}
                    className="text-indigo-600 hover:text-indigo-800"
                    variants={buttonVariants}
                    whileHover="hover"
                  >
                    <FiEye size={16} />
                  </motion.button>
                  <motion.button
                    onClick={() => onDelete(report.id)}
                    className="text-red-600 hover:text-red-700"
                    variants={buttonVariants}
                    whileHover="hover"
                  >
                    <FiTrash2 size={16} />
                  </motion.button>
                </div>
              </motion.li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-indigo-400"><Trans i18nKey="pages.admin_ReportManager.no-reports-uploaded"><Trans i18nKey="pages.admin_ReportManager.no-reports-uploaded-1">No reports uploaded.</Trans></Trans></p>
        )}
      </div>
    </motion.div>
  );
};

ReportUploadCard.propTypes = {
  day: PropTypes.string.isRequired,
  reports: PropTypes.object.isRequired,
  onUpload: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onPreview: PropTypes.func.isRequired,
};

const ReportManager = () => {
  const [reports, setReports] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  useEffect(() => {
    const reportsRef = ref(db, 'reports');
    const unsubscribe = onValue(reportsRef, (snapshot) => {
      const data = snapshot.val() || {};
      const groupedReports = WEEK_DAYS.reduce((acc, day) => ({ ...acc, [day]: [] }), {});
      Object.entries(data).forEach(([key, value]) => {
        if (value.day && groupedReports[value.day]) {
          groupedReports[value.day].push({ id: key, ...value });
        }
      });
      setReports(groupedReports);
      setIsLoading(false);
    }, (error) => {
      toast.error('Failed to load reports: ' + error.message);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleUploadReport = async (day, reportData) => {
    if (!auth.currentUser) {
      toast.error('You must be logged in to upload reports.');
      return;
    }
    const file = reportData.file;
    const fileDataUrl = await toBase64(file);
    // Generate a 6-digit OTP
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    const newReportData = {
      title: reportData.title || 'Untitled Report',
      description: reportData.description || 'No description',
      category: reportData.category,
      size: `${(file.size / (1024 * 1024)).toFixed(10)}MB`,
      fileData: fileDataUrl,
      filename: file.name,
      timestamp: Date.now(),
      day,
      otp,
    };

    await push(ref(db, 'reports'), newReportData);
    toast.success(`Report uploaded for ${day}.`, { autoClose: 3000 });
    return { otp };
  };

  const handleDeleteClick = (id) => {
    setItemToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (itemToDelete) {
      try {
        // Delete from Realtime Database
        await remove(ref(db, `reports/${itemToDelete}`));
        toast.success('Report deleted successfully.');
      } catch (error) {
        toast.error(`Failed to delete report: ${error.message}`);
      }
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
    }
  };

  const handlePreview = (report) => {
    window.open(report.fileData, '_blank');
  };

  return (
    <motion.div
      className="admin-section text-black"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <h2 className="text-3xl font-bold mb-6 text-indigo-700"><Trans i18nKey="pages.admin_ReportManager.report-manager">Report Manager</Trans></h2>
      {isLoading ? <LoadingSpinner /> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {WEEK_DAYS.map((day) => (
            <ReportUploadCard
              key={day}
              day={day}
              reports={reports}
              onUpload={handleUploadReport}
              onDelete={handleDeleteClick}
              onPreview={handlePreview}
            />
          ))}
        </div>
      )}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Confirm Report Deletion"
        message="Are you sure you want to delete this report? This action cannot be undone."
      />
    </motion.div>
  );
};

export default ReportManager;