import React, { useState, useEffect, useCallback } from 'react';
import { Trans } from '../../i18nShim';
import { ref, onValue, remove } from 'firebase/database';
import { getStorage, ref as storageRef, deleteObject } from 'firebase/storage';
import { db } from '../../firebase';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { FiTrash2, FiDownload, FiEye } from 'react-icons/fi';
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

const ConsentTable = ({ submissions, handleDelete }) => (
  <motion.div
    className="bg-gray-800/30 rounded-xl shadow-lg border border-gray-200/20 overflow-x-auto h-scroll custom-scrollbar p-2"
    variants={itemVariants}
  >
  <div className="table-responsive">
  <table className="min-w-full md:min-w-full table-auto text-white text-xs sm:text-sm">
      <thead className="bg-gray-700/50">
        <tr>
          <th className="p-4 text-left font-semibold">Client Name</th>
          <th className="p-4 text-left font-semibold">Client ID</th>
          <th className="p-4 text-left font-semibold">Email</th>
          <th className="hidden md:table-cell p-2 sm:p-4 text-left text-sm sm:text-base font-semibold"><Trans i18nKey="pages.admin_ConsentSubmissions.pan-card">PAN Card</Trans></th>
          <th className="hidden md:table-cell p-2 sm:p-4 text-left text-sm sm:text-base font-semibold"><Trans i18nKey="pages.admin_ConsentSubmissions.aadhaar-card">Aadhaar Card</Trans></th>
          <th className="hidden lg:table-cell p-2 sm:p-4 text-left text-sm sm:text-base font-semibold"><Trans i18nKey="pages.admin_ConsentSubmissions.signature">Signature</Trans></th>
          <th className="p-4 text-left font-semibold">Timestamp</th>
          <th className="p-4 text-left font-semibold">Actions</th>
        </tr>
      </thead>
      <tbody>
        {submissions.map((submission) => (
          <motion.tr
            key={submission.id}
            className="border-b border-gray-200/20 hover:bg-gray-700/20"
            variants={itemVariants}
          >
            <td data-label="Client Name" className="p-4 break-words">{submission.clientName || 'N/A'}</td>
            <td data-label="Client ID" className="p-4 break-words">{submission.clientId || 'N/A'}</td>
            <td data-label="Email" className="p-4 break-words">{submission.email || 'N/A'}</td>
            <td data-label="PAN Card" className="hidden md:table-cell p-2 sm:p-4">
              {submission.panCard ? (
                <div className="flex items-center gap-2">
                  <a href={submission.panCard} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline" title="Preview PAN card" aria-label={`Preview PAN card for ${submission.clientName || 'client'}`}>
                    <FiEye aria-hidden="true" size={14} />
                  </a>
                  <a href={submission.panCard} download className="text-green-400 hover:underline" title="Download PAN card" aria-label={`Download PAN card for ${submission.clientName || 'client'}`}>
                    <FiDownload aria-hidden="true" size={14} />
                  </a>
                </div>
              ) : 'N/A'}
            </td>
            <td data-label="Aadhaar Card" className="hidden md:table-cell p-2 sm:p-4">
              {submission.aadhaarCard ? (
                <div className="flex items-center gap-2">
                  <a href={submission.aadhaarCard} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline" title="Preview Aadhaar card" aria-label={`Preview Aadhaar card for ${submission.clientName || 'client'}`}>
                    <FiEye aria-hidden="true" size={14} />
                  </a>
                  <a href={submission.aadhaarCard} download className="text-green-400 hover:underline" title="Download Aadhaar card" aria-label={`Download Aadhaar card for ${submission.clientName || 'client'}`}>
                    <FiDownload aria-hidden="true" size={14} />
                  </a>
                </div>
              ) : 'N/A'}
            </td>
            <td data-label="Signature" className="hidden lg:table-cell p-2 sm:p-4">
              {submission.signature ? (
                <div className="flex items-center gap-2">
                  <a href={submission.signature} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline" title="Preview signature" aria-label={`Preview signature for ${submission.clientName || 'client'}`}>
                    <FiEye aria-hidden="true" size={14} />
                  </a>
                  <a href={submission.signature} download className="text-green-400 hover:underline" title="Download signature" aria-label={`Download signature for ${submission.clientName || 'client'}`}>
                    <FiDownload aria-hidden="true" size={14} />
                  </a>
                </div>
              ) : 'N/A'}
            </td>
            <td data-label="Timestamp" className="p-2 sm:p-4 whitespace-nowrap">{submission.timestamp ? new Date(submission.timestamp).toLocaleString('en-IN') : 'N/A'}</td>
            <td data-label="Actions" className="p-2 sm:p-4">
              <motion.button type="button" onClick={() => handleDelete(submission)} className="text-red-500 hover:text-red-700" variants={buttonVariants} whileHover="hover" title="Delete submission" aria-label={`Delete submission from ${submission.clientName || 'unknown'}`}>
                <FiTrash2 aria-hidden="true" size={16} />
              </motion.button>
            </td>
          </motion.tr>
        ))}
      </tbody>
  </table>
  </div>
  </motion.div>
);

