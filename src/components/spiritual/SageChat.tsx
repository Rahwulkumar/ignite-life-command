import { BookOpen } from "lucide-react";
import { AgentChat } from "@/components/shared/AgentChat";

const SAGE_INTRO = `Grace and peace to you. I am Sage, your Spiritual Guide. I can help you deepen your understanding of Scripture, explore theological concepts, or provide biblical wisdom for your daily walk. What is on your heart today?`;

const MOCK_RESPONSES = [
  "In Romans 8:28, Paul isn't saying everything is 'good' in itself, but that God orchestrates all things—even suffering—towards the ultimate good of conformity to Christ.",
  "To build a consistent prayer habit, start small. Daniel prayed three times a day, but key was his consistency. Try 5 minutes each morning before checking your phone.",
  "The Fruit of the Spirit in Galatians 5 is singular 'fruit', not 'fruits'. It's a singular package deal of character that the Holy Spirit produces in us.",
  "Lectio Divina is a beautiful way to read Scripture. It involves four steps: Reading (Lectio), Meditation (Meditatio), Prayer (Oratio), and Contemplation (Contemplatio).",
];

const SUGGESTIONS = [
  "Explain Romans 8:28 in context",
  "How do I build a prayer habit?",
  "Map Paul's missionary journeys",
  "What is the significance of Passover?",
];

export function SageChat() {
  return (
    <AgentChat
      agentName="Sage"
      agentDescription="Spiritual Guide · Wise & Pastoral"
      icon={BookOpen}
      domainColor="spiritual"
      introMessage={SAGE_INTRO}
      placeholder="Ask about Scripture, theology, or spiritual growth..."
      suggestions={SUGGESTIONS}
      mockResponses={MOCK_RESPONSES}
    />
  );
}
