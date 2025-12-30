import { useState } from "react";
import { CheckCircle2, Circle, Clock, Flame, Plus, ChevronRight, Code2, Zap, Trophy } from "lucide-react";
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

const difficultyConfig = {
  Easy: { color: "text-finance", bg: "bg-finance/10", border: "border-finance/20" },
  Medium: { color: "text-trading", bg: "bg-trading/10", border: "border-trading/20" },
  Hard: { color: "text-destructive", bg: "bg-destructive/10", border: "border-destructive/20" },
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
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-border/50 bg-gradient-to-br from-card to-card/50 overflow-hidden"
    >
      {/* Header */}
      <div className="px-6 py-5 border-b border-border/50 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-tech to-tech/50 flex items-center justify-center shadow-lg shadow-tech/10">
            <Code2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Daily DSA</h3>
            <p className="text-sm text-muted-foreground">
              {completedToday > 0 ? (
                <span className="text-finance">{completedToday} solved today</span>
              ) : (
                "Solve your daily problem"
              )}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {streak > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-trading/10 border border-trading/20">
              <Flame className="w-4 h-4 text-trading" />
              <span className="font-semibold text-trading">{streak}</span>
              <span className="text-xs text-trading/70">days</span>
            </div>
          )}
          <Sheet>
            <SheetTrigger asChild>
              <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
                View all
                <ChevronRight className="w-4 h-4" />
              </button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-lg">
              <SheetHeader>
                <SheetTitle>Problem Queue</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                {/* Stats */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-4 rounded-xl bg-finance/5 border border-finance/10">
                    <Trophy className="w-4 h-4 text-finance mb-2" />
                    <p className="text-2xl font-semibold text-finance">{stats.completed}</p>
                    <p className="text-xs text-muted-foreground">Completed</p>
                  </div>
                  <div className="p-4 rounded-xl bg-muted/50">
                    <Clock className="w-4 h-4 text-muted-foreground mb-2" />
                    <p className="text-2xl font-semibold">{stats.pending}</p>
                    <p className="text-xs text-muted-foreground">In Queue</p>
                  </div>
                  <div className="p-4 rounded-xl bg-trading/5 border border-trading/10">
                    <Flame className="w-4 h-4 text-trading mb-2" />
                    <p className="text-2xl font-semibold text-trading">{streak}</p>
                    <p className="text-xs text-muted-foreground">Day Streak</p>
                  </div>
                </div>

                {/* Add Button */}
                <button
                  onClick={() => setIsAddOpen(true)}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-dashed border-border hover:border-muted-foreground/50 text-sm text-muted-foreground hover:text-foreground transition-all"
                >
                  <Plus className="w-4 h-4" />
                  Add Problem
                </button>

                {/* Problem List */}
                <div className="space-y-2">
                  {problems.map((problem) => (
                    <div
                      key={problem.id}
                      className="flex items-center gap-3 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
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
                          <Circle className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
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
                        "text-xs font-medium px-2.5 py-1 rounded-lg border",
                        difficultyConfig[problem.difficulty].color,
                        difficultyConfig[problem.difficulty].bg,
                        difficultyConfig[problem.difficulty].border
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
      <div className="p-6">
        {todaysProblem ? (
          <div className="space-y-5">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "text-xs font-medium uppercase tracking-wider",
                    todaysProblem.status === "in-progress" ? "text-trading" : "text-muted-foreground"
                  )}>
                    {todaysProblem.status === "in-progress" ? "⚡ In Progress" : "Up Next"}
                  </span>
                </div>
                <h4 className="font-semibold text-xl">
                  {todaysProblem.title}
                  {todaysProblem.leetcodeId && (
                    <span className="ml-2 text-base text-muted-foreground font-normal">#{todaysProblem.leetcodeId}</span>
                  )}
                </h4>
                <p className="text-sm text-muted-foreground">{todaysProblem.topic}</p>
              </div>
              <span className={cn(
                "text-sm font-medium px-3 py-1.5 rounded-lg border",
                difficultyConfig[todaysProblem.difficulty].color,
                difficultyConfig[todaysProblem.difficulty].bg,
                difficultyConfig[todaysProblem.difficulty].border
              )}>
                {todaysProblem.difficulty}
              </span>
            </div>

            <div className="flex gap-3">
              {todaysProblem.status === "pending" && (
                <motion.button
                  onClick={() => onStartProblem(todaysProblem.id)}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="flex-1 py-3 rounded-xl bg-muted hover:bg-muted/80 text-sm font-medium transition-colors"
                >
                  Start Problem
                </motion.button>
              )}
              {todaysProblem.status === "in-progress" && (
                <motion.button
                  onClick={() => onCompleteProblem(todaysProblem.id)}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="flex-1 py-3 rounded-xl bg-foreground text-background text-sm font-medium hover:opacity-90 transition-all flex items-center justify-center gap-2"
                >
                  <Zap className="w-4 h-4" />
                  Mark Complete
                </motion.button>
              )}
            </div>

            {/* Queue Preview */}
            {problems.filter(p => p.status === "pending").length > 0 && (
              <div className="pt-4 border-t border-border/50">
                <p className="text-xs text-muted-foreground mb-3">
                  {problems.filter(p => p.status === "pending").length} more in queue
                </p>
                <div className="flex gap-2">
                  {problems.filter(p => p.status === "pending").slice(0, 6).map((p) => (
                    <div
                      key={p.id}
                      className={cn(
                        "w-3 h-3 rounded-full",
                        p.difficulty === "Easy" ? "bg-finance" :
                        p.difficulty === "Medium" ? "bg-trading" : "bg-destructive"
                      )}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-10">
            <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-7 h-7 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground mb-4">No problems in queue</p>
            <button
              onClick={() => setIsAddOpen(true)}
              className="text-sm font-medium hover:underline"
            >
              Add your first problem →
            </button>
          </div>
        )}
      </div>

      {/* Add Problem Modal */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add DSA Problem</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <input
              type="text"
              value={newProblem.title}
              onChange={(e) => setNewProblem({ ...newProblem, title: e.target.value })}
              placeholder="Problem title"
              className="w-full px-4 py-3 rounded-xl bg-muted/30 border border-border focus:outline-none focus:ring-2 focus:ring-tech/30"
              autoFocus
            />
            <div className="flex gap-3">
              <input
                type="text"
                value={newProblem.leetcodeId}
                onChange={(e) => setNewProblem({ ...newProblem, leetcodeId: e.target.value })}
                placeholder="LC #"
                className="w-20 px-4 py-3 rounded-xl bg-muted/30 border border-border focus:outline-none focus:ring-2 focus:ring-tech/30"
              />
              <input
                type="text"
                value={newProblem.topic}
                onChange={(e) => setNewProblem({ ...newProblem, topic: e.target.value })}
                placeholder="Topic (e.g., Arrays)"
                className="flex-1 px-4 py-3 rounded-xl bg-muted/30 border border-border focus:outline-none focus:ring-2 focus:ring-tech/30"
              />
            </div>
            <div className="flex gap-2">
              {(["Easy", "Medium", "Hard"] as const).map((diff) => (
                <button
                  key={diff}
                  onClick={() => setNewProblem({ ...newProblem, difficulty: diff })}
                  className={cn(
                    "flex-1 py-3 rounded-xl text-sm font-medium transition-all border",
                    newProblem.difficulty === diff
                      ? cn(difficultyConfig[diff].color, difficultyConfig[diff].bg, difficultyConfig[diff].border)
                      : "bg-muted/30 text-muted-foreground hover:text-foreground border-transparent"
                  )}
                >
                  {diff}
                </button>
              ))}
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button 
                onClick={() => setIsAddOpen(false)} 
                className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddProblem}
                disabled={!newProblem.title.trim()}
                className="px-5 py-2 rounded-xl bg-foreground text-background text-sm font-medium disabled:opacity-50 hover:opacity-90 transition-opacity"
              >
                Add Problem
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
