<script>
   export default {
      props: {
         title: { type: String, default: "" },
      },
   };
</script>

<template>
   <div class="ExportLayoutOption">
      <span class="ExportLayoutOption-title">{{ title }}</span>
   </div>
</template>

<style lang="scss" scoped>
   .ExportLayoutOption {
      border: 1px solid hsla(0, 0%, 0%, 0.1);
      width: 100%;
      height: 4rem;

      display: flex;
      align-items: center;
      justify-content: center;
   }
</style>
