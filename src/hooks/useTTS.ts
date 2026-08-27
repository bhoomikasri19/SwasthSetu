import { useEffect, useCallback, useRef } from 'react';

export function useTTS() {
  const isPlayingRef = useRef(false);

  const speak = useCallback((text: string, lang: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    if (!text) return;

    const utterance = new SpeechSynthesisUtterance(text);
    const bcp47: Record<string, string> = {
      hi: 'hi-IN', en: 'en-IN', mr: 'mr-IN', gu: 'gu-IN',
      bn: 'bn-IN', ta: 'ta-IN', te: 'te-IN', kn: 'kn-IN',
      pa: 'pa-IN', or: 'or-IN',
    };
    utterance.lang = bcp47[lang] || 'en-IN';
    utterance.rate = 0.9;
    utterance.onstart = () => { isPlayingRef.current = true; };
    utterance.onend = () => { isPlayingRef.current = false; };
    utterance.onerror = () => { isPlayingRef.current = false; };
    window.speechSynthesis.speak(utterance);
  }, []);

  const stop = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    isPlayingRef.current = false;
  }, []);

  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return { speak, stop, isPlaying: isPlayingRef };
}
