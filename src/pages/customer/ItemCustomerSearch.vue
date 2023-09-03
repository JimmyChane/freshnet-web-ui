<script lang="ts">
  import Customer from "@/items/Customer";
  import PhoneNumber from "@/items/PhoneNumber";
  import Vue from "vue";

  export default Vue.extend({
    props: {
      item: { type: Customer },
    },
    computed: {
      name(): string {
        return this.item.name;
      },
      phoneNumber(): PhoneNumber | null {
        return this.item.phoneNumber;
      },
      description(): string {
        return this.item.description;
      },
    },
  });
</script>

<template>
  <div class="ItemSearch">
    <div class="ItemSearch-header">
      <span>{{ name }}</span>
      <div class="ItemSearch-dot"></div>
      <span>{{ phoneNumber }}</span>
    </div>
    <span>{{ description }}</span>
  </div>
</template>

<style lang="scss" scoped>
  .ItemSearch {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    padding: 1rem;

    .ItemSearch-header {
      width: 100%;
      gap: 0.5rem;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;

      .ItemSearch-dot {
        --size: 3px;
        width: var(--size);
        height: var(--size);
        min-width: var(--size);
        min-height: var(--size);
        max-width: var(--size);
        max-height: var(--size);
        border-radius: 50%;
        background: hsl(0, 0%, 20%);
        display: flex;
      }
    }
  }
</style>
