import { ReactNode } from "react";
import { motion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  type DashboardColumn,
  type DashboardGridSpan,
  type DashboardLayoutSchema,
} from "@/components/dashboard/dashboard-schema";
import {
  getDashboardWidgetDefinition,
  type DashboardWidgetContext,
} from "@/components/dashboard/registry/dashboard-widget-registry";

const GRID_SPAN_CLASS_MAP = {
  1: "col-span-1",
  2: "col-span-2",
  3: "col-span-3",
  4: "col-span-4",
  5: "col-span-5",
  6: "col-span-6",
  7: "col-span-7",
  8: "col-span-8",
  9: "col-span-9",
  10: "col-span-10",
  11: "col-span-11",
  12: "col-span-12",
} as const;

const MD_GRID_SPAN_CLASS_MAP = {
  1: "md:col-span-1",
  2: "md:col-span-2",
  3: "md:col-span-3",
  4: "md:col-span-4",
  5: "md:col-span-5",
  6: "md:col-span-6",
  7: "md:col-span-7",
  8: "md:col-span-8",
  9: "md:col-span-9",
  10: "md:col-span-10",
  11: "md:col-span-11",
  12: "md:col-span-12",
} as const;

const LG_GRID_SPAN_CLASS_MAP = {
  1: "lg:col-span-1",
  2: "lg:col-span-2",
  3: "lg:col-span-3",
  4: "lg:col-span-4",
  5: "lg:col-span-5",
  6: "lg:col-span-6",
  7: "lg:col-span-7",
  8: "lg:col-span-8",
  9: "lg:col-span-9",
  10: "lg:col-span-10",
  11: "lg:col-span-11",
  12: "lg:col-span-12",
} as const;

interface DashboardRendererProps {
  layout: DashboardLayoutSchema;
  context: DashboardWidgetContext;
  rowVariants: Variants;
  itemVariants: Variants;
  renderCard: (children: ReactNode, className?: string) => ReactNode;
}

function getColumnClassName(span: DashboardGridSpan, className?: string) {
  return cn(
    GRID_SPAN_CLASS_MAP[span.base],
    span.md ? MD_GRID_SPAN_CLASS_MAP[span.md] : undefined,
    span.lg ? LG_GRID_SPAN_CLASS_MAP[span.lg] : undefined,
    className,
  );
}

function getStackClassName(column: DashboardColumn) {
  if (column.widgets.length <= 1) {
    return undefined;
  }

  return column.stackClassName ?? "flex flex-col gap-3 sm:gap-4";
}

export function DashboardRenderer({
  layout,
  context,
  rowVariants,
  itemVariants,
  renderCard,
}: DashboardRendererProps) {
  return (
    <>
      {layout.rows.map((row) => (
        <motion.div
          key={row.id}
          variants={rowVariants}
          className={cn("grid grid-cols-12 gap-3 sm:gap-4", row.className)}
        >
          {row.columns.map((column) => (
            <motion.div
              key={column.id}
              variants={itemVariants}
              className={getColumnClassName(column.span, column.className)}
            >
              <div className={getStackClassName(column)}>
                {column.widgets.map((widget) => {
                  const definition = getDashboardWidgetDefinition(widget.type);
                  const content = definition.render(context, widget.props);

                  return (
                    <div key={widget.id}>
                      {renderCard(
                        widget.innerClassName ? (
                          <div className={widget.innerClassName}>{content}</div>
                        ) : (
                          content
                        ),
                        widget.cardClassName,
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </motion.div>
      ))}
    </>
  );
}
