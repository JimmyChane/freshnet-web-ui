<script lang="ts">
  import Category from "@/items/Category";
  import Vue from "vue";
  import Label from "./ItemCustomer-Label.vue";

  interface Data {
    category: Category | null;
  }

  export default Vue.extend({
    components: { Label },
    props: {
      categoryKey: { type: String, default: "" },
      count: { type: Number, default: 0 },
    },
    data(): Data {
      return { category: null };
    },
    computed: {
      icon(): string {
        return this.category?.icon?.toUrl() ?? "";
      },
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
  });
</script>

<template>
  <Label :icon="icon" :count="count" />
</template>
