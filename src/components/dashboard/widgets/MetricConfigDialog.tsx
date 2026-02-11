import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Settings, Plus, Trash2, GripVertical, Loader2 } from "lucide-react";
import { useTaskMetrics, useAddTaskMetric, useDeleteTaskMetric, TaskMetric } from "@/hooks/useTaskMetrics";
import { toast } from "sonner";

interface MetricConfigDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    taskId: string;
    taskLabel: string;
}

const FIELD_TYPE_LABELS: Record<TaskMetric["field_type"], string> = {
    number: "Number",
    text: "Text",
    rating: "Rating (1-10)",
    boolean: "Yes/No",
    duration: "Duration (HH:MM)",
};

export function MetricConfigDialog({
    open,
    onOpenChange,
    taskId,
    taskLabel,
}: MetricConfigDialogProps) {
    const [newLabel, setNewLabel] = useState("");
    const [newType, setNewType] = useState<TaskMetric["field_type"]>("text");
    const [newUnit, setNewUnit] = useState("");

    const { data: metrics = [], isLoading } = useTaskMetrics(taskId);
    const addMetric = useAddTaskMetric();
    const deleteMetric = useDeleteTaskMetric();

    const handleAddMetric = async () => {
        if (!newLabel.trim()) {
            toast.error("Please enter a label for the metric");
            return;
        }

        try {
            await addMetric.mutateAsync({
                task_id: taskId,
                label: newLabel.trim(),
                field_type: newType,
                unit: newUnit.trim() || undefined,
                order_index: metrics.length,
            });

            toast.success("Metric added successfully");
            setNewLabel("");
            setNewType("text");
            setNewUnit("");
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Failed to add metric";
            toast.error(message);
        }
    };

    const handleDeleteMetric = async (id: string) => {
        try {
            await deleteMetric.mutateAsync({ id, taskId });
            toast.success("Metric deleted");
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Failed to delete metric";
            toast.error(message);
        }
    };

    const isUnitDisabled = newType === "boolean" || newType === "rating";

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-hidden flex flex-col">
                {/* Header */}
                <DialogHeader className="space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                            <Settings className="w-6 h-6" />
                        </div>
                        <div className="space-y-0.5">
                            <DialogTitle className="text-lg">Configure Metrics</DialogTitle>
                            <DialogDescription className="text-xs">
                                Customize tracking metrics for <strong>{taskLabel}</strong>
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                {/* Content */}
                <div className="flex-1 overflow-y-auto py-4 space-y-6">
                    {/* Existing Metrics Section */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Current Metrics
                            </h4>
                            {metrics.length > 0 && (
                                <span className="text-xs text-muted-foreground">
                                    {metrics.length} configured
                                </span>
                            )}
                        </div>

                        {isLoading ? (
                            <div className="flex items-center justify-center py-8 text-muted-foreground">
                                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                <span className="text-sm">Loading metrics...</span>
                            </div>
                        ) : metrics.length > 0 ? (
                            <div className="space-y-2">
                                {metrics.map((metric) => (
                                    <div
                                        key={metric.id}
                                        className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors group"
                                    >
                                        <GripVertical className="w-4 h-4 text-muted-foreground/50 cursor-grab group-hover:text-muted-foreground transition-colors" />
                                        <div className="flex-1 min-w-0">
                                            <div className="font-medium text-sm truncate">{metric.label}</div>
                                            <div className="text-xs text-muted-foreground">
                                                {FIELD_TYPE_LABELS[metric.field_type]}
                                                {metric.unit && <span className="mx-1">•</span>}
                                                {metric.unit}
                                            </div>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleDeleteMetric(metric.id)}
                                            className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-8 px-4 border-2 border-dashed rounded-xl bg-muted/20">
                                <Settings className="w-8 h-8 text-muted-foreground/50 mb-2" />
                                <p className="text-sm text-muted-foreground text-center">
                                    No metrics configured yet
                                </p>
                                <p className="text-xs text-muted-foreground/70 text-center mt-1">
                                    Add your first metric below
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Add New Metric Section */}
                    <div className="space-y-4 pt-4 border-t">
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Add New Metric
                        </h4>

                        <div className="space-y-4">
                            {/* Label Input */}
                            <div className="space-y-2">
                                <Label htmlFor="metric-label" className="text-sm font-medium">
                                    Label
                                </Label>
                                <Input
                                    id="metric-label"
                                    placeholder="e.g., Weight Lifted, Chapter Read, Prayer Time"
                                    value={newLabel}
                                    onChange={(e) => setNewLabel(e.target.value)}
                                    className="h-10"
                                />
                            </div>

                            {/* Type and Unit Grid */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-2">
                                    <Label htmlFor="metric-type" className="text-sm font-medium">
                                        Type
                                    </Label>
                                    <Select
                                        value={newType}
                                        onValueChange={(value) => {
                                            setNewType(value as TaskMetric["field_type"]);
                                            // Clear unit when switching to boolean or rating
                                            if (value === "boolean" || value === "rating") {
                                                setNewUnit("");
                                            }
                                        }}
                                    >
                                        <SelectTrigger id="metric-type" className="h-10">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.entries(FIELD_TYPE_LABELS).map(([value, label]) => (
                                                <SelectItem key={value} value={value}>
                                                    {label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="metric-unit" className="text-sm font-medium">
                                        Unit {!isUnitDisabled && <span className="text-muted-foreground">(optional)</span>}
                                    </Label>
                                    <Input
                                        id="metric-unit"
                                        placeholder="kg, mins, pages"
                                        value={newUnit}
                                        onChange={(e) => setNewUnit(e.target.value)}
                                        disabled={isUnitDisabled}
                                        className="h-10"
                                    />
                                </div>
                            </div>

                            {/* Add Button */}
                            <Button
                                onClick={handleAddMetric}
                                disabled={addMetric.isPending || !newLabel.trim()}
                                className="w-full h-10"
                                variant="default"
                            >
                                {addMetric.isPending ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Adding...
                                    </>
                                ) : (
                                    <>
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add Metric
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <DialogFooter>
                    <Button onClick={() => onOpenChange(false)} className="min-w-[120px]">
                        Done
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
