import { useState } from "react";
import { Clock, Plus, BookOpen, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface StudySession {
  id: number;
  topic: string;
  category: string;
  duration: number;
  date: string;
  notes: string;
}

const mockSessions: StudySession[] = [
  { id: 1, topic: "Dynamic Programming", category: "DSA", duration: 90, date: "Today", notes: "Completed 3 medium problems" },
  { id: 2, topic: "System Design - Load Balancers", category: "System Design", duration: 60, date: "Today", notes: "Read DDIA chapter 5" },
  { id: 3, topic: "React Server Components", category: "Frontend", duration: 45, date: "Yesterday", notes: "Built sample app" },
  { id: 4, topic: "Graph Algorithms", category: "DSA", duration: 120, date: "Yesterday", notes: "BFS, DFS, Dijkstra" },
  { id: 5, topic: "LangChain Basics", category: "AI/ML", duration: 60, date: "Dec 27", notes: "Built RAG pipeline" },
];

const categories = ["All", "DSA", "System Design", "Frontend", "AI/ML"];

export function StudyLog() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  
  const filteredSessions = selectedCategory === "All"
    ? mockSessions
    : mockSessions.filter(s => s.category === selectedCategory);

  const totalMinutes = mockSessions.reduce((sum, s) => sum + s.duration, 0);
  const totalHours = (totalMinutes / 60).toFixed(1);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-sm text-muted-foreground">Study Log</h2>
        <Button variant="outline" size="sm" className="gap-2">
          <Plus className="w-3 h-3" />
          Log Session
        </Button>
      </div>

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
          <span className="text-sm font-medium">{mockSessions.length}</span>
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
            <p className="text-sm text-muted-foreground ml-11 italic">"{session.notes}"</p>
          </div>
        ))}
      </div>
    </div>
  );
}
