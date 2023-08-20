<script>
   import ViewerProduct from "@/pages/product/viewerProduct/ViewerProduct.vue";
   import LoadingDots from "@/components/LoadingDots.vue";
   import AppLayout from "@/tools/AppLayout";

   export default {
      components: { ViewerProduct, LoadingDots },
      data: (c) => ({ product: null }),
      computed: {
         isLoading: (context) => context.productStore.getters.isLoading,
         isOver1200px: (context) => context.store.getters.window.innerWidth > 1200,
         productId: (context) => context.$route.query.productId,
      },
      watch: {
         productId() {
            this.invalidate();
         },
      },
      mounted() {
         this.store.getters.appLayout.setLayout(AppLayout.Layout.FULL);
         this.store.getters.navigation.disableNavigationDrawer();

         this.invalidate();
      },
      methods: {
         async invalidate() {
            const products = await this.productStore.dispatch("getItems");
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
