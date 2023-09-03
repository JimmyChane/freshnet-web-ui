<script lang="ts">
  import Product from "@/items/Product";
  import Vue from "vue";
  import ProductViewerPriceEditor from "./ViewerProduct-PriceEditor.vue";
  import ProductViewerPriceViewer from "./ViewerProduct-PriceViewer.vue";

  export default Vue.extend({
    components: { ProductViewerPriceEditor, ProductViewerPriceViewer },
    props: {
      primaryColor: { type: Object },
      allowEdit: { type: Boolean, default: false },
      product: { type: Product, default: () => null },
    },
  });
</script>

<template>
  <ProductViewerPriceEditor
    v-if="allowEdit"
    :product="product"
    :primaryColor="primaryColor"
    @click-product-priceUpdate="(x) => $emit('click-edit', x)"
  />
  <ProductViewerPriceViewer
    v-else
    :product="product"
    :primaryColor="primaryColor"
  />
</template>
