import { Volume2, Eye, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import MicButton from "@/components/MicButton";
import BottomNavigation from "@/components/BottomNavigation";
import { useState } from "react";

const Tutor = () => {
  const [showPhonetics, setShowPhonetics] = useState(false);

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-md mx-auto px-4 pt-8">
        {/* Header */}
        <div className="text-center mb-6 animate-fade-in">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="text-primary font-medium text-sm">AI voice · Live</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">AI Tutor</h1>
        </div>

        {/* Tutor Avatar */}
        <div className="relative aspect-square max-w-[280px] mx-auto mb-8 animate-scale-in">
          <div className="absolute inset-0 rounded-3xl overflow-hidden card-glow">
            <div 
              className="w-full h-full bg-gradient-to-br from-muted to-card flex items-center justify-center"
              style={{ 
                background: "linear-gradient(135deg, hsl(var(--muted)) 0%, hsl(var(--card)) 100%)"
              }}
            >
              <div className="text-center">
                <div className="w-32 h-32 rounded-full mx-auto mb-4 animate-float" style={{ background: "var(--gradient-primary)" }}>
                  <div className="w-full h-full rounded-full flex items-center justify-center text-5xl">
                    👩‍🏫
                  </div>
                </div>
                <span className="text-muted-foreground text-sm">AI Language Coach</span>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-primary/20 text-primary text-xs font-medium px-3 py-1 rounded-full border border-primary/30">
            Speaking...
          </div>
        </div>

        {/* Instruction */}
        <div className="text-center mb-8 animate-slide-up">
          <p className="text-lg font-medium text-foreground mb-2">
            Watch my mouth and repeat after me.
          </p>
          <p className="gradient-text text-xl font-bold">
            "Buenos días, ¿cómo estás?"
          </p>
          {showPhonetics && (
            <p className="text-muted-foreground text-sm mt-2 animate-fade-in">
              /ˈbwe.nos ˈdi.as ˈko.mo esˈtas/
            </p>
          )}
        </div>

        {/* Mic Button */}
        <div className="flex justify-center mb-8">
          <MicButton size="large" />
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-center gap-3">
          <Button
            variant="outline"
            className="rounded-xl border-border hover:border-primary hover:text-primary transition-colors"
          >
            <Volume2 className="w-4 h-4 mr-2" />
            Slow down
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowPhonetics(!showPhonetics)}
            className={`rounded-xl border-border transition-colors ${
              showPhonetics ? "border-primary text-primary" : "hover:border-primary hover:text-primary"
            }`}
          >
            <Eye className="w-4 h-4 mr-2" />
            Show phonetics
          </Button>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Tutor;
