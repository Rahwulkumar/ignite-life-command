import { Target } from "lucide-react";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer } from "recharts";
import { DOMAIN_COLORS, DomainId } from "@/lib/domain-colors";
import { cn } from "@/lib/utils";
import { useChecklistAnalytics } from "@/hooks/useChecklistEntries";
import { useMemo } from "react";

export function DomainFocusRadar() {
    const { data: analyticsData = [], isLoading } = useChecklistAnalytics(1);

    // Calculate domain focus from analytics
    const radarData = useMemo(() => {
        // Count tasks by domain
        const domainCounts: Record<string, number> = {};

        analyticsData.forEach(entry => {
            const domain = entry.task_id.split('_')[0]; // Extract domain from task_id
            domainCounts[domain] = (domainCounts[domain] || 0) + 1;
        });

        // Find max count for full mark
        const maxCount = Math.max(...Object.values(domainCounts), 1);
        const fullMark = Math.ceil(maxCount * 1.2); // 20% padding for better visualization

        // Convert to array and capitalize domain names
        return Object.entries(domainCounts)
            .map(([domain, tasks]) => ({
                domain: domain.charAt(0).toUpperCase() + domain.slice(1),
                tasks,
                fullMark
            }))
            .sort((a, b) => b.tasks - a.tasks)
            .slice(0, 6); // Top 6 domains
    }, [analyticsData]);

    // Calculate total tasks for percentages
    const totalTasks = radarData.reduce((sum, d) => sum + d.tasks, 0);

    if (isLoading) {
        return (
            <div className="p-3 sm:p-4 h-full flex items-center justify-center">
                <p className="text-sm text-muted-foreground">Loading...</p>
            </div>
        );
    }

    return (
        <div className="p-3 sm:p-4 h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-muted-foreground" />
                <h3 className="text-sm font-medium">This Week's Focus</h3>
            </div>

            {/* Radar Chart - Made larger by negative margin and flex-1 */}
            <div className="flex-1 min-h-[140px] -mx-4 -my-2">
                <ResponsiveContainer width="100%" height={140}>
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                        <PolarGrid
                            strokeDasharray="3 3"
                            stroke="hsl(var(--border))"
                        />
                        <PolarAngleAxis
                            dataKey="domain"
                            tick={{
                                fontSize: 10,
                                fill: "hsl(var(--muted-foreground))"
                            }}
                        />
                        <Radar
                            name="Tasks"
                            dataKey="tasks"
                            stroke="hsl(var(--primary))"
                            fill="hsl(var(--primary) / 0.3)"
                            fillOpacity={0.6}
                        />
                    </RadarChart>
                </ResponsiveContainer>
            </div>

            {/* Domain List - Compact */}
            <div className="space-y-1 mt-auto">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium mb-1.5">
                    Tasks by Domain
                </p>
                {radarData.slice(0, 3).map(({ domain, tasks }) => {
                    const percentage = totalTasks > 0 ? Math.round((tasks / totalTasks) * 100) : 0;
                    const domainColor = DOMAIN_COLORS[domain.toLowerCase() as DomainId];

                    return (
                        <div key={domain} className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-1.5">
                                <div
                                    className={cn(
                                        "w-2 h-2 rounded-full",
                                        domainColor?.bg || "bg-muted"
                                    )}
                                />
                                <span className="capitalize">{domain}</span>
                            </div>
                            <span className="text-muted-foreground">
                                {tasks} ({percentage}%)
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
