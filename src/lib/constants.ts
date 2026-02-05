import { BookOpen, TrendingUp, Dumbbell, Star, LucideIcon } from "lucide-react";
import { DomainId } from "./domains";

export interface TaskDefinition {
    id: string;
    label: string;
    icon: LucideIcon;
    frequency: "daily" | "weekly";
    daysOfWeek?: number[]; // 0 = Sunday, 1 = Monday, etc.
}

export const STANDARD_TASKS: TaskDefinition[] = [
    { id: "prayer", label: "Prayer", icon: BookOpen, frequency: "daily" },
    { id: "bible", label: "Bible Reading", icon: BookOpen, frequency: "daily" },
    { id: "trading", label: "Trading/Charts", icon: TrendingUp, frequency: "daily" },
    {
        id: "gym",
        label: "GYM",
        icon: Dumbbell,
        frequency: "weekly",
        daysOfWeek: [1, 2, 3, 4, 5], // Mon-Fri
    },
];

export const TASK_TO_DOMAIN: Record<string, DomainId> = {
    prayer: "spiritual",
    bible: "spiritual",
    trading: "trading",
    gym: "projects",
};

export function formattedIdToLabel(id: string): string {
    if (!id.startsWith("custom_")) {
        const standard = STANDARD_TASKS.find(t => t.id === id);
        return standard ? standard.label : id;
    }

    // Convert "custom_run_5k" -> "Run 5k"
    return id
        .replace("custom_", "")
        .split("_")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

export function getTaskIcon(id: string): LucideIcon {
    const standard = STANDARD_TASKS.find(t => t.id === id);
    if (standard) return standard.icon;
    return Star; // Default icon for custom tasks
}
