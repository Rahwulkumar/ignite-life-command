import { cn } from "@/lib/utils";
import { LucideIcon, ArrowUpRight, TrendingUp, TrendingDown } from "lucide-react";

interface DomainCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  stats: { label: string; value: string }[];
  color: "finance" | "trading" | "tech" | "spiritual" | "music" | "content" | "work";
  progress?: number;
  trend?: "up" | "down" | "neutral";
  delay?: number;
  size?: "default" | "large" | "tall";
}

const colorConfig = {
  finance: {
    text: "text-finance",
    bg: "bg-finance",
    bgSubtle: "bg-finance/10",
    border: "border-finance/30",
    glow: "glow-finance",
  },
  trading: {
    text: "text-trading",
    bg: "bg-trading",
    bgSubtle: "bg-trading/10",
    border: "border-trading/30",
    glow: "glow-trading",
  },
  tech: {
    text: "text-tech",
    bg: "bg-tech",
    bgSubtle: "bg-tech/10",
    border: "border-tech/30",
    glow: "glow-tech",
  },
  spiritual: {
    text: "text-spiritual",
    bg: "bg-spiritual",
    bgSubtle: "bg-spiritual/10",
    border: "border-spiritual/30",
    glow: "glow-spiritual",
  },
  music: {
    text: "text-music",
    bg: "bg-music",
    bgSubtle: "bg-music/10",
    border: "border-music/30",
    glow: "glow-music",
  },
  content: {
    text: "text-content",
    bg: "bg-content",
    bgSubtle: "bg-content/10",
    border: "border-content/30",
    glow: "glow-content",
  },
  work: {
    text: "text-work",
    bg: "bg-work",
    bgSubtle: "bg-work/10",
    border: "border-work/30",
    glow: "glow-work",
  },
};

export function DomainCard({
  icon: Icon,
  title,
  description,
  stats,
  color,
  progress,
  trend = "neutral",
  delay = 0,
  size = "default",
}: DomainCardProps) {
  const config = colorConfig[color];

  return (
    <div
      className={cn(
        "relative group cursor-pointer opacity-0 animate-fade-in",
        "glass-sharp rounded-xl p-6 transition-all duration-500",
        "hover:bg-card-elevated/80 hover-lift",
        size === "large" && "col-span-2",
        size === "tall" && "row-span-2"
      )}
      style={{ 
        animationDelay: `${delay}ms`,
        borderLeftColor: `hsl(var(--${color}))`,
      }}
    >
      {/* Hover Glow Effect */}
      <div 
        className={cn(
          "absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10",
          config.glow
        )}
      />

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div
          className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300",
            config.bgSubtle,
            "group-hover:scale-110"
          )}
        >
          <Icon className={cn("w-6 h-6", config.text)} />
        </div>
        
        {/* Progress Ring or Trend */}
        {progress !== undefined ? (
          <div className="relative w-14 h-14">
            <svg className="w-14 h-14 -rotate-90">
              <circle
                cx="28"
                cy="28"
                r="24"
                fill="none"
                stroke="hsl(var(--muted))"
                strokeWidth="3"
              />
              <circle
                cx="28"
                cy="28"
                r="24"
                fill="none"
                stroke={`hsl(var(--${color}))`}
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={`${progress * 1.51} 151`}
                className="transition-all duration-1000"
              />
            </svg>
            <span className={cn("absolute inset-0 flex items-center justify-center font-mono text-sm font-semibold", config.text)}>
              {progress}%
            </span>
          </div>
        ) : (
          <ArrowUpRight className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
        )}
      </div>

      {/* Title & Description */}
      <h3 className="font-display text-2xl italic text-foreground mb-1">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground mb-6 line-clamp-2">{description}</p>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="space-y-1">
            <p className="data-label">{stat.label}</p>
            <div className="flex items-center gap-2">
              <p className="font-mono text-xl font-semibold text-foreground">{stat.value}</p>
              {index === 0 && trend !== "neutral" && (
                trend === "up" ? (
                  <TrendingUp className="w-4 h-4 text-finance" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-destructive" />
                )
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Accent Line */}
      <div 
        className={cn(
          "absolute bottom-0 left-6 right-6 h-[2px] rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500",
          config.bg
        )}
      />
    </div>
  );
}
