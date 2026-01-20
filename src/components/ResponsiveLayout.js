import React from 'react';

// A simple, mobile-first responsive layout wrapper used across pages.
// Uses Tailwind utility classes where available and falls back to CSS helpers
// defined in `src/index.css` (e.g. .container, .responsive-embed).
const ResponsiveLayout = ({ children, className = '' }) => {
  return (
    <div className={`w-full min-h-screen bg-transparent text-adaptive ${className}`}>
      <div className="container mx-auto max-w-screen-md">
        {/* Use a consistent readable max-width for phones and small tablets */}
        <div className="prose max-w-none sm:prose-lg lg:prose-xl">{children}</div>
      </div>
    </div>
  );
};

export default ResponsiveLayout;
