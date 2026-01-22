import { motion } from "framer-motion";
import { LucideIcon, ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

interface InsightCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: { label: string; href: string };
  color: string;
  delay?: number;
}

export function InsightCard({ icon: Icon, title, description, action, color, delay = 0 }: InsightCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ y: -3, scale: 1.01 }}
      className="group relative overflow-hidden rounded-2xl p-6"
      style={{ 
        background: `linear-gradient(145deg, hsl(var(--${color}) / 0.15), hsl(var(--${color}) / 0.05), hsl(var(--${color}) / 0.02))`,
        border: `1px solid hsl(var(--${color}) / 0.25)`
      }}
    >
      {/* Animated glow effect */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl"
        style={{ background: `hsl(var(--${color}))` }}
      />
      
      {/* Secondary glow */}
      <motion.div 
        animate={{ 
          scale: [1.2, 1, 1.2],
          opacity: [0.1, 0.2, 0.1]
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full blur-2xl"
        style={{ background: `hsl(var(--${color}))` }}
      />
      
      {/* Sparkle decorations */}
      <motion.div
        animate={{ opacity: [0.3, 0.7, 0.3], scale: [1, 1.2, 1] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute top-4 right-4"
      >
        <Sparkles className="w-4 h-4" style={{ color: `hsl(var(--${color}) / 0.5)` }} />
      </motion.div>
      
      <div className="relative z-10">
        <div className="flex items-start gap-4">
          <motion.div 
            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <div 
              className="absolute inset-0"
              style={{ background: `linear-gradient(135deg, hsl(var(--${color}) / 0.3), hsl(var(--${color}) / 0.1))` }}
            />
            <Icon className="w-5 h-5 relative z-10" style={{ color: `hsl(var(--${color}))` }} />
          </motion.div>
          
          <div className="flex-1">
            <motion.h4 
              className="font-semibold text-lg mb-2"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: delay + 0.1 }}
            >
              {title}
            </motion.h4>
            <motion.p 
              className="text-sm text-muted-foreground mb-4 leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: delay + 0.2 }}
            >
              {description}
            </motion.p>
            
            {action && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: delay + 0.3 }}
              >
                <Link 
                  to={action.href}
                  className="inline-flex items-center gap-2 text-sm font-semibold group/link hover:gap-3 transition-all duration-300"
                  style={{ color: `hsl(var(--${color}))` }}
                >
                  {action.label}
                  <motion.div
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
                  >
                    <ArrowRight className="w-4 h-4" />
                  </motion.div>
                </Link>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
