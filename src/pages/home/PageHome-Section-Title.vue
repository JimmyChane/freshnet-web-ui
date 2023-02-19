<script>
   export default {
      props: { title: { type: String, default: "" } },
   };
</script>

<template>
   <span class="PageHomeSection-title" v-if="title.length">{{ title }}</span>
</template>

<style lang="scss" scoped>
   .PageHomeSection-title {
      font-weight: 500;

      font-size: 2rem;
      color: black;

      margin-bottom: 1rem;

      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
   }
</style>
