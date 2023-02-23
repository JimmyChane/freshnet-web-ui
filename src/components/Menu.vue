<script>
   import PopupMenu from "@/app/PopupMenu.vue";
   import U from "@/U";

   export default {
      Width: PopupMenu.Width,
      Corner: PopupMenu.Corner,

      props: {
         width: { type: Number, default: PopupMenu.Width.AUTO },
         corner: { type: Number, default: PopupMenu.Corner.BOTTOM_LEFT },
         menus: { default: undefined },
         primaryColor: { default: undefined },
      },
      data: () => ({ popupMenu: null }),
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
               U.isObject(this.menus) && !U.isArray(this.menus)
                  ? [this.menus]
                  : U.optArray(this.menus);

            for (const menu of menus) {
               const isLegacy =
                  typeof menu.click !== "function" && typeof menu.interact === "function";
               if (isLegacy) menu.click = () => menu.interact();
            }

            this.popupMenu = await this.store.dispatch("popupMenuShow", {
               anchor: this._self.$el,
               menus,
               option: {
                  width: this.width,
                  corner: this.corner,
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
