<script>
   import Loading from "@/components/Loading";
   import WindowBottom from "./WindowBottom.vue";

   export default {
      components: { Loading, WindowBottom },
      emits: ["click-cancel", "click-ok"],
      props: {
         title: { type: String, default: "" },
         isShowing: { type: Boolean, default: false },
         isLoading: { type: Boolean, default: false },
         isClickable: { type: Boolean, default: true },
      },
      data() {
         return { scrollTop: 0 };
      },
      watch: {
         isShowing() {
            const { Window } = this.$refs;
            if (Window) Window.scrollTop = 0;
         },
      },
   };
</script>

<template>
   <div
      :class="['Window', isClickable ? '' : 'Window-notClickable']"
      ref="Window"
      @scroll="(event) => (scrollTop = event.target.scrollTop)"
   >
      <div
         class="Window-header transition"
         :class="[scrollTop > 0 ? 'Window-header-isScrolledUp' : '']"
      >
         <span class="Window-header-title">{{ title }}</span>
      </div>

      <div class="Window-main"><slot /></div>

      <WindowBottom
         class="Window-bottom"
         @click-cancel="$emit('click-cancel')"
         @click-ok="$emit('click-ok')"
      />

      <div class="Window-foreground transition"></div>

      <Loading class="Window-loading" :isShowing="isLoading" />
   </div>
</template>

<style lang="scss" scoped>
   .Window {
      width: 100%;
      height: 100%;

      font-size: 1rem;
      font-weight: 400;
      color: black;
      position: relative;

      display: flex;
      flex-direction: column;
      overflow-y: auto;

      .Window-header {
         z-index: 3;
         padding: 1.2rem 1.8rem;
         position: sticky;
         top: 0;
         left: 0;
         right: 0;

         display: flex;
         flex-direction: column;
         align-items: center;
         justify-content: center;
         text-align: start;
         border-bottom: 1px solid transparent;
         background-color: hsl(0, 0%, 96%);

         @media screen and (max-height: 30rem) {
            padding: 1rem 1.8rem;
         }

         .Window-header-title {
            font-weight: 600;
            font-size: 1.5rem;
            color: black;
         }
      }
      .Window-header-isScrolledUp {
         border-bottom: 1px solid hsl(0, 0%, 90%);
      }

      .Window-main {
         z-index: 1;
         width: 100%;
         height: fit-content;
         padding: 1.8rem;
         padding-top: 1rem;
         display: flex;
         flex-direction: column;
      }

      .Window-bottom {
         z-index: 2;
      }

      .Window-foreground {
         z-index: 4;
         width: 100%;
         height: 100%;
         position: absolute;
         background: white;
         opacity: 0;
         pointer-events: none;
      }

      .Window-loading {
         z-index: 5;
         position: absolute;
         width: 100%;
         pointer-events: none;
      }
   }

   .Window-notClickable {
      pointer-events: none;
      .Window-foreground {
         opacity: 0.5;
      }
   }
</style>
