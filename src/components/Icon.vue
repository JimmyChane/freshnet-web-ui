<script lang="ts">
  import { Icon } from "@/host/ServerResource";

  export default {
    props: {
      src: { default: "" },
      alt: { type: String, default: "" },
    },
    computed: {
      srcString() {
        if (this.src instanceof Icon) {
          return this.src.toUrl();
        }
        return this.src;
      },
    },
  };
</script>

<template>
  <img class="Icon" :src="srcString" :alt="alt" />
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
