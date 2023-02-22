<script>
   import Tab from "./PagePrint-Tabs-Tab.vue";

   export default {
      components: { Tab },
      props: { items: { type: Array, default: () => [] } },
      computed: {
         selectedItem() {
            return this.items.find((item) => item.isSelected());
         },
      },
      watch: {
         selectedItem() {
            this.onItemChange();
         },
      },
      methods: {
         onItemChange() {
            const { selectedItem } = this;
            setTimeout(() => {
               if (selectedItem === this.selectedItem) this.scrollToItem(selectedItem);
            }, 300);
         },
         scrollToItem(item) {
            const element = this._self.$el;
            const childElement = this._self.$children[this.items.indexOf(item)].$el;

            const parentHalfWidth = element.offsetWidth / 2;
            const childCenter = childElement.offsetLeft + childElement.offsetWidth / 2;

            element.scrollTo({ left: childCenter - parentHalfWidth, behavior: "smooth" });
         },
      },
   };
</script>

<template>
   <div class="PagePrintTabs scrollbar">
      <Tab
         v-for="item of items"
         :key="item.title"
         :item="item"
         @click="() => $emit('click-item', item)"
      />
   </div>
</template>

<style lang="scss" scoped>
   .PagePrintTabs {
      width: 100%;
      min-height: 2.5rem;
      display: flex;
      flex-direction: row;
      align-items: center;
      overflow-x: scroll;
      overflow-y: hidden;
      padding: 0 0.5rem;
   }
</style>
