<script lang="ts">
  import TabVue from "./ViewerProduct-Tabs-Tab.vue";
  import Tab from "./TabOption";
  import Vue from "vue";

  export default Vue.extend({
    components: { TabVue },
    props: {
      items: { type: Array as () => Tab[], default: () => [] },
    },
    computed: {
      item(): Tab | undefined {
        return this.items.find((item) => item.isSelected(item));
      },
    },
    watch: {
      item() {
        this.onItemChange();
      },
    },
    methods: {
      onItemChange() {
        const { item } = this;
        setTimeout(() => {
          if (item === this.item) this.scrollToItem();
        }, 300);
      },
      scrollToItem() {
        const item = this.item;

        if (!item) return;

        const element = this.$el as HTMLElement;
        const child = this.$children[this.items.indexOf(item)];
        const childElement: HTMLElement | Element | null | undefined =
          child.$el ?? null;

        if (!(childElement instanceof HTMLElement)) return;

        const parentHalfWidth = element.offsetWidth / 2;
        const childCenter =
          childElement.offsetLeft + childElement.offsetWidth / 2;

        element.scrollTo({
          left: childCenter - parentHalfWidth,
          behavior: "smooth",
        });
      },
    },
  });
</script>

<template>
  <div class="ProductViewerTabs scrollbar">
    <TabVue
      v-for="item of items"
      :key="item.title"
      :item="item"
      @click="() => $emit('click-item', item)"
    />
  </div>
</template>

<style lang="scss" scoped>
  .ProductViewerTabs {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    overflow-x: auto;
    overflow-y: hidden;
    padding: 0 0.5rem;
  }
</style>
