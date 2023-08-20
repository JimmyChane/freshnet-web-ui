<script>
  import Item from "./NavigationBottom-Item.vue";
  export default {
    components: { Item },
    computed: {
      selectedPageKey: (c) => c.store.getters.currentPageKey,
      selectedViewKey: (c) => c.store.getters.currentViewKey,

      navigations: (c) => c.store.getters.pages,
    },
  };
</script>

<template>
  <div class="NavigationBottom">
    <div class="NavigationBottom-body transition">
      <Item
        v-for="navigation of navigations"
        :key="navigation.key"
        :item="navigation"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .NavigationBottom {
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

    .NavigationBottom-body {
      width: 100%;
      max-width: 25rem;
      height: 100%;

      --gap: 0.3rem;

      padding: var(--gap) calc(var(--gap) * 3);
      gap: var(--gap);

      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-around;
    }
  }
</style>
