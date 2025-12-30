import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface SageChatProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export const SageChat = ({ messages, onSendMessage, isLoading }: SageChatProps) => {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const suggestions = [
    "Explain Romans 8:28 in context",
    "How do I build a prayer habit?",
    "Map Paul's missionary journeys",
    "What is the significance of Passover?",
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="relative flex flex-col h-[500px] rounded-xl bg-card border border-border/50 overflow-hidden"
    >
      {/* Ambient background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-spiritual/5 rounded-full blur-3xl animate-breathe" />
        <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-spiritual/5 rounded-full blur-3xl animate-breathe" style={{ animationDelay: "2s" }} />
      </div>

      {/* Header */}
      <div className="relative px-6 py-4 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="p-2 rounded-lg bg-gradient-to-br from-spiritual/20 to-spiritual/5">
              <Sparkles className="w-5 h-5 text-spiritual" />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-finance rounded-full border-2 border-card" />
          </div>
          <div>
            <h3 className="font-medium">Sage</h3>
            <p className="text-xs text-muted-foreground">Spiritual Guide • Online</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="p-4 rounded-full bg-spiritual/10 mb-4">
              <Sparkles className="w-8 h-8 text-spiritual animate-pulse-soft" />
            </div>
            <h4 className="font-medium mb-2">Ask Sage Anything</h4>
            <p className="text-sm text-muted-foreground mb-6 max-w-xs">
              Get deeper understanding of Scripture, theological concepts, and spiritual guidance
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => onSendMessage(suggestion)}
                  className="px-3 py-1.5 text-xs rounded-full bg-muted hover:bg-spiritual/10 hover:text-spiritual transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                    message.role === "user"
                      ? "bg-spiritual text-white rounded-br-md"
                      : "bg-muted/50 border border-border/50 rounded-bl-md"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}

        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-muted/50 border border-border/50 rounded-bl-md">
              <Loader2 className="w-4 h-4 animate-spin text-spiritual" />
              <span className="text-sm text-muted-foreground">Sage is thinking...</span>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="relative px-4 py-3 border-t border-border/50">
        <div className="flex items-end gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about Scripture, theology, or spiritual growth..."
            className="flex-1 resize-none bg-muted/50 border border-border/50 rounded-xl px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-spiritual/50 min-h-[44px] max-h-[120px]"
            rows={1}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-3 rounded-xl bg-spiritual text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-spiritual/90 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </motion.div>
  );
};
