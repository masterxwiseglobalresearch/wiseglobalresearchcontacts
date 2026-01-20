import React, { useState, useEffect, useCallback } from 'react';
import { Trans } from '../../i18nShim';
import { ref, onValue, remove } from 'firebase/database';
import { db } from '../../firebase';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { FiDownload, FiTrash2 } from 'react-icons/fi';
import Papa from 'papaparse';
import PropTypes from 'prop-types';

import LoadingSpinner from '../../components/admin/LoadingSpinner';
import SearchBar from '../../components/admin/SearchBar';
import Pagination from '../../components/admin/Pagination';
import ConfirmationModal from '../../components/admin/ConfirmationModal';

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

const SubmissionTable = ({ submissions, handleDelete, sortOrder, handleSortToggle }) => (
  <motion.div
    className="table-responsive rounded-2xl shadow-2xl p-2 bg-white border-2 border-indigo-100"
    variants={itemVariants}
  >
    {/* Desktop / Tablet table */}
    <div className="hidden sm:block">
      <table className="w-full table-auto text-xs sm:text-sm text-indigo-900">
        <thead className="bg-indigo-100 border-b-2 border-indigo-200">
          <tr>
            <th className="p-2 sm:p-4 text-left text-sm sm:text-base font-semibold">Name</th>
            <th className="p-2 sm:p-4 text-left text-sm sm:text-base font-semibold">Email</th>
            <th className="p-2 sm:p-4 text-left text-sm sm:text-base font-semibold">Phone</th>
            <th className="p-2 sm:p-4 text-left text-sm sm:text-base font-semibold">Address</th>
            <th className="p-2 sm:p-4 text-left text-sm sm:text-base font-semibold">Message</th>
            <th className="p-2 sm:p-4 text-left text-sm sm:text-base font-semibold">
              <button onClick={handleSortToggle} className="hover:text-indigo-600 transition-colors">
                Timestamp {sortOrder === 'desc' ? '↓' : '↑'}
              </button>
            </th>
            <th className="p-2 sm:p-4 text-left text-sm sm:text-base font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {submissions.map((submission) => (
            <motion.tr
              key={submission.id}
              className="transition-colors border-b border-indigo-100 hover:bg-indigo-50"
              variants={itemVariants}
            >
              <td className="p-4 break-words">{submission.name || 'N/A'}</td>
              <td className="p-4 break-words">{submission.email || 'N/A'}</td>
              <td className="p-4 break-words">{submission.phone || 'N/A'}</td>
              <td className="p-4 break-words">{submission.address || 'N/A'}</td>
              <td className="p-4 max-w-[10rem] sm:max-w-xs truncate break-words">{submission.message || 'N/A'}</td>
              <td className="p-4 whitespace-nowrap">{submission.timestamp ? new Date(submission.timestamp).toLocaleString('en-IN') : 'N/A'}</td>
              <td className="p-4">
                <motion.button
                  type="button"
                  onClick={() => handleDelete(submission.id)}
                  className="text-red-600 hover:text-red-700"
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  title="Delete submission"
                  aria-label={`Delete submission from ${submission.name || 'unknown'}`}
                >
                  <FiTrash2 aria-hidden="true" size={16} />
                </motion.button>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>

    {/* Mobile list: show cards on small screens */}
    <div className="sm:hidden space-y-3">
      {submissions.map((s) => (
        <div key={s.id} className="p-4 rounded-2xl bg-white border-2 border-indigo-100 text-indigo-900 shadow">
          <div className="flex justify-between items-start gap-3">
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate">{s.name || 'N/A'}</p>
              <p className="text-xs truncate">{s.email || 'N/A'}</p>
              <p className="text-xs">{s.phone || 'N/A'}</p>
              <p className="text-xs">{s.address || 'N/A'}</p>
            </div>
            <div className="flex-shrink-0">
              <motion.button type="button" onClick={() => handleDelete(s.id)} className="text-red-600 hover:text-red-700" variants={buttonVariants} whileHover="hover" whileTap="tap" title="Delete submission" aria-label={`Delete submission from ${s.name || 'unknown'}`}> <FiTrash2 aria-hidden="true" /> </motion.button>
            </div>
          </div>
          <div className="mt-2 text-sm">{s.message || 'N/A'}</div>
          <div className="mt-2 text-xs">{s.timestamp ? new Date(s.timestamp).toLocaleString('en-IN') : 'N/A'}</div>
        </div>
      ))}
    </div>
  </motion.div>
);

