import { Link } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { PageTransition } from "@/components/layout/PageTransition";
import { Briefcase, Plus, CheckCircle2, Clock, Target, StickyNote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

          <div className="px-4 sm:px-6 lg:px-8 pb-8">
            <div className="max-w-5xl mx-auto">
              <Tabs defaultValue="active" className="space-y-6">
                <TabsList className="flex-wrap">
                  <TabsTrigger value="active">Active Projects</TabsTrigger>
                  <TabsTrigger value="notes" asChild>
                    <Link to="/notes" state={{ domain: 'work' }} className="flex items-center gap-1.5">
                      <StickyNote className="w-3.5 h-3.5" />
                      Notes
                    </Link>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="active">
                  <ProjectTasks />
                </TabsContent>
              </Tabs>
            </div>
          </div>
          </div>
        </div>
      </PageTransition>
    </MainLayout>
  );
};

export default ProjectsPage;
