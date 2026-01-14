import { useState } from "react";
import { Camera, ChevronUp, Play, Scan, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import BottomNavigation from "@/components/BottomNavigation";

const objects = [
  { id: "cup", label: "Coffee Cup", word: "la tasse", x: "20%", y: "35%" },
  { id: "croissant", label: "Croissant", word: "le croissant", x: "55%", y: "45%" },
  { id: "napkin", label: "Napkin", word: "la serviette", x: "75%", y: "60%" },
  { id: "spoon", label: "Spoon", word: "la cuillère", x: "35%", y: "55%" },
  { id: "notebook", label: "Notebook", word: "le cahier", x: "65%", y: "30%" },
];

const CameraLearn = () => {
  const [selectedObject, setSelectedObject] = useState<string | null>(null);
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scannedObjects, setScannedObjects] = useState<string[]>([]);

  const handleScan = () => {
    setIsScanning(true);
    setScannedObjects([]);
    
    // Simulate scanning objects one by one
    objects.forEach((obj, index) => {
      setTimeout(() => {
        setScannedObjects(prev => [...prev, obj.id]);
      }, 500 + index * 400);
    });

    setTimeout(() => {
      setIsScanning(false);
      setBottomSheetOpen(true);
    }, 500 + objects.length * 400 + 300);
  };

  const foundWords = objects.filter(obj => scannedObjects.includes(obj.id));

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
        <div className="relative aspect-[4/3] mx-4 rounded-2xl overflow-hidden glass-card animate-scale-in">
          <div 
            className="absolute inset-0"
            style={{
              background: "linear-gradient(135deg, hsl(222 47% 10%) 0%, hsl(222 47% 15%) 100%)"
            }}
          >
            {/* Simulated table scene */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-6xl opacity-30">☕🥐📝🥄📓</div>
            </div>
          </div>

          {/* Scan line animation */}
          {isScanning && <div className="scan-line" />}

          {/* Tappable object labels */}
          {objects.map((obj) => {
            const isScanned = scannedObjects.includes(obj.id);
            const isSelected = selectedObject === obj.id;
            
            return (
              <button
                key={obj.id}
                onClick={() => setSelectedObject(isSelected ? null : obj.id)}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
                  isScanned ? "animate-scale-in" : "opacity-0"
                }`}
                style={{ left: obj.x, top: obj.y }}
              >
                <div
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                    isSelected
                      ? "border-primary text-primary bg-primary/20 scale-110"
                      : "border-foreground/30 text-foreground bg-background/80 hover:border-primary/50"
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    {isScanned && <Check className="w-3 h-3" />}
                    {obj.label}
                  </span>
                </div>
              </button>
            );
          })}

          {/* Selected object detail */}
          {selectedObject && (
            <div className="absolute bottom-4 left-4 right-4 glass-card rounded-xl p-3 animate-slide-up">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-foreground font-medium">
                    {objects.find(o => o.id === selectedObject)?.word}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {objects.find(o => o.id === selectedObject)?.label}
                  </p>
                </div>
                <button className="p-2 rounded-full bg-primary/20">
                  <span className="text-xl">🔊</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Scan Button */}
        {!isScanning && scannedObjects.length === 0 && (
          <div className="px-4 py-6 animate-fade-in">
            <Button
              onClick={handleScan}
              className="w-full h-14 text-lg font-semibold rounded-2xl glow-effect"
              style={{ background: "var(--gradient-primary)" }}
            >
              <Scan className="w-5 h-5 mr-2" />
              Scan Objects
            </Button>
          </div>
        )}

        {/* Instruction */}
        {scannedObjects.length > 0 && !isScanning && (
          <div className="px-4 py-6 animate-slide-up">
            <p className="text-center text-muted-foreground">
              Tap an object to learn • Say: <span className="text-foreground font-medium">"La tasse est sur la table."</span>
            </p>
          </div>
        )}

        {/* Bottom Sheet Toggle */}
        {scannedObjects.length > 0 && (
          <>
            <button
              onClick={() => setBottomSheetOpen(!bottomSheetOpen)}
              className="mx-4 w-[calc(100%-2rem)] py-4 px-4 rounded-t-2xl glass-card flex items-center justify-between animate-fade-in"
            >
              <span className="font-semibold text-foreground">Words I found ({foundWords.length})</span>
              <ChevronUp
                className={`w-5 h-5 text-muted-foreground transition-transform ${
                  bottomSheetOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Bottom Sheet Content */}
            <div
              className={`mx-4 glass-card rounded-b-2xl overflow-hidden transition-all duration-300 ${
                bottomSheetOpen ? "max-h-80" : "max-h-0"
              }`}
            >
              <div className="p-4 space-y-3">
                {foundWords.map((item, index) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-muted/50 animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                        <Check className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <span className="font-medium text-foreground">{item.word}</span>
                        <p className="text-muted-foreground text-xs">{item.label}</p>
                      </div>
                    </div>
                    <button className="p-2 rounded-full hover:bg-muted transition-colors">
                      <span className="text-lg">🔊</span>
                    </button>
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
          </>
        )}
      </div>

      <BottomNavigation />
    </div>
  );
};

export default CameraLearn;
