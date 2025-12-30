import { useState } from "react";
import { CheckCircle2, Circle, Clock, Plus, Filter, Code2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Problem {
  id: number;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  status: "completed" | "in-progress" | "pending";
  topic: string;
  leetcodeId?: number;
}

const mockProblems: Problem[] = [
  { id: 1, title: "Two Sum", difficulty: "Easy", status: "completed", topic: "Arrays", leetcodeId: 1 },
  { id: 2, title: "Binary Search", difficulty: "Easy", status: "completed", topic: "Search", leetcodeId: 704 },
  { id: 3, title: "Merge Sort", difficulty: "Medium", status: "in-progress", topic: "Sorting" },
  { id: 4, title: "LRU Cache", difficulty: "Medium", status: "pending", topic: "Design", leetcodeId: 146 },
  { id: 5, title: "Graph BFS", difficulty: "Medium", status: "pending", topic: "Graphs" },
  { id: 6, title: "Valid Parentheses", difficulty: "Easy", status: "completed", topic: "Stack", leetcodeId: 20 },
  { id: 7, title: "Longest Substring", difficulty: "Medium", status: "completed", topic: "Sliding Window", leetcodeId: 3 },
  { id: 8, title: "Median of Two Sorted Arrays", difficulty: "Hard", status: "pending", topic: "Binary Search", leetcodeId: 4 },
];

const topics = ["All", "Arrays", "Search", "Sorting", "Design", "Graphs", "Stack", "Sliding Window"];

export function DSATracker() {
  const [selectedTopic, setSelectedTopic] = useState("All");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  
  const filteredProblems = mockProblems
    .filter(p => selectedTopic === "All" || p.topic === selectedTopic)
    .filter(p => statusFilter === "All" || p.status === statusFilter);

  const stats = {
    completed: mockProblems.filter(p => p.status === "completed").length,
    inProgress: mockProblems.filter(p => p.status === "in-progress").length,
    total: mockProblems.length
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-sm text-muted-foreground">Problem Queue</h2>
        <Button variant="outline" size="sm" className="gap-2">
          <Plus className="w-3 h-3" />
          Add Problem
        </Button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-4">
        <button 
          onClick={() => setStatusFilter("completed")}
          className={cn(
            "p-3 rounded-lg border transition-colors text-left",
            statusFilter === "completed" ? "border-finance bg-finance/5" : "border-border/50 hover:border-border"
          )}
        >
          <p className="text-xs text-muted-foreground">Completed</p>
          <p className="text-lg font-medium text-finance">{stats.completed}</p>
        </button>
        <button 
          onClick={() => setStatusFilter("in-progress")}
          className={cn(
            "p-3 rounded-lg border transition-colors text-left",
            statusFilter === "in-progress" ? "border-trading bg-trading/5" : "border-border/50 hover:border-border"
          )}
        >
          <p className="text-xs text-muted-foreground">In Progress</p>
          <p className="text-lg font-medium text-trading">{stats.inProgress}</p>
        </button>
        <button 
          onClick={() => setStatusFilter("All")}
          className={cn(
            "p-3 rounded-lg border transition-colors text-left",
            statusFilter === "All" ? "border-foreground bg-muted" : "border-border/50 hover:border-border"
          )}
        >
          <p className="text-xs text-muted-foreground">Total</p>
          <p className="text-lg font-medium">{stats.total}</p>
        </button>
      </div>

      {/* Topic Pills */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {topics.map((topic) => (
          <button
            key={topic}
            onClick={() => setSelectedTopic(topic)}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap",
              selectedTopic === topic
                ? "bg-foreground text-background"
                : "bg-muted text-muted-foreground hover:text-foreground"
            )}
          >
            {topic}
          </button>
        ))}
      </div>

      {/* Problem List */}
      <div className="space-y-0">
        {filteredProblems.map((problem) => (
          <div
            key={problem.id}
            className="flex items-center justify-between py-4 border-b border-border/50 hover:bg-muted/20 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-4">
              {problem.status === "completed" ? (
                <CheckCircle2 className="w-5 h-5 text-finance" />
              ) : problem.status === "in-progress" ? (
                <Clock className="w-5 h-5 text-trading" />
              ) : (
                <Circle className="w-5 h-5 text-muted-foreground" />
              )}
              <div>
                <p className="font-medium flex items-center gap-2">
                  {problem.title}
                  {problem.leetcodeId && (
                    <span className="text-xs text-muted-foreground">#{problem.leetcodeId}</span>
                  )}
                </p>
                <p className="text-sm text-muted-foreground">{problem.topic}</p>
              </div>
            </div>
            <span className={cn(
              "text-sm font-medium px-2 py-0.5 rounded",
              problem.difficulty === "Easy" ? "text-finance bg-finance/10" :
              problem.difficulty === "Medium" ? "text-trading bg-trading/10" : 
              "text-destructive bg-destructive/10"
            )}>
              {problem.difficulty}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
