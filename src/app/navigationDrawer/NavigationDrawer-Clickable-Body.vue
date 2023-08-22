<script>
  import ButtonIcon from "@/components/button/ButtonIcon.vue";
  import LeftNavItem from "./NavigationDrawer-Item.vue";
  import LeftNavClickableList from "./NavigationDrawer-Clickable-List.vue";
  import LeftNavClickableArrow from "./NavigationDrawer-Clickable-Arrow.vue";
  export default {
    emits: ["click-open"],
    components: {
      LeftNavItem,
      ButtonIcon,
      LeftNavClickableList,
      LeftNavClickableArrow,
    },
    props: {
      item: { type: Object },
      isSelected: { type: Boolean },
      isWide: { type: Boolean },
      hasChildren: { type: Boolean },
      isExpand: { type: Boolean },
    },
  };
</script>

<template>
  <div
    class="NavigationDrawer-Click-Body transition"
    :isSelected="`${isSelected}`"
    :isWide="`${isWide}`"
    :isExpand="`${isExpand}`"
  >
    <LeftNavClickableList
      :item="item"
      :isSelected="isSelected"
      :isWide="isWide"
    />
    <LeftNavClickableArrow
      v-if="hasChildren && isWide"
      :isExpand="isSelected"
      @click="() => $emit('click-open', item)"
    />
  </div>
</template>

<style lang="scss" scoped>
  .NavigationDrawer-Click-Body {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    text-decoration: none;
    background: none;
    border: none;
    position: relative;
  }

  .NavigationDrawer-Click-Body[isSelected="true"] {
    background: hsla(0, 0%, 0%, 0.8);
  }
  .NavigationDrawer-Click-Body[isSelected="false"] {
    &:hover,
    &:focus {
      box-shadow: var(--default-box-shadow);
      background: hsla(0, 0%, 0%, 0.1);
    }
  }

  .NavigationDrawer-Click-Body[isWide="true"] {
    width: 100%;
    border-radius: 0.5em;
  }
  .NavigationDrawer-Click-Body[isWide="false"] {
    border-radius: 0.5rem;
    align-items: center;
    justify-content: center;
  }

  .NavigationDrawer-Click-Body[isExpand="true"] {
    background: #d9dbdd;
    width: 100%;
    border-radius: 0;
  }
</style>
