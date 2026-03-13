import { useMemo, useState } from "react";
import { Briefcase, CheckCircle2, Clock, Plus, Target } from "lucide-react";
import { AddProjectDialog } from "@/components/projects/AddProjectDialog";
import { AddProjectTaskDialog } from "@/components/projects/AddProjectTaskDialog";
import { ProjectTasks } from "@/components/projects/ProjectTasks";
import { DomainPageTemplate } from "@/components/shared/DomainPageTemplate";
import {
  calculateProjectStats,
  useCreateProject,
  useCreateProjectTask,
  useProjects,
  useUpdateProjectTask,
  type ProjectTaskRecord,
  type ProjectTaskStatus,
} from "@/hooks/useProjects";
import { toast } from "@/hooks/use-toast";

const ProjectsPage = () => {
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  const { data: projects = [], isLoading } = useProjects();
  const createProject = useCreateProject();
  const createProjectTask = useCreateProjectTask();
  const updateProjectTask = useUpdateProjectTask();

  const projectStats = useMemo(
    () => calculateProjectStats(projects),
    [projects]
  );

  const selectedProject =
    projects.find((project) => project.id === selectedProjectId) ?? null;

  const stats = [
    {
      icon: Briefcase,
      label: "Active",
      value: isLoading ? "..." : projectStats.activeProjects,
      suffix: "projects",
      color: "text-work",
    },
    {
      icon: CheckCircle2,
      label: "Completed",
      value: isLoading ? "..." : projectStats.completedProjects,
      suffix: "projects",
      color: "text-finance",
    },
    {
      icon: Target,
      label: "Tasks",
      value: isLoading ? "..." : projectStats.openTasks,
      suffix: "open",
      color: "text-muted-foreground",
    },
    {
      icon: Clock,
      label: "Due Soon",
      value: isLoading ? "..." : projectStats.dueSoonTasks,
      suffix: "7 days",
      color: "text-destructive",
    },
  ];

  const handleCreateProject = (project: {
    name: string;
    description?: string;
    targetDate?: string;
  }) => {
    createProject.mutate(project, {
      onSuccess: () => {
        setIsCreateProjectOpen(false);
        toast({
          title: "Project created",
          description: `"${project.name}" is now being tracked.`,
        });
      },
      onError: (error) => {
        toast({
          title: "Unable to create project",
          description:
            error instanceof Error ? error.message : "Please try again.",
          variant: "destructive",
        });
      },
    });
  };

  const handleCreateTask = (task: {
    title: string;
    dueDate?: string;
    priority: "high" | "medium" | "low";
  }) => {
    if (!selectedProjectId) return;

    createProjectTask.mutate(
      { projectId: selectedProjectId, ...task },
      {
        onSuccess: () => {
          toast({
            title: "Task added",
            description: `"${task.title}" was added to ${selectedProject?.name ?? "the project"}.`,
          });
          setSelectedProjectId(null);
        },
        onError: (error) => {
          toast({
            title: "Unable to add task",
            description:
              error instanceof Error ? error.message : "Please try again.",
            variant: "destructive",
          });
        },
      }
    );
  };

  const handleToggleTaskStatus = (
    task: ProjectTaskRecord,
    nextStatus: ProjectTaskStatus
  ) => {
    updateProjectTask.mutate(
      {
        id: task.id,
        updates: { status: nextStatus },
      },
      {
        onError: (error) => {
          toast({
            title: "Unable to update task",
            description:
              error instanceof Error ? error.message : "Please try again.",
            variant: "destructive",
          });
        },
      }
    );
  };

  return (
    <>
      <DomainPageTemplate
        domain={{
          icon: Briefcase,
          title: "Projects",
          subtitle: "Tasks, milestones, and progress tracking",
          color: "work",
        }}
        stats={stats}
        tabs={[
          {
            value: "projects",
            label: "Projects",
            component: (
              <ProjectTasks
                projects={projects}
                updatingTaskId={
                  updateProjectTask.isPending
                    ? updateProjectTask.variables?.id
                    : undefined
                }
                onAddTask={(projectId) => setSelectedProjectId(projectId)}
                onToggleTaskStatus={handleToggleTaskStatus}
              />
            ),
          },
        ]}
        headerAction={{
          icon: Plus,
          label: "New Project",
          onClick: () => setIsCreateProjectOpen(true),
        }}
      />

      <AddProjectDialog
        open={isCreateProjectOpen}
        onOpenChange={setIsCreateProjectOpen}
        onSave={handleCreateProject}
      />

      <AddProjectTaskDialog
        open={!!selectedProjectId}
        onOpenChange={(open) => {
          if (!open) setSelectedProjectId(null);
        }}
        projectName={selectedProject?.name ?? "Project"}
        onSave={handleCreateTask}
      />
    </>
  );
};

export default ProjectsPage;
