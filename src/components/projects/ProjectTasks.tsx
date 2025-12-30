import { CheckCircle2, Circle, Clock, Plus, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Task {
  id: number;
  title: string;
  status: "done" | "in-progress" | "todo";
  dueDate: string;
  priority: "high" | "medium" | "low";
}

interface Project {
  id: number;
  name: string;
  progress: number;
  tasks: Task[];
}

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

export function ProjectTasks() {
  return (
    <div className="space-y-8">
      {mockProjects.map((project) => (
        <div key={project.id} className="space-y-4">
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
            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
              <Plus className="w-3 h-3" />
              Task
            </Button>
          </div>

          <div className="space-y-0 ml-1">
            {project.tasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between py-3 border-b border-border/30">
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
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
