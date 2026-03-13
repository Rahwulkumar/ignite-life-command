import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export type ProjectTaskStatus = "todo" | "in-progress" | "done";
export type ProjectTaskPriority = "high" | "medium" | "low";

export interface ProjectTaskRecord {
  id: string;
  userId: string;
  projectId: string;
  title: string;
  status: ProjectTaskStatus;
  dueDate: string | null;
  priority: ProjectTaskPriority;
  orderIndex: number | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface ProjectRecord {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  targetDate: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface ProjectWithTasks extends ProjectRecord {
  tasks: ProjectTaskRecord[];
  progress: number;
}

export interface ProjectStats {
  activeProjects: number;
  completedProjects: number;
  openTasks: number;
  dueSoonTasks: number;
}

function parseDateOnly(value: string): Date {
  return new Date(`${value}T00:00:00`);
}

export function calculateProjectProgress(tasks: ProjectTaskRecord[]) {
  if (tasks.length === 0) return 0;
  const completedTasks = tasks.filter((task) => task.status === "done").length;
  return Math.round((completedTasks / tasks.length) * 100);
}

export function calculateProjectStats(projects: ProjectWithTasks[]): ProjectStats {
  const completedProjects = projects.filter(
    (project) => project.tasks.length > 0 && project.progress === 100
  ).length;
  const activeProjects = projects.length - completedProjects;
  const openTasks = projects.flatMap((project) => project.tasks).filter(
    (task) => task.status !== "done"
  ).length;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);

  const dueSoonTasks = projects
    .flatMap((project) => project.tasks)
    .filter((task) => {
      if (!task.dueDate || task.status === "done") return false;
      const dueDate = parseDateOnly(task.dueDate);
      return dueDate >= today && dueDate <= nextWeek;
    }).length;

  return {
    activeProjects,
    completedProjects,
    openTasks,
    dueSoonTasks,
  };
}

export function useProjects() {
  return useQuery({
    queryKey: ["projects"],
    queryFn: () => api.get<ProjectWithTasks[]>("/api/projects"),
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      name,
      description,
      targetDate,
    }: {
      name: string;
      description?: string;
      targetDate?: string;
    }) =>
      api.post<ProjectRecord>("/api/projects", {
        name,
        description,
        targetDate,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<Pick<ProjectRecord, "name" | "description" | "targetDate">>;
    }) => api.patch<ProjectRecord>(`/api/projects/${id}`, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      api.delete<{ success: boolean }>(`/api/projects/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}

export function useCreateProjectTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      title,
      dueDate,
      priority,
    }: {
      projectId: string;
      title: string;
      dueDate?: string;
      priority?: ProjectTaskPriority;
    }) =>
      api.post<ProjectTaskRecord>(`/api/projects/${projectId}/tasks`, {
        title,
        dueDate,
        priority,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}

export function useUpdateProjectTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<
        Pick<ProjectTaskRecord, "title" | "status" | "dueDate" | "priority" | "orderIndex">
      >;
    }) => api.patch<ProjectTaskRecord>(`/api/project-tasks/${id}`, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}

export function useDeleteProjectTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      api.delete<{ success: boolean }>(`/api/project-tasks/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}
