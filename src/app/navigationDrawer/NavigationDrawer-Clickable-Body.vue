<script>
import { NavPage } from '@/app/NavPage';
import { NavView } from '@/app/NavView';
import ButtonIcon from '@/components/button/ButtonIcon.vue';

import LeftNavClickableArrow from './NavigationDrawer-Clickable-Arrow.vue';
import LeftNavClickableList from './NavigationDrawer-Clickable-List.vue';
import LeftNavItem from './NavigationDrawer-Item.vue';

export default {
  emits: ['click-open'],
  components: {
    LeftNavItem,
    ButtonIcon,
    LeftNavClickableList,
    LeftNavClickableArrow,
  },
  props: {
    item: { type: [NavPage, NavView] },
    isSelected: { type: Boolean },
    isWide: { type: Boolean },
    hasChildren: { type: Boolean },
    isExpand: { type: Boolean },
  },
  computed: {
    style() {
      const style = {};

      if (this.isWide) {
        style['width'] = '100%';
        style['border-radius'] = '0.5em';
      } else {
        style['margin-inline'] = '0.2em';
        style['align-items'] = 'center';
        style['justify-content'] = 'center';
        style['border-radius'] = '0.5rem';
      }

      if (this.isWide && !this.hasChildren) {
        style['margin-inline'] = '0.4em';
      }

      if (!this.isWide && this.hasChildren) {
        style['margin-inline'] = '0';
      }
      if (this.isSelected && this.hasChildren) {
        style['width'] = '100%';
      }
      if (!this.isSelected && this.hasChildren) {
        style['width'] = '100%';
      }

      return style;
    },
  },
};
</script>

<template>
  <div
    class="NavigationDrawer-Click-Body transition"
    :isSelected="`${isSelected}`"
    :style="style"
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

.NavigationDrawer-Click-Body[isSelected='true'] {
  --primary-color: #1673e1;
  --secondary-color: rgba(22, 112, 223, 0.2);
  --third-color: hsla(213, 82%, 48%, 0.1);

  background: var(--secondary-color);
}
.NavigationDrawer-Click-Body[isSelected='false'] {
  --primary-color: rgba(0, 0, 0, 0.7);
  --secondary-color: rgba(22, 112, 223, 0.2);
  --third-color: hsla(213, 82%, 48%, 0.1);

  color: var(--primary-color);
  &:hover,
  &:focus {
    box-shadow: var(--default-box-shadow);
    background: var(--third-color);
  }
}
</style>
