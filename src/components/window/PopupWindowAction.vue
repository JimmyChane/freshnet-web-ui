<script>
   import PopupWindow from "./PopupWindow.vue";
   import Window from "./Window.vue";

   export default {
      emits: ["click-dismiss", "click-cancel", "click-ok"],
      components: { PopupWindow, Window },
      props: {
         title: { type: String, default: "" },
         isShowing: { type: Boolean, default: false },
         isLoading: { type: Boolean, default: false },
         isClickable: { type: Boolean, default: true },
      },
   };
</script>

<template>
   <PopupWindow
      class="PopupWindowAction"
      :isShowing="isShowing"
      @click-dismiss="$emit('click-dismiss')"
   >
      <Window
         class="PopupWindowAction-Window"
         :title="title"
         :isShowing="isShowing"
         :isLoading="isLoading"
         :isClickable="isClickable"
         @click-cancel="$emit('click-cancel')"
         @click-ok="$emit('click-ok')"
      >
         <div class="PopupWindowAction-main">
            <slot />
         </div>
      </Window>
   </PopupWindow>
</template>

<style lang="scss" scoped>
   .PopupWindowAction {
      z-index: 3;
      .PopupWindowAction-Window {
         width: fit-content;
         width: inherit;
         max-width: inherit;
         width: inherit;
         max-width: 100%;

         .PopupWindowAction-main {
            height: max-content;
            display: flex;
            flex-direction: column;
            gap: 40px;
         }
      }
   }
</style>
