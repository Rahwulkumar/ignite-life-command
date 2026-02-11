import { TrendingUp } from "lucide-react";
import { AgentChat } from "@/components/shared/AgentChat";

const MARCUS_INTRO = `I'm Marcus, your Finance Coach. I'm direct and analytical—I don't sugarcoat numbers. Let's talk about your spending patterns, budget optimization, or investment strategies. What's on your mind?`;

const MOCK_RESPONSES = [
  "Looking at your spending patterns, I see room for optimization. Let's break down your categories and identify where you can cut without impacting your quality of life.",
  "Here's the hard truth: if you're not tracking every naira, you're leaving money on the table. Let me help you set up a proper system.",
  "Your investment allocation looks conservative. Given your age and goals, we might want to discuss increasing your equity exposure. What's your risk tolerance?",
  "Budget discipline is non-negotiable. Let's set up automatic transfers to your savings before you even see the money. That's how you build wealth.",
];

export function MarcusChat() {
  return (
    <AgentChat
      agentName="Marcus"
      agentDescription="Finance Coach · Direct & Analytical"
      icon={TrendingUp}
      domainColor="finance"
      introMessage={MARCUS_INTRO}
      placeholder="Ask Marcus about finances..."
      mockResponses={MOCK_RESPONSES}
    />
  );
}
