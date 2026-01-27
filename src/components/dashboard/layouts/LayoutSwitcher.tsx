import { LayoutGrid, Layers, Target, Newspaper, Minus, Tv, Coffee, Sword, Leaf } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export type LayoutStyle = "bento" | "hero" | "rows" | "magazine" | "minimal" | "retro" | "cozy" | "gothic" | "zen";

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
  { id: "retro" as const, icon: Tv, label: "Retro", color: "text-orange-400", gradient: "from-orange-500 to-teal-500" },
  { id: "cozy" as const, icon: Coffee, label: "Cozy", color: "text-amber-400", gradient: "from-amber-600 to-orange-700" },
  { id: "gothic" as const, icon: Sword, label: "Gothic", color: "text-purple-400", gradient: "from-purple-600 to-amber-500" },
  { id: "zen" as const, icon: Leaf, label: "Zen", color: "text-emerald-400", gradient: "from-emerald-600 to-stone-500" },
];

export function LayoutSwitcher({ currentLayout, onLayoutChange }: LayoutSwitcherProps) {
  return (
    <div className="flex items-center gap-1.5 p-1 rounded-lg bg-muted/50 border border-border flex-wrap">
      {layouts.map((layout) => {
        const isThemed = ["retro", "cozy", "gothic", "zen"].includes(layout.id);
        const isActive = currentLayout === layout.id;
        
        return (
          <motion.button
            key={layout.id}
            onClick={() => onLayoutChange(layout.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200",
              isActive && !isThemed && "bg-foreground text-background",
              isActive && isThemed && `bg-gradient-to-r ${(layout as any).gradient} text-white shadow-lg`,
              !isActive && isThemed && (layout as any).color,
              !isActive && !isThemed && "text-muted-foreground hover:text-foreground",
              !isActive && isThemed && "hover:bg-muted/50"
            )}
          >
            <layout.icon className={cn(
              "w-3.5 h-3.5",
              isActive && isThemed && "text-white"
            )} />
            {layout.label}
          </motion.button>
        );
      })}
    </div>
  );
}
