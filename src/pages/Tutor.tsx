import { useState, useCallback, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Mic, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import BottomNavigation from "@/components/BottomNavigation";
import AudioWaveform from "@/components/AudioWaveform";
import AppHeader from "@/components/AppHeader";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { useAudioLevels } from "@/hooks/useAudioLevels";

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

  // Real audio levels for waveform visualization
  const { 
    levels: audioLevels, 
    startListening: startAudioLevels, 
    stopListening: stopAudioLevels 
  } = useAudioLevels({ barCount: 30, sensitivity: 2 });

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
  // auto-finish the attempt so they immediately see the result.
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
        transcript: hasRealData ? bestTranscript : "No speech detected. Please try again.",
      });
      setShowFeedback(true);
    }, 400);
  }, [stopListening, stopAudioLevels]);

  useEffect(() => {
    if (!isRecording) return;
    if (autoEndedRef.current) return;
    if (!transcript) return;

    // Treat 90%+ as “completed correctly” for auto-finish.
    if (accuracy >= 90) {
      autoEndedRef.current = true;
      // Reuse the same end flow (stop listening + compute finalScore)
      // so behavior matches releasing the button.
      handleRecordEnd();
    }
  }, [isRecording, transcript, accuracy, handleRecordEnd]);

  const handleRecordStart = useCallback(() => {
    autoEndedRef.current = false;
    setIsRecording(true);
    setShowFeedback(false);
    resetSpeech();

    // Android Chrome often fails to deliver SpeechRecognition results if
    // getUserMedia() is also active (our audio-level meter).
    // So on Android we prioritize SpeechRecognition and use a simulated
    // waveform animation (see AudioWaveform) instead of real mic levels.
    const isAndroid = /android/i.test(navigator.userAgent);

    if (isAndroid) {
      startListening();
      return;
    }

    // On desktop/iOS: use real audio levels + speech recognition.
    startAudioLevels();
    setTimeout(() => {
      startListening();
    }, 100);
  }, [startListening, resetSpeech, startAudioLevels]);

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

        {/* Tutor Avatar Area - Simple illustrated character */}
        <div className="relative rounded-3xl overflow-hidden mb-4 animate-scale-in aspect-[4/3]">
          <div 
            className="absolute inset-0 bg-gradient-to-b from-primary/5 to-primary/10"
          >
            {/* Illustrated avatar - friendly cartoon style */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
              {/* Simple illustrated face */}
              <div className="relative">
                {/* Head */}
                <div className="w-28 h-28 rounded-full bg-amber-100 border-4 border-amber-200 flex items-center justify-center relative overflow-hidden">
                  {/* Hair */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-12 bg-amber-800 rounded-t-full" />
                  {/* Face */}
                  <div className="relative mt-4">
                    {/* Eyes */}
                    <div className="flex gap-5 mb-2">
                      <div className="w-3 h-3 rounded-full bg-stone-800" />
                      <div className="w-3 h-3 rounded-full bg-stone-800" />
                    </div>
                    {/* Smile */}
                    <div className="w-6 h-3 border-b-2 border-stone-700 rounded-b-full mx-auto" />
                  </div>
                </div>
                {/* Headphones */}
                <div className="absolute top-3 -left-2 w-5 h-8 bg-primary rounded-full" />
                <div className="absolute top-3 -right-2 w-5 h-8 bg-primary rounded-full" />
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-28 h-4 border-t-4 border-primary rounded-t-full" />
              </div>
              
            </div>
          </div>

          {/* Status badge */}
          <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-background/90 backdrop-blur-sm border border-border/50 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <span className="text-xs font-medium text-foreground">Ready</span>
          </div>
        </div>

        {/* Instruction Pill - Safe text, no lip-sync implication */}
        <div className="flex justify-center mb-3 animate-fade-in">
          <div className="px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium">
            Listen and repeat after me.
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

        {/* Speech recognition warning hidden for demo/video purposes */}

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
            <AudioWaveform isActive={isListening} barCount={30} audioLevels={audioLevels} />
            
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
