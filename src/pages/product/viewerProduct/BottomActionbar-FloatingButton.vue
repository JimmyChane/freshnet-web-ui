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

      border: none;
      cursor: pointer;
      border-radius: 1rem;
      overflow: hidden;

      text-decoration: none;
      font-size: 1rem;
      font-weight: 600;
      line-height: 0.9rem;
      padding: 0.8rem;

      overflow: hidden;

      background: white;
      box-shadow: 0 0 5rem hsla(0, 0%, 0%, 0.3);
   }
</style>
