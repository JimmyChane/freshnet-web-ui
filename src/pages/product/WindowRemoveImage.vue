<script>
   import WindowAction from "@/components/window/WindowAction.vue";

   export default {
      components: { WindowAction },
      props: {
         isShowing: { type: Boolean, default: false },
         input: { type: Object, default: () => null },
      },
      computed: {
         product: (c) => c.input?.product ?? null,
         image: (c) => c.input?.image ?? null,
      },
      methods: {
         clickConfirm() {
            let output = { product: this.product, image: this.image };
            this.$emit("click-confirm", output);
         },
      },
   };
</script>

<template>
   <WindowAction
      :title="`Delete image?`"
      :isShowing="isShowing"
      @click-dismiss="$emit('click-dismiss')"
      @click-cancel="$emit('click-cancel')"
      @click-ok="clickConfirm()"
   >
      <div class="WindowRemoveImage-window">
         <div class="WindowRemoveImage-window-main">
            <p class="WindowRemoveImage-window-text">
               Once removed, cannot be undone
            </p>
         </div>
      </div>
   </WindowAction>
</template>
