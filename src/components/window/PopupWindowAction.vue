<script>
   import PopupWindow from "./PopupWindow.vue";
   import WindowAction from "./WindowAction.vue";

   export default {
      emits: ["click-dismiss", "click-cancel", "click-ok"],
      components: { PopupWindow, WindowAction },
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
      <WindowAction
         class="PopupWindowAction-WindowAction"
         :title="title"
         :isShowing="isShowing"
         :isLoading="isLoading"
         :isClickable="isClickable"
         @click-cancel="$emit('click-cancel')"
         @click-ok="$emit('click-ok')"
         @click-dismiss="$emit('click-dismiss')"
      >
         <div class="PopupWindowAction-main">
            <slot />
         </div>
      </WindowAction>
   </PopupWindow>
</template>

<style lang="scss" scoped>
   .PopupWindowAction {
      z-index: 3;
      .PopupWindowAction-WindowAction {
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
