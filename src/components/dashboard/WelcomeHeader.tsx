import { useState, useEffect } from "react";
import { Calendar, Bell, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function WelcomeHeader() {
  const [greeting, setGreeting] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hour = now.getHours();
      if (hour < 12) setGreeting("Good morning");
      else if (hour < 18) setGreeting("Good afternoon");
      else setGreeting("Good evening");

      setCurrentDate(
        now.toLocaleDateString("en-US", {
          weekday: "long",
          month: "short",
          day: "numeric",
        })
      );
      
      setCurrentTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-start justify-between mb-10 opacity-0 animate-fade-in">
      <div>
        {/* Time Display */}
        <div className="flex items-baseline gap-4 mb-2">
          <span className="font-mono text-5xl font-semibold text-foreground tracking-tight">
            {currentTime}
          </span>
          <span className="text-muted-foreground text-sm">{currentDate}</span>
        </div>
        
        {/* Greeting */}
        <h1 className="font-display text-4xl md:text-5xl italic text-foreground mb-2">
          {greeting}, <span className="text-gradient">Commander</span>
        </h1>
        
        {/* Subtitle */}
        <p className="text-muted-foreground text-lg flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-finance animate-glow-pulse" />
          Your agents are analyzing patterns and preparing insights
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <Button variant="glass" size="icon" className="relative group">
          <Calendar className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
        </Button>
        <Button variant="glass" size="icon" className="relative group">
          <Bell className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive rounded-full text-[10px] font-bold flex items-center justify-center text-foreground">
            3
          </span>
        </Button>
        <Button variant="default" className="gap-2">
          <Sparkles className="w-4 h-4" />
          <span>Quick Log</span>
        </Button>
      </div>
    </div>
  );
}
