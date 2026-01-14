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
  
  const normalize = (str: string) => str.toLowerCase().trim().replace(/[^a-z\s]/g, '');
  const spokenNorm = normalize(spoken);
  const targetNorm = normalize(target);
  
  const spokenWords = spokenNorm.split(/\s+/).filter(w => w.length > 0);
  const targetWords = targetNorm.split(/\s+/).filter(w => w.length > 0);
  
  if (targetWords.length === 0) return 0;
  
  let matchedWords = 0;
  const usedIndices = new Set<number>();
  
  spokenWords.forEach(spokenWord => {
    targetWords.forEach((targetWord, idx) => {
      if (!usedIndices.has(idx)) {
        // Exact match or close match (allowing for minor differences)
        if (spokenWord === targetWord || 
            (spokenWord.length > 2 && targetWord.length > 2 && 
             (spokenWord.includes(targetWord) || targetWord.includes(spokenWord)))) {
          matchedWords++;
          usedIndices.add(idx);
        }
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
  const isStoppingRef = useRef(false);
  const fullTranscriptRef = useRef("");
  
  const isSupported = typeof window !== "undefined" && 
    ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);

  const stopListening = useCallback(() => {
    isStoppingRef.current = true;
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // Ignore errors when stopping
      }
      recognitionRef.current = null;
    }
    setResult(prev => ({ ...prev, isListening: false }));
  }, []);

  const startListening = useCallback(() => {
    if (!isSupported) {
      setResult(prev => ({ ...prev, error: "Speech recognition not supported" }));
      return;
    }

    // Stop any existing recognition first
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // Ignore
      }
      recognitionRef.current = null;
    }

    isStoppingRef.current = false;
    fullTranscriptRef.current = "";

    const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognitionAPI();
    recognitionRef.current = recognition;
    
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = language;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      if (!isStoppingRef.current) {
        setResult({
          transcript: "",
          confidence: 0,
          accuracy: 0,
          isListening: true,
          error: null,
        });
      }
    };

    recognition.onresult = (event: any) => {
      if (isStoppingRef.current) return;
      
      let finalTranscript = "";
      let interimTranscript = "";
      let maxConfidence = 0;

      // Build full transcript from all results
      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i];
        const transcript = result[0].transcript;
        const confidence = result[0].confidence;
        
        if (result.isFinal) {
          finalTranscript += transcript + " ";
          maxConfidence = Math.max(maxConfidence, confidence);
        } else {
          interimTranscript += transcript;
          maxConfidence = Math.max(maxConfidence, confidence || 0.8);
        }
      }

      // Store final transcript for accumulation
      if (finalTranscript) {
        fullTranscriptRef.current = finalTranscript.trim();
      }

      const displayTranscript = fullTranscriptRef.current 
        ? fullTranscriptRef.current + " " + interimTranscript 
        : interimTranscript;
      
      const cleanTranscript = displayTranscript.trim();
      const confidencePercent = Math.round((maxConfidence || 0.8) * 100);
      const accuracyPercent = calculateAccuracy(cleanTranscript, targetText);

      setResult(prev => ({
        ...prev,
        transcript: cleanTranscript,
        confidence: confidencePercent,
        accuracy: accuracyPercent,
      }));
    };

    recognition.onerror = (event: any) => {
      // Ignore "aborted" and "no-speech" errors as they're expected
      if (event.error === "aborted" || event.error === "no-speech") {
        return;
      }
      console.error("Speech recognition error:", event.error);
      setResult(prev => ({ 
        ...prev, 
        error: event.error,
        isListening: false 
      }));
    };

    recognition.onend = () => {
      // Auto-restart if not intentionally stopped and still should be listening
      if (!isStoppingRef.current && recognitionRef.current) {
        try {
          recognition.start();
        } catch (e) {
          // Can't restart, that's fine
          setResult(prev => ({ ...prev, isListening: false }));
        }
      } else {
        setResult(prev => ({ ...prev, isListening: false }));
      }
    };

    try {
      recognition.start();
    } catch (e) {
      console.error("Failed to start speech recognition:", e);
      setResult(prev => ({ ...prev, error: "Failed to start", isListening: false }));
    }
  }, [isSupported, language, targetText]);

  const reset = useCallback(() => {
    fullTranscriptRef.current = "";
    setResult({
      transcript: "",
      confidence: 0,
      accuracy: 0,
      isListening: false,
      error: null,
    });
  }, []);

  useEffect(() => {
    return () => {
      isStoppingRef.current = true;
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // Ignore
        }
        recognitionRef.current = null;
      }
    };
  }, []);

  return {
    ...result,
    isSupported,
    startListening,
    stopListening,
    reset,
  };
};
