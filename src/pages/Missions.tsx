import { Target, Filter } from "lucide-react";
import MissionCard from "@/components/MissionCard";
import BottomNavigation from "@/components/BottomNavigation";
import { Button } from "@/components/ui/button";

const allMissions = [
  { id: "1", title: "Order coffee politely", category: "Travel", duration: "~40 sec", level: "A1–A2" },
  { id: "2", title: "Talk about your weekend", category: "Daily small talk", duration: "~60 sec", level: "B1" },
  { id: "3", title: "Describe a photo", category: "Speaking practice", duration: "~45 sec", level: "A2–B1" },
  { id: "4", title: "Ask for directions", category: "Travel", duration: "~30 sec", level: "A1" },
  { id: "5", title: "Introduce yourself", category: "Social", duration: "~50 sec", level: "A1–A2" },
  { id: "6", title: "Make a restaurant reservation", category: "Travel", duration: "~55 sec", level: "B1" },
  { id: "7", title: "Discuss your hobbies", category: "Social", duration: "~70 sec", level: "A2" },
  { id: "8", title: "Give compliments", category: "Daily small talk", duration: "~35 sec", level: "A1" },
];

const Missions = () => {
  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-md mx-auto px-4 pt-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 animate-fade-in">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-5 h-5 text-primary" />
              <span className="text-primary font-medium text-sm">All Missions</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground">Missions</h1>
          </div>
          <Button variant="outline" size="icon" className="rounded-xl border-border">
            <Filter className="w-4 h-4" />
          </Button>
        </div>

        {/* Categories */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 animate-slide-up">
          {["All", "Travel", "Social", "Daily", "Practice"].map((cat, i) => (
            <button
              key={cat}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                i === 0
                  ? "text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
              style={i === 0 ? { background: "var(--gradient-primary)" } : {}}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Mission List */}
        <div className="space-y-3">
          {allMissions.map((mission, index) => (
            <MissionCard key={mission.id} {...mission} index={index} />
          ))}
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Missions;
