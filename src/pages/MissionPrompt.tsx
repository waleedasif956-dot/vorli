import { useState, useCallback, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Lightbulb, RotateCcw, ChevronRight, Mic, Plane, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import AudioWaveform from "@/components/AudioWaveform";
import RecordingTimer from "@/components/RecordingTimer";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import AppHeader from "@/components/AppHeader";
import { useAudioLevels } from "@/hooks/useAudioLevels";

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
  const [finalScore, setFinalScore] = useState({ accuracy: 0, confidence: 0, transcript: "" });

  const missionPrompts = prompts[id || "1"] || prompts["1"];
  const currentPrompt = missionPrompts[currentPromptIndex];
  const totalPrompts = missionPrompts.length;

  const { 
    transcript, 
    confidence, 
    accuracy, 
    isListening,
    startListening, 
    stopListening,
    reset: resetSpeech,
    isSupported 
  } = useSpeechRecognition({ 
    targetText: currentPrompt.hint,
    language: "en-US" 
  });

  // Real audio levels for waveform visualization
  const { 
    levels: audioLevels, 
    startListening: startAudioLevels, 
    stopListening: stopAudioLevels 
  } = useAudioLevels({ barCount: 7, sensitivity: 2 });

  // Use refs to always get the latest values when recording ends
  const latestDataRef = useRef({ transcript, accuracy, confidence });
  useEffect(() => {
    latestDataRef.current = { transcript, accuracy, confidence };
  }, [transcript, accuracy, confidence]);

  const isRecordingRef = useRef(isRecording);
  useEffect(() => {
    isRecordingRef.current = isRecording;
  }, [isRecording]);

  // If the user reaches a strong match while still holding the mic,
  // auto-finish so the results screen appears immediately.
  const autoEndedRef = useRef(false);

  const handleRecordEnd = useCallback(() => {
    if (!isRecordingRef.current) return;

    // Freeze the best-known values at the moment we decide to end.
    // This prevents later state updates (or late events) from overwriting
    // the score with empty/zero.
    const snapshotAtEnd = { ...latestDataRef.current };

    setIsRecording(false);
    stopListening();
    stopAudioLevels();

    // Small delay to allow final speech events to flush.
    setTimeout(() => {
      const latest = latestDataRef.current;

      // Prefer whichever transcript is longer (often the “final” one).
      const bestTranscript =
        (latest.transcript || "").trim().length >= (snapshotAtEnd.transcript || "").trim().length
          ? latest.transcript
          : snapshotAtEnd.transcript;

      const bestAccuracy =
        bestTranscript === latest.transcript ? latest.accuracy : snapshotAtEnd.accuracy;
      const bestConfidence =
        bestTranscript === latest.transcript ? latest.confidence : snapshotAtEnd.confidence;

      const hasRealData = bestTranscript && bestTranscript.trim().length > 0;
      setFinalScore({
        accuracy: hasRealData ? bestAccuracy : 0,
        confidence: hasRealData ? bestConfidence : 0,
        transcript: hasRealData
          ? bestTranscript
          : "No speech detected. Please try again and speak clearly.",
      });
      setShowResults(true);
    }, 400);
  }, [stopListening, stopAudioLevels]);

  useEffect(() => {
    if (!isRecording) return;
    if (autoEndedRef.current) return;
    if (!transcript) return;

    // Treat 90%+ as “completed correctly” for auto-finish.
    if (accuracy >= 90) {
      autoEndedRef.current = true;
      handleRecordEnd();
    }
  }, [isRecording, transcript, accuracy, handleRecordEnd]);

  const handleRecordStart = useCallback(() => {
    autoEndedRef.current = false;
    setIsRecording(true);
    setShowHint(false);
    resetSpeech();

    // Start real audio levels + speech recognition (Android included)
    startAudioLevels();
    setTimeout(() => {
      startListening();
    }, 100);
  }, [startListening, resetSpeech, startAudioLevels]);

  const handleNext = () => {
    if (currentPromptIndex < totalPrompts - 1) {
      setCurrentPromptIndex(prev => prev + 1);
      setShowResults(false);
      setShowHint(false);
      resetSpeech();
    } else {
      navigate("/");
    }
  };

  const handleTryAgain = () => {
    setShowResults(false);
    setShowHint(false);
    resetSpeech();
  };

  const handleSkip = () => {
    if (currentPromptIndex < totalPrompts - 1) {
      setCurrentPromptIndex(prev => prev + 1);
      setShowHint(false);
      resetSpeech();
    } else {
      navigate("/");
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopListening();
    };
  }, [stopListening]);

  const overallScore = Math.round((finalScore.accuracy + finalScore.confidence) / 2);

  if (showResults) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <div className="max-w-md mx-auto px-4 pt-8 flex-1 flex flex-col">
          {/* Header */}
          <AppHeader 
            title={`Mission ${currentPromptIndex + 1}/${totalPrompts}`}
            showBack 
            showAvatar={false}
            onBack={() => navigate(`/mission/${id}`)}
          />

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
                      strokeDasharray={`${overallScore * 3.52} 352`}
                      className="transition-all duration-1000 ease-out"
                    />
                    <defs>
                      <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#06b6d4" />
                        <stop offset="50%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#8b5cf6" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold gradient-text">{overallScore}%</span>
                  </div>
                </div>
                <h2 className="text-xl font-semibold text-foreground mb-1">
                  {overallScore >= 90 ? "Excellent!" : overallScore >= 75 ? "Great job!" : "Good effort!"}
                </h2>
                <p className="text-muted-foreground text-sm">Overall Score</p>
              </div>

              {/* What you said */}
              {finalScore.transcript && (
                <div className="mb-6 p-4 rounded-xl bg-muted/30 border border-border/50">
                  <p className="text-xs text-muted-foreground mb-1">What you said:</p>
                  <p className="text-foreground font-medium">"{finalScore.transcript}"</p>
                </div>
              )}

              {/* Feedback Items */}
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                  <span className="text-sm text-muted-foreground">Accuracy</span>
                  <span className="text-sm font-medium text-foreground">{finalScore.accuracy}%</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                  <span className="text-sm text-muted-foreground">Confidence</span>
                  <span className="text-sm font-medium text-foreground">{finalScore.confidence}%</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                  <span className="text-sm text-muted-foreground">Fluency</span>
                  <span className="text-sm font-medium text-foreground">{Math.min(overallScore + 5, 100)}%</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="w-full space-y-3 animate-fade-in" style={{ animationDelay: "300ms" }}>
              <Button
                onClick={handleNext}
                className="w-full h-14 text-lg font-semibold rounded-2xl glow-effect"
                style={{ background: "linear-gradient(90deg, #06b6d4 0%, #3b82f6 50%, #8b5cf6 100%)" }}
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
      <div className="max-w-md mx-auto px-4 pt-8 flex-1 flex flex-col">
        {/* Header */}
        <AppHeader 
          title={`Mission ${currentPromptIndex + 1}/${totalPrompts}`}
          showBack 
          showAvatar={false}
          onBack={() => navigate(`/mission/${id}`)}
        />

        {/* Category Pill */}
        <div className="flex justify-center mb-4 animate-fade-in">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-border/50 bg-muted/30 backdrop-blur-sm">
            <Plane className="w-4 h-4 text-primary" />
            <span className="text-sm text-foreground">Travel · Café · 30s</span>
            <Video className="w-4 h-4 text-muted-foreground" />
          </div>
        </div>

        {/* XP Badge */}
        <div className="flex justify-end mb-4 animate-fade-in">
          <div className="px-3 py-1 rounded-lg bg-muted/60 border border-border/50">
            <span className="text-sm font-medium text-foreground">+25 XP</span>
          </div>
        </div>

        {/* Prompt Card */}
        <div className="flex-1 flex flex-col items-center justify-center px-4">
          <div className="glass-card rounded-3xl p-6 w-full mb-6 animate-scale-in relative">
            {/* Progress indicator on right */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <div className="w-0.5 h-12 bg-gradient-to-b from-primary to-transparent" />
            </div>
            
            <h1 className="text-2xl md:text-3xl font-bold text-foreground leading-relaxed pr-8">
              {currentPrompt.text}
            </h1>
            <p className="text-muted-foreground mt-3">Say it in English</p>
          </div>

          {/* Level Indicator */}
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-8 animate-fade-in">
            <Mic className="w-4 h-4" />
            <span>Level A1–A2 · Speaking mission</span>
          </div>

          {/* Hint */}
          {showHint && (
            <div className="glass-card p-4 rounded-2xl mb-6 animate-scale-in w-full">
              <div className="flex items-start gap-3">
                <Lightbulb className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Hint</p>
                  <p className="text-foreground">{currentPrompt.hint}</p>
                </div>
              </div>
            </div>
          )}

          {/* Recording State with Live Transcript */}
          {isRecording && (
            <div className="mb-6 animate-fade-in w-full">
              <RecordingTimer isRecording={isRecording} />
              <AudioWaveform 
                isActive={isListening} 
                barCount={7} 
                className="mt-4" 
                audioLevels={audioLevels}
              />
              
              {/* Live transcript display */}
              {transcript && (
                <div className="mt-4 p-4 rounded-2xl bg-muted/30 border border-primary/30 animate-fade-in">
                  <p className="text-xs text-primary mb-1">You're saying:</p>
                  <p className="text-foreground font-medium">"{transcript}"</p>
                  {accuracy > 0 && (
                    <div className="flex items-center gap-4 mt-2 text-xs">
                      <span className="text-muted-foreground">Accuracy: <span className="text-primary font-medium">{accuracy}%</span></span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Speech not supported warning */}
          {!isSupported && (
            <div className="mb-4 p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-500 text-sm">
              Speech recognition not supported in this browser. Try Chrome or Safari.
            </div>
          )}
        </div>

        {/* Bottom Controls */}
        <div className="pb-12 animate-slide-up">
          {/* Mic Button */}
          <div className="flex flex-col items-center mb-6">
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
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between px-4">
            <button
              onClick={handleSkip}
              className="text-muted-foreground hover:text-foreground transition-colors text-sm"
            >
              Skip
            </button>
            <span className="text-muted-foreground text-sm">
              {isRecording ? "Release to finish" : "Hold to speak"}
            </span>
            <button
              onClick={() => setShowHint(true)}
              className="text-muted-foreground hover:text-foreground transition-colors text-sm"
            >
              Show hint
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MissionPrompt;
