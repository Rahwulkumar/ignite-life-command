export interface LifeTaskDefinition {
  id: string;
  label: string;
  domain: string;
  frequency: "daily" | "weekly" | "custom";
  daysOfWeek?: number[];
  patterns: RegExp[];
}

export const DEFAULT_TIMEZONE = "Asia/Kolkata";

export const STANDARD_LIFE_TASKS: LifeTaskDefinition[] = [
  {
    id: "prayer",
    label: "Prayer",
    domain: "spiritual",
    frequency: "daily",
    patterns: [/\bprayer\b/i, /\bprayed\b/i, /\bquiet time\b/i],
  },
  {
    id: "bible",
    label: "Bible Reading",
    domain: "spiritual",
    frequency: "daily",
    patterns: [/\bbible\b/i, /\bscripture\b/i, /\bdevotional\b/i, /\bread\b/i],
  },
  {
    id: "trading",
    label: "Trading/Charts",
    domain: "trading",
    frequency: "daily",
    patterns: [
      /\btrading\b/i,
      /\bcharting\b/i,
      /\bcharts\b/i,
      /\bmarket review\b/i,
      /\btrades?\b/i,
    ],
  },
  {
    id: "gym",
    label: "Gym",
    domain: "projects",
    frequency: "weekly",
    daysOfWeek: [1, 2, 3, 4, 5],
    patterns: [
      /\bgym\b/i,
      /\bworkout\b/i,
      /\btraining\b/i,
      /\bexercise\b/i,
      /\blifting\b/i,
      /\blifted\b/i,
    ],
  },
];

export function getStandardTaskDefinition(taskId: string): LifeTaskDefinition | null {
  return STANDARD_LIFE_TASKS.find((task) => task.id === taskId) ?? null;
}

export function inferTaskDomain(taskId: string): string {
  return getStandardTaskDefinition(taskId)?.domain ?? "general";
}

export function formatTaskLabel(taskId: string): string {
  const standard = getStandardTaskDefinition(taskId);
  if (standard) {
    return standard.label;
  }

  if (!taskId.startsWith("custom_")) {
    return taskId;
  }

  return taskId
    .replace(/^custom_/, "")
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function taskAppliesOnDate(task: LifeTaskDefinition, dayOfWeek: number): boolean {
  if (task.frequency === "daily" || task.frequency === "custom") {
    return true;
  }

  return task.daysOfWeek?.includes(dayOfWeek) ?? false;
}
