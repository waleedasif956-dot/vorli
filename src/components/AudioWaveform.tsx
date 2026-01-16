import { useEffect, useState } from "react";

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

  useEffect(() => {
    // If real audio levels are provided, use them
    if (audioLevels && audioLevels.length > 0 && isActive) {
      setHeights(audioLevels);
      return;
    }

    // If we're active AND voice is detected (for simulated mode on Android),
    // show animated waveform - just like web behavior
    if (isActive && voiceDetected) {
      const tick = () => {
        setHeights(
          Array.from({ length: barCount }, () => {
            // 4% baseline, up to ~80%
            return 4 + Math.random() * 76;
          })
        );
      };

      tick();
      const id = window.setInterval(tick, 80);
      return () => window.clearInterval(id);
    }

    // Flat bars when not active or no voice detected
    setHeights(Array(barCount).fill(4));
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
            transition: "height 0.05s ease-out, background 0.15s ease",
          }}
        />
      ))}
    </div>
  );
};

export default AudioWaveform;
