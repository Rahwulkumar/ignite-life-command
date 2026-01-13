import { useState } from "react";
import { ExternalLink, BookOpen, Video, FileText, Plus, Check, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Resource {
  id: string;
  title: string;
  type: "article" | "video" | "course" | "book";
  source: string;
  url: string;
  category: string;
  completed: boolean;
}

const categories = ["All", "DSA", "System Design", "Frontend", "Backend", "AI/ML", "DevOps"];
const resourceTypes = ["article", "video", "course", "book"];

const typeIcons = {
  article: FileText,
  video: Video,
  course: GraduationCap,
  book: BookOpen,
};

const mockResources: Resource[] = [
  { id: "1", title: "Designing Data-Intensive Applications", type: "book", source: "O'Reilly", url: "#", category: "System Design", completed: false },
  { id: "2", title: "NeetCode 150 Roadmap", type: "course", source: "NeetCode", url: "#", category: "DSA", completed: true },
  { id: "3", title: "Building LLM Apps", type: "video", source: "YouTube", url: "#", category: "AI/ML", completed: false },
  { id: "4", title: "React 19 Deep Dive", type: "article", source: "React Blog", url: "#", category: "Frontend", completed: true },
  { id: "5", title: "Grokking System Design", type: "course", source: "Educative", url: "#", category: "System Design", completed: false },
  { id: "6", title: "Clean Code", type: "book", source: "Martin Fowler", url: "#", category: "Backend", completed: true },
  { id: "7", title: "Docker for Beginners", type: "video", source: "freeCodeCamp", url: "#", category: "DevOps", completed: false },
];

export function EnhancedResources() {
  const [resources, setResources] = useState<Resource[]>(mockResources);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showCompleted, setShowCompleted] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newResource, setNewResource] = useState({
    title: "",
    type: "article" as Resource["type"],
    source: "",
    url: "",
    category: "DSA",
  });

  const filteredResources = resources
    .filter(r => selectedCategory === "All" || r.category === selectedCategory)
    .filter(r => showCompleted || !r.completed);

  const completedCount = resources.filter(r => r.completed).length;

  const toggleComplete = (id: string) => {
    setResources(resources.map(r => 
      r.id === id ? { ...r, completed: !r.completed } : r
    ));
  };

  const handleAddResource = () => {
    if (!newResource.title.trim()) return;
    const resource: Resource = {
      id: Date.now().toString(),
      title: newResource.title.trim(),
      type: newResource.type,
      source: newResource.source.trim() || "Added",
      url: newResource.url.trim() || "#",
      category: newResource.category,
      completed: false,
    };
    setResources([resource, ...resources]);
    setNewResource({ title: "", type: "article", source: "", url: "", category: "DSA" });
    setIsAddOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">
            {completedCount}/{resources.length} completed
          </span>
          <button
            onClick={() => setShowCompleted(!showCompleted)}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            {showCompleted ? "Hide completed" : "Show completed"}
          </button>
        </div>
        <Button onClick={() => setIsAddOpen(true)} size="sm" className="gap-2">
          <Plus className="w-3 h-3" />
          Add Resource
        </Button>
      </div>

      {/* Category Pills */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap",
              selectedCategory === cat
                ? "bg-foreground text-background"
                : "bg-muted text-muted-foreground hover:text-foreground"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Resource List */}
      <div className="space-y-0">
        {filteredResources.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">No resources found.</p>
          </div>
        ) : (
          filteredResources.map((resource) => {
            const Icon = typeIcons[resource.type];
            
            return (
              <div
                key={resource.id}
                className="flex items-center justify-between py-3 border-b border-border/50 group hover:bg-muted/20 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleComplete(resource.id)}
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center transition-colors shrink-0",
                      resource.completed 
                        ? "bg-finance/10 text-finance" 
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    )}
                  >
                    {resource.completed ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                  </button>
                  <div>
                    <p className={cn(
                      "font-medium text-sm",
                      resource.completed && "text-muted-foreground line-through"
                    )}>
                      {resource.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {resource.source} · {resource.category} · {resource.type}
                    </p>
                  </div>
                </div>
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-muted rounded"
                >
                  <ExternalLink className="w-4 h-4 text-muted-foreground" />
                </a>
              </div>
            );
          })
        )}
      </div>

      {/* Add Resource Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Add Resource</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Title</label>
              <Input
                value={newResource.title}
                onChange={(e) => setNewResource({ ...newResource, title: e.target.value })}
                placeholder="e.g., Clean Code"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Type</label>
              <Select 
                value={newResource.type} 
                onValueChange={(v) => setNewResource({ ...newResource, type: v as Resource["type"] })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {resourceTypes.map((type) => (
                    <SelectItem key={type} value={type} className="capitalize">{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Source</label>
              <Input
                value={newResource.source}
                onChange={(e) => setNewResource({ ...newResource, source: e.target.value })}
                placeholder="e.g., YouTube, Udemy"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Category</label>
              <Select 
                value={newResource.category} 
                onValueChange={(v) => setNewResource({ ...newResource, category: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.filter(c => c !== "All").map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">URL (optional)</label>
              <Input
                value={newResource.url}
                onChange={(e) => setNewResource({ ...newResource, url: e.target.value })}
                placeholder="https://..."
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="ghost" onClick={() => setIsAddOpen(false)}>Cancel</Button>
              <Button onClick={handleAddResource} disabled={!newResource.title.trim()}>Add Resource</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
