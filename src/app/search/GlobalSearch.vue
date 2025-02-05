<script>
import SearchInput from '@/components/SearchInput.vue';
import ButtonIcon from '@/components/button/ButtonIcon.vue';
import { useBrandStore } from '@/pinia-stores/brand.store';
import { useCategoryStore } from '@/pinia-stores/category.store';
import { useLoginStore } from '@/pinia-stores/login.store';
import { useProductStore } from '@/pinia-stores/product.store';
import { usePs2Store } from '@/pinia-stores/ps2.store';
import { useServiceStore } from '@/pinia-stores/service.store';

import ItemSearchBrand from './GlobalSearch-Item-Brand.vue';
import ItemSearchCategory from './GlobalSearch-Item-Category.vue';
import ItemSearchProduct from './GlobalSearch-Item-Product.vue';
import ItemSearchPs2Disc from './GlobalSearch-Item-Ps2Disc.vue';
import ItemSearchService from './GlobalSearch-Item-Service.vue';

export default {
  components: {
    SearchInput,
    ButtonIcon,
    ItemSearchProduct,
    ItemSearchCategory,
    ItemSearchBrand,
    ItemSearchPs2Disc,
    ItemSearchService,
  },
  props: {
    placeholder: { type: String },
  },
  data: (c) => ({ searchText: '', searches: [] }),
  computed: {
    user: (c) => useLoginStore().user,

    categories: (c) => useCategoryStore().items,
    products: (c) => {
      return useProductStore().items.filter((product) => {
        return product.isStockAvailable();
      });
    },
    brands: (c) => useBrandStore().items,
    ps2Discs: (c) => usePs2Store().items,
    services: (c) => {
      if (c.user.isTypeNone()) return [];
      return useServiceStore().items;
    },
  },
  watch: {
    user() {
      if (!this.user.isTypeNone()) useServiceStore().getItems();
      this.search(this.searchText);
    },
  },
  mounted() {
    usePs2Store().getItems();
    useBrandStore().getItems();
    useCategoryStore().getItems();
    useCategoryStore().refresh();
    useProductStore().refresh();
    if (this.user.isTypeAdmin() || this.user.isTypeStaff()) {
      useServiceStore().getItems();
    }
  },
  methods: {
    search(text) {
      text = this.searchText = text.toLowerCase();
      let texts = text.split(/[\s,]+/).filter((text) => text.trim().length);

      let productSearches = this.products.map((product) => {
        return {
          dataType: 'product',
          item: product,
          count: product.toCount(texts),
        };
      });
      let categorySearches = this.categories.map((category) => {
        return {
          dataType: 'category',
          item: category,
          count: category.toCount(texts),
        };
      });
      let brandSearches = this.brands.map((brand) => {
        return {
          dataType: 'brand',
          item: brand,
          count: brand.toCount(texts),
        };
      });
      let ps2DiscSearches = this.ps2Discs.map((ps2Disc) => {
        return {
          dataType: 'ps2Disc',
          item: ps2Disc,
          count: ps2Disc.toCount(texts),
        };
      });
      let serviceSearches = this.services.map((service) => {
        return {
          dataType: 'service',
          item: service,
          count: service.toCount(texts),
        };
      });

      const searches = [
        ...productSearches,
        ...categorySearches,
        ...brandSearches,
        ...ps2DiscSearches,
        ...serviceSearches,
      ];
      const highCount = searches.reduce((highCount, x) => {
        return highCount < x.count ? x.count : highCount;
      }, 0);
      const valueToAccept = highCount * 0.5;

      if (valueToAccept)
        this.searches = searches
          .filter((x) => x.count >= valueToAccept)
          .sort((x1, x2) => x2.count - x1.count);
      else this.searches = [];
    },

    focus() {
      this.$refs.searchinput.focus();
    },
  },
};
</script>

<template>
  <SearchInput
    ref="searchinput"
    class="GlobalSearch"
    :list="searches"
    :placeholder="placeholder"
    @callback-search="(text) => search(text)"
    @expand="() => $emit('expand')"
    @collapse="() => $emit('collapse')"
    v-slot="{ collapse }"
  >
    <div class="GlobalSearch-item" v-for="x in searches" :key="x.item.id">
      <ItemSearchProduct
        v-if="x.dataType === 'product'"
        :item="x.item"
        @click="() => collapse()"
      />
      <ItemSearchCategory
        v-if="x.dataType === 'category'"
        :item="x.item"
        @click="() => collapse()"
      />
      <ItemSearchBrand
        v-if="x.dataType === 'brand'"
        :item="x.item"
        @click="() => collapse()"
      />
      <ItemSearchPs2Disc
        v-if="x.dataType === 'ps2Disc'"
        :item="x.item"
        @click="() => collapse()"
      />
      <ItemSearchService
        v-if="x.dataType === 'service'"
        :item="x.item"
        @click="() => collapse()"
      />
    </div>
  </SearchInput>
</template>

<style lang="scss" scoped>
.GlobalSearch {
  --background-color: hsl(0, 0%, 94%);
  --border-radius: 4rem;
  --border: 1px solid transparent;
  --border-focus: 1px solid hsla(0, 0%, 0%, 0.15);
  --dropdown-height: calc(100dvh - 10rem);

  .GlobalSearch-item {
    width: 100%;
    display: flex;
  }
}
</style>
