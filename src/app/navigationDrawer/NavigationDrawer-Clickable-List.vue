<script>
  import NavPage from "@/app/NavPage";
  import NavView from "@/app/NavView";
  import LeftNavItem from "./NavigationDrawer-Item.vue";

  export default {
    props: {
      item: { type: [NavPage, NavView] },
      isWide: { type: Boolean },
    },
    components: { LeftNavItem },
  };
</script>

<template>
  <div class="NavigationDrawer-Clickable-List" :isWide="`${isWide}`">
    <LeftNavItem :item="item" :isWide="isWide" />
  </div>
</template>

<style lang="scss" scoped>
  .NavigationDrawer-Clickable-List {
    height: fit-content;
    width: 100%;
    display: flex;
    flex-grow: 1;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    padding: 0.7rem 1rem;
  }

  .NavigationDrawer-Clickable-List[isWide="true"] {
    padding-right: 3rem;
  }
  .NavigationDrawer-Clickable-List[isWide="false"] {
    width: min-content;
    align-items: center;
    justify-content: center;
    padding: 0.7rem;
  }
</style>
