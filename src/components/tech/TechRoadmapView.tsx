import { useState } from "react";
import { ArrowLeft, ChevronRight, Layers, Brain, Server, Cloud, Smartphone, Database, Shield, Palette, Plus, Check, Clock, Circle, MoreHorizontal, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Topic {
  id: string;
  name: string;
  status: "pending" | "in-progress" | "completed";
  notes?: string;
}

interface TechCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  topics: Topic[];
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  layers: Layers,
  brain: Brain,
  server: Server,
  smartphone: Smartphone,
  database: Database,
  cloud: Cloud,
  shield: Shield,
  palette: Palette,
};

const colorOptions = [
  { name: "Blue", value: "hsl(217, 91%, 60%)" },
  { name: "Green", value: "hsl(142, 71%, 45%)" },
  { name: "Purple", value: "hsl(262, 83%, 58%)" },
  { name: "Orange", value: "hsl(24, 95%, 53%)" },
  { name: "Pink", value: "hsl(330, 81%, 60%)" },
  { name: "Cyan", value: "hsl(186, 94%, 41%)" },
];

const iconOptions = [
  { name: "Layers", value: "layers" },
  { name: "Brain", value: "brain" },
  { name: "Server", value: "server" },
  { name: "Mobile", value: "smartphone" },
  { name: "Database", value: "database" },
  { name: "Cloud", value: "cloud" },
  { name: "Security", value: "shield" },
  { name: "Design", value: "palette" },
];

const defaultCategories: TechCategory[] = [
  { 
    id: "1", 
    name: "Frontend", 
    icon: "layers", 
    color: "hsl(217, 91%, 60%)",
    topics: [
      { id: "1-1", name: "React Fundamentals", status: "completed" },
      { id: "1-2", name: "Next.js App Router", status: "completed" },
      { id: "1-3", name: "State Management", status: "in-progress" },
      { id: "1-4", name: "Performance Optimization", status: "pending" },
      { id: "1-5", name: "Testing with Vitest", status: "pending" },
    ]
  },
  { 
    id: "2", 
    name: "AI/ML", 
    icon: "brain", 
    color: "hsl(262, 83%, 58%)",
    topics: [
      { id: "2-1", name: "ML Fundamentals", status: "completed" },
      { id: "2-2", name: "Neural Networks", status: "in-progress" },
      { id: "2-3", name: "LLMs & Transformers", status: "pending" },
      { id: "2-4", name: "RAG Applications", status: "pending" },
    ]
  },
  { 
    id: "3", 
    name: "Backend", 
    icon: "server", 
    color: "hsl(142, 71%, 45%)",
    topics: [
      { id: "3-1", name: "Node.js", status: "completed" },
      { id: "3-2", name: "REST API Design", status: "completed" },
      { id: "3-3", name: "GraphQL", status: "in-progress" },
      { id: "3-4", name: "Authentication", status: "completed" },
    ]
  },
  { 
    id: "4", 
    name: "System Design", 
    icon: "cloud", 
    color: "hsl(24, 95%, 53%)",
    topics: [
      { id: "4-1", name: "Load Balancing", status: "completed" },
      { id: "4-2", name: "Caching Strategies", status: "in-progress" },
      { id: "4-3", name: "Database Sharding", status: "pending" },
      { id: "4-4", name: "Microservices", status: "pending" },
    ]
  },
  { 
    id: "5", 
    name: "DevOps", 
    icon: "cloud", 
    color: "hsl(186, 94%, 41%)",
    topics: [
      { id: "5-1", name: "Docker", status: "completed" },
      { id: "5-2", name: "Kubernetes", status: "pending" },
      { id: "5-3", name: "CI/CD Pipelines", status: "in-progress" },
    ]
  },
  { 
    id: "6", 
    name: "Databases", 
    icon: "database", 
    color: "hsl(330, 81%, 60%)",
    topics: [
      { id: "6-1", name: "PostgreSQL", status: "completed" },
      { id: "6-2", name: "Redis", status: "completed" },
      { id: "6-3", name: "MongoDB", status: "pending" },
    ]
  },
];

