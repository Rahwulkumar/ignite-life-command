import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock, Activity, TrendingUp } from "lucide-react";
import { useTimeTracker, Domain } from "@/hooks/useTimeTracker";
import { format } from "date-fns";

interface DailyLogDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const domainColors: Record<Domain, string> = {
  finance: "bg-emerald-500",
  trading: "bg-amber-500",
  tech: "bg-blue-500",
  spiritual: "bg-purple-500",
  music: "bg-pink-500",
  content: "bg-orange-500",
  projects: "bg-cyan-500",
  office: "bg-slate-500",
};

const DailyLogDrawer = ({ open, onOpenChange }: DailyLogDrawerProps) => {
  const { todaySessions, getTodayStats, isLoading } = useTimeTracker();
  const stats = getTodayStats();

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[400px] sm:max-w-[400px] p-0 flex flex-col">
        <SheetHeader className="px-4 py-3 border-b border-border/50">
          <SheetTitle className="text-base font-medium flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Daily Log
          </SheetTitle>
        </SheetHeader>
        
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-6">
            {/* Total Time */}
            <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
              <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                <Clock className="h-4 w-4" />
                Total Time Today
              </div>
              <div className="text-3xl font-semibold">
                {formatDuration(stats.totalMinutes)}
              </div>
            </div>

            {/* Domain Breakdown */}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Domain Breakdown
              </h3>
              <div className="space-y-2">
                {Object.entries(stats.domainBreakdown)
                  .filter(([_, minutes]) => minutes > 0)
                  .sort(([, a], [, b]) => b - a)
                  .map(([domain, minutes]) => (
                    <div 
                      key={domain} 
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-border/30"
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${domainColors[domain as Domain]}`} />
                        <span className="capitalize text-sm">{domain}</span>
                      </div>
                      <span className="text-sm font-medium">{formatDuration(minutes)}</span>
                    </div>
                  ))}
                {Object.values(stats.domainBreakdown).every(m => m === 0) && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No time tracked yet today
                  </p>
                )}
              </div>
            </div>

            {/* Activity List */}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-3">
                Activities
              </h3>
              <div className="space-y-2">
                {isLoading ? (
                  <p className="text-sm text-muted-foreground text-center py-4">Loading...</p>
                ) : todaySessions.length > 0 ? (
                  todaySessions.map((session) => (
                    <div 
                      key={session.id}
                      className="p-3 rounded-lg bg-muted/20 border border-border/30"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{session.activity}</span>
                        <span className="text-xs text-muted-foreground">
                          {formatDuration(session.duration_minutes || 0)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <div className={`w-1.5 h-1.5 rounded-full ${domainColors[session.domain as Domain]}`} />
                        <span className="capitalize">{session.domain}</span>
                        <span>•</span>
                        <span>{format(new Date(session.started_at), "h:mm a")}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No activities logged today
                  </p>
                )}
              </div>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default DailyLogDrawer;
