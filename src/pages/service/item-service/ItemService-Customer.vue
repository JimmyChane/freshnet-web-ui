<script lang="ts">
  import Vue from "vue";

  export default Vue.extend({
    props: {
      name: { type: String, default: "" },
      phoneNumberStr: { type: String, default: "" },
    },
  });
</script>

<template>
  <div class="ItemService-customer">
    <span>{{ name }}</span>
    <span>{{ phoneNumberStr }}</span>
  </div>
</template>

<style lang="scss" scoped>
  .ItemService-customer {
    min-width: max-content;

    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;

    gap: 0.1rem;
    padding: 0 0.5rem;
    color: black;
    border: none;
    background: none;
    font-weight: 600;
    font-size: 0.8rem;

    text-decoration: none;
  }
</style>
