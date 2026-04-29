import { useState } from "react";
import { motion } from "framer-motion";
import { Folder, Plus, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface ContentFolder {
  id: string;
  name: string;
  count: number;
  color: string;
}

interface ContentFoldersProps {
  folders: ContentFolder[];
  selectedFolderId?: string | null;
  onSelectFolder?: (folderId: string | null) => void;
  onNewFolder?: () => void;
}

export function ContentFolders({
  folders,
  selectedFolderId = null,
  onSelectFolder,
  onNewFolder,
}: ContentFoldersProps) {
  const [internalSelectedFolder, setInternalSelectedFolder] = useState<string | null>(null);
  const selectedFolder = onSelectFolder ? selectedFolderId : internalSelectedFolder;
  const totalItems = folders.reduce((sum, f) => sum + f.count, 0);

  const handleSelect = (folderId: string) => {
    const nextValue = selectedFolder === folderId ? null : folderId;
    if (onSelectFolder) {
      onSelectFolder(nextValue);
      return;
    }

    setInternalSelectedFolder(nextValue);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm text-muted-foreground">Folders</h2>
          <p className="text-xs text-muted-foreground mt-1">{totalItems} items total</p>
        </div>
        <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground" onClick={onNewFolder}>
          <Plus className="w-3 h-3" />
          New Folder
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {folders.length > 0 ? (
          folders.map((folder, index) => (
            <motion.div
              key={folder.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.03 }}
            >
              <button
                onClick={() => handleSelect(folder.id)}
                className={cn(
                  "w-full text-left p-4 border rounded-lg transition-all group",
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
            </motion.div>
          ))
        ) : (
          <div className="col-span-2 text-center py-8 text-muted-foreground text-sm">
            No folders created
          </div>
        )}
      </div>
    </motion.div>
  );
}
