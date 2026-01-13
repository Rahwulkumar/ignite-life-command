import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Sidebar } from "@/components/layout/Sidebar";
import { TaskManager } from "@/components/office/TaskManager";
import NotesDrawer from "@/components/office/NotesDrawer";
import DailyLogDrawer from "@/components/office/DailyLogDrawer";
import FloatingActions from "@/components/office/FloatingActions";
import { EveFloatingWidget } from "@/components/shared/EveFloatingWidget";
import { TimerWidget } from "@/components/shared/TimerWidget";
import { EveningReportModal } from "@/components/shared/EveningReportModal";
import { useTimeTracker } from "@/hooks/useTimeTracker";

const OfficePage = () => {
  const [notesOpen, setNotesOpen] = useState(false);
  const [dailyLogOpen, setDailyLogOpen] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const { todaySessions, getTodayStats } = useTimeTracker();
  const [currentTime, setCurrentTime] = useState(new Date());

  const today = new Date();
  const formattedDate = format(today, "EEEE, MMMM d");

  // Check for evening report time (9 PM)
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const hour = currentTime.getHours();
    const hasShownToday = localStorage.getItem('lastReportDate') === new Date().toDateString();
    
    if (hour >= 21 && !hasShownToday) {
      const stats = getTodayStats();
      if (stats.totalMinutes > 0) {
        setShowReport(true);
        localStorage.setItem('lastReportDate', new Date().toDateString());
      }
    }
  }, [currentTime, getTodayStats]);

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      
      <div className="flex-1 ml-16">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-sm border-b border-border/50">
          <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold">{formattedDate}</h1>
              <p className="text-sm text-muted-foreground">Office</p>
            </div>
            <TimerWidget />
          </div>
        </header>

        {/* Main Content - Centered Task Manager */}
        <main className="max-w-4xl mx-auto px-6 py-8">
          <TaskManager />
        </main>

        {/* Floating Actions */}
        <FloatingActions 
          onNotesClick={() => setNotesOpen(true)}
          onDailyLogClick={() => setDailyLogOpen(true)}
        />

        {/* Eve Floating Widget */}
        <EveFloatingWidget />

        {/* Slide-out Drawers */}
        <NotesDrawer open={notesOpen} onOpenChange={setNotesOpen} />
        <DailyLogDrawer open={dailyLogOpen} onOpenChange={setDailyLogOpen} />

        {/* Evening Report Modal */}
        <EveningReportModal 
          open={showReport} 
          onOpenChange={setShowReport}
        />
      </div>
    </div>
  );
};

export default OfficePage;
