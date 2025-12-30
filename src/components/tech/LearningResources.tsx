import { ExternalLink, BookOpen, Video, FileText, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Resource {
  id: number;
  title: string;
  type: "article" | "video" | "course" | "book";
  source: string;
  url: string;
  category: string;
}

const mockResources: Resource[] = [
  { id: 1, title: "Designing Data-Intensive Applications", type: "book", source: "O'Reilly", url: "#", category: "System Design" },
  { id: 2, title: "NeetCode 150 Roadmap", type: "course", source: "NeetCode", url: "#", category: "DSA" },
  { id: 3, title: "Building LLM Apps", type: "video", source: "YouTube", url: "#", category: "AI/ML" },
  { id: 4, title: "React 19 Deep Dive", type: "article", source: "React Blog", url: "#", category: "Frontend" },
  { id: 5, title: "Grokking System Design", type: "course", source: "Educative", url: "#", category: "System Design" },
];

const typeIcons = {
  article: FileText,
  video: Video,
  course: BookOpen,
  book: BookOpen,
};

export function LearningResources() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-sm text-muted-foreground">Learning Resources</h2>
        <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
          <Plus className="w-3 h-3" />
          Add
        </Button>
      </div>

      <div className="space-y-0">
        {mockResources.map((resource) => {
          const Icon = typeIcons[resource.type];
          
          return (
            <a
              key={resource.id}
              href={resource.url}
              className="flex items-center justify-between py-3 border-b border-border/50 group hover:bg-muted/20 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-muted flex items-center justify-center">
                  <Icon className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium text-sm">{resource.title}</p>
                  <p className="text-xs text-muted-foreground">{resource.source} · {resource.category}</p>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
          );
        })}
      </div>
    </div>
  );
}
