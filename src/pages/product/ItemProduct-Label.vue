<script lang="ts">
  import chroma from "chroma-js";
  import U from "@/U";
  import Vue from "vue";

  export default Vue.extend({
    props: {
      title: { type: String, default: "" },
      primaryColor: {
        type: Object as () => chroma.Color,
        default: () => chroma("#ffffff"),
      },
    },
    computed: {
      isPrimaryColorDark() {
        return U.isColorDark(this.primaryColor);
      },
    },
  });
</script>

<template>
  <span
    class="ItemProduct-Label"
    :style="{
      '--primary-color': primaryColor.toString(),
      color: isPrimaryColorDark ? 'white' : 'black',
    }"
    :key="title"
    >{{ title }}</span
  >
</template>

<style lang="scss" scoped>
  .ItemProduct-Label {
    min-width: max-content;
    width: max-content;
    padding: 0.45em 0.7em;
    background: var(--primary-color);
    border-radius: 1em;
    font-size: 0.6rem;
    font-weight: 400;
    line-height: 1em;
    border: 1px solid rgba(0, 0, 0, 0.1);
  }
</style>
