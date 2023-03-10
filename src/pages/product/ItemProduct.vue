<script>
   const Mode = { List: 1, Grid: 2 };

   import Setting from "@/items/data/Setting.js";
   import ProductPrice from "@/items/ProductPrice.js";
   import ProductPreset from "@/objects/ProductPreset";

   import ImageView from "@/components/ImageView.vue";
   import Label from "./ItemProduct-Label.vue";
   import chroma from "chroma-js"; // https://gka.github.io/chroma.js/
   import U from "@/U";

   export default {
      Mode,

      emits: ["click"],
      components: { ImageView, Label },
      data: (c) => ({ primaryColorHex: "", fullTitle: "" }),
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
               : chroma("cccccc");
         },
         isPrimaryColorDark: (c) => U.isColorDark(c.primaryColor),

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
         specLabels: (c) => ProductPreset.generateSpecificationLabels(c.item),
         labels: (c) => {
            return ProductPreset.generateStockLabels(c.item).map((label) => {
               return { title: label.text, primaryColor: chroma(label.color) };
            });
         },
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
         isSelected ? 'ItemProduct-isSelected' : 'ItemProduct-isDeselected',
         'transition',
      ]"
      :style="{
         '--available-opacity': isAvailable ? '1' : '0.1',
         '--primary-color': primaryColor,
         '--background-color-hover': primaryColor.mix('ffffff', 0.2),
      }"
      :ref="item.id"
      @click="$emit('click', item)"
   >
      <div class="ItemProduct-preview transition">
         <ImageView class="ItemProduct-preview-image" v-if="preview" :src="preview" />
         <span :class="['ItemProduct-preview-empty', 'transition']" v-else
            >No Preview</span
         >

         <div class="ItemProduct-preview-labels" v-if="labels.length">
            <Label
               v-for="label of labels"
               :key="label.title"
               :title="label.title"
               :primaryColor="label.primaryColor"
            />
         </div>
      </div>

      <div
         :class="[
            'ItemProduct-title',
            !isPrimaryColorDark
               ? 'ItemProduct-title-isDark'
               : 'ItemProduct-title-isWhite',
         ]"
      >
         <span class="ItemProduct-title-text">{{ fullTitle }}</span>
         <div class="ItemProduct-title-specs" v-if="specLabels.length">
            <Label v-for="label in specLabels" :key="label.text" :title="label.text" />
         </div>
         <span class="ItemProduct-title-price" v-if="price">{{ price.to }}</span>
      </div>
   </div>
</template>

<style lang="scss" scoped>
   .ItemProduct {
      --available-opacity: 1;

      width: 100%;
      text-decoration: none;
      border: none;

      display: flex;
      flex-wrap: nowrap;
      align-items: center;
      justify-content: flex-start;
      border-radius: var(--border-radius);
      --transition-timing: cubic-bezier(1, 0, 0, 1);

      .ItemProduct-preview {
         flex-grow: 0;
         object-fit: cover;
         aspect-ratio: 16/12;

         --preview-border-radius: var(--border-radius);
         --preview-border-radius-focus: var(--border-radius);
         --transition-timing: cubic-bezier(1, 0, 0, 1);

         position: relative;

         .ItemProduct-preview-image {
            object-fit: contain;
         }
         .ItemProduct-preview-empty {
            font-size: 0.8rem;
            font-weight: 600;
            color: hsla(0, 0%, 0%, 0.3);
            display: flex;
            align-items: center;
            justify-content: center;
         }

         .ItemProduct-preview-image {
            width: 100%;
            height: 100%;
            aspect-ratio: inherit;
            border-radius: var(--preview-border-radius);
            background-color: hsl(0, 0%, 94%);
         }
         .ItemProduct-preview-empty {
            width: 100%;
            height: 100%;
            aspect-ratio: inherit;
            border-radius: var(--preview-border-radius);
            background-color: hsl(0, 0%, 94%);
         }

         .ItemProduct-preview-labels {
            position: absolute;
            bottom: 0;
            right: 0;

            width: 100%;
            max-height: 2.3rem;
            gap: 1px;
            padding: 0.5rem;

            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            align-items: center;

            overflow: hidden;
         }
      }

      .ItemProduct-title {
         display: flex;
         flex-direction: column;
         justify-content: flex-start;
         text-align: start;

         gap: 0.5rem;
         color: black;

         .ItemProduct-title-text {
            min-height: 1em;
            max-height: 2em;
            line-height: 1em;

            font-size: 1rem;
            font-weight: 600;
            overflow: hidden;

            display: flex;
            flex-direction: column;
            flex-grow: 1;
            align-items: flex-start;
         }
         .ItemProduct-title-specs {
            width: 100%;
            max-height: 2.3rem;
            gap: 1px;
            margin: -0.1rem;

            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            justify-content: flex-start;
            align-items: flex-start;

            overflow: hidden;
         }
         .ItemProduct-title-price {
            font-size: 0.7rem;
         }
      }
      .ItemProduct-title-isDark {
         --color-theme: black;
      }
      .ItemProduct-title-isWhite {
         --color-theme: white;
      }
   }

   .ItemProduct-modeList {
      --border-radius: 0.8rem;
      --height: 5rem;

      min-height: var(--height);
      max-height: var(--height);

      flex-direction: row;
      align-items: center;
      justify-content: flex-start;

      .ItemProduct-preview {
         height: var(--height);
         min-height: var(--height);
         max-height: var(--height);
         transform: scale(0.92);
         --preview-border-radius-focus: var(--border-radius) 0 0 var(--border-radius);
      }
      .ItemProduct-title {
         flex-grow: 1;
         padding: 1rem;
      }
   }
   .ItemProduct-modeGrid {
      --border-radius: 0.8rem;
      flex-direction: column;
      align-items: flex-start;
      justify-content: flex-start;
      aspect-ratio: 17/18;
      gap: 0.25rem;

      .ItemProduct-preview {
         width: 100%;
         transform: scale(0.92) translateY(1rem);
         --preview-border-radius-focus: var(--border-radius) var(--border-radius) 0 0;
      }
      .ItemProduct-title {
         width: 100%;
         padding: 1rem 0.5rem;
      }
   }

   .ItemProduct-isDeselected {
      cursor: pointer;
      border: 1px solid transparent;

      &:hover,
      &:focus,
      &:focus-within {
         background-color: rgba(0, 0, 0, 0.08);
         .ItemProduct-preview {
            transform: scale(1);
            --preview-border-radius: var(--preview-border-radius-focus);
         }
      }
   }
   .ItemProduct-isSelected {
      background-color: var(--primary-color);
      border: 1px solid rgba(0, 0, 0, 0.05);
      .ItemProduct-preview {
         transform: scale(1);
         --preview-border-radius: var(--preview-border-radius-focus);
      }
      .ItemProduct-title {
         color: var(--color-theme);
      }
   }
</style>
