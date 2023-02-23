<script>
   import Tab from "./ViewerProduct-Tabs-Tab.vue";

   export default {
      components: { Tab },
      props: { items: { type: Array, default: () => [] } },
      computed: {
         item() {
            return this.items.find((item) => item.isSelected());
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
            const { item } = this;

            const element = this._self.$el;
            const childElement =
               this._self.$children[this.items.indexOf(item)].$el;

            const parentHalfWidth = element.offsetWidth / 2;
            const childCenter =
               childElement.offsetLeft + childElement.offsetWidth / 2;

            element.scrollTo({
               left: childCenter - parentHalfWidth,
               behavior: "smooth",
            });
         },
      },
   };
</script>

<template>
   <div class="ProductViewerTabs scrollbar">
      <Tab
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
