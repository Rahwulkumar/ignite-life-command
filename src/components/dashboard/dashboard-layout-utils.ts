import {
  DEFAULT_DASHBOARD_LAYOUT,
  type DashboardColumn,
  type DashboardGridSpan,
  type DashboardLayoutSchema,
  type DashboardWidgetInstance,
  type DashboardWidgetType,
} from "@/components/dashboard/dashboard-schema";
import { getDashboardWidgetDefinition } from "@/components/dashboard/registry/dashboard-widget-registry";

function cloneLayout(layout: DashboardLayoutSchema): DashboardLayoutSchema {
  return JSON.parse(JSON.stringify(layout)) as DashboardLayoutSchema;
}

function makeStableId(prefix: string) {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now().toString(36)}`;
}

function makeWidgetId(type: DashboardWidgetType) {
  return makeStableId(type);
}

export function createDefaultDashboardLayout() {
  return cloneLayout(DEFAULT_DASHBOARD_LAYOUT);
}

export function getVisibleWidgetTypes(layout: DashboardLayoutSchema) {
  return new Set(
    layout.rows.flatMap((row) =>
      row.columns.flatMap((column) => column.widgets.map((widget) => widget.type)),
    ),
  );
}

export function getWidgetCounts(layout: DashboardLayoutSchema) {
  return layout.rows
    .flatMap((row) => row.columns.flatMap((column) => column.widgets))
    .reduce<Record<DashboardWidgetType, number>>((acc, widget) => {
      acc[widget.type] = (acc[widget.type] ?? 0) + 1;
      return acc;
    }, {} as Record<DashboardWidgetType, number>);
}

export function listWidgetPlacements(layout: DashboardLayoutSchema) {
  return layout.rows.flatMap((row, rowIndex) =>
    row.columns.flatMap((column, columnIndex) =>
      column.widgets.map((widget, widgetIndex) => ({
        rowId: row.id,
        rowIndex,
        columnId: column.id,
        columnIndex,
        widgetIndex,
        widget,
      })),
    ),
  );
}

export function addWidgetToLayout(
  layout: DashboardLayoutSchema,
  type: DashboardWidgetType,
): DashboardLayoutSchema {
  const next = cloneLayout(layout);
  const definition = getDashboardWidgetDefinition(type);

  next.rows.push({
    id: makeStableId("dashboard-row"),
    columns: [
      {
        id: makeStableId("dashboard-column"),
        span: { base: 12 },
        widgets: [
          {
            id: makeWidgetId(type),
            type,
            props: definition.initialProps ? { ...definition.initialProps } : undefined,
          },
        ],
      },
    ],
  });

  return next;
}

export function duplicateWidgetInLayout(
  layout: DashboardLayoutSchema,
  widgetId: string,
): DashboardLayoutSchema {
  const next = cloneLayout(layout);
  const placement = listWidgetPlacements(next).find(
    (item) => item.widget.id === widgetId,
  );

  if (!placement) {
    return layout;
  }

  const clonedWidget: DashboardWidgetInstance = {
    ...placement.widget,
    id: makeWidgetId(placement.widget.type),
    props: placement.widget.props
      ? (JSON.parse(JSON.stringify(placement.widget.props)) as Record<string, unknown>)
      : undefined,
  };

  next.rows[placement.rowIndex].columns[placement.columnIndex].widgets.splice(
    placement.widgetIndex + 1,
    0,
    clonedWidget,
  );

  return next;
}

export function removeWidgetFromLayout(
  layout: DashboardLayoutSchema,
  widgetId: string,
): DashboardLayoutSchema {
  const next = cloneLayout(layout);

  next.rows = next.rows
    .map((row) => ({
      ...row,
      columns: row.columns
        .map((column) => ({
          ...column,
          widgets: column.widgets.filter((widget) => widget.id !== widgetId),
        }))
        .filter((column) => column.widgets.length > 0),
    }))
    .filter((row) => row.columns.length > 0);

  return next.rows.length > 0 ? next : createDefaultDashboardLayout();
}

export function moveWidgetInLayout(
  layout: DashboardLayoutSchema,
  widgetId: string,
  direction: "up" | "down",
): DashboardLayoutSchema {
  const placements = listWidgetPlacements(layout);
  const currentIndex = placements.findIndex(
    (placement) => placement.widget.id === widgetId,
  );

  if (currentIndex === -1) return layout;

  const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
  if (targetIndex < 0 || targetIndex >= placements.length) return layout;

  const next = cloneLayout(layout);
  const currentPlacement = placements[currentIndex];
  const targetPlacement = placements[targetIndex];

  const currentWidget =
    next.rows[currentPlacement.rowIndex].columns[currentPlacement.columnIndex].widgets[
      currentPlacement.widgetIndex
    ];
  const targetWidget =
    next.rows[targetPlacement.rowIndex].columns[targetPlacement.columnIndex].widgets[
      targetPlacement.widgetIndex
    ];

  next.rows[currentPlacement.rowIndex].columns[currentPlacement.columnIndex].widgets[
    currentPlacement.widgetIndex
  ] = targetWidget;
  next.rows[targetPlacement.rowIndex].columns[targetPlacement.columnIndex].widgets[
    targetPlacement.widgetIndex
  ] = currentWidget;

  return next;
}

export function swapWidgetsInLayout(
  layout: DashboardLayoutSchema,
  sourceWidgetId: string,
  targetWidgetId: string,
): DashboardLayoutSchema {
  if (sourceWidgetId === targetWidgetId) {
    return layout;
  }

  const placements = listWidgetPlacements(layout);
  const sourcePlacement = placements.find(
    (placement) => placement.widget.id === sourceWidgetId,
  );
  const targetPlacement = placements.find(
    (placement) => placement.widget.id === targetWidgetId,
  );

  if (!sourcePlacement || !targetPlacement) {
    return layout;
  }

  const next = cloneLayout(layout);

  const sourceWidget =
    next.rows[sourcePlacement.rowIndex].columns[sourcePlacement.columnIndex].widgets[
      sourcePlacement.widgetIndex
    ];
  const targetWidget =
    next.rows[targetPlacement.rowIndex].columns[targetPlacement.columnIndex].widgets[
      targetPlacement.widgetIndex
    ];

  next.rows[sourcePlacement.rowIndex].columns[sourcePlacement.columnIndex].widgets[
    sourcePlacement.widgetIndex
  ] = targetWidget;
  next.rows[targetPlacement.rowIndex].columns[targetPlacement.columnIndex].widgets[
    targetPlacement.widgetIndex
  ] = sourceWidget;

  return next;
}

export function updateWidgetColumnSpan(
  layout: DashboardLayoutSchema,
  widgetId: string,
  span: DashboardGridSpan,
): DashboardLayoutSchema {
  const next = cloneLayout(layout);

  next.rows.forEach((row) => {
    row.columns.forEach((column) => {
      if (column.widgets.some((widget) => widget.id === widgetId)) {
        column.span = span;
      }
    });
  });

  return next;
}

export function updateWidgetProps(
  layout: DashboardLayoutSchema,
  widgetId: string,
  props: Record<string, unknown>,
): DashboardLayoutSchema {
  const next = cloneLayout(layout);

  next.rows.forEach((row) => {
    row.columns.forEach((column) => {
      column.widgets = column.widgets.map((widget) =>
        widget.id === widgetId
          ? {
              ...widget,
              props,
            }
          : widget,
      );
    });
  });

  return next;
}

export function normalizeDashboardLayout(
  layout: DashboardLayoutSchema | null | undefined,
): DashboardLayoutSchema {
  if (!layout || layout.version !== 1 || !Array.isArray(layout.rows)) {
    return createDefaultDashboardLayout();
  }

  return cloneLayout(layout);
}

export function findWidgetById(
  layout: DashboardLayoutSchema,
  widgetId: string,
): DashboardWidgetInstance | undefined {
  return listWidgetPlacements(layout).find(
    (placement) => placement.widget.id === widgetId,
  )?.widget;
}

export function getColumnSpanPreset(span: DashboardColumn["span"]) {
  if (span.lg === 6 || span.md === 6 || span.base === 6) return "half";
  if (span.lg === 4 || span.md === 4 || span.base === 4) return "third";
  return "full";
}

export function getSpanFromPreset(
  preset: "full" | "half" | "third",
): DashboardGridSpan {
  if (preset === "half") {
    return { base: 12, md: 6, lg: 6 };
  }

  if (preset === "third") {
    return { base: 12, md: 6, lg: 4 };
  }

  return { base: 12 };
}
