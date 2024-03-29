<script>
  import { isArray, isFunction, isObjectOnly, optArray } from "@/U";
  import PopupMenuOption from "@/app/popupMenu/PopupMenuOption";

  export default {
    Width: PopupMenuOption.Width,
    Corner: PopupMenuOption.Corner,
    Alignment: PopupMenuOption.Alignment,

    props: {
      width: { type: Number, default: PopupMenuOption.Width.AUTO },
      corner: { type: Number, default: PopupMenuOption.Corner.AUTO },
      alignment: { type: Number, default: PopupMenuOption.Alignment.AUTO },
      menus: { default: undefined },
      primaryColor: { default: undefined },
    },
    data: (c) => ({ popupMenu: null }),
    computed: { isShowing: (c) => c.popupMenu && c.popupMenu.isShowing },
    watch: {
      isShowing() {
        this.isShowing ? this.$emit("show") : this.$emit("hide");
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
          const isLegacy = !isFunction(menu.click) && isFunction(menu.interact);
          if (isLegacy) menu.click = () => menu.interact();
        }

        this.popupMenu = await this.$store.dispatch("popupMenuShow", {
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
