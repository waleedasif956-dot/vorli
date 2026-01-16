import { useEffect, useState } from "react";

interface AudioWaveformProps {
  isActive: boolean;
  barCount?: number;
  className?: string;
  /** Real audio levels from microphone (0-100 for each bar) */
  audioLevels?: number[];
}

const AudioWaveform = ({ 
  isActive, 
  barCount = 5, 
  className = "",
  audioLevels 
}: AudioWaveformProps) => {
  const [heights, setHeights] = useState<number[]>(Array(barCount).fill(20));

  useEffect(() => {
    // If real audio levels are provided, use them
    if (audioLevels && audioLevels.length > 0) {
      setHeights(audioLevels);
      return;
    }

    // Fallback: static bars when not active
    if (!isActive) {
      setHeights(Array(barCount).fill(20));
    }
  }, [isActive, barCount, audioLevels]);

  // Determine if we have real audio input
  const hasRealAudio = audioLevels && audioLevels.length > 0;
  const showActive = isActive && (hasRealAudio || audioLevels === undefined);

  return (
    <div className={`flex items-center justify-center gap-1 h-16 ${className}`}>
      {heights.map((height, i) => (
        <div
          key={i}
          className="w-1 rounded-full transition-all duration-75"
          style={{
            height: `${height}%`,
            background: "var(--gradient-primary)",
            opacity: showActive ? 1 : 0.3,
          }}
        />
      ))}
    </div>
  );
};

export default AudioWaveform;
