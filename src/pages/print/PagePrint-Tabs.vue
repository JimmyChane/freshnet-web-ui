<script>
   import Tab from "./PagePrint-Tabs-Tab.vue";
   import Arrow from "./PagePrint-Tabs-Arrow.vue";

   export default {
      components: { Tab, Arrow },
      props: { items: { type: Array, default: () => [] } },
      data: (c) => ({ ArrowDirection: Arrow.Direction, scrollLeft: 0 }),
      computed: {
         selectedItem: (c) => c.items.find((item) => item.isSelected()),
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
            const element = this.$refs.scroll;
            const childElement = this._self.$children[this.items.indexOf(item)].$el;

            const parentHalfWidth = element.offsetWidth / 2;
            const childCenter = childElement.offsetLeft + childElement.offsetWidth / 2;

            element.scrollTo({ left: childCenter - parentHalfWidth, behavior: "smooth" });
         },

         clickPrevious() {
            const currentIndex = this.items.indexOf(this.selectedItem);
            this.scrollToIndex(currentIndex - 1);
         },
         clickNext() {
            const currentIndex = this.items.indexOf(this.selectedItem);
            this.scrollToIndex(currentIndex + 1);
         },
         scrollToIndex(index) {
            if (index > this.items.length - 1) return;
            if (index <= 0) return;

            const item = this.items[index];
            item.click();
         },
      },
   };
</script>

<template>
   <div class="PagePrintTabs">
      <div
         class="PagePrintTabs-items scrollbar"
         :style="{ 'z-index': '1' }"
         ref="scroll"
         @scroll="(e) => (scrollLeft = e.target.scrollLeft)"
      >
         <Tab
            v-for="item of items"
            :key="item.title"
            :item="item"
            @click="() => $emit('click-item', item)"
         />
      </div>

      <Arrow
         v-if="items.length"
         :style="{ 'z-index': '2' }"
         :direction="ArrowDirection.Left"
         :isShowing="scrollLeft > 0"
         @click="() => clickPrevious()"
      />
      <Arrow
         v-if="items.length"
         :style="{ 'z-index': '2' }"
         :direction="ArrowDirection.Right"
         :isShowing="true"
         @click="() => clickNext()"
      />
   </div>
</template>

<style lang="scss" scoped>
   .PagePrintTabs {
      width: 100%;
      min-height: 2.5rem;
      position: relative;

      display: flex;
      flex-direction: row;
      align-items: center;

      .PagePrintTabs-items {
         width: inherit;
         min-height: inherit;
         padding: 0 0.5rem;
         padding-right: 50%;

         display: flex;
         flex-direction: row;
         align-items: center;

         overflow-x: scroll;
         overflow-y: hidden;

         scroll-snap-type: x proximity;

         & > * {
            scroll-snap-align: center;
         }
      }
   }
</style>
