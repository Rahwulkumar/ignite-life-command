import { motion } from "framer-motion";
import { Calendar, CheckCircle2, Circle, Clock, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import type {
  ProjectTaskRecord,
  ProjectTaskStatus,
  ProjectWithTasks,
} from "@/hooks/useProjects";
import { cn } from "@/lib/utils";

function formatDueDate(dueDate: string | null) {
  if (!dueDate) return "No due date";

  return new Date(`${dueDate}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function getNextStatus(status: ProjectTaskStatus): ProjectTaskStatus {
  if (status === "todo") return "in-progress";
  if (status === "in-progress") return "done";
  return "todo";
}

interface ProjectTasksProps {
  projects: ProjectWithTasks[];
  updatingTaskId?: string;
  onAddTask?: (projectId: string) => void;
  onToggleTaskStatus?: (
    task: ProjectTaskRecord,
    nextStatus: ProjectTaskStatus
  ) => void;
}

export function ProjectTasks({
  projects,
  updatingTaskId,
  onAddTask,
  onToggleTaskStatus,
}: ProjectTasksProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      {projects.length > 0 ? (
        projects.map((project, projectIndex) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: projectIndex * 0.1 }}
            className="space-y-4 rounded-2xl border border-border bg-card/50 p-5"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <div>
                  <h3 className="font-medium">{project.name}</h3>
                  {project.description && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      {project.description}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-24 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-work"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                    <span>{project.progress}% complete</span>
                  </div>

                  {project.targetDate && (
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Target {formatDueDate(project.targetDate)}
                    </span>
                  )}
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                className="gap-2 text-muted-foreground"
                onClick={() => onAddTask?.(project.id)}
              >
                <Plus className="h-3 w-3" />
                Task
              </Button>
            </div>

            <div className="space-y-0">
              {project.tasks.length > 0 ? (
                project.tasks.map((task, taskIndex) => {
                  const nextStatus = getNextStatus(task.status);

                  return (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.3,
                        delay: projectIndex * 0.1 + taskIndex * 0.03,
                      }}
                      className="flex items-center justify-between gap-3 border-b border-border/30 py-3 last:border-b-0"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <button
                          type="button"
                          onClick={() => onToggleTaskStatus?.(task, nextStatus)}
                          disabled={updatingTaskId === task.id}
                          className="shrink-0"
                          title={`Mark as ${nextStatus}`}
                        >
                          {task.status === "done" ? (
                            <CheckCircle2 className="h-4 w-4 text-finance" />
                          ) : task.status === "in-progress" ? (
                            <Clock className="h-4 w-4 text-work" />
                          ) : (
                            <Circle className="h-4 w-4 text-muted-foreground" />
                          )}
                        </button>

                        <div className="min-w-0">
                          <p
                            className={cn(
                              "text-sm",
                              task.status === "done" &&
                                "text-muted-foreground line-through"
                            )}
                          >
                            {task.title}
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            Click the status icon to move between todo, in progress,
                            and done.
                          </p>
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center gap-2">
                        <span
                          className={cn(
                            "rounded px-1.5 py-0.5 text-xs",
                            task.priority === "high"
                              ? "bg-destructive/10 text-destructive"
                              : task.priority === "medium"
                                ? "bg-trading/10 text-trading"
                                : "bg-muted text-muted-foreground"
                          )}
                        >
                          {task.priority}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {formatDueDate(task.dueDate)}
                        </span>
                      </div>
                    </motion.div>
                  );
                })
              ) : (
                <div className="rounded-xl border border-dashed border-border/60 px-4 py-6 text-center text-sm text-muted-foreground">
                  No tasks yet. Add the first task for this project.
                </div>
              )}
            </div>
          </motion.div>
        ))
      ) : (
        <div className="rounded-2xl border border-dashed border-border/60 py-12 text-center text-sm text-muted-foreground">
          No projects yet. Create your first project to start tracking work.
        </div>
      )}
    </motion.div>
  );
}
