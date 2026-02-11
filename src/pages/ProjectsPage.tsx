import { Briefcase, CheckCircle2, Clock, Target, Plus } from "lucide-react";
import { DomainPageTemplate } from "@/components/shared/DomainPageTemplate";
import { ProjectTasks, Project } from "@/components/projects/ProjectTasks";
import { toast } from "@/hooks/use-toast";

// Mock data for Projects domain
const mockProjects: Project[] = [
  {
    id: 1,
    name: "Personal Dashboard",
    progress: 65,
    tasks: [
      { id: 1, title: "Implement auth flow", status: "done", dueDate: "Dec 28", priority: "high" },
      { id: 2, title: "Add data persistence", status: "in-progress", dueDate: "Dec 30", priority: "high" },
      { id: 3, title: "Polish UI animations", status: "todo", dueDate: "Jan 2", priority: "medium" },
    ]
  },
  {
    id: 2,
    name: "E-commerce API",
    progress: 40,
    tasks: [
      { id: 4, title: "Setup Stripe integration", status: "in-progress", dueDate: "Dec 31", priority: "high" },
      { id: 5, title: "Order management endpoints", status: "todo", dueDate: "Jan 3", priority: "medium" },
    ]
  },
];

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
        { value: "active", label: "Active Projects", component: <ProjectTasks projects={mockProjects} /> },
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
