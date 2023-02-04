<script>
   export default {
      data() {
         return {
            menus: [],
         };
      },
      mounted() {
         for (let i = 0; i < 100; i++) {
            this.menus.push({ key: `key${i}`, title: `Hello ${i}` });
         }
      },
   };
</script>

<template>
   <div class="anchor">
      <slot />
      <div class="Menu">
         <div class="Menu-scroll scrollbar">
            <button class="transition" v-for="menu of menus" :key="menu.key">
               <span>{{ menu.title }}</span>
            </button>
         </div>
      </div>
   </div>
</template>

<style lang="scss" scoped>
   .Menu {
      position: absolute;
      top: 0;
      bottom: 0;
      z-index: 5;
      display: flex;
      overflow: hidden;

      min-width: 10em;
      width: max-content;
      height: max-content;
      max-height: 20em;

      border-radius: 1em;
      box-shadow: 0 0 1em hsla(0, 0%, 0%, 0.1);
      border: 1px solid hsla(0, 0%, 0%, 0.1);

      .Menu-scroll {
         --padding-horizontal: 0.5em;

         padding: var(--padding-horizontal) 0;
         padding-right: 1px;
         min-width: inherit;
         width: inherit;
         height: inherit;
         max-height: inherit;

         overflow-x: hidden;
         overflow-y: auto;
         --scrollbar-size: 0.4em;
         --scrollbar-thumb-radius: 0.4em;
         --scrollbar-thumb-color: hsla(0, 0%, 0%, 0.1);
         --scrollbar-thumb-color-hover: hsla(0, 0%, 0%, 0.6);
         --scrollbar-track-margin: var(--padding-horizontal);

         display: flex;
         flex-direction: column;
         align-items: stretch;

         background-color: white;

         & > * {
            display: flex;
            flex-direction: row;
            padding: 0.8em;

            background: none;
            border: none;
            font-size: 1em;
            cursor: pointer;

            &:hover {
               background: hsla(0, 0%, 0%, 0.1);
            }
         }
      }
   }
</style>
