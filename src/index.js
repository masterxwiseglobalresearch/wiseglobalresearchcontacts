import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';

import './index.css';
// i18n removed — using simple fallback shim when needed
import reportWebVitals from './reportWebVitals';
import initAnalytics from './setup/analytics-init';



const root = ReactDOM.createRoot(document.getElementById('root'));
// Initialize analytics (UTM capture, SPA page_view, click/form instrumentation)
initAnalytics();
root.render(
  <React.StrictMode>
    <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <App />
      </BrowserRouter>
  </React.StrictMode>
  );

// Start collecting basic web vitals (logs to console by default)
reportWebVitals();