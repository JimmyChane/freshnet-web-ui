<script>
   import U from "@/U";
   import chroma from "chroma-js";

   export default {
      props: {
         menu: { type: Object },
         primaryColorBackgroundHover: { type: chroma.Color },
         primaryColorBackgroundSelected: { type: chroma.Color },
      },
      computed: {
         icon: (c) => c.menu.icon,
         title: (c) => c.menu.title,
         isSelected: (c) => {
            if (typeof c.menu.isSelected !== "function") return false;
            return c.menu.isSelected();
         },
         hasIcon: (c) => {
            if (U.isString(c.icon)) return c.icon.length > 0;
            return !c;
         },
      },
   };
</script>

<template>
   <button
      :class="[
         'transition',
         'PopupMenu-Item',
         isSelected ? 'PopupMenu-Item-isSelected' : 'PopupMenu-Item-isDeselected',
      ]"
      :style="{
         '--primary-color-hover': primaryColorBackgroundHover,
         '--primary-color-isSelected': primaryColorBackgroundSelected,
      }"
      @click="() => $emit('click', menu)"
   >
      <img v-if="hasIcon" :src="icon" :alt="`Icon ${title}`" />
      <span>{{ title }}</span>
   </button>
</template>

<style lang="scss" scoped>
   .PopupMenu-Item {
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      align-items: center;

      background: none;
      border: none;
      font-size: 0.9em;
      font-weight: 600;

      width: 100%;
      height: max-content;
      min-width: 100%;
      min-height: max-content;
      padding: 1em 1.2em;
      gap: 1em;

      img {
         --icon-size: 1em;
         width: var(--icon-size);
         height: var(--icon-size);
         max-width: initial;
         max-height: initial;
      }
      span {
         flex-grow: 1;
         min-width: max-content;
         height: max-content;
         min-height: max-content;
         text-align: start;
         color: black;
      }
   }

   .PopupMenu-Item-isDeselected {
      cursor: pointer;
      &:hover {
         background: hsla(0, 0%, 0%, 0.1);
         background: var(--primary-color-hover);
      }
   }
   .PopupMenu-Item-isSelected {
      background: hsla(0, 0%, 0%, 0.2);
      background: var(--primary-color-isSelected);
   }
</style>
