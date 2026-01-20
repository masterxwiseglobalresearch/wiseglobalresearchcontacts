import React from 'react';

function WhatsAppButton() {
  return (
    <a
      href="https://api.whatsapp.com/send/?phone=919009909963&text=Hey+Wise+Global+Research+Service+team%2C+I+need+help+with+trading.+Please+guide+me.&type=phone_number&app_absent=0"
      target="_blank"
      rel="noopener noreferrer"
    aria-label="Chat with us on WhatsApp"
  className="hidden md:flex fixed bottom-7 right-6 sm:bottom-7 sm:right-6 z-50 w-14 h-14 items-center justify-center bg-purple-500 hover:bg-purple-600 text-white text-adaptive rounded-full shadow-lg transition-transform duration-200 ease-in-out transform hover:scale-105 active:scale-95"
      data-aos="zoom-in"
    >
      {/* ping ring for subtle attention — respects reduced motion */}
      <span className="absolute inline-flex h-14 w-14 rounded-full bg-purple-400 opacity-30 motion-safe:animate-ping motion-reduce:opacity-0" aria-hidden="true"></span>
      {/* Inline WhatsApp SVG icon to avoid external font/icon libraries */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 448 512"
        aria-hidden="true"
        focusable="false"
        className="w-7 h-7 fill-current"
      >
        <path d="M380.9 97.1C339 55.1 283.2 32 224.9 32 106.6 32 10.7 127.9 10.7 246.2c0 37.8 9.9 74.8 28.7 107.4L0 480l129.7-38c31.5 17.2 67.1 26.2 103.4 26.2h.1c118.3 0 214.1-95.9 214.1-214.2 0-58.3-23.1-114.1-65-156.9zM224.8 426.7h-.1c-32.2 0-63.7-8.6-91.2-24.8l-6.5-3.9-76.9 22.5 22.9-75-4.1-6.8c-17.6-28.9-26.8-62.2-26.8-96.1 0-100.1 81.5-181.6 181.7-181.6 48.5 0 94.1 18.9 128.4 53.2s53.1 79.8 53.1 128.3c0 100.2-81.5 181.7-181.5 181.7zm101-138.7c-5.5-2.8-32.7-16.1-37.8-17.9-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 17.9-17.6 21.7-3.2 3.7-6.5 4.2-12 1.4-5.5-2.8-23.1-8.5-44-27.1-16.3-14.5-27.3-32.5-30.5-38-3.2-5.6-.3-8.6 2.4-11.4 2.5-2.5 5.5-6.5 8.2-9.7 2.7-3.2 3.7-5.6 5.5-9.3 1.8-3.7.9-7-0.5-9.7-1.4-2.8-12.5-30.1-17.1-41.3-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-7-.2-10.8-.2s-9.7 1.4-14.8 7c-5.1 5.6-19.4 19-19.4 46.3s19.9 53.7 22.6 57.4c2.8 3.7 39.2 59.9 94.9 84.1 13.3 5.7 23.7 9.1 31.8 11.6 13.3 4.2 25.5 3.6 35.1 2.2 10.7-1.6 32.7-13.4 37.3-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.3-5.1-3.7-10.6-6.5z" />
      </svg>
    </a>
  );
}

export default WhatsAppButton;
