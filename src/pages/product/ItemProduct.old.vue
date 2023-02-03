<script>
   const Mode = { List: 1, Grid: 2 };

   import User from "@/items/User.js";
   import Setting from "@/items/data/Setting.js";
   import ProductPrice from "@/items/ProductPrice.js";
   import ProductPreset from "@/items/tools/ProductPreset";

   import ImageView from "@/components/ImageView.vue";
   import chroma from "chroma-js"; // https://gka.github.io/chroma.js/

   export default {
      Mode,

      emits: ["click"],
      components: { ImageView },
      data() {
         return { primaryColorHex: "", fullTitle: "" };
      },
      props: {
         mode: { type: Number, default: Mode.Grid },
         item: { type: Object, default: () => null },
         isSelected: { type: Boolean, default: false },
      },
      computed: {
         isList: (c) => c.mode === Mode.List,
         isGrid: (c) => c.mode === Mode.Grid,

         primaryColor() {
            return chroma.valid(this.primaryColorHex)
               ? chroma(this.primaryColorHex)
               : chroma("294656");
         },

         user: (c) => c.loginStore.getters.user,
         allowEdit: (c) => c.user.isTypeAdmin() || c.user.isTypeStaff(),

         shouldShowPrice: (c) => {
            let setting = c.settingStore.getters.items.find((setting) => {
               return setting.key === Setting.Key.PublicShowPrice;
            });
            return setting ? setting.value : false;
         },

         preview: (c) => (c.item ? c.item.toImageThumbnail() : null),
         productBrandId: (c) => (c.item ? c.item.brandId : ""),
         isAvailable: (c) => (c.item ? c.item.isStockAvailable() : false),

         productPrice: (c) => {
            if (!c.allowEdit && !c.shouldShowPrice) return null;
            return c.item.price;
         },
         productPriceNormal: (c) => {
            return c.productPrice && c.productPrice.normal
               ? c.productPrice.normal
               : new ProductPrice();
         },
         productPricePromotion: (c) => {
            return c.productPrice && c.productPrice.promotion
               ? c.productPrice.promotion
               : new ProductPrice();
         },
         price: (c) => {
            if (!c.allowEdit && !c.shouldShowPrice) return null;

            let normal = c.productPriceNormal;
            let promotion = c.productPricePromotion;

            if (normal.value > 0 && promotion.value <= 0) return { to: normal };
            if (normal.value > 0 && promotion.value > 0)
               return { from: normal, to: promotion };
            if (normal.value <= 0 && promotion.value > 0)
               return { from: normal, to: promotion };
            return null;
         },
         priceLabels: (c) => ProductPreset.generateStockLabels(c.item),
         specLabels: (c) => ProductPreset.generateSpecificationLabels(c.item),
      },
      watch: {
         preview() {
            this.invalidatePreview();
         },
         item() {
            this.invalidateFullTitle();
         },
         productBrandId() {
            this.invalidateFullTitle();
         },
      },
      mounted() {
         this.settingStore.dispatch("getItems");
         this.invalidateFullTitle();
         this.invalidatePreview();
      },
      methods: {
         async invalidateFullTitle() {
            this.fullTitle = "";
            if (!this.item) return;
            this.fullTitle = await this.item.fetchFullTitle();
         },
         async invalidatePreview() {
            const color = this.preview
               ? await this.preview.fetchColor().catch(() => null)
               : null;

            this.primaryColorHex = color ? color.toString() : "inherit";
         },
      },
   };
</script>

<template>
   <div
      :class="[
         'ItemProduct',
         isList ? 'ItemProduct-modeList' : '',
         isGrid ? 'ItemProduct-modeGrid' : '',
         `ItemProduct-${isSelected ? 'isSelected' : 'isNotSelected'}`,
         'transition',
      ]"
      :style="{
         '--available-opacity': isAvailable ? '1' : '0.1',
         '--primary-color': primaryColor,
         '--background-color': primaryColor.mix('ffffff', 0.94),
         '--background-color-hover': primaryColor.mix('ffffff', 0.2),
         '--background-color-card': primaryColor.mix('ffffff', 0.8),
         '--background-color-card-hover': primaryColor.mix('ffffff', 0.8),
      }"
      :ref="item.id"
      @click="$emit('click', item)"
   >
      <ImageView class="ItemProduct-preview" v-if="preview" :src="preview" />
      <div :class="['ItemProduct-preview', 'ItemProduct-previewEmpty']" v-else>
         <span>No Preview</span>
      </div>

      <div class="ItemProduct-card transition">
         <div class="ItemProduct-title">
            <span class="ItemProduct-title-text">{{ fullTitle }}</span>
            <span class="ItemProduct-title-price" v-if="price">{{
               price.to
            }}</span>
         </div>
         <div class="ItemProduct-specs" v-if="specLabels.length">
            <span v-for="label in specLabels" :key="label.text">{{
               label.text
            }}</span>
         </div>
      </div>
   </div>
