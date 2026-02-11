import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Send, Sparkles, Mic } from "lucide-react";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  agent?: string;
  agentColor?: string;
  timestamp: Date;
}

interface AgentConfig {
  name: string;
  role: string;
  color: string;
}

interface ChatInterfaceProps {
  initialMessages?: ChatMessage[];
  agent: AgentConfig;
  onSendMessage?: (message: string) => void;
}

export function ChatInterface({
  initialMessages = [],
  agent,
  onSendMessage
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    onSendMessage?.(input);
    setInput("");
  };

  return (
    <div className="glass rounded-xl flex flex-col h-[500px]">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-border">
        <div className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-background",
          agent.color
        )}>
          {agent.name[0]}
        </div>
        <div>
          <h3 className="font-display font-semibold">{agent.name}</h3>
          <p className="text-xs text-muted-foreground">{agent.role}</p>
        </div>
        <div className="ml-auto flex items-center gap-1" style={{ color: `var(--${agent.color.replace('bg-', '')})` }}>
          <span className={cn("w-2 h-2 rounded-full animate-pulse", agent.color)} />
          <span className="text-xs">Active</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length > 0 ? (
          messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-3",
                message.role === "user" && "flex-row-reverse"
              )}
            >
              {message.role === "assistant" && (
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-background flex-shrink-0",
                    message.agentColor || agent.color
                  )}
                >
                  {message.agent?.[0] || agent.name[0]}
                </div>
              )}
              <div
                className={cn(
                  "max-w-[75%] rounded-xl p-3",
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                )}
              >
                <p className="text-sm leading-relaxed">{message.content}</p>
                <span className="text-[10px] opacity-60 mt-1 block">
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="flex-1 flex items-center justify-center h-full">
            <p className="text-sm text-muted-foreground">Start a conversation with {agent.name}</p>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Share what you've learned or ask a question..."
              className="w-full bg-muted rounded-xl px-4 py-3 pr-20 text-sm outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Mic className="w-4 h-4 text-muted-foreground" />
              </Button>
              <Button
                onClick={handleSend}
                size="icon"
                className="h-8 w-8"
                disabled={!input.trim()}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <Sparkles className="w-3 h-3 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">
            {agent.name} is analyzing your learning patterns for personalized insights
          </span>
        </div>
      </div>
    </div>
  );
}
