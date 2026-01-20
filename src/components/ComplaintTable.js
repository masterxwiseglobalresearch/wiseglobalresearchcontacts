import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ref, onValue } from 'firebase/database';
import { db } from '../firebase';
import { itemVariants } from '../utils/animationVariants';

const ComplaintTable = () => {
  // Dynamic heading (month/year) managed by admin in ComplaintManager
  const [headingMonthYear, setHeadingMonthYear] = useState('July 2025');
  const [tableData, setTableData] = useState([
    { srNo: 1, source: 'Directly from Investors', pendingLastMonth: 0, received: 0, resolved: 0, pending: 0, pending3Months: 0, avgResolutionTime: 0 },
    { srNo: 2, source: 'SEBI (SCORES)', pendingLastMonth: 0, received: 0, resolved: 0, pending: 0, pending3Months: 0, avgResolutionTime: 0 },
    { srNo: 3, source: 'Other Sources (if any)', pendingLastMonth: 0, received: 0, resolved: 0, pending: 0, pending3Months: 0, avgResolutionTime: 0 },
    { srNo: 'Grand Total', source: '', pendingLastMonth: 0, received: 0, resolved: 0, pending: 0, pending3Months: 0, avgResolutionTime: 0 },
  ]);
  const [loadingTable, setLoadingTable] = useState(true);
  const [errorTable, setErrorTable] = useState(null);

  useEffect(() => {
    // Listen for heading (month/year) updates from Firebase
    const headingRef = ref(db, 'complaintHeaderMonthYear');
    const unsubHeader = onValue(
      headingRef,
      (snapshot) => {
        const val = snapshot.val();
        if (typeof val === 'string' && val.trim().length > 0) {
          setHeadingMonthYear(val.trim());
        }
      },
      () => {
        // Ignore heading errors silently; keep default
      }
    );

    const tableRef = ref(db, 'complaintTableData');
    const unsubscribe = onValue(
      tableRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const dataArray = Array.isArray(data) ? data : Object.values(data);
          setTableData(dataArray);
        }
        setLoadingTable(false);
      },
      (error) => {
        console.error('Error fetching table data:', error);
        setErrorTable('Failed to load table data. Please try again later.');
        setLoadingTable(false);
      }
    );

    return () => {
      unsubscribe();
      unsubHeader();
    };
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  return (
    <motion.section
      className="relative py-10 sm:py-14 lg:py-20 px-4 sm:px-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="container max-w-3xl mx-auto relative z-10">
        <motion.div
          className="mb-6 rounded-2xl p-6 shadow-2xl"
          variants={itemVariants}
          style={{ background: '#fff', border: '2px solid #6366f1', boxShadow: '0 8px 32px 0 rgba(60,60,120,0.18), 0 1.5px 8px 0 rgba(99,102,241,0.10)' }}
        >
          <div style={{ color: '#000' }}>
            <motion.h2
              className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center mb-4 sm:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-indigo-800"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {`Complaint Data for ${headingMonthYear}`}
            </motion.h2>
            {loadingTable ? (
              <div className="flex justify-center items-center py-6">
                <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : errorTable ? (
              <div className="bg-red-500/20 rounded-xl p-6 shadow-lg border border-red-500/30 text-center text-gray-900">
                {errorTable}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table
                  className="w-full border-separate border-spacing-0 text-left text-xs sm:text-sm border border-indigo-200"
                  style={{ background: 'transparent', color: '#000' }}
                  aria-label={`Complaint Data for ${headingMonthYear}`}
                >
                  <caption className="sr-only">Monthly complaint receipt and resolution statistics by source</caption>
                  <thead>
                    <tr className="bg-indigo-50 border-b border-indigo-200">
                      <th scope="col" className="p-2 sm:p-3 border border-indigo-200 text-center min-w-[70px]" style={{ color: '#000' }}>Sr. No.</th>
                      <th scope="col" className="p-2 sm:p-3 border border-indigo-200 text-center min-w-[160px]" style={{ color: '#000' }}>Received from</th>
                      <th scope="col" className="p-2 sm:p-3 border border-indigo-200 text-center min-w-[180px]" style={{ color: '#000' }}>Pending at the end of last month</th>
                      <th scope="col" className="p-2 sm:p-3 border border-indigo-200 text-center min-w-[90px]" style={{ color: '#000' }}>Received</th>
                      <th scope="col" className="p-2 sm:p-3 border border-indigo-200 text-center min-w-[90px]" style={{ color: '#000' }}>Resolved</th>
                      <th scope="col" className="p-2 sm:p-3 border border-indigo-200 text-center min-w-[90px]" style={{ color: '#000' }}>Pending</th>
                      <th scope="col" className="p-2 sm:p-3 border border-indigo-200 text-center min-w-[170px]" style={{ color: '#000' }}>Pending Complaints 3 Months</th>
                      <th scope="col" className="p-2 sm:p-3 border border-indigo-200 text-center min-w-[210px]" style={{ color: '#000' }}>Average Resolution time (in days)^</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(tableData) &&
                      tableData.map((row) => (
                        <tr
                          key={row.srNo}
                          className="transition-colors hover:bg-indigo-50 border-b border-indigo-100"
                          style={{ backgroundColor: '#fff', color: '#000' }}
                        >
                          <td className="p-2 sm:p-3 border border-indigo-100 text-center min-w-[70px]">{row.srNo}</td>
                          <td className="p-2 sm:p-3 border border-indigo-100 text-center min-w-[160px]">{row.source}</td>
                          <td className="p-2 sm:p-3 border border-indigo-100 text-center min-w-[180px]">{row.pendingLastMonth || 0}</td>
                          <td className="p-2 sm:p-3 border border-indigo-100 text-center min-w-[90px]">{row.received || 0}</td>
                          <td className="p-2 sm:p-3 border border-indigo-100 text-center min-w-[90px]">{row.resolved || 0}</td>
                          <td className="p-2 sm:p-3 border border-indigo-100 text-center min-w-[90px]">{row.pending || 0}</td>
                          <td className="p-2 sm:p-3 border border-indigo-100 text-center min-w-[170px]">{row.pending3Months || 0}</td>
                          <td className="p-2 sm:p-3 border border-indigo-100 text-center min-w-[210px]">{row.avgResolutionTime || 0}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}

            <p className="mt-4 text-xs sm:text-sm" style={{ color: '#0b1220' }}>
              ^ Average Resolution time is the sum total of time taken to resolve each complaint in days, in the current month divided by total number of complaints resolved in the current month.
            </p>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default ComplaintTable;