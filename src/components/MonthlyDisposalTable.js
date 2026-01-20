import React, { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from '../firebase';
import { toast } from 'react-toastify';

// ...existing code...

// ...existing code...

// ...existing code...

const MonthlyDisposalTable = () => {
  const [tableData, setTableData] = useState([]);
// ...existing code...

  useEffect(() => {
    const tableRef = ref(db, 'monthlyDisposalTableData');
    const unsubscribe = onValue(
      tableRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setTableData(Array.isArray(data) ? data : Object.values(data));
        } else {
          setTableData([
            { srNo: 1, month: 'April, 2025', carried: 1, received: 0, resolved: 1, pending: 0 },
            { srNo: 2, month: 'May, 2025', carried: 0, received: 0, resolved: 0, pending: 0 },
            { srNo: 3, month: 'June, 2025', carried: 0, received: 2, resolved: 2, pending: 0 },
            { srNo: 4, month: 'July, 2025', carried: 0, received: 0, resolved: 0, pending: 0 },
            { srNo: 5, month: 'Aug, 2025', carried: 0, received: 0, resolved: 0, pending: 0 },
            { srNo: 6, month: 'Sep, 2025', carried: 0, received: 0, resolved: 0, pending: 0 },
            { srNo: 7, month: 'Oct, 2025', carried: 0, received: 0, resolved: 0, pending: 0 },
            { srNo: 8, month: 'Nov, 2025', carried: 0, received: 0, resolved: 0, pending: 0 },
            { srNo: 9, month: 'Dec, 2025', carried: 0, received: 0, resolved: 0, pending: 0 },
            { srNo: 10, month: 'Jan, 2025', carried: 0, received: 0, resolved: 0, pending: 0 },
            { srNo: 11, month: 'Feb, 2026', carried: 0, received: 0, resolved: 0, pending: 0 },
            { srNo: 12, month: 'March, 2026', carried: 0, received: 0, resolved: 0, pending: 0 },
            { srNo: 'Grand Total', month: '', carried: 1, received: 2, resolved: 3, pending: 0 },
          ]);
        }
      },
      (error) => {
        if (error && error.code === 'PERMISSION_DENIED') {
          // Silent fallback for public view
          setTableData([
            { srNo: 1, month: 'April, 2025', carried: 1, received: 0, resolved: 1, pending: 0 },
            { srNo: 2, month: 'May, 2025', carried: 0, received: 0, resolved: 0, pending: 0 },
            { srNo: 3, month: 'June, 2025', carried: 0, received: 2, resolved: 2, pending: 0 },
            { srNo: 4, month: 'July, 2025', carried: 0, received: 0, resolved: 0, pending: 0 },
            { srNo: 5, month: 'Aug, 2025', carried: 0, received: 0, resolved: 0, pending: 0 },
            { srNo: 6, month: 'Sep, 2025', carried: 0, received: 0, resolved: 0, pending: 0 },
            { srNo: 7, month: 'Oct, 2025', carried: 0, received: 0, resolved: 0, pending: 0 },
            { srNo: 8, month: 'Nov, 2025', carried: 0, received: 0, resolved: 0, pending: 0 },
            { srNo: 9, month: 'Dec, 2025', carried: 0, received: 0, resolved: 0, pending: 0 },
            { srNo: 10, month: 'Jan, 2025', carried: 0, received: 0, resolved: 0, pending: 0 },
            { srNo: 11, month: 'Feb, 2026', carried: 0, received: 0, resolved: 0, pending: 0 },
            { srNo: 12, month: 'March, 2026', carried: 0, received: 0, resolved: 0, pending: 0 },
            { srNo: 'Grand Total', month: '', carried: 1, received: 2, resolved: 3, pending: 0 },
          ]);
        } else {
          toast.error('Failed to load monthly disposal data: ' + error.message);
        }
      }
    );
    return () => unsubscribe();
  }, []);

