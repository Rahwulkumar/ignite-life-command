import { useState, useEffect } from "react";
import { Sparkles, Calendar, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

export function WelcomeHeader() {
  const [greeting, setGreeting] = useState("");
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");

    setCurrentDate(
      new Date().toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      })
    );
  }, []);

  return (
    <div className="flex items-center justify-between mb-8 opacity-0 animate-fade-in">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-5 h-5 text-primary" />
          <span className="text-sm text-muted-foreground">{currentDate}</span>
        </div>
        <h1 className="text-3xl font-display font-bold text-foreground mb-1">
          {greeting}, Commander
        </h1>
        <p className="text-muted-foreground">
          Your AI coaches are ready. Let's make today count.
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Button variant="glass" size="icon">
          <Calendar className="w-5 h-5" />
        </Button>
        <Button variant="glass" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive rounded-full text-[10px] font-bold flex items-center justify-center">
            3
          </span>
        </Button>
      </div>
    </div>
  );
}
