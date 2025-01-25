<script>
import IconRefresh from '@/assets/icon/refresh-000000.svg';
import IconSearch from '@/assets/icon/search-000000.svg';
import SearchInput from '@/components/SearchInput.vue';
import Actionbar from '@/components/actionbar/Actionbar.vue';
import NavigationBar from '@/components/actionbar/NavigationBar.vue';
import { withItems } from '@/tools/Searcher';

import ItemSearchProduct from './ItemSearchProduct.vue';

export default {
  components: { Actionbar, NavigationBar, SearchInput, ItemSearchProduct },
  props: {
    products: { type: Array, default: () => [] },
    leftMenus: { default: () => [] },
    rightMenus: { default: () => [] },
  },
  data: (c) => ({ searchText: '' }),
  computed: {
    isOver550px: (c) => c.$store.getters.window.innerWidth > 550,

    paths: (c) => c.$store.getters.paths,
    lastPath: (c) => {
      let { paths } = c;
      if (!Array.isArray(paths)) return '';
      if (!paths.length) return '';
      return paths[paths.length - 1];
    },
    productSearches: (c) => withItems(c.products).search(c.searchText),

    initRightMenus() {
      const menus = [];

      if (!this.isOver550px) {
        menus.push({
          title: 'Search',
          icon: IconSearch,
          click: () => this.$emit('click-search'),
        });
      }
      if (Array.isArray(this.rightMenus)) menus.push(...this.rightMenus);
      if (
        !Array.isArray(this.rightMenus) &&
        this.rightMenus !== null &&
        this.rightMenus !== undefined
      ) {
        menus.push(this.rightMenus);
      }

      menus.push({
        key: 'refresh',
        title: 'Refresh',
        icon: IconRefresh,
        click: () => {
          this.$store.state.stores.category.dispatch('refresh');
          this.$store.state.stores.product.dispatch('refresh');
        },
      });

      return menus;
    },
  },
};
</script>

<template>
  <NavigationBar
    class="ActionbarProduct"
    :leftMenus="leftMenus"
    :rightMenus="initRightMenus"
  >
    <SearchInput
      v-if="isOver550px"
      class="ActionbarProduct-search"
      placeholder="Search products"
      :list="productSearches"
      @callback-search="(text) => (searchText = text)"
      v-slot="{ list }"
    >
      <ItemSearchProduct
        class="ActionbarProduct-search-item"
        v-for="product in list"
        :key="product.id"
        :item="product"
      />
    </SearchInput>
  </NavigationBar>
</template>

<style lang="scss" scoped>
.ActionbarProduct {
  border-bottom: 1px solid hsl(0, 0%, 80%);
  .ActionbarProduct-search {
    flex-grow: 1;
    z-index: 1;
    max-width: 30rem;
    border: none;
    margin: 0 0.5rem;
    --border-radius: 2rem;

    .ActionbarProduct-search-item-link {
      text-decoration: none;
      display: flex;
      width: 100%;
      .ActionbarProduct-search-item {
        width: 100%;
      }
    }
  }
}
</style>
