import { defineStore } from 'pinia';
import { ref } from 'vue';

import { useAppPathStore } from './app-path.store';

export enum AppLayoutId {
  NORMAL = -1,
  FULL = -2,
}

export const APP_LAYOUT_KEYS = Object.values(AppLayoutId);

export const useAppLayoutStore = defineStore('app-layout', () => {
  const appPathStore = useAppPathStore();

  const requests = ref<{ page: string; view: string; mode: number }[]>([]);

  const getCurrentPageKey = (): string => appPathStore.currentPageKey;
  const getCurrentViewKey = (): string => appPathStore.currentViewKey;

  const getVisibilityRequest = (
    page: string = '',
    view: string = '',
  ): { page: string; view: string; mode: number } | undefined => {
    return requests.value.find((request) => {
      return request.page === page && request.view === view;
    });
  };

  const setLayout = (mode: number = 0): void => {
    if (!APP_LAYOUT_KEYS.includes(mode)) return;

    const page = getCurrentPageKey();
    const view = getCurrentViewKey();
    const request = getVisibilityRequest(page, view);

    if (request) request.mode = mode;
    else requests.value.push({ page, view, mode });
  };

  const getCurrentVisibilityRequest = (): {
    page: string;
    view: string;
    mode: number;
  } | null => {
    const page = getCurrentPageKey();
    const view = getCurrentViewKey();
    const request = getVisibilityRequest(page, view);

    return request ?? null;
  };

  const getCurrentLayout = (): number => {
    const request = getCurrentVisibilityRequest();
    return request?.mode ?? AppLayoutId.FULL;
  };

  const isNormal = (): boolean => getCurrentLayout() === AppLayoutId.NORMAL;
  const isFull = (): boolean => getCurrentLayout() === AppLayoutId.FULL;

  return { requests, setLayout, getCurrentLayout, isNormal, isFull };
});
