import { Button } from "@/components/ui/button";
import {
  Plus,
  DollarSign,
  Clock,
  BookOpen,
  Music,
  Video,
  Code,
  TrendingUp,
} from "lucide-react";

const actions = [
  { icon: DollarSign, label: "Log Expense", color: "finance" as const },
  { icon: TrendingUp, label: "Log Trade", color: "trading" as const },
  { icon: Code, label: "Log Study", color: "tech" as const },
  { icon: BookOpen, label: "Bible Time", color: "spiritual" as const },
  { icon: Music, label: "Practice Session", color: "music" as const },
  { icon: Video, label: "Save Content", color: "content" as const },
  { icon: Clock, label: "Start Timer", color: "glass" as const },
  { icon: Plus, label: "Quick Add", color: "default" as const },
];

export function QuickActions() {
  return (
    <div className="glass rounded-xl p-5 opacity-0 animate-fade-in" style={{ animationDelay: "100ms" }}>
      <h3 className="font-display font-semibold text-lg mb-4">Quick Actions</h3>
      <div className="grid grid-cols-4 gap-2">
        {actions.map((action, index) => (
          <Button
            key={index}
            variant={action.color}
            size="sm"
            className="flex-col h-auto py-3 gap-1.5"
          >
            <action.icon className="w-4 h-4" />
            <span className="text-xs font-medium">{action.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
