import { useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Lightbulb, SkipForward, RotateCcw, ChevronRight, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import AudioWaveform from "@/components/AudioWaveform";
import RecordingTimer from "@/components/RecordingTimer";

const prompts: Record<string, { text: string; hint: string }[]> = {
  "1": [
    { text: "Ask if they have oat milk.", hint: "Do you have oat milk?" },
    { text: "Order a latte with oat milk.", hint: "Can I get a latte with oat milk, please?" },
    { text: "Ask how much it costs.", hint: "How much is that?" },
  ],
  "2": [
    { text: "Say what you did last weekend.", hint: "Last weekend, I went hiking with my friends." },
    { text: "Ask about their weekend plans.", hint: "Do you have any plans for the weekend?" },
    { text: "Talk about your favorite weekend activity.", hint: "I love spending time outdoors on weekends." },
  ],
  "3": [
    { text: "Describe what you see in the photo.", hint: "I see a beautiful sunset over the ocean." },
    { text: "Talk about the colors in the image.", hint: "The sky has shades of orange and pink." },
    { text: "Say how the photo makes you feel.", hint: "This photo makes me feel peaceful." },
  ],
};

const MissionPrompt = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [score] = useState(Math.floor(Math.random() * 15) + 85);

  const missionPrompts = prompts[id || "1"] || prompts["1"];
  const currentPrompt = missionPrompts[currentPromptIndex];
  const totalPrompts = missionPrompts.length;

  const handleRecordStart = useCallback(() => {
    setIsRecording(true);
    setShowHint(false);
  }, []);

  const handleRecordEnd = useCallback(() => {
    if (isRecording) {
      setIsRecording(false);
      setTimeout(() => setShowResults(true), 300);
    }
  }, [isRecording]);

  const handleNext = () => {
    if (currentPromptIndex < totalPrompts - 1) {
      setCurrentPromptIndex(prev => prev + 1);
      setShowResults(false);
      setShowHint(false);
    } else {
      navigate("/");
    }
  };

  const handleTryAgain = () => {
    setShowResults(false);
    setShowHint(false);
  };

  const handleSkip = () => {
    if (currentPromptIndex < totalPrompts - 1) {
      setCurrentPromptIndex(prev => prev + 1);
      setShowHint(false);
    } else {
      navigate("/");
    }
  };

  if (showResults) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <div className="max-w-md mx-auto px-4 pt-6 flex-1 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="text-sm text-muted-foreground">
              Mission {currentPromptIndex + 1}/{totalPrompts}
            </div>
            <div className="w-5" />
          </div>

          {/* Results Card */}
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="glass-card w-full p-8 rounded-3xl mb-8 animate-scale-in">
              {/* Score Circle */}
              <div className="flex flex-col items-center mb-8">
                <div className="relative w-32 h-32 mb-4">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="hsl(var(--muted))"
                      strokeWidth="8"
                      fill="none"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="url(#scoreGradient)"
                      strokeWidth="8"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={`${score * 3.52} 352`}
                      className="transition-all duration-1000 ease-out"
                    />
                    <defs>
                      <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="hsl(191 91% 43%)" />
                        <stop offset="50%" stopColor="hsl(217 91% 60%)" />
                        <stop offset="100%" stopColor="hsl(263 70% 58%)" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold gradient-text">{score}%</span>
                  </div>
                </div>
                <h2 className="text-xl font-semibold text-foreground mb-1">
                  {score >= 90 ? "Excellent!" : score >= 75 ? "Great job!" : "Good effort!"}
                </h2>
                <p className="text-muted-foreground text-sm">Confidence Score</p>
              </div>

              {/* Feedback Items */}
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                  <span className="text-sm text-muted-foreground">Pronunciation</span>
                  <span className="text-sm font-medium text-foreground">{Math.max(score - 5, 70)}%</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                  <span className="text-sm text-muted-foreground">Fluency</span>
                  <span className="text-sm font-medium text-foreground">{Math.min(score + 3, 100)}%</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                  <span className="text-sm text-muted-foreground">Accuracy</span>
                  <span className="text-sm font-medium text-foreground">{score}%</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="w-full space-y-3 animate-fade-in" style={{ animationDelay: "300ms" }}>
              <Button
                onClick={handleNext}
                className="w-full h-14 text-lg font-semibold rounded-2xl glow-effect"
                style={{ background: "var(--gradient-primary)" }}
              >
                {currentPromptIndex < totalPrompts - 1 ? (
                  <>Next Mission <ChevronRight className="w-5 h-5 ml-2" /></>
                ) : (
                  "Complete Mission"
                )}
              </Button>
              <Button
                onClick={handleTryAgain}
                variant="outline"
                className="w-full h-12 rounded-2xl border-border"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="max-w-md mx-auto px-4 pt-6 flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 animate-fade-in">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="text-sm text-muted-foreground">
            Mission {currentPromptIndex + 1}/{totalPrompts}
          </div>
          <button
            onClick={handleSkip}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <SkipForward className="w-5 h-5" />
          </button>
        </div>

        {/* Prompt Area */}
        <div className="flex-1 flex flex-col items-center justify-center px-4">
          <div className="text-center mb-8 animate-fade-in">
            <p className="text-sm text-primary font-medium mb-4">Say it in English</p>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground leading-relaxed">
              "{currentPrompt.text}"
            </h1>
          </div>

          {/* Hint */}
          {showHint && (
            <div className="glass-card p-4 rounded-2xl mb-8 animate-scale-in w-full">
              <div className="flex items-start gap-3">
                <Lightbulb className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Hint</p>
                  <p className="text-foreground">{currentPrompt.hint}</p>
                </div>
              </div>
            </div>
          )}

          {/* Recording State */}
          {isRecording && (
            <div className="mb-8 animate-fade-in">
              <RecordingTimer isRecording={isRecording} />
              <AudioWaveform isActive={isRecording} barCount={7} className="mt-4" />
            </div>
          )}
        </div>

        {/* Bottom Controls */}
        <div className="pb-12 animate-slide-up">
          {!showHint && !isRecording && (
            <button
              onClick={() => setShowHint(true)}
              className="mx-auto flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
            >
              <Lightbulb className="w-4 h-4" />
              <span className="text-sm">Show Hint</span>
            </button>
          )}

          {/* Mic Button */}
          <div className="flex flex-col items-center">
            <button
              onMouseDown={handleRecordStart}
              onMouseUp={handleRecordEnd}
              onMouseLeave={handleRecordEnd}
              onTouchStart={handleRecordStart}
              onTouchEnd={handleRecordEnd}
              className={`mic-button w-24 h-24 ${isRecording ? "animate-pulse-glow scale-110" : ""}`}
            >
              <Mic className="w-10 h-10 text-background transition-transform duration-200" />
              {isRecording && (
                <div className="absolute inset-0 rounded-full border-4 border-primary/30 animate-ping" />
              )}
            </button>
            <p className="text-muted-foreground text-sm mt-4">
              {isRecording ? "Release to finish" : "Hold to speak"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MissionPrompt;
