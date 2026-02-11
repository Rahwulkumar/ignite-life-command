import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { MetricValue } from "@/types/domain";

interface MetricFieldProps {
    metric: {
        id: string;
        label: string;
        field_type: "number" | "text" | "rating" | "boolean" | "duration";
        unit?: string | null;
    };
    value: MetricValue;
    onChange: (value: MetricValue) => void;
}

export function MetricField({ metric, value, onChange }: MetricFieldProps) {
    switch (metric.field_type) {
        case "number":
            return (
                <div className="space-y-2">
                    <Label className="text-sm font-medium">
                        {metric.label}
                        {metric.unit && (
                            <span className="text-muted-foreground font-normal ml-1.5">
                                ({metric.unit})
                            </span>
                        )}
                    </Label>
                    <Input
                        type="number"
                        value={typeof value === 'number' ? value : (value as string || "")}
                        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
                        placeholder={
                            metric.unit
                                ? `Enter ${metric.label.toLowerCase()} in ${metric.unit}`
                                : "Enter value"
                        }
                        className="h-10"
                    />
                </div>
            );

        case "text":
            return (
                <div className="space-y-2">
                    <Label className="text-sm font-medium">{metric.label}</Label>
                    <Textarea
                        value={String(value ?? "")}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={`Enter ${metric.label.toLowerCase()}`}
                        rows={2}
                        className="resize-none"
                    />
                </div>
            );

        case "rating":
            return (
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium">{metric.label}</Label>
                        <span className="text-sm font-semibold tabular-nums">
                            {value || 5} <span className="text-muted-foreground font-normal">/ 10</span>
                        </span>
                    </div>
                    <div className="px-1">
                        <Slider
                            value={[typeof value === 'number' ? value : 5]}
                            onValueChange={(val) => onChange(val[0])}
                            min={1}
                            max={10}
                            step={1}
                            className="w-full"
                        />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground px-1">
                        <span>Low</span>
                        <span>High</span>
                    </div>
                </div>
            );

        case "boolean":
            return (
                <div className="flex items-center space-x-3 p-3 rounded-lg border bg-muted/20">
                    <Checkbox
                        checked={Boolean(value)}
                        onCheckedChange={(checked) => onChange(checked)}
                        id={metric.id}
                    />
                    <Label
                        htmlFor={metric.id}
                        className="text-sm font-medium cursor-pointer flex-1"
                    >
                        {metric.label}
                    </Label>
                </div>
            );

        case "duration":
            return (
                <div className="space-y-2">
                    <Label className="text-sm font-medium">{metric.label}</Label>
                    <Input
                        type="text"
                        value={String(value ?? "")}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder="HH:MM (e.g., 01:30)"
                        pattern="[0-9]{1,2}:[0-9]{2}"
                        className="h-10 font-mono"
                    />
                    <p className="text-xs text-muted-foreground">
                        Format: Hours:Minutes (e.g., 01:30 for 1 hour 30 minutes)
                    </p>
                </div>
            );

        default:
            return null;
    }
}
