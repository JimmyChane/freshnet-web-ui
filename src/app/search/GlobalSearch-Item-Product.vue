<script>
import { Product } from '@/items/Product';

import ImageViews from '@/components/ImageViews.vue';

import Labels from './GlobalSearch-Item-Labels.vue';
import ItemSearch from './GlobalSearch-Item.vue';

export default {
  emtis: ['callback-click'],
  components: { ImageViews, ItemSearch, Labels },
  props: {
    item: { type: Product, default: null },
  },
  data: (c) => ({
    categoryTitle: '',
    title: '',
  }),
  computed: {
    images: (c) => c.item.images,
  },
  watch: {
    item() {
      this.invalidate();
    },
  },
  mounted() {
    this.invalidate();
  },
  methods: {
    async invalidate() {
      this.categoryTitle = '';
      this.title = '';

      if (!this.item) return;

      this.categoryTitle = await this.item
        .fetchCategory()
        .then((category) => category?.title ?? '')
        .catch((error) => '');
      this.title = await this.item.fetchFullTitle().catch((error) => '');
    },
  },
};
</script>

<template>
  <ItemSearch
    class="ItemSearchProduct"
    :to="{ path: '/product', query: { productId: item.id } }"
    @click="() => $emit('click')"
  >
    <div
      class="ItemSearchProduct-image"
      :class="[images.length > 0 ? '' : 'ItemSearchProduct-image-noImage']"
    >
      <ImageViews
        class="ItemSearchProduct-thumbnail"
        :width="56"
        :height="56"
        :images="images"
      />
    </div>
    <div class="ItemSearchProduct-body">
      <Labels :labels="['Product', categoryTitle]" />
      <span class="ItemSearchProduct-title">{{ title }}</span>
    </div>
  </ItemSearch>
</template>

<style lang="scss" scoped>
.ItemSearchProduct {
  .ItemSearchProduct-image {
    width: 3.5em;
    height: 3.5em;
    border-radius: 0.2em;
    .ItemSearchProduct-thumbnail {
      width: 3.5em;
      height: 3.5em;
      border-radius: 0.2em;
      object-fit: contain;
    }
  }
  .ItemSearchProduct-image-noImage {
    background: #ffffff80;
    .ItemSearchProduct-thumbnail {
      display: none;
    }
  }

  .ItemSearchProduct-body {
    min-height: 3.5em;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 0.3em;

    .ItemSearchProduct-title {
      font-weight: 600;
    }
  }
}
</style>
