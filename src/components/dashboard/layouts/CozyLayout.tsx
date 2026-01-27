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
  Coffee
} from "lucide-react";

interface CozyLayoutProps {
  habits: any[];
  onToggleHabit: (id: string) => void;
  weeklyData: any[];
  quickAccessItems: any[];
  timeOfDay: "morning" | "evening";
}

const warmFade: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.6, 
      ease: [0.22, 1, 0.36, 1]
    } 
  },
};

const gentleScale: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  show: { 
    opacity: 1, 
    scale: 1,
    transition: { 
      duration: 0.5, 
      ease: "easeOut"
    } 
  },
};

const cozyStagger: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

// Steam animation for cozy feel
const SteamWisp = ({ delay, left }: { delay: number; left: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 0 }}
    animate={{ 
      opacity: [0, 0.4, 0],
      y: [-5, -20],
      x: [0, 3, -3, 0]
    }}
    transition={{
      duration: 3,
      delay,
      repeat: Infinity,
      ease: "easeOut"
    }}
    className="absolute pointer-events-none text-amber-200/30"
    style={{ left, bottom: "100%" }}
  >
    ~
  </motion.div>
);

// Cozy wooden card
const CozyCard = ({ children, warmth = "amber" }: { children: React.ReactNode; warmth?: "amber" | "brown" | "cream" }) => {
  const warmths = {
    amber: "from-amber-900/20 via-amber-800/10 to-amber-900/5 border-amber-700/30",
    brown: "from-orange-900/20 via-amber-800/10 to-orange-900/5 border-orange-700/30",
    cream: "from-yellow-900/15 via-amber-800/10 to-yellow-900/5 border-yellow-700/25"
  };

  return (
    <div className="relative group">
      <div className={`relative bg-gradient-to-br ${warmths[warmth]} backdrop-blur-sm rounded-2xl border overflow-hidden`}>
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d97706' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
        <div className="relative">{children}</div>
      </div>
    </div>
  );
};

export function CozyLayout({ habits, onToggleHabit, weeklyData, quickAccessItems, timeOfDay }: CozyLayoutProps) {
  return (
    <motion.div
      initial="hidden"
      animate="show"
      exit={{ opacity: 0 }}
      variants={cozyStagger}
      className="relative space-y-7"
    >
      {/* Cozy header */}
      <motion.div variants={warmFade} className="relative py-4">
        <div className="flex items-center justify-center gap-4">
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-amber-600/40 to-transparent" />
          <div className="relative flex items-center gap-3 px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-900/30 via-amber-800/20 to-amber-900/30 border border-amber-700/30">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="relative"
            >
              <Coffee className="w-4 h-4 text-amber-400" />
              <SteamWisp delay={0} left="20%" />
              <SteamWisp delay={1} left="60%" />
            </motion.div>
            <span className="text-sm font-medium text-amber-200/90">Today</span>
            <motion.span 
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="text-xs text-amber-400/60"
            >
              ✦
            </motion.span>
          </div>
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-amber-600/40 to-transparent" />
        </div>
      </motion.div>

      {/* Main habit tracker */}
      <motion.div variants={gentleScale}>
        <CozyCard warmth="amber">
          <div className="p-5">
            <HabitTracker habits={habits} onToggle={onToggleHabit} />
          </div>
        </CozyCard>
      </motion.div>

      {/* Devotion */}
      <motion.div variants={warmFade}>
        <CozyCard warmth="brown">
          <DevotionBanner
            characterName="David"
            dayNumber={7}
            todayScripture="1 Samuel 17"
            timeOfDay={timeOfDay}
          />
        </CozyCard>
      </motion.div>

      {/* Metrics grid */}
      <motion.div variants={cozyStagger} className="grid grid-cols-4 gap-5">
        {[
          { icon: CheckCircle2, label: "Tasks", value: 28, change: { value: 12, positive: true }, warmth: "amber" as const },
          { icon: Target, label: "Goals", value: "4/5", warmth: "brown" as const },
          { icon: BookOpen, label: "Study", value: "14.5h", change: { value: 8, positive: true }, warmth: "cream" as const },
          { icon: GraduationCap, label: "Skills", value: 12, warmth: "amber" as const },
        ].map((metric, i) => (
          <motion.div 
            key={i} 
            variants={warmFade}
            whileHover={{ y: -2, transition: { duration: 0.2 } }}
          >
            <CozyCard warmth={metric.warmth}>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <metric.icon className="w-4 h-4 text-amber-400/80" />
                  <span className="text-xs text-amber-200/60">{metric.label}</span>
                </div>
                <div className="text-2xl font-semibold text-amber-100">{metric.value}</div>
                {metric.change && (
                  <span className={`text-xs ${metric.change.positive ? 'text-emerald-400/80' : 'text-rose-400/80'}`}>
                    {metric.change.positive ? '+' : '-'}{metric.change.value}%
                  </span>
                )}
              </div>
            </CozyCard>
          </motion.div>
        ))}
      </motion.div>

      {/* Goals */}
      <motion.div variants={cozyStagger} className="grid grid-cols-3 gap-6">
        <motion.div variants={gentleScale}>
          <CozyCard warmth="brown">
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
          </CozyCard>
        </motion.div>
        <motion.div variants={gentleScale}>
          <CozyCard warmth="amber">
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
          </CozyCard>
        </motion.div>
        <motion.div variants={gentleScale}>
          <CozyCard warmth="cream">
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
          </CozyCard>
        </motion.div>
      </motion.div>

      {/* Activity and insight */}
      <motion.div variants={cozyStagger} className="grid grid-cols-2 gap-6">
        <motion.div variants={warmFade}>
          <CozyCard warmth="amber">
            <div className="p-5">
              <ActivityChart data={weeklyData} maxValue={6} title="This Week" />
            </div>
          </CozyCard>
        </motion.div>
        <motion.div variants={warmFade}>
          <CozyCard warmth="brown">
            <div className="p-5">
              <InsightCard
                icon={Lightbulb}
                title="Peaceful progress"
                description="Take it slow, you're doing great."
                action={{ label: "Reflect", href: "/spiritual" }}
              />
            </div>
          </CozyCard>
        </motion.div>
      </motion.div>

      {/* Quick access */}
      <motion.div variants={gentleScale}>
        <QuickAccessGrid items={quickAccessItems} />
      </motion.div>

      <motion.div variants={warmFade} className="h-8" />
    </motion.div>
  );
}
