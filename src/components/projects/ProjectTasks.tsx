import { motion } from "framer-motion";
import { CheckCircle2, Circle, Clock, Plus, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface ProjectTask {
  id: number;
  title: string;
  status: "done" | "in-progress" | "todo";
  dueDate: string;
  priority: "high" | "medium" | "low";
}

export interface Project {
  id: number;
  name: string;
  progress: number;
  tasks: ProjectTask[];
}

interface ProjectTasksProps {
  projects: Project[];
  onAddTask?: (projectId: number) => void;
}

export function ProjectTasks({ projects, onAddTask }: ProjectTasksProps) {
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
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">{project.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-work rounded-full" style={{ width: `${project.progress}%` }} />
                  </div>
                  <span className="text-xs text-muted-foreground">{project.progress}%</span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 text-muted-foreground"
                onClick={() => onAddTask?.(project.id)}
              >
                <Plus className="w-3 h-3" />
                Task
              </Button>
            </div>

            <div className="space-y-0 ml-1">
              {project.tasks.map((task, taskIndex) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: projectIndex * 0.1 + taskIndex * 0.03 }}
                  className="flex items-center justify-between py-3 border-b border-border/30"
                >
                  <div className="flex items-center gap-3">
                    {task.status === "done" ? (
                      <CheckCircle2 className="w-4 h-4 text-finance" />
                    ) : task.status === "in-progress" ? (
                      <Clock className="w-4 h-4 text-work" />
                    ) : (
                      <Circle className="w-4 h-4 text-muted-foreground" />
                    )}
                    <span className={cn("text-sm", task.status === "done" && "text-muted-foreground line-through")}>
                      {task.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "text-xs px-1.5 py-0.5 rounded",
                      task.priority === "high" ? "bg-destructive/10 text-destructive" :
                        task.priority === "medium" ? "bg-trading/10 text-trading" : "bg-muted text-muted-foreground"
                    )}>
                      {task.priority}
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {task.dueDate}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))
      ) : (
        <div className="text-center py-8 text-muted-foreground text-sm">
          No projects found
        </div>
      )}
    </motion.div>
  );
}
