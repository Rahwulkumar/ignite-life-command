import { cn } from "@/lib/utils";
import { Sparkles, ArrowRight } from "lucide-react";

interface Insight {
  agent: string;
  agentColor: string;
  message: string;
  type: "challenge" | "observation" | "lesson";
}

const insights: Insight[] = [
  {
    agent: "Nova",
    agentColor: "bg-tech",
    message: "You've been studying arrays for 3 days but haven't touched trees. Are you avoiding them because they're harder, or do you have a plan?",
    type: "challenge",
  },
  {
    agent: "Marcus",
    agentColor: "bg-finance",
    message: "Your dining out spending increased 40% this week. That's ₦24,000 that could have gone to your emergency fund.",
    type: "observation",
  },
  {
    agent: "Atlas",
    agentColor: "bg-trading",
    message: "Pattern detected: You tend to sell positions on red days. Let's examine whether this is strategy or emotion.",
    type: "challenge",
  },
  {
    agent: "Aria",
    agentColor: "bg-music",
    message: "3 days without practice. Your chord transitions were just getting cleaner. Momentum matters more than motivation.",
    type: "challenge",
  },
];

const typeStyles = {
  challenge: "border-l-destructive/50",
  observation: "border-l-trading/50",
  lesson: "border-l-tech/50",
};

export function AgentInsights() {
  return (
    <div className="glass rounded-xl p-5 opacity-0 animate-fade-in" style={{ animationDelay: "200ms" }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <h3 className="font-display font-semibold text-lg">Agent Insights</h3>
        </div>
        <button className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
          View all
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      <div className="space-y-3">
        {insights.map((insight, index) => (
          <div
            key={index}
            className={cn(
              "bg-muted/50 rounded-lg p-4 border-l-2 hover:bg-muted/80 transition-colors cursor-pointer",
              typeStyles[insight.type]
            )}
          >
            <div className="flex items-center gap-2 mb-2">
              <div
                className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-background",
                  insight.agentColor
                )}
              >
                {insight.agent[0]}
              </div>
              <span className="text-sm font-medium text-foreground">{insight.agent}</span>
              <span className="text-xs text-muted-foreground capitalize px-2 py-0.5 bg-muted rounded">
                {insight.type}
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {insight.message}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
