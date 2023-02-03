<script>
   import ButtonIcon from "@/components/button/ButtonIcon.vue";
   import LeftNavItem from "./LeftNav-Item.vue";

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
         iconArrow() {
            if (this.isSelected && this.isSelectedDark)
               return this.host.res("icon/arrowDown-FFFFFF.svg");
            return this.host.res("icon/arrowDown-2A4858.svg");
         },
         styleClass() {
            if (this.isSelected) {
               if (this.isSelectedDark) return "LeftNavQuery-isSelectedDark";
               return "LeftNavQuery-isSelected";
            }
            return "LeftNavQuery-notSelected";
         },

         hasGroups() {
            return Array.isArray(this.item.groups) && this.item.groups.length;
         },

         isWide: (context) => context.item.isWide(),
         isSelected: (context) => context.item.isSelected(),
         isExpanded: (context) => context.item.isExpanded(),
      },
   };
</script>

<template>
   <button
      :class="[
         'LeftNavQuery',
         styleClass,
         `LeftNavQuery-${isWide ? 'isWide' : 'isThin'}`,
         isSelected && isExpanded ? 'LeftNavQuery-isExpanded' : '',
         hasGroup2s && isSelected ? 'LeftNavQuery-hasGroup2s-isSelected' : '',
      ]"
      @click="$emit('click', item)"
   >
      <div class="LeftNavQuery-body transition">
         <div class="LeftNavQuery-item-parent">
            <LeftNavItem
               class="LeftNavQuery-item"
               :item="item"
               :isSelectedDark="isSelectedDark"
               :isWide="isWide"
            />
         </div>

         <div class="LeftNavQuery-arrow" v-if="isWide && hasGroups">
            <ButtonIcon
               :class="[
                  'LeftNavQuery-arrow-button',
                  `LeftNavQuery-arrow-button-${
                     !isSelected && isExpanded ? 'isExpanded' : 'isCollapsed'
                  }`,
               ]"
               :src="iconArrow"
               @click="$emit('click-open', item)"
            />
         </div>
      </div>
   </button>
</template>

<style lang="scss" scoped>
   .LeftNavQuery {
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
      .LeftNavQuery-body {
         display: flex;
         flex-direction: row;
         align-items: center;
         justify-content: flex-start;
         text-decoration: none;
         background: none;
         border: none;
         position: relative;
         .LeftNavQuery-item-parent {
            height: fit-content;
            width: 100%;
            display: flex;
            flex-grow: 1;
            flex-direction: row;
            align-items: center;
            justify-content: flex-start;
            padding: 0.7rem 1rem;
         }
         .LeftNavQuery-arrow {
            flex-grow: 0;
            position: absolute;
            right: 0.5rem;
            font-size: 0.6rem;
         }
      }
   }

   .LeftNavQuery-isSelected {
      cursor: default;
      .LeftNavQuery-body {
         background: var(--primary-color);
         .LeftNavQuery-item-parent {
            color: #2a4858;
         }
         .LeftNavQuery-arrow {
            pointer-events: none;
         }
      }
   }
   .LeftNavQuery-notSelected {
      cursor: pointer;
      &:hover,
      &:focus {
         .LeftNavQuery-body {
            box-shadow: var(--default-box-shadow);
            background: #cdd9e6;
         }
      }
      .LeftNavQuery-body {
         .LeftNavQuery-item-parent {
            color: #2a4858;
         }
         .LeftNavQuery-arrow {
            .LeftNavQuery-arrow-button {
               transform: rotate(-90deg);
            }
         }
      }
   }

   .LeftNavQuery-isSelectedDark {
      cursor: default;
      .LeftNavQuery-body {
         background: var(--primary-color);
         .LeftNavQuery-item-parent {
            color: white;
         }
      }
   }

   .LeftNavQuery-isWide {
      .LeftNavQuery-body {
         width: 100%;
         border-radius: 0.5em;
         .LeftNavQuery-item-parent {
            padding-right: 3rem;
         }
      }
   }
   .LeftNavQuery-isThin {
      .LeftNavQuery-body {
         border-radius: 50%;
         align-items: center;
         justify-content: center;
         .LeftNavQuery-item-parent {
            width: min-content;
            align-items: center;
            justify-content: center;
            padding: 0.7rem;
         }
      }
   }

   .LeftNavQuery-isExpanded {
      .LeftNavQuery-body {
         background: #d9dbdd;
         .LeftNavQuery-arrow {
            .LeftNavQuery-arrow-button {
               transform: rotate(0deg);
            }
         }
      }
   }

   .LeftNavQuery-hasGroup2s-isSelected {
      width: 100%;
      border-radius: 0;
      padding: 0;
      .LeftNavQuery-body {
         width: 100%;
         border-radius: 0;
      }
   }
</style>
