import { useWindowSize } from '@vueuse/core';
import { defineStore } from 'pinia';

export const useAppSizeStore = defineStore('app-size', () => {
  const { width, height } = useWindowSize();

  return { width, height };
});
