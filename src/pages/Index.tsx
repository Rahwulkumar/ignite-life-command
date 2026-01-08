import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { PageTransition } from "@/components/layout/PageTransition";
import { MiniCalendar } from "@/components/home/MiniCalendar";
import { DailyHabits, defaultHabits } from "@/components/home/DailyHabits";
import { DevotionWidget } from "@/components/home/DevotionWidget";
import { format } from "date-fns";
import { Plus, BookOpen, Dumbbell, Code2, Flame, Target, TrendingUp, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const domainStats = [
  { icon: BookOpen, label: "Spiritual", value: 45, total: 60, unit: "day streak", color: "text-spiritual" },
  { icon: Dumbbell, label: "Fitness", value: 4, total: 6, unit: "workouts", color: "text-finance" },
  { icon: Code2, label: "Tech", value: 12, total: 20, unit: "problems", color: "text-tech" },
];

const upcomingEvents = [
  { title: "Morning Devotion", time: "06:00 AM", type: "spiritual" },
  { title: "Gym Session", time: "07:30 AM", type: "fitness" },
  { title: "Team Standup", time: "09:00 AM", type: "work" },
];

const Index = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [habits, setHabits] = useState(defaultHabits);

  const completedDates = [
    new Date(2024, 11, 25),
    new Date(2024, 11, 26),
    new Date(2024, 11, 28),
  ];

  const toggleHabit = (id: string) => {
    setHabits((prev) =>
      prev.map((h) => (h.id === id ? { ...h, completed: !h.completed } : h))
    );
  };

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const hour = new Date().getHours();
  const timeOfDay: "morning" | "evening" = hour < 12 ? "morning" : "evening";

  return (
    <MainLayout>
      <PageTransition>
        <div className="min-h-screen">
          {/* Hero Header */}
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-foreground/5 via-background to-background" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-foreground/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            
            <div className="relative px-8 pt-10 pb-8">
              <div className="max-w-5xl mx-auto">
                <div className="flex items-start justify-between mb-8">
                  <div>
                    <h1 className="text-2xl font-semibold tracking-tight">{greeting()}</h1>
                    <p className="text-muted-foreground">
                      Today is {format(new Date(), "EEEE, d MMMM yyyy")}
                    </p>
                  </div>
                  <Button size="sm" className="gap-2">
                    <Plus className="w-4 h-4" />
                    Quick Log
                  </Button>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-4 gap-4">
                  {domainStats.map((stat, index) => (
                    <motion.div 
                      key={stat.label}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.1 + (index * 0.05) }}
                      className="p-4 rounded-xl bg-card border border-border/50"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <stat.icon className={`w-4 h-4 ${stat.color}`} />
                        <span className="text-xs text-muted-foreground">{stat.label}</span>
                      </div>
                      <p className="text-2xl font-semibold">
                        {stat.value}
                        <span className="text-sm text-muted-foreground ml-1">{stat.unit}</span>
                      </p>
                    </motion.div>
                  ))}
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.25 }}
                    className="p-4 rounded-xl bg-card border border-border/50"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Flame className="w-4 h-4 text-trading" />
                      <span className="text-xs text-muted-foreground">Overall</span>
                    </div>
                    <p className="text-2xl font-semibold">
                      7<span className="text-sm text-muted-foreground ml-1">day streak</span>
                    </p>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="px-8 pb-8">
            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Tasks / Habits Column */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-card border border-border/50 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="font-medium">Today's Habits</h2>
                      <span className="text-xs text-muted-foreground">
                        {habits.filter((h) => h.completed).length}/{habits.length} completed
                      </span>
                    </div>
                    <DailyHabits
                      date={selectedDate}
                      habits={habits}
                      onToggle={toggleHabit}
                    />
                  </div>

                  {/* Upcoming Events */}
                  <div className="bg-card border border-border/50 rounded-xl p-6">
                    <h2 className="font-medium mb-4">Today's Schedule</h2>
                    <div className="space-y-3">
                      {upcomingEvents.map((event, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <div className="w-1 h-8 rounded-full bg-foreground/20" />
                          <div className="flex-1">
                            <p className="text-sm font-medium">{event.title}</p>
                            <p className="text-xs text-muted-foreground">{event.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Devotion Widget */}
                  <DevotionWidget
                    characterName="David"
                    dayNumber={7}
                    todayScripture="1 Samuel 17"
                    timeOfDay={timeOfDay}
                  />

                  <div className="bg-card border border-border/50 rounded-xl p-6">
                    <MiniCalendar
                      selectedDate={selectedDate}
                      onSelectDate={setSelectedDate}
                      completedDates={completedDates}
                    />
                  </div>

                  {/* Quick Stats */}
                  <div className="bg-card border border-border/50 rounded-xl p-6">
                    <h2 className="font-medium mb-4">This Week</h2>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-muted/30 rounded-lg">
                        <p className="text-2xl font-medium">12</p>
                        <p className="text-xs text-muted-foreground">Habits Done</p>
                      </div>
                      <div className="text-center p-3 bg-muted/30 rounded-lg">
                        <p className="text-2xl font-medium">5</p>
                        <p className="text-xs text-muted-foreground">Days Streak</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageTransition>
    </MainLayout>
  );
};

export default Index;
