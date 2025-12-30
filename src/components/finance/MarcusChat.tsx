import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const MARCUS_INTRO = `I'm Marcus, your Finance Coach. I'm direct and analytical—I don't sugarcoat numbers. Let's talk about your spending patterns, budget optimization, or investment strategies. What's on your mind?`;

export function MarcusChat() {
  const [messages, setMessages] = useState<Message[]>([
    { id: "intro", role: "assistant", content: MARCUS_INTRO }
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

    // Mock response - will be replaced with actual AI integration
    setTimeout(() => {
      const responses = [
        "Looking at your spending patterns, I see room for optimization. Let's break down your categories and identify where you can cut without impacting your quality of life.",
        "Here's the hard truth: if you're not tracking every naira, you're leaving money on the table. Let me help you set up a proper system.",
        "Your investment allocation looks conservative. Given your age and goals, we might want to discuss increasing your equity exposure. What's your risk tolerance?",
        "Budget discipline is non-negotiable. Let's set up automatic transfers to your savings before you even see the money. That's how you build wealth.",
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
      <div className="flex items-center gap-3 p-4 border-b border-border/50 bg-finance/5">
        <div className="w-10 h-10 rounded-full bg-finance/20 flex items-center justify-center">
          <TrendingUp className="w-5 h-5 text-finance" />
        </div>
        <div>
          <h3 className="font-medium flex items-center gap-2">
            Marcus
            <Sparkles className="w-3 h-3 text-finance" />
          </h3>
          <p className="text-xs text-muted-foreground">Finance Coach · Direct & Analytical</p>
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
            placeholder="Ask Marcus about finances..."
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
