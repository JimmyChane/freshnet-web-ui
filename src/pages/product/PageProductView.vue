<script>
import { useAppStore } from '@/stores/app.store';
import { useProductStore } from '@/stores/product.store';
import { AppLayoutId } from '@/tools/AppLayout';

import LoadingDots from '@/components/LoadingDots.vue';
import ViewerProduct from '@/pages/product/viewerProduct/ViewerProduct.vue';

export default {
  components: { ViewerProduct, LoadingDots },
  data: (c) => ({ product: null }),
  computed: {
    isLoading: (context) => useProductStore().isLoading,
    isOver1200px: (context) => useAppStore().window.innerWidth > 1200,
    productId: (context) => context.$route.query.productId,
  },
  watch: {
    productId() {
      this.invalidate();
    },
  },
  mounted() {
    useAppStore().appLayout.setLayout(AppLayoutId.FULL);
    useAppStore().navigation.disableNavigationDrawer();

    this.invalidate();
  },
  methods: {
    async invalidate() {
      const products = await useProductStore().getItems();
      this.product = products.find((product) => {
        return product.id === this.productId;
      });

      if (!this.product) return;

      document.title = await this.product.fetchFullTitle();
    },
  },
};
</script>

<template>
  <div class="PageProductView">
    <ViewerProduct
      :product="product"
      :isWide="isOver1200px"
      :isEditable="false"
      :isActionbarHidden="true"
    />

    <LoadingDots style="z-index: 2" :isShowing="isLoading" />
  </div>
</template>

<style lang="scss" scoped>
.PageProductView {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
}
</style>
