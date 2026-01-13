import { useState, useMemo } from "react";
import { CheckCircle2, Circle, Clock, Plus, ExternalLink, Filter, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DSACalendar } from "./DSACalendar";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface Problem {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  status: "completed" | "in-progress" | "pending";
  topic: string;
  leetcodeId?: number;
  completedAt?: string;
}

const topics = ["All", "Arrays", "Strings", "Trees", "Graphs", "DP", "Stack", "Queue", "Heap", "Trie", "Design", "Binary Search"];

const mockProblems: Problem[] = [
  { id: "1", title: "Two Sum", difficulty: "Easy", status: "completed", topic: "Arrays", leetcodeId: 1, completedAt: new Date().toISOString() },
  { id: "2", title: "Valid Parentheses", difficulty: "Easy", status: "completed", topic: "Stack", leetcodeId: 20, completedAt: new Date(Date.now() - 86400000).toISOString() },
  { id: "3", title: "Merge Intervals", difficulty: "Medium", status: "in-progress", topic: "Arrays", leetcodeId: 56 },
  { id: "4", title: "LRU Cache", difficulty: "Medium", status: "pending", topic: "Design", leetcodeId: 146 },
  { id: "5", title: "Binary Tree Level Order", difficulty: "Medium", status: "pending", topic: "Trees", leetcodeId: 102 },
  { id: "6", title: "Word Search II", difficulty: "Hard", status: "pending", topic: "Trie", leetcodeId: 212 },
  { id: "7", title: "Longest Substring Without Repeating", difficulty: "Medium", status: "completed", topic: "Strings", leetcodeId: 3, completedAt: new Date(Date.now() - 172800000).toISOString() },
  { id: "8", title: "Climbing Stairs", difficulty: "Easy", status: "completed", topic: "DP", leetcodeId: 70, completedAt: new Date(Date.now() - 259200000).toISOString() },
];

