import { useState, useRef, useEffect } from "react";
import { Send, LineChart, TrendingUp, TrendingDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { InvestmentChart } from "./InvestmentChart";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { env } from "@/lib/env";

interface Holding {
  id: string;
  name: string;
  symbol: string;
  type: "stock" | "mutual_fund" | "etf" | "bond" | "crypto";
  units: number;
  avgCost: number;
  currentPrice: number;
  returns: number;
  returnsPercent: number;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface InvestmentDetailSheetProps {
  holding: Holding | null;
  isOpen: boolean;
  onClose: () => void;
}

const CHAT_URL = `${env.SUPABASE_URL}/functions/v1/nova-chat`;

export function InvestmentDetailSheet({ holding, isOpen, onClose }: InvestmentDetailSheetProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (holding && isOpen) {
      setMessages([{
        id: "intro",
        role: "assistant",
        content: `I see you're looking at your ${holding.name} (${holding.symbol}) position. You're ${holding.returnsPercent >= 0 ? 'up' : 'down'} ${Math.abs(holding.returnsPercent)}%. What would you like to discuss—your thesis, exit strategy, or position sizing?`
      }]);
    }
  }, [holding, isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const streamChat = async (userMessages: Message[]) => {
    // Get user session for proper authentication
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      toast.error("Please sign in to continue");
      throw new Error("No active session");
    }

    const resp = await fetch(CHAT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`, // ✅ Use session token, not publishable key
      },
      body: JSON.stringify({
        messages: userMessages.map(m => ({ role: m.role, content: m.content })),
        investmentContext: holding
      }),
    });

    if (!resp.ok) {
      const error = await resp.json();
      if (resp.status === 429) {
        toast.error("Rate limit exceeded. Please wait a moment.");
      } else if (resp.status === 402) {
        toast.error("AI credits exhausted. Please add credits.");
      } else {
        toast.error(error.error || "Failed to get response");
      }
      throw new Error(error.error);
    }

    return resp;
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim()
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    let assistantContent = "";

    try {
      const resp = await streamChat(newMessages);
      if (!resp.body) throw new Error("No response body");

      const reader = resp.body.getReader();
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
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantContent += content;
              setMessages(prev => {
                const last = prev[prev.length - 1];
                if (last?.role === "assistant" && last.id !== "intro") {
                  return prev.map((m, i) =>
                    i === prev.length - 1 ? { ...m, content: assistantContent } : m
                  );
                }
                return [...prev, { id: Date.now().toString(), role: "assistant", content: assistantContent }];
              });
            }
          } catch {
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      toast.error("Failed to get AI response. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!holding) return null;

  const isPositive = holding.returns >= 0;
  const totalValue = holding.units * holding.currentPrice;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col p-0">
        <SheetHeader className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <SheetTitle className="text-left">{holding.symbol}</SheetTitle>
              <p className="text-sm text-muted-foreground">{holding.name}</p>
            </div>
            <div className="text-right">
              <p className="font-medium tabular-nums">${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
              <p className={cn("text-xs tabular-nums flex items-center gap-1 justify-end", isPositive ? "text-finance" : "text-destructive")}>
                {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {isPositive ? "+" : ""}{holding.returnsPercent}%
              </p>
            </div>
          </div>
        </SheetHeader>

        {/* Chart */}
        <div className="p-4 border-b border-border">
          <p className="text-xs text-muted-foreground mb-2">30 Day Performance</p>
          <InvestmentChart symbol={holding.symbol} isPositive={isPositive} />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 p-4 border-b border-border text-center">
          <div>
            <p className="text-xs text-muted-foreground">Units</p>
            <p className="font-medium tabular-nums">{holding.units}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Avg Cost</p>
            <p className="font-medium tabular-nums">${holding.avgCost.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Current</p>
            <p className="font-medium tabular-nums">${holding.currentPrice.toLocaleString()}</p>
          </div>
        </div>

        {/* Chat */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-muted/30">
            <LineChart className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Chat with Nova</span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg) => (
              <div key={msg.id} className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}>
                <div className={cn(
                  "max-w-[85%] rounded-2xl px-3 py-2 text-sm",
                  msg.role === "user" ? "bg-foreground text-background rounded-br-sm" : "bg-muted rounded-bl-sm"
                )}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && messages[messages.length - 1]?.role === "user" && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-2xl rounded-bl-sm px-3 py-2">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 border-t border-border">
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
                placeholder="Ask Nova about this investment..."
                className="min-h-[40px] max-h-[80px] resize-none text-sm"
                rows={1}
              />
              <Button onClick={handleSend} disabled={!input.trim() || isLoading} size="icon" className="shrink-0">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
