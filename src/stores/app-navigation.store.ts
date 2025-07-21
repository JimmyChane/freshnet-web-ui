import { defineStore } from 'pinia';
import { ref } from 'vue';

import { useAppPathStore } from './app-path.store';
import { useAppSizeStore } from './app-size.store';

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
  const appSizeStore = useAppSizeStore();

  const defaultVisibility = ref<NavigationVisibility>(NavigationVisibility.COLLAPSED);
  const defaultLayout = ref<NavigationLayout>(NavigationLayout.WIDE);
  const visibilityRequests = ref<{ page: string; view: string; visibility: number }[]>([]);
  const layoutRequests = ref<{ page: string; view: string; layout: number }[]>([]);

  const getCurrentPageKey = (): string => appPathStore.currentPageKey;
  const getCurrentViewKey = (): string => appPathStore.currentViewKey;

  const getVisibilityRequest = (
    page: string = '',
    view: string = '',
  ): { page: string; view: string; visibility: number } | undefined => {
    return visibilityRequests.value.find((request) => {
      return request.page === page && request.view === view;
    });
  };
  const getLayoutRequest = (
    page: string = '',
    view: string = '',
  ): { page: string; view: string; layout: number } | undefined => {
    return layoutRequests.value.find((request) => {
      return request.page === page && request.view === view;
    });
  };

  const setDefaultVisibility = (visibility: number = 0): void => {
    if (!NAVIGATION_VISIBILITIES.includes(visibility)) return;
    defaultVisibility.value = visibility;
  };
  const setDefaultLayout = (layout: number = 0): void => {
    if (!NAVIGATION_LAYOUTS.includes(layout)) return;
    defaultLayout.value = layout;
  };

  const setVisibility = (visibility: number = 0): void => {
    if (!NAVIGATION_VISIBILITIES.includes(visibility)) return;

    const page = getCurrentPageKey();
    const view = getCurrentViewKey();
    const request = getVisibilityRequest(page, view);
    if (request) request.visibility = visibility;
    else visibilityRequests.value.push({ page, view, visibility });
  };
  const setLayout = (layout: number = 0): void => {
    if (!NAVIGATION_LAYOUTS.includes(layout)) return;

    const page = getCurrentPageKey();
    const view = getCurrentViewKey();
    const request = getLayoutRequest(page, view);
    if (request) request.layout = layout;
    else layoutRequests.value.push({ page, view, layout });
  };

  const getCurrentVisibilityRequest = (): { page: string; view: string; visibility: number } | null => {
    const page = getCurrentPageKey();
    const view = getCurrentViewKey();
    const request = getVisibilityRequest(page, view);

    return request ?? null;
  };
  const getCurrentLayoutRequest = (): { page: string; view: string; layout: number } | null => {
    const page = getCurrentPageKey();
    const view = getCurrentViewKey();
    const request = getLayoutRequest(page, view);

    return request ?? null;
  };

  const getCurrentVisibility = (): number => {
    const request = getCurrentVisibilityRequest();
    if (request) return request.visibility;
    return defaultVisibility.value;
  };
  const getCurrentLayout = (): number => {
    const request = getCurrentLayoutRequest();
    if (request) return request.layout;
    return defaultLayout.value;
  };

  const isWide = (): boolean => {
    return !isThin();
  };
  const isThin = (): boolean => {
    if (isDrawer()) return false;

    if (getCurrentLayout() === NavigationLayout.WIDE) {
      return appSizeStore.width <= NAVIGATION_MIN_WIDTH;
    }
    return getCurrentLayout() === NavigationLayout.THIN;
  };

  const isDrawer = (): boolean => {
    return appSizeStore.width <= 600;
  };

  const isNone = (): boolean => {
    return getCurrentVisibility() === NavigationVisibility.NONE;
  };
  const isExpanded = (): boolean => {
    return getCurrentVisibility() === NavigationVisibility.EXPANDED;
  };
  const isCollapsed = (): boolean => {
    return getCurrentVisibility() === NavigationVisibility.COLLAPSED;
  };

  const openNavigationDrawer = (): void => {
    setVisibility(NavigationVisibility.EXPANDED);
  };
  const closeNavigationDrawer = (): void => {
    setVisibility(NavigationVisibility.COLLAPSED);
  };
  const disableNavigationDrawer = (): void => {
    setVisibility(NavigationVisibility.NONE);
  };

  return {
    setDefaultVisibility,
    setDefaultLayout,
    setVisibility,
    setLayout,

    getCurrentVisibilityRequest,
    getCurrentLayoutRequest,

    getCurrentVisibility,
    getCurrentLayout,

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
