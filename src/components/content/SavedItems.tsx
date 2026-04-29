import { motion } from "framer-motion";
import {
  Bookmark,
  ExternalLink,
  FileText,
  Link2,
  Mic2,
  Plus,
  Video,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface SavedItem {
  id: string;
  title: string;
  source: string;
  type: "video" | "article" | "reel" | "post" | "podcast" | "resource";
  date: string;
  url: string;
  summary?: string | null;
  folderName?: string | null;
}

const typeIcons = {
  video: Video,
  article: FileText,
  reel: Link2,
  post: Bookmark,
  podcast: Mic2,
  resource: Bookmark,
};

interface SavedItemsProps {
  items: SavedItem[];
  onSaveItem?: () => void;
  emptyStateMessage?: string;
}

export function SavedItems({
  items,
  onSaveItem,
  emptyStateMessage = "No saved items yet",
}: SavedItemsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-sm text-muted-foreground">Recent Saves</h2>
        <Button variant="outline" size="sm" className="gap-2" onClick={onSaveItem}>
          <Plus className="w-3 h-3" />
          Save
        </Button>
      </div>

      <div className="space-y-0">
        {items.length > 0 ? (
          items.map((item, index) => {
            const Icon = typeIcons[item.type];
            return (
              <motion.a
                key={item.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.03 }}
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-start justify-between gap-3 py-4 border-b border-border/50 group hover:bg-muted/20 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 w-8 h-8 rounded bg-muted flex items-center justify-center">
                    <Icon className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium">{item.title}</p>
                      {item.folderName ? <Badge variant="outline">{item.folderName}</Badge> : null}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {item.source} · {item.date}
                    </p>
                    {item.summary ? (
                      <p className="mt-1 max-w-xl text-sm text-muted-foreground/90">
                        {item.summary}
                      </p>
                    ) : null}
                  </div>
                </div>
                <ExternalLink className="mt-1 w-4 h-4 shrink-0 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.a>
            );
          })
        ) : (
          <div className="text-center py-8 text-muted-foreground text-sm">
            {emptyStateMessage}
          </div>
        )}
      </div>
    </motion.div>
  );
}
