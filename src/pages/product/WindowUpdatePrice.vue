<script>
import Input from '@/components/Input.vue';
import PanelAction from '@/components/panel/PanelAction.vue';

export default {
  components: { PanelAction, Input },
  props: {
    popupWindow: { type: Object },
  },
  computed: {
    isShowing: (c) => c.popupWindow.isShowing,
    input: (c) => c.popupWindow.input,
    product: (c) => c.input?.product ?? null,
  },
  data: (c) => ({ normal: '', promotion: '' }),
  methods: {
    clickConfirm() {
      let output = {
        product: this.product,
        price: { normal: this.normal, promotion: this.promotion },
      };

      this.popupWindow.onConfirm(output);
    },
  },
  mounted() {
    const { normal, promotion } = this.input.price;
    const { value: normalValue } = normal;
    const { value: promotionValue } = promotion;

    this.normal = normalValue === 0 ? '' : normalValue.toString();
    this.promotion = promotionValue === 0 ? '' : promotionValue.toString();
  },
};
</script>

<template>
  <PanelAction
    title="Add Price"
    :isShowing="isShowing"
    @click-dismiss="() => popupWindow.close()"
    @click-cancel="() => popupWindow.close()"
    @click-ok="() => clickConfirm()"
  >
    <div class="WindowUpdatePrice-body">
      <Input
        label="Normal (RM)"
        :isRequired="true"
        :bindValue="normal"
        type="number"
        @input="(comp) => (normal = comp.value)"
      />
      <Input
        label="Promotion (RM)"
        :isRequired="true"
        :bindValue="promotion"
        type="number"
        @input="(comp) => (promotion = comp.value)"
      />
    </div>
  </PanelAction>
</template>

<style lang="scss" scoped>
.WindowUpdatePrice-body {
  width: 26rem;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;

  & > * {
    padding-left: 0;
    padding-right: 0;
    background: hsla(0, 0%, 0%, 0.03);
  }
}
</style>
