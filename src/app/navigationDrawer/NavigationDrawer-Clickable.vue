<script>
import { optArray } from '@/U';
import { NavPage } from '@/app/NavPage';
import { NavView } from '@/app/NavView';
import ButtonIcon from '@/components/button/ButtonIcon.vue';

import LeftNavClickableBody from './NavigationDrawer-Clickable-Body.vue';

export default {
  emits: ['click', 'click-expand'],
  components: { ButtonIcon, LeftNavClickableBody },
  props: {
    item: { type: [NavPage, NavView], default: () => null },
    href: { type: String, default: '' },
    hasGroup2s: { type: Boolean, default: false },
  },
  computed: {
    styleClass() {
      return this.isSelected
        ? 'NavigationDrawer-Clickable-isSlected'
        : 'NavigationDrawer-Clickable-notSelected';
    },
    hasChildren() {
      return optArray(this.item.groups).length > 0;
    },

    isWide() {
      return this.item.isWide();
    },
    isSelected() {
      return this.item.isSelected();
    },
    isExpand() {
      return this.item.isExpanded();
    },
  },
};
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
