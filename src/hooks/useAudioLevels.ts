import { useState, useEffect, useRef, useCallback } from "react";

interface UseAudioLevelsOptions {
  barCount?: number;
  sensitivity?: number;
}

export const useAudioLevels = (options: UseAudioLevelsOptions = {}) => {
  const { barCount = 5, sensitivity = 2.5 } = options;
  
  // Store barCount in a ref to avoid issues with changing values
  const barCountRef = useRef(barCount);
  const sensitivityRef = useRef(sensitivity);
  
  // Update refs when props change
  useEffect(() => {
    barCountRef.current = barCount;
    sensitivityRef.current = sensitivity;
  }, [barCount, sensitivity]);
  
  const [levels, setLevels] = useState<number[]>(() => Array(barCount).fill(4));
  const [isActive, setIsActive] = useState(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationRef = useRef<number | null>(null);
  
  // Smoothing refs for interpolation
  const smoothedLevelsRef = useRef<number[]>(Array(barCount).fill(4));

  const startListening = useCallback(async () => {
    try {
      const currentBarCount = barCountRef.current;
      const currentSensitivity = sensitivityRef.current;
      
      // Get microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Create audio context and analyser
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioContext;

      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 128;
      analyser.smoothingTimeConstant = 0.4;
      analyserRef.current = analyser;

      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);

      setIsActive(true);
      smoothedLevelsRef.current = Array(currentBarCount).fill(4);

      // Animation loop to read audio levels
      const updateLevels = () => {
        if (!analyserRef.current) return;

        const bc = barCountRef.current;
        const sens = sensitivityRef.current;
        
        const bufferLength = analyserRef.current.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyserRef.current.getByteFrequencyData(dataArray);

        // Calculate levels for each bar based on frequency ranges
        const newLevels: number[] = [];
        const segmentSize = Math.floor(bufferLength / bc);

        for (let i = 0; i < bc; i++) {
          let sum = 0;
          const start = i * segmentSize;
          const end = start + segmentSize;
          
          for (let j = start; j < end && j < bufferLength; j++) {
            sum += dataArray[j];
          }
          
          const avg = sum / segmentSize;
          
          // Only show activity above a threshold (noise gate)
          const threshold = 15;
          let normalized: number;
          
          if (avg < threshold) {
            normalized = 4; // Flat when below threshold
          } else {
            // Map threshold-255 to 10-95 with sensitivity
            normalized = Math.min(95, ((avg - threshold) / (255 - threshold)) * 85 * sens + 10);
          }
          
          // Ensure smoothedLevelsRef has correct length
          if (smoothedLevelsRef.current.length !== bc) {
            smoothedLevelsRef.current = Array(bc).fill(4);
          }
          
          // Smooth interpolation for fluid animation
          const smoothing = 0.3;
          const prevValue = smoothedLevelsRef.current[i] ?? 4;
          const smoothed = prevValue + (normalized - prevValue) * smoothing;
          smoothedLevelsRef.current[i] = smoothed;
          
          newLevels.push(Math.round(smoothed));
        }

        setLevels(newLevels);
        animationRef.current = requestAnimationFrame(updateLevels);
      };

      updateLevels();
    } catch (err) {
      console.error("Failed to access microphone for audio levels:", err);
      setIsActive(false);
    }
  }, []);

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
    
    const bc = barCountRef.current;
    smoothedLevelsRef.current = Array(bc).fill(4);
    
    setIsActive(false);
    setLevels(Array(bc).fill(4));
  }, []);

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
