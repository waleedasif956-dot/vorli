import { useState, useEffect, useRef } from "react";
import { Zap, X, Search, Coffee, Monitor, BookOpen, Play, Camera, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import BottomNavigation from "@/components/BottomNavigation";
import { useNavigate } from "react-router-dom";
import { useCamera } from "@/hooks/useCamera";

const objects = [
  { id: "cup", label: "tasse", icon: Coffee, x: "25%", y: "70%" },
  { id: "laptop", label: "ordinateur", icon: Monitor, x: "55%", y: "35%" },
  { id: "notebook", label: "cahier", icon: BookOpen, x: "75%", y: "55%" },
];

const CameraLearn = () => {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [selectedObject, setSelectedObject] = useState<string | null>(null);
  const [scannedObjects, setScannedObjects] = useState<string[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  
  const { isActive, error, startCamera, stopCamera, setVideoRef } = useCamera({ 
    facingMode: "environment" 
  });

  // Start camera when component mounts
  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  // Set video ref when it's available
  useEffect(() => {
    if (videoRef.current) {
      setVideoRef(videoRef.current);
    }
  }, [setVideoRef]);

  const handleScan = () => {
    setIsScanning(true);
    // Simulate scanning delay and reveal objects
    setTimeout(() => {
      setScannedObjects(["cup", "laptop", "notebook"]);
      setIsScanning(false);
    }, 1500);
  };

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
          {/* Real camera feed or fallback */}
          {isActive && !error ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div 
              className="absolute inset-0"
              style={{
                background: "linear-gradient(180deg, hsl(30 20% 95%) 0%, hsl(30 15% 90%) 100%)"
              }}
            >
              {/* Fallback simulated desk items */}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                {error ? (
                  <>
                    <AlertCircle className="w-12 h-12 text-muted-foreground/50" />
                    <p className="text-muted-foreground text-sm text-center px-8">
                      Camera access needed. Allow camera permission or use demo mode.
                    </p>
                  </>
                ) : (
                  <div className="text-8xl opacity-50 space-x-4">💻☕📓</div>
                )}
              </div>
            </div>
          )}

          {/* Scanning overlay */}
          {isScanning && (
            <div className="absolute inset-0 bg-primary/10 flex items-center justify-center z-20">
              <div className="scan-line" />
              <div className="text-white text-lg font-medium animate-pulse">
                Scanning...
              </div>
            </div>
          )}

          {/* Flash/Scan button - top left */}
          <button 
            onClick={handleScan}
            className="absolute top-4 left-4 w-10 h-10 rounded-full bg-primary/90 flex items-center justify-center backdrop-blur-sm z-10 active:scale-95 transition-transform"
          >
            <Zap className="w-5 h-5 text-white" />
          </button>

          {/* Close button - top right */}
          <button 
            onClick={() => navigate("/")}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/30 flex items-center justify-center backdrop-blur-sm z-10 active:scale-95 transition-transform"
          >
            <X className="w-5 h-5 text-white" />
          </button>

          {/* Camera toggle button - bottom left */}
          <button 
            onClick={startCamera}
            className="absolute bottom-4 left-4 w-10 h-10 rounded-full bg-black/30 flex items-center justify-center backdrop-blur-sm z-10 active:scale-95 transition-transform"
          >
            <Camera className="w-5 h-5 text-white" />
          </button>

          {/* Search button - bottom right */}
          <button className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-black/30 flex items-center justify-center backdrop-blur-sm z-10">
            <Search className="w-5 h-5 text-white" />
          </button>

          {/* Tappable object labels - only show after scanning */}
          {scannedObjects.length > 0 && objects.map((obj) => {
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
          <div className="glass-card rounded-2xl p-4 mb-4 space-y-3 min-h-[120px]">
            {foundWords.length > 0 ? (
              foundWords.map((item, index) => {
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
              })
            ) : (
              <div className="flex flex-col items-center justify-center py-4 text-muted-foreground">
                <Camera className="w-8 h-8 mb-2 opacity-50" />
                <p className="text-sm">Tap the flash icon to scan for objects</p>
              </div>
            )}
          </div>

          {/* CTA Button */}
          <Button
            onClick={() => navigate("/mission/1")}
            disabled={foundWords.length === 0}
            className="w-full h-14 text-base font-semibold rounded-2xl glow-effect"
            style={{ 
              background: foundWords.length > 0 
                ? "linear-gradient(90deg, #06b6d4 0%, #3b82f6 50%, #8b5cf6 100%)" 
                : undefined 
            }}
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
