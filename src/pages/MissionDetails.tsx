import { useParams, useNavigate } from "react-router-dom";
import { Clock, MapPin, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import BottomNavigation from "@/components/BottomNavigation";
import AppHeader from "@/components/AppHeader";

const missionData: Record<string, { title: string; category: string; location: string; duration: string; level: string; description: string }> = {
  "1": {
    title: "Order coffee politely",
    category: "Travel",
    location: "Café",
    duration: "~40 sec",
    level: "A1–A2",
    description: "Practice ordering your favorite coffee drink in a friendly café setting. Learn polite phrases and common café vocabulary.",
  },
  "2": {
    title: "Talk about your weekend",
    category: "Daily small talk",
    location: "Office",
    duration: "~60 sec",
    level: "B1",
    description: "Master casual conversation about your weekend activities. Perfect for building workplace relationships.",
  },
  "3": {
    title: "Describe a photo",
    category: "Speaking practice",
    location: "Any",
    duration: "~45 sec",
    level: "A2–B1",
    description: "Improve your descriptive language skills by talking about what you see in various images.",
  },
};

const MissionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const mission = missionData[id || "1"] || missionData["1"];

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-md mx-auto px-4 pt-8">
        {/* Header */}
        <AppHeader title="Mission Details" showBack />

        {/* Mission info */}
        <div className="animate-fade-in">
          <h1 className="text-2xl font-bold text-foreground mb-4">{mission.title}</h1>
          
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <div className="pill-badge">
              <span>{mission.category}</span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
              <MapPin className="w-4 h-4" />
              <span>{mission.location}</span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
              <Clock className="w-4 h-4" />
              <span>{mission.duration}</span>
            </div>
            <div className="flex items-center gap-1.5 text-primary text-sm font-medium">
              <BarChart3 className="w-4 h-4" />
              <span>{mission.level}</span>
            </div>
          </div>

          {/* Glass card for description */}
          <div className="glass-card rounded-2xl p-5 mb-8">
            <p className="text-muted-foreground leading-relaxed">
              {mission.description}
            </p>
          </div>

          {/* What you'll practice */}
          <div className="mb-8">
            <h3 className="text-sm font-medium text-muted-foreground mb-3">What you'll practice</h3>
            <div className="flex flex-wrap gap-2">
              {["Ordering", "Polite phrases", "Questions", "Numbers"].map((skill) => (
                <span key={skill} className="px-3 py-1.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* CTA Button */}
          <Button
            onClick={() => navigate(`/mission/${id}/prompt`)}
            className="w-full h-14 text-lg font-semibold rounded-2xl glow-effect"
            style={{ background: "var(--gradient-primary)" }}
          >
            Start Mission
          </Button>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default MissionDetails;
