<script lang="ts">
  import Arrow from "./PanelProducts-Group-Arrow.vue";
  import ItemProduct from "./ItemProduct.vue";
  import Vue from "vue";
  import Product from "@/items/Product";
  import { Direction } from "./ArrowOption";
  import { Mode } from "./ItemProductOption";

  interface Group {
    id: string;
    key: string;
    title: string;
    icon: string;
    items: Product[];
  }

  export default Vue.extend({
    components: { Arrow, ItemProduct },
    props: {
      group: { type: Object as () => Group },

      currentProductId: { type: String, default: "" },
      queryBrandId: { type: String, default: "" },
      queryStock: { type: String, default: "" },
      queryGroupKey: { type: String, default: "" },
    },
    data() {
      return {
        ArrowDirection: Direction,
        scrollLeft: 0,
        layoutMode: Mode.List,
      };
    },
    computed: {
      id(): string {
        return this.group.id;
      },
      key(): string {
        return this.group.key;
      },
      icon(): string {
        return this.group.icon;
      },
      title(): string {
        return this.group.title;
      },
      items(): Product[] {
        return this.group.items;
      },
      refScroll(): HTMLElement {
        return this.$refs.scroll as HTMLElement;
      },
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
  });
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
