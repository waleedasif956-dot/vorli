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

      let interimTranscript = "";
      let maxConfidence = 0;

      /**
       * IMPORTANT: On mobile (and in some desktop browsers), `event.results` contains the
       * full history on every callback. Iterating from 0 causes repeated words.
       * Use `event.resultIndex` to process only the new results.
       */
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const res = event.results[i];
        const alt = res?.[0];
        if (!alt) continue;

        const nextText = (alt.transcript || "").trim();
        const nextConfidence = typeof alt.confidence === "number" ? alt.confidence : undefined;

        if (res.isFinal) {
          if (nextText) {
            // Accumulate ONLY new final chunks
            fullTranscriptRef.current = (fullTranscriptRef.current + " " + nextText).trim();
          }
          if (nextConfidence !== undefined) maxConfidence = Math.max(maxConfidence, nextConfidence);
        } else {
          interimTranscript += nextText ? nextText + " " : "";
          maxConfidence = Math.max(maxConfidence, nextConfidence ?? 0.8);
        }
      }

      const cleanTranscript = [fullTranscriptRef.current, interimTranscript.trim()]
        .filter(Boolean)
        .join(" ")
        .trim();

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
