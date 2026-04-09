interface DomainPageTabDefinition {
  value: string;
  label: string;
}

export interface DomainTabPreference {
  value: string;
  label: string;
  visible: boolean;
  order: number;
}

export interface DomainPageLayout {
  version: 1;
  tabs: DomainTabPreference[];
}

function cloneLayout(layout: DomainPageLayout): DomainPageLayout {
  return JSON.parse(JSON.stringify(layout)) as DomainPageLayout;
}

export function createDefaultDomainPageLayout<TTab extends DomainPageTabDefinition>(
  tabs: TTab[],
) {
  return {
    version: 1 as const,
    tabs: tabs.map((tab, index) => ({
      value: tab.value,
      label: tab.label,
      visible: true,
      order: index,
    })),
  };
}

export function normalizeDomainPageLayout(
  layout: DomainPageLayout | null | undefined,
  tabs: DomainPageTabDefinition[],
): DomainPageLayout {
  const defaults = createDefaultDomainPageLayout(tabs);

  if (!layout || layout.version !== 1 || !Array.isArray(layout.tabs)) {
    return defaults;
  }

  const savedByValue = new Map(layout.tabs.map((tab) => [tab.value, tab]));

  return {
    version: 1,
    tabs: defaults.tabs.map((tab, index) => {
      const saved = savedByValue.get(tab.value);

      return {
        value: tab.value,
        label: tab.label,
        visible: saved?.visible ?? true,
        order: saved?.order ?? index,
      };
    }),
  };
}

export function applyDomainPageLayout<TTab extends DomainPageTabDefinition>(
  tabs: TTab[],
  layout: DomainPageLayout,
): TTab[] {
  const preferences = new Map(layout.tabs.map((tab) => [tab.value, tab]));

  return [...tabs]
    .filter((tab) => preferences.get(tab.value)?.visible ?? true)
    .sort((left, right) => {
      const leftOrder = preferences.get(left.value)?.order ?? 0;
      const rightOrder = preferences.get(right.value)?.order ?? 0;
      return leftOrder - rightOrder;
    });
}

function swapOrders(
  tabs: DomainTabPreference[],
  sourceIndex: number,
  targetIndex: number,
) {
  const next = [...tabs];
  const source = next[sourceIndex];
  const target = next[targetIndex];

  next[sourceIndex] = { ...target, order: source.order };
  next[targetIndex] = { ...source, order: target.order };

  return next;
}

export function moveDomainPageTab(
  layout: DomainPageLayout,
  value: string,
  direction: "up" | "down",
): DomainPageLayout {
  const next = cloneLayout(layout);
  const orderedTabs = [...next.tabs].sort((left, right) => left.order - right.order);
  const currentIndex = orderedTabs.findIndex((tab) => tab.value === value);

  if (currentIndex === -1) return next;

  const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
  if (targetIndex < 0 || targetIndex >= orderedTabs.length) return next;

  const swapped = swapOrders(orderedTabs, currentIndex, targetIndex);
  return {
    version: 1,
    tabs: swapped.map((tab, index) => ({ ...tab, order: index })),
  };
}

export function setDomainPageTabVisibility(
  layout: DomainPageLayout,
  value: string,
  visible: boolean,
): DomainPageLayout {
  if (!visible) {
    const visibleCount = layout.tabs.filter((tab) => tab.visible).length;
    const targetTab = layout.tabs.find((tab) => tab.value === value);

    if (visibleCount <= 1 && targetTab?.visible) {
      return layout;
    }
  }

  return {
    version: 1,
    tabs: layout.tabs.map((tab) =>
      tab.value === value ? { ...tab, visible } : tab,
    ),
  };
}
