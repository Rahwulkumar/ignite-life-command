import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ExternalLink, BookOpen, Video, FileText, Plus, Star,
  GraduationCap, Pin, PinOff, MoreHorizontal, Trash2,
  Search, Filter, Grid3X3, List
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface TechResource {
  id: string;
  title: string;
  type: "article" | "video" | "course" | "book";
  source: string;
  url: string;
  category: string;
  pinned: boolean;
  rating?: number;
}

const categories = ["All", "Frontend", "Backend", "AI/ML", "Cloud", "System Design", "DevOps", "Security"];
const resourceTypes = ["article", "video", "course", "book"] as const;

const typeConfig = {
  article: { icon: FileText, color: "text-blue-400", bg: "bg-blue-500/10" },
  video: { icon: Video, color: "text-red-400", bg: "bg-red-500/10" },
  course: { icon: GraduationCap, color: "text-purple-400", bg: "bg-purple-500/10" },
  book: { icon: BookOpen, color: "text-amber-400", bg: "bg-amber-500/10" },
};

interface TechLibraryProps {
  initialResources: TechResource[];
}

export function TechLibrary({ initialResources }: TechLibraryProps) {
  const [resources, setResources] = useState<TechResource[]>(initialResources);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newResource, setNewResource] = useState({
    title: "",
    type: "article" as TechResource["type"],
    source: "",
    url: "",
    category: "Frontend",
    rating: 3,
  });

  const filteredResources = resources
    .filter(r => selectedCategory === "All" || r.category === selectedCategory)
    .filter(r =>
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.source.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const pinnedResources = filteredResources.filter(r => r.pinned);
  const unpinnedResources = filteredResources.filter(r => !r.pinned);

  const togglePin = (id: string) => {
    setResources(resources.map(r =>
      r.id === id ? { ...r, pinned: !r.pinned } : r
    ));
  };

  const deleteResource = (id: string) => {
    setResources(resources.filter(r => r.id !== id));
  };

  const handleAddResource = () => {
    if (!newResource.title.trim()) return;
    const resource: TechResource = {
      id: Date.now().toString(),
      title: newResource.title.trim(),
      type: newResource.type,
      source: newResource.source.trim() || "Added",
      url: newResource.url.trim() || "#",
      category: newResource.category,
      pinned: false,
      rating: newResource.rating,
    };
    setResources([resource, ...resources]);
    setNewResource({ title: "", type: "article", source: "", url: "", category: "Frontend", rating: 3 });
    setIsAddOpen(false);
  };

  const ResourceCard = ({ resource }: { resource: TechResource }) => {
    const config = typeConfig[resource.type];
    const Icon = config.icon;

    if (viewMode === "list") {
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={cn(
            "group flex items-center gap-4 p-4",
            "rounded-xl border border-border/50 bg-card/80",
            "hover:border-border transition-colors"
          )}
        >
          <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center shrink-0", config.bg)}>
            <Icon className={cn("w-5 h-5", config.color)} />
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="font-medium truncate">{resource.title}</h4>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{resource.source}</span>
              <span>•</span>
              <span>{resource.category}</span>
            </div>
          </div>

          {resource.rating && (
            <div className="flex items-center gap-0.5 shrink-0">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "w-3.5 h-3.5",
                    i < resource.rating! ? "text-amber-400 fill-amber-400" : "text-muted"
                  )}
                />
              ))}
            </div>
          )}

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => togglePin(resource.id)}
            >
              {resource.pinned ? <PinOff className="w-4 h-4" /> : <Pin className="w-4 h-4" />}
            </Button>
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 hover:bg-muted rounded-lg"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => deleteResource(resource.id)}
                  className="text-destructive"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </motion.div>
      );
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -2 }}
        className={cn(
          "group relative rounded-xl border border-border/50 bg-card/80",
          "p-5 transition-all duration-200",
          "hover:border-border hover:shadow-md"
        )}
      >
        {resource.pinned && (
          <div className="absolute top-3 right-3">
            <Pin className="w-3.5 h-3.5 text-tech" />
          </div>
        )}

        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-4", config.bg)}>
          <Icon className={cn("w-6 h-6", config.color)} />
        </div>

        <h4 className="font-medium mb-1 line-clamp-2">{resource.title}</h4>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
          <span>{resource.source}</span>
          <span>•</span>
          <span className="capitalize">{resource.type}</span>
        </div>

        {resource.rating && (
          <div className="flex items-center gap-0.5 mb-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "w-3.5 h-3.5",
                  i < resource.rating! ? "text-amber-400 fill-amber-400" : "text-muted"
                )}
              />
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-border/50">
          <span className="text-xs text-muted-foreground">{resource.category}</span>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => togglePin(resource.id)}
            >
              {resource.pinned ? <PinOff className="w-3.5 h-3.5" /> : <Pin className="w-3.5 h-3.5" />}
            </Button>
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 hover:bg-muted rounded"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 w-full">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search resources..."
              className="pl-9"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex gap-1 p-1 bg-muted/50 rounded-lg">
            <button
              onClick={() => setViewMode("grid")}
              className={cn(
                "p-1.5 rounded transition-colors",
                viewMode === "grid" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
              )}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={cn(
                "p-1.5 rounded transition-colors",
                viewMode === "list" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
              )}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <Button onClick={() => setIsAddOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Resource
          </Button>
        </div>
      </div>

      {/* Category pills */}
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

      {/* Pinned Section */}
      {pinnedResources.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
            <Pin className="w-3.5 h-3.5" />
            Pinned Resources
          </h3>
          <div className={cn(
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              : "space-y-2"
          )}>
            {pinnedResources.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        </div>
      )}

      {/* All Resources */}
      {unpinnedResources.length > 0 && (
        <div>
          {pinnedResources.length > 0 && (
            <h3 className="text-sm font-medium text-muted-foreground mb-3">
              All Resources
            </h3>
          )}
          <div className={cn(
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              : "space-y-2"
          )}>
            {unpinnedResources.map((resource, index) => (
              <motion.div
                key={resource.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
              >
                <ResourceCard resource={resource} />
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {filteredResources.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 border border-dashed border-border rounded-xl"
        >
          <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No resources found</h3>
          <p className="text-muted-foreground mb-6">
            {searchQuery ? "Try adjusting your search" : "Start building your tech library"}
          </p>
          {!searchQuery && (
            <Button onClick={() => setIsAddOpen(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Your First Resource
            </Button>
          )}
        </motion.div>
      )}

      {/* Add Resource Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Resource</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
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
                onValueChange={(v) => setNewResource({ ...newResource, type: v as TechResource["type"] })}
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
                placeholder="e.g., O'Reilly, YouTube"
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
            <div>
              <label className="text-sm font-medium mb-2 block">Rating</label>
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setNewResource({ ...newResource, rating: i + 1 })}
                    className="p-1"
                  >
                    <Star
                      className={cn(
                        "w-5 h-5 transition-colors",
                        i < newResource.rating ? "text-amber-400 fill-amber-400" : "text-muted hover:text-amber-400"
                      )}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="ghost" onClick={() => setIsAddOpen(false)}>Cancel</Button>
              <Button onClick={handleAddResource} disabled={!newResource.title.trim()}>Add Resource</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
