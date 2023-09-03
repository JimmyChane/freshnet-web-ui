<script lang="ts">
  import Vue from "vue";

  export default Vue.extend({
    props: {
      title: { type: String },
    },
  });
</script>

<template>
  <span class="FloatingTimestamp">{{ title }}</span>
</template>

<style lang="scss" scoped>
  .FloatingTimestamp {
    font-size: 0.7rem;
    font-weight: 600;
    text-align: center;

    background: white;
    box-shadow: 0 0 0.4rem hsl(0, 0%, 80%);
    padding: 0.5rem 0.7rem;
    border-radius: 1em;
    line-height: 0.6em;

    position: sticky;
    top: 0;
  }
</style>
