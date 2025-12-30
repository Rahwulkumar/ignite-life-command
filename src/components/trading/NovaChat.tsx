import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, LineChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const NOVA_INTRO = `I'm Nova, your Trading Mentor. I'm skeptical by nature and pattern-focused. Before we discuss any trade, I want to know: What's your thesis? What's your exit strategy? Show me the pattern, and I'll help you find the edge.`;

export function NovaChat() {
  const [messages, setMessages] = useState<Message[]>([
    { id: "intro", role: "assistant", content: NOVA_INTRO }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    setTimeout(() => {
      const responses = [
        "Interesting setup, but I'm not convinced yet. What's your risk/reward here? Show me where you'd cut your losses.",
        "I see the pattern you're referencing, but volume doesn't confirm. Wait for a volume spike before entry—that's how you avoid fake breakouts.",
        "Your position sizing concerns me. With that volatility, you should be at half that size. Protect your capital first, profits second.",
        "The macro environment doesn't support this thesis. Fed's still hawkish, and that sector typically underperforms in this regime. What am I missing?",
      ];
      
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: responses[Math.floor(Math.random() * responses.length)]
      }]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-[500px] border border-border/50 rounded-lg overflow-hidden bg-background">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-border/50 bg-trading/5">
        <div className="w-10 h-10 rounded-full bg-trading/20 flex items-center justify-center">
          <LineChart className="w-5 h-5 text-trading" />
        </div>
        <div>
          <h3 className="font-medium flex items-center gap-2">
            Nova
            <Sparkles className="w-3 h-3 text-trading" />
          </h3>
          <p className="text-xs text-muted-foreground">Trading Mentor · Skeptical & Pattern-Focused</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "flex",
              msg.role === "user" ? "justify-end" : "justify-start"
            )}
          >
            <div
              className={cn(
                "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm",
                msg.role === "user"
                  ? "bg-foreground text-background rounded-br-sm"
                  : "bg-muted rounded-bl-sm"
              )}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-muted rounded-2xl rounded-bl-sm px-4 py-2.5">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border/50">
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Discuss your trade thesis with Nova..."
            className="min-h-[44px] max-h-[120px] resize-none"
            rows={1}
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            size="icon"
            className="shrink-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
