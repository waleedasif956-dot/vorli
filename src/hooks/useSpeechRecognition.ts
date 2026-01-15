import { useState, useRef, useCallback, useEffect } from "react";
import { calculateAccuracy } from "@/lib/speechAccuracy";

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
  // Track processed result indices to avoid duplicates on Android
  const processedResultsRef = useRef<Set<number>>(new Set());
  const finalPartsRef = useRef<string[]>([]);
  
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
    processedResultsRef.current = new Set();
    finalPartsRef.current = [];

    const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognitionAPI();
    recognitionRef.current = recognition;
    
    // On Android, continuous mode causes severe duplication issues
    // Use non-continuous mode and restart manually for better results
    const isAndroid = /android/i.test(navigator.userAgent);
    recognition.continuous = !isAndroid;
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

      let currentInterim = "";
      let maxConfidence = 0;

      // Process all results but track which final results we've already captured
      for (let i = 0; i < event.results.length; i++) {
        const res = event.results[i];
        const alt = res?.[0];
        if (!alt) continue;

        const text = (alt.transcript || "").trim();
        const conf = typeof alt.confidence === "number" ? alt.confidence : 0.8;

        if (res.isFinal) {
          // Only add this final result if we haven't processed this index before
          if (!processedResultsRef.current.has(i) && text) {
            processedResultsRef.current.add(i);
            finalPartsRef.current.push(text);
            maxConfidence = Math.max(maxConfidence, conf);
          }
        } else {
          // For interim results, only take the latest one (last non-final result)
          currentInterim = text;
          maxConfidence = Math.max(maxConfidence, conf);
        }
      }

      // Build the complete transcript from unique final parts + current interim
      const allParts = [...finalPartsRef.current];
      if (currentInterim) {
        allParts.push(currentInterim);
      }
      
      const cleanTranscript = allParts.join(" ").trim();
      const confidencePercent = Math.round((maxConfidence || 0.8) * 100);
      const accuracyPercent = calculateAccuracy(cleanTranscript, targetText);

      setResult((prev) => ({
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
    processedResultsRef.current = new Set();
    finalPartsRef.current = [];
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
