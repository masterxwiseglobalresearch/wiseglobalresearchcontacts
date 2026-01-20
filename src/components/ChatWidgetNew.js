import React, { useState, useRef, useEffect } from 'react';

// Modern, high-contrast, responsive ChatWidget
const BOT_NAME = 'Dudu';
const BOT_STATUS = 'Online';

const initialMessages = [
  { fromUser: false, text: `Hi! I am ${BOT_NAME}. How can I help you today?`, id: 'welcome' },
];

const ChatWidgetNew = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Responsive state
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 600);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [messages, isOpen]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = { fromUser: true, text: input, id: Date.now() + '-user' };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { fromUser: false, text: `You said: "${userMsg.text}"`, id: Date.now() + '-bot' },
      ]);
      setIsTyping(false);
    }, 900);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  // Responsive styles
  const launcherSize = isMobile ? 48 : 60;
  const chatWidth = isMobile ? '98vw' : 350;
  const chatHeight = isMobile ? '98vh' : 500;
  const chatRadius = isMobile ? 0 : 18;
  const chatBottom = isMobile ? 0 : 32;
  const chatRight = isMobile ? 0 : 32;
  const headerFont = isMobile ? 16 : 18;
  const inputFont = isMobile ? 14 : 15;
  const msgFont = isMobile ? 14 : 15;
  const inputPad = isMobile ? '8px 10px' : '10px 14px';
  const sendPad = isMobile ? '8px 12px' : '10px 18px';

  return (
    <div style={{ position: 'fixed', bottom: chatBottom, right: chatRight, zIndex: 1000, width: isMobile ? '100vw' : undefined }}>
      {/* Launcher Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            width: launcherSize, height: launcherSize, borderRadius: '50%', background: '#1976d2', color: '#fff',
            boxShadow: '0 4px 16px #1976d244', border: 'none', fontSize: isMobile ? 22 : 28, cursor: 'pointer',
            position: isMobile ? 'fixed' : 'static', bottom: isMobile ? 16 : undefined, right: isMobile ? 16 : undefined,
          }}
          aria-label="Open chat"
        >
          💬
        </button>
      )}
      {/* Chat Panel */}
      {isOpen && (
        <div
          style={{
            width: chatWidth, maxWidth: '100vw', height: chatHeight, maxHeight: '100vh', background: '#fff',
            borderRadius: chatRadius, boxShadow: isMobile ? '0 0 0 #0000' : '0 8px 32px #0002', display: 'flex', flexDirection: 'column',
            border: '2px solid #1976d2', overflow: 'hidden', position: isMobile ? 'fixed' : 'static', bottom: 0, right: 0, left: 0,
            margin: isMobile ? 0 : undefined,
          }}
        >
          {/* Header */}
          <div style={{ background: '#1976d2', color: '#fff', padding: isMobile ? '12px 12px' : '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontWeight: 700, fontSize: headerFont }}>{BOT_NAME}</div>
            <div style={{ fontSize: isMobile ? 12 : 13, opacity: 0.85 }}>{BOT_STATUS}</div>
            <button
              onClick={() => setIsOpen(false)}
              style={{ background: 'none', border: 'none', color: '#fff', fontSize: isMobile ? 20 : 22, cursor: 'pointer', marginLeft: 10 }}
              aria-label="Close chat"
            >
              ×
            </button>
          </div>
          {/* Messages */}
          <div style={{ flex: 1, padding: isMobile ? 8 : 16, background: '#f5f7fa', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: isMobile ? 7 : 12 }}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  alignSelf: msg.fromUser ? 'flex-end' : 'flex-start',
                  background: msg.fromUser ? '#1976d2' : '#fff',
                  color: msg.fromUser ? '#fff' : '#222',
                  borderRadius: msg.fromUser ? (isMobile ? '14px 14px 3px 14px' : '18px 18px 4px 18px') : (isMobile ? '14px 14px 14px 3px' : '18px 18px 18px 4px'),
                  padding: isMobile ? '7px 11px' : '10px 16px',
                  maxWidth: '85%',
                  fontWeight: 500,
                  boxShadow: msg.fromUser ? '0 2px 8px #1976d233' : '0 2px 8px #0001',
                  border: msg.fromUser ? '1.5px solid #115293' : '1.5px solid #e0e0e0',
                  fontSize: msgFont,
                }}
              >
                {msg.text}
              </div>
            ))}
            {isTyping && (
              <div style={{ alignSelf: 'flex-start', color: '#1976d2', fontWeight: 600, fontSize: msgFont }}>Typing...</div>
            )}
            <div ref={messagesEndRef} />
          </div>
          {/* Input */}
          <div style={{ padding: isMobile ? 7 : 14, background: '#fff', borderTop: '1.5px solid #e0e0e0', display: 'flex', gap: isMobile ? 4 : 8 }}>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              style={{
                flex: 1, padding: inputPad, borderRadius: 20, border: '1.5px solid #bdbdbd', fontSize: inputFont,
                outline: 'none', background: '#f5f7fa', color: '#222',
              }}
              aria-label="Type your message"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              style={{
                background: '#1976d2', color: '#fff', border: 'none', borderRadius: 20, padding: sendPad, fontWeight: 600,
                fontSize: inputFont, cursor: input.trim() ? 'pointer' : 'not-allowed', opacity: input.trim() ? 1 : 0.6,
              }}
              aria-label="Send message"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWidgetNew;
