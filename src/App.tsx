import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Missions from "./pages/Missions";
import MissionDetails from "./pages/MissionDetails";
import MissionPrompt from "./pages/MissionPrompt";
import Tutor from "./pages/Tutor";
import CameraLearn from "./pages/CameraLearn";
import Progress from "./pages/Progress";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      
      {/* Prototype watermark */}
      <div className="fixed top-4 right-4 z-50 px-2 py-1 rounded-md bg-muted/80 backdrop-blur-sm border border-border/50">
        <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
          Prototype
        </span>
      </div>
      
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/missions" element={<Missions />} />
          <Route path="/mission/:id" element={<MissionDetails />} />
          <Route path="/mission/:id/prompt" element={<MissionPrompt />} />
          <Route path="/tutor" element={<Tutor />} />
          <Route path="/camera" element={<CameraLearn />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
