import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { PageTransition } from "@/components/layout/PageTransition";
import { MiniCalendar } from "@/components/home/MiniCalendar";
import { DailyHabits, defaultHabits } from "@/components/home/DailyHabits";
import { format } from "date-fns";

const Index = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [habits, setHabits] = useState(defaultHabits);
  
  // Mock completed dates for demonstration
  const completedDates = [
    new Date(2024, 11, 25),
    new Date(2024, 11, 26),
    new Date(2024, 11, 28),
  ];
  
  const toggleHabit = (id: string) => {
    setHabits(prev => 
      prev.map(h => h.id === id ? { ...h, completed: !h.completed } : h)
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
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="w-full max-w-sm space-y-10">
            {/* Greeting */}
            <div className="text-center space-y-1">
              <p className="text-muted-foreground text-sm">{greeting()}</p>
              <h1 className="text-2xl font-medium tracking-tight">
                {format(new Date(), "EEEE")}
              </h1>
              <p className="text-muted-foreground text-sm">
                {format(new Date(), "MMMM d, yyyy")}
              </p>
            </div>
            
            {/* Calendar */}
            <MiniCalendar
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              completedDates={completedDates}
            />
            
            {/* Divider */}
            <div className="h-px bg-border" />
            
            {/* Daily Habits */}
            <DailyHabits
              date={selectedDate}
              habits={habits}
              onToggle={toggleHabit}
            />
          </div>
        </div>
      </PageTransition>
    </MainLayout>
  );
};

export default Index;
