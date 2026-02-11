import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, Loader2, LucideIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { DomainId, DOMAIN_COLORS } from "@/lib/domain-colors";

interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
}

interface AgentChatProps {
    /** Agent display name */
    agentName: string;
    /** Short description (e.g., "Finance Coach · Direct & Analytical") */
    agentDescription: string;
    /** Agent icon component */
    icon: LucideIcon;
    /** Domain color theme */
    domainColor: DomainId;
    /** Initial greeting message */
    introMessage: string;
    /** Input placeholder text */
    placeholder: string;
    /** Optional suggestion prompts */
    suggestions?: string[];
    /** Optional async message handler - if not provided, uses mock responses */
    onSendMessage?: (message: string) => Promise<string>;
    /** Optional mock responses for demo mode */
    mockResponses?: string[];
    /** Optional height class (default: h-[500px]) */
    height?: string;
}

export function AgentChat({
    agentName,
    agentDescription,
    icon: Icon,
    domainColor,
    introMessage,
    placeholder,
    suggestions = [],
    onSendMessage,
    mockResponses = [],
    height = "h-[500px]",
}: AgentChatProps) {
    const [messages, setMessages] = useState<Message[]>([
        { id: "intro", role: "assistant", content: introMessage }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const colors = DOMAIN_COLORS[domainColor];

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

        try {
            let response: string;

            if (onSendMessage) {
                response = await onSendMessage(userMessage.content);
            } else {
                // Mock response mode
                await new Promise(resolve => setTimeout(resolve, 1000));
                response = mockResponses.length > 0
                    ? mockResponses[Math.floor(Math.random() * mockResponses.length)]
                    : `Thanks for your message! I'm ${agentName}, and I'm here to help.`;
            }

            setMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: response
            }]);
        } catch (error) {
            setMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: "Sorry, I encountered an error. Please try again."
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSuggestionClick = (suggestion: string) => {
        setInput(suggestion);
    };

    const showSuggestions = messages.length === 1 && suggestions.length > 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={cn(
                "relative flex flex-col rounded-xl bg-card border border-border/50 overflow-hidden",
                height
            )}
        >
            {/* Ambient background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className={cn("absolute top-0 left-1/4 w-64 h-64 rounded-full blur-3xl", colors.bgSubtle)} />
                <div className={cn("absolute bottom-0 right-1/4 w-48 h-48 rounded-full blur-3xl opacity-50", colors.bgSubtle)} />
            </div>

            {/* Header */}
            <div className={cn("relative px-4 py-3 border-b border-border/50", colors.bgSubtle)}>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className={cn("p-2 rounded-lg bg-gradient-to-br", colors.gradient)}>
                            <Icon className={cn("w-5 h-5", colors.text)} />
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-card" />
                    </div>
                    <div>
                        <h3 className="font-medium flex items-center gap-2">
                            {agentName}
                            <Sparkles className={cn("w-3 h-3", colors.text)} />
                        </h3>
                        <p className="text-xs text-muted-foreground">{agentDescription}</p>
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {showSuggestions ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                        <div className={cn("p-4 rounded-full mb-4", colors.bgSubtle)}>
                            <Icon className={cn("w-8 h-8", colors.text)} />
                        </div>
                        <h4 className="font-medium mb-2">Ask {agentName} Anything</h4>
                        <p className="text-sm text-muted-foreground mb-6 max-w-xs">
                            {introMessage.slice(0, 100)}...
                        </p>
                        <div className="flex flex-wrap gap-2 justify-center">
                            {suggestions.map((suggestion) => (
                                <button
                                    key={suggestion}
                                    onClick={() => handleSuggestionClick(suggestion)}
                                    className={cn(
                                        "px-3 py-1.5 text-xs rounded-full bg-muted transition-colors",
                                        `hover:${colors.bgSubtle} hover:${colors.text}`
                                    )}
                                >
                                    {suggestion}
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <AnimatePresence initial={false}>
                        {messages.map((msg) => (
                            <motion.div
                                key={msg.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}
                            >
                                <div
                                    className={cn(
                                        "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm",
                                        msg.role === "user"
                                            ? `${colors.bg} text-white rounded-br-sm`
                                            : "bg-muted/50 border border-border/50 rounded-bl-sm"
                                    )}
                                >
                                    <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
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
                        <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-muted/50 border border-border/50 rounded-bl-sm">
                            <Loader2 className={cn("w-4 h-4 animate-spin", colors.text)} />
                            <span className="text-sm text-muted-foreground">{agentName} is thinking...</span>
                        </div>
                    </motion.div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="relative p-4 border-t border-border/50">
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
                        placeholder={placeholder}
                        className="min-h-[44px] max-h-[120px] resize-none"
                        rows={1}
                    />
                    <Button
                        onClick={handleSend}
                        disabled={!input.trim() || isLoading}
                        size="icon"
                        className={cn("shrink-0", colors.bg, "hover:opacity-90")}
                    >
                        <Send className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </motion.div>
    );
}
