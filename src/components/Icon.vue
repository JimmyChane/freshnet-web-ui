<script>
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
      font-size: 1rem;

      min-width: 2.5em;
      min-height: 2.5em;
      width: 2.5em;
      height: 2.5em;
      padding: 0.7em;
      background: none;
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
   }
</style>
