import React from 'react';
import { FaQrcode } from 'react-icons/fa';

const QrImageManageButton = ({ onClick }) => (
  <button
    type="button"
    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm font-semibold shadow"
    onClick={onClick}
    aria-label="Manage QR Image"
  >
    <FaQrcode className="text-lg" />
    Manage QR Image
  </button>
);

export default QrImageManageButton;
