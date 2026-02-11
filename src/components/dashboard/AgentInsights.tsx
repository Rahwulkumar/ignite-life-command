import { cn } from "@/lib/utils";
import { Sparkles, ArrowRight, AlertTriangle, Lightbulb, Target, LucideIcon } from "lucide-react";
import { AgentInsight } from "@/types/domain";

interface AgentInsightsProps {
  insights: AgentInsight[];
  onViewAll?: () => void;
}

const typeConfig: Record<string, { icon: LucideIcon; color: string; bg: string }> = {
  challenge: { icon: AlertTriangle, color: "text-destructive", bg: "bg-destructive/10" },
  observation: { icon: Lightbulb, color: "text-trading", bg: "bg-trading/10" },
  lesson: { icon: Target, color: "text-tech", bg: "bg-tech/10" },
};

const agentColors: Record<string, string> = {
  tech: "bg-tech",
  finance: "bg-finance",
  trading: "bg-trading",
  spiritual: "bg-spiritual",
  music: "bg-music",
};

export function AgentInsights({ insights, onViewAll }: AgentInsightsProps) {
  return (
    <div className="glass-sharp rounded-xl p-6 opacity-0 animate-fade-in" style={{ animationDelay: "200ms" }}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-display text-xl italic text-foreground">Agent Insights</h3>
            <p className="text-xs text-muted-foreground">Real-time analysis</p>
          </div>
        </div>
        <button
          onClick={onViewAll}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 group"
        >
          View all
          <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <div className="space-y-4">
        {insights.map((insight, index) => {
          // Default to lesson type if not found
          const typeInfo = typeConfig[insight.action || "observation"] || typeConfig.observation;
          const TypeIcon = typeInfo.icon;

          return (
            <div
              key={index}
              className="group p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-all duration-300 cursor-pointer border-l-2"
              style={{ borderLeftColor: `hsl(var(--${insight.domain}))` }}
            >
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-primary-foreground flex-shrink-0",
                    agentColors[insight.domain] || "bg-primary"
                  )}
                >
                  {insight.agentName[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-foreground">{insight.agentName}</span>
                    <span className={cn(
                      "flex items-center gap-1 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full",
                      typeInfo.color,
                      typeInfo.bg
                    )}>
                      <TypeIcon className="w-3 h-3" />
                      {insight.action || "Insight"}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {insight.insight}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
