import { useState } from "react";
import { Plus, ChevronRight, Layers, Brain, Server, Smartphone, Database, Cloud, Shield, Palette } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export interface TechCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  topicsCount: number;
  completedCount: number;
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

interface TechCategoriesProps {
  initialCategories: TechCategory[];
  onSelectCategory: (category: TechCategory) => void;
}

export function TechCategories({ initialCategories, onSelectCategory }: TechCategoriesProps) {
  const [categories, setCategories] = useState<TechCategory[]>(initialCategories);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: "",
    icon: "layers",
    color: colorOptions[0].value,
  });

  const handleAddCategory = () => {
    if (!newCategory.name.trim()) return;

    const category: TechCategory = {
      id: Date.now().toString(),
      name: newCategory.name.trim(),
      icon: newCategory.icon,
      color: newCategory.color,
      topicsCount: 0,
      completedCount: 0,
    };

    setCategories([...categories, category]);
    setNewCategory({ name: "", icon: "layers", color: colorOptions[0].value });
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Learning Tracks</p>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1 text-sm hover:underline"
        >
          <Plus className="w-3 h-3" />
          Add
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {categories.map((category) => {
          const Icon = iconMap[category.icon] || Layers;
          const progress = category.topicsCount > 0
            ? (category.completedCount / category.topicsCount) * 100
            : 0;

          return (
            <button
              key={category.id}
              onClick={() => onSelectCategory(category)}
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
                {category.completedCount}/{category.topicsCount} topics
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
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
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
                  const Icon = iconMap[opt.value];
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
                      <Icon className="w-4 h-4" />
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
                onClick={() => setIsAddModalOpen(false)}
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
