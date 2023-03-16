<script>
   import SectionBrand from "./ViewerProduct-Section-Brand.vue";
   import SectionTitle from "./ViewerProduct-Section-Title.vue";
   import SectionSpecification from "./ViewerProduct-Section-Specification.vue";
   import SectionInclude from "./ViewerProduct-Section-Include.vue";
   import SectionDescription from "./ViewerProduct-Section-Description.vue";
   import SectionPrice from "./ViewerProduct-Section-Price.vue";
   import SectionStock from "./ViewerProduct-Section-Stock.vue";
   import SectionCategory from "./ViewerProduct-Section-Category.vue";
   import SectionPlaylist from "./ViewerProduct-Section-Playlist.vue";

   import Tabs from "./ViewerProduct-Tabs.vue";
   import Title from "./ViewerProduct-Title.vue";
   import ProductViewerImagePreview from "./ViewerProduct-ImagePreview.vue";
   import ProductViewerImages from "./ViewerProduct-Images.vue";
   import BottomActionbar from "./ViewerProduct-BottomActionbar.vue";

   import ProductSpecType from "@/items/ProductSpecType.js";
   import SettingModule from "@/items/data/Setting.js";
   import Actionbar from "@/components/actionbar/Actionbar.vue";
   import chroma from "chroma-js";

   export default {
      components: {
         ProductViewerImagePreview,
         ProductViewerImages,
         BottomActionbar,
         SectionBrand,
         SectionTitle,
         SectionSpecification,
         SectionInclude,
         SectionDescription,
         SectionPrice,
         SectionStock,
         SectionCategory,
         SectionPlaylist,
         Actionbar,
         Tabs,
         Title,
      },
      emits: [
         "click-product-imageRemove",
         "click-product-titleBrandUpdate",
         "click-product-priceUpdate",
         "click-product-descriptionUpdate",
         "click-product-categoryUpdate",
         "click-product-specificationsUpdate",
      ],
      props: {
         isWide: { type: Boolean, default: false },
         isEditable: { type: Boolean, default: false },
         isActionbarHidden: { type: Boolean, default: false },

         leftMenus: { default: () => [] },
         rightMenus: { default: () => [] },

         product: { type: Object, default: () => null },
         productPrevious: { type: Object, default: () => null },
         productNext: { type: Object, default: () => null },
      },
      data: (c) => ({
         colorTransitionDuration: "0",

         primaryColorHex: "inherit",

         imagePreviewIndex: 0,
         onKeyUp: null,

         category: null,
         fullTitle: "",
         brand: null,

         tabKeyNow: "",

         height: 0,
         scrollTop: 0,

         settingShowPrice: false,
      }),
      computed: {
         classWide: (c) => (c.isWide ? "ViewerProduct-isWide" : "ViewerProduct-isThin"),
         classes: (c) => ["ViewerProduct", c.classWide],

         tabs() {
            if (!this.product) return [];

            return [
               !this.isWide && this.imagePreview
                  ? { key: "image", title: "Image" }
                  : null,
               // this.isEditable ? { key: "brand", title: "Brand" } : null,
               // this.isEditable ? { key: "title", title: "Title" } : null,
               { key: "title", title: "Title" },
               // { key: "capability", title: "Capability" },
               this.isEditable || this.specifications.length
                  ? { key: "specification", title: "Specification" }
                  : null,
               this.isEditable || this.whatIncludeds.length
                  ? { key: "include", title: "What's Included" }
                  : null,
               this.isEditable || this.description
                  ? { key: "description", title: "Description" }
                  : null,
               this.isEditable || this.settingShowPrice
                  ? { key: "price", title: "Price" }
                  : null,
               this.isEditable ? { key: "stock", title: "Stock" } : null,
               this.isEditable ? { key: "category", title: "Category" } : null,
            ].filter((tab) => {
               if (tab) {
                  tab.isSelected = () => tab.key === this.tabKeyNow;
               }
               return tab;
            });
         },

         imagePreview: (c) => {
            if (c.imagePreviewIndex >= c.images.length) c.imagePreviewIndex = 0;
            return c.images.length ? c.images[c.imagePreviewIndex] : null;
         },
         images: (c) => (!c.product ? [] : c.product.images),
         hasImagePrevious: (c) => c.images.length > 0 && c.imagePreviewIndex > 0,
         hasImageNext: (c) => c.images.length - 1 > c.imagePreviewIndex,

         price: (c) => {
            if (!c.isEditable && !c.settingShowPrice) return null;
            return c.product ? c.product.price : null;
         },

         description: (c) => (c.product ? c.product.description : ""),

         specificationKeys: () => {
            return Object.keys(ProductSpecType.Key).map((key) => {
               return ProductSpecType.Key[key];
            });
         },
         specifications: (c) => {
            if (!c.product) return [];
            if (!Array.isArray(c.product.specifications)) return [];

            return c.product.specifications
               .filter((spec) => spec && spec.type && spec.content)
               .sort((spec1, spec2) => {
                  const key1 = c.obtainKeyOfSpecificationType(spec1.type);
                  const key2 = c.obtainKeyOfSpecificationType(spec2.type);

                  let index1 = c.specificationKeys.indexOf(key1);
                  let index2 = c.specificationKeys.indexOf(key2);

                  index1 = index1 >= 0 ? index1 : c.specificationKeys.length;
                  index2 = index2 >= 0 ? index2 : c.specificationKeys.length;

                  return index1 !== index2 ? index1 - index2 : key1.localeCompare(key2);
               });
         },

         gifts: (c) => (c.product ? c.product.gifts : []),
         bundles: (c) => (c.product ? c.product.bundles : []),
         whatIncludeds: (c) => {
            return [
               ...c.gifts
                  .filter((gift) => typeof gift === "string")
                  .map((gift) => gift.trim())
                  .filter((gift) => gift.length),
               ...c.bundles
                  .filter((bundle) => typeof bundle === "object" && bundle !== null)
                  .map((bundle) => bundle.title)
                  .filter((bundle) => typeof bundle === "string")
                  .map((bundle) => bundle.trim())
                  .filter((bundle) => bundle.length),
            ];
         },

         primaryColor: (c) =>
            chroma.valid(c.primaryColorHex)
               ? chroma(c.primaryColorHex)
               : chroma("cccccc"),
         actionbarColor: (c) => c.primaryColor.mix("ffffff", 0.6),
         backgroundColor: (c) => c.primaryColor.mix("ffffff", 0.3),
      },
      watch: {
         "settingStore.getters.lastModified"() {
            this.invalidateSettings();
         },
         isWide() {
            setTimeout(() => this.invalidateBound(), 500);
         },
         product(product, wasProduct) {
            this.invalidateBound();
            this.invalidateProduct();

            this.colorTransitionDuration = "3s";
            if (!wasProduct && product) {
               this.colorTransitionDuration = "0";
               setTimeout(() => (this.colorTransitionDuration = "3s"), 700);
            }
         },
         imagePreview() {
            this.invalidateImagePreview();
         },
      },
      methods: {
         async invalidateSettings() {
            this.settingShowPrice = await this.settingStore.dispatch("findValueOfKey", {
               key: SettingModule.Key.PublicShowPrice,
               default: false,
            });
         },

         invalidateBound() {
            this.scrollTop = this._self.$el.scrollTop;
            this.height = this._self.$el.offsetHeight;
         },
         async invalidateProduct() {
            if (this.product) this.scrollToTop(0);
            this.tabKeyNow = this.tabs.length ? this.tabs[0].key : "";

            if (this.product) this.addArrowListener();
            else this.removeArrowListener();

            this.category = null;
            this.fullTitle = "";
            this.brand = null;
            if (!this.product) return;
            this.category = await this.product.fetchCategory();
            this.fullTitle = await this.product.fetchFullTitle();
            this.brand = await this.product.fetchBrand();
         },
         async invalidateImagePreview() {
            const color = this.imagePreview
               ? await this.imagePreview.fetchColor().catch(() => null)
               : null;

            this.primaryColorHex = color ? color.toString() : "inherit";
         },

         clickPreviousImage() {
            if (this.hasImagePrevious) {
               this.imagePreviewIndex--;
               return;
            }

            if (this.hasImagePrevious || !this.productPrevious) return;
            const ref = this.$refs.keyplaylist;
            if (!ref) return;

            this.imagePreviewIndex = this.productPrevious.images.length - 1;
            ref.clickPreviousProduct();
         },
         clickNextImage() {
            if (this.hasImageNext) {
               this.imagePreviewIndex++;
               return;
            }

            if (this.hasImageNext || !this.productNext) return;
            const ref = this.$refs.keyplaylist;
            if (!ref) return;

            this.imagePreviewIndex = 0;
            ref.clickNextProduct();
         },

         obtainKeyOfSpecificationType(type) {
            if (typeof type === "object") return type.key;
            if (typeof type === "string") return type;
            return "";
         },

         addArrowListener() {
            if (this.onKeyUp === null) {
               this.onKeyUp = (event) => {
                  if (event.shiftKey || event.altKey || event.ctrlKey || event.metaKey)
                     return;
                  if (event.key === "ArrowLeft") this.clickPreviousImage();
                  if (event.key === "ArrowRight") this.clickNextImage();
               };
               window.addEventListener("keyup", this.onKeyUp);
            }
         },
         removeArrowListener() {
            if (this.onKeyUp !== null) {
               window.removeEventListener("keyup", this.onKeyUp);
               this.onKeyUp = null;
            }
         },

         scrollToTop(timeout = 300) {
            if (timeout > 0) {
               setTimeout(() => this.scrollToTop(0), timeout);
               return;
            }
            this._self.$el.scrollTo({ top: 0, behavior: "smooth" });
         },
         scrollTo(key = "") {
            const ref = this.$refs[`key${key}`];
            if (!ref) return;
            ref.$el.scrollIntoView({ behavior: "smooth", block: "start" });
         },
         scrolling(event) {
            this.invalidateBound();

            const pointHeight = 156; // 156px

            this.tabKeyNow = this.tabs.reduce((tabKeyNow, tab) => {
               const ref = this.$refs[`key${tab.key}`];
               if (!ref) return tabKeyNow;
               const target = ref.$el;
               if (!target) return tabKeyNow;

               const bound = target.getBoundingClientRect();

               const start = bound.y;
               if (0 < start && start < pointHeight) return tab.key;

               const end = bound.y + bound.height;
               if (0 < end && end < pointHeight) return tab.key;

               return tabKeyNow;
            }, this.tabKeyNow);
         },
      },
      mounted() {
         this.invalidateBound();
         this.invalidateProduct();
         this.invalidateImagePreview();
         this.invalidateSettings();
      },
      destroy() {
         this.removeArrowListener();
      },
   };
