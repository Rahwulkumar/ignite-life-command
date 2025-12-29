import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Send, Mic, Sparkles, Bot } from "lucide-react";

interface Agent {
  id: string;
  name: string;
  role: string;
  color: string;
  initial: string;
  specialty: string;
  style: string;
}

const agents: Agent[] = [
  {
    id: "marcus",
    name: "Marcus",
    role: "Finance Coach",
    color: "bg-finance",
    initial: "M",
    specialty: "Money management, budgeting, investments",
    style: "Direct and analytical. Cuts through financial delusions.",
  },
  {
    id: "atlas",
    name: "Atlas",
    role: "Trading Mentor",
    color: "bg-trading",
    initial: "A",
    specialty: "Trading patterns, market behavior, decision analysis",
    style: "Skeptical and pattern-focused. Exposes emotional trading.",
  },
  {
    id: "nova",
    name: "Nova",
    role: "Tech & Learning Coach",
    color: "bg-tech",
    initial: "N",
    specialty: "DSA, software development, AI engineering",
    style: "Rigorous and demanding. Pushes for deep understanding.",
  },
  {
    id: "sage",
    name: "Sage",
    role: "Spiritual Guide",
    color: "bg-spiritual",
    initial: "S",
    specialty: "Prayer, Bible study, spiritual growth",
    style: "Honest about commitment. Encourages genuine reflection.",
  },
  {
    id: "aria",
    name: "Aria",
    role: "Music Instructor",
    color: "bg-music",
    initial: "A",
    specialty: "Technique, practice habits, musical progress",
    style: "Exacting about technique. Highlights plateaus and pushes for deliberate practice.",
  },
];

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function ChatPage() {
  const [selectedAgent, setSelectedAgent] = useState<Agent>(agents[2]);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: `I'm ${selectedAgent.name}, your ${selectedAgent.role}. I specialize in ${selectedAgent.specialty}. My approach: ${selectedAgent.style}\n\nWhat would you like to work on today?`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput("");

    // Simulate agent response
    setTimeout(() => {
      const response: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: getAgentResponse(selectedAgent.id, input),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, response]);
    }, 1000);
  };

  const getAgentResponse = (agentId: string, userInput: string): string => {
    const responses: Record<string, string> = {
      marcus: `Let me be direct with you. You mentioned "${userInput.slice(0, 30)}..." - but have you actually tracked where every naira went this week? Most people think they know their spending, but the data often tells a different story. Show me the numbers.`,
      atlas: `Interesting. When you say "${userInput.slice(0, 30)}..." - I need you to separate the analysis from the emotion. What's the actual data telling you? What's your thesis, and more importantly, what would prove you wrong?`,
      nova: `You said "${userInput.slice(0, 30)}..." - but I need you to go deeper. Can you explain the underlying mechanism? If you can't articulate WHY something works, you're memorizing, not understanding. Walk me through your mental model step by step.`,
      sage: `I hear you saying "${userInput.slice(0, 30)}..." Let's pause and reflect honestly. Is this where your heart truly is, or are you going through motions? Authentic growth requires genuine confrontation with ourselves.`,
      aria: `"${userInput.slice(0, 30)}..." - that's a start. But I need specifics: What exact technique challenged you? How many times did you practice the difficult passage? Vague practice leads to vague results.`,
    };
    return responses[agentId] || "Tell me more about that.";
  };

  const handleAgentChange = (agent: Agent) => {
    setSelectedAgent(agent);
    setMessages([
      {
        id: "1",
        role: "assistant",
        content: `I'm ${agent.name}, your ${agent.role}. I specialize in ${agent.specialty}. My approach: ${agent.style}\n\nWhat would you like to work on today?`,
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <MainLayout>
      <div className="h-screen flex">
        {/* Agent Selector Sidebar */}
        <div className="w-80 border-r border-border p-4 flex flex-col">
          <div className="flex items-center gap-2 mb-6">
            <Bot className="w-5 h-5 text-primary" />
            <h2 className="font-display font-semibold text-lg">AI Coaches</h2>
          </div>

          <div className="space-y-2 flex-1">
            {agents.map((agent) => (
              <button
                key={agent.id}
                onClick={() => handleAgentChange(agent)}
                className={cn(
                  "w-full p-4 rounded-xl text-left transition-all duration-200",
                  selectedAgent.id === agent.id
                    ? "bg-card-elevated border border-primary/30"
                    : "bg-card hover:bg-card-elevated border border-transparent"
                )}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-background",
                      agent.color
                    )}
                  >
                    {agent.initial}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{agent.name}</p>
                    <p className="text-xs text-muted-foreground">{agent.role}</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {agent.specialty}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="h-16 border-b border-border px-6 flex items-center gap-3">
            <div
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-background",
                selectedAgent.color
              )}
            >
              {selectedAgent.initial}
            </div>
            <div>
              <h3 className="font-display font-semibold">{selectedAgent.name}</h3>
              <p className="text-xs text-muted-foreground">{selectedAgent.style}</p>
            </div>
            <div className="ml-auto flex items-center gap-1">
              <span
                className={cn(
                  "w-2 h-2 rounded-full animate-pulse",
                  selectedAgent.color
                )}
              />
              <span className="text-xs text-muted-foreground">Active</span>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-3 animate-fade-in",
                  message.role === "user" && "flex-row-reverse"
                )}
              >
                {message.role === "assistant" && (
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-background flex-shrink-0",
                      selectedAgent.color
                    )}
                  >
                    {selectedAgent.initial}
                  </div>
                )}
                <div
                  className={cn(
                    "max-w-[70%] rounded-xl p-4",
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-card border border-border"
                  )}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-line">
                    {message.content}
                  </p>
                  <span className="text-[10px] opacity-60 mt-2 block">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-6 border-t border-border">
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder={`Talk to ${selectedAgent.name}...`}
                  className="w-full bg-card rounded-xl px-4 py-3 pr-24 text-sm outline-none border border-border focus:border-primary/50 transition-all"
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
                {selectedAgent.name} uses Socratic questioning to deepen your understanding
              </span>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
