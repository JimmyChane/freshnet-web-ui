<script lang="ts">
  import Vue from "vue";
  import NavPage from "../NavPage";
  import Item from "./BottomNavigationBar-Item.vue";

  export default Vue.extend({
    components: { Item },
    computed: {
      selectedPageKey(): string {
        return this.$store.getters.currentPageKey;
      },
      selectedViewKey(): string {
        return this.$store.getters.currentViewKey;
      },
      navigations(): NavPage[] {
        return this.$store.getters.pages;
      },
    },
  });
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
