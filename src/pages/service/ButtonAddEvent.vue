<script>
   export default { emits: ["click"] };
</script>

<template>
   <button class="ButtonAddEvent" @click="$emit('click')">
      <img class="ButtonAddEvent-icon" :src="host.res('icon/add-gray.svg')" />
   </button>
</template>

<style lang="scss" scoped>
   .ButtonAddEvent {
      position: relative;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;

      border: none;
      background: white;
      transition: var(--animation-duration);
      // border: 0.1em solid hsl(0, 0%, 70%);
      border-radius: 0.5rem;
      cursor: pointer;
      padding: 1em;

      &:hover {
         background: hsla(201, 22%, 53%, 0.2);
      }
      .ButtonAddEvent-icon {
         width: 1em;
         height: 1em;
         transition: var(--animation-duration);
      }
   }
</style>
