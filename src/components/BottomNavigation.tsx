import { Home, CheckCircle, User, Camera, BarChart2 } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const navItems = [
  { icon: Home, label: "Home", path: "/" },
  { icon: CheckCircle, label: "Missions", path: "/missions" },
  { icon: User, label: "Tutor", path: "/tutor" },
  { icon: Camera, label: "Camera", path: "/camera" },
  { icon: BarChart2, label: "Progress", path: "/progress" },
];

const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/90 backdrop-blur-xl border-t border-border/50 safe-bottom">
      <div className="flex items-center justify-around px-4 py-3 max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-1 transition-all duration-200 ${
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon 
                className={`w-6 h-6 transition-all duration-200 ${isActive ? "drop-shadow-[0_0_8px_hsl(191_91%_43%/0.8)]" : ""}`} 
                strokeWidth={isActive ? 2.5 : 1.5} 
              />
              <span className={`text-[10px] font-medium ${isActive ? "text-primary" : ""}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;
