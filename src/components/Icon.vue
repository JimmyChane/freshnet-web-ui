<script lang="ts">
  export default {
    props: {
      src: { type: String, default: "" },
      alt: { type: String, default: "" },
    },
  };
</script>

<template>
  <img class="Icon" :src="src" :alt="alt" />
</template>

<style lang="scss" scoped>
  .Icon {
    font-size: 2.5rem;
    width: 1em;
    height: 1em;
    min-width: 1em;
    min-height: 1em;
    max-width: 1em;
    max-height: 1em;
    background: none;
    padding: 0.28em;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
