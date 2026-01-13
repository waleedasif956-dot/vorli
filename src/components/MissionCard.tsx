import { Clock, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface MissionCardProps {
  id: string;
  title: string;
  category: string;
  duration: string;
  level: string;
  index: number;
}

const MissionCard = ({ id, title, category, duration, level, index }: MissionCardProps) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(`/mission/${id}`)}
      className="w-full card-glow bg-card rounded-2xl p-4 text-left transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] animate-slide-up border border-border/50"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-foreground mb-1.5">{title}</h3>
          <div className="flex items-center gap-3 text-muted-foreground text-sm">
            <span className="pill-badge">{category}</span>
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{duration}</span>
            </div>
            <span className="text-primary font-medium">{level}</span>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-muted-foreground" />
      </div>
    </button>
  );
};

export default MissionCard;
