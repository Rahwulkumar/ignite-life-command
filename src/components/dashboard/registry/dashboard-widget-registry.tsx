import { Dispatch, ReactNode, SetStateAction } from "react";
import { DevotionBanner } from "@/components/dashboard/widgets/DevotionBanner";
import { DomainFocusRadar } from "@/components/dashboard/widgets/DomainFocusRadar";
import { InteractiveCalendar } from "@/components/dashboard/widgets/InteractiveCalendar";
import { NotesWidget } from "@/components/dashboard/widgets/NotesWidget";
import { WeeklyActivityChart } from "@/components/dashboard/widgets/WeeklyActivityChart";
import { CustomBlockWidget } from "@/components/dashboard/widgets/CustomBlockWidget";
import {
  type DashboardWidgetType,
} from "@/components/dashboard/dashboard-schema";
import type { ChecklistEntry } from "@/hooks/useChecklistEntries";
import type { MetricsData } from "@/types/domain";

export interface DashboardWidgetContext {
  timeOfDay: "morning" | "evening";
  selectedDate: Date;
  setSelectedDate: Dispatch<SetStateAction<Date>>;
  completedTasks: Record<string, string[]>;
  allTasks: Record<string, string[]>;
  analyticsEntries: ChecklistEntry[];
  onToggleTask: (
    dateKey: string,
    taskId: string,
    metricsData?: MetricsData,
  ) => void;
}

export interface DashboardWidgetDefinition {
  label: string;
  description: string;
  fields?: DashboardWidgetFieldDefinition[];
  allowMultiple?: boolean;
  initialProps?: Record<string, unknown>;
  render: (
    context: DashboardWidgetContext,
    props?: Record<string, unknown>,
  ) => ReactNode;
}

type DashboardWidgetFieldBase = {
  key: string;
  label: string;
  description?: string;
};

type DashboardWidgetTextField = DashboardWidgetFieldBase & {
  type: "text" | "number" | "textarea";
  placeholder?: string;
};

type DashboardWidgetSelectField = DashboardWidgetFieldBase & {
  type: "select";
  options: Array<{
    label: string;
    value: string;
  }>;
};

type DashboardWidgetSwitchField = DashboardWidgetFieldBase & {
  type: "switch";
};

export type DashboardWidgetFieldDefinition =
  | DashboardWidgetTextField
  | DashboardWidgetSelectField
  | DashboardWidgetSwitchField;

const getStringProp = (
  props: Record<string, unknown> | undefined,
  key: string,
): string | undefined => {
  const value = props?.[key];
  return typeof value === "string" ? value : undefined;
};

const getNumberProp = (
  props: Record<string, unknown> | undefined,
  key: string,
): number | undefined => {
  const value = props?.[key];
  return typeof value === "number" ? value : undefined;
};

const getBooleanProp = (
  props: Record<string, unknown> | undefined,
  key: string,
): boolean | undefined => {
  const value = props?.[key];
  return typeof value === "boolean" ? value : undefined;
};

export const DASHBOARD_WIDGET_REGISTRY: Record<
  DashboardWidgetType,
  DashboardWidgetDefinition
> = {
  "devotion-banner": {
    label: "Devotion Banner",
    description: "Focused spiritual prompt card for the day.",
    fields: [
      {
        key: "characterName",
        label: "Character",
        type: "text",
        placeholder: "David",
      },
      {
        key: "dayNumber",
        label: "Day Number",
        type: "number",
        placeholder: "7",
      },
      {
        key: "todayScripture",
        label: "Scripture",
        type: "text",
        placeholder: "1 Samuel 17",
      },
      {
        key: "supportingLabel",
        label: "Label",
        type: "text",
        placeholder: "Morning reflection",
      },
    ],
    render: (context, props) => (
      <DevotionBanner
        characterName={getStringProp(props, "characterName")}
        dayNumber={getNumberProp(props, "dayNumber")}
        todayScripture={getStringProp(props, "todayScripture")}
        supportingLabel={getStringProp(props, "supportingLabel")}
        timeOfDay={context.timeOfDay}
      />
    ),
  },
  "notes-widget": {
    label: "Notes Widget",
    description: "Shows note counts across your workspace domains.",
    render: () => <NotesWidget />,
  },
  calendar: {
    label: "Interactive Calendar",
    description: "Checklist calendar with quick completion controls.",
    render: (context) => (
      <InteractiveCalendar
        selectedDate={context.selectedDate}
        onSelectDate={context.setSelectedDate}
        completedTasks={context.completedTasks}
        allTasks={context.allTasks}
        onToggleTask={context.onToggleTask}
        entries={context.analyticsEntries}
      />
    ),
  },
  "weekly-activity": {
    label: "Weekly Activity",
    description: "Weekly completion chart built from checklist history.",
    render: () => <WeeklyActivityChart />,
  },
  "domain-focus-radar": {
    label: "Domain Focus Radar",
    description: "Breakdown of where your checklist effort is going.",
    render: () => <DomainFocusRadar />,
  },
  "custom-block": {
    label: "Custom Block",
    description: "Create your own dashboard callout with custom copy and links.",
    allowMultiple: true,
    initialProps: {
      eyebrow: "Custom Block",
      title: "Make this dashboard yours",
      body: "Add your own prompts, reminders, and callouts so the dashboard reflects how you actually work.",
      ctaLabel: "",
      ctaUrl: "",
      tone: "neutral",
      emphasize: false,
    },
    fields: [
      {
        key: "eyebrow",
        label: "Eyebrow",
        type: "text",
        placeholder: "Weekly Focus",
      },
      {
        key: "title",
        label: "Title",
        type: "text",
        placeholder: "Keep the important work visible",
      },
      {
        key: "body",
        label: "Body",
        type: "textarea",
        placeholder: "Write the message you want to see on the dashboard.",
      },
      {
        key: "ctaLabel",
        label: "CTA Label",
        type: "text",
        placeholder: "Open Notes",
      },
      {
        key: "ctaUrl",
        label: "CTA URL",
        type: "text",
        placeholder: "/notes or https://example.com",
      },
      {
        key: "tone",
        label: "Tone",
        type: "select",
        options: [
          { label: "Neutral", value: "neutral" },
          { label: "Focus", value: "focus" },
          { label: "Growth", value: "growth" },
          { label: "Warm", value: "warm" },
        ],
      },
      {
        key: "emphasize",
        label: "Emphasize",
        type: "switch",
        description: "Give this block a stronger visual treatment.",
      },
    ],
    render: (_, props) => (
      <CustomBlockWidget
        eyebrow={getStringProp(props, "eyebrow")}
        title={getStringProp(props, "title")}
        body={getStringProp(props, "body")}
        ctaLabel={getStringProp(props, "ctaLabel")}
        ctaUrl={getStringProp(props, "ctaUrl")}
        tone={
          (getStringProp(props, "tone") as
            | "neutral"
            | "focus"
            | "growth"
            | "warm"
            | undefined) ?? "neutral"
        }
        emphasize={getBooleanProp(props, "emphasize")}
      />
    ),
  },
};

export function getDashboardWidgetDefinition(type: DashboardWidgetType) {
  return DASHBOARD_WIDGET_REGISTRY[type];
}

export function getDashboardWidgetCatalog() {
  return Object.entries(DASHBOARD_WIDGET_REGISTRY).map(([type, definition]) => ({
    type: type as DashboardWidgetType,
    ...definition,
  }));
}
