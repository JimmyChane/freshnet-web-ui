<script>
import { Product } from '@/items/Product';

import ProductVue from './PageCategoryExport-Layout-Product.vue';

export default {
  components: { ProductVue },
  props: {
    width: { type: Number, default: 0 },
    height: { type: Number, default: 0 },
    products: { type: [Product] },
  },
};
</script>

<template>
  <div
    class="PCE-Layout"
    :style="{
      '--width': `${width}px`,
      '--height': `${height}px`,
    }"
  >
    <ProductVue
      v-for="product of products"
      :key="product.id"
      :product="product"
    />
  </div>
</template>

<style lang="scss" scoped>
.PCE-Layout {
  width: var(--width);
  height: var(--height);
  display: grid;
  grid-template-rows: repeat(4, minmax(1fr, 1fr));
  grid-template-columns: repeat(3, 1fr);

  & > * {
    width: calc(var(--width) / 3);
    height: calc(var(--height) / 4);
    min-width: calc(var(--width) / 3);
    min-height: calc(var(--height) / 4);
    max-width: calc(var(--width) / 3);
    max-height: calc(var(--height) / 4);
    overflow: hidden;
  }
}
</style>
