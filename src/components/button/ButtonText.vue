<script>
   export default {
      props: {
         text: { type: String, default: "" },
      },
   };
</script>

<template>
   <button class="ButtonText" @click="$emit('click')">
      <span>{{ text }}</span>
   </button>
</template>

<style lang="scss" scoped>
   .ButtonText {
      font-size: 1rem;

      min-width: 2.5em;
      min-width: max-content;
      min-height: 2.5em;
      width: 2.5em;
      width: max-content;
      height: 2.5em;
      border-radius: 0.4rem;
      padding: 0.6em;
      background: none;
      border: none;
      transition: var(--transition-duration);
      cursor: pointer;
      color: black;

      display: flex;
      align-items: center;
      justify-content: center;
      &:hover,
      &:focus {
         background: rgba(0, 0, 0, 0.1);
      }
   }
</style>
