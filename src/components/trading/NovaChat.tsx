import { useCallback } from "react";
import { LineChart } from "lucide-react";
import { AgentChat } from "@/components/shared/AgentChat";
import { streamRequest } from "@/lib/api";

const NOVA_INTRO = `I'm Nova, your Trading Mentor. I'm skeptical by nature and pattern-focused. Before we discuss any trade, I want to know: What's your thesis? What's your exit strategy? Show me the pattern, and I'll help you find the edge.`;

export function NovaChat() {
  const onSendMessage = useCallback(async (content: string) => {
    let assistantContent = "";

    const response = await streamRequest("/api/ai/nova", {
      messages: [{ role: "user", content }],
    });

    if (!response.body) throw new Error("No response body from Nova");

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
          // Ignore incomplete chunks and keep reading.
        }
      }
    }

    return assistantContent;
  }, []);

  return (
    <AgentChat
      agentName="Nova"
      agentDescription="Trading Mentor - Skeptical & Pattern-Focused"
      icon={LineChart}
      domainColor="trading"
      introMessage={NOVA_INTRO}
      placeholder="Discuss your trade thesis with Nova..."
      onSendMessage={onSendMessage}
    />
  );
}
