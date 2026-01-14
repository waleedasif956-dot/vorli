import { useEffect, useState } from "react";

interface RecordingTimerProps {
  isRecording: boolean;
  onTimeUpdate?: (seconds: number) => void;
}

const RecordingTimer = ({ isRecording, onTimeUpdate }: RecordingTimerProps) => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!isRecording) {
      setSeconds(0);
      return;
    }

    const interval = setInterval(() => {
      setSeconds(prev => {
        const newValue = prev + 1;
        onTimeUpdate?.(newValue);
        return newValue;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRecording, onTimeUpdate]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center gap-2">
      <div className={`w-2 h-2 rounded-full ${isRecording ? 'bg-destructive animate-pulse' : 'bg-muted-foreground'}`} />
      <span className="text-foreground font-mono text-lg">{formatTime(seconds)}</span>
    </div>
  );
};

export default RecordingTimer;
