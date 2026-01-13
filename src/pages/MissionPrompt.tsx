import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Lightbulb, SkipForward, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import MicButton from "@/components/MicButton";

const prompts: Record<string, string[]> = {
  "1": ["Ask if they have oat milk.", "Order a medium latte.", "Ask for the bill."],
  "2": ["Describe what you did on Saturday.", "Talk about a fun activity.", "Mention your plans for next weekend."],
  "3": ["Describe the main subject of the photo.", "Talk about the colors you see.", "Explain what's happening in the scene."],
};

const MissionPrompt = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentPrompt, setCurrentPrompt] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const missionPrompts = prompts[id || "1"] || prompts["1"];
  const totalPrompts = missionPrompts.length;

  const handleComplete = () => {
    setShowResult(true);
  };

  const handleNext = () => {
    if (currentPrompt < totalPrompts - 1) {
      setCurrentPrompt(currentPrompt + 1);
      setShowResult(false);
      setShowHint(false);
    } else {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="max-w-md mx-auto px-4 pt-6 w-full flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="text-sm font-medium text-muted-foreground">
            Mission {currentPrompt + 1}/{totalPrompts}
          </span>
          <div className="w-5" />
        </div>

        {/* Prompt */}
        <div className="flex-1 flex flex-col items-center justify-center text-center px-4 -mt-16">
          {!showResult ? (
            <div className="animate-fade-in">
              <h1 className="text-2xl font-bold text-foreground mb-3 leading-tight">
                "{missionPrompts[currentPrompt]}"
              </h1>
              <p className="text-muted-foreground mb-4">Say it in English</p>
              
              {showHint && (
                <div className="pill-badge mb-6 animate-scale-in">
                  <Lightbulb className="w-3.5 h-3.5 text-primary" />
                  <span>Try: "Excuse me, do you have..."</span>
                </div>
              )}
            </div>
          ) : (
            <div className="animate-scale-in text-center">
              <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-xl font-bold text-foreground mb-2">Great job!</h2>
              <div className="gradient-text text-3xl font-bold mb-6">92%</div>
              <p className="text-muted-foreground text-sm">Confidence Score</p>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="pb-12">
          {!showResult ? (
            <>
              <div className="flex justify-center mb-8">
                <MicButton onComplete={handleComplete} size="large" />
              </div>
              <div className="flex items-center justify-center gap-4">
                <Button
                  variant="ghost"
                  onClick={() => handleNext()}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <SkipForward className="w-4 h-4 mr-2" />
                  Skip
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setShowHint(true)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Lightbulb className="w-4 h-4 mr-2" />
                  Show Hint
                </Button>
              </div>
            </>
          ) : (
            <Button
              onClick={handleNext}
              className="w-full h-14 text-lg font-semibold rounded-2xl glow-effect"
              style={{ background: "var(--gradient-primary)" }}
            >
              {currentPrompt < totalPrompts - 1 ? "Next Mission" : "Complete"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MissionPrompt;
