<script>
   export default {
      props: {
         title: { type: String, default: "" },
      },
   };
</script>

<template>
   <span class="WindowTitle-root">{{ title }}</span>
</template>

<style lang="scss" scoped>
   .WindowTitle-root {
      font-weight: 900;
      font-size: 1.8rem;
      color: hsl(0, 0%, 30%);
   }
</style>
