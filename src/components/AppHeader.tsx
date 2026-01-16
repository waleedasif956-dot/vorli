import { useNavigate } from "react-router-dom";
import { ArrowLeft, Settings } from "lucide-react";

interface AppHeaderProps {
  title?: string;
  showBack?: boolean;
  showAvatar?: boolean;
  showSettings?: boolean;
  onBack?: () => void;
}

const AppHeader = ({
  title = "For You to Learn",
  showBack = false,
  showAvatar = true,
  showSettings = false,
  onBack,
}: AppHeaderProps) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="relative mb-6 animate-fade-in">
      {/* Subtle glow behind header */}
      <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-64 h-32 bg-primary/20 blur-3xl rounded-full pointer-events-none" />

      {/* Header content */}
      <div className="relative flex items-center justify-between">
        {/* Left: Logo or Back button */}
        {showBack ? (
          <button
            onClick={handleBack}
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-muted/50 border border-border/50 backdrop-blur-sm text-primary hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        ) : (
          <div className="relative flex items-center justify-center w-10 h-10">
            {/* Logo glow */}
            <div className="absolute inset-0 bg-primary/30 blur-lg rounded-full" />
            <span className="relative text-3xl font-black gradient-text tracking-tight">V</span>
          </div>
        )}

        {/* Center: Title - positioned absolutely for true centering */}
        <h1 className="absolute left-1/2 -translate-x-1/2 text-lg font-semibold gradient-text text-center whitespace-nowrap">
          {title}
        </h1>

        {/* Right: Prototype badge + Avatar or Settings */}
        <div className="flex items-center gap-2">
          {/* Prototype badge */}
          <span className="text-[9px] font-medium text-muted-foreground/60 uppercase tracking-wide px-1.5 py-0.5 rounded bg-muted/40 border border-border/30">
            Prototype
          </span>
          
          {showSettings ? (
            <button className="flex items-center justify-center w-10 h-10 rounded-xl bg-muted/50 border border-border/50 backdrop-blur-sm text-primary hover:bg-muted transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          ) : showAvatar ? (
            <div className="relative group">
              {/* Avatar glow ring */}
              <div className="absolute -inset-0.5 rounded-full opacity-60 group-hover:opacity-100 transition-opacity" style={{ background: "var(--gradient-primary)" }} />
              <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-muted to-card flex items-center justify-center border border-border/30 overflow-hidden">
                <span className="text-lg">👤</span>
              </div>
            </div>
          ) : (
            <div className="w-10" />
          )}
        </div>
      </div>
    </div>
  );
};

export default AppHeader;
