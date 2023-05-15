<script>
   import State from "@/items/ServiceState";
   import ImageViews from "@/components/ImageViews.vue";
   import ItemSearch from "./GlobalSearch-Item.vue";
   import Labels from "./GlobalSearch-Item-Labels.vue";

   export default {
      components: { ImageViews, ItemSearch, Labels },
      props: { item: { type: Object, default: null } },
      computed: {
         images: (c) => c.item?.imageFiles ?? [],
         stateTitle: (c) => {
            const key = c.item?.state ?? "";
            const state = State.findByKey(key);
            return state?.title ?? "";
         },
         title: (c) => {
            const customer = c.item?.customer ?? null;
            const name = customer?.name ?? "";
            const phoneNumber = customer?.phoneNumber ?? "";
            return `${name} ${phoneNumber}`;
         },
         description: (c) => c.item?.description ?? "",
      },
   };
</script>

<template>
   <ItemSearch
      class="ItemSearchService"
      :to="{ path: '/manage/service', query: { service: item.id } }"
      @click="() => $emit('click')"
   >
      <div
         class="ItemSearchService-image"
         :class="[images.length > 0 ? '' : 'ItemSearchService-image-noImage']"
      >
         <ImageViews
            class="ItemSearchService-thumbnail"
            :width="56"
            :height="56"
            :images="item.imageFiles"
         />
      </div>
      <div class="ItemSearchService-body">
         <Labels :labels="['Service', stateTitle]" />
         <span class="ItemSearchService-title">{{ title }}</span>
         <span class="ItemSearchService-subTitle">{{ description }}</span>
      </div>
   </ItemSearch>
</template>

<style lang="scss" scoped>
   .ItemSearchService {
      .ItemSearchService-image {
         width: 3.5em;
         height: 3.5em;
         min-width: 3.5em;
         min-height: 3.5em;
         max-width: 3.5em;
         max-height: 3.5em;
         border-radius: 0.2em;
         .ItemSearchService-thumbnail {
            width: 3.5em;
            height: 3.5em;
            min-width: 3.5em;
            min-height: 3.5em;
            max-width: 3.5em;
            max-height: 3.5em;
            border-radius: 0.2em;
            object-fit: contain;
         }
      }
      .ItemSearchService-image-noImage {
         background: #ffffff80;
         .ItemSearchService-thumbnail {
            display: none;
         }
      }

      .ItemSearchService-body {
         min-height: 3.5em;
         display: flex;
         flex-direction: column;
         justify-content: center;
         gap: 0.3em;

         .ItemSearchService-labels {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            gap: 0.2em;
         }
         .ItemSearchService-title {
            font-weight: 600;
         }
         .ItemSearchService-subTitle {
            font-size: 0.8em;
            font-weight: 400;
            color: #808080;
         }
      }
   }
</style>
