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
  Cloud,
  Star
} from "lucide-react";

interface GhibliLayoutProps {
  habits: any[];
  onToggleHabit: (id: string) => void;
  weeklyData: any[];
  quickAccessItems: any[];
  timeOfDay: "morning" | "evening";
}

const dreamyFloat: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 1.2, 
      ease: [0.22, 1, 0.36, 1]
    } 
  },
};

const cloudDrift: Variants = {
  hidden: { opacity: 0, x: -30 },
  show: { 
    opacity: 1, 
    x: 0,
    transition: { 
      duration: 1.5, 
      ease: "easeOut"
    } 
  },
};

const gentleStagger: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.15,
    },
  },
};

// Floating cloud decoration
const FloatingCloud = ({ delay, left, top, scale = 1 }: { delay: number; left: string; top: string; scale?: number }) => (
  <motion.div
    initial={{ x: -50, opacity: 0 }}
    animate={{ 
      x: [0, 30, 0],
      opacity: [0.4, 0.6, 0.4],
    }}
    transition={{
      duration: 12,
      delay,
      repeat: Infinity,
      ease: "easeInOut"
    }}
    className="absolute pointer-events-none"
    style={{ left, top, transform: `scale(${scale})` }}
  >
    <Cloud className="w-16 h-16 text-sky-300/30" />
  </motion.div>
);

// Twinkling star
const TwinkleStar = ({ delay, left, top }: { delay: number; left: string; top: string }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0 }}
    animate={{ 
      opacity: [0, 1, 0],
      scale: [0.5, 1, 0.5],
      rotate: [0, 180, 360]
    }}
    transition={{
      duration: 3,
      delay,
      repeat: Infinity,
      ease: "easeInOut"
    }}
    className="absolute pointer-events-none"
    style={{ left, top }}
  >
    <Star className="w-3 h-3 text-amber-300/60 fill-amber-300/40" />
  </motion.div>
);

// Dreamy card wrapper with soft pastel gradient
const DreamyCard = ({ children, variant = "sky" }: { children: React.ReactNode; variant?: "sky" | "meadow" | "sunset" }) => {
  const gradients = {
    sky: "from-sky-400/10 via-blue-300/5 to-indigo-400/10",
    meadow: "from-emerald-400/10 via-green-300/5 to-teal-400/10",
    sunset: "from-amber-400/10 via-orange-300/5 to-rose-400/10"
  };
  
  const borders = {
    sky: "border-sky-300/20",
    meadow: "border-emerald-300/20",
    sunset: "border-amber-300/20"
  };

  return (
    <div className="relative">
      <div className={`absolute -inset-2 bg-gradient-to-br ${gradients[variant]} rounded-3xl blur-2xl`} />
      <div className={`relative bg-card/80 backdrop-blur-md rounded-2xl border ${borders[variant]} overflow-hidden shadow-lg shadow-black/5`}>
        {children}
      </div>
    </div>
  );
};

