import { useMemo } from "react";
import { ArrowDown, ArrowUp, LayoutPanelTop, RotateCcw, Save } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  type DomainPageLayout,
  moveDomainPageTab,
  setDomainPageTabVisibility,
} from "@/components/shared/domain-page-config";

interface DomainPageCustomizeSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  layout: DomainPageLayout;
  onChange: (layout: DomainPageLayout) => void;
  onSave: () => void | Promise<void>;
  onReset: () => void | Promise<void>;
  isSaving?: boolean;
  isResetting?: boolean;
}

export function DomainPageCustomizeSheet({
  open,
  onOpenChange,
  layout,
  onChange,
  onSave,
  onReset,
  isSaving = false,
  isResetting = false,
}: DomainPageCustomizeSheetProps) {
  const orderedTabs = useMemo(
    () => [...layout.tabs].sort((left, right) => left.order - right.order),
    [layout],
  );
  const visibleCount = orderedTabs.filter((tab) => tab.visible).length;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-xl">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <LayoutPanelTop className="h-5 w-5" />
            Customize Page
          </SheetTitle>
          <SheetDescription>
            Choose which sections appear on this page and reorder the tabs you use most.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-8 space-y-3">
          {orderedTabs.map((tab, index) => (
            <div
              key={tab.value}
              className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 lg:flex-row lg:items-center lg:justify-between"
            >
              <div className="min-w-0">
                <div className="text-sm font-semibold">{tab.label}</div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {tab.visible ? "Visible on the page" : "Hidden from the page"}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Switch
                  checked={tab.visible}
                  disabled={tab.visible && visibleCount === 1}
                  onCheckedChange={(checked) =>
                    onChange(setDomainPageTabVisibility(layout, tab.value, checked))
                  }
                />
                <Button
                  variant="outline"
                  size="icon"
                  disabled={index === 0}
                  onClick={() =>
                    onChange(moveDomainPageTab(layout, tab.value, "up"))
                  }
                >
                  <ArrowUp className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  disabled={index === orderedTabs.length - 1}
                  onClick={() =>
                    onChange(moveDomainPageTab(layout, tab.value, "down"))
                  }
                >
                  <ArrowDown className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <SheetFooter className="mt-8 gap-3">
          <Button
            variant="outline"
            onClick={() => void onReset()}
            disabled={isSaving || isResetting}
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
          <Button onClick={() => void onSave()} disabled={isSaving || isResetting}>
            <Save className="h-4 w-4" />
            Save page layout
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
