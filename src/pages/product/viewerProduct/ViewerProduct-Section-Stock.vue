<script>
import { mapStores } from 'pinia';

import { useProductStore } from '@/pinia-stores/product.store';

import Section from './ViewerProduct-Section.vue';
import Checkbox from './ViewerProduct-StockCheckbox.vue';

export default {
  components: { Section, Checkbox },
  props: {
    primaryColor: { type: Object },
    allowEdit: { type: Boolean, default: false },
    product: { type: Object, default: () => null },
  },
  computed: {
    ...mapStores(useProductStore),

    productIsAvailable: (c) => c.product?.isStockAvailable() ?? true,
    productIsSecondHand: (c) => c.product?.isStockSecondHand() ?? false,
  },
};
</script>

<template>
  <Section :primaryColor="primaryColor" title="Stock" v-if="allowEdit">
    <div class="SectionStock">
      <Checkbox
        class="SectionStock-outOfStock"
        title="Out of Stock"
        :checked="!productIsAvailable"
        @click="
          () => {
            productStore.updateAvailabilityOfId({
              id: product.id,
              isAvailable: !productIsAvailable,
            });
          }
        "
      />
      <Checkbox
        class="SectionStock-secondHand"
        title="Second Hand"
        :checked="productIsSecondHand"
        @click="
          () => {
            productStore.updateSecondHandOfId({
              id: product.id,
              isSecondHand: !productIsSecondHand,
            });
          }
        "
      />
    </div>
  </Section>
</template>

<style lang="scss" scoped>
.SectionStock {
  grid-area: stock;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 0.5rem;
  background: hsla(0, 0%, 100%, 0.6);
  padding: 1.2rem;
  .SectionStock-outOfStock {
    --primary-color: #ff4b33;
  }
  .SectionStock-secondHand {
    --primary-color: #249696;
  }
}
</style>