export function GhibliLayout({ habits, onToggleHabit, weeklyData, quickAccessItems, timeOfDay }: GhibliLayoutProps) {
  return (
    <motion.div
      initial="hidden"
      animate="show"
      exit={{ opacity: 0 }}
      variants={gentleStagger}
      className="relative space-y-8"
    >
      {/* Dreamy background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <FloatingCloud delay={0} left="5%" top="10%" scale={0.8} />
        <FloatingCloud delay={2} left="75%" top="5%" scale={1.2} />
        <FloatingCloud delay={4} left="40%" top="15%" scale={0.6} />
        <TwinkleStar delay={0} left="15%" top="8%" />
        <TwinkleStar delay={1} left="85%" top="12%" />
        <TwinkleStar delay={2} left="55%" top="5%" />
        <TwinkleStar delay={1.5} left="30%" top="18%" />
      </div>

      {/* Whimsical header */}
      <motion.div variants={dreamyFloat} className="text-center py-6">
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="inline-flex items-center gap-3"
        >
          <div className="w-12 h-px bg-gradient-to-r from-transparent via-sky-400/40 to-transparent" />
          <div className="flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-sky-400/10 via-indigo-400/10 to-purple-400/10 border border-sky-300/20">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Star className="w-4 h-4 text-amber-400 fill-amber-300" />
            </motion.div>
            <span className="text-sm font-medium bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Today's Adventure
            </span>
            <motion.div
              animate={{ rotate: [360, 0] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Star className="w-4 h-4 text-amber-400 fill-amber-300" />
            </motion.div>
          </div>
          <div className="w-12 h-px bg-gradient-to-r from-transparent via-purple-400/40 to-transparent" />
        </motion.div>
      </motion.div>

      {/* Main habit tracker in sky theme */}
      <motion.div variants={cloudDrift}>
        <DreamyCard variant="sky">
          <div className="p-5">
            <HabitTracker habits={habits} onToggle={onToggleHabit} />
          </div>
        </DreamyCard>
      </motion.div>

      {/* Devotion in sunset theme */}
      <motion.div variants={dreamyFloat}>
        <DreamyCard variant="sunset">
          <DevotionBanner
            characterName="David"
            dayNumber={7}
            todayScripture="1 Samuel 17"
            timeOfDay={timeOfDay}
          />
        </DreamyCard>
      </motion.div>

      {/* Metrics with gentle pastel cards */}
      <motion.div variants={gentleStagger} className="grid grid-cols-4 gap-5">
        {[
          { icon: CheckCircle2, label: "Tasks", value: 28, change: { value: 12, positive: true }, variant: "sky" as const },
          { icon: Target, label: "Goals", value: "4/5", variant: "meadow" as const },
          { icon: BookOpen, label: "Study", value: "14.5h", change: { value: 8, positive: true }, variant: "sunset" as const },
          { icon: GraduationCap, label: "Skills", value: 12, variant: "sky" as const },
        ].map((metric, i) => (
          <motion.div 
            key={i} 
            variants={dreamyFloat}
            whileHover={{ y: -4, transition: { duration: 0.3 } }}
          >
            <DreamyCard variant={metric.variant}>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <metric.icon className={`w-4 h-4 ${
                    metric.variant === 'sky' ? 'text-sky-400' : 
                    metric.variant === 'meadow' ? 'text-emerald-400' : 'text-amber-400'
                  }`} />
                  <span className="text-xs text-muted-foreground">{metric.label}</span>
                </div>
                <div className="text-2xl font-semibold">{metric.value}</div>
                {metric.change && (
                  <span className={`text-xs ${metric.change.positive ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {metric.change.positive ? '+' : '-'}{metric.change.value}%
                  </span>
                )}
              </div>
            </DreamyCard>
          </motion.div>
        ))}
      </motion.div>

      {/* Goals with meadow theme */}
      <motion.div variants={gentleStagger} className="grid grid-cols-3 gap-6">
        <motion.div variants={cloudDrift}>
          <DreamyCard variant="meadow">
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
          </DreamyCard>
        </motion.div>
        <motion.div variants={cloudDrift}>
          <DreamyCard variant="sky">
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
          </DreamyCard>
        </motion.div>
        <motion.div variants={cloudDrift}>
          <DreamyCard variant="sunset">
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
          </DreamyCard>
        </motion.div>
      </motion.div>

      {/* Activity and insight */}
      <motion.div variants={gentleStagger} className="grid grid-cols-2 gap-6">
        <motion.div variants={dreamyFloat}>
          <DreamyCard variant="sky">
            <div className="p-5">
              <ActivityChart data={weeklyData} maxValue={6} title="This Week" />
            </div>
          </DreamyCard>
        </motion.div>
        <motion.div variants={dreamyFloat}>
          <DreamyCard variant="meadow">
            <div className="p-5">
              <InsightCard
                icon={Lightbulb}
                title="A gentle breeze"
                description="Your journey unfolds beautifully."
                action={{ label: "Explore more", href: "/spiritual" }}
              />
            </div>
          </DreamyCard>
        </motion.div>
      </motion.div>

      {/* Quick access */}
      <motion.div variants={dreamyFloat}>
        <QuickAccessGrid items={quickAccessItems} />
      </motion.div>

      <motion.div variants={dreamyFloat} className="h-8" />
    </motion.div>
  );
}
