import { format } from "date-fns";

interface HeroHeaderProps {
  currentTime: Date;
}

export function HeroHeader({ currentTime }: HeroHeaderProps) {
  const hour = currentTime.getHours();
  
  const getGreeting = () => {
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <header className="flex items-center justify-between py-4">
      <div>
        <p className="text-sm text-muted-foreground mb-1">
          {format(currentTime, "EEEE, MMMM d")}
        </p>
        <h1 className="text-2xl font-semibold tracking-tight">{getGreeting()}</h1>
      </div>

      <div className="flex items-center gap-6 text-sm">
        <div>
          <span className="text-muted-foreground">Streak</span>
          <span className="ml-2 font-medium">7 days</span>
        </div>
        <div className="h-4 w-px bg-border" />
        <div>
          <span className="text-muted-foreground">Focus</span>
          <span className="ml-2 font-medium">92%</span>
        </div>
      </div>
    </header>
  );
}
