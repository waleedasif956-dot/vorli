import { useState, useRef, useCallback, useEffect } from "react";

interface UseSpeechRecognitionOptions {
  targetText?: string;
  language?: string;
}

interface SpeechRecognitionResult {
  transcript: string;
  confidence: number;
  accuracy: number;
  isListening: boolean;
  error: string | null;
}

// Calculate accuracy between spoken text and target text
const calculateAccuracy = (spoken: string, target: string): number => {
  if (!target || !spoken) return 0;
  
  const spokenWords = spoken.toLowerCase().trim().split(/\s+/);
  const targetWords = target.toLowerCase().trim().split(/\s+/);
  
  let matchedWords = 0;
  
  spokenWords.forEach(spokenWord => {
    const cleanSpoken = spokenWord.replace(/[^a-z]/g, '');
    targetWords.forEach(targetWord => {
      const cleanTarget = targetWord.replace(/[^a-z]/g, '');
      if (cleanSpoken === cleanTarget || 
          cleanSpoken.includes(cleanTarget) || 
          cleanTarget.includes(cleanSpoken)) {
        matchedWords++;
      }
    });
  });
  
  const accuracy = Math.min((matchedWords / targetWords.length) * 100, 100);
  return Math.round(accuracy);
};

export const useSpeechRecognition = (options: UseSpeechRecognitionOptions = {}) => {
  const { targetText = "", language = "en-US" } = options;
  
  const [result, setResult] = useState<SpeechRecognitionResult>({
    transcript: "",
    confidence: 0,
    accuracy: 0,
    isListening: false,
    error: null,
  });
  
  const recognitionRef = useRef<any>(null);
  const isSupported = typeof window !== "undefined" && 
    ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);

  const startListening = useCallback(() => {
    if (!isSupported) {
      setResult(prev => ({ ...prev, error: "Speech recognition not supported" }));
      return;
    }

    const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognitionAPI();
    
    const recognition = recognitionRef.current;
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = language;

    recognition.onstart = () => {
      setResult(prev => ({ 
        ...prev, 
        isListening: true, 
        error: null,
        transcript: "",
        confidence: 0,
        accuracy: 0
      }));
    };

    recognition.onresult = (event: any) => {
      let finalTranscript = "";
      let interimTranscript = "";
      let maxConfidence = 0;

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
          maxConfidence = Math.max(maxConfidence, result[0].confidence);
        } else {
          interimTranscript += result[0].transcript;
          maxConfidence = Math.max(maxConfidence, result[0].confidence);
        }
      }

      const transcript = finalTranscript || interimTranscript;
      const confidence = Math.round(maxConfidence * 100);
      const accuracy = calculateAccuracy(transcript, targetText);

      setResult(prev => ({
        ...prev,
        transcript,
        confidence: confidence || prev.confidence,
        accuracy,
      }));
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      setResult(prev => ({ 
        ...prev, 
        error: event.error,
        isListening: false 
      }));
    };

    recognition.onend = () => {
      setResult(prev => ({ ...prev, isListening: false }));
    };

    recognition.start();
  }, [isSupported, language, targetText]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
  }, []);

  const reset = useCallback(() => {
    stopListening();
    setResult({
      transcript: "",
      confidence: 0,
      accuracy: 0,
      isListening: false,
      error: null,
    });
  }, [stopListening]);

  useEffect(() => {
    return () => {
      stopListening();
    };
  }, [stopListening]);

  return {
    ...result,
    isSupported,
    startListening,
    stopListening,
    reset,
  };
};
