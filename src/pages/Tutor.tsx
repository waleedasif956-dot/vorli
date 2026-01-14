import { useState, useCallback } from "react";
import { Mic, Volume2, Type, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import BottomNavigation from "@/components/BottomNavigation";
import AudioWaveform from "@/components/AudioWaveform";

const tutorPhrases = [
  { phrase: "Bonjour, comment allez-vous?", translation: "Hello, how are you?", phonetic: "bohn-ZHOOR, koh-MAHN tah-lay VOO" },
  { phrase: "Je voudrais un café, s'il vous plaît.", translation: "I would like a coffee, please.", phonetic: "zhuh voo-DRAY uhn kah-FAY, seel voo PLAY" },
  { phrase: "Où est la gare?", translation: "Where is the train station?", phonetic: "oo ay lah GAHR" },
];

const Tutor = () => {
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

  const handlePrevPhrase = () => {
    setCurrentPhraseIndex((prev) => (prev - 1 + tutorPhrases.length) % tutorPhrases.length);
    setShowFeedback(false);
    setShowPhonetics(false);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-md mx-auto px-4 pt-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 animate-fade-in">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="text-primary font-medium text-sm">AI Tutor</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground">Practice with AI</h1>
          </div>
          <div className="px-3 py-1.5 rounded-full bg-primary/20 border border-primary/30">
            <span className="text-xs font-medium text-primary flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              AI voice · Live
            </span>
          </div>
        </div>

        {/* Tutor Avatar */}
        <div className="glass-card rounded-3xl p-6 mb-6 animate-scale-in">
          <div className="flex flex-col items-center">
            {/* Avatar Placeholder */}
            <div className="relative w-32 h-32 rounded-full overflow-hidden mb-4 border-4 border-primary/30">
              <div 
                className="w-full h-full flex items-center justify-center"
                style={{ background: "var(--gradient-primary)" }}
              >
                <span className="text-5xl">👩‍🏫</span>
              </div>
              {/* Speaking indicator */}
              {!isRecording && (
                <div className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center border-2 border-background">
                  <Volume2 className="w-4 h-4 text-background" />
                </div>
              )}
            </div>
            
            <p className="text-sm text-muted-foreground text-center mb-4">
              Watch my mouth and repeat after me.
            </p>

            {/* Current Phrase */}
            <div className="text-center w-full">
              <div className="flex items-center justify-center gap-4 mb-4">
                <button
                  onClick={handlePrevPhrase}
                  className="p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-muted-foreground" />
                </button>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-foreground mb-1">
                    "{currentPhrase.phrase}"
                  </h2>
                  <p className="text-muted-foreground text-sm">{currentPhrase.translation}</p>
                </div>
                <button
                  onClick={handleNextPhrase}
                  className="p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              {/* Phonetics */}
              {showPhonetics && (
                <div className="p-3 rounded-xl bg-muted/50 animate-fade-in">
                  <p className="text-sm font-mono text-primary">{currentPhrase.phonetic}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Waveform / Recording State */}
        <div className="h-20 mb-6">
          {isRecording ? (
            <div className="glass-card rounded-2xl p-4 h-full flex items-center justify-center animate-scale-in">
              <AudioWaveform isActive={isRecording} barCount={9} />
            </div>
          ) : showFeedback ? (
            <div className="glass-card rounded-2xl p-4 h-full flex items-center justify-between animate-scale-in">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: "var(--gradient-primary)" }}>
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
                className="rounded-xl"
                style={{ background: "var(--gradient-primary)" }}
              >
                Next
              </Button>
            </div>
          ) : (
            <div className="glass-card rounded-2xl p-4 h-full flex items-center justify-center">
              <p className="text-muted-foreground text-sm">Hold to record your voice</p>
            </div>
          )}
        </div>

        {/* Control Buttons */}
        <div className="flex gap-3 mb-8 animate-slide-up">
          <Button
            variant="outline"
            onClick={() => setPlaybackSpeed(playbackSpeed === "normal" ? "slow" : "normal")}
            className={`flex-1 h-12 rounded-xl border-border ${playbackSpeed === "slow" ? "bg-primary/20 border-primary/50" : ""}`}
          >
            <Volume2 className="w-4 h-4 mr-2" />
            {playbackSpeed === "slow" ? "Slow mode" : "Slow down"}
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowPhonetics(!showPhonetics)}
            className={`flex-1 h-12 rounded-xl border-border ${showPhonetics ? "bg-primary/20 border-primary/50" : ""}`}
          >
            <Type className="w-4 h-4 mr-2" />
            {showPhonetics ? "Hide phonetics" : "Show phonetics"}
          </Button>
        </div>

        {/* Mic Button */}
        <div className="flex flex-col items-center animate-fade-in" style={{ animationDelay: "200ms" }}>
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
          <p className="text-muted-foreground text-sm mt-3">
            {isRecording ? "Release to finish" : "Hold to speak"}
          </p>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Tutor;
