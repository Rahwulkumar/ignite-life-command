import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TimelineItem {
  time: string;
  title: string;
  domain: string;
  color: string;
}

interface TodayTimelineProps {
  items: TimelineItem[];
  delay?: number;
}

export function TodayTimeline({ items, delay = 0 }: TodayTimelineProps) {
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: delay + i * 0.1, duration: 0.4 }}
          className="flex items-center gap-4 p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors group"
        >
          {/* Time indicator */}
          <div className="w-12 text-center">
            <span className="text-xs font-medium text-muted-foreground">{item.time}</span>
          </div>
          
          {/* Color bar */}
          <div 
            className="w-1 h-8 rounded-full"
            style={{ background: `hsl(var(--${item.color}))` }}
          />
          
          {/* Content */}
          <div className="flex-1">
            <p className="text-sm font-medium">{item.title}</p>
            <p className="text-xs text-muted-foreground capitalize">{item.domain}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
