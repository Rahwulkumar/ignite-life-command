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
  Sword
} from "lucide-react";

interface GothicLayoutProps {
  habits: any[];
  onToggleHabit: (id: string) => void;
  weeklyData: any[];
  quickAccessItems: any[];
  timeOfDay: "morning" | "evening";
}

const darkReveal: Variants = {
  hidden: { opacity: 0, y: 15, filter: "blur(4px)" },
  show: { 
    opacity: 1, 
    y: 0,
    filter: "blur(0px)",
    transition: { 
      duration: 0.5, 
      ease: [0.22, 1, 0.36, 1]
    } 
  },
};

const elegantFade: Variants = {
  hidden: { opacity: 0, scale: 0.98 },
  show: { 
    opacity: 1, 
    scale: 1,
    transition: { 
      duration: 0.6, 
      ease: "easeOut"
    } 
  },
};

const gothicStagger: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.08,
    },
  },
};

// Gothic card with gold accents
const GothicCard = ({ children, accent = "gold" }: { children: React.ReactNode; accent?: "gold" | "silver" | "crimson" }) => {
  const accents = {
    gold: "border-amber-500/30 from-amber-500/5 via-transparent to-amber-500/5",
    silver: "border-slate-400/30 from-slate-400/5 via-transparent to-slate-400/5",
    crimson: "border-rose-500/30 from-rose-500/5 via-transparent to-rose-500/5"
  };
  
  const cornerColors = {
    gold: "border-amber-500/40",
    silver: "border-slate-400/40",
    crimson: "border-rose-500/40"
  };

  return (
    <div className="relative group">
      {/* Corner ornaments */}
      <div className={`absolute -top-px -left-px w-4 h-4 border-t-2 border-l-2 ${cornerColors[accent]} rounded-tl-lg`} />
      <div className={`absolute -top-px -right-px w-4 h-4 border-t-2 border-r-2 ${cornerColors[accent]} rounded-tr-lg`} />
      <div className={`absolute -bottom-px -left-px w-4 h-4 border-b-2 border-l-2 ${cornerColors[accent]} rounded-bl-lg`} />
      <div className={`absolute -bottom-px -right-px w-4 h-4 border-b-2 border-r-2 ${cornerColors[accent]} rounded-br-lg`} />
      
      <div className={`relative bg-card/90 backdrop-blur-sm rounded-xl border ${accents[accent]} overflow-hidden`}>
        <div className={`absolute inset-0 bg-gradient-to-br ${accents[accent]}`} />
        <div className="relative">{children}</div>
      </div>
    </div>
  );
};

// Decorative divider
const OrnamentDivider = () => (
  <div className="flex items-center gap-3">
    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
    <motion.div
      animate={{ rotate: [0, 180, 360] }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      className="text-amber-500/40 text-xs"
    >
      ◈
    </motion.div>
    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
  </div>
);

export function GothicLayout({ habits, onToggleHabit, weeklyData, quickAccessItems, timeOfDay }: GothicLayoutProps) {
  return (
    <motion.div
      initial="hidden"
      animate="show"
      exit={{ opacity: 0 }}
      variants={gothicStagger}
      className="relative space-y-6"
    >
      {/* Gothic header */}
      <motion.div variants={darkReveal} className="relative py-4">
        <div className="flex items-center justify-center gap-4">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-amber-500/30" />
          <div className="relative flex items-center gap-3 px-6 py-2.5 rounded-lg bg-gradient-to-r from-purple-950/50 via-card to-purple-950/50 border border-amber-500/20">
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <Sword className="w-4 h-4 text-amber-400" />
            </motion.div>
            <span className="text-sm font-semibold tracking-widest uppercase text-amber-200/90">Today</span>
            <div className="w-px h-4 bg-amber-500/30" />
            <motion.span 
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="text-xs text-purple-400/80"
            >
              ✧
            </motion.span>
          </div>
          <div className="flex-1 h-px bg-gradient-to-r from-amber-500/30 via-purple-500/30 to-transparent" />
        </div>
      </motion.div>

      {/* Main habit tracker */}
      <motion.div variants={elegantFade}>
        <GothicCard accent="gold">
          <div className="p-5">
            <HabitTracker habits={habits} onToggle={onToggleHabit} />
          </div>
        </GothicCard>
      </motion.div>

      <OrnamentDivider />

      {/* Devotion */}
      <motion.div variants={darkReveal}>
        <GothicCard accent="crimson">
          <DevotionBanner
            characterName="David"
            dayNumber={7}
            todayScripture="1 Samuel 17"
            timeOfDay={timeOfDay}
          />
        </GothicCard>
      </motion.div>

      {/* Metrics grid */}
      <motion.div variants={gothicStagger} className="grid grid-cols-4 gap-4">
        {[
          { icon: CheckCircle2, label: "Tasks", value: 28, change: { value: 12, positive: true }, accent: "gold" as const },
          { icon: Target, label: "Goals", value: "4/5", accent: "silver" as const },
          { icon: BookOpen, label: "Study", value: "14.5h", change: { value: 8, positive: true }, accent: "crimson" as const },
          { icon: GraduationCap, label: "Skills", value: 12, accent: "gold" as const },
        ].map((metric, i) => (
          <motion.div 
            key={i} 
            variants={darkReveal}
            whileHover={{ y: -3, transition: { duration: 0.2 } }}
          >
            <GothicCard accent={metric.accent}>
              <div className="p-3">
                <div className="flex items-center gap-2 mb-2">
                  <metric.icon className={`w-4 h-4 ${
                    metric.accent === 'gold' ? 'text-amber-400' : 
                    metric.accent === 'silver' ? 'text-slate-300' : 'text-rose-400'
                  }`} />
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">{metric.label}</span>
                </div>
                <div className="text-2xl font-bold">{metric.value}</div>
                {metric.change && (
                  <span className={`text-xs ${metric.change.positive ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {metric.change.positive ? '+' : '-'}{metric.change.value}%
                  </span>
                )}
              </div>
            </GothicCard>
          </motion.div>
        ))}
      </motion.div>

      <OrnamentDivider />

      {/* Goals */}
      <motion.div variants={gothicStagger} className="grid grid-cols-3 gap-5">
        <motion.div variants={elegantFade}>
          <GothicCard accent="crimson">
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
          </GothicCard>
        </motion.div>
        <motion.div variants={elegantFade}>
          <GothicCard accent="gold">
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
          </GothicCard>
        </motion.div>
        <motion.div variants={elegantFade}>
          <GothicCard accent="silver">
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
          </GothicCard>
        </motion.div>
      </motion.div>

      {/* Activity and insight */}
      <motion.div variants={gothicStagger} className="grid grid-cols-2 gap-6">
        <motion.div variants={darkReveal}>
          <GothicCard accent="gold">
            <div className="p-4">
              <ActivityChart data={weeklyData} maxValue={6} title="This Week" />
            </div>
          </GothicCard>
        </motion.div>
        <motion.div variants={darkReveal}>
          <GothicCard accent="silver">
            <div className="p-4">
              <InsightCard
                icon={Lightbulb}
                title="The path unfolds"
                description="Strength grows in the shadows."
                action={{ label: "Seek wisdom", href: "/spiritual" }}
              />
            </div>
          </GothicCard>
        </motion.div>
      </motion.div>

      {/* Quick access */}
      <motion.div variants={elegantFade}>
        <QuickAccessGrid items={quickAccessItems} />
      </motion.div>

      <motion.div variants={darkReveal} className="h-6" />
    </motion.div>
  );
}
