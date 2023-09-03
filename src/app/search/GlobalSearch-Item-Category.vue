<script lang="ts">
  import ItemSearch from "./GlobalSearch-Item.vue";
  import Labels from "./GlobalSearch-Item-Labels.vue";
  import Category from "@/items/Category";
  import Vue from "vue";
  import Image from "@/items/Image";

  export default Vue.extend({
    components: { ItemSearch, Labels },
    props: {
      item: { type: Category },
    },
    computed: {
      icon(): Image | null {
        return this.item.icon;
      },
      thumbnail(): string {
        return this.icon?.toUrl() ?? "";
      },
      title(): string {
        return this.item?.title ?? "";
      },
    },
  });
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
      <img class="ItemSearchCategory-icon" v-if="thumbnail" :src="thumbnail" />
    </div>
    <div class="ItemSearchCategory-body">
      <Labels :labels="['Product', 'Category']" />
      <span class="ItemSearchCategory-title">{{ title }}</span>
    </div>
  </ItemSearch>
</template>

<style lang="scss" scoped>
  .ItemSearchCategory {
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

      .ItemSearchCategory-title {
        font-weight: 600;
      }
    }
  }
</style>
