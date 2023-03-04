<script>
   import Loading from "@/components/Loading";
   import Actionbar from "@/components/actionbar/Actionbar.vue";
   import WindowBottom from "./WindowBottom.vue";

   export default {
      components: { Loading, Actionbar, WindowBottom },
      emits: ["click-cancel", "click-ok"],
      props: {
         title: { type: String, default: "" },
         isShowing: { type: Boolean, default: false },
         isLoading: { type: Boolean, default: false },
         isClickable: { type: Boolean, default: true },
      },
      data: (c) => ({ scrollTop: 0 }),
      watch: {
         isShowing() {
            const { WindowAction } = this.$refs;
            if (WindowAction && this.isShowing) WindowAction.scrollTop = 0;
         },
      },
   };
</script>

<template>
   <div
      :class="['WindowAction', isClickable ? '' : 'WindowAction-notClickable']"
      ref="WindowAction"
      @scroll="(event) => (scrollTop = event.target.scrollTop)"
   >
      <Actionbar
         :class="[
            'transition',
            'WindowAction-header',
            scrollTop > 0 ? 'WindowAction-header-isScrolledUp' : '',
         ]"
         :title="title"
         :leftMenus="{
            icon: host.icon('close-000000'),
            click: () => $emit('click-dismiss'),
         }"
      />

      <div class="WindowAction-main"><slot /></div>

      <WindowBottom
         class="WindowAction-bottom"
         @click-cancel="$emit('click-cancel')"
         @click-ok="$emit('click-ok')"
      />

      <div :class="['transition', 'WindowAction-foreground']"></div>

      <Loading class="WindowAction-loading" :isShowing="isLoading" />
   </div>
</template>

<style lang="scss" scoped>
   .WindowAction {
      width: 100%;
      height: 100%;

      font-size: 1rem;
      font-weight: 400;
      color: black;
      position: relative;

      display: flex;
      flex-direction: column;
      overflow-y: auto;

      scroll-padding-bottom: 4rem;

      .WindowAction-header {
         z-index: 3;

         // display: flex;
         // flex-direction: column;
         // align-items: center;
         // justify-content: center;
         text-align: center;
         border-bottom: 1px solid transparent;
         background-color: hsl(0, 0%, 96%);
      }
      .WindowAction-header-isScrolledUp {
         border-bottom: 1px solid hsl(0, 0%, 90%);
      }

      .WindowAction-main {
         z-index: 1;
         width: 100%;
         height: fit-content;
         padding: 1.8rem;
         padding-top: 1rem;
         display: flex;
         flex-direction: column;
      }

      .WindowAction-bottom {
         z-index: 2;
      }

      .WindowAction-foreground {
         z-index: 4;
         width: 100%;
         height: 100%;
         position: absolute;
         background: white;
         opacity: 0;
         pointer-events: none;
      }

      .WindowAction-loading {
         z-index: 5;
         position: absolute;
         width: 100%;
         pointer-events: none;
      }
   }

   .WindowAction-notClickable {
      pointer-events: none;
      .WindowAction-foreground {
         opacity: 0.5;
      }
   }
</style>
