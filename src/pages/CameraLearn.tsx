import { useState, useEffect, useRef } from "react";
import { Zap, X, Search, Play, Camera, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import BottomNavigation from "@/components/BottomNavigation";
import { useNavigate } from "react-router-dom";
import { useCamera } from "@/hooks/useCamera";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import AppHeader from "@/components/AppHeader";

interface RecognizedObject {
  id: string;
  label: string;
  englishLabel: string;
  confidence: number;
}

const CameraLearn = () => {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [selectedObject, setSelectedObject] = useState<string | null>(null);
  const [scannedObjects, setScannedObjects] = useState<RecognizedObject[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  
  const { isActive, error, startCamera, stopCamera, setVideoRef, captureFrame } = useCamera({ 
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

  const handleScan = async () => {
    if (isScanning) return;
    
    setIsScanning(true);
    
    try {
      // Capture frame from video
      const imageData = captureFrame();
      
      if (!imageData) {
        toast.error("Could not capture image. Make sure camera is active.");
        setIsScanning(false);
        return;
      }

      console.log("Sending image for recognition...");
      
      // Call edge function
      const { data, error: fnError } = await supabase.functions.invoke('recognize-objects', {
        body: { image: imageData }
      });

      if (fnError) {
        console.error("Function error:", fnError);
        toast.error("Failed to analyze image. Please try again.");
        setIsScanning(false);
        return;
      }

      if (data.error) {
        console.error("API error:", data.error);
        if (data.error.includes("Rate limit")) {
          toast.error("Too many requests. Please wait a moment.");
        } else if (data.error.includes("credits")) {
          toast.error("AI credits exhausted. Please add more credits.");
        } else {
          toast.error(data.error);
        }
        setIsScanning(false);
        return;
      }

      const objects = data.objects || [];
      console.log("Recognized objects:", objects);
      
      if (objects.length === 0) {
        toast.info("No objects detected. Try pointing at different items.");
      } else {
        toast.success(`Found ${objects.length} object${objects.length > 1 ? 's' : ''}!`);
        setScannedObjects(objects);
      }
      
    } catch (err) {
      console.error("Scan error:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsScanning(false);
    }
  };

  // Generate random positions for detected objects
  const getObjectPosition = (index: number, total: number) => {
    const positions = [
      { x: "25%", y: "30%" },
      { x: "70%", y: "25%" },
      { x: "20%", y: "60%" },
      { x: "75%", y: "55%" },
      { x: "50%", y: "45%" },
      { x: "40%", y: "70%" },
    ];
    return positions[index % positions.length];
  };

  return (
    <div className="min-h-screen bg-background pb-28">
      <div className="max-w-md mx-auto px-4 pt-8">
        {/* Header */}
        <AppHeader title="Camera Learn" showBack showAvatar={false} />

        {/* Instruction Pill */}
        <div className="flex justify-center mb-4 animate-fade-in">
          <div className="pill-badge bg-muted/60 backdrop-blur-sm border-border/50">
            <span className="text-foreground/80">Point at objects to learn words</span>
          </div>
        </div>

        {/* Camera View */}
        <div className="relative rounded-3xl overflow-hidden animate-scale-in aspect-[4/5]">
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
            <div className="absolute inset-0 bg-primary/10 flex flex-col items-center justify-center z-20">
              <div className="scan-line" />
              <Loader2 className="w-8 h-8 text-white animate-spin mb-2" />
              <div className="text-white text-lg font-medium">
                Analyzing...
              </div>
            </div>
          )}

          {/* Flash/Scan button - top left */}
          <button 
            onClick={handleScan}
            disabled={isScanning}
            className="absolute top-4 left-4 w-10 h-10 rounded-full bg-primary/90 flex items-center justify-center backdrop-blur-sm z-10 active:scale-95 transition-transform disabled:opacity-50"
          >
            {isScanning ? (
              <Loader2 className="w-5 h-5 text-white animate-spin" />
            ) : (
              <Zap className="w-5 h-5 text-white" />
            )}
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
          {scannedObjects.length > 0 && scannedObjects.map((obj, index) => {
            const isSelected = selectedObject === obj.id;
            const position = getObjectPosition(index, scannedObjects.length);
            
            return (
              <button
                key={`${obj.id}-${index}`}
                onClick={() => setSelectedObject(isSelected ? null : obj.id)}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 animate-scale-in z-10"
                style={{ left: position.x, top: position.y, animationDelay: `${index * 100}ms` }}
              >
                <div
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    isSelected
                      ? "bg-primary text-white shadow-lg shadow-primary/30"
                      : "bg-muted-foreground/80 text-white hover:bg-muted-foreground"
                  }`}
                >
                  {obj.label}
                  {isSelected && (
                    <span className="block text-xs opacity-80 mt-0.5">{obj.englishLabel}</span>
                  )}
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
            {scannedObjects.length > 0 ? (
              scannedObjects.map((item, index) => (
                <div
                  key={`${item.id}-${index}`}
                  className="flex items-center justify-between animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-lg">
                      🏷️
                    </div>
                    <div>
                      <span className="text-foreground font-medium">{item.label}</span>
                      <span className="text-muted-foreground text-sm ml-2">({item.englishLabel})</span>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {Math.round(item.confidence * 100)}%
                  </div>
                </div>
              ))
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
            disabled={scannedObjects.length === 0}
            className="w-full h-14 text-base font-semibold rounded-2xl glow-effect"
            style={{ 
              background: scannedObjects.length > 0 
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
