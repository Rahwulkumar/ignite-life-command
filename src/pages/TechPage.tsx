import { MainLayout } from "@/components/layout/MainLayout";
import { PageTransition } from "@/components/layout/PageTransition";
import { Code2, Plus, CheckCircle2, Circle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const problems = [
  { id: 1, title: "Two Sum", difficulty: "Easy", status: "completed", topic: "Arrays" },
  { id: 2, title: "Binary Search", difficulty: "Easy", status: "completed", topic: "Search" },
  { id: 3, title: "Merge Sort", difficulty: "Medium", status: "in-progress", topic: "Sorting" },
  { id: 4, title: "LRU Cache", difficulty: "Medium", status: "pending", topic: "Design" },
  { id: 5, title: "Graph BFS", difficulty: "Medium", status: "pending", topic: "Graphs" },
];

const stats = [
  { label: "Problems Solved", value: "47" },
  { label: "Study Hours", value: "24h" },
  { label: "Current Streak", value: "12 days" },
];

const difficultyColors: Record<string, string> = {
  Easy: "text-finance bg-finance/10",
  Medium: "text-trading bg-trading/10",
  Hard: "text-destructive bg-destructive/10",
};

const TechPage = () => {
  return (
    <MainLayout>
      <PageTransition>
        <div className="p-8 max-w-6xl mx-auto">
        {/* Header */}
        <header className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-tech/10">
              <Code2 className="w-6 h-6 text-tech" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Tech & Learning</h1>
              <p className="text-sm text-muted-foreground">DSA, development, AI engineering</p>
            </div>
          </div>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Log Study
          </Button>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {stats.map((stat) => (
            <div key={stat.label} className="p-5 bg-card rounded-xl border border-border/50">
              <p className="text-sm text-muted-foreground mb-2">{stat.label}</p>
              <span className="font-mono text-2xl font-medium">{stat.value}</span>
            </div>
          ))}
        </div>

        {/* Problems */}
        <div className="bg-card rounded-xl border border-border/50">
          <div className="p-5 border-b border-border/50">
            <h2 className="font-medium">Problem Queue</h2>
          </div>
          <div className="divide-y divide-border/50">
            {problems.map((problem) => (
              <div key={problem.id} className="flex items-center justify-between p-5">
                <div className="flex items-center gap-4">
                  {problem.status === "completed" ? (
                    <CheckCircle2 className="w-5 h-5 text-finance" />
                  ) : problem.status === "in-progress" ? (
                    <Clock className="w-5 h-5 text-trading" />
                  ) : (
                    <Circle className="w-5 h-5 text-muted-foreground" />
                  )}
                  <div>
                    <p className="font-medium text-sm">{problem.title}</p>
                    <p className="text-xs text-muted-foreground">{problem.topic}</p>
                  </div>
                </div>
                <span className={cn(
                  "text-xs font-medium px-2.5 py-1 rounded-full",
                  difficultyColors[problem.difficulty]
                )}>
                  {problem.difficulty}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      </PageTransition>
    </MainLayout>
  );
};

export default TechPage;
