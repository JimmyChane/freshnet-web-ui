<script lang="ts">
  import ButtonIcon from "@/components/button/ButtonIcon.vue";
  import LeftNavClickableBody from "./NavigationDrawer-Clickable-Body.vue";
  import U from "@/U";
  import NavPage from "@/app/NavPage";
  import NavView from "@/app/NavView";
  import Vue from "vue";

  export default Vue.extend({
    components: { ButtonIcon, LeftNavClickableBody },
    props: {
      item: { type: [NavPage, NavView] },
      href: { type: String, default: "" },
      hasGroup2s: { type: Boolean, default: false },
    },
    computed: {
      styleClass(): string {
        return this.isSelected
          ? "NavigationDrawer-Clickable-isSlected"
          : "NavigationDrawer-Clickable-notSelected";
      },
      hasChildren(): boolean {
        if (this.item instanceof NavPage) {
          return U.optArray(this.item.groups).length > 0;
        }

        return false;
      },

      isWide(): boolean {
        return this.item.isWide();
      },
      isSelected(): boolean {
        return this.item.isSelected();
      },
      isExpand(): boolean {
        return this.item.isExpanded();
      },
    },
  });
</script>

<template>
  <router-link
    v-if="href"
    :class="['NavigationDrawer-Clickable', styleClass]"
    :isWide="`${isWide}`"
    :isExpand="`${isSelected && isExpand}`"
    :hasGroup2IsSelected="`${hasGroup2s && isSelected}`"
    :to="{ path: href }"
    @click="() => $emit('click', item)"
  >
    <LeftNavClickableBody
      :item="item"
      :isSelected="isSelected"
      :isWide="isWide"
      :isExpand="isExpand"
      :hasChildren="hasChildren"
      @click-open="(item) => $emit('click-open', item)"
    />
  </router-link>

  <button
    v-else
    :class="['LeftNavQuery', styleClass]"
    :isSelectedIsExpanded="`${isSelected && isExpand}`"
    :hasGroup2IsSelected="`${hasGroup2s && isSelected}`"
    :isWide="`${isWide}`"
    @click="() => $emit('click', item)"
  >
    <LeftNavClickableBody
      :item="item"
      :isSelected="isSelected"
      :isWide="isWide"
      :isExpand="isExpand"
      :hasChildren="hasChildren"
      @click-open="(item) => $emit('click-open', item)"
    />
  </button>
</template>

<style lang="scss" scoped>
  .NavigationDrawer-Clickable {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    background: none;
    border: none;
    text-align: start;
  }

  .NavigationDrawer-Clickable-isSelected {
    cursor: default;
  }
  .NavigationDrawer-Clickable-notSelected {
    cursor: pointer;
  }
</style>
