import { motion, Variants } from "framer-motion";
import { MetricCard } from "@/components/dashboard/widgets/MetricCard";
import { GoalProgress } from "@/components/dashboard/widgets/GoalProgress";
import { HabitTracker } from "@/components/dashboard/widgets/HabitTracker";
import { ActivityChart } from "@/components/dashboard/widgets/ActivityChart";
import { InsightCard } from "@/components/dashboard/widgets/InsightCard";
import { DevotionBanner } from "@/components/dashboard/widgets/DevotionBanner";
import { QuickAccessGrid } from "@/components/dashboard/widgets/QuickAccessGrid";
import { 
  BookOpen, 
  Dumbbell, 
  Code2, 
  CheckCircle2,
  Target,
  Lightbulb,
  GraduationCap,
  Zap
} from "lucide-react";

interface NeonLayoutProps {
  habits: any[];
  onToggleHabit: (id: string) => void;
  weeklyData: any[];
  quickAccessItems: any[];
  timeOfDay: "morning" | "evening";
}

const glitchIn: Variants = {
  hidden: { opacity: 0, x: -5, filter: "blur(4px)" },
  show: { 
    opacity: 1, 
    x: 0,
    filter: "blur(0px)",
    transition: { 
      duration: 0.4, 
      ease: "easeOut"
    } 
  },
};

const pulseGlow: Variants = {
  hidden: { opacity: 0, scale: 0.98 },
  show: { 
    opacity: 1, 
    scale: 1,
    transition: { 
      duration: 0.5, 
      ease: [0.22, 1, 0.36, 1]
    } 
  },
};

const cyberStagger: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

// Animated scan line
const ScanLine = () => (
  <motion.div
    initial={{ top: "-10%" }}
    animate={{ top: "110%" }}
    transition={{
      duration: 3,
      repeat: Infinity,
      ease: "linear",
      repeatDelay: 2
    }}
    className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent pointer-events-none"
  />
);

// Neon border card wrapper
const NeonCard = ({ children, color = "cyan" }: { children: React.ReactNode; color?: "cyan" | "purple" | "pink" }) => {
  const colors = {
    cyan: "from-cyan-500/50 via-cyan-400/30 to-cyan-500/50",
    purple: "from-purple-500/50 via-violet-400/30 to-purple-500/50",
    pink: "from-pink-500/50 via-rose-400/30 to-pink-500/50"
  };
  
  const glowColors = {
    cyan: "from-cyan-500/20 to-cyan-400/5",
    purple: "from-purple-500/20 to-violet-400/5",
    pink: "from-pink-500/20 to-rose-400/5"
  };

  return (
    <div className="relative group">
      <div className={`absolute -inset-0.5 bg-gradient-to-r ${colors[color]} rounded-xl blur-sm opacity-75 group-hover:opacity-100 transition-opacity`} />
      <div className={`absolute -inset-1 bg-gradient-to-b ${glowColors[color]} rounded-xl blur-xl`} />
      <div className="relative bg-card/95 backdrop-blur-sm rounded-xl border border-white/5 overflow-hidden">
        {children}
      </div>
    </div>
  );
};

