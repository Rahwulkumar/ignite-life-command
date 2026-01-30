import { useState } from "react";
import { motion, Variants } from "framer-motion";
import { GoalProgress } from "@/components/dashboard/widgets/GoalProgress";
import { HabitTracker } from "@/components/dashboard/widgets/HabitTracker";
import { ActivityChart } from "@/components/dashboard/widgets/ActivityChart";
import { InsightCard } from "@/components/dashboard/widgets/InsightCard";
import { DevotionBanner } from "@/components/dashboard/widgets/DevotionBanner";
import { MiniCalendar } from "@/components/home/MiniCalendar";
import { 
  BookOpen, 
  Dumbbell, 
  Code2, 
  CheckCircle2,
  Target,
  Lightbulb,
  GraduationCap,
} from "lucide-react";

interface ZenLayoutProps {
  habits: any[];
  onToggleHabit: (id: string) => void;
  onUpdateHabit: (id: string, updates: { notes?: string; timerSeconds?: number; completed?: boolean }) => void;
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
      staggerChildren: 0.12,
      delayChildren: 0.08,
    },
  },
};

// Zen card with paper texture feel
const ZenCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`relative bg-card/80 backdrop-blur-sm rounded-xl border border-border/40 overflow-hidden ${className}`}>
    <div className="absolute inset-0 bg-gradient-to-br from-muted/5 to-transparent" />
    <div className="absolute inset-0 opacity-[0.015]" style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
    }} />
    <div className="relative">{children}</div>
  </div>
);

export function ZenLayout({ habits, onToggleHabit, onUpdateHabit, weeklyData, timeOfDay }: ZenLayoutProps) {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <motion.div
      initial="hidden"
      animate="show"
      exit={{ opacity: 0 }}
      variants={zenStagger}
      className="relative space-y-6"
    >
      {/* Top Row: Metrics + Calendar */}
      <motion.div variants={zenStagger} className="grid grid-cols-12 gap-4">
        {/* Metrics - 4 small cards */}
        <motion.div variants={gentleDrop} className="col-span-2">
          <ZenCard className="h-full">
            <div className="p-4 text-center">
              <CheckCircle2 className="w-5 h-5 mx-auto mb-2 text-muted-foreground" />
              <div className="text-2xl font-light">28</div>
              <span className="text-xs text-muted-foreground">Tasks</span>
              <div className="text-xs mt-1 text-emerald-500/70">↑ 12%</div>
            </div>
          </ZenCard>
        </motion.div>
        
        <motion.div variants={gentleDrop} className="col-span-2">
          <ZenCard className="h-full">
            <div className="p-4 text-center">
              <Target className="w-5 h-5 mx-auto mb-2 text-muted-foreground" />
              <div className="text-2xl font-light">4/5</div>
              <span className="text-xs text-muted-foreground">Goals</span>
            </div>
          </ZenCard>
        </motion.div>
        
        <motion.div variants={gentleDrop} className="col-span-2">
          <ZenCard className="h-full">
            <div className="p-4 text-center">
              <BookOpen className="w-5 h-5 mx-auto mb-2 text-muted-foreground" />
              <div className="text-2xl font-light">14.5h</div>
              <span className="text-xs text-muted-foreground">Study</span>
              <div className="text-xs mt-1 text-emerald-500/70">↑ 8%</div>
            </div>
          </ZenCard>
        </motion.div>
        
        <motion.div variants={gentleDrop} className="col-span-2">
          <ZenCard className="h-full">
            <div className="p-4 text-center">
              <GraduationCap className="w-5 h-5 mx-auto mb-2 text-muted-foreground" />
              <div className="text-2xl font-light">12</div>
              <span className="text-xs text-muted-foreground">Skills</span>
            </div>
          </ZenCard>
        </motion.div>

        {/* Calendar - compact */}
        <motion.div variants={inkBrush} className="col-span-4">
          <ZenCard className="h-full">
            <div className="p-3">
              <MiniCalendar
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
                compact
              />
            </div>
          </ZenCard>
        </motion.div>
      </motion.div>

      {/* Main Row: Habits + Devotion */}
      <motion.div variants={zenStagger} className="grid grid-cols-12 gap-4">
        {/* Habit Tracker - main focus */}
        <motion.div variants={inkBrush} className="col-span-8">
          <ZenCard>
            <div className="p-5">
              <HabitTracker habits={habits} onToggle={onToggleHabit} onUpdateHabit={onUpdateHabit} />
            </div>
          </ZenCard>
        </motion.div>

        {/* Devotion - side */}
        <motion.div variants={inkBrush} className="col-span-4">
          <ZenCard className="h-full">
            <DevotionBanner
              characterName="David"
              dayNumber={7}
              todayScripture="1 Samuel 17"
              timeOfDay={timeOfDay}
            />
          </ZenCard>
        </motion.div>
      </motion.div>

      {/* Goals Row */}
      <motion.div variants={zenStagger} className="grid grid-cols-3 gap-4">
        <motion.div variants={inkBrush}>
          <ZenCard>
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
          </ZenCard>
        </motion.div>
        <motion.div variants={inkBrush}>
          <ZenCard>
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
          </ZenCard>
        </motion.div>
        <motion.div variants={inkBrush}>
          <ZenCard>
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
          </ZenCard>
        </motion.div>
      </motion.div>

      {/* Bottom Row: Activity + Insight */}
      <motion.div variants={zenStagger} className="grid grid-cols-2 gap-4">
        <motion.div variants={inkBrush}>
          <ZenCard>
            <div className="p-4">
              <ActivityChart data={weeklyData} maxValue={6} title="This Week" />
            </div>
          </ZenCard>
        </motion.div>
        <motion.div variants={inkBrush}>
          <ZenCard>
            <div className="p-4">
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
    </motion.div>
  );
}
