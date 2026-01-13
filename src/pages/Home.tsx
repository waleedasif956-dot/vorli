import { Sparkles } from "lucide-react";
import MissionCard from "@/components/MissionCard";
import BottomNavigation from "@/components/BottomNavigation";

const missions = [
  {
    id: "1",
    title: "Order coffee politely",
    category: "Travel",
    duration: "~40 sec",
    level: "A1–A2",
  },
  {
    id: "2",
    title: "Talk about your weekend",
    category: "Daily small talk",
    duration: "~60 sec",
    level: "B1",
  },
  {
    id: "3",
    title: "Describe a photo",
    category: "Speaking practice",
    duration: "~45 sec",
    level: "A2–B1",
  },
  {
    id: "4",
    title: "Ask for directions",
    category: "Travel",
    duration: "~30 sec",
    level: "A1",
  },
  {
    id: "5",
    title: "Introduce yourself",
    category: "Social",
    duration: "~50 sec",
    level: "A1–A2",
  },
];

const Home = () => {
  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-md mx-auto px-4 pt-12">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="text-primary font-medium text-sm">For You</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-3">
            For You to Learn
          </h1>
          <div className="pill-badge">
            <span>Today</span>
            <span className="text-muted-foreground">·</span>
            <span>5 min</span>
            <span className="text-muted-foreground">·</span>
            <span>3 missions</span>
          </div>
        </div>

        {/* Mission Cards */}
        <div className="space-y-3 mb-8">
          {missions.map((mission, index) => (
            <MissionCard key={mission.id} {...mission} index={index} />
          ))}
        </div>

        {/* Progress hint */}
        <div className="text-center animate-fade-in" style={{ animationDelay: "500ms" }}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border border-border">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm text-muted-foreground">
              Level 2 · 10 missions completed
            </span>
          </div>
        </div>
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default Home;
