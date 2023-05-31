<template>
   <div :class="['TabLayout', 'scrollbar']">
      <div>
         <slot />
      </div>
   </div>
</template>

<style lang="scss" scoped>
   .TabLayout {
      z-index: 1;
      width: 100%;
      height: max-content;
      padding-top: 0.1em;
      padding-bottom: 0em;
      padding-left: 1em;
      padding-right: 2em;
      overflow-x: auto;

      --scrollbar-size: 0.2rem;
      --scrollbar-thumb-color: hsla(0, 0%, 0%, 0.05);
      --scrollbar-thumb-color-hover: hsla(0, 0%, 0%, 0.1);
      --scrollbar-track-color: transparent;
      --scrollbar-track-color-hover: transparent;
      --scrollbar-track-margin: 1rem;

      display: flex;
      flex-direction: column;
      align-items: flex-start;

      & > * {
         gap: 0.3rem;

         display: flex;
         flex-direction: row;
         align-items: center;
         justify-content: flex-start;
      }
   }
</style>
