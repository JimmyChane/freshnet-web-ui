<script>
import PanelAction from '@/components/panel/PanelAction.vue';

export default {
  components: { PanelAction },
  props: {
    popupWindow: { type: Object },
  },
  computed: {
    isShowing: (c) => c.popupWindow.isShowing,
    input: (c) => c.popupWindow.input,
    product: (c) => c.input?.product ?? null,
    title: (c) => c.product?.title ?? '',
  },
};
</script>

<template>
  <PanelAction
    :title="`Delete ${title}?`"
    :isShowing="isShowing"
    @click-dismiss="() => popupWindow.close()"
    @click-cancel="() => popupWindow.close()"
    @click-ok="() => popupWindow.onConfirm({ productId: product.id })"
  >
    <div>
      <div>
        <p>Once removed, cannot be undone</p>
      </div>
    </div>
  </PanelAction>
</template>
