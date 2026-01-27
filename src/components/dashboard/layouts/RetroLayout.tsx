import { motion, Variants } from "framer-motion";
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
  Tv
} from "lucide-react";

interface RetroLayoutProps {
  habits: any[];
  onToggleHabit: (id: string) => void;
  weeklyData: any[];
  quickAccessItems: any[];
  timeOfDay: "morning" | "evening";
}

const vhsFlicker: Variants = {
  hidden: { opacity: 0, x: -2 },
  show: { 
    opacity: 1, 
    x: 0,
    transition: { 
      duration: 0.3, 
      ease: "easeOut"
    } 
  },
};

const scanIn: Variants = {
  hidden: { opacity: 0, scaleY: 0.8 },
  show: { 
    opacity: 1, 
    scaleY: 1,
    transition: { 
      duration: 0.4, 
      ease: [0.22, 1, 0.36, 1]
    } 
  },
};

const retroStagger: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

// VHS scanline overlay
const ScanlineOverlay = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
    <div 
      className="absolute inset-0 opacity-[0.03]"
      style={{
        backgroundImage: `repeating-linear-gradient(
          0deg,
          transparent,
          transparent 2px,
          rgba(0, 0, 0, 0.3) 2px,
          rgba(0, 0, 0, 0.3) 4px
        )`
      }}
    />
  </div>
);

// Retro card with bold outline
const RetroCard = ({ children, accent = "orange" }: { children: React.ReactNode; accent?: "orange" | "teal" | "pink" }) => {
  const accents = {
    orange: "border-orange-500/60 shadow-orange-500/10",
    teal: "border-teal-500/60 shadow-teal-500/10",
    pink: "border-pink-500/60 shadow-pink-500/10"
  };
  
  const bgAccents = {
    orange: "from-orange-500/5 to-transparent",
    teal: "from-teal-500/5 to-transparent",
    pink: "from-pink-500/5 to-transparent"
  };

  return (
    <div className="relative group">
      <div className={`relative bg-card rounded-xl border-2 ${accents[accent]} overflow-hidden shadow-lg`}>
        <div className={`absolute inset-0 bg-gradient-to-br ${bgAccents[accent]}`} />
        <ScanlineOverlay />
        <div className="relative">{children}</div>
      </div>
    </div>
  );
};

export function RetroLayout({ habits, onToggleHabit, weeklyData, quickAccessItems, timeOfDay }: RetroLayoutProps) {
  return (
    <motion.div
      initial="hidden"
      animate="show"
      exit={{ opacity: 0 }}
      variants={retroStagger}
      className="relative space-y-6"
    >
      {/* Retro header */}
      <motion.div variants={vhsFlicker} className="relative overflow-hidden">
        <div className="flex items-center gap-4 py-3">
          <motion.div
            animate={{ opacity: [1, 0.7, 1] }}
            transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
            className="p-2 rounded-lg bg-orange-500/10 border-2 border-orange-500/40"
          >
            <Tv className="w-4 h-4 text-orange-400" />
          </motion.div>
          <div className="flex-1 h-0.5 bg-gradient-to-r from-orange-500/50 via-teal-500/50 to-pink-500/50" />
          <div className="px-4 py-1.5 rounded border-2 border-orange-500/40 bg-orange-500/5">
            <span className="text-xs font-bold text-orange-300 tracking-widest uppercase">Today</span>
          </div>
          <div className="flex-1 h-0.5 bg-gradient-to-r from-pink-500/50 via-teal-500/50 to-orange-500/50" />
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="w-3 h-3 rounded-full bg-red-500 shadow-lg shadow-red-500/50"
          />
        </div>
      </motion.div>

      {/* Main habit tracker */}
      <motion.div variants={scanIn}>
        <RetroCard accent="orange">
          <div className="p-4">
            <HabitTracker habits={habits} onToggle={onToggleHabit} />
          </div>
        </RetroCard>
      </motion.div>

      {/* Devotion */}
      <motion.div variants={scanIn}>
        <RetroCard accent="teal">
          <DevotionBanner
            characterName="David"
            dayNumber={7}
            todayScripture="1 Samuel 17"
            timeOfDay={timeOfDay}
          />
        </RetroCard>
      </motion.div>

      {/* Metrics grid */}
      <motion.div variants={retroStagger} className="grid grid-cols-4 gap-4">
        {[
          { icon: CheckCircle2, label: "Tasks", value: 28, change: { value: 12, positive: true }, accent: "orange" as const },
          { icon: Target, label: "Goals", value: "4/5", accent: "teal" as const },
          { icon: BookOpen, label: "Study", value: "14.5h", change: { value: 8, positive: true }, accent: "pink" as const },
          { icon: GraduationCap, label: "Skills", value: 12, accent: "orange" as const },
        ].map((metric, i) => (
          <motion.div key={i} variants={vhsFlicker}>
            <RetroCard accent={metric.accent}>
              <div className="p-3">
                <div className="flex items-center gap-2 mb-2">
                  <metric.icon className={`w-4 h-4 ${
                    metric.accent === 'orange' ? 'text-orange-400' : 
                    metric.accent === 'teal' ? 'text-teal-400' : 'text-pink-400'
                  }`} />
                  <span className="text-xs text-muted-foreground font-bold uppercase tracking-wide">{metric.label}</span>
                </div>
                <div className="text-2xl font-black">{metric.value}</div>
                {metric.change && (
                  <span className={`text-xs font-bold ${metric.change.positive ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {metric.change.positive ? '+' : '-'}{metric.change.value}%
                  </span>
                )}
              </div>
            </RetroCard>
          </motion.div>
        ))}
      </motion.div>

      {/* Goals */}
      <motion.div variants={retroStagger} className="grid grid-cols-3 gap-5">
        <motion.div variants={scanIn}>
          <RetroCard accent="teal">
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
          </RetroCard>
        </motion.div>
        <motion.div variants={scanIn}>
          <RetroCard accent="orange">
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
          </RetroCard>
        </motion.div>
        <motion.div variants={scanIn}>
          <RetroCard accent="pink">
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
          </RetroCard>
        </motion.div>
      </motion.div>

      {/* Activity and insight */}
      <motion.div variants={retroStagger} className="grid grid-cols-2 gap-6">
        <motion.div variants={vhsFlicker}>
          <RetroCard accent="orange">
            <div className="p-4">
              <ActivityChart data={weeklyData} maxValue={6} title="This Week" />
            </div>
          </RetroCard>
        </motion.div>
        <motion.div variants={vhsFlicker}>
          <RetroCard accent="teal">
            <div className="p-4">
              <InsightCard
                icon={Lightbulb}
                title="Signal strong"
                description="All systems nominal. Keep tracking."
                action={{ label: "View data", href: "/spiritual" }}
              />
            </div>
          </RetroCard>
        </motion.div>
      </motion.div>

      {/* Quick access */}
      <motion.div variants={scanIn}>
        <QuickAccessGrid items={quickAccessItems} />
      </motion.div>

      <motion.div variants={vhsFlicker} className="h-6" />
    </motion.div>
  );
}