// ...existing code...

  return (
    <section className="py-8 sm:py-12 lg:py-16 px-4 sm:px-6">
      {/* Scoped responsive styles for stack-table */}
      <style>{`
        .stack-table { width: 100%; border-collapse: collapse; }
        .stack-table thead { display: table-header-group; }
        @media (max-width: 640px) {
          .stack-table thead { display: none; }
          .stack-table tbody, .stack-table tr, .stack-table td { display: block; width: 100%; }
          .stack-table tr { margin-bottom: 0.75rem; border: 1px solid rgba(99,102,241,0.25); border-radius: 12px; overflow: hidden; background: #fff; }
          .stack-table td { box-sizing: border-box; padding: 0.5rem 0.75rem; border-bottom: 1px dashed rgba(99,102,241,0.2); text-align: left !important; }
          .stack-table td:last-child { border-bottom: none; }
          .stack-table td::before { content: attr(data-label); display: block; font-size: 0.75rem; font-weight: 600; color: #3730a3; margin-bottom: 2px; }
        }
      `}</style>
      <div className="container max-w-3xl mx-auto">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 text-indigo-700">
          Trend Of Monthly Disposal Of Complaints
        </h2>
        <div className="rounded-2xl overflow-hidden shadow-2xl border" style={{ background: '#fff', border: '2px solid #6366f1', color: '#111', boxShadow: '0 8px 32px 0 rgba(60,60,120,0.18), 0 1.5px 8px 0 rgba(99,102,241,0.10)' }}>
          <div className="overflow-x-auto">
            <table
              className="stack-table w-full border-separate border-spacing-0 text-left text-xs sm:text-sm"
              style={{ background: 'transparent' }}
              aria-label="Monthly disposal trend of complaints with carried, received, resolved and pending counts"
            >
              <caption className="sr-only">Monthly disposal trend of complaints with carried, received, resolved and pending counts</caption>
              <thead>
                <tr className="bg-gray-50">
                  <th scope="col" className="p-2 sm:p-3 text-center min-w-[70px]" style={{ color: '#111' }}>Sr. No.</th>
                  <th scope="col" className="p-2 sm:p-3 text-center min-w-[120px]" style={{ color: '#111' }}>Month</th>
                  <th scope="col" className="p-2 sm:p-3 text-center min-w-[180px]" style={{ color: '#111' }}>Carried forward from previous month</th>
                  <th scope="col" className="p-2 sm:p-3 text-center min-w-[90px]" style={{ color: '#111' }}>Received</th>
                  <th scope="col" className="p-2 sm:p-3 text-center min-w-[90px]" style={{ color: '#111' }}>Resolved*</th>
                  <th scope="col" className="p-2 sm:p-3 text-center min-w-[90px]" style={{ color: '#111' }}>Pending#</th>
                </tr>
              </thead>
              <tbody>
                {(Array.isArray(tableData) ? tableData : Object.values(tableData || {})).map(row => (
                  <tr key={row.srNo} className="transition-colors hover:bg-gray-50" style={{ backgroundColor: '#fff' }}>
                    <td data-label="Sr. No." className="p-2 sm:p-3 text-center min-w-[70px]">{row.srNo}</td>
                    <td data-label="Month" className="p-2 sm:p-3 text-center min-w-[120px]">{row.month}</td>
                    <td data-label="Carried forward from previous month" className="p-2 sm:p-3 text-center min-w-[180px]">{row.carried}</td>
                    <td data-label="Received" className="p-2 sm:p-3 text-center min-w-[90px]">{row.received}</td>
                    <td data-label="Resolved*" className="p-2 sm:p-3 text-center min-w-[90px]">{row.resolved}</td>
                    <td data-label="Pending#" className="p-2 sm:p-3 text-center min-w-[90px]">{row.pending}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <p className="mt-4 text-xs sm:text-sm text-black/80">
          *Inclusive of complaints of previous months resolved in the current month.<br />
          #Inclusive of complaints pending as on the last day of the month.
        </p>
      </div>
    </section>
  );
};

export default MonthlyDisposalTable;
