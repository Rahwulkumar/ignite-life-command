import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { PageTransition } from "@/components/layout/PageTransition";
import { MiniCalendar } from "@/components/home/MiniCalendar";
import { DailyHabits, defaultHabits } from "@/components/home/DailyHabits";
import { format } from "date-fns";
import { Plus, BookOpen, Dumbbell, Code2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const domainStats = [
  { icon: BookOpen, label: "Spiritual", value: 45, total: 60, unit: "day streak" },
  { icon: Dumbbell, label: "Fitness", value: 4, total: 6, unit: "workouts" },
  { icon: Code2, label: "Tech", value: 12, total: 20, unit: "problems" },
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

  return (
    <MainLayout>
      <PageTransition>
        <div className="p-6 lg:p-8 space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-medium tracking-tight">{greeting()}</h1>
              <p className="text-muted-foreground text-sm">
                Today is {format(new Date(), "EEEE, d MMMM yyyy")}
              </p>
            </div>
            <Button size="sm" className="gap-2">
              <Plus className="w-4 h-4" />
              Quick Log
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {domainStats.map((stat) => (
              <div
                key={stat.label}
                className="bg-card border border-border rounded-xl p-5 flex items-center gap-4"
              >
                <div className="relative w-14 h-14">
                  <svg className="w-14 h-14 -rotate-90">
                    <circle
                      cx="28"
                      cy="28"
                      r="24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="4"
                      className="text-muted/30"
                    />
                    <circle
                      cx="28"
                      cy="28"
                      r="24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="4"
                      strokeDasharray={`${(stat.value / stat.total) * 150.8} 150.8`}
                      strokeLinecap="round"
                      className="text-foreground"
                    />
                  </svg>
                  <stat.icon className="w-5 h-5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium">{stat.label}</p>
                  <p className="text-sm text-muted-foreground">
                    {stat.value} {stat.unit}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Tasks / Habits Column */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-card border border-border rounded-xl p-6">
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
              <div className="bg-card border border-border rounded-xl p-6">
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

            {/* Calendar Sidebar */}
            <div className="space-y-6">
              <div className="bg-card border border-border rounded-xl p-6">
                <MiniCalendar
                  selectedDate={selectedDate}
                  onSelectDate={setSelectedDate}
                  completedDates={completedDates}
                />
              </div>

              {/* Quick Stats */}
              <div className="bg-card border border-border rounded-xl p-6">
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
      </PageTransition>
    </MainLayout>
  );
};

export default Index;
