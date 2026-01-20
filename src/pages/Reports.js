/**
 * Reports.js
 * Component for displaying and managing research reports with password-protected downloads.
 * Features day-based filtering, category selection, search, pagination, and animations.
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Trans } from '../i18nShim';
import { ref, onValue } from 'firebase/database';
import { db } from '../firebase';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiEye } from 'react-icons/fi';
import AOS from 'aos';
import 'aos/dist/aos.css';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';

// Constants
const WEEK_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const CATEGORIES = ['Market', 'Technical', 'Financial', 'Competitor', 'Other'];

// Animation variants

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const buttonVariants = {
  hover: { scale: 1.05, boxShadow: '0px 4px 15px rgba(79, 70, 229, 0.4)' },
  tap: { scale: 0.95 },
};

// Loading spinner component
const LoadingSpinner = () => (
  <>
    <Helmet>
      <title>Reports - Wise Global Research</title>
      <meta name="description" content="Reports page — Wise Global Research." />
      <link rel="canonical" href="https://wiseglobalresearch.com/reports" />
    </Helmet>
    <motion.div
      className="flex justify-center items-center py-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
    </motion.div>
  </>
);


// Report preview modal with robust PDF embedding
const ReportPreviewModal = ({ isOpen, onClose, report = null, onDownload = null }) => {
  // Basic mobile detection for safer PDF rendering on small devices
  const isMobile = useMemo(() => {
    if (typeof navigator === 'undefined') return false;
    return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  }, []);
  const { previewUrl, revoke } = useMemo(() => {
    const fileSource = report?.file || report?.fileData || '';
    try {
      if (!fileSource) return { previewUrl: null, revoke: () => {} };

      // If http(s), use directly
      if (/^https?:\/\//i.test(fileSource)) {
        return { previewUrl: fileSource, revoke: () => {} };
      }

      const toBlobUrl = (bytes, mime = 'application/pdf') => {
        const blob = new Blob([bytes], { type: mime });
        const objectUrl = URL.createObjectURL(blob);
        return { previewUrl: objectUrl, revoke: () => URL.revokeObjectURL(objectUrl) };
      };

      // Data URL
      if (fileSource.startsWith('data:')) {
        const [meta, base64] = fileSource.split(',');
        const mimeMatch = meta.match(/data:([^;]+);base64/);
        const mime = mimeMatch ? mimeMatch[1] : 'application/pdf';
        const bin = atob(base64);
        const bytes = new Uint8Array(bin.length);
        for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
        return toBlobUrl(bytes, mime);
      }

      // Raw base64
      const bin = atob(fileSource);
      const bytes = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
      return toBlobUrl(bytes, 'application/pdf');
    } catch (e) {
      return { previewUrl: null, revoke: () => {} };
    }
  }, [report]);

  useEffect(() => revoke, [revoke]);

  return (
    <AnimatePresence>
      {isOpen && report && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="p-4 rounded-2xl shadow-2xl max-w-full sm:max-w-xl md:max-w-3xl w-full h-[90dvh] sm:h-[80vh] mx-2 sm:mx-auto flex flex-col overflow-hidden bg-white"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            style={{ border: '2px solid #6366f1' }}
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold text-indigo-700 truncate">{report?.title}</h3>
              <div className="flex gap-2">
                {previewUrl && (
                  <a
                    href={previewUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-purple px-4 py-2 rounded-lg"
                    aria-label="Open in new tab"
                  >
                    Open
                  </a>
                )}
                <motion.button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-black hover:bg-gray-50"
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  aria-label="Close preview"
                ><Trans i18nKey="pages.Reports.close">Close</Trans></motion.button>
              </div>
            </div>
            <div className="bg-white h-full rounded-md overflow-hidden flex flex-col">
              <div className="flex-1 min-h-0">
                {previewUrl ? (
                  isMobile ? (
                    // Mobile fallback: many mobile browsers (especially iOS Safari) don't render PDFs inside <object> reliably.
                    // We prefer a plain iframe with full height; users can still use the Open button if the browser blocks it.
                    <iframe
                      src={previewUrl}
                      title={report?.title || 'Report preview'}
                      className="w-full h-full border-0"
                      allow="fullscreen"
                    />
                  ) : (
                    <object data={previewUrl} type="application/pdf" className="w-full h-full">
                      <iframe
                        src={previewUrl}
                        title={report?.title || 'Report preview'}
                        className="w-full h-full border-0"
                      />
                    </object>
                  )
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-700 p-4">
                    <p>Preview unavailable. Use the Open or Download buttons.</p>
                  </div>
                )}
              </div>
              <div className="p-3 border-t border-indigo-100 bg-gray-50 flex justify-end gap-3">
                {onDownload && (
                  <motion.button
                    type="button"
                    onClick={() => onDownload(report)}
                    className="btn-purple px-4 py-2 rounded-lg"
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <Trans i18nKey="pages.Reports.download">Download</Trans>
                  </motion.button>
                )}
                <motion.button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-black hover:bg-gray-50"
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Trans i18nKey="pages.Reports.close">Close</Trans>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Defensive: ensure no .defaultProps exist on this function component
// (some toolchains or HOCs may add it; React warns about defaultProps on
// function components in future releases). We delete it proactively.
if (ReportPreviewModal.defaultProps) {
  try {
    delete ReportPreviewModal.defaultProps;
  } catch (e) {
    /* ignore — defensive */
  }
}

ReportPreviewModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  // report may be null when modal is toggled; not required
  report: PropTypes.shape({ title: PropTypes.string }),
  onDownload: PropTypes.func,
};

// Day selector component
const DaySelector = ({ activeDay, setActiveDay }) => (
  <motion.div
    className="mb-8"
    variants={itemVariants}
    data-aos="fade-up"
  >
    <div className="flex overflow-x-auto no-scrollbar px-2">
      <div className="inline-flex rounded-md shadow-sm space-x-2">
        {WEEK_DAYS.map((day) => (
          <motion.button
            key={day}
            onClick={() => setActiveDay(day)}
            className={`min-w-[64px] sm:min-w-[80px] px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-300 whitespace-nowrap ${
              activeDay === day
                ? 'btn-purple text-white'
                : 'bg-white text-black border border-indigo-200 hover:bg-indigo-50'
            } ${day === 'Monday' ? 'rounded-l-lg' : ''} ${
              day === 'Friday' ? 'rounded-r-lg' : ''
            }`}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            aria-label={`Select ${day}`}
          >
            {day}
          </motion.button>
        ))}
      </div>
    </div>
  </motion.div>
);

DaySelector.propTypes = {
  activeDay: PropTypes.string.isRequired,
  setActiveDay: PropTypes.func.isRequired,
};

// Search and filter component
const SearchFilter = ({ searchTerm, setSearchTerm, selectedCategory, setSelectedCategory }) => (
  <motion.div
    className="mb-6 flex flex-col md:flex-row gap-4"
    variants={itemVariants}
    data-aos="fade-up"
  >
    <div className="relative flex-grow">
      <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600" />
      <input
        type="text"
        placeholder="Search reports..."
        className="pl-10 pr-4 py-3 w-full rounded-lg bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-md transition-all duration-300"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        aria-label="Search reports"
      />
    </div>
    <select
      className="w-full md:w-auto px-4 py-3 rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-md transition-all duration-300"
      value={selectedCategory}
      onChange={(e) => setSelectedCategory(e.target.value)}
      aria-label="Select report category"
    >
      <option value="All" className="text-black"><Trans i18nKey="pages.Reports.all-categories">All Categories</Trans></option>
      {CATEGORIES.map((cat) => (
        <option key={cat} value={cat} className="text-black">
          {cat}
        </option>
      ))}
    </select>
  </motion.div>
);

SearchFilter.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  setSearchTerm: PropTypes.func.isRequired,
  selectedCategory: PropTypes.string.isRequired,
  setSelectedCategory: PropTypes.func.isRequired,
};

// Report card component (unused in current layout, kept updated for consistency)
const ReportCard = ({ report, isSelected, onPreview }) => (
  <motion.li
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className={`p-4 rounded-2xl cursor-pointer transition-colors duration-300 bg-white ${
      isSelected ? 'ring-2 ring-indigo-400' : 'hover:bg-indigo-50'
    }`}
    style={{ border: '2px solid #6366f1' }}
    data-aos="fade-up"
  >
    <div className="flex justify-between items-start">
      <div>
        <h4 className="font-medium text-indigo-800">{report.title}</h4>
        <p className="text-sm text-black mt-1">{report.description}</p>
      </div>
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
        {report.size}
      </span>
    </div>
    <div className="mt-2">
      <span className="inline-block text-xs font-medium text-indigo-600">
        {report.category}
      </span>
    </div>
    <div className="mt-3 flex flex-col sm:flex-row items-center gap-3">
      <motion.button
        onClick={() => onPreview && onPreview(report)}
        className="w-full sm:w-auto px-4 py-2 btn-purple rounded-lg shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center gap-2"
        style={{ minHeight: 44 }}
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        aria-label={`Preview ${report.title}`}
      >
        <FiEye className="text-white" />
        <span className="ml-2"> <Trans i18nKey="pages.Reports.preview">Preview</Trans></span>
      </motion.button>
    </div>
  </motion.li>
);

