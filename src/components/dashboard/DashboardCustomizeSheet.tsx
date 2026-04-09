import { useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  Copy,
  GripVertical,
  LayoutDashboard,
  RotateCcw,
  Save,
  Trash2,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  addWidgetToLayout,
  duplicateWidgetInLayout,
  getColumnSpanPreset,
  getSpanFromPreset,
  getVisibleWidgetTypes,
  getWidgetCounts,
  listWidgetPlacements,
  moveWidgetInLayout,
  removeWidgetFromLayout,
  swapWidgetsInLayout,
  updateWidgetColumnSpan,
  updateWidgetProps,
} from "@/components/dashboard/dashboard-layout-utils";
import type {
  DashboardLayoutSchema,
  DashboardWidgetType,
} from "@/components/dashboard/dashboard-schema";
import {
  getDashboardWidgetCatalog,
  type DashboardWidgetFieldDefinition,
} from "@/components/dashboard/registry/dashboard-widget-registry";
import { cn } from "@/lib/utils";

interface DashboardCustomizeSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  layout: DashboardLayoutSchema;
  onChange: (layout: DashboardLayoutSchema) => void;
  onSave: () => void | Promise<void>;
  onReset: () => void | Promise<void>;
  isSaving?: boolean;
  isResetting?: boolean;
}

