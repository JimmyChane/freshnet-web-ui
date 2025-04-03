import { defineStore } from 'pinia';
import { computed, watch } from 'vue';
import { useRoute } from 'vue-router';

import { useAppNavigationStore } from './app-navigation.store';

export const useAppPathStore = defineStore('app-path', () => {
  const route = useRoute();

  const paths = computed(() => route.path.split('/').filter((path) => path));
  const currentPaths = computed(() => {
    let fullPath = route.fullPath;

    let questionMarkIndex = fullPath.indexOf('?');
    if (questionMarkIndex !== -1) {
      fullPath = fullPath.substring(0, questionMarkIndex);
    }

    return fullPath.split(/[/]/).filter((path) => path);
  });
  const currentPageKey = computed(() => {
    let paths = currentPaths.value;
    return paths.length > 0 ? paths[0] : '';
  });
  const currentViewKey = computed(() => {
    let paths = currentPaths.value;
    return paths.length > 1 ? paths[1] : '';
  });

  watch(currentPaths, () => useAppNavigationStore().closeNavigationDrawer());

  return { paths, currentPaths, currentPageKey, currentViewKey };
});
