<script>
   import DismissableContainer from "@/components/components/DismissableContainer.vue";

   export default {
      emits: ["click-show", "click-dismiss"],
      components: { DismissableContainer },
      props: { isShowing: { type: Boolean, default: false } },
      data() {
         return { isShown: false };
      },
      watch: {
         isShowing() {
            this.onCheckShowing();
         },
      },
      methods: {
         onCheckShowing() {
            this.isShowing ? this.show() : this.dismiss();
         },
         show() {
            this.isShown = true;
            this.$emit("click-show");
         },
         dismiss() {
            this.isShown = false;
            setTimeout(() => this.$emit("click-dismiss"), 150);
         },
      },
      mounted() {
         this.onCheckShowing();
      },
   };
</script>

<template>
   <DismissableContainer
      class="PopupWindow"
      :class="[isShown ? 'PopupWindow-shown' : '']"
      @click-dismiss="dismiss()"
   >
      <div class="PopupWindow-body">
         <slot />
      </div>
   </DismissableContainer>
</template>

<style lang="scss" scoped>
   .PopupWindow {
      width: 100%;
      height: 100%;
      background-color: hsla(0, 0%, 0%, 0.7);
      transition: var(--transition-duration) cubic-bezier(1, 0, 0, 1);

      --hitbox-size: 30px;

      @media (max-width: 500px) {
         --hitbox-size: 10px;
      }

      --hitbox-column-size: var(--hitbox-size);
      --hitbox-row-size: var(--hitbox-size);

      --default-size-top: var(--hitbox-row-size);
      --default-size-right: var(--hitbox-column-size);
      --default-size-bottom: var(--hitbox-row-size);
      --default-size-left: var(--hitbox-column-size);

      .PopupWindow-body {
         height: 100%;
         width: 100%;
         max-width: max-content;
         max-height: max-content;
         display: flex;
         flex-direction: column;
         border-radius: 0.5rem;
         background-color: white;
         box-shadow: 1px 2px 20px 0px hsla(0, 0%, 0%, 0.2);
         box-shadow: 1px 2px 10px 0px hsla(0, 0%, 0%, 0.8);
         overflow: hidden;
         transition: var(--transition-duration) cubic-bezier(1, 0, 0, 1);
      }

      pointer-events: none;
      opacity: 0;
      .PopupWindow-body {
         pointer-events: none;
         transform: scale(0.95);
      }
   }

   .PopupWindow-shown {
      pointer-events: all;
      opacity: 1;
      .PopupWindow-body {
         pointer-events: all;
         transform: scale(1);
      }
   }
</style>
