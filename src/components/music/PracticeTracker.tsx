import { motion } from "framer-motion";
import { Clock, Plus, Music2, Guitar, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface PracticeSession {
  id: number;
  focus: string;
  instrument: string;
  duration: number;
  date: string;
  notes: string;
  rating: number;
}

interface PracticeTrackerProps {
  sessions: PracticeSession[];
  onLogPractice?: () => void;
}

export function PracticeTracker({ sessions, onLogPractice }: PracticeTrackerProps) {
  const totalMinutes = sessions.reduce((sum, s) => sum + s.duration, 0);
  const totalHours = (totalMinutes / 60).toFixed(1);
  const avgRating = sessions.length > 0
    ? (sessions.reduce((sum, s) => sum + s.rating, 0) / sessions.length).toFixed(1)
    : "0";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-sm text-muted-foreground">Practice Sessions</h2>
        <Button variant="outline" size="sm" className="gap-2" onClick={onLogPractice}>
          <Plus className="w-3 h-3" />
          Log Practice
        </Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-music/5 rounded-lg border border-music/20">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-4 h-4 text-music" />
            <span className="text-xs text-muted-foreground">This week</span>
          </div>
          <p className="text-lg font-medium">{totalHours}h</p>
        </div>
        <div className="p-4 bg-muted/30 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <Target className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Sessions</span>
          </div>
          <p className="text-lg font-medium">{sessions.length}</p>
        </div>
        <div className="p-4 bg-muted/30 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <Music2 className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Avg Quality</span>
          </div>
          <p className="text-lg font-medium">{avgRating}/5</p>
        </div>
      </div>

      {/* Session List */}
      <div className="space-y-0">
        {sessions.length > 0 ? (
          sessions.map((session, index) => (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.03 }}
              className="py-4 border-b border-border/50 hover:bg-muted/20 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-music/10 flex items-center justify-center">
                    <Guitar className="w-4 h-4 text-music" />
                  </div>
                  <div>
                    <p className="font-medium">{session.focus}</p>
                    <p className="text-xs text-muted-foreground">{session.instrument} · {session.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm tabular-nums">{session.duration} min</p>
                  <div className="flex gap-0.5 justify-end">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <div
                        key={star}
                        className={cn(
                          "w-1.5 h-1.5 rounded-full",
                          star <= session.rating ? "bg-music" : "bg-muted"
                        )}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground ml-11 italic">"{session.notes}"</p>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-8 text-muted-foreground text-sm">
            No practice sessions logged
          </div>
        )}
      </div>
    </motion.div>
  );
}
