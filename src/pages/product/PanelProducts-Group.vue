<script>
   import Arrow from "./PanelProducts-Group-Arrow.vue";
   import ItemProduct from "./ItemProduct.vue";

   export default {
      components: { Arrow, ItemProduct },
      props: {
         group: { type: Object },
         layoutMode: { type: Number, default: 0 },

         isWide: { type: Boolean, default: false },

         currentProductId: { type: String, default: "" },
         queryBrandId: { type: String, default: "" },
         queryStock: { type: String, default: "" },
      },
      data: () => ({ ArrowDirection: Arrow.Direction, scrollLeft: 0 }),
      computed: {
         icon: (c) => c.group.icon,
         title: (c) => c.group.title,
         items: (c) => c.group.items,
         refScroll: (c) => c.$refs.scroll,
      },
      methods: {
         clickPrevious() {
            const { refScroll } = this;
            refScroll.scrollTo({
               left: refScroll.scrollLeft - refScroll.offsetWidth,
               behavior: "smooth",
            });
         },
         clickNext() {
            const { refScroll } = this;
            refScroll.scrollTo({
               left: refScroll.scrollLeft + refScroll.offsetWidth,
               behavior: "smooth",
            });
         },
      },
   };
</script>

<template>
   <div
      :class="[
         'PanelProducts-category',
         isWide ? 'PanelProducts-category-isWide' : 'PanelProducts-category-isThin',
      ]"
   >
      <div class="PanelProducts-category-header">
         <span class="PanelProducts-category-title">{{ title }}</span>
         <img
            class="PanelProducts-category-icon"
            v-if="icon"
            :src="icon"
            :alt="`${title} Icon`"
         />
      </div>

      <div class="PanelProducts-category-body">
         <div
            :class="['PanelProducts-category-items', 'scrollbar']"
            ref="scroll"
            :style="{ 'z-index': '1' }"
            @scroll="(e) => (scrollLeft = e.target.scrollLeft)"
         >
            <router-link
               v-for="item of items"
               :key="item.id"
               :to="{
                  query: { productId: item.id, brand: queryBrandId, stock: queryStock },
               }"
            >
               <ItemProduct
                  :mode="layoutMode"
                  :item="item"
                  :isSelected="item.id === currentProductId"
               />
            </router-link>
         </div>

         <Arrow
            v-if="!isWide"
            :style="{ 'z-index': '2' }"
            :direction="ArrowDirection.Left"
            :isShowing="scrollLeft > 0"
            @click="() => clickPrevious()"
         />
         <Arrow
            v-if="!isWide"
            :style="{ 'z-index': '2' }"
            :direction="ArrowDirection.Right"
            :isShowing="true"
            @click="() => clickNext()"
         />
      </div>
   </div>
</template>

<style lang="scss" scoped>
   .PanelProducts-category {
      display: flex;
      flex-direction: column;
      align-items: stretch;
      padding: 1rem 0;

      --floating-button-size: 2rem;

      .PanelProducts-category-header {
         display: flex;
         flex-direction: row;
         align-items: center;

         font-size: 2.5rem;
         font-weight: 500;
         gap: 0.5em;

         .PanelProducts-category-icon {
            width: 1em;
            height: 1em;
         }
      }
      .PanelProducts-category-body {
         width: 100%;
         position: relative;
         display: flex;
         flex-direction: row;

         .PanelProducts-category-items {
            width: 100%;

            & > * {
               text-decoration: none;
               & > * {
                  width: 100%;
                  height: 100%;
               }
            }
         }
      }
   }
   .PanelProducts-category-isThin {
      .PanelProducts-category-header {
         padding: 0 0.9rem;
      }
      .PanelProducts-category-items {
         padding: 0 0.7rem;
         padding-right: 50%;

         display: flex;
         flex-direction: row;
         overflow-x: auto;
         overflow-y: hidden;

         --scrollbar-size: 0.4em;
         --scrollbar-thumb-radius: 0.4em;
         --scrollbar-thumb-color: hsla(0, 0%, 0%, 0.1);
         --scrollbar-thumb-color-hover: hsla(0, 0%, 0%, 0.6);
         --scrollbar-track-margin: 1.3rem;

         scroll-snap-type: x proximity;
         scroll-padding: 4rem;

         & > * {
            scroll-snap-align: start;
            width: 10rem;
            min-width: 10rem;
            max-width: 10rem;
         }
      }
   }
   .PanelProducts-category-isWide {
      .PanelProducts-category-header {
         padding: 0 0.8rem;
      }
      .PanelProducts-category-items {
         padding: 0 0.5rem;

         display: grid;
         grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr));
      }
   }
</style>
