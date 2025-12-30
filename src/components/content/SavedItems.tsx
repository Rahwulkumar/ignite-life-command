import { ExternalLink, Video, FileText, Link2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SavedItem {
  id: number;
  title: string;
  source: string;
  type: "video" | "article" | "reel";
  date: string;
  url: string;
}

const mockItems: SavedItem[] = [
  { id: 1, title: "React Server Components Deep Dive", source: "YouTube", type: "video", date: "Today", url: "#" },
  { id: 2, title: "Minimalist Desk Setup Inspo", source: "Instagram", type: "reel", date: "Yesterday", url: "#" },
  { id: 3, title: "System Design Interview Prep", source: "YouTube", type: "video", date: "Dec 27", url: "#" },
  { id: 4, title: "Morning Routine for Productivity", source: "Instagram", type: "reel", date: "Dec 26", url: "#" },
  { id: 5, title: "Advanced TypeScript Patterns", source: "Medium", type: "article", date: "Dec 25", url: "#" },
];

const typeIcons = { video: Video, article: FileText, reel: Link2 };

export function SavedItems() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-sm text-muted-foreground">Recent Saves</h2>
        <Button variant="outline" size="sm" className="gap-2">
          <Plus className="w-3 h-3" />
          Save
        </Button>
      </div>

      <div className="space-y-0">
        {mockItems.map((item) => {
          const Icon = typeIcons[item.type];
          return (
            <a
              key={item.id}
              href={item.url}
              className="flex items-center justify-between py-4 border-b border-border/50 group hover:bg-muted/20 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-muted flex items-center justify-center">
                  <Icon className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium">{item.title}</p>
                  <p className="text-sm text-muted-foreground">{item.source} · {item.date}</p>
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