export function EnhancedDSATracker() {
  const [problems, setProblems] = useState<Problem[]>(mockProblems);
  const [selectedTopic, setSelectedTopic] = useState("All");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newProblem, setNewProblem] = useState({
    title: "",
    leetcodeId: "",
    topic: "Arrays",
    difficulty: "Medium" as Problem["difficulty"],
  });

  const filteredProblems = useMemo(() => 
    problems
      .filter(p => selectedTopic === "All" || p.topic === selectedTopic)
      .filter(p => statusFilter === "All" || p.status === statusFilter),
    [problems, selectedTopic, statusFilter]
  );

  const stats = useMemo(() => ({
    completed: problems.filter(p => p.status === "completed").length,
    inProgress: problems.filter(p => p.status === "in-progress").length,
    pending: problems.filter(p => p.status === "pending").length,
    total: problems.length,
    easy: problems.filter(p => p.difficulty === "Easy" && p.status === "completed").length,
    medium: problems.filter(p => p.difficulty === "Medium" && p.status === "completed").length,
    hard: problems.filter(p => p.difficulty === "Hard" && p.status === "completed").length,
  }), [problems]);

  const completedDates = useMemo(() => 
    problems
      .filter(p => p.completedAt)
      .map(p => p.completedAt!.split("T")[0]),
    [problems]
  );

  const cycleStatus = (id: string) => {
    const statusOrder: Problem["status"][] = ["pending", "in-progress", "completed"];
    setProblems(problems.map(p => {
      if (p.id === id) {
        const currentIndex = statusOrder.indexOf(p.status);
        const nextStatus = statusOrder[(currentIndex + 1) % 3];
        return { 
          ...p, 
          status: nextStatus,
          completedAt: nextStatus === "completed" ? new Date().toISOString() : undefined,
        };
      }
      return p;
    }));
  };

  const handleAddProblem = () => {
    if (!newProblem.title.trim()) return;
    const problem: Problem = {
      id: Date.now().toString(),
      title: newProblem.title.trim(),
      leetcodeId: newProblem.leetcodeId ? parseInt(newProblem.leetcodeId) : undefined,
      topic: newProblem.topic,
      difficulty: newProblem.difficulty,
      status: "pending",
    };
    setProblems([...problems, problem]);
    setNewProblem({ title: "", leetcodeId: "", topic: "Arrays", difficulty: "Medium" });
    setIsAddOpen(false);
  };

  // Calculate streak
  const streak = useMemo(() => {
    const today = new Date();
    let currentStreak = 0;
    
    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);
      const dateStr = checkDate.toISOString().split("T")[0];
      
      if (completedDates.includes(dateStr)) {
        currentStreak++;
      } else if (i > 0) {
        break;
      }
    }
    
    return currentStreak;
  }, [completedDates]);

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-trading/10 text-trading">
            <Flame className="w-4 h-4" />
            <span className="text-sm font-medium">{streak} day streak</span>
          </div>
        </div>
        <Button onClick={() => setIsAddOpen(true)} size="sm" className="gap-2">
          <Plus className="w-3 h-3" />
          Add Problem
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-3">
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
        <button 
          onClick={() => setStatusFilter("completed")}
          className={cn(
            "p-3 rounded-lg border transition-colors text-left",
            statusFilter === "completed" ? "border-finance bg-finance/5" : "border-border/50 hover:border-border"
          )}
        >
          <p className="text-xs text-muted-foreground">Solved</p>
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
          onClick={() => setStatusFilter("pending")}
          className={cn(
            "p-3 rounded-lg border transition-colors text-left",
            statusFilter === "pending" ? "border-muted-foreground bg-muted" : "border-border/50 hover:border-border"
          )}
        >
          <p className="text-xs text-muted-foreground">Pending</p>
          <p className="text-lg font-medium">{stats.pending}</p>
        </button>
      </div>

      {/* Difficulty Breakdown */}
      <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/30 border border-border/50">
        <span className="text-sm text-muted-foreground">Solved by difficulty:</span>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-finance" />
            <span className="text-sm">Easy: {stats.easy}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-trading" />
            <span className="text-sm">Medium: {stats.medium}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-destructive" />
            <span className="text-sm">Hard: {stats.hard}</span>
          </div>
        </div>
      </div>

      {/* Activity Calendar */}
      <div className="p-4 rounded-lg border border-border/50 bg-card">
        <DSACalendar completedDates={completedDates} />
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
        {filteredProblems.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">No problems found. Try adjusting your filters.</p>
          </div>
        ) : (
          filteredProblems.map((problem) => (
            <div
              key={problem.id}
              className="flex items-center justify-between py-4 border-b border-border/50 hover:bg-muted/20 transition-colors group"
            >
              <div className="flex items-center gap-4">
                <button onClick={() => cycleStatus(problem.id)}>
                  {problem.status === "completed" ? (
                    <CheckCircle2 className="w-5 h-5 text-finance" />
                  ) : problem.status === "in-progress" ? (
                    <Clock className="w-5 h-5 text-trading" />
                  ) : (
                    <Circle className="w-5 h-5 text-muted-foreground" />
                  )}
                </button>
                <div>
                  <p className={cn(
                    "font-medium flex items-center gap-2",
                    problem.status === "completed" && "text-muted-foreground"
                  )}>
                    {problem.title}
                    {problem.leetcodeId && (
                      <a
                        href={`https://leetcode.com/problems/${problem.title.toLowerCase().replace(/\s+/g, '-')}/`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
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
          ))
        )}
      </div>

      {/* Add Problem Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Add Problem</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Problem Title</label>
              <Input
                value={newProblem.title}
                onChange={(e) => setNewProblem({ ...newProblem, title: e.target.value })}
                placeholder="e.g., Two Sum"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">LeetCode # (optional)</label>
              <Input
                value={newProblem.leetcodeId}
                onChange={(e) => setNewProblem({ ...newProblem, leetcodeId: e.target.value })}
                placeholder="e.g., 1"
                type="number"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Topic</label>
              <Select value={newProblem.topic} onValueChange={(v) => setNewProblem({ ...newProblem, topic: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {topics.filter(t => t !== "All").map((topic) => (
                    <SelectItem key={topic} value={topic}>{topic}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Difficulty</label>
              <Select 
                value={newProblem.difficulty} 
                onValueChange={(v) => setNewProblem({ ...newProblem, difficulty: v as Problem["difficulty"] })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Easy">Easy</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="ghost" onClick={() => setIsAddOpen(false)}>Cancel</Button>
              <Button onClick={handleAddProblem} disabled={!newProblem.title.trim()}>Add Problem</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
