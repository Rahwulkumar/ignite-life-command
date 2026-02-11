import { Music } from "lucide-react";
import { AgentChat } from "@/components/shared/AgentChat";

const ARIA_INTRO = `I'm Aria, your Music Instructor. I'm exacting about technique—there are no shortcuts to musicianship. Whether you're working on scales, chord voicings, or learning a new piece, I'll help you build proper habits. What are you practicing?`;

const MOCK_RESPONSES = [
  "Slow it down. If you can't play it perfectly at 60 BPM, you can't play it at 120. Speed is a byproduct of accuracy, not the other way around.",
  "Your fingering choice matters more than you think. Let's map out the most efficient way to play this passage—economy of motion is everything.",
  "Good practice isn't about hours—it's about focused repetition. Break that phrase into smaller chunks and nail each one before connecting them.",
  "I hear tension in how you describe your playing. Relaxation is fundamental. If your hand hurts, you're doing something wrong.",
];

export function AriaChat() {
  return (
    <AgentChat
      agentName="Aria"
      agentDescription="Music Instructor · Exacting & Technique-Focused"
      icon={Music}
      domainColor="music"
      introMessage={ARIA_INTRO}
      placeholder="Ask Aria about technique, practice, or theory..."
      mockResponses={MOCK_RESPONSES}
    />
  );
}
