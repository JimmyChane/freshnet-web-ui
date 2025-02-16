<script>
import TextArea from '@/components/InputTextArea.vue';
import PanelAction from '@/components/panel/PanelAction.vue';

export default {
  components: { PanelAction, TextArea },
  props: { popupWindow: { type: Object } },
  data: (c) => ({ data: { description: '' } }),
  computed: {
    isShowing: (c) => c.popupWindow.isShowing,
    input: (c) => c.popupWindow.input,
    product: (c) => c.input?.product ?? '',
    description: (c) => c.data?.description ?? '',
  },
  methods: {
    clickConfirm() {
      this.popupWindow.onConfirm({
        product: this.product,
        description: this.description,
      });
    },
  },
  mounted() {
    this.data = { description: this.product.description };
  },
};
</script>

<template>
  <PanelAction
    class="WindowUpdateDescription"
    title="Update Description"
    :isShowing="isShowing"
    @click-dismiss="() => popupWindow.close()"
    @click-cancel="() => popupWindow.close()"
    @click-ok="() => clickConfirm()"
  >
    <div class="WindowUpdateDescription-body">
      <TextArea
        type="text"
        label="Description"
        :bindValue="data.description"
        :isRequired="true"
        @input="(comp) => (data.description = comp.value)"
      />
    </div>
  </PanelAction>
</template>

<style lang="scss" scoped>
.WindowUpdateDescription-body {
  width: 26rem;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  & > * {
    background: hsla(0, 0%, 0%, 0.03);
    height: 18rem;
  }
}
</style>
