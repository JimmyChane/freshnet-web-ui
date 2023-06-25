<script>
   import PanelAction from "@/components/panel/PanelAction.vue";
   export default {
      components: { PanelAction },
      props: {
         popupWindow: { type: Object },
      },
      computed: {
         isShowing: (c) => c.popupWindow.isShowing,
         input: (c) => c.popupWindow.input,
         product: (c) => c.input?.product ?? null,
         image: (c) => c.input?.image ?? null,
      },
   };
</script>

<template>
   <PanelAction
      :title="`Delete image?`"
      :isShowing="isShowing"
      @click-dismiss="() => popupWindow.close()"
      @click-cancel="() => popupWindow.close()"
      @click-ok="() => popupWindow.onConfirm({ product, image })"
   >
      <div>
         <div>
            <p>Once removed, cannot be undone</p>
         </div>
      </div>
   </PanelAction>
</template>
