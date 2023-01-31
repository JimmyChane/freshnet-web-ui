<script>
   const State = { Expand: 1, Collapse: 2 };

   import chroma from "chroma-js"; // https://gka.github.io/chroma.js/

   export default {
      State,

      props: {
         primaryColor: { type: chroma, default: () => chroma("2ead87") },
         title: { type: String, default: "" },
         menu: { type: Object, default: () => null },
         menus: { default: () => [] },
      },
      data() {
         return { state: State.Collapse };
      },
      computed: {
         parsedMenus() {
            const menus = Array.isArray(this.menus) ? this.menus : [this.menus];
            return menus.filter((menu) => {
               return typeof menu === "object" && menu !== null;
            });
         },
         isExpand: (c) => c.state === State.Expand,

         menuKey: (c) => (c.menu ? c.menu.key : ""),
         menuTitle: (c) => (c.menu ? c.menu.title : ""),
         menuIcon: (c) => (c.menu ? c.menu.icon : ""),

         primaryColorBackground: (c) => c.primaryColor.mix("ffffff", 0.8),
         primaryColorBackgroundHover: (c) => c.primaryColor.mix("ffffff", 0.6),
         primaryColorBackgroundSelected: (c) =>
            c.primaryColor.mix("ffffff", 0.4),
      },
      methods: {
         toggle() {
            this.isExpand ? this.collapse() : this.expand();
         },
         expand() {
            this.state = State.Expand;
         },
         collapse(timeout = 0) {
            if (timeout > 0) {
               setTimeout(() => this.collapse(), timeout);
               return;
            }
            this.state = State.Collapse;
         },
      },
   };
</script>

<template>
   <div
      :class="[
         'LabelMenus',
         `LabelMenus-${isExpand ? 'isExpand' : 'isCollapse'}`,
      ]"
      :style="{ '--primary-color': primaryColor.toString() }"
   >
      <button
         class="LabelMenus-main"
         @click="() => toggle()"
         @blur="() => collapse(200)"
      >
         <span class="LabelMenus-title">{{ title }}</span>
         <span class="LabelMenus-content">
            <img
               class="LabelMenus-content-icon"
               v-if="menuIcon"
               :src="menuIcon"
            />
            {{ menuTitle }}</span
         >
         <img
            class="LabelMenus-arrow"
            :src="host.res('icon/arrowDown-505050.svg')"
         />
      </button>

      <div class="LabelMenus-drop">
         <div
            class="LabelMenus-menus scrollbar"
            :style="{ 'background-color': primaryColorBackground }"
         >
            <button
               class="LabelMenus-menu"
               :style="{
                  '--background-color-hover': primaryColorBackgroundHover,
                  '--background-color-selected': primaryColorBackgroundSelected,
               }"
               :key="menu.title"
               v-for="menu in parsedMenus"
               :class="[
                  menu.key === menuKey
                     ? 'LabelMenus-menu-isSelected'
                     : 'LabelMenus-menu-isDeselected',
               ]"
               @click="() => menu.click(menu)"
            >
               <img
                  class="LabelMenus-menu-icon"
                  v-if="menu.icon"
                  :src="menu.icon ? menu.icon : ''"
               />
               <span>{{ menu.title }}</span>
            </button>
         </div>
      </div>
   </div>
</template>

<style lang="scss" scoped>
   .LabelMenus {
      --primary-color: #2ead87;
      --border-radius: 1rem;

      width: max-content;
      position: relative;
      overflow: visible;
      border: 1px solid var(--primary-color);
      border-radius: var(--border-radius);

      .LabelMenus-main {
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

         .LabelMenus-title {
            min-width: max-content;
            background-color: var(--primary-color);
            padding: 0.4rem 0.6rem;
            color: white;
            font-size: 0.8rem;
            font-weight: 600;
            border-radius: var(--border-radius) 0 0 var(--border-radius);
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

            transition: var(--transition-duration);
         }
      }

      .LabelMenus-drop {
         z-index: 2;
         width: max-content;
         min-width: 100%;
         max-height: 25rem;

         display: flex;
         transform: translateY(-1.25rem);
         transition: var(--transition-duration) cubic-bezier(1, 0, 0, 1);
         position: absolute;
         overflow: hidden;
         border-radius: var(--border-radius);
         box-shadow: 0 0 0.5rem 0 hsla(0, 0%, 30%, 0.7);
         // border: 1px solid hsla(0, 0%, 30%, 0.7);
         background-color: white;

         .LabelMenus-menus {
            width: max-content;
            min-width: 100%;
            max-height: 25rem;
            padding: 0.625rem 0;

            display: flex;
            flex-direction: column;
            overflow-y: auto;

            --scrollbar-size: 0.3rem;
            --scrollbar-thumb-color: hsla(0, 0%, 0%, 0.2);
            --scrollbar-thumb-color-hover: hsla(0, 0%, 0%, 0.2);
            --scrollbar-track-color: hsla(0, 0%, 0%, 0.08);
            --scrollbar-track-color-hover: hsla(0, 0%, 0%, 0.1);

            .LabelMenus-menu {
               width: 100%;
               display: flex;
               flex-direction: row;
               flex-wrap: wrap;
               align-items: center;

               row-gap: 0.1;
               column-gap: 0.5rem;
               padding: 0.8rem 1.2rem;
               transition: var(--transition-duration);
               border: none;
               background: none;
               text-align: start;
               font-size: 0.8rem;
               font-weight: 600;

               --background-color-hover: hsl(0, 0%, 90%);
               --background-color-selected: hsl(0, 0%, 70%);

               .LabelMenus-menu-icon {
                  height: 12px;
               }
            }

            .LabelMenus-menu-isSelected {
               background-color: var(--background-color-selected);
            }
            .LabelMenus-menu-isDeselected {
               cursor: pointer;
               &:hover,
               &:focus {
                  background-color: var(--background-color-hover);
               }
            }
         }
      }
   }
   .LabelMenus-isExpand {
      .LabelMenus-main {
         .LabelMenus-arrow {
            transform: rotate(360deg);
         }
      }
      .LabelMenus-drop {
         transform: translateY(0.25rem);
         opacity: 1;
      }
   }
   .LabelMenus-isCollapse {
      .LabelMenus-main {
         .LabelMenus-arrow {
            transform: rotate(180deg);
         }
      }
      .LabelMenus-drop {
         transform: translateY(-1.25rem);
         pointer-events: none;
         opacity: 0;
      }
   }
</style>
