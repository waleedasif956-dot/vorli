import { useState, useCallback, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Mic, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import BottomNavigation from "@/components/BottomNavigation";
import AudioWaveform from "@/components/AudioWaveform";
import AppHeader from "@/components/AppHeader";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";

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
  const [finalScore, setFinalScore] = useState({ accuracy: 0, confidence: 0, transcript: "" });

  const currentPhrase = tutorPhrases[currentPhraseIndex];

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
    targetText: currentPhrase.phrase,
    language: "en-US"
  });

  // Use refs to always get the latest values when recording ends
  const latestDataRef = useRef({ transcript, accuracy, confidence });
  useEffect(() => {
    latestDataRef.current = { transcript, accuracy, confidence };
  }, [transcript, accuracy, confidence]);

  const isRecordingRef = useRef(isRecording);
  useEffect(() => {
    isRecordingRef.current = isRecording;
  }, [isRecording]);

  const handleRecordStart = useCallback(() => {
    setIsRecording(true);
    setShowFeedback(false);
    resetSpeech();
    setTimeout(() => {
      startListening();
    }, 100);
  }, [startListening, resetSpeech]);

  const handleRecordEnd = useCallback(() => {
    if (isRecordingRef.current) {
      setIsRecording(false);
      stopListening();
      
      // Small delay to ensure we have the latest transcript data
      setTimeout(() => {
        const { transcript: latestTranscript, accuracy: latestAccuracy, confidence: latestConfidence } = latestDataRef.current;
        const hasRealData = latestTranscript && latestTranscript.length > 0;
        setFinalScore({
          accuracy: hasRealData ? latestAccuracy : 0,
          confidence: hasRealData ? latestConfidence : 0,
          transcript: hasRealData ? latestTranscript : "No speech detected. Please try again."
        });
        setShowFeedback(true);
      }, 400);
    }
  }, [stopListening]);

  const handleNextPhrase = () => {
    setCurrentPhraseIndex((prev) => (prev + 1) % tutorPhrases.length);
    setShowFeedback(false);
    setShowPhonetics(false);
    resetSpeech();
  };

  const handleTryAgain = () => {
    setShowFeedback(false);
    resetSpeech();
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopListening();
    };
  }, [stopListening]);

  const overallScore = Math.round((finalScore.accuracy + finalScore.confidence) / 2);

  return (
    <div className="min-h-screen bg-background pb-28">
      <div className="max-w-md mx-auto px-4 pt-8">
        {/* Header */}
        <AppHeader title="AI Tutor" showBack showSettings />

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

        {/* Speech not supported warning */}
        {!isSupported && (
          <div className="mb-4 p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-500 text-sm text-center">
            Speech recognition not supported in this browser. Try Chrome or Safari.
          </div>
        )}

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
          <span className="text-muted-foreground text-sm mt-2">
            {isRecording ? "Release to finish" : "Hold to speak"}
          </span>
        </div>

        {/* Recording State with Live Transcript */}
        {isRecording && (
          <div className="animate-fade-in mb-4">
            <AudioWaveform isActive={isListening} barCount={30} />
            
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

        {/* Feedback */}
        {showFeedback && (
          <div className="glass-card rounded-2xl p-4 animate-scale-in">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br from-primary to-accent">
                  <span className="text-lg font-bold text-background">{overallScore}%</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {overallScore >= 90 ? "Excellent!" : overallScore >= 75 ? "Great job!" : overallScore >= 50 ? "Good effort!" : "Keep practicing!"}
                  </p>
                  <p className="text-xs text-muted-foreground">Overall Score</p>
                </div>
              </div>
            </div>
            
            {/* What you said */}
            {finalScore.transcript && (
              <div className="mb-3 p-3 rounded-xl bg-muted/30 border border-border/50">
                <p className="text-xs text-muted-foreground mb-1">What you said:</p>
                <p className="text-foreground text-sm">"{finalScore.transcript}"</p>
              </div>
            )}

            {/* Score breakdown */}
            <div className="flex gap-4 mb-3 text-xs">
              <div className="flex-1 p-2 rounded-lg bg-muted/50 text-center">
                <p className="text-muted-foreground">Accuracy</p>
                <p className="font-medium text-foreground">{finalScore.accuracy}%</p>
              </div>
              <div className="flex-1 p-2 rounded-lg bg-muted/50 text-center">
                <p className="text-muted-foreground">Confidence</p>
                <p className="font-medium text-foreground">{finalScore.confidence}%</p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleTryAgain}
                variant="outline"
                size="sm"
                className="flex-1 rounded-xl"
              >
                Try Again
              </Button>
              <Button
                onClick={handleNextPhrase}
                size="sm"
                className="flex-1 rounded-xl bg-primary hover:bg-primary/90"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Tutor;
