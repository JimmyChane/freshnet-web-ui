<script>
   import Label from "./ItemCustomer-Label.vue";

   export default {
      components: { Label },
      props: {
         categoryKey: { type: String, default: "" },
         count: { type: Number, default: 0 },
      },
      data: (c) => ({ category: null }),
      computed: {
         icon: (c) => c.category?.icon?.toUrl() ?? "",
      },
      watch: {
         categoryKey() {
            this.invalidate();
         },
      },
      mounted() {
         this.invalidate();
      },
      methods: {
         async invalidate() {
            this.category = null;
            this.category = await this.$store.state.stores.category.dispatch(
               "getItemOfKey",
               this.categoryKey,
            );
         },
      },
   };
</script>

<template>
   <Label :icon="icon" :count="count" />
</template>
