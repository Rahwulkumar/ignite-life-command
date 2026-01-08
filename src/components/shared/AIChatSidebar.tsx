import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface AIChatSidebarProps {
  name: string;
  role: string;
  domainColor: "finance" | "trading" | "tech" | "spiritual" | "music" | "content" | "work";
  children: React.ReactNode;
}

const colorConfig = {
  finance: "from-finance/20 to-finance/10",
  trading: "from-trading/20 to-trading/10",
  tech: "from-tech/20 to-tech/10",
  spiritual: "from-spiritual/20 to-spiritual/10",
  music: "from-music/20 to-music/10",
  content: "from-content/20 to-content/10",
  work: "from-work/20 to-work/10",
};

const textColorConfig = {
  finance: "text-finance",
  trading: "text-trading",
  tech: "text-tech",
  spiritual: "text-spiritual",
  music: "text-music",
  content: "text-content",
  work: "text-work",
};

export function AIChatSidebar({ name, role, domainColor, children }: AIChatSidebarProps) {
  return (
    <div className="w-[380px] border-l border-border flex flex-col bg-card/30">
      <div className="px-5 py-4 border-b border-border flex items-center gap-3">
        <div className={cn(
          "w-8 h-8 rounded-full bg-gradient-to-br flex items-center justify-center",
          colorConfig[domainColor]
        )}>
          <Sparkles className={cn("w-4 h-4", textColorConfig[domainColor])} />
        </div>
        <div>
          <h3 className="text-sm font-medium">{name}</h3>
          <p className="text-xs text-muted-foreground">{role}</p>
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        {children}
      </div>
    </div>
  );
}