export function NeonLayout({ habits, onToggleHabit, weeklyData, quickAccessItems, timeOfDay }: NeonLayoutProps) {
  return (
    <motion.div
      initial="hidden"
      animate="show"
      exit={{ opacity: 0 }}
      variants={cyberStagger}
      className="relative space-y-6"
    >
      {/* Cyberpunk header */}
      <motion.div variants={glitchIn} className="relative overflow-hidden">
        <div className="flex items-center gap-4 py-3">
          <motion.div
            animate={{ 
              boxShadow: [
                "0 0 10px rgba(34,211,238,0.5)",
                "0 0 20px rgba(34,211,238,0.8)",
                "0 0 10px rgba(34,211,238,0.5)"
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30"
          >
            <Zap className="w-4 h-4 text-cyan-400" />
          </motion.div>
          <div className="flex-1 h-px bg-gradient-to-r from-cyan-500/50 via-purple-500/50 to-pink-500/50" />
          <div className="px-4 py-1.5 rounded border border-cyan-500/30 bg-cyan-500/5">
            <span className="text-xs font-mono text-cyan-300 tracking-wider">SYSTEM::TODAY</span>
          </div>
          <div className="flex-1 h-px bg-gradient-to-r from-pink-500/50 via-purple-500/50 to-cyan-500/50" />
          <motion.div
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="w-2 h-2 rounded-full bg-cyan-400"
          />
        </div>
      </motion.div>

      {/* Main habit tracker with neon frame */}
      <motion.div variants={pulseGlow}>
        <NeonCard color="cyan">
          <ScanLine />
          <div className="p-4">
            <HabitTracker habits={habits} onToggle={onToggleHabit} />
          </div>
        </NeonCard>
      </motion.div>

      {/* Devotion with purple neon */}
      <motion.div variants={pulseGlow}>
        <NeonCard color="purple">
          <DevotionBanner
            characterName="David"
            dayNumber={7}
            todayScripture="1 Samuel 17"
            timeOfDay={timeOfDay}
          />
        </NeonCard>
      </motion.div>

      {/* Metrics grid with alternating neon colors */}
      <motion.div variants={cyberStagger} className="grid grid-cols-4 gap-4">
        {[
          { icon: CheckCircle2, label: "Tasks", value: 28, change: { value: 12, positive: true }, color: "cyan" as const },
          { icon: Target, label: "Goals", value: "4/5", color: "purple" as const },
          { icon: BookOpen, label: "Study", value: "14.5h", change: { value: 8, positive: true }, color: "pink" as const },
          { icon: GraduationCap, label: "Skills", value: 12, color: "cyan" as const },
        ].map((metric, i) => (
          <motion.div key={i} variants={glitchIn}>
            <NeonCard color={metric.color}>
              <div className="p-3">
                <div className="flex items-center gap-2 mb-2">
                  <metric.icon className={`w-4 h-4 ${
                    metric.color === 'cyan' ? 'text-cyan-400' : 
                    metric.color === 'purple' ? 'text-purple-400' : 'text-pink-400'
                  }`} />
                  <span className="text-xs text-muted-foreground font-mono">{metric.label}</span>
                </div>
                <div className="text-2xl font-bold">{metric.value}</div>
                {metric.change && (
                  <span className={`text-xs ${metric.change.positive ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {metric.change.positive ? '+' : '-'}{metric.change.value}%
                  </span>
                )}
              </div>
            </NeonCard>
          </motion.div>
        ))}
      </motion.div>

      {/* Goals with cyber styling */}
      <motion.div variants={cyberStagger} className="grid grid-cols-3 gap-5">
        <motion.div variants={pulseGlow}>
          <NeonCard color="purple">
            <div className="p-4">
              <GoalProgress
                icon={BookOpen}
                title="Devotional"
                current={45}
                target={60}
                unit="days streak"
                href="/spiritual"
                index={0}
              />
            </div>
          </NeonCard>
        </motion.div>
        <motion.div variants={pulseGlow}>
          <NeonCard color="cyan">
            <div className="p-4">
              <GoalProgress
                icon={Dumbbell}
                title="Fitness"
                current={4}
                target={6}
                unit="workouts / week"
                index={1}
              />
            </div>
          </NeonCard>
        </motion.div>
        <motion.div variants={pulseGlow}>
          <NeonCard color="pink">
            <div className="p-4">
              <GoalProgress
                icon={Code2}
                title="Coding"
                current={12}
                target={20}
                unit="problems solved"
                href="/tech"
                index={2}
              />
            </div>
          </NeonCard>
        </motion.div>
      </motion.div>

      {/* Activity and insight */}
      <motion.div variants={cyberStagger} className="grid grid-cols-2 gap-6">
        <motion.div variants={glitchIn}>
          <NeonCard color="cyan">
            <div className="p-4">
              <ActivityChart data={weeklyData} maxValue={6} title="This Week" />
            </div>
          </NeonCard>
        </motion.div>
        <motion.div variants={glitchIn}>
          <NeonCard color="purple">
            <div className="p-4">
              <InsightCard
                icon={Lightbulb}
                title="System optimal"
                description="Performance metrics exceeding baseline."
                action={{ label: "Analyze data", href: "/spiritual" }}
              />
            </div>
          </NeonCard>
        </motion.div>
      </motion.div>

      {/* Quick access */}
      <motion.div variants={pulseGlow}>
        <QuickAccessGrid items={quickAccessItems} />
      </motion.div>

      <motion.div variants={glitchIn} className="h-6" />
    </motion.div>
  );
}
