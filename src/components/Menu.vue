<script>
import { isArray, isObjectOnly, optArray } from '@/U';
import {
  POPUP_MENU_ALIGNMENT,
  POPUP_MENU_CORNER,
  POPUP_MENU_WIDTH,
} from '@/app/popupMenu/PopupMenuOption';
import { useAppStore } from '@/stores/app.store';

export default {
  Width: POPUP_MENU_ALIGNMENT,
  Corner: POPUP_MENU_CORNER,
  Alignment: POPUP_MENU_WIDTH,

  props: {
    width: { type: Number, default: POPUP_MENU_ALIGNMENT.AUTO },
    corner: { type: Number, default: POPUP_MENU_CORNER.AUTO },
    alignment: { type: Number, default: POPUP_MENU_WIDTH.AUTO },
    menus: { default: undefined },
    primaryColor: { default: undefined },
  },
  data: (c) => ({ popupMenu: null }),
  computed: { isShowing: (c) => c.popupMenu && c.popupMenu.isShowing },
  watch: {
    isShowing() {
      this.isShowing ? this.$emit('show') : this.$emit('hide');
    },
  },
  methods: {
    toggle() {
      if (this.isShowing) this.hide();
      else this.show();
    },
    async show() {
      if (this.popupMenu) this.popupMenu.hide();

      const menus =
        isObjectOnly(this.menus) && !isArray(this.menus)
          ? [this.menus]
          : optArray(this.menus);

      for (const menu of menus) {
        const isLegacy =
          typeof menu.click !== 'function' &&
          typeof menu.interact === 'function';
        if (isLegacy) menu.click = () => menu.interact();
      }

      this.popupMenu = await useAppStore().popupMenuShow({
        anchor: this._self.$el,
        menus,
        option: {
          width: this.width,
          corner: this.corner,
          alignment: this.alignment,
          primaryColor: this.primaryColor,
        },
      });
    },
    hide() {
      if (!this.popupMenu) return;
      this.popupMenu.hide();
    },
  },
};
</script>

<template>
  <button
    class="Menu transition"
    @mouseover="(x) => $emit('mouseover', x)"
    @mouseleave="(x) => $emit('mouseleave', x)"
    @click="() => toggle()"
    @blur="() => hide()"
  >
    <slot />
  </button>
</template>

<style lang="scss" scoped>
.Menu {
  background: none;
  border: none;
  cursor: pointer;
}
</style>
