<script>
   import Category from "@/items/Category";
   import ImageView from "@/components/ImageView.vue";
   import chroma from "chroma-js"; // https://gka.github.io/chroma.js/

   export default {
      components: { ImageView },
      props: { isThin: { type: Boolean, default: false } },
      data() {
         return {
            groupMenus: [],

            maxLength: 8,
            products: [],
            productIndex: 0,

            itemTitle: "",
            primaryColor: chroma("cccccc"),
         };
      },
      computed: {
         "categoryStore.getters.lastModified"() {
            this.invalidate();
         },
         item() {
            if (this.productIndex < 0)
               this.productIndex = this.products.length - 1;
            if (this.productIndex >= this.products.length)
               this.productIndex = 0;
            return this.products[this.productIndex];
         },
         itemImage() {
            return this.item ? this.item.toImageThumbnail() : null;
         },
         itemImageUrl() {
            return this.itemImage ? this.itemImage.toUrl({ width: 350 }) : "";
         },
         itemId() {
            return this.item ? this.item.id : "";
         },

         color() {
            return chroma.valid(this.primaryColor)
               ? this.primaryColor
               : chroma("cccccc");
         },
         color1() {
            return this.getColorMixed(this.color, 0.2);
         },
         color2() {
            return this.getColorMixed(this.color, 0.3);
         },
         color3() {
            return this.getColorMixed(this.color, 0.9);
         },

         arrowIcon() {
            return this.isColorDark(this.color)
               ? this.host.res("icon/arrowDown-ffffff.svg")
               : this.host.res("icon/arrowDown-000000.svg");
         },
      },
      watch: {
         item() {
            this.invalidateProduct();
         },
      },
      mounted() {
         this.invalidate();
         this.invalidateProduct();
      },
      methods: {
         async invalidate() {
            this.products = [];
            const groups = await this.productStore.dispatch(
               "getGroupsByCategory",
            );
            if (!groups.length) return;

            this.itemTitle = "";
            const products = groups
               .filter((group) => {
                  return (
                     group.category.key === Category.Key.Notebook ||
                     group.category.key === Category.Key.Desktop ||
                     group.category.key === Category.Key.Printer
                  );
               })
               .sort((group1, group2) =>
                  group1.category.compare(group2.category),
               )
               .reduce((products, group) => {
                  products.push(...group.items);
                  return products;
               }, [])
               .filter((product) => {
                  return (
                     product.toImageThumbnail() && product.isStockAvailable()
                  );
               });

            while (products.length > this.maxLength) {
               const delta = Math.random() * products.length;
               const index = Math.floor(delta);
               products.splice(index, 1);
            }

            this.products = products;
         },
         async invalidateProduct() {
            if (!this.item) {
               this.itemTitle = "";
               this.primaryColor = null;
               return;
            }

            this.itemTitle = await this.item.fetchFullTitle();
            this.primaryColor = this.itemImage
               ? await this.itemImage.fetchColor().catch(() => chroma("cccccc"))
               : chroma("cccccc");
         },

         getColorMixed(color, value) {
            return color.mix(
               this.isColorDark(this.color) ? "#ffffff" : "#000000",
               value,
            );
         },
         isColorDark(color) {
            return chroma.deltaE(color, "000000") < 60;
         },
      },
   };
</script>

<template>
   <div
      :class="[
         'HomeSectionProduct',
         `HomeSectionProduct-${isThin ? 'isThin' : 'isWide'}`,
      ]"
      :style="{
         '--color0': color,
         '--color1': getColorMixed(color, 0.2),
         '--color2': getColorMixed(color, 0.3),
         '--color3': getColorMixed(color, 0.9),
      }"
   >
      <span class="HomeSectionProduct-header">{{ itemTitle }}</span>
      <ImageView
         class="HomeSectionProduct-img"
         v-if="itemImage"
         :src="itemImage"
         @click="
            () =>
               $router.push({ path: '/product', query: { productId: itemId } })
         "
      />

      <div class="HomeSectionProduct-footer" v-if="products.length > 1">
         <button
            :class="[
               'HomeSectionProduct-footer-item',
               `HomeSectionProduct-footer-item-${
                  products.indexOf(item) === productIndex
                     ? 'isSelected'
                     : 'isDeselected'
               }`,
            ]"
            v-for="item of products"
            :key="item.id"
            @click="() => (productIndex = products.indexOf(item))"
         />
      </div>

      <button
         class="HomeSectionProduct-arrow HomeSectionProduct-arrow-left"
         @click="() => productIndex--"
      >
         <img :src="arrowIcon" />
      </button>
      <button
         class="HomeSectionProduct-arrow HomeSectionProduct-arrow-right"
         @click="() => productIndex++"
      >
         <img :src="arrowIcon" />
      </button>
   </div>