export function TechRoadmapView() {
  const [categories, setCategories] = useState<TechCategory[]>(defaultCategories);
  const [selectedCategory, setSelectedCategory] = useState<TechCategory | null>(null);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [isAddTopicOpen, setIsAddTopicOpen] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: "", icon: "layers", color: colorOptions[0].value });
  const [newTopicName, setNewTopicName] = useState("");

  const handleAddCategory = () => {
    if (!newCategory.name.trim()) return;
    const category: TechCategory = {
      id: Date.now().toString(),
      name: newCategory.name.trim(),
      icon: newCategory.icon,
      color: newCategory.color,
      topics: [],
    };
    setCategories([...categories, category]);
    setNewCategory({ name: "", icon: "layers", color: colorOptions[0].value });
    setIsAddCategoryOpen(false);
  };

  const handleAddTopic = () => {
    if (!newTopicName.trim() || !selectedCategory) return;
    const topic: Topic = {
      id: Date.now().toString(),
      name: newTopicName.trim(),
      status: "pending",
    };
    setCategories(categories.map(c => 
      c.id === selectedCategory.id 
        ? { ...c, topics: [...c.topics, topic] }
        : c
    ));
    setSelectedCategory({ ...selectedCategory, topics: [...selectedCategory.topics, topic] });
    setNewTopicName("");
    setIsAddTopicOpen(false);
  };

  const cycleStatus = (categoryId: string, topicId: string) => {
    const statusOrder: Topic["status"][] = ["pending", "in-progress", "completed"];
    setCategories(categories.map(c => {
      if (c.id === categoryId) {
        const updatedTopics = c.topics.map(t => {
          if (t.id === topicId) {
            const currentIndex = statusOrder.indexOf(t.status);
            const nextStatus = statusOrder[(currentIndex + 1) % 3];
            return { ...t, status: nextStatus };
          }
          return t;
        });
        if (selectedCategory?.id === categoryId) {
          setSelectedCategory({ ...c, topics: updatedTopics });
        }
        return { ...c, topics: updatedTopics };
      }
      return c;
    }));
  };

  const deleteTopic = (categoryId: string, topicId: string) => {
    setCategories(categories.map(c => {
      if (c.id === categoryId) {
        const updatedTopics = c.topics.filter(t => t.id !== topicId);
        if (selectedCategory?.id === categoryId) {
          setSelectedCategory({ ...c, topics: updatedTopics });
        }
        return { ...c, topics: updatedTopics };
      }
      return c;
    }));
  };

  // Detail View
  if (selectedCategory) {
    const Icon = iconMap[selectedCategory.icon] || Layers;
    const completed = selectedCategory.topics.filter(t => t.status === "completed").length;
    const progress = selectedCategory.topics.length > 0 
      ? (completed / selectedCategory.topics.length) * 100 
      : 0;

    return (
      <div className="space-y-6">
        <button
          onClick={() => setSelectedCategory(null)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Roadmap
        </button>

        <div className="flex items-center gap-4">
          <div
            className="p-3 rounded-xl"
            style={{ backgroundColor: `${selectedCategory.color}20` }}
          >
            <Icon className="w-6 h-6" style={{ color: selectedCategory.color }} />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold">{selectedCategory.name}</h2>
            <p className="text-sm text-muted-foreground">
              {completed}/{selectedCategory.topics.length} topics completed
            </p>
          </div>
        </div>

        <Progress value={progress} className="h-2" />

        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Topics</p>
          <button
            onClick={() => setIsAddTopicOpen(true)}
            className="flex items-center gap-1 text-sm hover:underline"
          >
            <Plus className="w-3 h-3" />
            Add Topic
          </button>
        </div>

        <div className="space-y-2">
          {selectedCategory.topics.map((topic) => (
            <div
              key={topic.id}
              className="flex items-center gap-3 p-3 rounded-lg border border-border/50 hover:bg-muted/30 transition-colors group"
            >
              <button
                onClick={() => cycleStatus(selectedCategory.id, topic.id)}
                className="shrink-0"
              >
                {topic.status === "completed" ? (
                  <Check className="w-5 h-5 text-finance" />
                ) : topic.status === "in-progress" ? (
                  <Clock className="w-5 h-5 text-trading" />
                ) : (
                  <Circle className="w-5 h-5 text-muted-foreground" />
                )}
              </button>
              <span className={cn(
                "flex-1 text-sm",
                topic.status === "completed" && "text-muted-foreground line-through"
              )}>
                {topic.name}
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => deleteTopic(selectedCategory.id, topic.id)}
                    className="text-destructive"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}

          {selectedCategory.topics.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-sm">No topics yet. Add your first topic to get started.</p>
            </div>
          )}
        </div>

        {/* Add Topic Modal */}
        <Dialog open={isAddTopicOpen} onOpenChange={setIsAddTopicOpen}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Add Topic</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <input
                type="text"
                value={newTopicName}
                onChange={(e) => setNewTopicName(e.target.value)}
                placeholder="e.g., React Hooks, SQL Joins"
                className="w-full px-3 py-2 rounded-lg bg-muted/50 border border-border focus:outline-none focus:ring-1 focus:ring-foreground/20"
                onKeyDown={(e) => e.key === "Enter" && handleAddTopic()}
              />
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setIsAddTopicOpen(false)}
                  className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddTopic}
                  disabled={!newTopicName.trim()}
                  className="px-4 py-2 rounded-lg bg-foreground text-background text-sm font-medium hover:bg-foreground/90 disabled:opacity-50"
                >
                  Add
                </button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // Overview Grid
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Learning Tracks</p>
        <button
          onClick={() => setIsAddCategoryOpen(true)}
          className="flex items-center gap-1 text-sm hover:underline"
        >
          <Plus className="w-3 h-3" />
          Add Category
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => {
          const Icon = iconMap[category.icon] || Layers;
          const completed = category.topics.filter(t => t.status === "completed").length;
          const progress = category.topics.length > 0 
            ? (completed / category.topics.length) * 100 
            : 0;

          return (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category)}
              className="p-4 rounded-xl border border-border hover:border-foreground/20 transition-all text-left group bg-card"
            >
              <div className="flex items-start justify-between mb-3">
                <div
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: `${category.color}20` }}
                >
                  <Icon className="w-4 h-4" style={{ color: category.color }} />
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              <p className="font-medium mb-1">{category.name}</p>
              <p className="text-xs text-muted-foreground mb-3">
                {completed}/{category.topics.length} topics
              </p>

              <div className="h-1 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${progress}%`, backgroundColor: category.color }}
                />
              </div>
            </button>
          );
        })}
      </div>

      {/* Add Category Modal */}
      <Dialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Add Tech Category</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Name</label>
              <input
                type="text"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                placeholder="e.g., DevOps, Blockchain"
                className="w-full px-3 py-2 rounded-lg bg-muted/50 border border-border focus:outline-none focus:ring-1 focus:ring-foreground/20"
                maxLength={30}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Icon</label>
              <div className="flex flex-wrap gap-2">
                {iconOptions.map((opt) => {
                  const OptIcon = iconMap[opt.value];
                  return (
                    <button
                      key={opt.value}
                      onClick={() => setNewCategory({ ...newCategory, icon: opt.value })}
                      className={cn(
                        "p-2 rounded-lg border transition-colors",
                        newCategory.icon === opt.value
                          ? "border-foreground bg-foreground/10"
                          : "border-border hover:border-foreground/30"
                      )}
                    >
                      <OptIcon className="w-4 h-4" />
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Color</label>
              <div className="flex gap-2">
                {colorOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setNewCategory({ ...newCategory, color: opt.value })}
                    className={cn(
                      "w-8 h-8 rounded-full transition-transform",
                      newCategory.color === opt.value && "ring-2 ring-offset-2 ring-offset-background ring-foreground scale-110"
                    )}
                    style={{ backgroundColor: opt.value }}
                  />
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setIsAddCategoryOpen(false)}
                className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCategory}
                disabled={!newCategory.name.trim()}
                className="px-4 py-2 rounded-lg bg-foreground text-background text-sm font-medium hover:bg-foreground/90 disabled:opacity-50"
              >
                Add Category
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
