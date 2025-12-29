import { Button } from "@/components/ui/button";
import {
  DollarSign,
  TrendingUp,
  Code,
  BookOpen,
  Music,
  Video,
  Timer,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";

const actions = [
  { icon: DollarSign, label: "Expense", color: "finance" },
  { icon: TrendingUp, label: "Trade", color: "trading" },
  { icon: Code, label: "Study", color: "tech" },
  { icon: BookOpen, label: "Bible", color: "spiritual" },
  { icon: Music, label: "Practice", color: "music" },
  { icon: Video, label: "Content", color: "content" },
  { icon: Timer, label: "Timer", color: "work" },
  { icon: Plus, label: "More", color: "default" },
];

const colorStyles: Record<string, { bg: string; text: string; hover: string }> = {
  finance: { bg: "bg-finance/10", text: "text-finance", hover: "hover:bg-finance/20" },
  trading: { bg: "bg-trading/10", text: "text-trading", hover: "hover:bg-trading/20" },
  tech: { bg: "bg-tech/10", text: "text-tech", hover: "hover:bg-tech/20" },
  spiritual: { bg: "bg-spiritual/10", text: "text-spiritual", hover: "hover:bg-spiritual/20" },
  music: { bg: "bg-music/10", text: "text-music", hover: "hover:bg-music/20" },
  content: { bg: "bg-content/10", text: "text-content", hover: "hover:bg-content/20" },
  work: { bg: "bg-work/10", text: "text-work", hover: "hover:bg-work/20" },
  default: { bg: "bg-muted", text: "text-foreground", hover: "hover:bg-muted/80" },
};

export function QuickActions() {
  return (
    <div className="glass-sharp rounded-xl p-6 opacity-0 animate-fade-in" style={{ animationDelay: "100ms" }}>
      <h3 className="font-display text-xl italic text-foreground mb-4">Quick Actions</h3>
      <div className="grid grid-cols-4 gap-2">
        {actions.map((action, index) => {
          const style = colorStyles[action.color];
          return (
            <button
              key={index}
              className={cn(
                "flex flex-col items-center justify-center gap-2 p-3 rounded-lg transition-all duration-300 group",
                style.bg,
                style.hover
              )}
            >
              <action.icon className={cn("w-5 h-5 transition-transform group-hover:scale-110", style.text)} />
              <span className="text-[10px] font-medium text-muted-foreground group-hover:text-foreground uppercase tracking-wider">
                {action.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
