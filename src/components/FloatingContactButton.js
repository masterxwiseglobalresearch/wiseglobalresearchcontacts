
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/floatingContactButton.css';

const FloatingContactButton = () => {
  return (
    <Link
      to="/contact"
      className="floating-contact-btn floating-contact-rotated font-bold hover:opacity-95 whitespace-nowrap py-2 px-3 text-sm sm:py-3 sm:px-4 sm:text-base lg:py-4 lg:px-5 lg:text-lg"
      aria-label="Open Contact Page"
    >
      <span className="px-1">Contact Us</span>
    </Link>
  );
};

export default FloatingContactButton;
