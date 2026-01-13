import { TrendingUp, Target, Clock, Mic, Flame, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import BottomNavigation from "@/components/BottomNavigation";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

const chartData = [
  { week: "Week 1", progress: 20 },
  { week: "Week 2", progress: 45 },
  { week: "Week 3", progress: 65 },
  { week: "Week 4", progress: 85 },
];

const stats = [
  { label: "Missions", value: "326", icon: Target, color: "text-primary" },
  { label: "Minutes spoken", value: "124", icon: Clock, color: "text-secondary" },
  { label: "Pronunciation", value: "82%", icon: Mic, color: "text-accent" },
  { label: "Day Streak", value: "12", icon: Flame, color: "text-destructive" },
];

const Progress = () => {
  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-md mx-auto px-4 pt-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            <span className="text-primary font-medium text-sm">Analytics</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">Your Progress</h1>
        </div>

        {/* Chart */}
        <div className="card-glow bg-card rounded-2xl p-4 mb-6 animate-scale-in border border-border/50">
          <h2 className="text-sm font-medium text-muted-foreground mb-4">Weekly Progress</h2>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis 
                  dataKey="week" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                />
                <YAxis hide />
                <Tooltip
                  contentStyle={{
                    background: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '12px',
                    boxShadow: '0 4px 24px -4px rgba(0,0,0,0.5)',
                  }}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <defs>
                  <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="hsl(191 91% 43%)" />
                    <stop offset="50%" stopColor="hsl(217 91% 60%)" />
                    <stop offset="100%" stopColor="hsl(263 70% 58%)" />
                  </linearGradient>
                </defs>
                <Line
                  type="monotone"
                  dataKey="progress"
                  stroke="url(#lineGradient)"
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--primary))', strokeWidth: 0, r: 4 }}
                  activeDot={{ r: 6, fill: 'hsl(var(--primary))', stroke: 'hsl(var(--background))', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="stat-card animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Icon className={`w-4 h-4 ${stat.color}`} />
                  <span className="text-xs text-muted-foreground">{stat.label}</span>
                </div>
                <span className="text-2xl font-bold text-foreground">{stat.value}</span>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <Button
          className="w-full h-14 text-lg font-semibold rounded-2xl glow-effect animate-fade-in"
          style={{ background: "var(--gradient-primary)", animationDelay: "400ms" }}
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
