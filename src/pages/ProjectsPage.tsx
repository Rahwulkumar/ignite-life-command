import { Briefcase, CheckCircle2, Clock, Target, Plus } from "lucide-react";
import { DomainPageTemplate } from "@/components/shared/DomainPageTemplate";
import { ProjectTasks } from "@/components/projects/ProjectTasks";
import { toast } from "@/hooks/use-toast";

const stats = [
  { icon: Briefcase, label: "Active", value: "3", suffix: "projects", color: "text-work" },
  { icon: CheckCircle2, label: "Completed", value: "12", suffix: "total", color: "text-finance" },
  { icon: Target, label: "Tasks", value: "32", suffix: "open", color: "text-muted-foreground" },
  { icon: Clock, label: "Due Soon", value: "5", suffix: "this week", color: "text-destructive" },
];

const ProjectsPage = () => {
  const handleNewProject = () => {
    toast({
      title: "Coming Soon",
      description: "Project creation feature is under development.",
    });
  };

  return (
    <DomainPageTemplate
      domain={{
        icon: Briefcase,
        title: "Projects",
        subtitle: "Tasks, milestones, and progress tracking",
        color: "work",
      }}
      stats={stats}
      tabs={[
        { value: "active", label: "Active Projects", component: <ProjectTasks /> },
      ]}
      headerAction={{
        icon: Plus,
        label: "New Project",
        onClick: handleNewProject,
      }}
    />
  );
};

export default ProjectsPage;
