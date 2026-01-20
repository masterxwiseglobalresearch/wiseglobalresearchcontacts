import React, { useEffect, useState } from 'react';
import { FaWhatsapp, FaComments, FaUniversalAccess, FaVolumeUp } from 'react-icons/fa';
import { motion } from 'framer-motion';

// Compact mobile action tray shown only on small screens
export default function MobileActionTray() {
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    // Listen for chat open/close events
    const openHandler = () => setChatOpen(true);
    const closeHandler = () => setChatOpen(false);
    document.addEventListener('open-chat-widget', openHandler);
    // Listen for close: ChatWidget closes on setIsOpen(false), so we need a custom event for close
    document.addEventListener('close-chat-widget', closeHandler);
    // Optionally, patch window.openChatWidget to also set state
    if (typeof window !== 'undefined') {
      const origOpen = window.openChatWidget;
      window.openChatWidget = function(...args) {
        setChatOpen(true);
        if (typeof origOpen === 'function') origOpen.apply(this, args);
      };
    }
    // Listen for ESC or overlay click (in case chat closes)
    const escHandler = (e) => {
      if (e.key === 'Escape') setChatOpen(false);
    };
    window.addEventListener('keydown', escHandler);
    return () => {
      document.removeEventListener('open-chat-widget', openHandler);
      document.removeEventListener('close-chat-widget', closeHandler);
      window.removeEventListener('keydown', escHandler);
    };
  }, []);
  const openWhatsApp = () => {
    // open external WhatsApp link (same as WhatsAppButton href)
    window.open('https://api.whatsapp.com/send/?phone=919977909494&text=Hey+Wise+Global+Research+Service+team%2C+I+need+help+with+trading.+Please+guide+me.&type=phone_number&app_absent=0', '_blank', 'noopener');
  };

  const openChat = () => {
    // dispatch a custom event the ChatWidget listens for
    try {
      const ev = new CustomEvent('open-chat-widget');
      document.dispatchEvent(ev);
      // some environments listen on window — dispatch there too
      if (window && window.dispatchEvent) window.dispatchEvent(ev);
      // final fallback: call global function if the chat exposes it
      if (typeof window.openChatWidget === 'function') window.openChatWidget();
    } catch (e) {
      if (typeof window.openChatWidget === 'function') window.openChatWidget();
    }
  };

  const openA11y = () => {
    try {
      const ev = new CustomEvent('open-accessibility-menu');
      document.dispatchEvent(ev);
      if (window && window.dispatchEvent) window.dispatchEvent(ev);
    } catch (e) {
      // no-op
    }
  };

  const openSpeaker = () => {
    try {
      const ev = new CustomEvent('open-speaker-panel');
      document.dispatchEvent(ev);
      if (window && window.dispatchEvent) window.dispatchEvent(ev);
    } catch (e) {
      // no-op
    }
  };

  const bob = { y: [0, -6, 0], scale: [1, 1.03, 1] };
  const pulse = { scale: [1, 1.04, 1] };

  // Hide tray if chat is open
  if (chatOpen) return null;

  return (
    <div className="mobile-action-tray md:hidden fixed right-4 bottom-20 z-50 flex flex-col gap-3 bg-transparent p-1 rounded-full items-center shadow-lg">
      <motion.button aria-label="WhatsApp" onClick={openWhatsApp} className="w-12 h-12 rounded-full bg-green-500 text-white flex items-center justify-center shadow" whileTap={{ scale: 0.96 }} animate={pulse} transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}>
        <FaWhatsapp />
      </motion.button>
      <motion.button aria-label="Chat" onClick={openChat} className="w-10 h-10 rounded-full bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white flex items-center justify-center shadow chat-launcher-animated-border" whileTap={{ scale: 0.96 }} animate={bob} transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}>
        <FaComments />
        {/* border effect span used by ChatWidget for consistent look */}
        <span aria-hidden="true" className="border-effect" />
      </motion.button>
      <motion.button aria-label="Accessibility" onClick={openA11y} className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow" whileTap={{ scale: 0.96 }} animate={pulse} transition={{ duration: 2.0, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}>
        <FaUniversalAccess />
      </motion.button>
      <motion.button aria-label="Speaker" onClick={openSpeaker} className="w-12 h-12 rounded-full bg-gradient-to-r from-[#7c6cf6] to-[#6366f1] text-white flex items-center justify-center shadow" whileTap={{ scale: 0.96 }} animate={pulse} transition={{ duration: 1.9, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}>
        <FaVolumeUp />
      </motion.button>
    </div>
  );
}
