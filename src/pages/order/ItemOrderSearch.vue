<script lang="ts">
  import Order from "@/items/Order";
  import PhoneNumber from "@/items/PhoneNumber";
  import Vue from "vue";

  export default Vue.extend({
    props: {
      item: { type: Order },
    },
    computed: {
      content(): string {
        return this.item.content;
      },
      name(): string {
        return this.item.customer?.name ?? "";
      },
      phoneNumber(): PhoneNumber | undefined {
        return this.item.customer?.phoneNumber ?? undefined;
      },
      status(): number {
        return this.item.status;
      },
    },
  });
</script>

<template>
  <div class="ItemOrderSearch">
    <span>{{ content }}</span>
    <span>{{ name }}</span>
    <span>{{ phoneNumber }}</span>
    <span>{{ status }}</span>
  </div>
</template>

<style lang="scss" scoped>
  .ItemOrderSearch {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    padding: 1rem;
  }
</style>
