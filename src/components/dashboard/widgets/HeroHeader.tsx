import { format } from "date-fns";
import { Flame, Zap, Sun, Moon, Sunrise } from "lucide-react";

interface HeroHeaderProps {
  currentTime: Date;
}

export function HeroHeader({ currentTime }: HeroHeaderProps) {
  const hour = currentTime.getHours();
  
  const getGreeting = () => {
    if (hour < 12) return { text: "Good morning", Icon: Sunrise };
    if (hour < 17) return { text: "Good afternoon", Icon: Sun };
    return { text: "Good evening", Icon: Moon };
  };

  const { text: greeting, Icon: TimeIcon } = getGreeting();

  return (
    <header className="flex items-center justify-between py-2">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <TimeIcon className="w-5 h-5 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {format(currentTime, "EEEE, MMMM d")}
          </span>
        </div>
        <h1 className="text-3xl font-semibold tracking-tight">{greeting}</h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-card border border-border">
          <Flame className="w-5 h-5 text-trading" />
          <div>
            <p className="text-lg font-semibold leading-none">7</p>
            <p className="text-xs text-muted-foreground">Day Streak</p>
          </div>
        </div>

        <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-card border border-border">
          <Zap className="w-5 h-5 text-tech" />
          <div>
            <p className="text-lg font-semibold leading-none">92</p>
            <p className="text-xs text-muted-foreground">Focus Score</p>
          </div>
        </div>
      </div>
    </header>
  );
}
