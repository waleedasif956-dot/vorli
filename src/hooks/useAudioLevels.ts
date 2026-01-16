import { useState, useEffect, useRef, useCallback } from "react";

interface UseAudioLevelsOptions {
  barCount?: number;
  sensitivity?: number;
}

export const useAudioLevels = (options: UseAudioLevelsOptions = {}) => {
  const { barCount = 5, sensitivity = 1.5 } = options;
  
  const [levels, setLevels] = useState<number[]>(Array(barCount).fill(20));
  const [isActive, setIsActive] = useState(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationRef = useRef<number | null>(null);

  const startListening = useCallback(async () => {
    try {
      // Get microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Create audio context and analyser
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioContext;

      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 64;
      analyser.smoothingTimeConstant = 0.5;
      analyserRef.current = analyser;

      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);

      setIsActive(true);

      // Animation loop to read audio levels
      const updateLevels = () => {
        if (!analyserRef.current) return;

        const bufferLength = analyserRef.current.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyserRef.current.getByteFrequencyData(dataArray);

        // Calculate levels for each bar based on frequency ranges
        const newLevels: number[] = [];
        const segmentSize = Math.floor(bufferLength / barCount);

        for (let i = 0; i < barCount; i++) {
          let sum = 0;
          const start = i * segmentSize;
          const end = start + segmentSize;
          
          for (let j = start; j < end && j < bufferLength; j++) {
            sum += dataArray[j];
          }
          
          const avg = sum / segmentSize;
          // Map 0-255 to 20-100 with sensitivity adjustment
          const normalized = Math.min(100, Math.max(20, (avg / 255) * 80 * sensitivity + 20));
          newLevels.push(normalized);
        }

        setLevels(newLevels);
        animationRef.current = requestAnimationFrame(updateLevels);
      };

      updateLevels();
    } catch (err) {
      console.error("Failed to access microphone for audio levels:", err);
      setIsActive(false);
    }
  }, [barCount, sensitivity]);

  const stopListening = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    analyserRef.current = null;
    
    setIsActive(false);
    setLevels(Array(barCount).fill(20));
  }, [barCount]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopListening();
    };
  }, [stopListening]);

  return {
    levels,
    isActive,
    startListening,
    stopListening,
  };
};
