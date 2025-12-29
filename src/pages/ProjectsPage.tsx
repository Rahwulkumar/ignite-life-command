import { MainLayout } from "@/components/layout/MainLayout";
import { PageTransition } from "@/components/layout/PageTransition";
import { Briefcase, Plus, CheckCircle2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const projects = [
  { id: 1, name: "Personal Dashboard", status: "active", progress: 65, tasks: "8/12" },
  { id: 2, name: "E-commerce API", status: "active", progress: 40, tasks: "4/10" },
  { id: 3, name: "Mobile App MVP", status: "active", progress: 20, tasks: "2/10" },
  { id: 4, name: "Blog Redesign", status: "completed", progress: 100, tasks: "12/12" },
];

const stats = [
  { label: "Active", value: "3" },
  { label: "Completed", value: "12" },
  { label: "Tasks", value: "32" },
];

const ProjectsPage = () => {
  return (
    <MainLayout>
      <PageTransition>
        <div className="p-10 max-w-4xl mx-auto">
          <header className="flex items-center justify-between mb-16">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Briefcase className="w-5 h-5 text-muted-foreground" />
                <h1 className="text-4xl font-medium tracking-tight">Projects</h1>
              </div>
              <p className="text-muted-foreground">Work and professional development</p>
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <Plus className="w-4 h-4" />
              New Project
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
            <h2 className="text-sm text-muted-foreground mb-6">All Projects</h2>
            <div className="space-y-0">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="py-5 border-b border-border/50"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {project.status === "completed" ? (
                        <CheckCircle2 className="w-4 h-4 text-finance" />
                      ) : (
                        <Clock className="w-4 h-4 text-work" />
                      )}
                      <p className="font-medium">{project.name}</p>
                    </div>
                    <span className="text-sm text-muted-foreground tabular-nums">{project.tasks}</span>
                  </div>
                  <div className="flex items-center gap-4 ml-7">
                    <div className="flex-1 h-1 bg-border rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full",
                          project.status === "completed" ? "bg-finance" : "bg-work"
                        )}
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground tabular-nums w-8">{project.progress}%</span>
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
