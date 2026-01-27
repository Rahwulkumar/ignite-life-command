import { LayoutGrid, Layers, Target, Newspaper, Minus } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export type LayoutStyle = "bento" | "hero" | "rows" | "magazine" | "minimal";

interface LayoutSwitcherProps {
  currentLayout: LayoutStyle;
  onLayoutChange: (layout: LayoutStyle) => void;
}

const layouts = [
  { id: "bento" as const, icon: LayoutGrid, label: "Bento" },
  { id: "hero" as const, icon: Target, label: "Hero" },
  { id: "rows" as const, icon: Layers, label: "Rows" },
  { id: "magazine" as const, icon: Newspaper, label: "Magazine" },
  { id: "minimal" as const, icon: Minus, label: "Minimal" },
];

export function LayoutSwitcher({ currentLayout, onLayoutChange }: LayoutSwitcherProps) {
  return (
    <div className="flex items-center gap-2 p-1 rounded-lg bg-muted/50 border border-border">
      {layouts.map((layout) => (
        <motion.button
          key={layout.id}
          onClick={() => onLayoutChange(layout.id)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
            currentLayout === layout.id
              ? "bg-foreground text-background"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <layout.icon className="w-3.5 h-3.5" />
          {layout.label}
        </motion.button>
      ))}
    </div>
  );
}
