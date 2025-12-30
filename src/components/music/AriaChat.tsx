import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const ARIA_INTRO = `I'm Aria, your Music Instructor. I'm exacting about technique—there are no shortcuts to musicianship. Whether you're working on scales, chord voicings, or learning a new piece, I'll help you build proper habits. What are you practicing?`;

export function AriaChat() {
  const [messages, setMessages] = useState<Message[]>([
    { id: "intro", role: "assistant", content: ARIA_INTRO }
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
        "Slow it down. If you can't play it perfectly at 60 BPM, you can't play it at 120. Speed is a byproduct of accuracy, not the other way around.",
        "Your fingering choice matters more than you think. Let's map out the most efficient way to play this passage—economy of motion is everything.",
        "Good practice isn't about hours—it's about focused repetition. Break that phrase into smaller chunks and nail each one before connecting them.",
        "I hear tension in how you describe your playing. Relaxation is fundamental. If your hand hurts, you're doing something wrong.",
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
      <div className="flex items-center gap-3 p-4 border-b border-border/50 bg-music/5">
        <div className="w-10 h-10 rounded-full bg-music/20 flex items-center justify-center">
          <Music className="w-5 h-5 text-music" />
        </div>
        <div>
          <h3 className="font-medium flex items-center gap-2">
            Aria
            <Sparkles className="w-3 h-3 text-music" />
          </h3>
          <p className="text-xs text-muted-foreground">Music Instructor · Exacting & Technique-Focused</p>
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
            placeholder="Ask Aria about technique, practice, or theory..."
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
