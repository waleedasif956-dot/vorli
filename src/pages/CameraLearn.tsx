import { useState } from "react";
import { Camera, ChevronUp, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import BottomNavigation from "@/components/BottomNavigation";

const objects = [
  { id: "cup", label: "Coffee Cup", x: "20%", y: "35%" },
  { id: "croissant", label: "Croissant", x: "55%", y: "45%" },
  { id: "napkin", label: "Napkin", x: "75%", y: "60%" },
  { id: "spoon", label: "Spoon", x: "35%", y: "55%" },
];

const foundWords = [
  { word: "tasse", translation: "cup" },
  { word: "ordinateur", translation: "computer" },
  { word: "cahier", translation: "notebook" },
];

const CameraLearn = () => {
  const [selectedObject, setSelectedObject] = useState<string | null>(null);
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="px-4 pt-8 pb-4 animate-fade-in">
          <div className="flex items-center gap-2 mb-2">
            <Camera className="w-5 h-5 text-primary" />
            <span className="text-primary font-medium text-sm">Point & Learn</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">Camera Learning</h1>
        </div>

        {/* Camera View */}
        <div className="relative aspect-[4/3] mx-4 rounded-2xl overflow-hidden card-glow animate-scale-in">
          <div 
            className="absolute inset-0"
            style={{
              background: "linear-gradient(135deg, hsl(222 47% 10%) 0%, hsl(222 47% 15%) 100%)"
            }}
          >
            {/* Simulated table scene */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-6xl opacity-20">☕🥐📝🥄</div>
            </div>
          </div>

          {/* Tappable object labels */}
          {objects.map((obj) => (
            <button
              key={obj.id}
              onClick={() => setSelectedObject(obj.id)}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 ${
                selectedObject === obj.id ? "scale-110" : ""
              }`}
              style={{ left: obj.x, top: obj.y }}
            >
              <div
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  selectedObject === obj.id
                    ? "border-primary text-primary bg-primary/20"
                    : "border-foreground/30 text-foreground bg-background/80 hover:border-primary/50"
                }`}
              >
                {obj.label}
              </div>
            </button>
          ))}
        </div>

        {/* Instruction */}
        <div className="px-4 py-6 animate-slide-up">
          <p className="text-center text-muted-foreground">
            Find and say: <span className="text-foreground font-medium">"The coffee cup is on the table."</span>
          </p>
        </div>

        {/* Bottom Sheet Toggle */}
        <button
          onClick={() => setBottomSheetOpen(!bottomSheetOpen)}
          className="mx-4 w-[calc(100%-2rem)] py-4 px-4 rounded-t-2xl bg-card border border-border border-b-0 flex items-center justify-between"
        >
          <span className="font-semibold text-foreground">Words I found</span>
          <ChevronUp
            className={`w-5 h-5 text-muted-foreground transition-transform ${
              bottomSheetOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Bottom Sheet Content */}
        <div
          className={`mx-4 bg-card border border-border border-t-0 rounded-b-2xl overflow-hidden transition-all duration-300 ${
            bottomSheetOpen ? "max-h-64" : "max-h-0"
          }`}
        >
          <div className="p-4 space-y-3">
            {foundWords.map((item, index) => (
              <div
                key={item.word}
                className="flex items-center justify-between p-3 rounded-xl bg-muted/50 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <span className="font-medium text-foreground">{item.word}</span>
                <span className="text-muted-foreground text-sm">{item.translation}</span>
              </div>
            ))}
            
            <Button
              className="w-full h-12 rounded-xl font-semibold glow-effect mt-4"
              style={{ background: "var(--gradient-primary)" }}
            >
              <Play className="w-4 h-4 mr-2" />
              Start 60s mission
            </Button>
          </div>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default CameraLearn;
