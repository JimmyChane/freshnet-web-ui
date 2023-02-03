<script>
   import DismissableContainer from "@/components/components/DismissableContainer.vue";

   export default {
      emits: ["click-dismiss", "listen-open"],
      components: { DismissableContainer },
      props: {
         isShowing: { type: Boolean, default: false },
      },
      watch: {
         isShowing() {
            this.$emit("listen-showing", this.isShowing);
         },
      },
   };
</script>

<template>
   <DismissableContainer
      class="BottomsheetWindow transition"
      :class="[
         isShowing ? 'BottomsheetWindow-expand' : 'BottomsheetWindow-collapse',
      ]"
      @click-dismiss="$emit('click-dismiss')"
   >
      <div class="BottomsheetWindow-body transition">
         <slot />
      </div>
   </DismissableContainer>
</template>

<style lang="scss" scoped>
   .BottomsheetWindow {
      width: 100%;
      height: 100%;
      background-color: hsla(0, 0%, 0%, 0.7);

      --default-size-top: 0.5rem;
      --default-size-right: 0;
      --default-size-bottom: 0;
      --default-size-left: 0;

      .BottomsheetWindow-body {
         height: 100vh;
         width: 100vw;
         max-width: 100%;
         max-height: 100%;
         box-shadow: 1px 2px 20px 0px hsla(0, 0%, 0%, 0.7);
         overflow-x: hidden;
         overflow-y: auto;
         display: flex;
         flex-direction: column;
         justify-content: flex-start;
      }
   }
   .BottomsheetWindow-expand {
      opacity: 1;
      .BottomsheetWindow-body {
         transform: translateY(0%);
      }
   }
   .BottomsheetWindow-collapse {
      pointer-events: none;
      opacity: 0;
      .BottomsheetWindow-body {
         transform: translateY(calc(150%));
      }
   }
</style>
