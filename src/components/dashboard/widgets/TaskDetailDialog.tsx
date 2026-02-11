import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { TaskDefinition } from "@/lib/constants";
import { Settings, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useTaskMetrics } from "@/hooks/useTaskMetrics";
import { MetricConfigDialog } from "./MetricConfigDialog";
import { MetricField } from "./MetricField";
import { MetricsData, MetricValue, TaskCompletionPayload } from "@/types/domain";

interface TaskDetailDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    task: TaskDefinition;
    date: Date;
    onComplete: (data: TaskCompletionPayload) => void;
}

export function TaskDetailDialog({
    open,
    onOpenChange,
    task,
    date,
    onComplete,
}: TaskDetailDialogProps) {
    const [notes, setNotes] = useState("");
    const [metricValues, setMetricValues] = useState<MetricsData>({});
    const [configOpen, setConfigOpen] = useState(false);

    const { data: metrics = [] } = useTaskMetrics(task.id);

    // Reset form when dialog closes
    useEffect(() => {
        if (!open) {
            setNotes("");
            setMetricValues({});
        }
    }, [open]);

    const handleMetricChange = (metricId: string, value: MetricValue) => {
        setMetricValues((prev) => ({
            ...prev,
            [metricId]: value,
        }));
    };

    const handleSave = () => {
        const payload: TaskCompletionPayload = {
            taskId: task.id,
            date: date,
            notes,
            metricsData: metricValues,
        };

        onComplete(payload);
        onOpenChange(false);
        toast.success(`${task.label} completed!`);
    };

    const Icon = task.icon || Sparkles;

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-hidden flex flex-col">
                    {/* Header */}
                    <DialogHeader className="space-y-3">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                                    <Icon className="w-6 h-6" />
                                </div>
                                <div className="space-y-0.5">
                                    <DialogTitle className="text-lg">{task.label}</DialogTitle>
                                    <DialogDescription className="text-xs">
                                        {format(date, "EEEE, MMMM do, yyyy")}
                                    </DialogDescription>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setConfigOpen(true)}
                                className="h-9 w-9 text-muted-foreground hover:text-foreground"
                                title="Configure metrics"
                            >
                                <Settings className="w-4 h-4" />
                            </Button>
                        </div>
                    </DialogHeader>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto py-4 space-y-5 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                        {/* Custom Metrics Section */}
                        {metrics.length > 0 ? (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                        Metrics
                                    </h4>
                                    <span className="text-xs text-muted-foreground">
                                        {metrics.length} configured
                                    </span>
                                </div>
                                <div className="space-y-4">
                                    {metrics.map((metric) => (
                                        <MetricField
                                            key={metric.id}
                                            metric={metric}
                                            value={metricValues[metric.id]}
                                            onChange={(value) => handleMetricChange(metric.id, value)}
                                        />
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-8 px-4 border-2 border-dashed rounded-xl bg-muted/20">
                                <Sparkles className="w-8 h-8 text-muted-foreground/50 mb-3" />
                                <p className="text-sm text-muted-foreground text-center mb-2">
                                    No metrics configured yet
                                </p>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setConfigOpen(true)}
                                    className="text-xs"
                                >
                                    <Settings className="w-3 h-3 mr-1.5" />
                                    Add Metrics
                                </Button>
                            </div>
                        )}

                        {/* Notes Field */}
                        <div className="space-y-3 pt-4 border-t">
                            <Label className="text-sm font-semibold">Notes & Reflections</Label>
                            <Textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Share any thoughts, insights, or additional details..."
                                rows={4}
                                className="resize-none"
                            />
                        </div>
                    </div>

                    {/* Footer */}
                    <DialogFooter className="gap-2">
                        <Button variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSave} className="min-w-[120px]">
                            Complete & Save
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <MetricConfigDialog
                open={configOpen}
                onOpenChange={setConfigOpen}
                taskId={task.id}
                taskLabel={task.label}
            />
        </>
    );
}
