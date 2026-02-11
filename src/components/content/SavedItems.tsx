import { motion } from "framer-motion";
import { ExternalLink, Video, FileText, Link2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface SavedItem {
  id: number;
  title: string;
  source: string;
  type: "video" | "article" | "reel";
  date: string;
  url: string;
}

const typeIcons = { video: Video, article: FileText, reel: Link2 };

interface SavedItemsProps {
  items: SavedItem[];
  onSaveItem?: () => void;
}

export function SavedItems({ items, onSaveItem }: SavedItemsProps) {
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
              </motion.a>
            );
          })
        ) : (
          <div className="text-center py-8 text-muted-foreground text-sm">
            No saved items
          </div>
        )}
      </div>
    </motion.div>
  );
}