ReportCard.propTypes = {
  report: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    category: PropTypes.string.isRequired,
    size: PropTypes.string.isRequired,
  }).isRequired,
  isSelected: PropTypes.bool.isRequired,
  // onVerify removed (no OTP flow)
};

// Pagination component
const Pagination = ({ totalPages, currentPage, paginate }) => (
  <motion.div
    className="mt-6 flex flex-wrap justify-center gap-3"
    variants={itemVariants}
    data-aos="fade-up"
  >
    {Array.from({ length: totalPages }, (_, i) => (
      <motion.button
        key={i + 1}
        onClick={() => paginate(i + 1)}
        className={`px-4 py-2 rounded-lg shadow-md transition-all duration-300 ${
          currentPage === i + 1
            ? 'btn-purple text-white'
            : 'bg-white border border-indigo-200 text-black hover:bg-indigo-50'
        }`}
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        aria-label={`Go to page ${i + 1}`}
      >
        {i + 1}
      </motion.button>
    ))}
  </motion.div>
);

Pagination.propTypes = {
  totalPages: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  paginate: PropTypes.func.isRequired,
};

/**
 * Main Reports component
 * @returns {JSX.Element} Reports page UI
 */
function Reports() {
  const [activeDay, setActiveDay] = useState('Monday');
  const [pdfPreview, setPdfPreview] = useState(null);
  const [reports, setReports] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedReport, setSelectedReport] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isOtpOpen, setIsOtpOpen] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [pendingReport, setPendingReport] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [sortBy, setSortBy] = useState('title');
  const [sortOrder, setSortOrder] = useState('asc');


  // Fetch reports
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
    setIsLoading(true);
    const reportsRef = ref(db, 'reports');
    const unsubscribe = onValue(
      reportsRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const reportList = Object.entries(data).map(([key, value]) => ({
            id: key,
            ...value,
          }));
          const groupedReports = WEEK_DAYS.reduce((acc, day) => {
            acc[day] = reportList.filter((report) => report.day === day);
            return acc;
          }, {});
          setReports(groupedReports);
          toast.success('Reports loaded successfully.', { position: 'top-center', autoClose: 2000 });
        } else {
          setReports(WEEK_DAYS.reduce((acc, day) => ({ ...acc, [day]: [] }), {}));
          toast.info('No reports found.', { position: 'top-center', autoClose: 2000 });
        }
        setIsLoading(false);
      },
      (error) => {
        console.error('Error fetching reports:', error);
        toast.error('Failed to load reports: ' + error.message, { position: 'top-center' });
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Reset preview when day changes
  useEffect(() => {
    setPdfPreview(null);
    setSelectedReport(null);
    setCurrentPage(1);
  }, [activeDay]);

  // No OTP verification — open preview directly
  // Handle report preview with OTP verification
  const handlePreviewReport = (report) => {
    setPendingReport(report);
    setOtpInput('');
    setIsOtpOpen(true);
  };

  const verifyOtpAndOpen = () => {
    try {
      const expected = String(pendingReport?.otp || '').trim();
      const entered = String(otpInput || '').trim();
      if (!expected) {
        toast.error('This report requires an OTP, but none is set. Contact admin.');
        return;
      }
      if (entered.length === 0) {
        toast.warn('Please enter the OTP.');
        return;
      }
      if (entered !== expected) {
        toast.error('Invalid OTP.');
        return;
      }
      setSelectedReport(pendingReport);
      setPdfPreview(pendingReport);
      setIsPreviewOpen(true);
      setIsOtpOpen(false);
      setPendingReport(null);
    } catch (e) {
      toast.error('Failed to verify OTP.');
    }
  };

  // Handle download
  const handleDownload = (report) => {
    try {
      const fileSource = report?.file || report?.fileData;
      const filename = report?.filename || `${report?.title || 'report'}.pdf`;

      if (!fileSource || typeof fileSource !== 'string') {
        throw new Error('No file source found for this report.');
      }

      // Helper to download a Blob
      const downloadBlob = (blob, name) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = name;
        document.body.appendChild(link);
        link.click();
  if (link && link.parentNode) link.parentNode.removeChild(link);
        URL.revokeObjectURL(url);
      };

      // If it's a data URL (e.g., data:application/pdf;base64,XXXXX)
      if (fileSource.startsWith('data:')) {
        const [meta, base64] = fileSource.split(',');
        const mimeMatch = meta.match(/data:([^;]+);base64/);
        const mime = mimeMatch ? mimeMatch[1] : 'application/pdf';
        const byteCharacters = atob(base64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: mime });
        downloadBlob(blob, filename);
      }
      // If it's an http(s) URL
      else if (/^https?:\/\//i.test(fileSource)) {
        // Best-effort direct download via anchor; server should provide correct CORS/headers.
        const link = document.createElement('a');
        link.href = fileSource;
        link.download = filename; // May be ignored by the browser if cross-origin without proper headers
        document.body.appendChild(link);
        link.click();
  if (link && link.parentNode) link.parentNode.removeChild(link);
      }
      // Otherwise, assume it's a raw base64 string without the data URL prefix
      else {
        const byteCharacters = atob(fileSource);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/pdf' });
        downloadBlob(blob, filename);
      }

      toast.success('Report downloaded successfully.', { position: 'top-center' });
      setIsPreviewOpen(false);
    } catch (error) {
      console.error('Error downloading report:', error);
      toast.error('Failed to download report: ' + error.message, { position: 'top-center' });
    }
  };

  // Filter and sort reports
  const currentDayReports = reports[activeDay] || [];
  const filteredReports = currentDayReports.filter((report) => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || report.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    if (sortBy === 'title') {
      return sortOrder === 'asc'
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title);
    } else if (sortBy === 'size') {
      const sizeA = parseFloat(a.size);
      const sizeB = parseFloat(b.size);
      return sortOrder === 'asc' ? sizeA - sizeB : sizeB - sizeA;
    }
    return 0;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedReports = filteredReports.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <section className="py-8 sm:py-12 lg:py-16 px-4 sm:px-6">
      <div className="container max-w-4xl mx-auto">
        <motion.div
          className="mb-6 rounded-2xl p-6 shadow-2xl"
          style={{
            background: '#fff',
            border: '2px solid #6366f1',
            boxShadow: '0 8px 32px 0 rgba(60,60,120,0.18), 0 1.5px 8px 0 rgba(99,102,241,0.10)'
          }}
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          <div style={{ color: '#0b1220' }}>
            <motion.h1
              className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center mb-4 text-indigo-700"
              variants={itemVariants}
            >
              <Trans i18nKey="pages.Reports.research-reports">Research Reports</Trans>
            </motion.h1>
            <motion.p className="text-center text-sm sm:text-base mb-6" variants={itemVariants}>
              <Trans i18nKey="pages.Reports.daily-analysis-and-insights">Daily analysis and insights</Trans>
            </motion.p>

            {/* Day Selector and controls */}
            <DaySelector activeDay={activeDay} setActiveDay={setActiveDay} />

            <SearchFilter
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />

            <motion.div className="mb-6 flex justify-end gap-4" variants={itemVariants}>
              <select
                className="px-3 py-2 rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-md transition-all duration-300"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                aria-label="Sort reports by"
              >
                <option value="title"><Trans i18nKey="pages.Reports.sort-by-title">Sort by Title</Trans></option>
                <option value="size"><Trans i18nKey="pages.Reports.sort-by-size">Sort by Size</Trans></option>
              </select>
              <motion.button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="px-4 py-2 btn-purple text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                aria-label={`Sort ${sortOrder === 'asc' ? 'descending' : 'ascending'}`}
              >
                {sortOrder === 'asc' ? 'Sort ↓' : 'Sort ↑'}
              </motion.button>
            </motion.div>

            {/* Main content grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <div className="px-4 py-3">
                  <h3 className="text-lg sm:text-xl font-semibold mb-3 text-indigo-800">{activeDay}</h3>
                  {isLoading ? (
                    <LoadingSpinner />
                  ) : paginatedReports.length > 0 ? (
                    <ul className="space-y-4">
                      {paginatedReports.map((report) => (
                        <motion.li
                          key={report.id}
                          whileHover={{ y: -4 }}
                          className="rounded-2xl overflow-hidden bg-white shadow-2xl"
                          style={{ border: '2px solid #6366f1', color: '#0b1220' }}
                          variants={itemVariants}
                        >
                          <div className="px-4 py-3">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="text-md sm:text-lg font-semibold mb-1 text-indigo-800">{report.title}</h4>
                                <p className="text-sm text-black">{report.description || 'No description'}</p>
                              </div>
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-black">{report.size}</span>
                            </div>
                            <div className="mt-3 flex gap-3">
                              <motion.button
                                onClick={() => handlePreviewReport(report)}
                                className="px-3 py-2 bg-white text-black rounded-lg shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center gap-2"
                                style={{ minHeight: 40 }}
                                variants={buttonVariants}
                                whileHover="hover"
                                whileTap="tap"
                                aria-label={`Preview ${report.title}`}
                              >
                                <FiEye className="text-indigo-600" />
                                <span className="ml-2">Preview</span>
                              </motion.button>
                            </div>
                          </div>
                        </motion.li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 text-sm">No reports found.</p>
                  )}
                </div>
              </div>

              <div className="md:col-span-2 bg-white rounded-lg p-4" style={{ border: '2px solid #6366f1' }}>
                {pdfPreview ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="h-full flex flex-col"
                    variants={itemVariants}
                  >
                    <div className="px-4 py-3 border-b border-indigo-100">
                      <h3 className="text-lg font-semibold text-indigo-800">{pdfPreview.title}</h3>
                      <p className="text-sm text-black mt-1">{pdfPreview.description || 'No description'}</p>
                    </div>
                    <div className="flex-1 p-6 flex items-center justify-center">
                      <div className="text-center">
                        <div className="relative w-full h-36 sm:h-40 mb-4 select-none">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div
                              className="relative w-[88%] h-[80%] bg-indigo-50 border border-indigo-200 rounded-md shadow-inner overflow-hidden"
                              style={{ minWidth: 0, minHeight: 0 }}
                            >
                              <img src="https://cdn-icons-png.flaticon.com/512/337/337946.png" alt="PDF Thumbnail" className="w-full h-full object-cover rounded-md" />
                              <span className="absolute -top-2 left-6 w-12 h-4 bg-indigo-100 border border-indigo-200 rounded-full shadow-sm" />
                              <span className="absolute -bottom-2 right-6 w-12 h-4 bg-indigo-100 border border-indigo-200 rounded-full shadow-sm" />
                            </div>
                          </div>
                        </div>

                        <motion.button
                          onClick={() => setIsPreviewOpen(true)}
                          className="px-6 py-2 btn-purple text-white text-sm font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 mx-auto mb-2"
                          variants={buttonVariants}
                          whileHover="hover"
                          whileTap="tap"
                          aria-label="View report"
                        >
                          <FiEye />
                          <span>View Report</span>
                        </motion.button>
                        <p className="mt-2 text-sm text-black">{pdfPreview.title} ({pdfPreview.size})</p>
                      </div>
                    </div>
                    <div className="px-4 py-3 border-t border-indigo-100 bg-indigo-50 text-right rounded-b-lg mt-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Available for download only</span>
                    </div>
                  </motion.div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-indigo-200"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      <h3 className="mt-2 text-sm font-medium text-indigo-800">No report selected</h3>
                      <p className="mt-1 text-sm text-gray-700">Click on a report to preview it.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* OTP Modal */}
        <AnimatePresence>
          {isOtpOpen && (
            <motion.div
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="p-6 rounded-2xl shadow-2xl w-full max-w-md bg-white"
                style={{ border: '2px solid #6366f1' }}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
              >
                <h3 className="text-lg font-semibold mb-2 text-indigo-700">Enter OTP</h3>
                <p className="text-sm text-black mb-4">Please enter the 6-digit OTP to view this report.</p>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  autoFocus
                  className="w-full px-4 py-3 rounded-lg bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 border border-indigo-300 mb-4 tracking-widest text-center"
                  placeholder="••••••"
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value.replace(/[^0-9]/g, ''))}
                />
                <div className="flex justify-end gap-2">
                  <motion.button
                    onClick={() => { setIsOtpOpen(false); setPendingReport(null); setOtpInput(''); }}
                    className="px-4 py-2 rounded-lg border border-gray-300 text-black hover:bg-gray-50"
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <Trans i18nKey="pages.Reports.cancel">Cancel</Trans>
                  </motion.button>
                  <motion.button
                    onClick={verifyOtpAndOpen}
                    className="px-4 py-2 rounded-lg btn-purple text-white"
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <Trans i18nKey="pages.Reports.verify">Verify</Trans>
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            paginate={paginate}
          />
        )}
      {/* Report Preview Modal */}
      <ReportPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => {
          setIsPreviewOpen(false);
          setSelectedReport(null);
        }}
        report={selectedReport}
        onDownload={handleDownload}
      />
      </div>
    </section>
  );
}

export default Reports;