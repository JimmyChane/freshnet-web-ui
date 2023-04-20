<script>
   import Drawer from "@/components/Drawer.vue";
   import BottomsheetWindow from "@/components/window/BottomsheetWindow.vue";

   export default {
      emits: ["click-collapse", "on-showing"],
      components: { Drawer, BottomsheetWindow },
      props: {
         wideWidthThreshold: { type: Number, default: 1200 },
         isShowing: { type: Boolean, default: false },
         titleEmpty: { type: String, default: "Select to view" },
      },
      computed: {
         isWide: (c) => c.$root.window.innerWidth > c.wideWidthThreshold,

         drawerEdge: (c) => Drawer.Edge.RIGHT,
         drawerMode: (c) => {
            if (c.isWide) {
               return c.isShowing
                  ? Drawer.Mode.FIXED_EXPAND
                  : Drawer.Mode.FIXED_COLLAPSE;
            } else {
               return c.isShowing
                  ? Drawer.Mode.DRAWER_EXPAND
                  : Drawer.Mode.DRAWER_COLLAPSE;
            }
         },
      },
      watch: {
         isShowing() {
            this.emitShowing();
         },
         isWide() {
            this.emitWide();
         },
      },
      methods: {
         emitShowing() {
            this.$emit("on-isShowing", this.isShowing);
         },
         emitWide() {
            this.$emit("on-isWide", this.isWide);
         },
      },
      mounted() {
         this.emitShowing();
         this.emitWide();
      },
   };
</script>

<template>
   <div class="PanelRight" :isWide="`${isWide}`" v-if="isWide">
      <div class="PanelRight-empty">
         <span class="PanelRight-empty-text">{{ titleEmpty }}</span>
      </div>

      <Drawer
         class="PanelRight-Drawer"
         :edge="drawerEdge"
         :mode="drawerMode"
         @click-collapse="() => $emit('click-collapse')"
      >
         <slot />
      </Drawer>
   </div>

   <BottomsheetWindow
      v-else
      class="PanelRight-Bottomsheet"
      :isShowing="isShowing"
      @click-dismiss="() => $emit('click-collapse')"
   >
      <slot />
   </BottomsheetWindow>
</template>

<style lang="scss" scoped>
   .PanelRight {
      position: relative;

      width: 100dvw;
      height: 100dvh;
      max-width: 100%;
      max-height: 100%;

      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      justify-content: flex-start;
      overflow: hidden;

      .PanelRight-empty {
         z-index: 1;
         background-color: hsla(0, 0%, 0%, 0.6);

         display: flex;
         flex-direction: column;
         align-items: center;
         justify-content: center;

         position: absolute;
         right: 0;
         top: 0;
         bottom: 0;

         .PanelRight-empty-text {
            font-weight: 600;
            font-size: 1.2rem;
            color: hsl(0, 0%, 84%);
            background: hsla(0, 0%, 0%, 0.04);
            border-radius: 1rem;
            padding: 4rem 5rem;
         }
      }
      .PanelRight-Drawer {
         z-index: 2;
      }

      & > * {
         width: 100dvw;
         max-width: 100%;
      }
   }
   .PanelRight-Bottomsheet {
      --default-size-top: 0;
   }
</style>
