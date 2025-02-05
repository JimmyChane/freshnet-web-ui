<script>
import { useAppStore } from '@/stores/app.store';

import Item from './BottomNavigationBar-Item.vue';

export default {
  components: { Item },
  computed: {
    selectedPageKey: (c) => useAppStore().currentPageKey,
    selectedViewKey: (c) => useAppStore().currentViewKey,

    navigations: (c) => useAppStore().pages,
  },
};
</script>

<template>
  <div class="BottomNavigationBar">
    <div class="BottomNavigationBar-body transition">
      <Item
        v-for="navigation of navigations"
        :key="navigation.key"
        :item="navigation"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.BottomNavigationBar {
  width: 100%;
  height: var(--navigation-bottom-height);
  min-height: var(--navigation-bottom-height);
  max-height: var(--navigation-bottom-height);

  border-top: 1px solid hsl(0, 0%, 80%);

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  position: sticky;
  bottom: 0;

  .BottomNavigationBar-body {
    width: 100%;
    max-width: 22rem;
    height: 100%;

    --gap: 0.1rem;

    padding: var(--gap) calc(var(--gap) * 3);
    gap: var(--gap);

    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;
  }
}
</style>