SubmissionTable.propTypes = {
  submissions: PropTypes.array.isRequired,
  handleDelete: PropTypes.func.isRequired,
  sortOrder: PropTypes.string.isRequired,
  handleSortToggle: PropTypes.func.isRequired,
};

const ContactSubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState('desc');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  useEffect(() => {
    const submissionsRef = ref(db, 'homeFormSubmissions');
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
          toDelete.forEach((id) => remove(ref(db, `homeFormSubmissions/${id}`)).catch(() => null));
          toast.info(`${toDelete.length} old contact submission(s) auto-deleted`);
        }
        setSubmissions(keep);
      } else {
        setSubmissions([]);
      }
      setIsLoading(false);
    }, (error) => {
      toast.error('Failed to load submissions: ' + error.message);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSearchAndSort = useCallback(() => {
    let processedData = [...submissions];
    if (searchQuery) {
      processedData = processedData.filter(s =>
        Object.values(s).some(val =>
          String(val).toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
    processedData.sort((a, b) =>
      sortOrder === 'desc' ? b.timestamp - a.timestamp : a.timestamp - b.timestamp
    );
    setFilteredSubmissions(processedData);
    setCurrentPage(1);
  }, [searchQuery, submissions, sortOrder]);

  useEffect(() => {
    handleSearchAndSort();
  }, [handleSearchAndSort]);

  const handleDeleteClick = (id) => {
    setItemToDelete(id);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (itemToDelete) {
      try {
        await remove(ref(db, `homeFormSubmissions/${itemToDelete}`));
        toast.success('Submission deleted successfully.');
      } catch (error) {
        toast.error('Failed to delete submission: ' + error.message);
      }
      setIsModalOpen(false);
      setItemToDelete(null);
    }
  };

  const handleExportCSV = () => {
    const csvData = filteredSubmissions.map(s => ({
      Name: s.name,
      Email: s.email,
      Phone: s.phone,
      Address: s.address,
      Message: s.message,
      Timestamp: new Date(s.timestamp).toLocaleString('en-IN'),
    }));
    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'contact_submissions.csv');
    document.body.appendChild(link);
    link.click();
  if (link && link.parentNode) link.parentNode.removeChild(link);
    toast.success('Submissions exported to CSV.');
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSubmissions = filteredSubmissions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredSubmissions.length / itemsPerPage);

  return (
    <motion.div className="admin-section bg-indigo-50 min-h-screen p-4 sm:p-8" variants={containerVariants} initial="hidden" animate="visible">
      <h2 className="text-3xl font-bold mb-6 text-indigo-700"><Trans i18nKey="pages.admin_ContactSubmissions.contact-submissions">Contact Submissions</Trans></h2>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center sm:justify-between gap-3 sm:gap-4 mb-6">
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} placeholder="Search contacts..." />
        <motion.button onClick={handleExportCSV} className="px-4 py-2 rounded-lg flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold shadow hover:from-green-600 hover:to-green-700 transition" variants={buttonVariants} whileHover="hover">
          <FiDownload /><Trans i18nKey="pages.admin_ContactSubmissions.export-csv">Export CSV</Trans></motion.button>
      </div>
      {isLoading ? <LoadingSpinner /> : (
        <>
          <SubmissionTable submissions={currentSubmissions} handleDelete={handleDeleteClick} sortOrder={sortOrder} handleSortToggle={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')} />
          {totalPages > 1 && <Pagination totalPages={totalPages} currentPage={currentPage} paginate={setCurrentPage} />}
        </>
      )}
      <ConfirmationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onConfirm={confirmDelete} title="Confirm Deletion" message="Are you sure you want to delete this submission?" />
    </motion.div>
  );
};

export default ContactSubmissions;