</template>

<style lang="scss" scoped>
   .HomeSectionProduct {
      aspect-ratio: 16/12;
      border-radius: 1em;
      overflow: hidden;
      text-decoration: none;
      transition: var(--transition-duration);
      background-color: var(--color0);
      color: var(--color3);

      width: 100%;
      height: 100%;
      position: relative;

      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      --header-height: 3em;
      --footer-height: 3em;

      .HomeSectionProduct-header {
         font-size: 1.5em;
         font-weight: 600;
         display: flex;
         justify-content: center;
         align-items: center;
         text-align: center;
         line-height: 1em;

         padding: 1em;

         height: var(--header-height);
         min-height: var(--header-height);
         max-height: var(--header-height);
      }

      .HomeSectionProduct-img {
         --height: calc(100% - var(--header-height) - var(--footer-height));
         height: var(--height);
         min-height: var(--height);
         max-height: var(--height);
         flex-grow: 1;
         object-fit: contain;
         cursor: pointer;

         border-radius: 1rem;
         filter: drop-shadow(0 0 1rem hsla(0, 0%, 0%, 0.2));
      }

      .HomeSectionProduct-footer {
         width: 100%;
         height: var(--footer-height);
         min-height: var(--footer-height);
         max-height: var(--footer-height);
         display: flex;
         flex-direction: row;
         align-items: center;
         justify-content: center;

         .HomeSectionProduct-footer-item {
            width: var(--size);
            height: var(--size);
            min-width: var(--size);
            min-height: var(--size);
            max-width: var(--size);
            max-height: var(--size);

            border-radius: 50%;
            border: none;
            transition: var(--transition-duration);
         }
         .HomeSectionProduct-footer-item-isSelected {
            transform: scale(1.5);
            margin-left: calc(var(--size) * 0.33);
            margin-right: calc(var(--size) * 0.33);
            background-color: var(--color3);
         }
         .HomeSectionProduct-footer-item-isDeselected {
            background-color: var(--color3);
            cursor: pointer;
            &:hover {
               box-shadow: 0px 0px 0.5rem var(--color3);
            }
         }
      }

      .HomeSectionProduct-arrow {
         --size: 3.5em;
         --padding: 0.8em;
         position: absolute;
         display: flex;
         align-items: center;
         justify-content: center;

         padding: var(--padding);
         border-radius: 50%;
         cursor: pointer;
         background: none;
         border: none;

         width: var(--size);
         height: var(--size);
         min-width: var(--size);
         min-height: var(--size);
         max-width: var(--size);
         max-height: var(--size);

         transition: var(--transition-duration);

         & > * {
            width: calc(var(--size) - calc(var(--padding) * 2));
            height: calc(var(--size) - calc(var(--padding) * 2));
         }

         &:hover {
            background-color: hsla(0, 0%, 0%, 0.05);
         }
         &:focus {
            transform: scale(0.9);
         }
      }
      .HomeSectionProduct-arrow-left {
         top: calc(50% - calc(var(--size) / 2));
         left: 1em;
         & > * {
            transform: rotate(90deg) translateY(5%);
         }
      }
      .HomeSectionProduct-arrow-right {
         top: calc(50% - calc(var(--size) / 2));
         right: 1em;
         & > * {
            transform: rotate(270deg) translateY(5%);
         }
      }
   }
   .HomeSectionProduct-isThin {
      width: 100%;
      height: 100%;
      font-size: 0.9rem;
      .HomeSectionProduct-footer {
         gap: 0.3em;
         .HomeSectionProduct-footer-item {
            --size: 14px;
         }
      }
   }
   .HomeSectionProduct-isWide {
      width: 100%;
      height: 100%;
      font-size: 1.2rem;
      .HomeSectionProduct-footer {
         gap: 0.5em;
         .HomeSectionProduct-footer-item {
            --size: 16px;
         }
      }
   }
</style>
