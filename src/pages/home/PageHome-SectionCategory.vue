<script>
   import Item from "./PageHome-SectionCategory-Item.vue";

   export default {
      components: { Item },
      props: { isThin: { type: Boolean, default: false } },
      data: () => ({ groups: [] }),
      watch: {
         "categoryStore.getters.lastModified"() {
            this.invalidate();
         },
         "productStore.getters.lastModified"() {
            this.invalidate();
         },
      },
      mounted() {
         this.invalidate();
      },
      methods: {
         async invalidate() {
            this.groups = [];

            const groups = (await this.productStore.dispatch("getGroupsByCategory")).sort(
               (group1, group2) => group1.category.compare(group2.category),
            );

            this.groups = groups;
         },
      },
   };
</script>

<template>
   <div class="HomeSectionCategory">
      <Item
         v-for="group of groups"
         :key="group.category.id"
         :productCount="group.items.length"
         :category="group.category"
      />
   </div>
</template>

<style lang="scss" scoped>
   .HomeSectionCategory {
      width: 100%;
      gap: 0.3rem;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(12rem, 1fr));
   }
   .HomeSectionCategory-isThin {
      font-size: 1rem;
   }
   .HomeSectionCategory-isWide {
      font-size: 1.3rem;
   }
</style>
