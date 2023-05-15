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
         queryGroupKey: { type: String, default: "" },
      },
      data: (c) => ({ ArrowDirection: Arrow.Direction, scrollLeft: 0 }),
      computed: {
         key: (c) => c.group.key,
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
         isWide
            ? 'PanelProducts-category-isWide'
            : 'PanelProducts-category-isThin',
      ]"
   >
      <div class="PanelProducts-category-header">
         <img
            class="PanelProducts-category-icon"
            v-if="icon"
            :src="icon"
            :alt="`${title} Icon`"
         />
         <span class="PanelProducts-category-title">{{ title }}</span>

         <router-link
            class="PanelProducts-category-focusGroup transition"
            :to="{ query: { category: key } }"
            v-if="queryGroupKey !== key"
            replace
            >View All</router-link
         >
      </div>

      <div class="PanelProducts-category-body">
         <div
            :class="['PanelProducts-category-items', 'scrollbar']"
            ref="scroll"
            :style="{ 'z-index': '1' }"
            @scroll="(e) => (scrollLeft = e.target.scrollLeft)"
         >
            <Arrow
               v-if="!isWide"
               :style="{ 'z-index': '2', 'margin-right': '-3rem' }"
               :direction="ArrowDirection.Left"
               :isShowing="scrollLeft > 0"
               @click="() => clickPrevious()"
            />

            <router-link
               class="PanelProducts-category-items-item"
               v-for="item of items"
               :key="item.id"
               :to="{
                  query: {
                     productId: item.id,
                     brand: queryBrandId ? queryBrandId : undefined,
                     stock: queryStock ? queryStock : undefined,
                     category: queryGroupKey ? queryGroupKey : undefined,
                  },
               }"
            >
               <ItemProduct
                  :mode="layoutMode"
                  :item="item"
                  :isSelected="item.id === currentProductId"
               />
            </router-link>

            <Arrow
               v-if="!isWide"
               :style="{ 'z-index': '2', 'margin-left': '3rem' }"
               :direction="ArrowDirection.Right"
               :isShowing="true"
               @click="() => clickNext()"
            />
         </div>
      </div>
   </div>
</template>

<style lang="scss" scoped>
   .PanelProducts-category {
      display: flex;
      flex-direction: column;
      align-items: stretch;
      padding: 1rem 0;

      .PanelProducts-category-header {
         display: flex;
         flex-direction: row;
         align-items: center;

         font-size: 2rem;
         font-weight: 500;
         gap: 0.5em;
         padding: 0 1.2rem;

         .PanelProducts-category-icon {
            width: 1em;
            height: 1em;
         }
         .PanelProducts-category-title {
            flex-grow: 1;
         }
         .PanelProducts-category-focusGroup {
            padding: 0.8em 1.2em;
            line-height: 1em;
            font-size: 0.8rem;
            line-height: 1.2em;
            color: white;

            background: var(--accent-color);
            border: none;
            border-radius: 1em;

            cursor: pointer;
            text-decoration: none;

            &:hover {
               background: var(--accent-color-hover);
            }
         }
      }
      .PanelProducts-category-body {
         width: 100%;
         display: flex;
         flex-direction: row;

         .PanelProducts-category-items {
            width: 100%;
            position: relative;

            .PanelProducts-category-items-item {
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
      .PanelProducts-category-items {
         width: 100%;
         padding: 0 0.7rem;

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

         .PanelProducts-category-items-item {
            scroll-snap-align: start;
            width: 10rem;
            min-width: 10rem;
            max-width: 10rem;
         }
      }
   }
   .PanelProducts-category-isWide {
      .PanelProducts-category-items {
         padding: 0 0.5rem;

         display: grid;
         grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr));
         grid-template-columns: repeat(auto-fill, minmax(12rem, 1fr));
         grid-template-columns: repeat(auto-fill, minmax(14rem, 1fr));
      }
   }
</style>
