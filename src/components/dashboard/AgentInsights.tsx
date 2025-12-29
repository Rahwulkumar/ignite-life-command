import { cn } from "@/lib/utils";
import { Sparkles, ArrowRight, AlertTriangle, Lightbulb, Target } from "lucide-react";

interface Insight {
  agent: string;
  agentColor: string;
  message: string;
  type: "challenge" | "observation" | "lesson";
}

const insights: Insight[] = [
  {
    agent: "Nova",
    agentColor: "tech",
    message: "You've been studying arrays for 3 days but haven't touched trees. Are you avoiding them because they're harder?",
    type: "challenge",
  },
  {
    agent: "Marcus",
    agentColor: "finance",
    message: "Dining out spending increased 40% this week. That's ₦24,000 diverted from your emergency fund.",
    type: "observation",
  },
  {
    agent: "Atlas",
    agentColor: "trading",
    message: "Pattern detected: You sell on red days. Is this strategy or emotion?",
    type: "challenge",
  },
];

const typeConfig = {
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

export function AgentInsights() {
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
        <button className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 group">
          View all
          <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <div className="space-y-4">
        {insights.map((insight, index) => {
          const TypeIcon = typeConfig[insight.type].icon;
          return (
            <div
              key={index}
              className="group p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-all duration-300 cursor-pointer border-l-2"
              style={{ borderLeftColor: `hsl(var(--${insight.agentColor}))` }}
            >
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-primary-foreground flex-shrink-0",
                    agentColors[insight.agentColor]
                  )}
                >
                  {insight.agent[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-foreground">{insight.agent}</span>
                    <span className={cn(
                      "flex items-center gap-1 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full",
                      typeConfig[insight.type].color,
                      typeConfig[insight.type].bg
                    )}>
                      <TypeIcon className="w-3 h-3" />
                      {insight.type}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {insight.message}
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
