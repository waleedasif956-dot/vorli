import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Mic, Volume2, Type, ChevronLeft, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import BottomNavigation from "@/components/BottomNavigation";
import AudioWaveform from "@/components/AudioWaveform";

const tutorPhrases = [
  { phrase: "Good morning, how are you today?", phonetic: "good MOR-ning, how ar yoo tuh-DAY" },
  { phrase: "Could I have an oat milk latte?", phonetic: "kood ai hav an oht milk LAH-tay" },
  { phrase: "Where is the train station?", phonetic: "wehr iz thuh trayn STAY-shun" },
];

const Tutor = () => {
  const navigate = useNavigate();
  const [isRecording, setIsRecording] = useState(false);
  const [showPhonetics, setShowPhonetics] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<"normal" | "slow">("normal");
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score] = useState(Math.floor(Math.random() * 15) + 82);

  const currentPhrase = tutorPhrases[currentPhraseIndex];

  const handleRecordStart = useCallback(() => {
    setIsRecording(true);
    setShowFeedback(false);
  }, []);

  const handleRecordEnd = useCallback(() => {
    if (isRecording) {
      setIsRecording(false);
      setTimeout(() => setShowFeedback(true), 300);
    }
  }, [isRecording]);

  const handleNextPhrase = () => {
    setCurrentPhraseIndex((prev) => (prev + 1) % tutorPhrases.length);
    setShowFeedback(false);
    setShowPhonetics(false);
  };

  return (
    <div className="min-h-screen bg-background pb-28">
      <div className="max-w-md mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between pt-8 pb-4 animate-fade-in">
          <button onClick={() => navigate(-1)} className="text-primary">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-semibold text-foreground">AI tutor</h1>
          <button className="text-primary">
            <Settings className="w-5 h-5" />
          </button>
        </div>

        {/* Tutor Video Area */}
        <div className="relative rounded-3xl overflow-hidden mb-4 animate-scale-in aspect-[3/4]">
          {/* Tutor image/video placeholder */}
          <div 
            className="absolute inset-0"
            style={{
              background: "linear-gradient(180deg, hsl(30 20% 92%) 0%, hsl(30 15% 88%) 100%)"
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-9xl">👩‍🏫</span>
            </div>
          </div>

          {/* AI Voice Live badge */}
          <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-muted/90 backdrop-blur-sm border border-border/50 flex items-center gap-2">
            <Volume2 className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-medium text-foreground">AI voice · Live</span>
          </div>

          {/* Mouth overlay indicator */}
          <div className="absolute bottom-1/3 left-1/2 -translate-x-1/2 w-24 h-20 rounded-full border-2 border-primary/40" />

          {/* Waveform at bottom of video */}
          <div className="absolute bottom-4 left-4 right-4">
            <AudioWaveform isActive={!isRecording} barCount={20} className="opacity-60" />
          </div>
        </div>

        {/* Instruction Pill */}
        <div className="flex justify-center mb-3 animate-fade-in">
          <div className="px-4 py-2 rounded-full bg-primary text-white text-sm font-medium">
            Watch my mouth and repeat after me.
          </div>
        </div>

        {/* Current Phrase */}
        <div className="text-center mb-4 animate-fade-in">
          <h2 className="text-2xl font-semibold text-foreground mb-2">
            {currentPhrase.phrase}
          </h2>
          {showPhonetics && (
            <p className="text-sm text-muted-foreground font-mono animate-fade-in">
              {currentPhrase.phonetic}
            </p>
          )}
        </div>

        {/* Control Buttons */}
        <div className="flex gap-3 justify-center mb-6 animate-slide-up">
          <Button
            variant="outline"
            onClick={() => setPlaybackSpeed(playbackSpeed === "normal" ? "slow" : "normal")}
            className={`h-11 px-5 rounded-full border-border ${playbackSpeed === "slow" ? "bg-primary/20 border-primary/50" : ""}`}
          >
            {playbackSpeed === "slow" ? "Slow mode" : "Slow down"}
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowPhonetics(!showPhonetics)}
            className={`h-11 px-5 rounded-full border-border ${showPhonetics ? "bg-primary/20 border-primary/50" : ""}`}
          >
            {showPhonetics ? "Hide phonetics" : "Show phonetics"}
          </Button>
        </div>

        {/* Mic Button */}
        <div className="flex flex-col items-center mb-4 animate-fade-in">
          <button
            onMouseDown={handleRecordStart}
            onMouseUp={handleRecordEnd}
            onMouseLeave={handleRecordEnd}
            onTouchStart={handleRecordStart}
            onTouchEnd={handleRecordEnd}
            className={`mic-button w-20 h-20 ${isRecording ? "animate-pulse-glow scale-110" : ""}`}
          >
            <Mic className="w-8 h-8 text-background transition-transform duration-200" />
            {isRecording && (
              <div className="absolute inset-0 rounded-full border-4 border-primary/30 animate-ping" />
            )}
          </button>
        </div>

        {/* Recording Waveform */}
        {isRecording && (
          <div className="animate-fade-in mb-4">
            <AudioWaveform isActive={isRecording} barCount={30} />
          </div>
        )}

        {/* Feedback */}
        {showFeedback && (
          <div className="glass-card rounded-2xl p-4 flex items-center justify-between animate-scale-in">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br from-primary to-accent">
                <span className="text-lg font-bold text-background">{score}%</span>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Great pronunciation!</p>
                <p className="text-xs text-muted-foreground">Keep practicing</p>
              </div>
            </div>
            <Button
              onClick={handleNextPhrase}
              size="sm"
              className="rounded-xl bg-primary hover:bg-primary/90"
            >
              Next
            </Button>
          </div>
        )}
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Tutor;
