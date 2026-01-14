import { useEffect, useState } from "react";

interface AudioWaveformProps {
  isActive: boolean;
  barCount?: number;
  className?: string;
}

const AudioWaveform = ({ isActive, barCount = 5, className = "" }: AudioWaveformProps) => {
  const [heights, setHeights] = useState<number[]>(Array(barCount).fill(20));

  useEffect(() => {
    if (!isActive) {
      setHeights(Array(barCount).fill(20));
      return;
    }

    const interval = setInterval(() => {
      setHeights(prev => 
        prev.map(() => Math.random() * 60 + 20)
      );
    }, 100);

    return () => clearInterval(interval);
  }, [isActive, barCount]);

  return (
    <div className={`flex items-center justify-center gap-1 h-16 ${className}`}>
      {heights.map((height, i) => (
        <div
          key={i}
          className="w-1 rounded-full transition-all duration-100"
          style={{
            height: `${height}%`,
            background: "var(--gradient-primary)",
            opacity: isActive ? 1 : 0.3,
          }}
        />
      ))}
    </div>
  );
};

export default AudioWaveform;
