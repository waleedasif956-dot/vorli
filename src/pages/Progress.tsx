import { useNavigate } from "react-router-dom";
import { Rocket, Mic, BarChart3, Flame, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import BottomNavigation from "@/components/BottomNavigation";
import { LineChart, Line, XAxis, ResponsiveContainer } from "recharts";

const chartData = [
  { week: "Week 1", progress: 8 },
  { week: "Week 2", progress: 15 },
  { week: "Week 3", progress: 25 },
  { week: "Week 4", progress: 42 },
];

const stats = [
  { 
    label: "Missions", 
    value: "326", 
    icon: Rocket, 
    gradient: "from-blue-500 via-cyan-400 to-teal-400"
  },
  { 
    label: "Minutes spoken", 
    value: "124", 
    icon: Mic, 
    gradient: "from-cyan-400 via-teal-400 to-emerald-400"
  },
  { 
    label: "Pronunciation", 
    value: "82%", 
    icon: BarChart3, 
    gradient: "from-purple-500 via-violet-500 to-fuchsia-500"
  },
  { 
    label: "Streak", 
    value: "12 days", 
    icon: Flame, 
    gradient: "from-violet-500 via-purple-500 to-pink-500"
  },
];

const Progress = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-background pb-28">
      <div className="max-w-md mx-auto px-4 pt-10">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-foreground">Your progress</h1>
        </div>

        {/* Chart */}
        <div className="mb-8 animate-scale-in h-52 relative">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <XAxis 
                dataKey="week" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                dy={10}
              />
              <defs>
                <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="hsl(217 91% 60%)" />
                  <stop offset="50%" stopColor="hsl(191 91% 43%)" />
                  <stop offset="100%" stopColor="hsl(191 91% 60%)" />
                </linearGradient>
                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              <Line
                type="monotone"
                dataKey="progress"
                stroke="url(#lineGradient)"
                strokeWidth={3}
                dot={{ 
                  fill: 'hsl(191 91% 50%)', 
                  strokeWidth: 0, 
                  r: 6,
                  filter: 'url(#glow)'
                }}
                activeDot={{ 
                  r: 8, 
                  fill: 'hsl(191 91% 60%)', 
                  stroke: 'hsl(var(--background))', 
                  strokeWidth: 3,
                  filter: 'url(#glow)'
                }}
                filter="url(#glow)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Stats Grid - Gradient Cards */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className={`relative overflow-hidden rounded-2xl p-4 bg-gradient-to-br ${stat.gradient} animate-slide-up`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-3xl font-bold text-white">{stat.value}</span>
                    <p className="text-sm text-white/80 mt-1">{stat.label}</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-black/20 flex items-center justify-center backdrop-blur-sm">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <Button
          onClick={() => navigate("/missions")}
          className="w-full h-14 text-base font-semibold rounded-2xl glow-effect animate-fade-in bg-primary hover:bg-primary/90"
          style={{ animationDelay: "400ms" }}
        >
          Get your plan for next week
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Progress;
