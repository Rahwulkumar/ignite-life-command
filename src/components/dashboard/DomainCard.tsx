import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface DomainCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  stats: { label: string; value: string }[];
  color: "finance" | "trading" | "tech" | "spiritual" | "music" | "content" | "work";
  progress?: number;
  delay?: number;
}

const colorClasses = {
  finance: {
    bg: "bg-finance/10",
    border: "border-finance/20",
    text: "text-finance",
    glow: "glow-finance",
    progress: "bg-finance",
  },
  trading: {
    bg: "bg-trading/10",
    border: "border-trading/20",
    text: "text-trading",
    glow: "glow-trading",
    progress: "bg-trading",
  },
  tech: {
    bg: "bg-tech/10",
    border: "border-tech/20",
    text: "text-tech",
    glow: "glow-tech",
    progress: "bg-tech",
  },
  spiritual: {
    bg: "bg-spiritual/10",
    border: "border-spiritual/20",
    text: "text-spiritual",
    glow: "glow-spiritual",
    progress: "bg-spiritual",
  },
  music: {
    bg: "bg-music/10",
    border: "border-music/20",
    text: "text-music",
    glow: "glow-music",
    progress: "bg-music",
  },
  content: {
    bg: "bg-content/10",
    border: "border-content/20",
    text: "text-content",
    glow: "glow-content",
    progress: "bg-content",
  },
  work: {
    bg: "bg-work/10",
    border: "border-work/20",
    text: "text-work",
    glow: "glow-work",
    progress: "bg-work",
  },
};

export function DomainCard({
  icon: Icon,
  title,
  description,
  stats,
  color,
  progress,
  delay = 0,
}: DomainCardProps) {
  const colors = colorClasses[color];

  return (
    <div
      className={cn(
        "glass rounded-xl p-5 hover:bg-card-elevated/90 transition-all duration-300 cursor-pointer group opacity-0 animate-fade-in",
        colors.glow
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110",
            colors.bg,
            colors.border,
            "border"
          )}
        >
          <Icon className={cn("w-6 h-6", colors.text)} />
        </div>
        {progress !== undefined && (
          <div className="text-right">
            <span className={cn("text-2xl font-display font-bold", colors.text)}>
              {progress}%
            </span>
            <p className="text-xs text-muted-foreground">This week</p>
          </div>
        )}
      </div>

      <h3 className="font-display font-semibold text-lg text-foreground mb-1">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground mb-4">{description}</p>

      {progress !== undefined && (
        <div className="mb-4">
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className={cn("h-full rounded-full transition-all duration-500", colors.progress)}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat, index) => (
          <div key={index} className="bg-muted/50 rounded-lg p-2.5">
            <p className="text-xs text-muted-foreground mb-0.5">{stat.label}</p>
            <p className="font-display font-semibold text-foreground">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
