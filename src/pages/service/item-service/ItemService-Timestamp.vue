<script>
   export default {
      props: {
         timestampText: { type: String, default: "" },
      },
   };
</script>

<template>
   <span class="ItemService-timestamp">{{ timestampText }}</span>
</template>

<style lang="scss" scoped>
   .ItemService-timestamp {
      max-width: max-content;
      color: rgb(112, 112, 112);
      flex-grow: 1;
      text-align: center;
   }
</style>
