import { MainLayout } from "@/components/layout/MainLayout";
import { PageTransition } from "@/components/layout/PageTransition";
import { Briefcase, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProjectTasks } from "@/components/projects/ProjectTasks";

const stats = [
  { label: "Active", value: "3" },
  { label: "Completed", value: "12" },
  { label: "Tasks", value: "32" },
];

const ProjectsPage = () => {
  return (
    <MainLayout>
      <PageTransition>
        <div className="p-10 max-w-5xl mx-auto">
          <header className="flex items-center justify-between mb-10">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Briefcase className="w-5 h-5 text-muted-foreground" />
                <h1 className="text-4xl font-medium tracking-tight">Projects</h1>
              </div>
              <p className="text-muted-foreground">Tasks, milestones, and progress tracking</p>
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <Plus className="w-4 h-4" />
              New Project
            </Button>
          </header>

          <div className="grid grid-cols-3 gap-8 mb-10">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                <p className="text-2xl font-medium tabular-nums">{stat.value}</p>
              </div>
            ))}
          </div>

          <div>
            <h2 className="text-sm text-muted-foreground mb-6">Active Projects</h2>
            <ProjectTasks />
          </div>
        </div>
      </PageTransition>
    </MainLayout>
  );
};

export default ProjectsPage;
