<script>
   import ProductPrice from "@/items/ProductPrice.js";
   import SettingModule from "@/items/data/Setting.js";

   import LayoutProductViewerSection from "./LayoutProductViewer_Section.vue";

   export default {
      components: { LayoutProductViewerSection },
      props: {
         product: { type: Object, default: () => null },
      },
      computed: {
         settings: (context) => context.settingStore.getters.items,
         settingShowPrice: (c) => {
            let theSetting = c.settings.find((setting) => {
               return setting.key === SettingModule.Key.PublicShowPrice;
            });
            return theSetting ? theSetting.value : false;
         },

         priceNormal() {
            if (!this.product) return null;
            const normal = this.product.getPriceNormal();
            if (normal && normal.value >= 0) return normal;
            new ProductPrice();
         },
         pricePromotion() {
            if (!this.product) return null;
            const promotion = this.product.getPricePromotion();
            if (promotion && promotion.value >= 0) return promotion;
            new ProductPrice();
         },

         title() {
            if (!this.settingShowPrice) return "";

            const normal = priceNormal;
            const promotion = pricePromotion;

            if (normal.value > promotion.value) {
               return promotion.toString();
            }
            return normal.toString();
         },
         subtitle: (context) => {
            if (!context.settingShowPrice) return "";

            const normal = priceNormal;
            const promotion = pricePromotion;

            if (normal.value > 0 && normal.value > promotion.value) {
               return normal.toString();
            }

            return "";
         },

         isPromotion: (context) => context.product.isPricePromotion(),
         isAvailable: (context) => context.product.isStockAvailable(),
         isSecondHand: (context) => context.product.isStockSecondHand(),
      },
   };
</script>

<template>
   <LayoutProductViewerSection
      class="LayoutProductViewerPriceViewer"
      :title="title"
      v-if="
         product &&
         (title || subtitle || !isAvailable || isPromotion || isSecondHand)
      "
   >
      <span class="LayoutProductViewerPriceViewer-subtitle" v-if="subtitle">
         {{ subtitle }}
      </span>

      <div class="LayoutProductViewerPriceViewer-tag">
         <span
            class="LayoutProductViewerPriceViewer-tag-outOfStock"
            v-if="!isAvailable"
            >Out of Stock</span
         >
         <span
            class="LayoutProductViewerPriceViewer-tag-promotion"
            v-if="isPromotion"
            >Promotion</span
         >
         <span
            class="LayoutProductViewerPriceViewer-tag-secondHand"
            v-if="isSecondHand"
            >Second Hand</span
         >
      </div>
   </LayoutProductViewerSection>
</template>

<style lang="scss" scoped>
   .LayoutProductViewerPriceViewer {
      .LayoutProductViewerPriceViewer-subtitle {
         text-decoration: line-through;
      }

      .LayoutProductViewerPriceViewer-tag {
         flex-grow: 0;
         font-size: 1rem;
         display: flex;
         flex-direction: row;
         align-items: flex-start;
         justify-content: flex-start;
         gap: 0.2em;
         & > * {
            border-radius: 0.2em;
            padding: 0.2em 0.6em;
            color: white;
         }
         .LayoutProductViewerPriceViewer-tag-outOfStock {
            background: #ff4b33;
         }
         .LayoutProductViewerPriceViewer-tag-promotion {
            background: #ff9900;
         }
         .LayoutProductViewerPriceViewer-tag-secondHand {
            background: #249696;
         }
      }
   }
</style>
