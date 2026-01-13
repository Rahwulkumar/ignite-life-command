import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Book, 
  Code, 
  TrendingUp, 
  DollarSign, 
  Music, 
  Briefcase, 
  FileText, 
  Folder,
  Play 
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useTimeTracker, Domain } from "@/hooks/useTimeTracker";
import { cn } from "@/lib/utils";

interface TimerStartSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultDomain?: Domain;
}

const domainConfig: Record<Domain, { icon: typeof Book; label: string; color: string }> = {
  spiritual: { icon: Book, label: "Spiritual", color: "bg-spiritual hover:bg-spiritual/90" },
  tech: { icon: Code, label: "Tech", color: "bg-tech hover:bg-tech/90" },
  trading: { icon: TrendingUp, label: "Trading", color: "bg-trading hover:bg-trading/90" },
  finance: { icon: DollarSign, label: "Finance", color: "bg-finance hover:bg-finance/90" },
  music: { icon: Music, label: "Music", color: "bg-music hover:bg-music/90" },
  office: { icon: Briefcase, label: "Office", color: "bg-primary hover:bg-primary/90" },
  content: { icon: FileText, label: "Content", color: "bg-content hover:bg-content/90" },
  projects: { icon: Folder, label: "Projects", color: "bg-projects hover:bg-projects/90" },
};

export function TimerStartSheet({ open, onOpenChange, defaultDomain }: TimerStartSheetProps) {
  const { startTimer, domainActivities } = useTimeTracker();
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(defaultDomain || null);
  const [isStarting, setIsStarting] = useState(false);

  const handleStartTimer = async (activity: string) => {
    if (!selectedDomain) return;
    
    setIsStarting(true);
    await startTimer(selectedDomain, activity);
    setIsStarting(false);
    onOpenChange(false);
    setSelectedDomain(defaultDomain || null);
  };

  const handleDomainSelect = (domain: Domain) => {
    setSelectedDomain(domain);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Start Timer</SheetTitle>
        </SheetHeader>
        
        <div className="mt-6 space-y-6">
          {!selectedDomain ? (
            <>
              <p className="text-sm text-muted-foreground">Select a domain:</p>
              <div className="grid grid-cols-2 gap-3">
                {(Object.entries(domainConfig) as [Domain, typeof domainConfig[Domain]][]).map(
                  ([domain, config]) => {
                    const Icon = config.icon;
                    return (
                      <motion.button
                        key={domain}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleDomainSelect(domain)}
                        className={cn(
                          "flex items-center gap-3 p-4 rounded-xl text-white transition-all",
                          config.color
                        )}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{config.label}</span>
                      </motion.button>
                    );
                  }
                )}
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedDomain(null)}
                >
                  ← Back
                </Button>
                <span className="text-sm text-muted-foreground">
                  Select activity for{" "}
                  <span className="font-medium text-foreground">
                    {domainConfig[selectedDomain].label}
                  </span>
                </span>
              </div>
              
              <div className="grid grid-cols-1 gap-2">
                {domainActivities[selectedDomain].map((activity) => (
                  <motion.button
                    key={activity}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleStartTimer(activity)}
                    disabled={isStarting}
                    className={cn(
                      "flex items-center justify-between p-4 rounded-xl border border-border",
                      "hover:border-primary/50 hover:bg-muted/50 transition-all text-left",
                      isStarting && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    <span className="font-medium">{activity}</span>
                    <Play className="w-4 h-4 text-muted-foreground" />
                  </motion.button>
                ))}
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