ConsentTable.propTypes = {
  submissions: PropTypes.array.isRequired,
  handleDelete: PropTypes.func.isRequired,
};

const ConsentSubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const storage = getStorage();

  useEffect(() => {
    const consentRef = ref(db, 'clientServiceConsentForms');
    const unsubscribe = onValue(consentRef, (snapshot) => {
      const data = snapshot.val();
      const consentList = data ? Object.entries(data).map(([key, value]) => ({ id: key, ...value })).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)) : [];
      setSubmissions(consentList);
      setIsLoading(false);
    }, (error) => {
      toast.error('Failed to load consent submissions: ' + error.message);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSearch = useCallback(() => {
    let processedData = [...submissions];
    if (searchQuery) {
      processedData = processedData.filter(s =>
        Object.values(s).some(val =>
          String(val).toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
    setFilteredSubmissions(processedData);
    setCurrentPage(1);
  }, [searchQuery, submissions]);

  useEffect(() => {
    handleSearch();
  }, [handleSearch]);

  const handleDeleteClick = (submission) => {
    setItemToDelete(submission);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete || !itemToDelete.id) return;

    const { id, panCard, aadhaarCard, signature } = itemToDelete;

    try {
      // 1. Delete associated files from Storage
      const fileDeletionPromises = [];
      if (panCard?.storagePath) {
        fileDeletionPromises.push(deleteObject(storageRef(storage, panCard.storagePath)));
      }
      if (aadhaarCard?.storagePath) {
        fileDeletionPromises.push(deleteObject(storageRef(storage, aadhaarCard.storagePath)));
      }
      if (signature?.storagePath) {
        fileDeletionPromises.push(deleteObject(storageRef(storage, signature.storagePath)));
      }

      const results = await Promise.allSettled(fileDeletionPromises);
      results.forEach(result => {
        if (result.status === 'rejected' && result.reason.code !== 'storage/object-not-found') {
          toast.warn(`A file could not be deleted from storage: ${result.reason.code}`);
        }
      });

      // 2. Delete the record from Realtime Database
      await remove(ref(db, `clientServiceConsentForms/${id}`));
      toast.success('Consent submission and associated files deleted successfully.');
    } catch (error) {
      toast.error('Failed to delete consent submission: ' + error.message);
    }
    setIsModalOpen(false);
    setItemToDelete(null);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSubmissions = filteredSubmissions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredSubmissions.length / itemsPerPage);

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <h2 className="text-3xl font-bold text-white mb-6"><Trans i18nKey="pages.admin_ConsentSubmissions.consent-submissions"><Trans i18nKey="pages.admin_ConsentSubmissions.consent-submissions-1">Consent Submissions</Trans></Trans></h2>
      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} placeholder="Search consents..." />
      {isLoading ? <LoadingSpinner /> : (
        <>
          <ConsentTable submissions={currentSubmissions} handleDelete={handleDeleteClick} />
          {totalPages > 1 && <Pagination totalPages={totalPages} currentPage={currentPage} paginate={setCurrentPage} />}
        </>
      )}
      <ConfirmationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onConfirm={confirmDelete} title="Confirm Deletion" message="Are you sure you want to delete this consent submission?" />
    </motion.div>
  );
};

export default ConsentSubmissions;