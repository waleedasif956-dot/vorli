import { useNavigate } from "react-router-dom";
import { Plane, MessageCircle, Camera, Briefcase, Globe } from "lucide-react";
import BottomNavigation from "@/components/BottomNavigation";

const missions = [
  {
    id: "1",
    title: "Order coffee politely",
    category: "Travel",
    duration: "≈ 40 sec",
    level: "A1–A2",
    gradientFrom: "#3b82f6",
    gradientVia: "#2563eb", 
    gradientTo: "#7c3aed",
    icon: Plane,
  },
  {
    id: "2",
    title: "Talk about your weekend",
    category: "Daily small talk",
    duration: "≈ 60 sec",
    level: "B1",
    gradientFrom: "#8b5cf6",
    gradientVia: "#7c3aed",
    gradientTo: "#ec4899",
    icon: MessageCircle,
  },
  {
    id: "3",
    title: "Describe a photo",
    category: "Speaking practice",
    duration: "≈ 45 sec",
    level: "A2–B1",
    gradientFrom: "#14b8a6",
    gradientVia: "#22d3ee",
    gradientTo: "#5eead4",
    icon: Camera,
  },
  {
    id: "4",
    title: "Ask for directions",
    category: "Travel",
    duration: "≈ 30 sec",
    level: "A1",
    gradientFrom: "#f97316",
    gradientVia: "#fbbf24",
    gradientTo: "#facc15",
    icon: Globe,
  },
  {
    id: "5",
    title: "Introduce yourself at work",
    category: "Professional",
    duration: "≈ 50 sec",
    level: "B1–B2",
    gradientFrom: "#10b981",
    gradientVia: "#22c55e",
    gradientTo: "#14b8a6",
    icon: Briefcase,
  },
];

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-28">
      <div className="max-w-md mx-auto px-4 pt-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="text-3xl font-bold text-primary tracking-tight">V</div>
          </div>
          <h1 className="text-lg font-semibold text-foreground">For You to Learn</h1>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center border border-border/50">
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center overflow-hidden">
              <span className="text-lg">👤</span>
            </div>
          </div>
        </div>

        {/* Today's Summary Pill */}
        <div className="flex justify-center mb-8 animate-fade-in" style={{ animationDelay: "100ms" }}>
          <div className="pill-badge bg-muted/60 backdrop-blur-sm border-border/50">
            <span className="text-foreground/80">Today</span>
            <span className="text-muted-foreground">·</span>
            <span className="text-foreground/80">5 min</span>
            <span className="text-muted-foreground">·</span>
            <span className="text-foreground/80">3 missions</span>
          </div>
        </div>

        {/* Mission Cards - Large Gradient Style */}
        <div className="space-y-4 mb-8">
          {missions.slice(0, 3).map((mission, index) => {
            const Icon = mission.icon;
            return (
              <button
                key={mission.id}
                onClick={() => navigate(`/mission/${mission.id}`)}
                className="w-full rounded-3xl p-5 text-left transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] animate-slide-up relative overflow-hidden group"
                style={{ 
                  animationDelay: `${(index + 1) * 100}ms`,
                  background: `linear-gradient(135deg, ${mission.gradientFrom} 0%, ${mission.gradientVia} 50%, ${mission.gradientTo} 100%)`
                }}
              >
                {/* Subtle glass overlay */}
                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                
                {/* Dropdown indicator */}
                <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-white/80">
                    <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>

                {/* Content */}
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold text-white mb-3 pr-12 leading-tight">
                    {mission.title}
                  </h3>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-black/20 text-white/90 backdrop-blur-sm">
                        {mission.category} · {mission.duration} · {mission.level}
                      </span>
                    </div>
                    
                    <div className="w-10 h-10 rounded-xl bg-black/20 flex items-center justify-center backdrop-blur-sm">
                      <Icon className="w-5 h-5 text-white/90" />
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Level Progress */}
        <div className="animate-fade-in" style={{ animationDelay: "500ms" }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full" 
                style={{ 
                  width: "65%",
                  background: "linear-gradient(90deg, #06b6d4 0%, #3b82f6 50%, #8b5cf6 100%)"
                }}
              />
            </div>
            <span className="text-xs text-muted-foreground whitespace-nowrap">Level 2</span>
          </div>
          <p className="text-center text-sm text-muted-foreground">
            10 missions completed
          </p>
        </div>
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default Home;
