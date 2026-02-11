import { ExternalLink, BookOpen, Video, FileText, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface LearningResource {
  id: number;
  title: string;
  type: "article" | "video" | "course" | "book";
  source: string;
  url: string;
  category: string;
}

interface LearningResourcesProps {
  resources: LearningResource[];
  onAddClick?: () => void;
}

const typeIcons = {
  article: FileText,
  video: Video,
  course: BookOpen,
  book: BookOpen,
};

export function LearningResources({ resources, onAddClick }: LearningResourcesProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-sm text-muted-foreground">Learning Resources</h2>
        <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground" onClick={onAddClick}>
          <Plus className="w-3 h-3" />
          Add
        </Button>
      </div>

      <div className="space-y-0">
        {resources.length > 0 ? (
          resources.map((resource) => {
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
          })
        ) : (
          <div className="text-center py-8 text-muted-foreground text-sm">
            No resources available
          </div>
        )}
      </div>
    </div>
  );
}
