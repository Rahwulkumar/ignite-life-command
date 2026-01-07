import { useState, useEffect } from "react";
import { 
  Building2, 
  CheckSquare, 
  FileText, 
  Sparkles, 
  ArrowLeft, 
  Clock, 
  Calendar,
  TrendingUp,
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

export default function OfficePage() {
  const [view, setView] = useState<"dashboard" | "notes" | "tasks">("dashboard");
  const [taskCount, setTaskCount] = useState(0);
  const [noteCount, setNoteCount] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Fetch counts
    async function fetchCounts() {
      const [tasksRes, notesRes] = await Promise.all([
        supabase.from("office_tasks").select("id", { count: "exact" }),
        supabase.from("office_notes").select("id", { count: "exact" }),
      ]);
      setTaskCount(tasksRes.count || 0);
      setNoteCount(notesRes.count || 0);
    }
    fetchCounts();

    // Update time every minute
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
                  {/* Header */}
                  <header className="px-8 py-8 border-b border-border">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">{formattedDate}</p>
                        <h1 className="text-3xl font-semibold tracking-tight">{greeting()}</h1>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        {currentTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>
                  </header>

                  {/* Stats Bar */}
                  <div className="px-8 py-4 border-b border-border bg-muted/30">
                    <div className="flex gap-8">
                      <StatItem icon={CheckSquare} label="Open Tasks" value={taskCount} color="text-blue-400" />
                      <StatItem icon={FileText} label="Notes" value={noteCount} color="text-amber-400" />
                      <StatItem icon={Target} label="Focus Score" value="87%" color="text-green-400" />
                    </div>
                  </div>

                  {/* Cards Grid */}
                  <div className="flex-1 p-8 overflow-auto">
                    <div className="grid grid-cols-2 gap-6 max-w-4xl">
                      {/* Notes Card */}
                      <motion.button
                        onClick={() => setView("notes")}
                        className="group relative p-6 rounded-2xl border border-border bg-gradient-to-br from-card to-card/50 hover:border-amber-500/40 transition-all text-left overflow-hidden"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative">
                          <div className="flex items-start justify-between mb-6">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 flex items-center justify-center">
                              <FileText className="w-7 h-7 text-amber-400" />
                            </div>
                            <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
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
                        className="group relative p-6 rounded-2xl border border-border bg-gradient-to-br from-card to-card/50 hover:border-blue-500/40 transition-all text-left overflow-hidden"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative">
                          <div className="flex items-start justify-between mb-6">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-600/10 flex items-center justify-center">
                              <CheckSquare className="w-7 h-7 text-blue-400" />
                            </div>
                            <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
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
                      <div className="col-span-2 p-6 rounded-2xl border border-border bg-card/50">
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

                {/* Eve Chat Sidebar */}
                <div className="w-[380px] border-l border-border flex flex-col bg-card/30">
                  <div className="px-5 py-4 border-b border-border flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-600/20 flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-amber-400" />
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

function StatItem({ 
  icon: Icon, 
  label, 
  value, 
  color 
}: { 
  icon: any; 
  label: string; 
  value: number | string; 
  color: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className={cn("w-8 h-8 rounded-lg bg-muted flex items-center justify-center", color)}>
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-semibold">{value}</p>
      </div>
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
        "flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-background/50 transition-all text-sm",
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
