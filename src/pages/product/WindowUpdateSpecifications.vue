<script>
import { optArray } from '@/U';
import { CustomerDeviceSpecification } from '@/items/CustomerDeviceSpecification';

import PanelAction from '@/components/panel/PanelAction.vue';
import SpecificationInputs from '@/pages/customer/SpecificationInputs.vue';

export default {
  components: { PanelAction, SpecificationInputs },
  props: {
    popupWindow: { type: Object },
  },
  data: (c) => ({ data: { specifications: [] } }),
  computed: {
    isShowing: (c) => c.popupWindow.isShowing,
    input: (c) => c.popupWindow.input,
    product: (c) => c.input?.product ?? null,
    inputSpecifications: (c) => optArray(c.input?.specifications),
    specifications: (c) => c.data?.specifications ?? [],
  },
  methods: {
    clickConfirm() {
      this.popupWindow.onConfirm({
        product: this.product,
        specifications: this.specifications,
      });
    },
  },
  mounted() {
    this.data.specifications = this.inputSpecifications
      .map((specification) => {
        specification.typeKey = specification.type
          ? specification.type.key
          : '';
        return specification;
      })
      .map((specification) => {
        return new CustomerDeviceSpecification()
          .fromData(specification)
          .toData();
      });
  },
};
</script>

<template>
  <PanelAction
    class="WindowUpdateSpecifications"
    title="Update Specifications"
    :isShowing="isShowing"
    @click-dismiss="() => popupWindow.close()"
    @click-cancel="() => popupWindow.close()"
    @click-ok="() => clickConfirm()"
  >
    <div class="WindowUpdateSpecifications-body">
      <SpecificationInputs :items="specifications" />
    </div>
  </PanelAction>
</template>

<style lang="scss" scoped>
.WindowUpdateSpecifications-body {
  width: 40rem;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}
</style>
