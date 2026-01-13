import { Mic } from "lucide-react";
import { useState } from "react";

interface MicButtonProps {
  onComplete?: () => void;
  size?: "default" | "large";
}

const MicButton = ({ onComplete, size = "default" }: MicButtonProps) => {
  const [isListening, setIsListening] = useState(false);

  const handleClick = () => {
    setIsListening(true);
    setTimeout(() => {
      setIsListening(false);
      onComplete?.();
    }, 2000);
  };

  const sizeClasses = size === "large" ? "w-24 h-24" : "w-20 h-20";
  const iconSize = size === "large" ? "w-10 h-10" : "w-8 h-8";

  return (
    <button
      onClick={handleClick}
      className={`mic-button ${sizeClasses} ${isListening ? "animate-pulse-glow scale-110" : ""}`}
    >
      <Mic className={`${iconSize} text-background transition-transform duration-200`} />
      {isListening && (
        <div className="absolute inset-0 rounded-full border-4 border-primary/30 animate-ping" />
      )}
    </button>
  );
};

export default MicButton;
