<script>
   export default {
      props: { title: { type: String, default: "" } },
   };
</script>

<template>
   <div :class="['PageHomeSection']">
      <span class="PageHomeSection-title" v-if="title.length">{{ title }}</span>
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

      .PageHomeSection-title {
         font-weight: 500;

         font-size: 2rem;
         // color: hsl(0, 0%, 13%);
         color: black;

         margin-bottom: 1rem;

         display: flex;
         align-items: center;
         justify-content: center;
         text-align: center;
      }
      .PageHomeSection-body {
         display: flex;
         flex-direction: column;
         align-items: stretch;
         overflow: hidden;
      }
   }
</style>
