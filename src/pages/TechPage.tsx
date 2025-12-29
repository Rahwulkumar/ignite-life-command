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
  { label: "Solved", value: "47" },
  { label: "Hours", value: "24h" },
  { label: "Streak", value: "12d" },
];

const TechPage = () => {
  return (
    <MainLayout>
      <PageTransition>
        <div className="p-10 max-w-4xl mx-auto">
          <header className="flex items-center justify-between mb-16">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Code2 className="w-5 h-5 text-muted-foreground" />
                <h1 className="text-4xl font-medium tracking-tight">Tech</h1>
              </div>
              <p className="text-muted-foreground">DSA, development, AI engineering</p>
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <Plus className="w-4 h-4" />
              Log Study
            </Button>
          </header>

          <div className="grid grid-cols-3 gap-8 mb-16">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                <p className="text-2xl font-medium tabular-nums">{stat.value}</p>
              </div>
            ))}
          </div>

          <div>
            <h2 className="text-sm text-muted-foreground mb-6">Problem Queue</h2>
            <div className="space-y-0">
              {problems.map((problem) => (
                <div
                  key={problem.id}
                  className="flex items-center justify-between py-4 border-b border-border/50"
                >
                  <div className="flex items-center gap-4">
                    {problem.status === "completed" ? (
                      <CheckCircle2 className="w-4 h-4 text-finance" />
                    ) : problem.status === "in-progress" ? (
                      <Clock className="w-4 h-4 text-trading" />
                    ) : (
                      <Circle className="w-4 h-4 text-muted-foreground" />
                    )}
                    <div>
                      <p className="font-medium">{problem.title}</p>
                      <p className="text-sm text-muted-foreground">{problem.topic}</p>
                    </div>
                  </div>
                  <span className={cn(
                    "text-sm",
                    problem.difficulty === "Easy" ? "text-finance" :
                    problem.difficulty === "Medium" ? "text-trading" : "text-destructive"
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
