import { useWindowSize } from '@vueuse/core';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import { useAppPathStore } from './app-path.store';

export const NAVIGATION_MIN_WIDTH: number = 1000;
export enum NavigationVisibility {
  NONE = -1,
  EXPANDED = -2,
  COLLAPSED = -3,
}
export enum NavigationLayout {
  WIDE = -1,
  THIN = -2,
}

export const NAVIGATION_VISIBILITIES = Object.values(NavigationVisibility);
export const NAVIGATION_LAYOUTS = Object.values(NavigationLayout);

export const useAppNavigationStore = defineStore('app-navigation', () => {
  const appPathStore = useAppPathStore();
  const appSizeStore = useWindowSize();

  const defaultVisibility = ref<NavigationVisibility>(NavigationVisibility.COLLAPSED);
  const defaultLayout = ref<NavigationLayout>(NavigationLayout.WIDE);
  const visibilityRequests = ref<{ page: string; view: string; visibility: number }[]>([]);
  const layoutRequests = ref<{ page: string; view: string; layout: number }[]>([]);

  function getVisibilityRequest(
    page: string = '',
    view: string = '',
  ): { page: string; view: string; visibility: number } | undefined {
    return visibilityRequests.value.find((request) => {
      return request.page === page && request.view === view;
    });
  }
  function getLayoutRequest(
    page: string = '',
    view: string = '',
  ): { page: string; view: string; layout: number } | undefined {
    return layoutRequests.value.find((request) => {
      return request.page === page && request.view === view;
    });
  }

  function setDefaultVisibility(visibility: number = 0): void {
    if (!NAVIGATION_VISIBILITIES.includes(visibility)) return;
    defaultVisibility.value = visibility;
  }
  function setDefaultLayout(layout: number = 0): void {
    if (!NAVIGATION_LAYOUTS.includes(layout)) return;
    defaultLayout.value = layout;
  }

  function setVisibility(visibility: number = 0): void {
    if (!NAVIGATION_VISIBILITIES.includes(visibility)) return;

    const request = getVisibilityRequest(appPathStore.currentPageKey, appPathStore.currentViewKey);
    if (request) request.visibility = visibility;
    else
      visibilityRequests.value.push({
        page: appPathStore.currentPageKey,
        view: appPathStore.currentViewKey,
        visibility,
      });
  }
  function setLayout(layout: number = 0): void {
    if (!NAVIGATION_LAYOUTS.includes(layout)) return;

    const request = getLayoutRequest(appPathStore.currentPageKey, appPathStore.currentViewKey);
    if (request) request.layout = layout;
    else layoutRequests.value.push({ page: appPathStore.currentPageKey, view: appPathStore.currentViewKey, layout });
  }

  const currentVisibility = computed(() => {
    const request = getVisibilityRequest(appPathStore.currentPageKey, appPathStore.currentViewKey);
    return request?.visibility ?? defaultVisibility.value;
  });
  const currentLayout = computed(() => {
    const request = getLayoutRequest(appPathStore.currentPageKey, appPathStore.currentViewKey);
    return request?.layout ?? defaultLayout.value;
  });

  const isWide = computed(() => !isThin.value);
  const isThin = computed(() => {
    if (isDrawer.value) return false;

    if (currentLayout.value === NavigationLayout.WIDE) {
      return appSizeStore.width.value <= NAVIGATION_MIN_WIDTH;
    }
    return currentLayout.value === NavigationLayout.THIN;
  });
  const isDrawer = computed(() => appSizeStore.width.value <= 600);

  const isNone = computed(() => currentVisibility.value === NavigationVisibility.NONE);
  const isExpanded = computed(() => currentVisibility.value === NavigationVisibility.EXPANDED);
  const isCollapsed = computed(() => currentVisibility.value === NavigationVisibility.COLLAPSED);

  function openNavigationDrawer(): void {
    setVisibility(NavigationVisibility.EXPANDED);
  }
  function closeNavigationDrawer(): void {
    setVisibility(NavigationVisibility.COLLAPSED);
  }
  function disableNavigationDrawer(): void {
    setVisibility(NavigationVisibility.NONE);
  }

  return {
    setDefaultVisibility,
    setDefaultLayout,
    setVisibility,
    setLayout,

    currentVisibility,
    currentLayout,

    isWide,
    isThin,

    isDrawer,

    isNone,
    isExpanded,
    isCollapsed,

    openNavigationDrawer,
    closeNavigationDrawer,
    disableNavigationDrawer,
  };
});
