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
         title: (c) => c.product?.title ?? "",
      },
   };
</script>

<template>
   <WindowAction
      :title="`Delete ${title}?`"
      :isShowing="isShowing"
      @click-dismiss="$emit('click-dismiss')"
      @click-cancel="$emit('click-cancel')"
      @click-ok="$emit('click-confirm', { productId: product.id })"
   >
      <div class="WindowRemoveProduct-window">
         <div class="WindowRemoveProduct-window-main">
            <p class="WindowRemoveProduct-window-text">
               Once removed, cannot be undone
            </p>
         </div>
      </div>
   </WindowAction>
</template>
