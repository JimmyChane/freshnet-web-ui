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
   import Contacts from "./ViewerProduct-Contacts.vue";
   import ProductViewerImagePreview from "./ViewerProduct-ImagePreview.vue";
   import ProductViewerImages from "./ViewerProduct-Images.vue";

   import ProductSpecType from "@/items/ProductSpecType.js";
   import SettingModule from "@/items/data/Setting.js";
   import Actionbar from "@/components/actionbar/Actionbar.vue";
   import chroma from "chroma-js"; // https://gka.github.io/chroma.js/

   export default {
      components: {
         ProductViewerImagePreview,
         ProductViewerImages,
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
         Contacts,
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

         leftMenus: { default: () => [] },
         rightMenus: { default: () => [] },

         product: { type: Object, default: () => null },
         productPrevious: { type: Object, default: () => null },
         productNext: { type: Object, default: () => null },
      },
      data() {
         return {
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
         };
      },
      computed: {
         classWide() {
            return this.isWide ? "ViewerProduct-isWide" : "ViewerProduct-isThin";
         },
         classes() {
            return ["ViewerProduct", this.classWide];
         },

         tabs() {
            if (!this.product) return [];

            const tabs = [
               !this.isWide && this.imagePreview
                  ? { key: "image", title: "Image" }
                  : null,
               this.isEditable ? { key: "brand", title: "Brand" } : null,
               this.isEditable ? { key: "title", title: "Title" } : null,
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
            ];

            return tabs.filter((tab) => {
               if (tab) {
                  tab.isSelected = () => tab.key === this.tabKeyNow;
               }
               return tab;
            });
         },

         imagePreview: (context) => {
            if (context.imagePreviewIndex >= context.images.length)
               context.imagePreviewIndex = 0;
            return context.images.length
               ? context.images[context.imagePreviewIndex]
               : null;
         },
         images: (context) => (!context.product ? [] : context.product.images),
         hasImagePrevious: (context) =>
            context.images.length > 0 && context.imagePreviewIndex > 0,
         hasImageNext: (context) => context.images.length - 1 > context.imagePreviewIndex,

         settings() {
            let settings = this.settingStore.getters.items;
            return Array.isArray(settings) ? settings : [];
         },
         settingShowPrice() {
            let theSetting = this.settings.find((setting) => {
               return setting.key === SettingModule.Key.PublicShowPrice;
            });
            return theSetting ? theSetting.value : false;
         },

         price: (context) => {
            if (!context.isEditable && !context.settingShowPrice) return null;
            return context.product ? context.product.price : null;
         },

         description: (context) => (context.product ? context.product.description : ""),

         specificationKeys: () => {
            return Object.keys(ProductSpecType.Key).map((key) => {
               return ProductSpecType.Key[key];
            });
         },
         specifications: (context) => {
            if (!context.product) return [];
            if (!Array.isArray(context.product.specifications)) return [];

            return context.product.specifications
               .filter((spec) => spec && spec.type && spec.content)
               .sort((spec1, spec2) => {
                  const key1 = context.obtainKeyOfSpecificationType(spec1.type);
                  const key2 = context.obtainKeyOfSpecificationType(spec2.type);

                  let index1 = context.specificationKeys.indexOf(key1);
                  let index2 = context.specificationKeys.indexOf(key2);

                  index1 = index1 >= 0 ? index1 : context.specificationKeys.length;
                  index2 = index2 >= 0 ? index2 : context.specificationKeys.length;

                  return index1 !== index2 ? index1 - index2 : key1.localeCompare(key2);
               });
         },

         gifts: (context) => (context.product ? context.product.gifts : []),
         bundles: (context) => (context.product ? context.product.bundles : []),
         whatIncludeds: (context) => {
            return [
               ...context.gifts
                  .filter((gift) => typeof gift === "string")
                  .map((gift) => gift.trim())
                  .filter((gift) => gift.length),
               ...context.bundles
                  .filter((bundle) => typeof bundle === "object" && bundle !== null)
                  .map((bundle) => bundle.title)
                  .filter((bundle) => typeof bundle === "string")
                  .map((bundle) => bundle.trim())
                  .filter((bundle) => bundle.length),
            ];
         },

         primaryColor() {
            return chroma.valid(this.primaryColorHex)
               ? chroma(this.primaryColorHex)
               : chroma("cccccc");
         },
         primaryColorIsDark: (c) => chroma.deltaE(c.primaryColor, "000000") < 75,
         actionbarColor: (c) => c.primaryColor.mix("ffffff", 0.6),
         backgroundColor: (c) => c.primaryColor.mix("ffffff", 0.3),
         headerBackgroundColor: (c) => c.primaryColor.mix("000000", 0.4),
         titleColor() {
            return this.primaryColorIsDark
               ? "white"
               : this.primaryColor.mix("000000", 0.96);
         },
      },
      watch: {
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

            const parent = event.target;
            // const pointHeight = parent.offsetHeight / 4;
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
      }"
      @scroll="(event) => scrolling(event)"
   >
      <div class="ViewerProduct-toolbar" :style="{ 'background-color': actionbarColor }">
         <Actionbar
            class="ViewerProduct-actionbar"
            :leftMenus="leftMenus"
            :rightMenus="rightMenus"
            :style="{ 'background-color': actionbarColor }"
         >
            <span class="ViewerProduct-actionbar-title" v-if="fullTitle">{{
               fullTitle
            }}</span>
         </Actionbar>

         <Tabs
            v-if="tabs.length"
            @click-item="(tab) => scrollTo(tab.key)"
            :items="tabs"
         />
      </div>

      <div class="ViewerProduct-header">
         <div
            class="ViewerProduct-preview"
            v-if="product"
            :style="{ 'background-color': headerBackgroundColor }"
         >
            <ProductViewerImagePreview
               class="ViewerProduct-image"
               ref="keyimage"
               :primaryColor="primaryColor"
               :allowEdit="isEditable"
               :product="product"
               :image="imagePreview"
               :hasImagePrevious="hasImagePrevious"
               :hasImageNext="hasImageNext"
               :hasProductPrevious="!!productPrevious"
               :hasProductNext="!!productNext"
               @click-image="(image) => $root.imageViewerShow(image, images)"
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
            <div class="ViewerProduct-text" :style="{ color: titleColor }">{{
               fullTitle
            }}</div>
         </div>

         <Contacts
            class="ViewerProduct-contact"
            v-if="product"
            :product="product"
            :isWide="isWide"
         />
      </div>

      <div class="ViewerProduct-info">
         <SectionBrand
            ref="keybrand"
            :primaryColor="primaryColor"
            :allowEdit="isEditable"
            :product="product"
            @click-edit="(x) => $emit('click-product-titleBrandUpdate', x)"
         />
         <SectionTitle
            ref="keytitle"
            :primaryColor="primaryColor"
            :allowEdit="isEditable"
            :product="product"
            @click-edit="(x) => $emit('click-product-titleBrandUpdate', x)"
         />
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

      <button
         :class="[
            'ViewerProduct-backToTop',
            scrollTop > 10 ? '' : 'ViewerProduct-backToTop-isHidden',
         ]"
         :style="{
            '--parent-height': `${height}px`,
            '--parent-scrollTop': `${scrollTop}px`,
            'background-color': actionbarColor,
            'box-shadow': `0 0 1rem ${headerBackgroundColor}`,
         }"
         @click="() => scrollToTop()"
      >
         <img :src="host.res('icon/arrow-left-000000.svg')" />
      </button>
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

            .ViewerProduct-text {
               width: 100%;
               color: white;
               font-size: 2.2rem;
               font-weight: 600;
               text-align: center;
               padding: 2rem;
               transition: color var(--color-transition-duration);

               @media (max-width: 480px) {
                  font-size: 1.6rem;
               }
            }
         }
         .ViewerProduct-contact {
            width: 100%;
         }
      }
      .ViewerProduct-info {
         --padding: 1.2rem;

         grid-area: info;

         width: 100%;
         z-index: 2;
         gap: 1.5rem;
         color: black;

         display: flex;
         flex-direction: column;
         align-items: center;
         justify-content: flex-start;
         padding: var(--padding);
         padding-bottom: 10rem;
         padding-bottom: 80vh;
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
      .ViewerProduct-backToTop {
         --size: 3rem;
         --margin: 0.8rem;
         width: var(--size);
         height: var(--size);

         z-index: 3;
         display: flex;
         align-items: center;
         justify-content: center;
         border-radius: 50%;
         position: absolute;
         top: 0;
         right: var(--margin);

         border: none;
         background: none;
         cursor: pointer;

         transition: transform var(--transition-duration);

         --parent-height: 0;
         --parent-scrollTop: 0;

         top: calc(
            var(--parent-height) - var(--margin) - var(--size) + var(--parent-scrollTop)
         );

         &:hover {
            transform: scale(1.1);
         }

         & > * {
            --size: 1.2rem;
            width: var(--size);
            height: var(--size);
            transform: rotate(90deg);
         }
      }
      .ViewerProduct-backToTop-isHidden {
         transform: scale(0);
         pointer-events: none;
         opacity: 0;
      }
   }

   .ViewerProduct-isThin {
      grid-template-rows: 8rem max-content minmax(1fr, max-content);
      grid-template-columns: 100%;
      grid-template-areas:
         "toolbar"
         "header"
         "info";

      .ViewerProduct-header {
         max-width: 50rem;
      }
      .ViewerProduct-info {
         max-width: 50rem;
      }
   }
   .ViewerProduct-isWide {
      --actionbar-height: 5.5rem;
      grid-template-rows: var(--actionbar-height) 1fr;
      grid-template-columns: 45% 55%;
      grid-template-areas:
         "toolbar toolbar"
         "header info";
      .ViewerProduct-header {
         height: calc(100vh - var(--actionbar-height));
         position: sticky;
         left: 0;
         top: var(--actionbar-height);
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
