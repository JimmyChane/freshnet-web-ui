<script>
   export default {
      props: {
         target: { type: String, default: "" },
         href: { type: String, default: "" },
      },
   };
</script>

<template>
   <a
      v-if="href.length"
      class="FloatingButton"
      :target="target"
      :href="href"
      @click="() => $emit('click')"
   >
      <slot />
   </a>

   <button v-else class="FloatingButton" @click="() => $emit('click')">
      <slot />
   </button>
</template>

<style lang="scss" scoped>
   .FloatingButton {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      justify-content: center;

      cursor: pointer;
      border: 1px solid hsla(0, 0%, 0%, 0.1);
      border-radius: 1rem;

      text-decoration: none;
      font-weight: 600;
      padding: 0.8rem;

      overflow: hidden;

      background: white;
      box-shadow: 0 0 2rem hsla(0, 0%, 0%, 0.1);
   }
</style>
