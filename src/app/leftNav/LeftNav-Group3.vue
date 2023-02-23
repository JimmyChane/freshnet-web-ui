<script>
   import LeftNavLink from "./LeftNav-Link.vue";
   import LeftNavQuery from "./LeftNav-Query.vue";

   export default {
      components: { LeftNavLink, LeftNavQuery },
      props: {
         group3: { type: Object, default: () => null },
      },
   };
</script>

<template>
   <div class="LeftNavGroup3">
      <LeftNavLink
         v-if="!group3.getParent().isQuery"
         :item="group3"
         :href="group3.getLink()"
         @click="() => group3.click()"
      />
      <LeftNavQuery
         v-if="group3.getParent().isQuery"
         :item="group3"
         @click="() => group3.click()"
      />
   </div>
</template>

<style lang="scss" scoped>
   .LeftNavGroup3 {
      width: 100%;
   }
</style>
