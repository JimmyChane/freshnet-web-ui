<script>
   export default {
      props: {
         title: { type: String, default: "" },
         text: { type: String, default: "" },
      },
   };
</script>

<template>
   <div class="ItemUser-Row">
      <span class="ItemUser-Row-title">{{ title }}</span>
      <span class="ItemUser-Row-text">{{ text }}</span>
   </div>
</template>

<style lang="scss" scoped>
   .ItemUser-Row {
      display: flex;
      flex-direction: row;

      .ItemUser-Row-title {
         width: 6rem;
      }
      .ItemUser-Row-text {
         flex-grow: 1;
      }
   }
</style>
