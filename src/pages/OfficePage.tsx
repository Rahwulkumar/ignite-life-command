import { useState, useEffect } from "react";
import { 
  Building2, 
  CheckSquare, 
  FileText, 
  Sparkles, 
  ArrowLeft, 
  Clock, 
  Calendar,
  Zap,
  Target,
  ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Sidebar } from "@/components/layout/Sidebar";
import { PageTransition } from "@/components/layout/PageTransition";
import { TaskManager } from "@/components/office/TaskManager";
import { NotesPanel } from "@/components/office/NotesPanel";
import { EveChat } from "@/components/office/EveChat";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { DomainStatsBar } from "@/components/shared/DomainStatsBar";

export default function OfficePage() {
  const [view, setView] = useState<"dashboard" | "notes" | "tasks">("dashboard");
  const [taskCount, setTaskCount] = useState(0);
  const [noteCount, setNoteCount] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    async function fetchCounts() {
      const [tasksRes, notesRes] = await Promise.all([
        supabase.from("office_tasks").select("id", { count: "exact" }),
        supabase.from("office_notes").select("id", { count: "exact" }),
      ]);
      setTaskCount(tasksRes.count || 0);
      setNoteCount(notesRes.count || 0);
    }
    fetchCounts();

    const interval = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  const greeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const formattedDate = currentTime.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const stats = [
    { icon: CheckSquare, label: "Open Tasks", value: taskCount, color: "text-tech" },
    { icon: FileText, label: "Notes", value: noteCount, color: "text-trading" },
    { icon: Target, label: "Focus Score", value: "87%", color: "text-finance" },
    { icon: Clock, label: "Time", value: currentTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }), color: "text-muted-foreground" },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      
      <main className="flex-1 ml-16">
        <PageTransition>
          <AnimatePresence mode="wait">
            {view === "notes" ? (
              <motion.div
                key="notes"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="h-screen flex flex-col"
              >
                <header className="border-b border-border px-6 py-3 flex items-center gap-3 bg-background/80 backdrop-blur-sm">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setView("dashboard")}
                    className="gap-2 text-muted-foreground hover:text-foreground"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </Button>
                  <div className="h-4 w-px bg-border" />
                  <span className="text-sm font-medium">Notes</span>
                </header>
                <div className="flex-1 overflow-hidden">
                  <NotesPanel />
                </div>
              </motion.div>
            ) : view === "tasks" ? (
              <motion.div
                key="tasks"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="h-screen flex flex-col"
              >
                <header className="border-b border-border px-6 py-3 flex items-center gap-3 bg-background/80 backdrop-blur-sm">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setView("dashboard")}
                    className="gap-2 text-muted-foreground hover:text-foreground"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </Button>
                  <div className="h-4 w-px bg-border" />
                  <span className="text-sm font-medium">Task Manager</span>
                </header>
                <div className="flex-1 overflow-hidden">
                  <TaskManager />
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="h-screen flex"
              >
                {/* Main Content Area */}
                <div className="flex-1 flex flex-col overflow-hidden">
                  {/* Hero Header */}
                  <div className="relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-work/20 via-background to-background" />
                    <div className="absolute top-0 right-0 w-96 h-96 bg-work/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    
                    <div className="relative px-8 pt-10 pb-8">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                          <motion.div 
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="w-14 h-14 rounded-2xl bg-gradient-to-br from-work to-work/50 flex items-center justify-center shadow-lg shadow-work/20"
                          >
                            <Building2 className="w-7 h-7 text-white" />
                          </motion.div>
                          <div>
                            <p className="text-sm text-muted-foreground mb-0.5">{formattedDate}</p>
                            <h1 className="text-2xl font-semibold tracking-tight">{greeting()}</h1>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <DomainStatsBar stats={stats} />

                  {/* Cards Grid */}
                  <div className="flex-1 px-8 pb-8 overflow-auto">
                    <div className="max-w-5xl mx-auto">
                      <div className="grid grid-cols-2 gap-6">
                        {/* Notes Card */}
                        <motion.button
                          onClick={() => setView("notes")}
                          className="group relative p-6 rounded-2xl border border-border/50 bg-card hover:border-trading/40 transition-all text-left overflow-hidden"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-trading/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                          <div className="relative">
                            <div className="flex items-start justify-between mb-6">
                              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-trading/20 to-trading/10 flex items-center justify-center">
                                <FileText className="w-7 h-7 text-trading" />
                              </div>
                              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-trading group-hover:translate-x-1 transition-all" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">Notes</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              Notion-style editor for documents, meeting notes, and ideas
                            </p>
                            <div className="mt-4 pt-4 border-t border-border/50">
                              <span className="text-xs text-muted-foreground">{noteCount} pages</span>
                            </div>
                          </div>
                        </motion.button>

                        {/* Tasks Card */}
                        <motion.button
                          onClick={() => setView("tasks")}
                          className="group relative p-6 rounded-2xl border border-border/50 bg-card hover:border-tech/40 transition-all text-left overflow-hidden"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-tech/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                          <div className="relative">
                            <div className="flex items-start justify-between mb-6">
                              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-tech/20 to-tech/10 flex items-center justify-center">
                                <CheckSquare className="w-7 h-7 text-tech" />
                              </div>
                              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-tech group-hover:translate-x-1 transition-all" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">Tasks</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              Track priorities, deadlines, and action items
                            </p>
                            <div className="mt-4 pt-4 border-t border-border/50">
                              <span className="text-xs text-muted-foreground">{taskCount} active</span>
                            </div>
                          </div>
                        </motion.button>

                        {/* Quick Actions Card */}
                        <div className="col-span-2 p-6 rounded-2xl border border-border/50 bg-card">
                          <div className="flex items-center gap-2 mb-4">
                            <Zap className="w-4 h-4 text-muted-foreground" />
                            <h3 className="text-sm font-medium text-muted-foreground">Quick Actions</h3>
                          </div>
                          <div className="flex gap-3">
                            <QuickActionButton 
                              icon={FileText} 
                              label="New Note" 
                              onClick={() => setView("notes")} 
                            />
                            <QuickActionButton 
                              icon={CheckSquare} 
                              label="Add Task" 
                              onClick={() => setView("tasks")} 
                            />
                            <QuickActionButton 
                              icon={Calendar} 
                              label="Schedule" 
                              onClick={() => {}} 
                              disabled
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Eve Chat Sidebar */}
                <div className="w-[380px] border-l border-border flex flex-col bg-card/30">
                  <div className="px-5 py-4 border-b border-border flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-work/20 to-work/10 flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-work" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Eve</h3>
                      <p className="text-xs text-muted-foreground">Executive Assistant</p>
                    </div>
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <EveChat />
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

function QuickActionButton({ 
  icon: Icon, 
  label, 
  onClick,
  disabled = false
}: { 
  icon: any; 
  label: string; 
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border/50 bg-background/50 transition-all text-sm",
        disabled 
          ? "opacity-50 cursor-not-allowed" 
          : "hover:bg-muted hover:border-muted-foreground/20"
      )}
    >
      <Icon className="w-4 h-4 text-muted-foreground" />
      <span>{label}</span>
    </button>
  );
}
