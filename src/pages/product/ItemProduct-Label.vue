<script>
   import chroma from "chroma-js";
   import U from "@/U";

   export default {
      props: {
         title: { type: String, default: "" },
         primaryColor: { type: chroma.Color, default: () => chroma("#f5f5f5") },
      },
      computed: { isPrimaryColorDark: (c) => U.isColorDark(c.primaryColor) },
   };
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
      padding: 0.2rem 0.3rem;
      background-color: var(--primary-color);
      border-radius: 1em;
      font-size: 0.6rem;
      font-weight: 400;
      line-height: 1em;
   }
</style>
