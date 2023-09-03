<script lang="ts">
  import ServiceBelonging from "@/items/ServiceBelonging";
  import Vue from "vue";

  export default Vue.extend({
    props: {
      belonging: { type: ServiceBelonging },
    },
    computed: {
      title(): string {
        return this.belonging.title;
      },
      quantity(): number {
        return this.belonging.quantity;
      },
      description(): string {
        return this.belonging.description;
      },
    },
  });
</script>

<template>
  <div class="ItemBelonging">
    <span class="ItemBelonging-title" style="grid-area: title">{{
      title
    }}</span>
    <span
      class="ItemBelonging-quantity"
      style="grid-area: quantity"
      v-if="quantity > 1"
      >{{ `x${quantity}` }}</span
    >

    <p style="grid-area: description" v-if="description.length">{{
      description
    }}</p>
  </div>
</template>

<style lang="scss" scoped>
  .ItemBelonging {
    gap: 0 1rem;

    display: flex;
    flex-direction: row;
    align-items: flex-start;

    width: 100%;

    display: grid;
    grid-template-areas:
      "title quantity menu"
      "description description description";
    grid-template-columns: max-content 1fr max-content;
    grid-template-rows: max-content 1fr;
    justify-items: flex-start;

    font-size: 0.8em;
    border: 1px solid rgba(0, 0, 0, 0.2);
    padding: 0.5rem;
    border-radius: 0.5rem;

    & > * {
      min-height: 1.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: start;
    }

    .ItemBelonging-title {
      font-weight: 600;
    }
    .ItemBelonging-quantity {
      background: hsla(0, 0%, 0%, 0.05);
      border: 0.1rem solid hsla(0, 0%, 0%, 0.1);
      border-radius: 0.3rem;
    }
  }
</style>
