<script>
   import DismissableContainer from "@/components/components/DismissableContainer.vue";

   export default {
      emits: ["callback-onCollapse", "callback-onExpanded"],
      components: { DismissableContainer },
      props: { isExpanded: { type: Boolean, default: false } },
      watch: {
         isExpanded() {
            this.$emit(this.isExpanded ? "callback-onExpanded" : "callback-onCollapse");
         },
      },
   };
</script>

<template>
   <DismissableContainer
      class="BottomsheetWindow"
      :class="[isExpanded ? 'BottomsheetWindow-expand' : 'BottomsheetWindow-collapse']"
      @click-dismiss="$emit('callback-onCollapse')"
   >
      <div class="BottomsheetWindow-body">
         <slot />
      </div>
   </DismissableContainer>
</template>

<style lang="scss" scoped>
   .BottomsheetWindow {
      width: 100%;
      height: 100%;
      background-color: hsla(0, 0%, 0%, 0.7);
      transition: var(--animation-duration);

      --default-size-top: 3rem;
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
         border-radius: 0.5rem 0.5rem 0 0;
         background-color: white;
         overflow-x: hidden;
         overflow-y: auto;
         display: flex;
         flex-direction: column;
         justify-content: flex-start;
         transition: var(--animation-duration);
      }
   }
   .BottomsheetWindow-expand {
      pointer-events: all;
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
