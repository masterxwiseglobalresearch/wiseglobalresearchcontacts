import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaExclamationCircle, FaComments, FaBriefcase, FaChartBar } from 'react-icons/fa';
import { ref, onValue } from 'firebase/database';
import { db } from '../../firebase';
import DashboardCard from './DashboardCard'; // Using the new DashboardCard component
import AdminPopupImage from '../../components/AdminPopupImage';
import QrImageManageModal from '../../components/QrImageManageModal';
import { createPortal } from 'react-dom';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const useDatabaseCount = (path) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const dbRef = ref(db, path);
    const unsubscribe = onValue(dbRef, (snapshot) => {
      if (snapshot.exists()) {
        setCount(Object.keys(snapshot.val()).length);
      } else {
        setCount(0);
      }
    });
    return () => unsubscribe();
  }, [path]);
  return count;
};

const Dashboard = () => {
  const contactCount = useDatabaseCount('contacts');
  // removed popupCount (popups page deleted)
  const complaintCount = useDatabaseCount('complaint-box');
  const chatbotDataCount = useDatabaseCount('chatbot-data');
  const jobCount = useDatabaseCount('jobs');
  const homeContactCount = useDatabaseCount('homePageContactSubmissions');
  const reportsCount = useDatabaseCount('reports');

  const [popupOpen, setPopupOpen] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);

  const cards = [
    { title: 'Contact Submissions', value: contactCount, icon: <FaEnvelope />, color: 'blue', to: '/admin/contacts' },
    { title: 'Home Page Contacts', value: homeContactCount, icon: <FaEnvelope />, color: 'cyan', to: '/admin/home-contacts' },
    // { title: 'Popup Submissions', value: popupCount, icon: <FaBullhorn />, color: 'purple', to: '/admin/popups' },
    { title: 'Complaint Box', value: complaintCount, icon: <FaExclamationCircle />, color: 'red', to: '/admin/complaint-box' },
    { title: 'Complaint Manager', value: complaintCount, icon: <FaExclamationCircle />, color: 'rose', to: '/admin/complaints' },
    // popup editor card will be rendered after Complaint Manager
    { type: 'popupEditor', title: 'Edit Popup Image', icon: <FaComments />, color: 'purple' },
    // Separate QR image manage card
    { type: 'qrImageManager', title: 'Manage QR Image', icon: <FaComments />, color: 'indigo' },
    { title: 'Report Manager', value: reportsCount, icon: <FaChartBar />, color: 'emerald', to: '/admin/reports' },
    { title: 'Chatbot Data', value: chatbotDataCount, icon: <FaComments />, color: 'yellow', to: '/admin/chatbot-data' },
    { title: 'Job Postings', value: jobCount, icon: <FaBriefcase />, color: 'indigo', to: '/admin/jobs' },
  ];

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="px-2 sm:px-4 py-4">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-adaptive">Admin Dashboard</h1>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Overview of recent activity and quick links.</p>
          </div>
        </div>
        <div className="admin-cards-grid">
          {cards.map((card, index) => {
            if (card.type === 'popupEditor') {
              return (
                <DashboardCard
                  key={index}
                  icon={card.icon}
                  title={card.title}
                  value={card.value}
                  color={card.color}
                  onClick={() => setPopupOpen(true)}
                />
              );
            }
            if (card.type === 'qrImageManager') {
              // Show the QR image manage button as a separate card
              return (
                <DashboardCard
                  key={index}
                  icon={card.icon}
                  title={card.title}
                  color={card.color}
                  showQrManageButton={true}
                  onQrManageClick={() => setQrModalOpen(true)}
                />
              );
            }
            return (
              <DashboardCard
                key={index}
                icon={card.icon}
                title={card.title}
                value={card.value}
                color={card.color}
                to={card.to}
              />
            );
          })}
        </div>
        {/* Popup Image Edit Modal */}
        {popupOpen && typeof document !== 'undefined' ? createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded shadow-lg max-w-3xl w-full p-4 text-black">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-medium text-black">Edit popup image</h3>
                  <button onClick={() => setPopupOpen(false)} aria-label="Close" className="px-2 py-1 text-black">✕</button>
                </div>
                <AdminPopupImage />
              </div>
          </div>, document.body) : null}

        {/* QR Image Manage Modal */}
        {qrModalOpen && typeof document !== 'undefined' ? createPortal(
          <QrImageManageModal isOpen={qrModalOpen} onClose={() => setQrModalOpen(false)} />, document.body) : null}
      </div>

      {/* You can add more sections here, for example, charts or recent activity feeds */}
    </motion.div>
  );
};

export default Dashboard;