</template>

<style lang="scss" scoped>
   .ItemProduct {
      --available-opacity: 1;

      width: 100%;
      text-decoration: none;
      border: none;
      border-radius: var(--border-radius);
      overflow: hidden;

      display: flex;
      flex-wrap: nowrap;
      align-items: center;
      justify-content: flex-start;

      background-color: var(--background-color);
      background-color: hsla(0, 0%, 100%, 0.15);

      .ItemProduct-preview {
         opacity: var(--available-opacity);
         flex-grow: 0;
         overflow: hidden;
         object-fit: cover;
      }
      .ItemProduct-previewEmpty {
         color: rgba(0, 0, 0, 0.3);
         font-size: 0.8rem;
         font-weight: 600;
         display: flex;
         align-items: center;
         justify-content: center;
      }

      .ItemProduct-card {
         height: 100%;
         color: black;
         background: var(--background-color-card);
         opacity: var(--available-opacity);
         gap: 0.5rem;
         padding: 1rem;

         display: flex;
         flex-direction: column;

         & > * {
            width: max-content;
            max-width: 100%;
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
         }

         .ItemProduct-title {
            width: 100%;
            text-align: start;

            display: flex;
            flex-direction: row;
            flex-grow: 1;
            align-items: flex-start;
            justify-content: center;
            gap: 0.5rem;

            .ItemProduct-title-text {
               font-size: 1rem;
               font-weight: 600;
               flex-grow: 1;
            }
            .ItemProduct-title-price {
               font-size: 0.8rem;
            }
         }
         .ItemProduct-specs {
            flex-grow: 0;
            gap: 0.1rem;
            & > * {
               min-width: max-content;
               width: max-content;
               padding: 0.2rem 0.4rem;
               padding: 0.1rem 0.2rem;
               color: black;
               background-color: hsl(0, 0%, 95%);
               background-color: hsla(0, 0%, 100%, 0.4);
               border-radius: 0.2rem;
               font-size: 0.7rem;
               font-weight: 400;
            }
         }
      }
   }

   .ItemProduct-modeList {
      --border-radius: 0.2rem;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;

      .ItemProduct-preview {
         width: 26%;
         aspect-ratio: 16/12;
         border-radius: var(--border-radius) 0 0 var(--border-radius);
      }
      .ItemProduct-card {
         width: 74%;
         border-radius: 0 var(--border-radius) var(--border-radius) 0;
         padding: 0.8rem;
      }
   }
   .ItemProduct-modeGrid {
      --border-radius: 0.8rem;
      min-height: 6rem;
      flex-direction: column;
      align-items: flex-start;
      justify-content: center;

      .ItemProduct-preview {
         width: 100%;
         aspect-ratio: 4/3;
         border-radius: var(--border-radius) var(--border-radius) 0 0;
      }
      .ItemProduct-card {
         width: 100%;
         flex-grow: 1;
         height: max-content;
         border-radius: 0 0 var(--border-radius) var(--border-radius);
      }
   }

   .ItemProduct-isNotSelected {
      cursor: pointer;
      &:hover,
      &:focus,
      &:focus-within {
         background-color: var(--background-color-hover);
         .ItemProduct-card {
            background-color: var(--background-color-card-hover);
            border-top-left-radius: 0;
            border-top-right-radius: 0;
         }
      }
   }
   .ItemProduct-isSelected {
      background-color: var(--primary-color);

      .ItemProduct-card {
         border-top-left-radius: 0;
         border-top-right-radius: 0;
      }
   }
</style>
