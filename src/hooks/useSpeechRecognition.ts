import { useEffect, useState, useRef, useCallback } from 'react';

type SpeechRecognitionState = {
  isListening: boolean;
  transcript: string;
  interimTranscript: string;
  error: string | null;
  isSupported: boolean;
  start: () => void;
  stop: () => void;
  reset: () => void;
};

export function useSpeechRecognition(lang: string): SpeechRecognitionState {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);
  const isSupported = typeof window !== 'undefined' &&
    ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);

  const bcp47Map: Record<string, string> = {
    hi: 'hi-IN',
    en: 'en-IN',
    mr: 'mr-IN',
    gu: 'gu-IN',
    bn: 'bn-IN',
    ta: 'ta-IN',
    te: 'te-IN',
    kn: 'kn-IN',
    pa: 'pa-IN',
    or: 'or-IN',
  };

  useEffect(() => {
    if (!isSupported) return;

    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SR();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = bcp47Map[lang] || 'en-IN';

    recognition.onresult = (event: any) => {
      let finalText = '';
      let interimText = '';
      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalText += result[0].transcript;
        } else {
          interimText += result[0].transcript;
        }
      }
      if (finalText) {
        setTranscript((prev) => (prev ? prev + ' ' : '') + finalText.trim());
      }
      setInterimTranscript(interimText);
    };

    recognition.onerror = (event: any) => {
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        setError('Microphone permission denied. Please allow microphone access and try again.');
      } else if (event.error === 'no-speech') {
        setError('No speech detected. Please try speaking again.');
      } else if (event.error === 'network') {
        setError('Network error during speech recognition. Please check your connection.');
      } else {
        setError(`Speech recognition error: ${event.error}`);
      }
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      setInterimTranscript('');
    };

    recognitionRef.current = recognition;

    return () => {
      try { recognition.abort(); } catch { /* noop */ }
      recognitionRef.current = null;
    };
  }, [lang, isSupported]);

  const start = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
    setError(null);
    if (!isSupported) {
      setError('Live voice recognition is not available in this browser. Use touch input instead.');
      return;
    }
    const recognition = recognitionRef.current;
    if (!recognition) return;
    try {
      recognition.start();
      setIsListening(true);
    } catch {
      // Already started — stop and restart
      try { recognition.stop(); } catch { /* noop */ }
      try { recognition.start(); setIsListening(true); } catch { /* noop */ }
    }
  }, [isSupported]);

  const stop = useCallback(() => {
    const recognition = recognitionRef.current;
    if (recognition) {
      try { recognition.stop(); } catch { /* noop */ }
    }
    setIsListening(false);
  }, []);

  const reset = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
    setError(null);
  }, []);

  return { isListening, transcript, interimTranscript, error, isSupported, start, stop, reset };
}
