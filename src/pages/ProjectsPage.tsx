import { MainLayout } from "@/components/layout/MainLayout";
import { PageTransition } from "@/components/layout/PageTransition";
import { GradientOrb, GridPattern, ProgressRing } from "@/components/ui/decorative";
import { Briefcase, Plus, CheckCircle2, Clock, Sparkles, Target, Layers, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const projects = [
  { id: 1, name: "Personal Dashboard", status: "active", progress: 65, tasks: "8/12 tasks", emoji: "📊", priority: "high" },
  { id: 2, name: "E-commerce API", status: "active", progress: 40, tasks: "4/10 tasks", emoji: "🛒", priority: "medium" },
  { id: 3, name: "Mobile App MVP", status: "active", progress: 20, tasks: "2/10 tasks", emoji: "📱", priority: "high" },
  { id: 4, name: "Blog Redesign", status: "completed", progress: 100, tasks: "12/12 tasks", emoji: "✍️", priority: "low" },
];

const stats = [
  { label: "Active Projects", value: "3", icon: Layers, progress: 75 },
  { label: "Completed", value: "12", icon: CheckCircle2, progress: 100 },
  { label: "Total Tasks", value: "32", icon: Target, progress: 68 },
];

const priorityConfig: Record<string, { bg: string; text: string; dot: string }> = {
  high: { bg: "bg-destructive/10", text: "text-destructive", dot: "bg-destructive" },
  medium: { bg: "bg-trading/10", text: "text-trading", dot: "bg-trading" },
  low: { bg: "bg-finance/10", text: "text-finance", dot: "bg-finance" },
};

const ProjectsPage = () => {
  return (
    <MainLayout>
      <PageTransition>
        <div className="relative p-8 max-w-6xl mx-auto min-h-screen">
          {/* Background decorative elements */}
          <GradientOrb color="work" size="lg" className="-top-20 -right-20 opacity-30" />
          <GradientOrb color="tech" size="sm" className="bottom-40 left-10 opacity-20" />
          <GridPattern />

          {/* Header */}
          <header className="relative flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-work/20 to-work/5 border border-work/20">
                  <Briefcase className="w-7 h-7 text-work" />
                </div>
                <div className="absolute -inset-2 bg-work/20 rounded-2xl blur-xl -z-10" />
                <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-work animate-pulse" />
              </div>
              <div>
                <h1 className="text-3xl font-semibold tracking-tight">Projects</h1>
                <p className="text-sm text-muted-foreground">Work and professional development</p>
              </div>
            </div>
            <Button className="gap-2 bg-work hover:bg-work/90 text-background">
              <Plus className="w-4 h-4" />
              New Project
            </Button>
          </header>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
            {stats.map((stat) => (
              <div 
                key={stat.label} 
                className="group relative p-6 bg-card/80 backdrop-blur-sm rounded-2xl border border-border/50 overflow-hidden hover:border-work/30 transition-all duration-300"
              >
                <div className="absolute inset-0 gradient-work opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
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
                    color="work"
                    className="opacity-60 group-hover:opacity-100 transition-opacity"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Projects List */}
          <div className="relative bg-card/80 backdrop-blur-sm rounded-2xl border border-border/50 overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-work/50 to-transparent" />
            
            <div className="p-5 border-b border-border/50">
              <h2 className="font-medium flex items-center gap-2">
                <Layers className="w-4 h-4 text-work" />
                All Projects
              </h2>
            </div>
            <div className="divide-y divide-border/50">
              {projects.map((project) => (
                <div key={project.id} className="group p-5 hover:bg-card-elevated/50 transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center text-2xl",
                        project.status === "completed"
                          ? "bg-gradient-to-br from-finance/20 to-finance/5"
                          : "bg-gradient-to-br from-work/20 to-work/5"
                      )}>
                        {project.emoji}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{project.name}</p>
                          {project.status === "completed" ? (
                            <CheckCircle2 className="w-4 h-4 text-finance" />
                          ) : (
                            <span className={cn(
                              "text-[10px] font-medium px-1.5 py-0.5 rounded-full flex items-center gap-1",
                              priorityConfig[project.priority].bg,
                              priorityConfig[project.priority].text
                            )}>
                              <span className={cn("w-1 h-1 rounded-full", priorityConfig[project.priority].dot)} />
                              {project.priority}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground flex items-center gap-2">
                          <Clock className="w-3 h-3" />
                          {project.tasks}
                        </p>
                      </div>
                    </div>
                    <button className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground">
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {/* Enhanced progress bar */}
                  <div className="flex items-center gap-4">
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all duration-500",
                          project.status === "completed" 
                            ? "bg-gradient-to-r from-finance to-finance/80" 
                            : "bg-gradient-to-r from-work to-work/80"
                        )}
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground font-mono w-12 text-right">
                      {project.progress}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </PageTransition>
    </MainLayout>
  );
};

export default ProjectsPage;
