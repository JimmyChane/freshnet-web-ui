<script>
   const State = { Expand: 1, Collapse: 2 };

   import chroma from "chroma-js"; // https://gka.github.io/chroma.js/
   import Menu from "@/components/Menu.vue";

   export default {
      State,

      components: { Menu },
      props: {
         primaryColor: { type: chroma, default: () => chroma("2ead87") },
         title: { type: String, default: "" },
         menu: { type: Object, default: () => null },
         menus: { default: () => [] },
      },
      data: (c) => ({ isExpand: false }),
      computed: {
         menuCorner: () => Menu.Corner.BOTTOM,
         menuWidth: () => Menu.Width.SAME,

         parsedMenus() {
            const menus = Array.isArray(this.menus) ? this.menus : [this.menus];
            return menus
               .filter((menu) => {
                  return typeof menu === "object" && menu !== null;
               })
               .map((menu) => {
                  menu.isSelected = () => this.menu === menu;
                  return menu;
               });
         },

         menuKey: (c) => (c.menu ? c.menu.key : ""),
         menuTitle: (c) => (c.menu ? c.menu.title : ""),
         menuIcon: (c) => (c.menu ? c.menu.icon : ""),

         primaryColorBackground: (c) => c.primaryColor.mix("ffffff", 0.8),
         primaryColorBackgroundHover: (c) => c.primaryColor.mix("ffffff", 0.6),
         primaryColorBackgroundSelected: (c) => c.primaryColor.mix("ffffff", 0.4),
      },
   };
</script>

<template>
   <div>
      <Menu
         :class="[
            'transition',
            'LabelMenus',
            `LabelMenus-${isExpand ? 'isExpand' : 'isCollapse'}`,
         ]"
         :style="{ '--primary-color': primaryColor.toString() }"
         :menus="parsedMenus"
         :corner="menuCorner"
         :width="menuWidth"
         :primaryColor="primaryColor"
         @show="() => (isExpand = true)"
         @hide="() => (isExpand = false)"
      >
         <span class="LabelMenus-title">{{ title }}</span>
         <span class="LabelMenus-content">
            <img class="LabelMenus-content-icon" v-if="menuIcon" :src="menuIcon" />
            {{ menuTitle }}</span
         >
         <img class="LabelMenus-arrow transition" :src="host.icon('arrowDown-505050')" />
      </Menu>
   </div>
</template>

<style lang="scss" scoped>
   .LabelMenus {
      --primary-color: #2ead87;
      --border-radius: 1rem;

      width: max-content;
      position: relative;
      overflow: visible;

      width: max-content;
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      align-items: stretch;
      justify-content: stretch;
      position: relative;

      z-index: 1;
      border: none;
      background: none;
      cursor: pointer;
      border: 1px solid var(--primary-color);
      border-radius: var(--border-radius);
      --transition-duration: 100ms;
      background-color: var(--primary-color);

      &:hover,
      &:focus {
         transform: scale(1.02);
      }

      .LabelMenus-title {
         min-width: max-content;
         padding: 0.4rem 0.6rem;
         color: white;
         font-size: 0.8rem;
         font-weight: 600;
         border-radius: var(--border-radius) 0 0 var(--border-radius);
         margin: -1px;
      }
      .LabelMenus-content {
         min-width: max-content;
         background-color: white;
         padding: 0.4rem 1.2rem;
         font-size: 0.8rem;
         font-weight: 600;
         border-radius: 0 var(--border-radius) var(--border-radius) 0;
         color: black;
         display: flex;
         flex-direction: row;
         align-items: center;
         justify-content: center;
         gap: 0.4rem;

         .LabelMenus-content-icon {
            height: 12px;
         }
      }
      .LabelMenus-arrow {
         --size: 5px;
         width: var(--size);
         height: var(--size);
         position: absolute;
         top: calc(50% - var(--size) * 0.5);
         bottom: 0;
         right: calc(var(--size) * 1.5);
      }
   }
   .LabelMenus-isExpand {
      .LabelMenus-arrow {
         transform: rotate(360deg);
      }
   }
   .LabelMenus-isCollapse {
      .LabelMenus-arrow {
         transform: rotate(180deg);
      }
   }
</style>
