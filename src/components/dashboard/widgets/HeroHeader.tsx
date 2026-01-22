import { motion } from "framer-motion";
import { format } from "date-fns";
import { Flame, Sparkles, Sun, Moon, Sunrise } from "lucide-react";

interface HeroHeaderProps {
  currentTime: Date;
}

export function HeroHeader({ currentTime }: HeroHeaderProps) {
  const hour = currentTime.getHours();
  
  const getGreeting = () => {
    if (hour < 12) return { text: "Good morning", Icon: Sunrise };
    if (hour < 17) return { text: "Good afternoon", Icon: Sun };
    return { text: "Good evening", Icon: Moon };
  };

  const { text: greeting, Icon: TimeIcon } = getGreeting();

  return (
    <header className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-card via-card to-muted/30 border border-border/50 p-8">
      {/* Ambient glow effects */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-primary/10 via-transparent to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-trading/5 via-transparent to-transparent rounded-full blur-3xl" />
      
      <div className="relative z-10 flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
              <TimeIcon className="w-5 h-5 text-primary" />
            </div>
            <span className="text-sm font-medium text-muted-foreground">
              {format(currentTime, "EEEE, MMMM d")}
            </span>
          </div>
          
          <h1 className="text-4xl font-bold tracking-tight mb-2">
            {greeting}
          </h1>
          <p className="text-muted-foreground text-lg">
            Here's your progress overview
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex items-center gap-4"
        >
          {/* Streak Badge */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-trading/30 to-trading/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all opacity-60" />
            <div className="relative flex items-center gap-3 px-6 py-4 rounded-2xl bg-gradient-to-r from-trading/15 to-trading/5 border border-trading/20">
              <div className="relative">
                <Flame className="w-7 h-7 text-trading" />
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0"
                >
                  <Flame className="w-7 h-7 text-trading opacity-30" />
                </motion.div>
              </div>
              <div>
                <p className="text-2xl font-bold">7</p>
                <p className="text-xs text-muted-foreground">Day Streak</p>
              </div>
            </div>
          </div>

          {/* Focus Score */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-tech/30 to-tech/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all opacity-60" />
            <div className="relative flex items-center gap-3 px-6 py-4 rounded-2xl bg-gradient-to-r from-tech/15 to-tech/5 border border-tech/20">
              <Sparkles className="w-7 h-7 text-tech" />
              <div>
                <p className="text-2xl font-bold">92</p>
                <p className="text-xs text-muted-foreground">Focus Score</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </header>
  );
}
