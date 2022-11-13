<script>
   import Loadingv1 from "@/components/Loading";
   import WindowTitle from "./WindowTitle.vue";
   import WindowBottom from "./WindowBottom.vue";

   export default {
      components: { Loadingv1, WindowTitle, WindowBottom },
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
         class="Window-header"
         :class="[scrollTop > 0 ? 'Window-header-isScrolledUp' : '']"
         ><WindowTitle :title="title"
      /></div>
      <div class="Window-main"><slot /></div>

      <WindowBottom
         class="Window-bottom"
         @click-cancel="$emit('click-cancel')"
         @click-ok="$emit('click-ok')"
      />

      <div class="Window-foreground"></div>

      <Loadingv1 class="Window-loading" :isRunning="isLoading" />
   </div>
</template>

<style lang="scss" scoped>
   .Window {
      width: 30rem;
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
         padding: 1.8rem;
         position: sticky;
         top: 0;
         left: 0;
         right: 0;
         display: flex;
         flex-direction: column;
         align-items: flex-start;
         justify-content: center;
         text-align: start;
         transition: var(--animation-duration);

         @media screen and (max-height: 30rem) {
            padding: 1rem 1.8rem;
         }
      }
      .Window-header-isScrolledUp {
         box-shadow: 0 0 0 black;
         background-color: hsl(0, 0%, 90%);
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
         background-color: hsl(0, 0%, 90%);
         z-index: 2;
         position: sticky;
         bottom: 0;
         left: 0;
         right: 0;
      }

      .Window-foreground {
         z-index: 4;
         width: 100%;
         height: 100%;
         position: absolute;
         background: white;
         opacity: 0;
         transition: var(--animation-duration);
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
