// pages/NotFound.js
import React from 'react';
import { Trans } from '../i18nShim';
import { Link } from 'react-router-dom';


import { Helmet } from 'react-helmet-async';
function NotFound() {
  return (
    <>
      <Helmet>
        <title>Not Found - Wise Global Research</title>
        <meta name="description" content="Not Found page — Wise Global Research." />
        <link rel="canonical" href="https://wiseglobalresearch.com/notfound" />
      </Helmet>
<div className="text-center py-20">
      <h1 className="text-4xl font-bold mb-4"><Trans i18nKey="pages.NotFound.404-page-not-found">404 - Page Not Found</Trans></h1>
      <p className="mb-4"><Trans i18nKey="pages.NotFound.sorry-the-page-you-re-looking-for-doesn-"><Trans i18nKey="pages.NotFound.sorry-the-page-you-re-looking-for-doesn--1">Sorry, the page you're looking for doesn't exist.</Trans></Trans></p>
      <Link to="/" className="text-blue-500 underline"><Trans i18nKey="pages.NotFound.go-to-home">Go to Home</Trans></Link>
    </div>
    </>
  );
}

export default NotFound;
