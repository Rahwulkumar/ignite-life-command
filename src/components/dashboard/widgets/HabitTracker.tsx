import { motion, AnimatePresence } from "framer-motion";
import { Check, Zap, Trophy, Target } from "lucide-react";
import { cn } from "@/lib/utils";

interface Habit {
  id: string;
  icon: React.ElementType;
  label: string;
  completed: boolean;
  streak?: number;
}

interface HabitTrackerProps {
  habits: Habit[];
  onToggle: (id: string) => void;
  delay?: number;
}

export function HabitTracker({ habits, onToggle, delay = 0 }: HabitTrackerProps) {
  const completedCount = habits.filter(h => h.completed).length;
  const percentage = Math.round((completedCount / habits.length) * 100);
  const isComplete = completedCount === habits.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-card via-card to-muted/10 border border-border/50 p-6"
    >
      {/* Background pattern */}
      <div 
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--foreground)) 1px, transparent 0)`,
          backgroundSize: '24px 24px'
        }}
      />
      
      {/* Completion celebration glow */}
      <AnimatePresence>
        {isComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gradient-to-br from-finance/10 via-transparent to-transparent pointer-events-none"
          />
        )}
      </AnimatePresence>
      
      {/* Header */}
      <div className="relative z-10 flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-foreground/10 to-foreground/5 flex items-center justify-center">
              <Target className="w-5 h-5 text-foreground/70" />
            </div>
            <h3 className="text-lg font-semibold">Daily Habits</h3>
          </div>
          <motion.div 
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold border backdrop-blur-sm",
              isComplete 
                ? "bg-finance/15 border-finance/30 text-finance"
                : "bg-muted/50 border-border/50 text-muted-foreground"
            )}
            animate={isComplete ? { scale: [1, 1.05, 1] } : {}}
            transition={{ duration: 0.3 }}
          >
            {isComplete ? <Trophy className="w-3.5 h-3.5" /> : <Zap className="w-3.5 h-3.5" />}
            {completedCount}/{habits.length} completed
          </motion.div>
        </div>
        
        {/* Enhanced progress ring */}
        <div className="relative w-16 h-16">
          {/* Background glow */}
          <div 
            className="absolute inset-0 rounded-full blur-lg opacity-20"
            style={{ background: `conic-gradient(hsl(var(--foreground)) ${percentage}%, transparent ${percentage}%)` }}
          />
          <svg className="w-16 h-16 -rotate-90">
            {/* Track */}
            <circle
              cx="32"
              cy="32"
              r="26"
              fill="none"
              stroke="hsl(var(--muted))"
              strokeWidth="5"
            />
            {/* Progress */}
            <motion.circle
              cx="32"
              cy="32"
              r="26"
              fill="none"
              stroke="hsl(var(--foreground))"
              strokeWidth="5"
              strokeLinecap="round"
              initial={{ strokeDasharray: "0 163" }}
              animate={{ strokeDasharray: `${(percentage / 100) * 163} 163` }}
              transition={{ delay: delay + 0.3, duration: 0.8, ease: "easeOut" }}
            />
          </svg>
          <motion.span 
            className="absolute inset-0 flex items-center justify-center text-sm font-bold"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: delay + 0.5 }}
          >
            {percentage}%
          </motion.span>
        </div>
      </div>

      {/* Habit Grid */}
      <div className="relative z-10 grid grid-cols-5 gap-4">
        {habits.map((habit, i) => (
          <motion.button
            key={habit.id}
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: delay + 0.1 + i * 0.05, duration: 0.4, type: "spring" }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onToggle(habit.id)}
            className={cn(
              "relative flex flex-col items-center gap-3 p-5 rounded-2xl transition-all duration-300",
              "group overflow-hidden",
              habit.completed 
                ? "bg-gradient-to-br from-foreground/[0.08] to-foreground/[0.02] border border-foreground/10" 
                : "bg-muted/30 hover:bg-muted/50 border border-transparent hover:border-border/50"
            )}
          >
            {/* Completion glow */}
            <AnimatePresence>
              {habit.completed && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  className="absolute inset-0 bg-gradient-to-br from-foreground/5 to-transparent"
                />
              )}
            </AnimatePresence>
            
            <motion.div 
              className={cn(
                "relative w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300",
                habit.completed 
                  ? "bg-foreground text-background shadow-lg" 
                  : "bg-muted text-muted-foreground group-hover:bg-muted/80"
              )}
              animate={habit.completed ? { 
                boxShadow: ["0 4px 20px rgba(0,0,0,0.2)", "0 8px 30px rgba(0,0,0,0.3)", "0 4px 20px rgba(0,0,0,0.2)"]
              } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <AnimatePresence mode="wait">
                {habit.completed ? (
                  <motion.div
                    key="check"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 180 }}
                    transition={{ type: "spring", stiffness: 500, damping: 25 }}
                  >
                    <Check className="w-6 h-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="icon"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  >
                    <habit.icon className="w-6 h-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
            
            <span className={cn(
              "text-[11px] text-center leading-tight font-medium transition-colors",
              habit.completed ? "text-foreground" : "text-muted-foreground group-hover:text-foreground/80"
            )}>
              {habit.label.split(" ").slice(0, 2).join(" ")}
            </span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
