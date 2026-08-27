import { useState, useCallback } from 'react';

type OCRState = {
  isProcessing: boolean;
  progress: number;
  text: string;
  error: string | null;
  recognize: (image: string) => Promise<string>;
  reset: () => void;
};

export function useOCR(): OCRState {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [text, setText] = useState('');
  const [error, setError] = useState<string | null>(null);

  const recognize = useCallback(async (image: string): Promise<string> => {
    setIsProcessing(true);
    setProgress(0);
    setError(null);
    setText('');

    try {
      const Tesseract = await import('tesseract.js');
      const result = await Tesseract.recognize(image, 'eng', {
        logger: (m: any) => {
          if (m.status === 'recognizing text') {
            setProgress(Math.round(m.progress * 100));
          }
        },
      });
      const recognized = (result.data.text || '').trim();
      setText(recognized);
      setProgress(100);
      setIsProcessing(false);
      return recognized;
    } catch (err: any) {
      setError('We could not read this document clearly. Please try scanning again or upload a clearer image.');
      setIsProcessing(false);
      return '';
    }
  }, []);

  const reset = useCallback(() => {
    setIsProcessing(false);
    setProgress(0);
    setText('');
    setError(null);
  }, []);

  return { isProcessing, progress, text, error, recognize, reset };
}
