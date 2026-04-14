import {
  BookMarked,
  Boxes,
  ClipboardList,
  FolderOpen,
  KanbanSquare,
  Layers3,
  NotebookTabs,
  Sparkles,
  Target,
  type LucideIcon,
} from "lucide-react";

export type CustomDomainIconKey =
  | "Layers3"
  | "Boxes"
  | "KanbanSquare"
  | "NotebookTabs"
  | "FolderOpen"
  | "Target"
  | "BookMarked"
  | "Sparkles"
  | "ClipboardList";

export const CUSTOM_DOMAIN_ICON_COMPONENTS: Record<
  CustomDomainIconKey,
  LucideIcon
> = {
  Layers3,
  Boxes,
  KanbanSquare,
  NotebookTabs,
  FolderOpen,
  Target,
  BookMarked,
  Sparkles,
  ClipboardList,
};

export const CUSTOM_DOMAIN_ICON_OPTIONS: Array<{
  key: CustomDomainIconKey;
  label: string;
  icon: LucideIcon;
}> = Object.entries(CUSTOM_DOMAIN_ICON_COMPONENTS).map(([key, icon]) => ({
  key: key as CustomDomainIconKey,
  label: key,
  icon,
}));

export function getCustomDomainIconComponent(iconKey: string): LucideIcon {
  return CUSTOM_DOMAIN_ICON_COMPONENTS[
    (iconKey in CUSTOM_DOMAIN_ICON_COMPONENTS
      ? iconKey
      : "Layers3") as CustomDomainIconKey
  ];
}
