import { useState } from "react";
import { ArrowLeft, Plus, CheckCircle2, Circle, ChevronRight, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Topic {
  id: string;
  name: string;
  status: "completed" | "in-progress" | "pending";
  notes?: string;
}

interface TechCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  topicsCount: number;
  completedCount: number;
}

interface CategoryDetailProps {
  category: TechCategory;
  onBack: () => void;
}

const defaultTopics: Record<string, Topic[]> = {
  "1": [ // Frontend
    { id: "1", name: "React Hooks", status: "completed" },
    { id: "2", name: "State Management", status: "completed" },
    { id: "3", name: "CSS Grid & Flexbox", status: "completed" },
    { id: "4", name: "TypeScript", status: "in-progress" },
    { id: "5", name: "Testing (Jest/RTL)", status: "pending" },
    { id: "6", name: "Performance Optimization", status: "pending" },
  ],
  "2": [ // AI/ML
    { id: "1", name: "Neural Networks Basics", status: "completed" },
    { id: "2", name: "PyTorch Fundamentals", status: "completed" },
    { id: "3", name: "Transformers", status: "in-progress" },
    { id: "4", name: "Fine-tuning LLMs", status: "pending" },
    { id: "5", name: "RAG Systems", status: "pending" },
  ],
  "3": [ // Backend
    { id: "1", name: "REST API Design", status: "completed" },
    { id: "2", name: "Authentication/JWT", status: "completed" },
    { id: "3", name: "Database Design", status: "completed" },
    { id: "4", name: "Caching Strategies", status: "in-progress" },
    { id: "5", name: "Message Queues", status: "pending" },
  ],
  "4": [ // System Design
    { id: "1", name: "Load Balancing", status: "completed" },
    { id: "2", name: "Database Sharding", status: "in-progress" },
    { id: "3", name: "CDN Architecture", status: "pending" },
    { id: "4", name: "Microservices", status: "pending" },
  ],
};

export function CategoryDetail({ category, onBack }: CategoryDetailProps) {
  const [topics, setTopics] = useState<Topic[]>(defaultTopics[category.id] || []);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTopicName, setNewTopicName] = useState("");

  const completedCount = topics.filter(t => t.status === "completed").length;
  const inProgressCount = topics.filter(t => t.status === "in-progress").length;

  const handleAddTopic = () => {
    if (!newTopicName.trim()) return;
    
    setTopics([
      ...topics,
      { id: Date.now().toString(), name: newTopicName.trim(), status: "pending" }
    ]);
    setNewTopicName("");
    setIsAddModalOpen(false);
  };

  const cycleStatus = (id: string) => {
    setTopics(topics.map(t => {
      if (t.id !== id) return t;
      const next: Topic["status"] = 
        t.status === "pending" ? "in-progress" : 
        t.status === "in-progress" ? "completed" : "pending";
      return { ...t, status: next };
    }));
  };

  const deleteTopic = (id: string) => {
    setTopics(topics.filter(t => t.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2 rounded-lg hover:bg-muted transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex-1">
          <h2 className="font-medium">{category.name}</h2>
          <p className="text-sm text-muted-foreground">
            {completedCount} of {topics.length} topics completed
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1 text-sm hover:underline"
        >
          <Plus className="w-3 h-3" />
          Add Topic
        </button>
      </div>

      {/* Progress */}
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{ 
            width: `${topics.length > 0 ? (completedCount / topics.length) * 100 : 0}%`,
            backgroundColor: category.color 
          }}
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
          <p className="text-xs text-muted-foreground">Completed</p>
          <p className="text-lg font-medium" style={{ color: category.color }}>{completedCount}</p>
        </div>
        <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
          <p className="text-xs text-muted-foreground">In Progress</p>
          <p className="text-lg font-medium text-trading">{inProgressCount}</p>
        </div>
        <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
          <p className="text-xs text-muted-foreground">Total</p>
          <p className="text-lg font-medium">{topics.length}</p>
        </div>
      </div>

      {/* Topics List */}
      <div className="space-y-1">
        {topics.map((topic) => (
          <div
            key={topic.id}
            className="flex items-center gap-3 py-3 px-2 rounded-lg hover:bg-muted/30 transition-colors group"
          >
            <button onClick={() => cycleStatus(topic.id)} className="flex-shrink-0">
              {topic.status === "completed" ? (
                <CheckCircle2 className="w-5 h-5" style={{ color: category.color }} />
              ) : topic.status === "in-progress" ? (
                <div className="w-5 h-5 rounded-full border-2 border-trading flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-trading" />
                </div>
              ) : (
                <Circle className="w-5 h-5 text-muted-foreground" />
              )}
            </button>
            <span className={cn(
              "flex-1 text-sm",
              topic.status === "completed" && "line-through text-muted-foreground"
            )}>
              {topic.name}
            </span>
            <button
              onClick={() => deleteTopic(topic.id)}
              className="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-muted transition-all"
            >
              <Trash2 className="w-3 h-3 text-muted-foreground" />
            </button>
          </div>
        ))}

        {topics.length === 0 && (
          <div className="text-center py-8 text-muted-foreground text-sm">
            No topics yet. Add your first topic to start tracking.
          </div>
        )}
      </div>

      {/* Add Topic Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Add Topic</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <input
              type="text"
              value={newTopicName}
              onChange={(e) => setNewTopicName(e.target.value)}
              placeholder="e.g., React Server Components"
              className="w-full px-3 py-2 rounded-lg bg-muted/50 border border-border focus:outline-none focus:ring-1 focus:ring-foreground/20"
              maxLength={50}
              onKeyDown={(e) => e.key === "Enter" && handleAddTopic()}
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 text-sm text-muted-foreground"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTopic}
                disabled={!newTopicName.trim()}
                className="px-4 py-2 rounded-lg bg-foreground text-background text-sm font-medium disabled:opacity-50"
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