export function DashboardCustomizeSheet({
  open,
  onOpenChange,
  layout,
  onChange,
  onSave,
  onReset,
  isSaving = false,
  isResetting = false,
}: DashboardCustomizeSheetProps) {
  const [draggingWidgetId, setDraggingWidgetId] = useState<string | null>(null);
  const [dropTargetWidgetId, setDropTargetWidgetId] = useState<string | null>(
    null,
  );

  const widgetCatalog = useMemo(() => getDashboardWidgetCatalog(), []);
  const visibleWidgetTypes = useMemo(
    () => getVisibleWidgetTypes(layout),
    [layout],
  );
  const widgetCounts = useMemo(() => getWidgetCounts(layout), [layout]);
  const placements = useMemo(() => listWidgetPlacements(layout), [layout]);

  const handleToggleWidget = (type: DashboardWidgetType, enabled: boolean) => {
    if (enabled) {
      onChange(addWidgetToLayout(layout, type));
      return;
    }

    const placement = placements.find((item) => item.widget.type === type);
    if (!placement) return;
    onChange(removeWidgetFromLayout(layout, placement.widget.id));
  };

  const handleFieldChange = (widgetId: string, key: string, value: unknown) => {
    const placement = placements.find((item) => item.widget.id === widgetId);
    if (!placement) return;

    onChange(
      updateWidgetProps(layout, widgetId, {
        ...(placement.widget.props ?? {}),
        [key]: value,
      }),
    );
  };

  const handleDrop = (targetWidgetId: string) => {
    if (!draggingWidgetId || draggingWidgetId === targetWidgetId) {
      setDraggingWidgetId(null);
      setDropTargetWidgetId(null);
      return;
    }

    onChange(swapWidgetsInLayout(layout, draggingWidgetId, targetWidgetId));
    setDraggingWidgetId(null);
    setDropTargetWidgetId(null);
  };

  const renderFieldControl = (
    field: DashboardWidgetFieldDefinition,
    widgetId: string,
    rawValue: unknown,
  ) => {
    if (field.type === "switch") {
      return (
        <div className="flex items-center justify-between rounded-xl border border-border bg-background/60 px-3 py-3">
          <div className="pr-4">
            <div className="text-sm font-medium">{field.label}</div>
            {field.description && (
              <div className="mt-1 text-xs text-muted-foreground">
                {field.description}
              </div>
            )}
          </div>
          <Switch
            checked={typeof rawValue === "boolean" ? rawValue : false}
            onCheckedChange={(checked) =>
              handleFieldChange(widgetId, field.key, checked)
            }
          />
        </div>
      );
    }

    if (field.type === "select") {
      return (
        <label className="flex flex-col gap-2 text-sm">
          <span className="font-medium">{field.label}</span>
          <Select
            value={
              typeof rawValue === "string" ? rawValue : field.options[0]?.value
            }
            onValueChange={(value) => handleFieldChange(widgetId, field.key, value)}
          >
            <SelectTrigger>
              <SelectValue placeholder={field.label} />
            </SelectTrigger>
            <SelectContent>
              {field.options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {field.description && (
            <span className="text-xs text-muted-foreground">
              {field.description}
            </span>
          )}
        </label>
      );
    }

    if (field.type === "textarea") {
      return (
        <label className="flex flex-col gap-2 text-sm md:col-span-2">
          <span className="font-medium">{field.label}</span>
          <Textarea
            value={typeof rawValue === "string" ? rawValue : ""}
            placeholder={field.placeholder}
            rows={4}
            onChange={(event) =>
              handleFieldChange(widgetId, field.key, event.target.value)
            }
          />
          {field.description && (
            <span className="text-xs text-muted-foreground">
              {field.description}
            </span>
          )}
        </label>
      );
    }

    const value =
      typeof rawValue === "number"
        ? String(rawValue)
        : typeof rawValue === "string"
          ? rawValue
          : "";

    return (
      <label className="flex flex-col gap-2 text-sm">
        <span className="font-medium">{field.label}</span>
        <Input
          type={field.type === "number" ? "number" : "text"}
          value={value}
          placeholder={field.placeholder}
          onChange={(event) =>
            handleFieldChange(
              widgetId,
              field.key,
              field.type === "number"
                ? event.target.value === ""
                  ? undefined
                  : Number(event.target.value)
                : event.target.value,
            )
          }
        />
        {field.description && (
          <span className="text-xs text-muted-foreground">
            {field.description}
          </span>
        )}
      </label>
    );
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-2xl">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <LayoutDashboard className="h-5 w-5" />
            Customize Dashboard
          </SheetTitle>
          <SheetDescription>
            Add widgets, drag them into place, and edit their settings without
            leaving the dashboard.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-8 space-y-8">
          <section className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold">Available widgets</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Turn shared widgets on, or add as many custom blocks as you need.
              </p>
            </div>

            <div className="space-y-3">
              {widgetCatalog.map((widget) => {
                const count = widgetCounts[widget.type] ?? 0;

                return (
                  <div
                    key={widget.type}
                    className="flex items-start justify-between gap-4 rounded-2xl border border-border bg-card p-4"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <div className="text-sm font-semibold">{widget.label}</div>
                        {count > 0 && (
                          <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                            {count}
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {widget.description}
                      </p>
                    </div>

                    {widget.allowMultiple ? (
                      <Button
                        variant="outline"
                        onClick={() => onChange(addWidgetToLayout(layout, widget.type))}
                      >
                        Add
                      </Button>
                    ) : (
                      <Switch
                        checked={visibleWidgetTypes.has(widget.type)}
                        onCheckedChange={(checked) =>
                          handleToggleWidget(widget.type, checked)
                        }
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          <section className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold">Current layout</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Drag cards to reorder the live preview. Width and settings still
                apply instantly.
              </p>
            </div>

            <div className="space-y-3">
              {placements.map((placement, index) => {
                const definition = widgetCatalog.find(
                  (widget) => widget.type === placement.widget.type,
                );
                const currentPreset = getColumnSpanPreset(
                  layout.rows[placement.rowIndex].columns[placement.columnIndex].span,
                );

                return (
                  <div
                    key={placement.widget.id}
                    draggable
                    onDragStart={() => setDraggingWidgetId(placement.widget.id)}
                    onDragEnd={() => {
                      setDraggingWidgetId(null);
                      setDropTargetWidgetId(null);
                    }}
                    onDragOver={(event) => {
                      event.preventDefault();
                      if (
                        draggingWidgetId &&
                        draggingWidgetId !== placement.widget.id
                      ) {
                        setDropTargetWidgetId(placement.widget.id);
                      }
                    }}
                    onDrop={(event) => {
                      event.preventDefault();
                      handleDrop(placement.widget.id);
                    }}
                    className={cn(
                      "rounded-2xl border border-border bg-card p-4 transition-colors",
                      draggingWidgetId === placement.widget.id && "opacity-50",
                      dropTargetWidgetId === placement.widget.id &&
                        "border-primary ring-1 ring-primary/35",
                    )}
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <GripVertical className="h-4 w-4 cursor-grab text-muted-foreground" />
                          <div className="text-sm font-semibold">
                            {definition?.label ?? placement.widget.type}
                          </div>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {definition?.description ?? "Dashboard widget"}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <Select
                          value={currentPreset}
                          onValueChange={(value: "full" | "half" | "third") =>
                            onChange(
                              updateWidgetColumnSpan(
                                layout,
                                placement.widget.id,
                                getSpanFromPreset(value),
                              ),
                            )
                          }
                        >
                          <SelectTrigger className="w-[130px]">
                            <SelectValue placeholder="Width" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="full">Full width</SelectItem>
                            <SelectItem value="half">Half width</SelectItem>
                            <SelectItem value="third">Third width</SelectItem>
                          </SelectContent>
                        </Select>

                        <Button
                          variant="outline"
                          size="icon"
                          disabled={index === 0}
                          onClick={() =>
                            onChange(
                              moveWidgetInLayout(layout, placement.widget.id, "up"),
                            )
                          }
                        >
                          <span className="sr-only">Move up</span>
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          disabled={index === placements.length - 1}
                          onClick={() =>
                            onChange(
                              moveWidgetInLayout(layout, placement.widget.id, "down"),
                            )
                          }
                        >
                          <span className="sr-only">Move down</span>
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            onChange(
                              duplicateWidgetInLayout(layout, placement.widget.id),
                            )
                          }
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            onChange(
                              removeWidgetFromLayout(layout, placement.widget.id),
                            )
                          }
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {definition?.fields && definition.fields.length > 0 && (
                      <div className="mt-4 grid gap-3 md:grid-cols-2">
                        {definition.fields.map((field) =>
                          renderFieldControl(
                            field,
                            placement.widget.id,
                            placement.widget.props?.[field.key],
                          ),
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        <SheetFooter className="mt-8 gap-3">
          <Button
            variant="outline"
            onClick={() => void onReset()}
            disabled={isResetting || isSaving}
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
          <Button onClick={() => void onSave()} disabled={isSaving || isResetting}>
            <Save className="h-4 w-4" />
            Save layout
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