</script>

<template>
   <div
      :class="classes"
      :style="{
         '--primary-color': primaryColor,
         'background-color': backgroundColor,
         '--color-transition-duration': colorTransitionDuration,
         '--actionbar-toolbar': isActionbarHidden ? '1.5rem' : '5.5rem',
      }"
      @scroll="(event) => scrolling(event)"
   >
      <div class="ViewerProduct-toolbar" :style="{ 'background-color': actionbarColor }">
         <Actionbar
            class="ViewerProduct-actionbar"
            v-if="!isActionbarHidden"
            :leftMenus="leftMenus"
            :rightMenus="rightMenus"
            :style="{ 'background-color': actionbarColor }"
         >
            <span
               class="ViewerProduct-actionbar-title"
               v-if="fullTitle"
               :style="{
                  padding: !leftMenus.length && !rightMenus.length ? '1.8rem' : '0',
               }"
               >{{ fullTitle }}</span
            >
         </Actionbar>

         <Tabs
            v-if="tabs.length"
            @click-item="(tab) => scrollTo(tab.key)"
            :items="tabs"
         />
      </div>

      <div class="ViewerProduct-header">
         <div class="ViewerProduct-preview" v-if="product">
            <ProductViewerImagePreview
               class="ViewerProduct-image"
               ref="keyimage"
               :primaryColor="backgroundColor"
               :allowEdit="isEditable"
               :product="product"
               :image="imagePreview"
               :hasImagePrevious="hasImagePrevious"
               :hasImageNext="hasImageNext"
               :hasProductPrevious="!!productPrevious"
               :hasProductNext="!!productNext"
               @click-image="
                  (image) =>
                     store.dispatch('imageViewerShow', { image, thumbnails: images })
               "
               @click-previous="() => clickPreviousImage()"
               @click-next="() => clickNextImage()"
               @click-remove="
                  (image) => $emit('click-product-imageRemove', { product, image })
               "
            />
            <ProductViewerImages
               class="ViewerProduct-thumbnails"
               v-if="isEditable || images.length > 1"
               :images="images"
               :indexAt="imagePreviewIndex"
               :isEditable="isEditable"
               :primaryColor="primaryColor"
               @click-image="(image) => (imagePreviewIndex = images.indexOf(image))"
               @click-add-image-file="
                  (file) => {
                     productStore.dispatch('addImageOfId', {
                        id: product.id,
                        imageFile: file,
                     });
                  }
               "
            />
            <Title
               ref="keytitle"
               :primaryColor="primaryColor"
               :allowEdit="isEditable"
               :product="product"
               @click-edit="(x) => $emit('click-product-titleBrandUpdate', x)"
            />
         </div>
      </div>

      <div class="ViewerProduct-info">
         <SectionSpecification
            ref="keyspecification"
            :primaryColor="primaryColor"
            :allowEdit="isEditable"
            :product="product"
            @click-edit="(x) => $emit('click-product-specificationsUpdate', x)"
         />
         <SectionInclude
            ref="keyinclude"
            :primaryColor="primaryColor"
            :allowEdit="isEditable"
            :product="product"
         />
         <SectionDescription
            ref="keydescription"
            :primaryColor="primaryColor"
            :allowEdit="isEditable"
            :product="product"
            @click-edit="(x) => $emit('click-product-descriptionUpdate', x)"
         />
         <SectionPrice
            ref="keyprice"
            :primaryColor="primaryColor"
            :allowEdit="isEditable"
            :product="product"
            @click-edit="(x) => $emit('click-product-priceUpdate', x)"
         />
         <SectionStock
            ref="keystock"
            :primaryColor="primaryColor"
            :allowEdit="isEditable"
            :product="product"
         />
         <SectionCategory
            ref="keycategory"
            :primaryColor="primaryColor"
            :allowEdit="isEditable"
            :product="product"
            @click-edit="(x) => $emit('click-product-categoryUpdate', x)"
         />
         <SectionPlaylist
            ref="keyplaylist"
            :primaryColor="primaryColor"
            :allowEdit="isEditable"
            :product="product"
            :nextProduct="productNext"
            :previousProduct="productPrevious"
         />
      </div>

      <div class="ViewerProduct-emtpy" v-if="!product">
         <div class="ViewerProduct-emtpy-cardBackground"></div>
         <span class="ViewerProduct-emtpy-title">Viewer</span>
      </div>

      <BottomActionbar
         class="ViewerProduct-bottomActionbar"
         v-if="product"
         :product="product"
         :isWide="isWide"
         :parentScrollTop="scrollTop"
         @click-scrollToTop="() => scrollToTop(0)"
      />
   </div>
