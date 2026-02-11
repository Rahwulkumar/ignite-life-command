import { LineChart } from "lucide-react";
import { AgentChat } from "@/components/shared/AgentChat";

const NOVA_INTRO = `I'm Nova, your Trading Mentor. I'm skeptical by nature and pattern-focused. Before we discuss any trade, I want to know: What's your thesis? What's your exit strategy? Show me the pattern, and I'll help you find the edge.`;

const MOCK_RESPONSES = [
  "Interesting setup, but I'm not convinced yet. What's your risk/reward here? Show me where you'd cut your losses.",
  "I see the pattern you're referencing, but volume doesn't confirm. Wait for a volume spike before entry—that's how you avoid fake breakouts.",
  "Your position sizing concerns me. With that volatility, you should be at half that size. Protect your capital first, profits second.",
  "The macro environment doesn't support this thesis. Fed's still hawkish, and that sector typically underperforms in this regime. What am I missing?",
];

export function NovaChat() {
  return (
    <AgentChat
      agentName="Nova"
      agentDescription="Trading Mentor · Skeptical & Pattern-Focused"
      icon={LineChart}
      domainColor="trading"
      introMessage={NOVA_INTRO}
      placeholder="Discuss your trade thesis with Nova..."
      mockResponses={MOCK_RESPONSES}
    />
  );
}
