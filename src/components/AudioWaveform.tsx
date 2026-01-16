import { useEffect, useState, useRef } from "react";

interface AudioWaveformProps {
  isActive: boolean;
  barCount?: number;
  className?: string;
  /** Real audio levels from microphone (0-100 for each bar) */
  audioLevels?: number[];
  /** Whether voice is currently being detected (for simulated mode) */
  voiceDetected?: boolean;
}

const AudioWaveform = ({ 
  isActive, 
  barCount = 5, 
  className = "",
  audioLevels,
  voiceDetected = false
}: AudioWaveformProps) => {
  const [heights, setHeights] = useState<number[]>(Array(barCount).fill(4));
  const targetHeightsRef = useRef<number[]>(Array(barCount).fill(4));
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    // If real audio levels are provided, use them
    if (audioLevels && audioLevels.length > 0 && isActive) {
      setHeights(audioLevels);
      return;
    }

    // If we're active AND voice is detected (for simulated mode on Android),
    // show animated waveform - just like web behavior with smooth interpolation
    if (isActive && voiceDetected) {
      // Generate new target heights every 150ms (slower than before)
      const generateTargets = () => {
        targetHeightsRef.current = Array.from({ length: barCount }, () => {
          // 10% baseline, up to ~85%
          return 10 + Math.random() * 75;
        });
      };

      generateTargets();
      const targetInterval = window.setInterval(generateTargets, 150);

      // Smooth interpolation loop at 60fps
      const smoothUpdate = () => {
        setHeights(prev => {
          const targets = targetHeightsRef.current;
          return prev.map((h, i) => {
            const target = targets[i] ?? 4;
            // Lerp towards target with easing factor (0.15 = smooth, 0.3 = snappier)
            const easing = 0.18;
            return h + (target - h) * easing;
          });
        });
        animationRef.current = requestAnimationFrame(smoothUpdate);
      };

      animationRef.current = requestAnimationFrame(smoothUpdate);

      return () => {
        window.clearInterval(targetInterval);
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }

    // Flat bars when not active or no voice detected - smooth transition down
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    targetHeightsRef.current = Array(barCount).fill(4);
    
    // Smooth fade to flat
    const fadeDown = () => {
      setHeights(prev => {
        const allFlat = prev.every(h => h <= 5);
        if (allFlat) {
          return Array(barCount).fill(4);
        }
        return prev.map(h => h + (4 - h) * 0.2);
      });
      
      animationRef.current = requestAnimationFrame(fadeDown);
    };
    
    animationRef.current = requestAnimationFrame(fadeDown);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive, barCount, audioLevels, voiceDetected]);

  return (
    <div className={`flex items-center justify-center gap-1 h-16 ${className}`}>
      {heights.map((height, i) => (
        <div
          key={i}
          className="w-1 rounded-full"
          style={{
            height: `${Math.max(4, height)}%`,
            background: isActive && height > 10 ? "var(--gradient-primary)" : "hsl(var(--muted-foreground) / 0.3)",
            transition: "background 0.15s ease",
          }}
        />
      ))}
    </div>
  );
};

export default AudioWaveform;
