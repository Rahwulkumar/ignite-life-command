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
  Leaf
} from "lucide-react";

interface ZenLayoutProps {
  habits: any[];
  onToggleHabit: (id: string) => void;
  weeklyData: any[];
  quickAccessItems: any[];
  timeOfDay: "morning" | "evening";
}

const inkBrush: Variants = {
  hidden: { opacity: 0, x: -20, filter: "blur(2px)" },
  show: { 
    opacity: 1, 
    x: 0,
    filter: "blur(0px)",
    transition: { 
      duration: 0.7, 
      ease: [0.22, 1, 0.36, 1]
    } 
  },
};

const gentleDrop: Variants = {
  hidden: { opacity: 0, y: -10 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.5, 
      ease: "easeOut"
    } 
  },
};

const zenStagger: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.18,
      delayChildren: 0.1,
    },
  },
};

// Zen card with paper texture feel
const ZenCard = ({ children, season = "neutral" }: { children: React.ReactNode; season?: "neutral" | "spring" | "autumn" }) => {
  const seasons = {
    neutral: "border-stone-600/20 from-stone-500/5 to-transparent",
    spring: "border-emerald-600/20 from-emerald-500/5 to-transparent",
    autumn: "border-orange-600/20 from-orange-500/5 to-transparent"
  };

  return (
    <div className="relative">
      <div className={`relative bg-card/80 backdrop-blur-sm rounded-xl border ${seasons[season]} overflow-hidden`}>
        <div className={`absolute inset-0 bg-gradient-to-br ${seasons[season]}`} />
        {/* Subtle paper texture */}
        <div className="absolute inset-0 opacity-[0.015]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }} />
        <div className="relative">{children}</div>
      </div>
    </div>
  );
};

// Ink brush stroke divider
const InkDivider = () => (
  <motion.div 
    variants={inkBrush}
    className="flex items-center justify-center py-2"
  >
    <svg width="120" height="12" viewBox="0 0 120 12" className="text-stone-500/30">
      <path
        d="M0 6 Q30 2, 60 6 T120 6"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  </motion.div>
);

export function ZenLayout({ habits, onToggleHabit, weeklyData, quickAccessItems, timeOfDay }: ZenLayoutProps) {
  return (
    <motion.div
      initial="hidden"
      animate="show"
      exit={{ opacity: 0 }}
      variants={zenStagger}
      className="relative space-y-8"
    >
      {/* Zen header */}
      <motion.div variants={gentleDrop} className="relative py-6 text-center">
        <div className="inline-flex flex-col items-center gap-2">
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          >
            <Leaf className="w-5 h-5 text-emerald-500/60" />
          </motion.div>
          <div className="flex items-center gap-4">
            <span className="text-stone-500/40 text-xl">—</span>
            <span className="text-lg font-light tracking-[0.3em] text-stone-300/90 uppercase">Today</span>
            <span className="text-stone-500/40 text-xl">—</span>
          </div>
          <motion.span 
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 5, repeat: Infinity }}
            className="text-xs text-stone-500/50 tracking-widest"
          >
            静かな一日
          </motion.span>
        </div>
      </motion.div>

      {/* Main habit tracker */}
      <motion.div variants={inkBrush}>
        <ZenCard season="neutral">
          <div className="p-6">
            <HabitTracker habits={habits} onToggle={onToggleHabit} />
          </div>
        </ZenCard>
      </motion.div>

      <InkDivider />

      {/* Devotion */}
      <motion.div variants={inkBrush}>
        <ZenCard season="spring">
          <DevotionBanner
            characterName="David"
            dayNumber={7}
            todayScripture="1 Samuel 17"
            timeOfDay={timeOfDay}
          />
        </ZenCard>
      </motion.div>

      {/* Metrics with generous spacing */}
      <motion.div variants={zenStagger} className="grid grid-cols-4 gap-6">
        {[
          { icon: CheckCircle2, label: "Tasks", value: 28, change: { value: 12, positive: true }, season: "neutral" as const },
          { icon: Target, label: "Goals", value: "4/5", season: "spring" as const },
          { icon: BookOpen, label: "Study", value: "14.5h", change: { value: 8, positive: true }, season: "autumn" as const },
          { icon: GraduationCap, label: "Skills", value: 12, season: "neutral" as const },
        ].map((metric, i) => (
          <motion.div 
            key={i} 
            variants={gentleDrop}
          >
            <ZenCard season={metric.season}>
              <div className="p-4 text-center">
                <metric.icon className="w-5 h-5 mx-auto mb-3 text-stone-400" />
                <div className="text-2xl font-light mb-1">{metric.value}</div>
                <span className="text-xs text-stone-500">{metric.label}</span>
                {metric.change && (
                  <div className={`text-xs mt-1 ${metric.change.positive ? 'text-emerald-500/70' : 'text-rose-500/70'}`}>
                    {metric.change.positive ? '↑' : '↓'} {metric.change.value}%
                  </div>
                )}
              </div>
            </ZenCard>
          </motion.div>
        ))}
      </motion.div>

      <InkDivider />

      {/* Goals */}
      <motion.div variants={zenStagger} className="grid grid-cols-3 gap-6">
        <motion.div variants={inkBrush}>
          <ZenCard season="spring">
            <div className="p-5">
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
          </ZenCard>
        </motion.div>
        <motion.div variants={inkBrush}>
          <ZenCard season="neutral">
            <div className="p-5">
              <GoalProgress
                icon={Dumbbell}
                title="Fitness"
                current={4}
                target={6}
                unit="workouts / week"
                index={1}
              />
            </div>
          </ZenCard>
        </motion.div>
        <motion.div variants={inkBrush}>
          <ZenCard season="autumn">
            <div className="p-5">
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
          </ZenCard>
        </motion.div>
      </motion.div>

      {/* Activity and insight */}
      <motion.div variants={zenStagger} className="grid grid-cols-2 gap-8">
        <motion.div variants={inkBrush}>
          <ZenCard season="neutral">
            <div className="p-5">
              <ActivityChart data={weeklyData} maxValue={6} title="This Week" />
            </div>
          </ZenCard>
        </motion.div>
        <motion.div variants={inkBrush}>
          <ZenCard season="spring">
            <div className="p-5">
              <InsightCard
                icon={Lightbulb}
                title="Inner stillness"
                description="Progress flows like water."
                action={{ label: "Meditate", href: "/spiritual" }}
              />
            </div>
          </ZenCard>
        </motion.div>
      </motion.div>

      {/* Quick access */}
      <motion.div variants={gentleDrop}>
        <QuickAccessGrid items={quickAccessItems} />
      </motion.div>

      <motion.div variants={gentleDrop} className="h-10" />
    </motion.div>
  );
}
