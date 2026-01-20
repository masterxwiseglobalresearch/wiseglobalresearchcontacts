import { useCallback, useEffect, useState } from 'react';

export default function useSpeechSynthesis({ lang = 'en', rate = 1, pitch = 1, voiceName = '' } = {}) {
  const [voices, setVoices] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const loadVoices = () => setVoices(window.speechSynthesis.getVoices() || []);
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => { try { window.speechSynthesis.onvoiceschanged = null; } catch(_) {} };
  }, []);

  const speak = useCallback((text, { onstart, onend, onerror } = {}) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = lang === 'hi' ? 'hi-IN' : 'en-US';
      utter.rate = rate;
      utter.pitch = pitch;

      const selectedVoice = voices.find(v => v.name === voiceName);
      if (selectedVoice) utter.voice = selectedVoice;

      utter.onstart = (e) => { setIsSpeaking(true); setIsPaused(false); if (typeof onstart === 'function') onstart(e); };
      utter.onend = (e) => { setIsSpeaking(false); setIsPaused(false); if (typeof onend === 'function') onend(e); };
      utter.onerror = (e) => { setIsSpeaking(false); setIsPaused(false); console.error('Speech error', e); if (typeof onerror === 'function') onerror(e); };

      try { window.speechSynthesis.cancel(); } catch(_) {}
      window.speechSynthesis.speak(utter);
      return utter;
    } catch (err) {
      console.error('speak() failed', err);
      if (typeof onerror === 'function') onerror(err);
    }
  }, [lang, rate, pitch, voiceName, voices]);

  const pause = () => { if (typeof window !== 'undefined' && window.speechSynthesis.speaking) { window.speechSynthesis.pause(); setIsPaused(true); } };
  const resume = () => { if (typeof window !== 'undefined' && window.speechSynthesis.paused) { window.speechSynthesis.resume(); setIsPaused(false); } };
  const cancel = () => { if (typeof window !== 'undefined') { try { window.speechSynthesis.cancel(); } catch(_) {} setIsSpeaking(false); setIsPaused(false); } };

  return { speak, pause, resume, cancel, voices, isSpeaking, isPaused };
}
