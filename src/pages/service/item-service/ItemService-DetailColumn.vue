<script>
   export default {
      props: {
         width: { type: Number, default: 32 },
      },
   };
</script>

<template>
   <span class="ItemService-DetailColumn" :style="{ '--width': `${width}px` }"
      ><slot
   /></span>
</template>

<style lang="scss" scoped>
   .ItemService-DetailColumn {
      --width: 2rem;
      width: var(--width);
      min-width: var(--width);
      max-width: var(--width);
      height: 1.1rem;
      gap: 0.1rem;

      white-space: pre-line;
      text-overflow: ellipsis;
      word-wrap: break-word;
      overflow: hidden;

      display: flex;
      flex-direction: row;
   }
</style>
