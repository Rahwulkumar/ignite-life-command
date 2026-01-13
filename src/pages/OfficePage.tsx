import { useState, useEffect, useRef } from "react";
import { 
  FileText, 
  CheckSquare, 
  Send, 
  Loader2,
  ArrowLeft,
  Sparkles,
  Mail,
  Calendar,
  MessageSquare,
  ChevronRight,
  User
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Sidebar } from "@/components/layout/Sidebar";
import { PageTransition } from "@/components/layout/PageTransition";
import { TaskManager } from "@/components/office/TaskManager";
import { NotesPanel } from "@/components/office/NotesPanel";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

const quickCommands = [
  { label: "What should I focus on today?", icon: Sparkles },
  { label: "Summarize my pending tasks", icon: CheckSquare },
  { label: "Help me draft an email", icon: Mail },
];

export default function OfficePage() {
  const [view, setView] = useState<"command" | "notes" | "tasks">("command");
  const [notesOpen, setNotesOpen] = useState(false);
  const [tasksOpen, setTasksOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [taskCount, setTaskCount] = useState(0);
  const [noteCount, setNoteCount] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    fetchMessages();
    fetchCounts();
    const interval = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  async function fetchCounts() {
    const [tasksRes, notesRes] = await Promise.all([
      supabase.from("office_tasks").select("id", { count: "exact" }).eq("status", "todo"),
      supabase.from("office_notes").select("id", { count: "exact" }),
    ]);
    setTaskCount(tasksRes.count || 0);
    setNoteCount(notesRes.count || 0);
  }

  async function fetchMessages() {
    const { data, error } = await supabase
      .from("office_chat_messages")
      .select("*")
      .order("created_at", { ascending: true })
      .limit(50);

    if (!error && data) {
      setMessages(data.map(m => ({
        ...m,
        role: m.role as "user" | "assistant"
      })));
    }
  }

  async function sendMessage(content: string) {
    if (!content.trim() || isLoading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: content.trim(),
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    await supabase.from("office_chat_messages").insert({
      role: "user",
      content: content.trim(),
    });

    try {
      const response = await supabase.functions.invoke("eve-assistant", {
        body: {
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        },
      });

      if (response.error) throw response.error;

      const reader = response.data.getReader();
      const decoder = new TextDecoder();
      let assistantContent = "";

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "",
        created_at: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") continue;

            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content || "";
              assistantContent += content;

              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantMessage.id
                    ? { ...m, content: assistantContent }
                    : m
                )
              );
            } catch {
              // Ignore parse errors
            }
          }
        }
      }

      await supabase.from("office_chat_messages").insert({
        role: "assistant",
        content: assistantContent,
      });
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "I encountered an error. Please try again.",
          created_at: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const greeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const formattedTime = currentTime.toLocaleTimeString("en-US", { 
    hour: "numeric", 
    minute: "2-digit",
    hour12: true 
  });

  const formattedDate = currentTime.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      
      <main className="flex-1 ml-16">
        <PageTransition>
          <AnimatePresence mode="wait">
            {view === "notes" ? (
              <motion.div
                key="notes"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-screen flex flex-col"
              >
                <header className="border-b border-border px-6 py-3 flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setView("command")}
                    className="gap-2 text-muted-foreground hover:text-foreground"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </Button>
                </header>
                <div className="flex-1 overflow-hidden">
                  <NotesPanel />
                </div>
              </motion.div>
            ) : view === "tasks" ? (
              <motion.div
                key="tasks"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-screen flex flex-col"
              >
                <header className="border-b border-border px-6 py-3 flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setView("command")}
                    className="gap-2 text-muted-foreground hover:text-foreground"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </Button>
                </header>
                <div className="flex-1 overflow-hidden">
                  <TaskManager />
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="command"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-screen flex flex-col"
              >
                {/* Minimal Header */}
                <header className="px-8 py-6 flex items-center justify-between border-b border-border/50">
                  <div className="flex items-center gap-4">
                    <span className="text-muted-foreground text-sm">{formattedDate}</span>
                    <span className="text-muted-foreground/50">·</span>
                    <span className="text-muted-foreground text-sm">{formattedTime}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setView("notes")}
                      className="flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors"
                    >
                      <FileText className="w-4 h-4" />
                      <span>Notes</span>
                      <span className="text-xs text-muted-foreground/70">{noteCount}</span>
                    </button>
                    <button
                      onClick={() => setView("tasks")}
                      className="flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors"
                    >
                      <CheckSquare className="w-4 h-4" />
                      <span>Tasks</span>
                      <span className="text-xs text-muted-foreground/70">{taskCount}</span>
                    </button>
                  </div>
                </header>

                {/* Eve Command Center */}
                <div className="flex-1 flex flex-col max-w-3xl mx-auto w-full px-6 py-8">
                  {messages.length === 0 ? (
                    /* Empty State - Centered Greeting */
                    <div className="flex-1 flex flex-col items-center justify-center">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-12"
                      >
                        <h1 className="text-4xl font-light tracking-tight mb-2">
                          {greeting()}
                        </h1>
                        <p className="text-muted-foreground">
                          How can I help you today?
                        </p>
                      </motion.div>

                      {/* Quick Commands */}
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="w-full max-w-lg space-y-2"
                      >
                        {quickCommands.map((cmd, i) => (
                          <button
                            key={i}
                            onClick={() => sendMessage(cmd.label)}
                            className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm border border-border/50 rounded-xl hover:bg-muted/30 hover:border-border transition-all group"
                          >
                            <cmd.icon className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                            <span className="text-muted-foreground group-hover:text-foreground transition-colors">
                              {cmd.label}
                            </span>
                            <ChevronRight className="w-4 h-4 text-muted-foreground/50 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                          </button>
                        ))}
                      </motion.div>

                      {/* Microsoft 365 Connection Prompt */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="mt-16 text-center"
                      >
                        <p className="text-xs text-muted-foreground/60 mb-2">
                          Connect your work accounts for personalized insights
                        </p>
                        <div className="flex items-center justify-center gap-3">
                          <button 
                            disabled
                            className="flex items-center gap-2 px-3 py-1.5 text-xs text-muted-foreground/50 border border-border/30 rounded-lg cursor-not-allowed"
                          >
                            <Mail className="w-3 h-3" />
                            Outlook
                          </button>
                          <button 
                            disabled
                            className="flex items-center gap-2 px-3 py-1.5 text-xs text-muted-foreground/50 border border-border/30 rounded-lg cursor-not-allowed"
                          >
                            <MessageSquare className="w-3 h-3" />
                            Teams
                          </button>
                          <button 
                            disabled
                            className="flex items-center gap-2 px-3 py-1.5 text-xs text-muted-foreground/50 border border-border/30 rounded-lg cursor-not-allowed"
                          >
                            <Calendar className="w-3 h-3" />
                            Calendar
                          </button>
                        </div>
                        <p className="text-xs text-muted-foreground/40 mt-2">Coming soon</p>
                      </motion.div>
                    </div>
                  ) : (
                    /* Chat Messages */
                    <ScrollArea className="flex-1 -mx-6 px-6" ref={scrollRef}>
                      <div className="space-y-6 py-4">
                        {messages.map((message) => (
                          <motion.div
                            key={message.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={cn(
                              "flex gap-4",
                              message.role === "user" && "flex-row-reverse"
                            )}
                          >
                            <div
                              className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                                message.role === "assistant"
                                  ? "bg-muted"
                                  : "bg-foreground/10"
                              )}
                            >
                              {message.role === "assistant" ? (
                                <Sparkles className="w-4 h-4 text-muted-foreground" />
                              ) : (
                                <User className="w-4 h-4 text-muted-foreground" />
                              )}
                            </div>
                            <div
                              className={cn(
                                "flex-1 max-w-[80%]",
                                message.role === "user" && "text-right"
                              )}
                            >
                              <div
                                className={cn(
                                  "inline-block rounded-2xl px-4 py-3 text-sm",
                                  message.role === "assistant"
                                    ? "bg-muted text-foreground"
                                    : "bg-foreground text-background"
                                )}
                              >
                                <p className="whitespace-pre-wrap leading-relaxed">
                                  {message.content}
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                        {isLoading && messages[messages.length - 1]?.role === "user" && (
                          <div className="flex gap-4">
                            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                              <Sparkles className="w-4 h-4 text-muted-foreground" />
                            </div>
                            <div className="bg-muted rounded-2xl px-4 py-3">
                              <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                            </div>
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                  )}

                  {/* Input Area */}
                  <div className="pt-4 mt-auto">
                    <form onSubmit={handleSubmit} className="relative">
                      <Textarea
                        ref={inputRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask Eve anything..."
                        className="min-h-[56px] max-h-[200px] resize-none pr-14 rounded-2xl border-border/50 bg-muted/30 focus:bg-muted/50 transition-colors"
                        rows={1}
                      />
                      <Button 
                        type="submit" 
                        size="icon"
                        disabled={!input.trim() || isLoading}
                        className="absolute right-2 bottom-2 rounded-xl"
                      >
                        {isLoading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Send className="w-4 h-4" />
                        )}
                      </Button>
                    </form>
                    <p className="text-center text-xs text-muted-foreground/50 mt-3">
                      Eve can make mistakes. Verify important information.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </PageTransition>
      </main>
    </div>
  );
}
