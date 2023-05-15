<script>
   import Section from "./ViewerProduct-Section.vue";
   import Item from "./ViewerProduct-PriceEditor-item.vue";
   import ProductPrice from "@/items/ProductPrice.js";

   export default {
      components: { Section, Item },
      props: {
         product: { type: Object, default: () => null },
         primaryColor: { type: Object },
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
         icon: host.icon('edit-000000'),
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
