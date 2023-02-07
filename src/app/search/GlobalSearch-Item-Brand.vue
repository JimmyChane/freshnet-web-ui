<script>
   import ItemSearch from "./GlobalSearch-Item.vue";

   export default {
      components: { ItemSearch },
      props: { item: { type: Object, default: null } },
      computed: {
         icon: (c) => c.item.icon,
         thumbnail: (c) => (c.icon ? c.icon.toUrl() : ""),
         title: (c) => (c.item ? c.item.title : ""),
      },
   };
</script>

<template>
   <ItemSearch
      class="ItemSearchBrand"
      :to="{ path: '/product', query: { brand: item.id } }"
      @click="() => $emit('click')"
   >
      <div
         class="ItemSearchBrand-image"
         :class="[thumbnail ? '' : 'ItemSearchBrand-image-noImage']"
      >
         <img class="ItemSearchBrand-icon" v-if="thumbnail" :src="thumbnail" />
      </div>
      <div class="ItemSearchBrand-body">
         <div class="ItemSearchBrand-labels">
            <span class="ItemSearchBrand-label">Product</span>
            <span class="ItemSearchBrand-label">Brand</span>
         </div>
         <span class="ItemSearchBrand-title">{{ title }}</span>
      </div>
   </ItemSearch>
</template>

<style lang="scss" scoped>
   .ItemSearchBrand {
      width: 100%;
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      justify-content: flex-start;
      gap: 0.5em;
      padding: 0.5em;
      color: black;
      border-radius: 0.3em;
      font-size: 1.1em;

      .ItemSearchBrand-image {
         width: 3.5em;
         height: 3.5em;
         border-radius: 0.2em;
         background: #ffffff80;
         .ItemSearchBrand-icon {
            width: 3.5em;
            height: 3.5em;
            padding: 0.5em;
            border-radius: 0.2em;
            object-fit: contain;
         }
      }
      .ItemSearchBrand-image-noImage {
         background: #ffffff80;
         .ItemSearchBrand-icon {
            display: none;
         }
      }

      .ItemSearchBrand-body {
         min-height: 3.5em;
         display: flex;
         flex-direction: column;
         justify-content: center;
         gap: 0.3em;
         .ItemSearchBrand-labels {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            gap: 0.2em;
            .ItemSearchBrand-label {
               background: #ffffff80;
               font-size: 0.6em;
               padding: 0.4em 0.6em;
               border-radius: 0.3em;
            }
         }
         .ItemSearchBrand-title {
            font-weight: 600;
         }
      }
   }
</style>
