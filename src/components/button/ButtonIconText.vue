<script>
   export default {
      props: {
         src: { type: String, default: "" },
         text: { type: String, default: "" },
      },
   };
</script>

<template>
   <button class="ButtonIconText" @click="$emit('click')">
      <img class="ButtonIconText-icon" :src="src" :alt="text" />
      <span>{{ text }}</span>
   </button>
</template>

<style lang="scss" scoped>
   .ButtonIconText {
      font-size: 1rem;

      min-width: 2.5em;
      min-height: 2.5em;
      width: max-content;
      height: max-content;
      border-radius: 0.4rem;
      padding: 0.6em;
      background: none;
      border: none;
      transition: var(--animation-duration);
      cursor: pointer;
      color: black;

      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      gap: 0.4em;
      &:hover,
      &:focus {
         background: rgba(0, 0, 0, 0.1);
      }

      .ButtonIconText-icon {
         min-width: 0.9em;
         min-height: 0.9em;
         width: 0.9em;
         height: 0.9em;
         border-radius: 50%;
         background: none;
         border: none;

         display: flex;
         align-items: center;
         justify-content: center;
      }
   }
</style>
