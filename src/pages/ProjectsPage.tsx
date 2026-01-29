import { MainLayout } from "@/components/layout/MainLayout";
import { PageTransition } from "@/components/layout/PageTransition";
import { Briefcase, Plus, CheckCircle2, Clock, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProjectTasks } from "@/components/projects/ProjectTasks";
import { DomainPageHeader } from "@/components/shared/DomainPageHeader";
import { DomainStatsBar } from "@/components/shared/DomainStatsBar";

const stats = [
  { icon: Briefcase, label: "Active", value: "3", suffix: "projects", color: "text-work" },
  { icon: CheckCircle2, label: "Completed", value: "12", suffix: "total", color: "text-finance" },
  { icon: Target, label: "Tasks", value: "32", suffix: "open", color: "text-muted-foreground" },
  { icon: Clock, label: "Due Soon", value: "5", suffix: "this week", color: "text-destructive" },
];

const ProjectsPage = () => {
  return (
    <MainLayout>
      <PageTransition>
        <div className="min-h-screen flex">
          <div className="flex-1">
            <DomainPageHeader
            icon={Briefcase}
            title="Projects"
            subtitle="Tasks, milestones, and progress tracking"
            domainColor="work"
            action={{
              icon: Plus,
              label: "New Project",
              onClick: () => console.log("New project"),
            }}
          />

          <DomainStatsBar stats={stats} />

          <div className="px-8 pb-8">
            <div className="max-w-5xl mx-auto">
              <div>
                <h2 className="text-sm text-muted-foreground mb-6">Active Projects</h2>
                <ProjectTasks />
              </div>
            </div>
          </div>
          </div>
        </div>
      </PageTransition>
    </MainLayout>
  );
};

export default ProjectsPage;
