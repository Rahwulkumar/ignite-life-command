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
  Sparkles
} from "lucide-react";

interface SakuraLayoutProps {
  habits: any[];
  onToggleHabit: (id: string) => void;
  weeklyData: any[];
  quickAccessItems: any[];
  timeOfDay: "morning" | "evening";
}

const floatIn: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  show: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: { 
      duration: 0.8, 
      ease: [0.34, 1.56, 0.64, 1]
    } 
  },
};

const petalFloat: Variants = {
  hidden: { opacity: 0, x: -20, rotate: -10 },
  show: { 
    opacity: 1, 
    x: 0,
    rotate: 0,
    transition: { 
      duration: 0.6, 
      ease: "easeOut"
    } 
  },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

// Floating petal component
const FloatingPetal = ({ delay, left, size }: { delay: number; left: string; size: number }) => (
  <motion.div
    initial={{ y: -20, opacity: 0, rotate: 0 }}
    animate={{ 
      y: [0, 100, 200, 300],
      opacity: [0, 1, 1, 0],
      rotate: [0, 45, 90, 135],
      x: [0, 20, -10, 30]
    }}
    transition={{
      duration: 8,
      delay,
      repeat: Infinity,
      ease: "easeInOut"
    }}
    className="absolute pointer-events-none"
    style={{ left, top: -20 }}
  >
    <div 
      className="rounded-full bg-gradient-to-br from-pink-300 to-pink-400 opacity-60"
      style={{ width: size, height: size * 0.6 }}
    />
  </motion.div>
);

export function SakuraLayout({ habits, onToggleHabit, weeklyData, quickAccessItems, timeOfDay }: SakuraLayoutProps) {
  return (
    <motion.div
      initial="hidden"
      animate="show"
      exit={{ opacity: 0 }}
      variants={staggerContainer}
      className="relative space-y-6 overflow-hidden"
    >
      {/* Floating petals background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <FloatingPetal delay={0} left="10%" size={12} />
        <FloatingPetal delay={1.5} left="25%" size={8} />
        <FloatingPetal delay={3} left="45%" size={10} />
        <FloatingPetal delay={2} left="65%" size={14} />
        <FloatingPetal delay={4} left="80%" size={9} />
        <FloatingPetal delay={0.5} left="90%" size={11} />
      </div>

      {/* Sakura header with decorative elements */}
      <motion.div variants={floatIn} className="relative">
        <div className="flex items-center justify-center gap-3 py-4">
          <motion.div
            animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <Sparkles className="w-5 h-5 text-pink-400" />
          </motion.div>
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-pink-400/50 to-transparent" />
          <span className="text-sm font-medium tracking-[0.3em] uppercase text-pink-300">Today's Journey</span>
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-pink-400/50 to-transparent" />
          <motion.div
            animate={{ rotate: [0, -5, 5, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
          >
            <Sparkles className="w-5 h-5 text-pink-400" />
          </motion.div>
        </div>
      </motion.div>

      {/* Main content with sakura-themed cards */}
      <motion.div variants={petalFloat} className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-pink-500/20 via-rose-400/20 to-pink-500/20 rounded-2xl blur-xl" />
        <div className="relative p-1 rounded-2xl bg-gradient-to-r from-pink-500/30 via-rose-400/30 to-pink-500/30">
          <div className="bg-card/95 backdrop-blur-sm rounded-xl p-4">
            <HabitTracker habits={habits} onToggle={onToggleHabit} />
          </div>
        </div>
      </motion.div>

      {/* Devotion with cherry blossom frame */}
      <motion.div variants={floatIn} className="relative">
        <div className="absolute -inset-2 bg-gradient-to-br from-pink-400/10 via-transparent to-rose-400/10 rounded-3xl" />
        <DevotionBanner
          characterName="David"
          dayNumber={7}
          todayScripture="1 Samuel 17"
          timeOfDay={timeOfDay}
        />
      </motion.div>

      {/* Metrics in sakura-bordered cards */}
      <motion.div variants={staggerContainer} className="grid grid-cols-4 gap-4">
        {[
          { icon: CheckCircle2, label: "Tasks", value: 28, change: { value: 12, positive: true } },
          { icon: Target, label: "Goals", value: "4/5" },
          { icon: BookOpen, label: "Study", value: "14.5h", change: { value: 8, positive: true } },
          { icon: GraduationCap, label: "Skills", value: 12 },
        ].map((metric, i) => (
          <motion.div key={i} variants={petalFloat} className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-400/40 to-rose-400/40 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity blur-sm" />
            <div className="relative">
              <MetricCard
                icon={metric.icon}
                label={metric.label}
                value={metric.value}
                change={metric.change}
                index={i}
              />
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Goals with soft sakura glow */}
      <motion.div variants={staggerContainer} className="grid grid-cols-3 gap-5">
        <motion.div variants={floatIn}>
          <GoalProgress
            icon={BookOpen}
            title="Devotional"
            current={45}
            target={60}
            unit="days streak"
            href="/spiritual"
            index={0}
          />
        </motion.div>
        <motion.div variants={floatIn}>
          <GoalProgress
            icon={Dumbbell}
            title="Fitness"
            current={4}
            target={6}
            unit="workouts / week"
            index={1}
          />
        </motion.div>
        <motion.div variants={floatIn}>
          <GoalProgress
            icon={Code2}
            title="Coding"
            current={12}
            target={20}
            unit="problems solved"
            href="/tech"
            index={2}
          />
        </motion.div>
      </motion.div>

      {/* Activity and insight */}
      <motion.div variants={staggerContainer} className="grid grid-cols-2 gap-6">
        <motion.div variants={petalFloat}>
          <ActivityChart data={weeklyData} maxValue={6} title="This Week" />
        </motion.div>
        <motion.div variants={petalFloat}>
          <InsightCard
            icon={Lightbulb}
            title="Blooming progress"
            description="Your consistency is flowering beautifully."
            action={{ label: "View insights", href: "/spiritual" }}
          />
        </motion.div>
      </motion.div>

      {/* Quick access */}
      <motion.div variants={floatIn}>
        <QuickAccessGrid items={quickAccessItems} />
      </motion.div>

      <motion.div variants={floatIn} className="h-6" />
    </motion.div>
  );
}
