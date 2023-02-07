<script>
   export default {
      props: { to: { type: Object } },
   };
</script>

<template>
   <router-link
      class="GlobalSearch-item transition"
      :to="to"
      @click.native="() => $emit('click')"
   >
      <slot />
   </router-link>
</template>

<style lang="scss" scoped>
   .GlobalSearch-item {
      width: 100%;
      cursor: pointer;

      display: flex;
      flex-direction: column;
      text-decoration: none;
      justify-content: center;
      align-items: flex-start;

      color: black;
      text-align: start;
      border: none;
      background: none;
      border-radius: 0.5em;

      &:hover {
         background: rgba(255, 255, 255, 0.5);
      }
   }
</style>
