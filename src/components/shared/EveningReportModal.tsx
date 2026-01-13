import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Clock, 
  X, 
  Book, 
  Code, 
  TrendingUp, 
  DollarSign, 
  Music, 
  Briefcase, 
  FileText, 
  Folder,
  Sparkles
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useTimeTracker, Domain } from "@/hooks/useTimeTracker";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

const domainConfig: Record<Domain, { icon: typeof Book; label: string; color: string }> = {
  spiritual: { icon: Book, label: "Spiritual", color: "bg-spiritual" },
  tech: { icon: Code, label: "Tech", color: "bg-tech" },
  trading: { icon: TrendingUp, label: "Trading", color: "bg-trading" },
  finance: { icon: DollarSign, label: "Finance", color: "bg-finance" },
  music: { icon: Music, label: "Music", color: "bg-music" },
  office: { icon: Briefcase, label: "Office", color: "bg-primary" },
  content: { icon: FileText, label: "Content", color: "bg-content" },
  projects: { icon: Folder, label: "Projects", color: "bg-projects" },
};

interface EveningReportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EveningReportModal({ open, onOpenChange }: EveningReportModalProps) {
  const { getTodayStats, todaySessions } = useTimeTracker();
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);

  const stats = getTodayStats();
  const { domainBreakdown, totalMinutes } = stats;

  // Sort domains by time spent
  const sortedDomains = (Object.entries(domainBreakdown) as [Domain, number][])
    .filter(([_, mins]) => mins > 0)
    .sort((a, b) => b[1] - a[1]);

  const formatTime = (minutes: number) => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hrs > 0) {
      return `${hrs}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const generateAISummary = async () => {
    if (sortedDomains.length === 0) return;
    
    setIsGeneratingSummary(true);
    try {
      const response = await supabase.functions.invoke('generate-daily-report', {
        body: {
          domainBreakdown,
          totalMinutes,
          activities: todaySessions.map(s => ({
            domain: s.domain,
            activity: s.activity,
            minutes: s.duration_minutes
          }))
        }
      });

      if (response.data?.summary) {
        setAiSummary(response.data.summary);
      }
    } catch (error) {
      console.error('Failed to generate summary:', error);
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  useEffect(() => {
    if (open && sortedDomains.length > 0 && !aiSummary) {
      generateAISummary();
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Daily Report
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Total Time */}
          <div className="text-center">
            <p className="text-4xl font-bold">{formatTime(totalMinutes)}</p>
            <p className="text-sm text-muted-foreground">Total time logged today</p>
          </div>

          {/* Domain Breakdown */}
          {sortedDomains.length > 0 ? (
            <div className="space-y-3">
              <p className="text-sm font-medium text-muted-foreground">Breakdown</p>
              {sortedDomains.map(([domain, minutes]) => {
                const config = domainConfig[domain];
                const Icon = config.icon;
                const percentage = Math.round((minutes / totalMinutes) * 100);

                return (
                  <div key={domain} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className={cn("w-6 h-6 rounded flex items-center justify-center text-white", config.color)}>
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <span>{config.label}</span>
                      </div>
                      <span className="text-muted-foreground">
                        {formatTime(minutes)} ({percentage}%)
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className={cn("h-full rounded-full", config.color)}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              <Clock className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p>No activities logged today.</p>
              <p className="text-xs mt-1">Start a timer to track your progress!</p>
            </div>
          )}

          {/* AI Summary */}
          {(aiSummary || isGeneratingSummary) && (
            <div className="bg-muted/50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2 text-sm font-medium">
                <Sparkles className="w-4 h-4 text-primary" />
                AI Insights
              </div>
              {isGeneratingSummary ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  >
                    <Sparkles className="w-4 h-4" />
                  </motion.div>
                  Analyzing your day...
                </div>
              ) : (
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {aiSummary}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
