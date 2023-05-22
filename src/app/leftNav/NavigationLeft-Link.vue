<script>
   import ButtonIcon from "@/components/button/ButtonIcon.vue";
   import LeftNavItem from "./NavigationLeft-Item.vue";

   export default {
      emits: ["click", "click-expand"],
      components: { LeftNavItem, ButtonIcon },
      props: {
         item: { type: Object, default: () => null },
         href: { type: String, default: "" },
         hasGroup2s: { type: Boolean, default: false },
         isSelectedDark: { type: Boolean, default: true },
      },
      computed: {
         iconArrow: (c) => {
            if (c.isSelected && c.isSelectedDark)
               return c.host.icon("arrowDown-FFFFFF");
            return c.host.icon("arrowDown-2A4858");
         },
         styleClass: (c) => {
            if (c.isSelected) {
               if (c.isSelectedDark) return "LeftNavLink-isSelectedDark";
               return "LeftNavLink-isSelected";
            }
            return "LeftNavLink-notSelected";
         },
         hasGroups: (c) => {
            const groups = c.item;
            return Array.isArray(groups) && groups.length;
         },

         isWide: (c) => c.item.isWide(),
         isSelected: (c) => c.item.isSelected(),
         isExpanded: (c) => c.item.isExpanded(),
      },
   };
</script>

<template>
   <router-link
      :class="['LeftNavLink', styleClass]"
      :isWide="`${isWide}`"
      :isExpand="`${isSelected && isExpanded}`"
      :hasGroup2IsSelected="`${hasGroup2s && isSelected}`"
      :to="{ path: href }"
      @click="$emit('click', item)"
   >
      <div class="LeftNavLink-body transition">
         <div class="LeftNavLink-item-parent">
            <LeftNavItem
               class="LeftNavLink-item"
               :item="item"
               :isSelectedDark="isSelectedDark"
               :isWide="isWide"
            />
         </div>

         <div class="LeftNavLink-arrow" v-if="isWide && hasGroups">
            <ButtonIcon
               class="LeftNavLink-arrow-button"
               :src="iconArrow"
               @click="$emit('click-open', item)"
            />
         </div>
      </div>
   </router-link>
</template>

<style lang="scss" scoped>
   .LeftNavLink {
      width: 100%;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      text-decoration: none;
      background: none;
      border: none;
      text-align: start;
      padding: 0.1em 0.4em;
      .LeftNavLink-body {
         display: flex;
         flex-direction: row;
         align-items: center;
         justify-content: flex-start;
         text-decoration: none;
         background: none;
         border: none;
         position: relative;
         .LeftNavLink-item-parent {
            height: fit-content;
            width: 100%;
            display: flex;
            flex-grow: 1;
            flex-direction: row;
            align-items: center;
            justify-content: flex-start;
            padding: 0.7rem 1rem;
         }
         .LeftNavLink-arrow {
            flex-grow: 0;
            position: absolute;
            right: 0.5rem;
            font-size: 0.6rem;
         }
      }
   }

   .LeftNavLink-isSelected {
      cursor: default;
      .LeftNavLink-body {
         background: var(--primary-color);
         background: hsla(0, 0%, 0%, 0.1);
         .LeftNavLink-item-parent {
            color: #2a4858;
            color: black;
         }
         .LeftNavLink-arrow {
            pointer-events: none;
         }
      }
   }
   .LeftNavLink-notSelected {
      cursor: pointer;
      &:hover,
      &:focus {
         .LeftNavLink-body {
            box-shadow: var(--default-box-shadow);
            background: hsl(211, 33%, 85%);
            background: hsla(0, 0%, 0%, 0.1);
         }
      }
      .LeftNavLink-body {
         .LeftNavLink-item-parent {
            color: #2a4858;
            color: black;
         }
         .LeftNavLink-arrow {
            .LeftNavLink-arrow-button {
               transform: rotate(-90deg);
            }
         }
      }
   }

   .LeftNavLink-isSelectedDark {
      cursor: default;
      .LeftNavLink-body {
         background: var(--primary-color);
         background: hsla(0, 0%, 0%, 0.8);
         .LeftNavLink-item-parent {
            color: white;
         }
      }
   }

   .LeftNavLink[isWide="true"] {
      .LeftNavLink-body {
         width: 100%;
         border-radius: 0.5em;
         .LeftNavLink-item-parent {
            padding-right: 3rem;
         }
      }
   }
   .LeftNavLink[isWide="false"] {
      .LeftNavLink-body {
         border-radius: 0.5rem;
         align-items: center;
         justify-content: center;
         .LeftNavLink-item-parent {
            width: min-content;
            align-items: center;
            justify-content: center;
            padding: 0.7rem;
         }
      }
   }

   .LeftNavLink[isExpand="true"] {
      .LeftNavLink-body {
         background: #d9dbdd;
         .LeftNavLink-arrow {
            .LeftNavLink-arrow-button {
               transform: rotate(0deg);
            }
         }
      }
   }

   .LeftNavLink[hasGroup2IsSelected="true"] {
      width: 100%;
      border-radius: 0;
      padding: 0;
      .LeftNavLink-body {
         width: 100%;
         border-radius: 0;
      }
   }
</style>
