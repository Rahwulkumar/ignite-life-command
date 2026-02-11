import { Cpu } from "lucide-react";
import { AgentChat } from "@/components/shared/AgentChat";

const ATLAS_INTRO = `I'm Atlas, your Tech & Learning Coach. I don't believe in shortcuts—mastery requires rigorous practice. Whether it's DSA, system design, or AI engineering, I'll push you to understand the fundamentals before the frameworks. What are you working on?`;

const MOCK_RESPONSES = [
  "Before we jump to the solution, let's break down the problem. What's the brute force approach? Understanding that will help us optimize.",
  "Good instinct, but you're thinking about implementation before algorithm. Step back—what's the time complexity you're aiming for?",
  "That's a common pattern in system design. But consider: what happens at 10x scale? 100x? Your solution needs to account for failure modes.",
  "I want you to implement this from scratch first. Using libraries is fine in production, but you need to understand what's happening under the hood.",
];

export function AtlasChat() {
  return (
    <AgentChat
      agentName="Atlas"
      agentDescription="Tech Coach · Rigorous & Demanding"
      icon={Cpu}
      domainColor="tech"
      introMessage={ATLAS_INTRO}
      placeholder="Ask Atlas about DSA, system design, or AI..."
      mockResponses={MOCK_RESPONSES}
    />
  );
}
