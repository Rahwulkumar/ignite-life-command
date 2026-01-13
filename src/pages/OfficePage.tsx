import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileText, 
  Clock,
  BarChart3
} from "lucide-react";
import { Sidebar } from "@/components/layout/Sidebar";
import { PageTransition } from "@/components/layout/PageTransition";
import { TaskManager } from "@/components/office/TaskManager";
import { NotesPanel } from "@/components/office/NotesPanel";
import { WorkspaceSidebar } from "@/components/office/WorkspaceSidebar";
import { EveFloatingWidget } from "@/components/shared/EveFloatingWidget";
import { TimerWidget } from "@/components/shared/TimerWidget";
import { EveningReportModal } from "@/components/shared/EveningReportModal";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useTimeTracker } from "@/hooks/useTimeTracker";

interface Note {
  id: string;
  title: string;
  icon: string;
  is_pinned: boolean;
  content: any;
  created_at: string;
  updated_at: string;
}

export default function OfficePage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'notes' | 'tasks' | 'daily-log'>('notes');
  const [isLoading, setIsLoading] = useState(true);
  const [showReportModal, setShowReportModal] = useState(false);
  const { getTodayStats } = useTimeTracker();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    fetchNotes();
    const interval = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  // Check for evening report time (9 PM)
  useEffect(() => {
    const hour = currentTime.getHours();
    const hasShownToday = localStorage.getItem('lastReportDate') === new Date().toDateString();
    
    if (hour >= 21 && !hasShownToday) {
      const stats = getTodayStats();
      if (stats.totalMinutes > 0) {
        setShowReportModal(true);
        localStorage.setItem('lastReportDate', new Date().toDateString());
      }
    }
  }, [currentTime]);

  async function fetchNotes() {
    const { data, error } = await supabase
      .from("office_notes")
      .select("*")
      .order("is_pinned", { ascending: false })
      .order("updated_at", { ascending: false });

    if (!error && data) {
      setNotes(data as Note[]);
      if (data.length > 0 && !selectedNoteId) {
        setSelectedNoteId(data[0].id);
      }
    }
    setIsLoading(false);
  }

  async function createNote() {
    const { data, error } = await supabase
      .from("office_notes")
      .insert({
        title: "Untitled",
        icon: "📝",
        content: {},
      })
      .select()
      .single();

    if (!error && data) {
      setNotes((prev) => [data as Note, ...prev]);
      setSelectedNoteId(data.id);
      setActiveView('notes');
    }
  }

  async function deleteNote(id: string) {
    await supabase.from("office_notes").delete().eq("id", id);
    setNotes((prev) => prev.filter((n) => n.id !== id));
    if (selectedNoteId === id) {
      const remaining = notes.filter((n) => n.id !== id);
      setSelectedNoteId(remaining.length > 0 ? remaining[0].id : null);
    }
  }

  async function togglePin(id: string) {
    const note = notes.find((n) => n.id === id);
    if (!note) return;

    const newPinned = !note.is_pinned;
    await supabase
      .from("office_notes")
      .update({ is_pinned: newPinned })
      .eq("id", id);

    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_pinned: newPinned } : n))
    );
  }

  async function updateNote(id: string, updates: Partial<Note>) {
    await supabase
      .from("office_notes")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id);

    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, ...updates } : n))
    );
  }

  const selectedNote = notes.find((n) => n.id === selectedNoteId);
  const formattedDate = currentTime.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      
      <main className="flex-1 ml-16 flex">
        <PageTransition>
          {/* Workspace Sidebar */}
          <WorkspaceSidebar
            notes={notes}
            selectedNoteId={selectedNoteId}
            onSelectNote={setSelectedNoteId}
            onCreateNote={createNote}
            onDeleteNote={deleteNote}
            onTogglePin={togglePin}
            activeView={activeView}
            onChangeView={setActiveView}
          />

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col h-screen">
            {/* Minimal Header */}
            <header className="px-6 py-3 flex items-center justify-between border-b border-border/50">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center gap-3">
                <TimerWidget />
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2"
                  onClick={() => setShowReportModal(true)}
                >
                  <BarChart3 className="w-4 h-4" />
                  Daily Report
                </Button>
              </div>
            </header>

            {/* Content */}
            <div className="flex-1 overflow-hidden">
              <AnimatePresence mode="wait">
                {activeView === 'tasks' ? (
                  <motion.div
                    key="tasks"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="h-full"
                  >
                    <TaskManager />
                  </motion.div>
                ) : activeView === 'daily-log' ? (
                  <motion.div
                    key="daily-log"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="h-full p-8"
                  >
                    <DailyLogView />
                  </motion.div>
                ) : (
                  <motion.div
                    key="notes"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="h-full"
                  >
                    {selectedNote ? (
                      <NotesPanel 
                        initialNoteId={selectedNoteId}
                        onNoteChange={(id) => setSelectedNoteId(id)}
                        embedded
                      />
                    ) : (
                      <div className="h-full flex items-center justify-center text-muted-foreground">
                        <div className="text-center">
                          <FileText className="w-12 h-12 mx-auto mb-4 opacity-30" />
                          <p>Select a page or create a new one</p>
                          <Button 
                            variant="outline" 
                            className="mt-4"
                            onClick={createNote}
                          >
                            Create Page
                          </Button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </PageTransition>
      </main>

      {/* Eve Floating Widget */}
      <EveFloatingWidget />

      {/* Evening Report Modal */}
      <EveningReportModal 
        open={showReportModal} 
        onOpenChange={setShowReportModal}
      />
    </div>
  );
}

// Daily Log View Component
function DailyLogView() {
  const { todaySessions, getTodayStats } = useTimeTracker();
  const stats = getTodayStats();

  const formatTime = (minutes: number) => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hrs > 0) return `${hrs}h ${mins}m`;
    return `${mins}m`;
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold mb-2">Daily Log</h1>
        <p className="text-muted-foreground">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </p>
      </div>

      {/* Today's Summary */}
      <div className="glass rounded-xl p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-primary" />
          <h2 className="font-medium">Time Tracked</h2>
        </div>
        <p className="text-3xl font-bold">{formatTime(stats.totalMinutes)}</p>
      </div>

      {/* Activity Log */}
      <div className="space-y-4">
        <h2 className="font-medium text-muted-foreground">Activities</h2>
        {todaySessions.length > 0 ? (
          <div className="space-y-2">
            {todaySessions
              .filter((s) => s.duration_minutes)
              .map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-4 bg-muted/30 rounded-lg"
                >
                  <div>
                    <p className="font-medium capitalize">{session.activity}</p>
                    <p className="text-sm text-muted-foreground capitalize">
                      {session.domain}
                    </p>
                  </div>
                  <span className="text-sm font-mono">
                    {formatTime(session.duration_minutes || 0)}
                  </span>
                </div>
              ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <Clock className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p>No activities logged today.</p>
            <p className="text-sm mt-1">Start a timer to track your progress!</p>
          </div>
        )}
      </div>
    </div>
  );
}
