<script>
import ItemProduct from './ItemProduct.vue';
import Arrow from './PanelProducts-Group-Arrow.vue';

export default {
  components: { Arrow, ItemProduct },
  props: {
    group: { type: Object },

    currentProductId: { type: String, default: '' },
    queryBrandId: { type: String, default: '' },
    queryStock: { type: String, default: '' },
    queryGroupKey: { type: String, default: '' },
  },
  data: (c) => ({
    ArrowDirection: Arrow.Direction,
    scrollLeft: 0,
    layoutMode: ItemProduct.Mode.List,
  }),
  computed: {
    id: (c) => c.group.id,
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
        behavior: 'smooth',
      });
    },
    clickNext() {
      const { refScroll } = this;
      refScroll.scrollTo({
        left: refScroll.scrollLeft + refScroll.offsetWidth,
        behavior: 'smooth',
      });
    },
  },
};
</script>

<template>
  <div class="PanelProducts-category">
    <span class="PanelProducts-category-title">{{ title }}</span>

    <div
      class="PanelProducts-category-items"
      ref="scroll"
      :style="{ 'z-index': '1' }"
      @scroll="(e) => (scrollLeft = e.target.scrollLeft)"
    >
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
    </div>
  </div>
</template>

<style lang="scss" scoped>
.PanelProducts-category {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding: 1rem 0;

  .PanelProducts-category-title {
    display: flex;
    flex-direction: row;
    align-items: center;

    font-size: 2rem;
    font-weight: 500;
    gap: 0.5em;
    padding: 0 1.2rem;
  }
  .PanelProducts-category-items {
    width: 100%;
    padding: 0.5rem 0.9rem;
    gap: 0.5rem;

    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(20rem, 1fr));

    .PanelProducts-category-items-item {
      text-decoration: none;
      & > * {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>
