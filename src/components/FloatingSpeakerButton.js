import React from 'react';
import '../styles/floatingSpeakerButton.css';

const FloatingSpeakerButton = () => {
  const openSpeakerPanel = () => {
    const event = new CustomEvent('open-speaker-panel');
    document.dispatchEvent(event);
  };

  return (
    <button
      onClick={openSpeakerPanel}
      className="floating-speaker-anim fixed top-1/2 right-0 z-50 bg-green-600 text-white font-bold py-3 px-4 rounded-l-lg shadow-lg hover:bg-green-700 transition-all transform translate-y-1/2 rotate-90 origin-bottom-right hover:scale-110 flex items-center justify-center text-center"
      style={{ right: '-10px' }}
      aria-label="Open speaker menu"
    >
      🔊
    </button>
  );
};

export default FloatingSpeakerButton;
