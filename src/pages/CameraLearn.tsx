import { useState } from "react";
import { Zap, X, Search, Coffee, Monitor, BookOpen, Play, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import BottomNavigation from "@/components/BottomNavigation";

const objects = [
  { id: "cup", label: "tasse", icon: Coffee, x: "25%", y: "70%" },
  { id: "laptop", label: "ordinateur", icon: Monitor, x: "55%", y: "35%" },
  { id: "notebook", label: "cahier", icon: BookOpen, x: "75%", y: "55%" },
];

const CameraLearn = () => {
  const [selectedObject, setSelectedObject] = useState<string | null>(null);
  const [scannedObjects, setScannedObjects] = useState<string[]>(["cup", "laptop", "notebook"]);
  const [bottomSheetOpen, setBottomSheetOpen] = useState(true);

  const foundWords = objects.filter(obj => scannedObjects.includes(obj.id));

  return (
    <div className="min-h-screen bg-background pb-28">
      <div className="max-w-md mx-auto">
        {/* Header Pill */}
        <div className="flex justify-center pt-8 pb-4 animate-fade-in">
          <div className="pill-badge bg-muted/60 backdrop-blur-sm border-border/50">
            <span className="text-foreground/80">Point at objects to learn words</span>
          </div>
        </div>

        {/* Camera View */}
        <div className="relative mx-4 rounded-3xl overflow-hidden animate-scale-in aspect-[4/5]">
          {/* Simulated camera background - desk scene */}
          <div 
            className="absolute inset-0"
            style={{
              background: "linear-gradient(180deg, hsl(30 20% 95%) 0%, hsl(30 15% 90%) 100%)"
            }}
          >
            {/* Simulated desk items */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-8xl opacity-50 space-x-4">💻☕📓</div>
            </div>
          </div>

          {/* Flash/Scan button - top left */}
          <button className="absolute top-4 left-4 w-10 h-10 rounded-full bg-primary/90 flex items-center justify-center backdrop-blur-sm z-10">
            <Zap className="w-5 h-5 text-white" />
          </button>

          {/* Close button - top right */}
          <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/30 flex items-center justify-center backdrop-blur-sm z-10">
            <X className="w-5 h-5 text-white" />
          </button>

          {/* Search button - bottom right */}
          <button className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-black/30 flex items-center justify-center backdrop-blur-sm z-10">
            <Search className="w-5 h-5 text-white" />
          </button>

          {/* Tappable object labels */}
          {objects.map((obj) => {
            const isSelected = selectedObject === obj.id;
            
            return (
              <button
                key={obj.id}
                onClick={() => setSelectedObject(isSelected ? null : obj.id)}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 animate-scale-in z-10"
                style={{ left: obj.x, top: obj.y }}
              >
                <div
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    isSelected
                      ? "bg-primary text-white shadow-lg shadow-primary/30"
                      : "bg-muted-foreground/80 text-white hover:bg-muted-foreground"
                  }`}
                >
                  {obj.label}
                </div>
              </button>
            );
          })}
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center gap-2 py-4">
          {[0, 1, 2, 3, 4].map((dot) => (
            <div 
              key={dot}
              className={`w-2 h-2 rounded-full transition-all ${
                dot === 0 ? "bg-foreground" : "bg-muted-foreground/40"
              }`}
            />
          ))}
        </div>

        {/* Words Found Section */}
        <div className="px-4">
          <h2 className="text-xl font-bold text-foreground text-center mb-4">
            Words I found
          </h2>

          {/* Words List */}
          <div className="glass-card rounded-2xl p-4 mb-4 space-y-3">
            {foundWords.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  className="flex items-center gap-4 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                    <Icon className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <span className="text-foreground font-medium">{item.label}</span>
                </div>
              );
            })}
          </div>

          {/* CTA Button */}
          <Button
            className="w-full h-14 text-base font-semibold rounded-2xl glow-effect bg-primary hover:bg-primary/90"
          >
            <Play className="w-5 h-5 mr-2" />
            Start 60s mission
          </Button>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default CameraLearn;
