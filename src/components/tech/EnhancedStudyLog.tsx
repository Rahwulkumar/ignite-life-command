import { useState } from "react";
import { Clock, Plus, BookOpen, Target, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { StudyAnalytics } from "./StudyAnalytics";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface StudySession {
  id: string;
  topic: string;
  category: string;
  duration: number;
  date: string;
  notes: string;
}

const categories = ["All", "DSA", "System Design", "Frontend", "Backend", "AI/ML", "DevOps"];

const mockSessions: StudySession[] = [
  { id: "1", topic: "Dynamic Programming", category: "DSA", duration: 90, date: "Today", notes: "Completed 3 medium problems" },
  { id: "2", topic: "System Design - Load Balancers", category: "System Design", duration: 60, date: "Today", notes: "Read DDIA chapter 5" },
  { id: "3", topic: "React Server Components", category: "Frontend", duration: 45, date: "Yesterday", notes: "Built sample app" },
  { id: "4", topic: "Graph Algorithms", category: "DSA", duration: 120, date: "Yesterday", notes: "BFS, DFS, Dijkstra" },
  { id: "5", topic: "LangChain Basics", category: "AI/ML", duration: 60, date: "Dec 27", notes: "Built RAG pipeline" },
  { id: "6", topic: "Docker Compose", category: "DevOps", duration: 45, date: "Dec 26", notes: "Multi-container setup" },
  { id: "7", topic: "PostgreSQL Indexing", category: "Backend", duration: 30, date: "Dec 25", notes: "B-tree vs Hash indexes" },
];

export function EnhancedStudyLog() {
  const [sessions, setSessions] = useState<StudySession[]>(mockSessions);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showAnalytics, setShowAnalytics] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newSession, setNewSession] = useState({
    topic: "",
    category: "DSA",
    duration: "60",
    notes: "",
  });

  const filteredSessions = selectedCategory === "All"
    ? sessions
    : sessions.filter(s => s.category === selectedCategory);

  const totalMinutes = sessions.reduce((sum, s) => sum + s.duration, 0);
  const totalHours = (totalMinutes / 60).toFixed(1);

  const handleAddSession = () => {
    if (!newSession.topic.trim()) return;
    const session: StudySession = {
      id: Date.now().toString(),
      topic: newSession.topic.trim(),
      category: newSession.category,
      duration: parseInt(newSession.duration) || 60,
      date: "Today",
      notes: newSession.notes.trim(),
    };
    setSessions([session, ...sessions]);
    setNewSession({ topic: "", category: "DSA", duration: "60", notes: "" });
    setIsAddOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Toggle and Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowAnalytics(true)}
            className={cn(
              "text-sm font-medium transition-colors",
              showAnalytics ? "text-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            Analytics
          </button>
          <button
            onClick={() => setShowAnalytics(false)}
            className={cn(
              "text-sm font-medium transition-colors",
              !showAnalytics ? "text-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            Sessions
          </button>
        </div>
        <Button onClick={() => setIsAddOpen(true)} size="sm" className="gap-2">
          <Plus className="w-3 h-3" />
          Log Session
        </Button>
      </div>

      {showAnalytics ? (
        <StudyAnalytics />
      ) : (
        <>
          {/* Summary */}
          <div className="flex items-center gap-6 p-4 bg-tech/5 rounded-lg border border-tech/20">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-tech" />
              <span className="text-sm text-muted-foreground">This week:</span>
              <span className="text-sm font-medium">{totalHours}h studied</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-tech" />
              <span className="text-sm text-muted-foreground">Sessions:</span>
              <span className="text-sm font-medium">{sessions.length}</span>
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap",
                  selectedCategory === cat
                    ? "bg-foreground text-background"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Session List */}
          <div className="space-y-0">
            {filteredSessions.map((session) => (
              <div
                key={session.id}
                className="py-4 border-b border-border/50 hover:bg-muted/20 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-tech/10 flex items-center justify-center">
                      <BookOpen className="w-4 h-4 text-tech" />
                    </div>
                    <div>
                      <p className="font-medium">{session.topic}</p>
                      <p className="text-xs text-muted-foreground">{session.category} · {session.date}</p>
                    </div>
                  </div>
                  <span className="text-sm text-muted-foreground tabular-nums">
                    {session.duration} min
                  </span>
                </div>
                {session.notes && (
                  <p className="text-sm text-muted-foreground ml-11 italic">"{session.notes}"</p>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {/* Add Session Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Log Study Session</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Topic</label>
              <Input
                value={newSession.topic}
                onChange={(e) => setNewSession({ ...newSession, topic: e.target.value })}
                placeholder="e.g., Dynamic Programming"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Category</label>
              <Select 
                value={newSession.category} 
                onValueChange={(v) => setNewSession({ ...newSession, category: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.filter(c => c !== "All").map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Duration (minutes)</label>
              <Input
                value={newSession.duration}
                onChange={(e) => setNewSession({ ...newSession, duration: e.target.value })}
                type="number"
                min="1"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Notes (optional)</label>
              <Textarea
                value={newSession.notes}
                onChange={(e) => setNewSession({ ...newSession, notes: e.target.value })}
                placeholder="What did you learn?"
                rows={3}
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="ghost" onClick={() => setIsAddOpen(false)}>Cancel</Button>
              <Button onClick={handleAddSession} disabled={!newSession.topic.trim()}>Log Session</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
