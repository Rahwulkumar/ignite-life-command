import {
  createDefaultDashboardLayout,
  normalizeDashboardLayout,
} from "@/components/dashboard/dashboard-layout-utils";
import type { DashboardLayoutSchema } from "@/components/dashboard/dashboard-schema";
import { useViewConfig } from "@/hooks/useViewConfig";

export function useDashboardLayout(viewKey = "dashboard:home") {
  const viewConfig = useViewConfig<DashboardLayoutSchema>({
    viewKey,
    defaultValue: createDefaultDashboardLayout(),
    normalize: normalizeDashboardLayout,
  });

  return {
    layout: viewConfig.value,
    isLoading: viewConfig.isLoading,
    isSaving: viewConfig.isSaving,
    isResetting: viewConfig.isResetting,
    saveLayout: viewConfig.saveValue,
    resetLayout: viewConfig.resetValue,
  };
}
