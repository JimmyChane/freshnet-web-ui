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
         href: (c) => U.optString(c.menu.href),
         target: (c) => U.optString(c.menu.target),
         to: (c) => c.menu.to,

         isSelected: (c) => {
            return U.isFunction(c.menu.isSelected) && c.menu.isSelected();
         },
         hasIcon: (c) => U.optString(c.icon).length > 0,
      },
   };
</script>

<template>
   <a
      v-if="href.length"
      :class="['transition', 'PopupMenu-Item']"
      :style="{
         '--primary-color-hover': primaryColorBackgroundHover,
         '--primary-color-isSelected': primaryColorBackgroundSelected,
      }"
      :isSelected="`${isSelected}`"
      :href="href"
      :target="target"
      @click="() => $emit('click', menu)"
   >
      <img v-if="hasIcon" :src="icon" :alt="`Icon ${title}`" />
      <span>{{ title }}</span>
   </a>

   <router-link
      v-else-if="to !== undefined"
      :class="['transition', 'PopupMenu-Item']"
      :style="{
         '--primary-color-hover': primaryColorBackgroundHover,
         '--primary-color-isSelected': primaryColorBackgroundSelected,
      }"
      :isSelected="`${isSelected}`"
      :to="to"
      @click="() => $emit('click', menu)"
   >
      <img v-if="hasIcon" :src="icon" :alt="`Icon ${title}`" />
      <span>{{ title }}</span>
   </router-link>

   <button
      v-else
      :class="['transition', 'PopupMenu-Item']"
      :style="{
         '--primary-color-hover': primaryColorBackgroundHover,
         '--primary-color-isSelected': primaryColorBackgroundSelected,
      }"
      :isSelected="`${isSelected}`"
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
      text-align: inherit;
      text-decoration: none;

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
         color: black;
      }
   }
   .PopupMenu-Item[isSelected="false"] {
      cursor: pointer;
      &:hover {
         background: hsla(0, 0%, 0%, 0.1);
         background: var(--primary-color-hover);
      }
   }
   .PopupMenu-Item[isSelected="true"] {
      background: hsla(0, 0%, 0%, 0.2);
      background: var(--primary-color-isSelected);
   }
</style>
