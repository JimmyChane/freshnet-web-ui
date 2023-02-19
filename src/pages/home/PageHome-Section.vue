<script>
   import Title from "./PageHome-Section-Title.vue";
   export default {
      components: { Title },
      props: { title: { type: String, default: "" } },
   };
</script>

<template>
   <div :class="['PageHomeSection']">
      <Title :title="title" />
      <slot />
   </div>
</template>

<style lang="scss" scoped>
   .PageHomeSection {
      width: 100%;
      gap: 0.5rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-top: 2rem;
      margin-bottom: 1rem;

      .PageHomeSection-body {
         display: flex;
         flex-direction: column;
         align-items: stretch;
         overflow: hidden;
      }
   }
</style>
