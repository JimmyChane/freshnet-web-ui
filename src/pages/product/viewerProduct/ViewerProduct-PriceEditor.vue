<script>
import IconEdit from '@/assets/icon/edit-000000.svg';
import ProductPrice from '@/items/ProductPrice';

import Item from './ViewerProduct-PriceEditor-item.vue';
import Section from './ViewerProduct-Section.vue';

export default {
  components: { Section, Item },
  props: {
    product: { type: Object, default: () => null },
    primaryColor: { type: Object },
  },
  data() {
    return { IconEdit };
  },
  computed: {
    price: (context) => context.product?.price ?? null,
    priceNormal() {
      const normal = this.product?.getPriceNormal() ?? null;
      if (normal && normal.value >= 0) return normal;
      return new ProductPrice().fromData({});
    },
    pricePromotion() {
      const promotion = this.product?.getPricePromotion() ?? null;
      if (promotion && promotion.value >= 0) return promotion;
      return new ProductPrice().fromData({});
    },
  },
};
</script>

<template>
  <Section
    class="ProductViewerPriceEditor"
    title="Price"
    :primaryColor="primaryColor"
    :menu="{
      title: 'Edit',
      icon: IconEdit,
      click: () => {
        $emit('click-product-priceUpdate', {
          product: product,
          price: price,
        });
      },
    }"
  >
    <div class="ProductViewerPriceEditor-body">
      <Item title="Normal" :content="priceNormal.toString()" />
      <Item title="Promotion" :content="pricePromotion.toString()" />
    </div>
  </Section>
</template>

<style lang="scss" scoped>
.ProductViewerPriceEditor {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
  .ProductViewerPriceEditor-body {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: flex-start;

    gap: 3px;
    overflow: hidden;
  }
}
</style>