</template>

<style lang="scss" scoped>
   .ViewerProduct {
      position: relative;

      width: 100%;
      height: 100%;

      display: grid;
      justify-items: center;
      align-items: start;

      background: hsl(0, 0%, 90%);
      font-size: 1.2rem;
      overflow-y: auto;
      scroll-padding-top: 8rem;
      transition: background-color var(--color-transition-duration);

      .ViewerProduct-toolbar {
         grid-area: toolbar;
         z-index: 4;
         width: 100%;
         position: sticky;
         border-bottom: 1px solid hsla(0, 0%, 0%, 0.1);
         top: 0;
         transition: background-color var(--color-transition-duration);
         .ViewerProduct-actionbar {
            border-bottom: 1px solid hsla(0, 0%, 0%, 0.1);
            transition: background-color var(--color-transition-duration);
            .ViewerProduct-actionbar-title {
               display: flex;
               flex-direction: column;
               align-items: flex-start;
               justify-content: center;
               gap: 0.1rem;
               line-height: 1.1rem;

               font-weight: 600;
               font-size: 1rem;

               overflow: hidden;
               color: black;
               text-align: start;
               text-overflow: clip;

               white-space: nowrap;

               width: 100%;
            }
         }
      }
      .ViewerProduct-header {
         --padding: 1.2rem;
         --padding: 0;

         width: 100%;
         z-index: 1;
         grid-area: header;
         display: flex;
         flex-direction: column;
         align-items: center;
         padding: var(--padding);
         gap: 1rem;

         .ViewerProduct-preview {
            width: 100%;
            height: 100%;

            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            transition: background-color var(--color-transition-duration);
            border-radius: 1.5rem;
         }
      }

      .ViewerProduct-info {
         --padding: 1.2rem;

         grid-area: info;

         width: 100%;
         z-index: 2;
         gap: 1.5rem;
         gap: 1rem;
         color: black;

         display: flex;
         flex-direction: column;
         align-items: center;
         justify-content: flex-start;
         padding: var(--padding);
         padding-bottom: 10rem;
      }
      .ViewerProduct-emtpy {
         z-index: 2;
         width: 100%;
         height: 100%;
         position: relative;

         background-color: hsl(0, 0%, 90%);

         display: flex;
         flex-direction: column;
         align-items: center;
         justify-content: center;
         .ViewerProduct-emtpy-cardBackground {
            z-index: 1;
            position: absolute;
            width: 100%;
            height: 100%;

            opacity: 0.15;
            background: var(--primary-color);

            pointer-events: none;
            display: flex;
         }
         .ViewerProduct-emtpy-title {
            color: black;
            opacity: 0.4;
         }
      }

      .ViewerProduct-bottomActionbar {
         z-index: 3;
         grid-area: bottomactionbar;
      }
   }

   .ViewerProduct-isThin {
      grid-template-rows: 8rem max-content minmax(1fr, max-content);
      grid-template-columns: 100%;
      grid-template-areas:
         "toolbar"
         "header"
         "info"
         "bottomactionbar";

      .ViewerProduct-header {
         max-width: 50rem;
         margin-bottom: -0.6rem;
      }
      .ViewerProduct-info {
         max-width: 50rem;
         margin-top: -0.6rem;
      }
   }
   .ViewerProduct-isWide {
      grid-template-rows: var(--actionbar-toolbar) 1fr;
      grid-template-columns: 45% 55%;
      grid-template-areas:
         "toolbar toolbar"
         "header info"
         "bottomactionbar bottomactionbar";
      .ViewerProduct-header {
         height: calc(100dvh - var(--actionbar-toolbar) - 3.5rem);
         position: sticky;
         left: 0;
         top: var(--actionbar-toolbar);
      }
      .ViewerProduct-header {
         --padding: 2rem;
         padding-right: calc(var(--padding) / 2);
      }
      .ViewerProduct-info {
         --padding: 2rem;
         padding-left: calc(var(--padding) / 2);
      }
   }
</style>
