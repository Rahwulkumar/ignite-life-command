import { LayoutGrid, Layers, Target, Newspaper, Minus, Cherry, Zap, Cloud } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export type LayoutStyle = "bento" | "hero" | "rows" | "magazine" | "minimal" | "sakura" | "neon" | "ghibli";

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
  { id: "sakura" as const, icon: Cherry, label: "Sakura", color: "text-pink-400" },
  { id: "neon" as const, icon: Zap, label: "Neon", color: "text-cyan-400" },
  { id: "ghibli" as const, icon: Cloud, label: "Ghibli", color: "text-sky-400" },
];

export function LayoutSwitcher({ currentLayout, onLayoutChange }: LayoutSwitcherProps) {
  return (
    <div className="flex items-center gap-1.5 p-1 rounded-lg bg-muted/50 border border-border flex-wrap">
      {layouts.map((layout) => {
        const isAnimeTheme = layout.id === "sakura" || layout.id === "neon" || layout.id === "ghibli";
        const isActive = currentLayout === layout.id;
        
        return (
          <motion.button
            key={layout.id}
            onClick={() => onLayoutChange(layout.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200",
              isActive && !isAnimeTheme && "bg-foreground text-background",
              isActive && layout.id === "sakura" && "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-500/25",
              isActive && layout.id === "neon" && "bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg shadow-cyan-500/25",
              isActive && layout.id === "ghibli" && "bg-gradient-to-r from-sky-400 to-indigo-500 text-white shadow-lg shadow-sky-500/25",
              !isActive && isAnimeTheme && (layout as any).color,
              !isActive && !isAnimeTheme && "text-muted-foreground hover:text-foreground",
              !isActive && isAnimeTheme && "hover:bg-muted/50"
            )}
          >
            <layout.icon className={cn(
              "w-3.5 h-3.5",
              isActive && isAnimeTheme && "text-white"
            )} />
            {layout.label}
          </motion.button>
        );
      })}
    </div>
  );
}
