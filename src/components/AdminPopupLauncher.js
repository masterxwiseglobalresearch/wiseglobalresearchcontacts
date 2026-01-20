import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import AdminPopupImage from './AdminPopupImage';

// AdminPopupLauncher supports variants:
// - 'dashboard' : renders a card-style button similar to Dashboard cards
// - 'sidebar'   : small compact button suitable for sidebar placement
// - default     : simple pill button
const AdminPopupLauncher = ({ buttonLabel = 'Edit Popup Image', variant = 'default' }) => {
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);
  const openModal = () => setOpen(true);

  const modal = (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded shadow-lg max-w-3xl w-full p-4 text-black">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-medium text-black">Edit popup image</h3>
          <button onClick={close} aria-label="Close" className="px-2 py-1 text-black">✕</button>
        </div>
        <AdminPopupImage />
      </div>
    </div>
  );

  if (variant === 'dashboard') {
    return (
      <>
        <div
          role="button"
          onClick={openModal}
          className="backdrop-blur-md p-4 sm:p-6 rounded-xl shadow-lg flex items-center space-x-3 hover:shadow-xl cursor-pointer"
          style={{ background: 'var(--bg-muted)', border: '1px solid var(--bg-border)' }}
        >
          <div className="flex-shrink-0 flex items-center justify-center rounded-full bg-indigo-500/20 text-indigo-400 w-12 h-12 text-2xl"> 
            ✦
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-adaptive truncate">{buttonLabel}</p>
            <p className="text-xs text-gray-500">Click to edit popup image</p>
          </div>
        </div>
        {open && typeof document !== 'undefined' ? createPortal(modal, document.body) : null}
      </>
    );
  }

  if (variant === 'sidebar') {
    return (
      <>
        <button
          onClick={openModal}
          className="w-full flex items-center gap-2 px-4 py-2 rounded-lg transition-colors"
          style={{ background: 'linear-gradient(90deg,var(--accent, #22c55e), #1fbf18)', color: 'var(--text-body, #000)' }}
        >
          <span className="text-sm font-medium">{buttonLabel}</span>
        </button>
        {open && typeof document !== 'undefined' ? createPortal(modal, document.body) : null}
      </>
    );
  }

  // default pill
  return (
    <>
      <button onClick={openModal} className="px-3 py-1 bg-indigo-600 text-white rounded">
        {buttonLabel}
      </button>
      {open && typeof document !== 'undefined' ? createPortal(modal, document.body) : null}
    </>
  );
};

export default AdminPopupLauncher;
