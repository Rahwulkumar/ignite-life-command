import { useState } from "react";
import { CheckCircle2, Circle, Clock, Flame, Plus, ChevronRight, Code2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export interface DSAProblem {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  status: "completed" | "in-progress" | "pending";
  topic: string;
  leetcodeId?: number;
  completedAt?: string;
}

interface DailyDSASectionProps {
  problems: DSAProblem[];
  streak: number;
  onAddProblem: (problem: Omit<DSAProblem, "id" | "status">) => void;
  onCompleteProblem: (id: string) => void;
  onStartProblem: (id: string) => void;
}

const difficultyColors = {
  Easy: "text-finance bg-finance/10",
  Medium: "text-trading bg-trading/10",
  Hard: "text-destructive bg-destructive/10",
};

export function DailyDSASection({
  problems,
  streak,
  onAddProblem,
  onCompleteProblem,
  onStartProblem,
}: DailyDSASectionProps) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newProblem, setNewProblem] = useState({
    title: "",
    difficulty: "Medium" as "Easy" | "Medium" | "Hard",
    topic: "",
    leetcodeId: "",
  });

  const todaysProblem = problems.find(p => p.status === "in-progress") || problems.find(p => p.status === "pending");
  const completedToday = problems.filter(p => {
    if (!p.completedAt) return false;
    const today = new Date().toDateString();
    return new Date(p.completedAt).toDateString() === today;
  }).length;

  const stats = {
    completed: problems.filter(p => p.status === "completed").length,
    pending: problems.filter(p => p.status === "pending").length,
    total: problems.length,
  };

  const handleAddProblem = () => {
    if (!newProblem.title.trim()) return;
    onAddProblem({
      title: newProblem.title.trim(),
      difficulty: newProblem.difficulty,
      topic: newProblem.topic.trim() || "General",
      leetcodeId: newProblem.leetcodeId ? parseInt(newProblem.leetcodeId) : undefined,
    });
    setNewProblem({ title: "", difficulty: "Medium", topic: "", leetcodeId: "" });
    setIsAddOpen(false);
  };

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-tech/10 flex items-center justify-center">
            <Code2 className="w-4 h-4 text-tech" />
          </div>
          <div>
            <h3 className="font-medium">Daily DSA</h3>
            <p className="text-xs text-muted-foreground">
              {completedToday > 0 ? `${completedToday} solved today` : "No problems solved today"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {streak > 0 && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-trading/10 text-trading text-sm font-medium">
              <Flame className="w-3.5 h-3.5" />
              {streak}
            </div>
          )}
          <Sheet>
            <SheetTrigger asChild>
              <button className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
                View all
                <ChevronRight className="w-4 h-4" />
              </button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-lg">
              <SheetHeader>
                <SheetTitle>DSA Problem Queue</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                {/* Stats */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground">Completed</p>
                    <p className="text-lg font-medium text-finance">{stats.completed}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground">Pending</p>
                    <p className="text-lg font-medium">{stats.pending}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground">Streak</p>
                    <p className="text-lg font-medium text-trading">{streak} days</p>
                  </div>
                </div>

                {/* Add Button */}
                <button
                  onClick={() => setIsAddOpen(true)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-dashed border-border hover:border-muted-foreground/50 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Problem
                </button>

                {/* Problem List */}
                <div className="space-y-1">
                  {problems.map((problem) => (
                    <div
                      key={problem.id}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <button
                        onClick={() => {
                          if (problem.status === "pending") onStartProblem(problem.id);
                          else if (problem.status === "in-progress") onCompleteProblem(problem.id);
                        }}
                        className="flex-shrink-0"
                      >
                        {problem.status === "completed" ? (
                          <CheckCircle2 className="w-5 h-5 text-finance" />
                        ) : problem.status === "in-progress" ? (
                          <Clock className="w-5 h-5 text-trading" />
                        ) : (
                          <Circle className="w-5 h-5 text-muted-foreground hover:text-foreground" />
                        )}
                      </button>
                      <div className="flex-1 min-w-0">
                        <p className={cn(
                          "font-medium text-sm truncate",
                          problem.status === "completed" && "text-muted-foreground line-through"
                        )}>
                          {problem.title}
                          {problem.leetcodeId && (
                            <span className="ml-2 text-xs text-muted-foreground">#{problem.leetcodeId}</span>
                          )}
                        </p>
                        <p className="text-xs text-muted-foreground">{problem.topic}</p>
                      </div>
                      <span className={cn(
                        "text-xs font-medium px-2 py-0.5 rounded",
                        difficultyColors[problem.difficulty]
                      )}>
                        {problem.difficulty}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Today's Problem */}
      <div className="p-5">
        {todaysProblem ? (
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                  {todaysProblem.status === "in-progress" ? "In Progress" : "Up Next"}
                </p>
                <h4 className="font-medium text-lg">
                  {todaysProblem.title}
                  {todaysProblem.leetcodeId && (
                    <span className="ml-2 text-sm text-muted-foreground">#{todaysProblem.leetcodeId}</span>
                  )}
                </h4>
                <p className="text-sm text-muted-foreground">{todaysProblem.topic}</p>
              </div>
              <span className={cn(
                "text-sm font-medium px-2.5 py-1 rounded",
                difficultyColors[todaysProblem.difficulty]
              )}>
                {todaysProblem.difficulty}
              </span>
            </div>

            <div className="flex gap-3">
              {todaysProblem.status === "pending" && (
                <button
                  onClick={() => onStartProblem(todaysProblem.id)}
                  className="flex-1 py-2.5 rounded-lg bg-muted hover:bg-muted/80 text-sm font-medium transition-colors"
                >
                  Start Problem
                </button>
              )}
              {todaysProblem.status === "in-progress" && (
                <button
                  onClick={() => onCompleteProblem(todaysProblem.id)}
                  className="flex-1 py-2.5 rounded-lg bg-foreground text-background text-sm font-medium hover:bg-foreground/90 transition-colors"
                >
                  Mark Complete
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-muted-foreground mb-3">No problems in queue</p>
            <button
              onClick={() => setIsAddOpen(true)}
              className="text-sm font-medium hover:underline"
            >
              Add your first problem →
            </button>
          </div>
        )}

        {/* Queue Preview */}
        {problems.filter(p => p.status === "pending").length > 0 && todaysProblem && (
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground mb-2">
              {problems.filter(p => p.status === "pending").length} more in queue
            </p>
            <div className="flex gap-1.5">
              {problems.filter(p => p.status === "pending").slice(0, 5).map((p) => (
                <div
                  key={p.id}
                  className={cn(
                    "w-2 h-2 rounded-full",
                    p.difficulty === "Easy" ? "bg-finance" :
                    p.difficulty === "Medium" ? "bg-trading" : "bg-destructive"
                  )}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add Problem Modal */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Add DSA Problem</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <input
              type="text"
              value={newProblem.title}
              onChange={(e) => setNewProblem({ ...newProblem, title: e.target.value })}
              placeholder="Problem title"
              className="w-full px-3 py-2 rounded-lg bg-muted/50 border border-border focus:outline-none focus:ring-1 focus:ring-foreground/20"
              autoFocus
            />
            <div className="flex gap-3">
              <input
                type="text"
                value={newProblem.leetcodeId}
                onChange={(e) => setNewProblem({ ...newProblem, leetcodeId: e.target.value })}
                placeholder="LeetCode #"
                className="w-24 px-3 py-2 rounded-lg bg-muted/50 border border-border focus:outline-none focus:ring-1 focus:ring-foreground/20"
              />
              <input
                type="text"
                value={newProblem.topic}
                onChange={(e) => setNewProblem({ ...newProblem, topic: e.target.value })}
                placeholder="Topic (e.g., Arrays)"
                className="flex-1 px-3 py-2 rounded-lg bg-muted/50 border border-border focus:outline-none focus:ring-1 focus:ring-foreground/20"
              />
            </div>
            <div className="flex gap-2">
              {(["Easy", "Medium", "Hard"] as const).map((diff) => (
                <button
                  key={diff}
                  onClick={() => setNewProblem({ ...newProblem, difficulty: diff })}
                  className={cn(
                    "flex-1 py-2 rounded-lg text-sm font-medium transition-colors",
                    newProblem.difficulty === diff
                      ? difficultyColors[diff]
                      : "bg-muted/50 text-muted-foreground hover:text-foreground"
                  )}
                >
                  {diff}
                </button>
              ))}
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setIsAddOpen(false)} className="px-4 py-2 text-sm text-muted-foreground">
                Cancel
              </button>
              <button
                onClick={handleAddProblem}
                disabled={!newProblem.title.trim()}
                className="px-4 py-2 rounded-lg bg-foreground text-background text-sm font-medium disabled:opacity-50"
              >
                Add
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
