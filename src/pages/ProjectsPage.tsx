import { MainLayout } from "@/components/layout/MainLayout";
import { PageTransition } from "@/components/layout/PageTransition";
import { Briefcase, Plus, Circle, CheckCircle2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const projects = [
  { id: 1, name: "Personal Dashboard", status: "active", progress: 65, tasks: "8/12 tasks" },
  { id: 2, name: "E-commerce API", status: "active", progress: 40, tasks: "4/10 tasks" },
  { id: 3, name: "Mobile App MVP", status: "active", progress: 20, tasks: "2/10 tasks" },
  { id: 4, name: "Blog Redesign", status: "completed", progress: 100, tasks: "12/12 tasks" },
];

const stats = [
  { label: "Active Projects", value: "3" },
  { label: "Completed", value: "12" },
  { label: "Total Tasks", value: "32" },
];

const ProjectsPage = () => {
  return (
    <MainLayout>
      <PageTransition>
        <div className="p-8 max-w-6xl mx-auto">
        {/* Header */}
        <header className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-work/10">
              <Briefcase className="w-6 h-6 text-work" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Projects</h1>
              <p className="text-sm text-muted-foreground">Work and professional development</p>
            </div>
          </div>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            New Project
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

        {/* Projects List */}
        <div className="bg-card rounded-xl border border-border/50">
          <div className="p-5 border-b border-border/50">
            <h2 className="font-medium">All Projects</h2>
          </div>
          <div className="divide-y divide-border/50">
            {projects.map((project) => (
              <div key={project.id} className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {project.status === "completed" ? (
                      <CheckCircle2 className="w-5 h-5 text-finance" />
                    ) : (
                      <Clock className="w-5 h-5 text-work" />
                    )}
                    <p className="font-medium">{project.name}</p>
                  </div>
                  <span className="text-sm text-muted-foreground">{project.tasks}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all",
                        project.status === "completed" ? "bg-finance" : "bg-work"
                      )}
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground font-mono">{project.progress}%</span>
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
