<script>
   import PopupWindow from "@/components/window/PopupWindow.vue";
   import Actionbar from "@/components/actionbar/Actionbar.vue";
   import WindowBottom from "./WindowBottom.vue";

   export default {
      components: { PopupWindow, Actionbar, WindowBottom },
      props: {
         isShowing: { type: Boolean, default: false },
         title: { type: String, default: "" },
         message: { type: String, default: "" },
         value: { type: Object, default: null },
      },
   };
</script>

<template>
   <PopupWindow :isShowing="isShowing" @click-dismiss="() => $emit('click-dismiss')">
      <div class="WindowRemove">
         <Actionbar class="WindowRemove-header" :title="title" />

         <div class="WindowRemove-main">
            <span class="WindowRemove-body">{{ message }}</span>
         </div>

         <WindowBottom
            @click-cancel="$emit('click-cancel')"
            @click-ok="$emit('click-ok', value)"
         />
      </div>
   </PopupWindow>
</template>

<style lang="scss" scoped>
   .WindowRemove {
      position: relative;
      width: 100%;
      display: flex;
      flex-direction: column;

      .WindowRemove-header {
         display: flex;
         flex-direction: column;
         align-items: center;
         justify-content: center;
         text-align: center;
         background: none;
      }
      .WindowRemove-main {
         width: 100%;
         display: flex;
         flex-direction: column;
         padding: 1.8rem 2.5rem;
         margin-bottom: 1.2rem;
      }
   }
</style>
