import React from 'react';

const GlobalLayout = ({ children }) => (
  <div className="flex flex-col bg-trasprint">
    <main className="flex-1 container mx-auto py-6 px-4 text-white">
      {children}
    </main>
  </div>
);

export default GlobalLayout;
