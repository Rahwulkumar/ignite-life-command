import { useEffect, useState } from "react";
import { motion, Variants } from "framer-motion";
import { LayoutDashboard } from "lucide-react";
import { startOfMonth, endOfMonth } from "date-fns";
import { toast } from "sonner";
import { DashboardCustomizeSheet } from "@/components/dashboard/DashboardCustomizeSheet";
import { createDefaultDashboardLayout } from "@/components/dashboard/dashboard-layout-utils";
import { DashboardRenderer } from "@/components/dashboard/layouts/DashboardRenderer";
import { Button } from "@/components/ui/button";
import {
  useChecklistAnalytics,
  useChecklistEntries,
  useToggleChecklistEntry,
} from "@/hooks/useChecklistEntries";
import { useDashboardLayout } from "@/hooks/useDashboardLayout";
import { MetricsData } from "@/types/domain";

interface ZenLayoutProps {
  timeOfDay: "morning" | "evening";
}

const inkBrush: Variants = {
  hidden: { opacity: 0, x: -20, filter: "blur(2px)" },
  show: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const zenStagger: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.08,
    },
  },
};

const ZenCard = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`relative overflow-hidden rounded-xl border border-border/40 bg-card/80 backdrop-blur-sm ${className}`}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-muted/5 to-transparent" />
    <div
      className="absolute inset-0 opacity-[0.015]"
      style={{
        backgroundImage:
          'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
      }}
    />
    <div className="relative">{children}</div>
  </div>
);

export function ZenLayout({ timeOfDay }: ZenLayoutProps) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);
  const {
    layout: savedLayout,
    isSaving,
    isResetting,
    saveLayout,
    resetLayout,
  } = useDashboardLayout();
  const [workingLayout, setWorkingLayout] = useState(savedLayout);

  const startDate = startOfMonth(new Date());
  const endDate = endOfMonth(new Date());
  const { data: entries = [] } = useChecklistEntries(startDate, endDate);
  const { data: analyticsEntries = [] } = useChecklistAnalytics(1);
  const toggleEntry = useToggleChecklistEntry();

  const completedTasks = entries.reduce(
    (acc, entry) => {
      if (entry.is_completed) {
        if (!acc[entry.entry_date]) {
          acc[entry.entry_date] = [];
        }
        acc[entry.entry_date].push(entry.task_id);
      }
      return acc;
    },
    {} as Record<string, string[]>,
  );

  const allTasksData = entries.reduce(
    (acc, entry) => {
      if (!acc[entry.entry_date]) {
        acc[entry.entry_date] = [];
      }
      acc[entry.entry_date].push(entry.task_id);
      return acc;
    },
    {} as Record<string, string[]>,
  );

  const handleToggleTask = (
    dateKey: string,
    taskId: string,
    metricsData?: MetricsData,
  ) => {
    const entry = entries.find(
      (item) => item.task_id === taskId && item.entry_date === dateKey,
    );
    const isCurrentlyCompleted = entry?.is_completed || false;

    toggleEntry.mutate({
      taskId,
      entryDate: dateKey,
      isCompleted: !isCurrentlyCompleted,
      metricsData,
    });
  };

  useEffect(() => {
    if (!isCustomizeOpen) {
      setWorkingLayout(savedLayout);
    }
  }, [savedLayout, isCustomizeOpen]);

  const handleCustomizeOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setWorkingLayout(savedLayout);
    }

    setIsCustomizeOpen(nextOpen);
  };

  const handleSaveLayout = async () => {
    await saveLayout(workingLayout);
    setIsCustomizeOpen(false);
    toast.success("Dashboard updated");
  };

  const handleResetLayout = async () => {
    const defaultLayout = createDefaultDashboardLayout();
    setWorkingLayout(defaultLayout);
    await resetLayout();
    toast.success("Dashboard reset");
  };

  return (
    <>
      <motion.div
        initial="hidden"
        animate="show"
        exit={{ opacity: 0 }}
        variants={zenStagger}
        className="relative flex flex-1 flex-col gap-3 sm:gap-4"
      >
        <motion.div variants={inkBrush}>
          <div className="flex flex-col gap-3 rounded-2xl border border-border/50 bg-card/55 px-4 py-3 backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
                Dynamic dashboard
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Reorder, resize, and add cards using the same widget language
                already present in the workspace.
              </p>
            </div>

            <Button
              variant="outline"
              onClick={() => setIsCustomizeOpen(true)}
              className="self-start sm:self-center"
            >
              Customize Dashboard
            </Button>
          </div>
        </motion.div>

        <DashboardRenderer
          layout={workingLayout}
          context={{
            timeOfDay,
            selectedDate,
            setSelectedDate,
            completedTasks,
            allTasks: allTasksData,
            analyticsEntries,
            onToggleTask: handleToggleTask,
          }}
          rowVariants={zenStagger}
          itemVariants={inkBrush}
          renderCard={(children, className) => (
            <ZenCard className={className}>{children}</ZenCard>
          )}
        />
      </motion.div>

      <DashboardCustomizeSheet
        open={isCustomizeOpen}
        onOpenChange={handleCustomizeOpenChange}
        layout={workingLayout}
        onChange={setWorkingLayout}
        onSave={handleSaveLayout}
        onReset={handleResetLayout}
        isSaving={isSaving}
        isResetting={isResetting}
      />
    </>
  );
}
