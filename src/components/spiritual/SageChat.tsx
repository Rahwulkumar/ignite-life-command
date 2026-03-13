import { useCallback } from "react";
import { BookOpen } from "lucide-react";
import { AgentChat } from "@/components/shared/AgentChat";
import { streamRequest } from "@/lib/api";

const SAGE_INTRO = `Grace and peace to you. I am Sage, your Spiritual Guide. I can help you deepen your understanding of Scripture, explore theological concepts, or provide biblical wisdom for your daily walk. What is on your heart today?`;

const SUGGESTIONS = [
  "Explain Romans 8:28 in context",
  "How do I build a prayer habit?",
  "Map Paul's missionary journeys",
  "What is the significance of Passover?",
];

export function SageChat() {
  const onSendMessage = useCallback(async (content: string) => {
    let assistantContent = "";

    const response = await streamRequest("/api/ai/sage", {
      messages: [{ role: "user", content }],
    });

    if (!response.body) throw new Error("No response body from Sage");

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      let newlineIndex: number;
      while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
        let line = buffer.slice(0, newlineIndex);
        buffer = buffer.slice(newlineIndex + 1);
        if (line.endsWith("\r")) line = line.slice(0, -1);
        if (line.startsWith(":") || line.trim() === "") continue;
        if (!line.startsWith("data: ")) continue;
        const jsonStr = line.slice(6).trim();
        if (jsonStr === "[DONE]") continue;
        try {
          const parsed = JSON.parse(jsonStr);
          const delta = parsed.choices?.[0]?.delta?.content;
          if (delta) assistantContent += delta;
        } catch {
          /* incomplete chunk, ignore */
        }
      }
    }

    return assistantContent;
  }, []);

  return (
    <AgentChat
      agentName="Sage"
      agentDescription="Spiritual Guide · Wise & Pastoral"
      icon={BookOpen}
      domainColor="spiritual"
      introMessage={SAGE_INTRO}
      placeholder="Ask about Scripture, theology, or spiritual growth..."
      suggestions={SUGGESTIONS}
      onSendMessage={onSendMessage}
    />
  );
}
