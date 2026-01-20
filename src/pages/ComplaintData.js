import React, { useState, useEffect } from 'react';
import { Trans } from '../i18nShim';
import { ref, onValue } from 'firebase/database';
import { db } from '../firebase';
import { motion } from 'framer-motion';


import { Helmet } from 'react-helmet-async';
const ComplaintData = () => {
  const [tableData, setTableData] = useState([]);
  const [loadingTable, setLoadingTable] = useState(true);
  const [errorTable, setErrorTable] = useState(null);

  // Fetch table data from Firebase
  useEffect(() => {
    const tableRef = ref(db, 'complaintTableData/july2025');
    const unsubscribe = onValue(
      tableRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const dataArray = Array.isArray(data) ? data : Object.values(data);
          setTableData(dataArray);
        } else {
          // Set default or empty data if nothing is found
          setTableData([
            { srNo: 1, source: 'Directly from Investors', pendingLastMonth: 0, received: 0, resolved: 0, pending: 0, pending3Months: 0, avgResolutionTime: 0 },
            { srNo: 2, source: 'SEBI (SCORES)', pendingLastMonth: 0, received: 0, resolved: 0, pending: 0, pending3Months: 0, avgResolutionTime: 0 },
            { srNo: 3, source: 'Other Sources (if any)', pendingLastMonth: 0, received: 0, resolved: 0, pending: 0, pending3Months: 0, avgResolutionTime: 0 },
            { srNo: 'Grand Total', source: '', pendingLastMonth: 0, received: 0, resolved: 0, pending: 0, pending3Months: 0, avgResolutionTime: 0 },
          ]);
        }
        setLoadingTable(false);
      },
      (error) => {
        console.error('Error fetching table data:', error);
        setErrorTable('Failed to load table data. Please try again later.');
        setLoadingTable(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    
      <>
        <Helmet>
          <title>Complaint Data - Wise Global Research</title>
          <meta name="description" content="Complaint Data page — Wise Global Research." />
          <link rel="canonical" href="https://wiseglobalresearch.com/complaintdata" />
        </Helmet>
        <motion.section
          className="py-8 sm:py-12 lg:py-16 px-4 sm:px-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="container">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12 text-adaptive"><Trans i18nKey="pages.ComplaintData.complaint-data-for-july-2025"><Trans i18nKey="pages.ComplaintData.complaint-data-for-july-2025-1">Complaint Data for July 2025</Trans></Trans></h2>
        {loadingTable ? (
          <>
            <div className="flex justify-center items-center py-6">
              <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          </>
        ) : errorTable ? (
          <div className="bg-red-500/20 rounded-xl p-6 shadow-lg border border-red-500/30 text-center text-white">
            {errorTable}
          </div>
          ) : (
            <div className="overflow-x-auto rounded-xl shadow-lg border custom-scrollbar" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
              <table
                className="w-full border-collapse text-left text-xs sm:text-sm text-adaptive"
                aria-label="Complaint Data for July 2025"
                style={{ background: '#D4e3ff', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' }}
              >
              <thead>
                <tr style={{ background: '#D4e3ff' }}>
                  <th className="p-2 sm:p-3 border" style={{ borderColor: 'rgba(0,0,0,0.06)' }}><Trans i18nKey="pages.ComplaintData.sr-no">Sr. No.</Trans></th>
                  <th className="p-2 sm:p-3 border" style={{ borderColor: 'rgba(0,0,0,0.06)' }}><Trans i18nKey="pages.ComplaintData.received-from">Received from</Trans></th>
                  <th className="p-2 sm:p-3 border" style={{ borderColor: 'rgba(0,0,0,0.06)' }}><Trans i18nKey="pages.ComplaintData.pending-at-the-end-of-last-month"><Trans i18nKey="pages.ComplaintData.pending-at-the-end-of-last-month-1">Pending at the end of last month</Trans></Trans></th>
                  <th className="p-2 sm:p-3 border" style={{ borderColor: 'rgba(0,0,0,0.06)' }}><Trans i18nKey="pages.ComplaintData.received">Received</Trans></th>
                  <th className="p-2 sm:p-3 border" style={{ borderColor: 'rgba(0,0,0,0.06)' }}><Trans i18nKey="pages.ComplaintData.resolved">Resolved</Trans></th>
                  <th className="p-2 sm:p-3 border" style={{ borderColor: 'rgba(0,0,0,0.06)' }}><Trans i18nKey="pages.ComplaintData.pending">Pending</Trans></th>
                  <th className="p-2 sm:p-3 border" style={{ borderColor: 'rgba(0,0,0,0.06)' }}><Trans i18nKey="pages.ComplaintData.pending-complaints-3-months"><Trans i18nKey="pages.ComplaintData.pending-complaints-3-months-1">Pending Complaints 3 Months</Trans></Trans></th>
                  <th className="p-2 sm:p-3 border" style={{ borderColor: 'rgba(0,0,0,0.06)' }}><Trans i18nKey="pages.ComplaintData.average-resolution-time-in-days"><Trans i18nKey="pages.ComplaintData.average-resolution-time-in-days-1">Average Resolution time (in days)^</Trans></Trans></th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((row) => (
                  <tr key={row.srNo} className="transition-colors" style={{ background: 'transparent' }}>
                    <td className="p-2 sm:p-3 border" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>{row.srNo}</td>
                    <td className="p-2 sm:p-3 border" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>{row.source}</td>
                    <td className="p-2 sm:p-3 border" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>{row.pendingLastMonth || 0}</td>
                    <td className="p-2 sm:p-3 border" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>{row.received || 0}</td>
                    <td className="p-2 sm:p-3 border" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>{row.resolved || 0}</td>
                    <td className="p-2 sm:p-3 border" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>{row.pending || 0}</td>
                    <td className="p-2 sm:p-3 border" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>{row.pending3Months || 0}</td>
                    <td className="p-2 sm:p-3 border" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>{row.avgResolutionTime || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
          <p className="mt-4 text-xs sm:text-sm text-gray-700 dark:text-gray-300"><Trans i18nKey="pages.ComplaintData.average-resolution-time-is-the-sum-total"><Trans i18nKey="pages.ComplaintData.average-resolution-time-is-the-sum-total-1">^ Average Resolution time is the sum total of time taken to resolve each complaint in days, in the current month divided by total number of complaints resolved in the current month.</Trans></Trans></p>

          <div className="mt-3 text-xs sm:text-sm text-black dark:text-gray-300 space-y-1">
            <p><strong>*</strong> Inclusive of complaints of previous months resolved in the current month.</p>
            <p><strong>#</strong> Inclusive of complaints pending as on the last day of the month.</p>
            <p><strong>*</strong> Inclusive of complaints of previous years resolved in the current year.</p>
            <p><strong>#</strong> Inclusive of complaints pending as on the last day of the year (as on 31st March).</p>
          </div>
        </div>
      </motion.section>
    </>
  );
};

export default ComplaintData;