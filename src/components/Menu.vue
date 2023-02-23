<script>
   import PopupMenu from "@/app/PopupMenu.vue";
   const Mode = { Show: "show", Hide: "hide" };

   export default {
      Mode,

      props: { menus: { type: Array, default: () => [] } },
      data() {
         return { popupMenu: null };
      },
      computed: {
         isShowing: (c) => c.popupMenu && c.popupMenu.isShowing,
      },
      watch: {
         isShowing() {
            this.$emit("mode-change", this.isShowing ? Mode.Show : Mode.Hide);
         },
      },
      methods: {
         toggle() {
            if (this.isShowing) this.hide();
            else this.show();
         },
         show() {
            if (this.popupMenu) this.popupMenu.hide();

            this.popupMenu = this.$root.popupMenuShow(
               this._self.$el,
               this.menus.map((menu) => {
                  if (
                     typeof menu.click !== "function" &&
                     typeof menu.interact === "function"
                  )
                     menu.click = () => menu.interact();
                  return menu;
               }),
               PopupMenu.Corner.BOTTOM_LEFT,
            );
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
      @blur="hide()"
   >
      <slot />
   </button>
</template>

<style lang="scss" scoped>
   .Menu {
      font-size: 1rem;
      font-weight: 600;
 
      width: fit-content;
      height: fit-content;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      z-index: 1;
      cursor: pointer;
      background: none;
      border: none;
      border-radius: inherit;

      padding: 0.6em;
      overflow: hidden;

      &:hover,
      &:focus-within {
         background-color: hsla(0, 0%, 0%, 0.1);
      }
   }
</style>
