import { useState } from "react";
import { Folder, Plus, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ContentFolder {
  id: number;
  name: string;
  count: number;
  color: string;
}

const mockFolders: ContentFolder[] = [
  { id: 1, name: "Learning", count: 34, color: "bg-tech" },
  { id: 2, name: "Entertainment", count: 45, color: "bg-music" },
  { id: 3, name: "Inspiration", count: 28, color: "bg-spiritual" },
  { id: 4, name: "Tech Tutorials", count: 21, color: "bg-trading" },
  { id: 5, name: "Music Theory", count: 15, color: "bg-music" },
  { id: 6, name: "Design Inspo", count: 32, color: "bg-content" },
  { id: 7, name: "Productivity", count: 18, color: "bg-finance" },
  { id: 8, name: "Watch Later", count: 67, color: "bg-muted-foreground" },
];

export function ContentFolders() {
  const [selectedFolder, setSelectedFolder] = useState<number | null>(null);
  const totalItems = mockFolders.reduce((sum, f) => sum + f.count, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm text-muted-foreground">Folders</h2>
          <p className="text-xs text-muted-foreground mt-1">{totalItems} items total</p>
        </div>
        <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
          <Plus className="w-3 h-3" />
          New Folder
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {mockFolders.map((folder) => (
          <button
            key={folder.id}
            onClick={() => setSelectedFolder(folder.id === selectedFolder ? null : folder.id)}
            className={cn(
              "text-left p-4 border rounded-lg transition-all group",
              selectedFolder === folder.id
                ? "border-foreground bg-muted"
                : "border-border/50 hover:border-border"
            )}
          >
            <div className="flex items-start justify-between mb-3">
              <div className={cn(
                "w-8 h-8 rounded flex items-center justify-center",
                folder.color + "/10"
              )}>
                <Folder className={cn("w-4 h-4", folder.color.replace("bg-", "text-"))} />
              </div>
              <MoreHorizontal className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="font-medium text-sm">{folder.name}</p>
            <p className="text-xs text-muted-foreground">{folder.count} items</p>
          </button>
        ))}
      </div>
    </div>
  );
}
