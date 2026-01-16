import { useNavigate } from "react-router-dom";
import { Rocket, Mic, BarChart3, Flame, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import BottomNavigation from "@/components/BottomNavigation";
import AppHeader from "@/components/AppHeader";

// Minimal placeholder values - clearly not real progress
const stats = [
  { label: "Missions", value: "3", icon: Rocket },
  { label: "Minutes spoken", value: "8", icon: Mic },
  { label: "Pronunciation", value: "—", icon: BarChart3 },
  { label: "Streak", value: "1 day", icon: Flame },
];

const Progress = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-background pb-28">
      <div className="max-w-md mx-auto px-4 pt-8">
        {/* Header */}
        <AppHeader title="Your Progress" />

        {/* Demo data label */}
        <div className="flex justify-center mb-6">
          <span className="text-xs text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">
            Demo data
          </span>
        </div>

        {/* Stats Grid - Simple cards */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="rounded-2xl p-4 bg-muted/30 border border-border/50 animate-slide-up"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-2xl font-semibold text-foreground">{stat.value}</span>
                    <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Simple message instead of fake chart */}
        <div className="rounded-2xl p-6 bg-muted/20 border border-border/50 text-center mb-8 animate-fade-in">
          <p className="text-muted-foreground text-sm">
            Your weekly progress chart will appear here once you complete more missions.
          </p>
        </div>

        {/* CTA */}
        <Button
          onClick={() => navigate("/missions")}
          className="w-full h-14 text-base font-semibold rounded-2xl bg-primary hover:bg-primary/90 animate-fade-in"
          style={{ animationDelay: "300ms" }}
        >
          Start a mission
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Progress;
