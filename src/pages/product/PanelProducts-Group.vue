<script>
   import ItemProduct from "./ItemProduct.vue";

   export default {
      components: { ItemProduct },
      props: {
         group: { type: Object },
         layoutMode: { type: Number, default: 0 },

         isWide: { type: Boolean, default: false },

         currentProductId: { type: String, default: "" },
         queryBrandId: { type: String, default: "" },
         queryStock: { type: String, default: "" },
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
         <span class="PanelProducts-category-title">{{ group.title }}</span>
         <img
            class="PanelProducts-category-icon"
            v-if="group.icon"
            :src="group.icon"
            :alt="`${group.title} Icon`"
         />
      </div>

      <div class="PanelProducts-category-items scrollbar">
         <router-link
            v-for="item of group.items"
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
   </div>
</template>

<style lang="scss" scoped>
   .PanelProducts-category {
      display: flex;
      flex-direction: column;
      align-items: stretch;
      padding: 1rem 0;

      position: relative;

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
      .PanelProducts-category-items {
         & > * {
            text-decoration: none;
            & > * {
               width: 100%;
               height: 100%;
            }
         }
      }
      .PanelProducts-previous {
         --size: var(--floating-button-size);
         width: var(--size);
         height: var(--size);
      }
      .PanelProducts-next {
      }
   }
   .PanelProducts-category-isThin {
      .PanelProducts-category-header {
         padding: 0 0.9rem;
      }
      .PanelProducts-category-items {
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

         & > * {
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
