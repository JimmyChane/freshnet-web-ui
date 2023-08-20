<script>
  import LeftNavItem from "./NavigationLeft-Item.vue";

  export default {
    props: {
      item: { type: Object },
      isWide: { type: Boolean },
    },
    components: { LeftNavItem },
  };
</script>

<template>
  <div class="NavigationLeft-Clickable-List" :isWide="`${isWide}`">
    <LeftNavItem :item="item" :isWide="isWide" />
  </div>
</template>

<style lang="scss" scoped>
  .NavigationLeft-Clickable-List {
    height: fit-content;
    width: 100%;
    display: flex;
    flex-grow: 1;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    padding: 0.7rem 1rem;
  }

  .NavigationLeft-Clickable-List[isWide="true"] {
    padding-right: 3rem;
  }
  .NavigationLeft-Clickable-List[isWide="false"] {
    width: min-content;
    align-items: center;
    justify-content: center;
    padding: 0.7rem;
  }
</style>
