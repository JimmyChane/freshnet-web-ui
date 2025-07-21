import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import { useAppPathStore } from './app-path.store';

export enum AppLayoutId {
  NORMAL = -1,
  FULL = -2,
}

export const APP_LAYOUT_KEYS = Object.values(AppLayoutId);

export const useAppLayoutStore = defineStore('app-layout', () => {
  const appPathStore = useAppPathStore();

  const requests = ref<{ page: string; view: string; mode: number }[]>([]);

  const currentPageKey = computed(() => appPathStore.currentPageKey);
  const currentViewKey = computed(() => appPathStore.currentViewKey);

  function getVisibilityRequest(
    page: string = '',
    view: string = '',
  ): { page: string; view: string; mode: number } | undefined {
    return requests.value.find((request) => {
      return request.page === page && request.view === view;
    });
  }

  function setLayout(mode: number = 0): void {
    if (!APP_LAYOUT_KEYS.includes(mode)) return;

    const request = getVisibilityRequest(currentPageKey.value, currentViewKey.value);

    if (request) {
      request.mode = mode;
    } else {
      requests.value.push({ page: currentPageKey.value, view: currentViewKey.value, mode });
    }
  }

  const currentLayout = computed(() => {
    const request = getVisibilityRequest(currentPageKey.value, currentViewKey.value);
    return request?.mode ?? AppLayoutId.FULL;
  });

  const isNormal = computed(() => currentLayout.value === AppLayoutId.NORMAL);
  const isFull = computed(() => currentLayout.value === AppLayoutId.FULL);

  return { requests, setLayout, currentLayout, isNormal, isFull };
});
