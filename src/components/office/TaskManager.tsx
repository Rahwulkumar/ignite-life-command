import { useState, useEffect } from "react";
import { Plus, CheckCircle2, Circle, Clock, AlertTriangle, Trash2, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";

interface Task {
  id: string;
  title: string;
  description: string | null;
  status: "todo" | "in_progress" | "done";
  priority: "low" | "medium" | "high" | "urgent";
  due_date: string | null;
  source: string;
  created_at: string;
}

const priorityColors = {
  low: "text-muted-foreground",
  medium: "text-blue-400",
  high: "text-orange-400",
  urgent: "text-red-400",
};

const priorityIcons = {
  low: null,
  medium: null,
  high: AlertTriangle,
  urgent: AlertTriangle,
};

interface TaskManagerProps {
  compact?: boolean;
}

export function TaskManager({ compact = false }: TaskManagerProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [filter, setFilter] = useState<"all" | "todo" | "in_progress" | "done">("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  async function fetchTasks() {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("office_tasks")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching tasks:", error);
    } else {
      setTasks((data || []).map(t => ({
        ...t,
        status: t.status as Task["status"],
        priority: t.priority as Task["priority"],
      })));
    }
    setIsLoading(false);
  }

  async function createTask(e: React.FormEvent) {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const { data, error } = await supabase
      .from("office_tasks")
      .insert({ title: newTaskTitle.trim() })
      .select()
      .single();

    if (error) {
      console.error("Error creating task:", error);
    } else if (data) {
      setTasks([{
        ...data,
        status: data.status as Task["status"],
        priority: data.priority as Task["priority"],
      }, ...tasks]);
      setNewTaskTitle("");
    }
  }

  async function updateTaskStatus(id: string, status: Task["status"]) {
    const { error } = await supabase
      .from("office_tasks")
      .update({ status })
      .eq("id", id);

    if (error) {
      console.error("Error updating task:", error);
    } else {
      setTasks(tasks.map((t) => (t.id === id ? { ...t, status } : t)));
    }
  }

  async function updateTaskPriority(id: string, priority: Task["priority"]) {
    const { error } = await supabase
      .from("office_tasks")
      .update({ priority })
      .eq("id", id);

    if (error) {
      console.error("Error updating task:", error);
    } else {
      setTasks(tasks.map((t) => (t.id === id ? { ...t, priority } : t)));
    }
  }

  async function deleteTask(id: string) {
    const { error } = await supabase
      .from("office_tasks")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting task:", error);
    } else {
      setTasks(tasks.filter((t) => t.id !== id));
    }
  }

  const filteredTasks = filter === "all" 
    ? tasks 
    : tasks.filter((t) => t.status === filter);

  const taskCounts = {
    all: tasks.length,
    todo: tasks.filter((t) => t.status === "todo").length,
    in_progress: tasks.filter((t) => t.status === "in_progress").length,
    done: tasks.filter((t) => t.status === "done").length,
  };

  if (compact) {
    // Compact view for dashboard card
    return (
      <div className="space-y-2">
        {tasks.slice(0, 4).map((task) => (
          <div
            key={task.id}
            className="flex items-center gap-2 text-sm"
          >
            <button
              onClick={() => 
                updateTaskStatus(
                  task.id, 
                  task.status === "done" ? "todo" : "done"
                )
              }
            >
              {task.status === "done" ? (
                <CheckCircle2 className="w-4 h-4 text-green-500" />
              ) : (
                <Circle className="w-4 h-4 text-muted-foreground" />
              )}
            </button>
            <span className={cn(
              "truncate",
              task.status === "done" && "line-through text-muted-foreground"
            )}>
              {task.title}
            </span>
          </div>
        ))}
        {tasks.length === 0 && (
          <p className="text-sm text-muted-foreground">No tasks yet</p>
        )}
        {tasks.length > 4 && (
          <p className="text-xs text-muted-foreground">+{tasks.length - 4} more</p>
        )}
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Quick Add */}
      <form onSubmit={createTask} className="p-4 border-b border-border">
        <div className="flex gap-2">
          <Input
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="Add a new task..."
            className="flex-1"
          />
          <Button type="submit" size="sm" disabled={!newTaskTitle.trim()}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </form>

      {/* Filter Tabs */}
      <div className="flex gap-1 px-4 py-2 border-b border-border">
        {(["all", "todo", "in_progress", "done"] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={cn(
              "px-3 py-1.5 text-sm rounded-md transition-colors",
              filter === status
                ? "bg-muted text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {status === "all" ? "All" : status === "in_progress" ? "In Progress" : status === "todo" ? "To Do" : "Done"}
            <span className="ml-1.5 text-xs opacity-70">({taskCounts[status]})</span>
          </button>
        ))}
      </div>

      {/* Task List */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              className={cn(
                "group flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors",
                task.status === "done" && "opacity-60"
              )}
            >
              <button
                onClick={() => 
                  updateTaskStatus(
                    task.id, 
                    task.status === "done" ? "todo" : task.status === "todo" ? "in_progress" : "done"
                  )
                }
                className="mt-0.5"
              >
                {task.status === "done" ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                ) : task.status === "in_progress" ? (
                  <Clock className="w-5 h-5 text-blue-400" />
                ) : (
                  <Circle className="w-5 h-5 text-muted-foreground" />
                )}
              </button>

              <div className="flex-1 min-w-0">
                <p className={cn(
                  "text-sm font-medium",
                  task.status === "done" && "line-through text-muted-foreground"
                )}>
                  {task.title}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <Select
                    value={task.priority}
                    onValueChange={(value: Task["priority"]) => updateTaskPriority(task.id, value)}
                  >
                    <SelectTrigger className="h-6 w-20 text-xs border-none bg-transparent p-0">
                      <span className={cn("capitalize", priorityColors[task.priority])}>
                        {task.priority}
                      </span>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                  {task.due_date && (
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      {format(new Date(task.due_date), "MMM d")}
                    </span>
                  )}
                  {task.source === "email" && (
                    <Badge variant="secondary" className="text-xs">
                      From Email
                    </Badge>
                  )}
                </div>
              </div>

              <button
                onClick={() => deleteTask(task.id)}
                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-muted rounded transition-all"
              >
                <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
              </button>
            </div>
          ))}

          {filteredTasks.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <CheckCircle2 className="w-10 h-10 mx-auto mb-3 opacity-50" />
              <p className="text-sm">No tasks found</p>
              <p className="text-xs mt-1">Add a new task above to get started</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
