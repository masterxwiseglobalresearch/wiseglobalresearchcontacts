


import React from 'react';

import ComplaintTable from '../components/ComplaintTable';
import MonthlyDisposalTable from '../components/MonthlyDisposalTable';
import AnnualDisposalTable from '../components/AnnualDisposalTable';



import { Helmet } from 'react-helmet-async';
function ContactDataPage() {
  return (
    <>
      <Helmet>
        <title>Contact Data Page - Wise Global Research</title>
        <meta name="description" content="Contact Data Page page — Wise Global Research." />
        <link rel="canonical" href="https://wiseglobalresearch.com/contactdatapage" />
      </Helmet>
      <div className="min-h-screen bg-transparent text-white relative overflow-hidden">
        <ComplaintTable />
        <MonthlyDisposalTable />
        <AnnualDisposalTable />
      </div>
    </>
  );
}

export default ContactDataPage;
