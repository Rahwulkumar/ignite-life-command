import { cn } from "@/lib/utils";
import {
  DollarSign,
  Code,
  BookOpen,
  Music,
  TrendingUp,
  Clock,
  LucideIcon
} from "lucide-react";
import { Activity } from "@/types/domain";

interface ActivityFeedProps {
  activities: Activity[];
}

const typeConfig: Record<string, { icon: LucideIcon; color: string; bg: string }> = {
  finance: { icon: DollarSign, color: "text-finance", bg: "bg-finance/10" },
  tech: { icon: Code, color: "text-tech", bg: "bg-tech/10" },
  spiritual: { icon: BookOpen, color: "text-spiritual", bg: "bg-spiritual/10" },
  music: { icon: Music, color: "text-music", bg: "bg-music/10" },
  trading: { icon: TrendingUp, color: "text-trading", bg: "bg-trading/10" },
};

export function ActivityFeed({ activities }: ActivityFeedProps) {
  return (
    <div className="glass rounded-xl p-5 opacity-0 animate-fade-in" style={{ animationDelay: "300ms" }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-semibold text-lg">Recent Activity</h3>
        <div className="flex items-center gap-1 text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span className="text-sm">Live</span>
        </div>
      </div>

      <div className="space-y-3">
        {activities.length > 0 ? (
          activities.map((activity, index) => {
            const config = typeConfig[activity.type] || typeConfig.tech;
            const Icon = config.icon;

            return (
              <div
                key={index}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <div
                  className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                    config.bg
                  )}
                >
                  <Icon className={cn("w-5 h-5", config.color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-foreground truncate">
                    {activity.title}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {activity.description}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground flex-shrink-0">
                  {activity.time}
                </span>
              </div>
            );
          })
        ) : (
          <div className="text-center py-8 text-muted-foreground text-sm">
            No recent activity
          </div>
        )}
      </div>
    </div>
  );
}
