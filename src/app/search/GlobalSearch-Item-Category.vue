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
      class="ItemSearchCategory"
      :to="{ path: '/product', query: { category: item.id } }"
      @click="() => $emit('click')"
   >
      <div
         class="ItemSearchCategory-image"
         :class="[thumbnail ? '' : 'ItemSearchCategory-image-noImage']"
      >
         <img
            class="ItemSearchCategory-icon"
            v-if="thumbnail"
            :src="thumbnail"
         />
      </div>
      <div class="ItemSearchCategory-body">
         <div class="ItemSearchCategory-labels">
            <span class="ItemSearchCategory-label">Product</span>
            <span class="ItemSearchCategory-label">Category</span>
         </div>
         <span class="ItemSearchCategory-title">{{ title }}</span>
      </div>
   </ItemSearch>
</template>

<style lang="scss" scoped>
   .ItemSearchCategory {
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

      .ItemSearchCategory-image {
         width: 3.5em;
         height: 3.5em;
         border-radius: 0.2em;
         background: #ffffff80;
         .ItemSearchCategory-icon {
            width: 3.5em;
            height: 3.5em;
            padding: 0.5em;
            border-radius: 0.2em;
            object-fit: contain;
         }
      }
      .ItemSearchCategory-image-noImage {
         background: #ffffff80;
         .ItemSearchCategory-icon {
            display: none;
         }
      }

      .ItemSearchCategory-body {
         min-height: 3.5em;
         display: flex;
         flex-direction: column;
         justify-content: center;
         gap: 0.3em;
         .ItemSearchCategory-labels {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            gap: 0.2em;
            .ItemSearchCategory-label {
               background: #ffffff80;
               font-size: 0.6em;
               padding: 0.4em 0.6em;
               border-radius: 0.3em;
            }
         }
         .ItemSearchCategory-title {
            font-weight: 600;
         }
      }
   }
</style>
