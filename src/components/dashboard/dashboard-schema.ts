export type DashboardWidgetType =
  | "devotion-banner"
  | "notes-widget"
  | "calendar"
  | "weekly-activity"
  | "domain-focus-radar"
  | "custom-block";

export interface DashboardGridSpan {
  base: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  md?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  lg?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
}

export interface DashboardWidgetInstance {
  id: string;
  type: DashboardWidgetType;
  props?: Record<string, unknown>;
  cardClassName?: string;
  innerClassName?: string;
}

export interface DashboardColumn {
  id: string;
  span: DashboardGridSpan;
  widgets: DashboardWidgetInstance[];
  className?: string;
  stackClassName?: string;
}

export interface DashboardRow {
  id: string;
  columns: DashboardColumn[];
  className?: string;
}

export interface DashboardLayoutSchema {
  version: 1;
  rows: DashboardRow[];
}

export const DEFAULT_DASHBOARD_LAYOUT: DashboardLayoutSchema = {
  version: 1,
  rows: [
    {
      id: "dashboard-row-primary",
      columns: [
        {
          id: "dashboard-column-primary",
          span: { base: 12, lg: 6 },
          widgets: [
            {
              id: "devotion-banner",
              type: "devotion-banner",
            },
            {
              id: "notes-widget",
              type: "notes-widget",
            },
          ],
        },
        {
          id: "dashboard-column-calendar",
          span: { base: 12, lg: 6 },
          widgets: [
            {
              id: "calendar",
              type: "calendar",
              cardClassName: "h-full",
              innerClassName: "p-3 sm:p-4 h-full",
            },
          ],
        },
      ],
    },
    {
      id: "dashboard-row-analytics",
      columns: [
        {
          id: "dashboard-column-weekly-activity",
          span: { base: 12, md: 6 },
          widgets: [
            {
              id: "weekly-activity",
              type: "weekly-activity",
              cardClassName: "h-full min-h-[200px]",
            },
          ],
        },
        {
          id: "dashboard-column-domain-focus",
          span: { base: 12, md: 6 },
          widgets: [
            {
              id: "domain-focus-radar",
              type: "domain-focus-radar",
              cardClassName: "h-full min-h-[150px]",
            },
          ],
        },
      ],
    },
  ],
};
