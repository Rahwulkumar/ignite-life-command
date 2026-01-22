import { motion } from "framer-motion";
import { format } from "date-fns";
import { Flame, Sparkles, Sun, Moon, Sunrise, Stars, Zap } from "lucide-react";

interface HeroHeaderProps {
  currentTime: Date;
}

export function HeroHeader({ currentTime }: HeroHeaderProps) {
  const hour = currentTime.getHours();
  
  const getGreeting = () => {
    if (hour < 12) return { text: "Good morning", Icon: Sunrise, gradient: "from-amber-500/20 via-orange-500/10" };
    if (hour < 17) return { text: "Good afternoon", Icon: Sun, gradient: "from-yellow-500/20 via-amber-500/10" };
    return { text: "Good evening", Icon: Moon, gradient: "from-indigo-500/20 via-purple-500/10" };
  };

  const { text: greeting, Icon: TimeIcon, gradient } = getGreeting();

  return (
    <header className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-card via-card to-muted/30 border border-border/50 p-8 md:p-10">
      {/* Animated background layers */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} to-transparent opacity-60`} />
      
      {/* Primary ambient glow */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.15, 0.1]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-primary/20 via-primary/5 to-transparent rounded-full blur-3xl" 
      />
      
      {/* Secondary ambient glow */}
      <motion.div 
        animate={{ 
          scale: [1.2, 1, 1.2],
          opacity: [0.05, 0.1, 0.05]
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-trading/10 via-transparent to-transparent rounded-full blur-3xl" 
      />
      
      {/* Floating orbs */}
      <motion.div
        animate={{ y: [-10, 10, -10], x: [-5, 5, -5] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 right-40 w-2 h-2 rounded-full bg-primary/30 blur-sm"
      />
      <motion.div
        animate={{ y: [10, -10, 10], x: [5, -5, 5] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-16 right-60 w-3 h-3 rounded-full bg-trading/20 blur-sm"
      />
      
      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />
      
      <div className="relative z-10 flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div 
            className="flex items-center gap-4 mb-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/25 to-primary/5 flex items-center justify-center border border-primary/20 backdrop-blur-sm">
                <TimeIcon className="w-6 h-6 text-primary" />
              </div>
              {/* Pulse ring */}
              <motion.div
                animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute inset-0 rounded-2xl border border-primary/30"
              />
            </div>
            <div>
              <span className="text-sm font-semibold text-muted-foreground tracking-wide uppercase">
                {format(currentTime, "EEEE")}
              </span>
              <p className="text-xs text-muted-foreground/70">
                {format(currentTime, "MMMM d, yyyy")}
              </p>
            </div>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl font-bold tracking-tight mb-3 bg-gradient-to-r from-foreground via-foreground to-foreground/60 bg-clip-text"
          >
            {greeting}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-muted-foreground text-lg flex items-center gap-2"
          >
            Here's your progress overview
            <Stars className="w-4 h-4 text-muted-foreground/50" />
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
          className="flex items-center gap-4"
        >
          {/* Streak Badge */}
          <motion.div 
            className="relative group"
            whileHover={{ scale: 1.02, y: -2 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-trading/40 to-trading/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all opacity-60 group-hover:opacity-80" />
            <div className="relative flex items-center gap-4 px-6 py-5 rounded-2xl bg-gradient-to-br from-trading/20 via-trading/10 to-trading/5 border border-trading/30 backdrop-blur-sm">
              <div className="relative">
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  <Flame className="w-8 h-8 text-trading" />
                </motion.div>
                {/* Fire glow */}
                <motion.div
                  animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="absolute inset-0 blur-md"
                >
                  <Flame className="w-8 h-8 text-trading" />
                </motion.div>
              </div>
              <div>
                <p className="text-3xl font-bold tracking-tight">7</p>
                <p className="text-xs text-muted-foreground font-medium">Day Streak</p>
              </div>
            </div>
          </motion.div>

          {/* Focus Score */}
          <motion.div 
            className="relative group"
            whileHover={{ scale: 1.02, y: -2 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-tech/40 to-tech/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all opacity-60 group-hover:opacity-80" />
            <div className="relative flex items-center gap-4 px-6 py-5 rounded-2xl bg-gradient-to-br from-tech/20 via-tech/10 to-tech/5 border border-tech/30 backdrop-blur-sm">
              <div className="relative">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-8 h-8 text-tech" />
                </motion.div>
              </div>
              <div>
                <p className="text-3xl font-bold tracking-tight">92</p>
                <p className="text-xs text-muted-foreground font-medium">Focus Score</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </header>
  );
}
