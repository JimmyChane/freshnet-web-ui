<script>
   import ButtonIcon from "@/components/button/ButtonIcon.vue";

   export default {
      components: { ButtonIcon },
      props: {
         item: { type: Object, default: () => null },
         isSelectedDark: { type: Boolean, default: true },
         isWide: { type: Boolean, default: true },
      },
      computed: {
         icon: (c) => {
            if (!c.item || !c.item.icon) return null;
            return c.item.icon;
         },
         iconLight: (c) => (c.icon ? c.icon.light : ""),
         iconDark: (c) => (c.icon ? c.icon.dark : ""),
         iconUrl: (c) => {
            if (!c.isSelected) return c.iconDark;
            if (c.isSelectedDark) return c.iconLight;
            return c.iconDark;
         },
         title: (c) => {
            const title = c.item.title;
            if (c.isWide) return title;
            return title.substring(0, 1);
         },

         isSelected: (c) => c.item.isSelected(),
      },
   };
</script>

<template>
   <div :class="['LeftNavItem', `LeftNavItem-${isWide ? 'isWide' : 'isThin'}`]">
      <img class="LeftNavItem-icon" v-if="iconUrl" :src="iconUrl" />
      <span class="LeftNavItem-title" v-if="iconUrl ? isWide && title : true">{{
         title
      }}</span>
   </div>
</template>

<style lang="scss" scoped>
   .LeftNavItem {
      border: none;
      text-align: center;
      font-size: 1em;
      background: none;
      display: flex;
      flex-direction: row;
      gap: 1em;

      .LeftNavItem-icon {
         --size: 1.2em;
         width: var(--size);
         height: var(--size);
         min-width: var(--size);
         min-height: var(--size);
         max-width: var(--size);
         max-height: var(--size);
         object-fit: scale-down;
      }
      .LeftNavItem-title {
         --size: 1.2em;
         flex-grow: 1;
         min-height: var(--size);
         text-align: start;
         font-size: 1em;
         font-weight: 600;
         line-height: 1.2;
         color: inherit;

         display: flex;
         flex-direction: row;
         align-items: center;
      }
   }

   .LeftNavItem-isWide {
      width: 100%;
      justify-content: space-between;
   }
   .LeftNavItem-isThin {
      align-items: center;
      justify-content: center;
      .LeftNavItem-title {
         width: var(--size);
         height: var(--size);
         min-width: var(--size);
         min-height: var(--size);
         max-width: var(--size);
         max-height: var(--size);
         align-items: center;
         justify-content: center;
      }
   }
</style>
