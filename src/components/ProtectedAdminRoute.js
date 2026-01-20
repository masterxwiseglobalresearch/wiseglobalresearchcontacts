// src/components/ProtectedAdminRoute.js
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useAdmin } from '../hooks/useAdmin';

function ProtectedAdminRoute({ children }) {
  const { user, loading } = useAuth();
  const { isAdmin, isSupport, isHrOnly, checking } = useAdmin();
  const location = useLocation();

  if (loading || checking) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // If not logged in, redirect to login page, saving the current location
  if (!user) {
    return <Navigate to="/user-login" state={{ from: location }} replace />;
  }

  // Allow support role limited to specific admin pages (no dashboard/index)
  const path = location.pathname || '';
  const supportAllowed = /^\/admin\/(reports|complaint-box|complaints|app-service)(\/?|$)/.test(path);

  // HR-only users can only access /admin/jobs
  const hrAllowed = /^\/admin\/(jobs)(\/?|$)/.test(path);

  if (!isAdmin && isHrOnly) {
    // Redirect HR-only users to jobs if they land elsewhere under /admin
    if (!hrAllowed) {
      return <Navigate to="/admin/jobs" replace />;
    }
  }

  // If support lands on /admin or /admin/dashboard, redirect to an allowed page
  if (!isAdmin && isSupport) {
    if (path === '/admin' || path === '/admin/' || path === '/admin/dashboard') {
      return <Navigate to="/admin/reports" replace />;
    }
  }

  // If neither admin nor permitted support access, show 403
  if (!isAdmin && !(isSupport && supportAllowed) && !(isHrOnly && hrAllowed)) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center p-6">
        <h1 className="text-3xl font-bold mb-2">403</h1>
        <p className="mb-4">You don’t have permission to access this page.</p>
        <a className="text-blue-600 underline" href="/">Go back home</a>
      </div>
    );
  }

  return children;
}

export default ProtectedAdminRoute;