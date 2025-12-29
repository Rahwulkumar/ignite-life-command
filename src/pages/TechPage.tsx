import { MainLayout } from "@/components/layout/MainLayout";
import { PageTransition } from "@/components/layout/PageTransition";
import { GradientOrb, GridPattern, ProgressRing } from "@/components/ui/decorative";
import { Code2, Plus, CheckCircle2, Circle, Clock, Sparkles, Terminal, Brain, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const problems = [
  { id: 1, title: "Two Sum", difficulty: "Easy", status: "completed", topic: "Arrays", timeSpent: "15 min" },
  { id: 2, title: "Binary Search", difficulty: "Easy", status: "completed", topic: "Search", timeSpent: "12 min" },
  { id: 3, title: "Merge Sort", difficulty: "Medium", status: "in-progress", topic: "Sorting", timeSpent: "45 min" },
  { id: 4, title: "LRU Cache", difficulty: "Medium", status: "pending", topic: "Design", timeSpent: "—" },
  { id: 5, title: "Graph BFS", difficulty: "Medium", status: "pending", topic: "Graphs", timeSpent: "—" },
];

const stats = [
  { label: "Problems Solved", value: "47", icon: CheckCircle2, progress: 47 },
  { label: "Study Hours", value: "24h", icon: Clock, progress: 60 },
  { label: "Current Streak", value: "12 days", icon: Zap, progress: 85 },
];

const difficultyConfig: Record<string, { bg: string; text: string; glow: string }> = {
  Easy: { bg: "bg-finance/10", text: "text-finance", glow: "shadow-[0_0_10px_hsl(var(--finance)/0.3)]" },
  Medium: { bg: "bg-trading/10", text: "text-trading", glow: "shadow-[0_0_10px_hsl(var(--trading)/0.3)]" },
  Hard: { bg: "bg-destructive/10", text: "text-destructive", glow: "shadow-[0_0_10px_hsl(var(--destructive)/0.3)]" },
};

const TechPage = () => {
  return (
    <MainLayout>
      <PageTransition>
        <div className="relative p-8 max-w-6xl mx-auto min-h-screen">
          {/* Background decorative elements */}
          <GradientOrb color="tech" size="lg" className="-top-20 -right-20 opacity-30" />
          <GradientOrb color="spiritual" size="sm" className="bottom-40 left-10 opacity-20" />
          <GridPattern />

          {/* Header */}
          <header className="relative flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-tech/20 to-tech/5 border border-tech/20">
                  <Code2 className="w-7 h-7 text-tech" />
                </div>
                <div className="absolute -inset-2 bg-tech/20 rounded-2xl blur-xl -z-10" />
                <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-tech animate-pulse" />
              </div>
              <div>
                <h1 className="text-3xl font-semibold tracking-tight">Tech & Learning</h1>
                <p className="text-sm text-muted-foreground">DSA, development, AI engineering</p>
              </div>
            </div>
            <Button className="gap-2 bg-tech hover:bg-tech/90 text-background">
              <Plus className="w-4 h-4" />
              Log Study
            </Button>
          </header>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
            {stats.map((stat) => (
              <div 
                key={stat.label} 
                className="group relative p-6 bg-card/80 backdrop-blur-sm rounded-2xl border border-border/50 overflow-hidden hover:border-tech/30 transition-all duration-300"
              >
                <div className="absolute inset-0 gradient-tech opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                      <stat.icon className="w-4 h-4" />
                      {stat.label}
                    </p>
                    <span className="font-mono text-3xl font-semibold">{stat.value}</span>
                  </div>
                  
                  <ProgressRing 
                    progress={stat.progress} 
                    size={50} 
                    strokeWidth={4} 
                    color="tech"
                    className="opacity-60 group-hover:opacity-100 transition-opacity"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Problems */}
          <div className="relative bg-card/80 backdrop-blur-sm rounded-2xl border border-border/50 overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-tech/50 to-transparent" />
            
            <div className="p-5 border-b border-border/50">
              <h2 className="font-medium flex items-center gap-2">
                <Terminal className="w-4 h-4 text-tech" />
                Problem Queue
              </h2>
            </div>
            <div className="divide-y divide-border/50">
              {problems.map((problem) => (
                <div key={problem.id} className="group flex items-center justify-between p-5 hover:bg-card-elevated/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center",
                      problem.status === "completed" 
                        ? "bg-gradient-to-br from-finance/20 to-finance/5" 
                        : problem.status === "in-progress"
                        ? "bg-gradient-to-br from-trading/20 to-trading/5"
                        : "bg-muted"
                    )}>
                      {problem.status === "completed" ? (
                        <CheckCircle2 className="w-5 h-5 text-finance" />
                      ) : problem.status === "in-progress" ? (
                        <Clock className="w-5 h-5 text-trading" />
                      ) : (
                        <Circle className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium flex items-center gap-2">
                        {problem.title}
                        {problem.status === "in-progress" && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-trading/10 text-trading animate-pulse">
                            In Progress
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center gap-2">
                        <Brain className="w-3 h-3" />
                        {problem.topic}
                        <span className="text-muted-foreground/50">•</span>
                        {problem.timeSpent}
                      </p>
                    </div>
                  </div>
                  <span className={cn(
                    "text-xs font-medium px-3 py-1.5 rounded-full transition-shadow",
                    difficultyConfig[problem.difficulty].bg,
                    difficultyConfig[problem.difficulty].text,
                    "group-hover:" + difficultyConfig[problem.difficulty].glow
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
