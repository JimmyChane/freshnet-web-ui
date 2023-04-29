<script>
   import { format, formatDistanceToNow } from "date-fns";
   import MenuOption from "@/components/button/MenuOption.vue";

   const stateContext = {
      info: { title: "Info", primaryColor: "#0771d2" /* blue */ },
      quotation: { title: "Quotation", primaryColor: "#961d96" /* purple */ },
      purchase: { title: "Purchase", primaryColor: "#258915" /* green */ },
   };

   export default {
      components: { MenuOption },
      props: { item: { type: Object, default: null } },
      emits: ["callback-delete"],
      data: (c) => ({
         nameOfUser: "loading...",
         isShowingMenu: false,
         isHovered: false,
      }),
      computed: {
         timestampText: (c) => {
            const time = c.item?.timestamp?.time ?? null;
            if (!time) return "";

            const distance = formatDistanceToNow(time);
            const distanceText = `(${distance} ago)`;

            const timeText = format(time, "hh:mmaaa");

            return `${timeText} ${distanceText}`;
         },

         description: (c) => c.item.description,
         methodPrimaryColor: (c) => c.methodContext("primaryColor") ?? "",
         methodTitle: (c) => c.methodContext("title") ?? "",
         methodResult: (c) => c.item.toResult() ?? "",

         shouldShowMenu: (c) => c.isShowingMenu || c.isHovered,
      },
      watch: {
         item() {
            this.invalidate();
         },
      },
      mounted() {
         this.invalidate();
      },
      methods: {
         async invalidate() {
            const { item } = this;

            if (!item) return (this.nameOfUser = "");

            const name = await this.item.fetchName().catch((error) => {
               this.store.dispatch(
                  "snackbarShow",
                  "Error getting user for event",
               );
               return "";
            });

            if (this.item !== item) return;
            if (name) this.nameOfUser = name;
         },

         methodContext(property = "") {
            if (this.item.isInfo()) return stateContext.info[property];
            if (this.item.isQuotation())
               return stateContext.quotation[property];
            if (this.item.isPurchase()) return stateContext.purchase[property];
            return null;
         },
      },
   };
</script>

<template>
   <div
      class="ItemEvent"
      :style="{ '--primary-color': methodPrimaryColor, '--opacity': '1' }"
      @mouseenter="() => (isHovered = true)"
      @mouseleave="() => (isHovered = false)"
   >
      <div class="ItemEvent-left">
         <div class="ItemEvent-colorbar"></div>

         <div class="ItemEvent-middle">
            <span class="ItemEvent-description">{{ description }}</span>
            <div class="ItemEvent-header">
               <span class="ItemService-method">{{ methodTitle }}</span>

               <div
                  class="ItemService-header-dot"
                  v-if="timestampText && nameOfUser"
               ></div>

               <span class="ItemService-timestamp">{{ timestampText }}</span>

               <div
                  class="ItemService-header-dot"
                  v-if="timestampText && nameOfUser"
               ></div>

               <span class="ItemEvent-user" v-if="nameOfUser">{{
                  nameOfUser
               }}</span>
            </div>
         </div>
      </div>

      <div
         :class="[
            'ItemEvent-right',
            shouldShowMenu
               ? 'ItemEvent-right-isShow'
               : 'ItemEvent-right-isHide',
         ]"
      >
         <span
            :class="['ItemEvent-result', 'transition']"
            v-if="methodResult"
            >{{ methodResult }}</span
         >

         <MenuOption
            class="ItemEvent-menu"
            :menus="{
               key: 'delete',
               title: 'Delete',
               icon: host.icon('page/service/rejected-color'),
               click: () => $emit('callback-delete', item),
            }"
            @show="() => (isShowingMenu = true)"
            @hide="() => (isShowingMenu = false)"
         />
      </div>
   </div>
</template>

<style lang="scss" scoped>
   .ItemEvent {
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      background-color: hsla(0, 0%, 100%, 0.6);
      border-radius: var(--border-radius);
      border-bottom: 1px solid hsla(0, 0%, 0%, 0.1);
      overflow: hidden;

      .ItemEvent-left {
         display: flex;
         flex-direction: row;
         flex-wrap: nowrap;
         flex-grow: 1;
         border-radius: var(--border-radius) 0 0 var(--border-radius);
         overflow: hidden;

         .ItemEvent-colorbar {
            background-color: var(--primary-color);
            height: 100%;
            --width: 3px;
            width: var(--width);
            min-width: var(--width);
            max-width: var(--width);
         }
         .ItemEvent-middle {
            padding: 0.6rem;
            gap: 0.2rem;
            display: flex;
            flex-direction: column;
            flex-grow: 1;
            justify-content: center;

            .ItemEvent-header {
               display: flex;
               flex-direction: row;
               align-items: center;
               justify-content: flex-start;
               gap: 0.5rem;
               font-size: 0.7rem;
               color: hsla(0, 0%, 0%, 0.8);
               & > * {
                  min-width: max-content;
                  width: max-content;
               }
               .ItemService-header-dot {
                  width: 3px;
                  height: 3px;
                  background: hsla(0, 0%, 0%, 0.5);
                  border-radius: 50%;
               }
            }

            .ItemEvent-description {
               width: 100%;
               line-height: 1.1;
               font-size: 1rem;
               white-space: pre-line;
            }
         }
      }
      .ItemEvent-right {
         display: flex;
         flex-direction: row;
         align-items: center;
         flex-wrap: nowrap;
         padding: 0.4rem 0.8rem;
         gap: 0.8rem;
         border-radius: 0 var(--border-radius) var(--border-radius) 0;

         .ItemEvent-result {
            width: max-content;
            max-width: 8rem;

            display: flex;
            align-items: center;
            justify-content: center;

            background: var(--primary-color);
            color: white;
            text-align: center;
            font-size: 0.8rem;
            padding: 0.4rem;
            border-radius: 0.3rem;

            transition-timing-function: cubic-bezier(1, 0, 0, 1);
         }
         .ItemEvent-menu {
            border-radius: 50%;
            .ItemEvent-menu-icon {
               z-index: 0;
               width: 1.2em;
               height: 1.2em;
               display: flex;
               flex-direction: column;
               align-items: center;
               justify-content: center;
            }
         }
      }
      .ItemEvent-right-isShow {
         .ItemEvent-result {
            z-index: 1;
            margin-right: 0;
         }
         .ItemEvent-menu {
            z-index: 100;
            opacity: 1;
         }
      }
      .ItemEvent-right-isHide {
         .ItemEvent-result {
            z-index: 2;
            margin-right: -3.3rem;
         }
         .ItemEvent-menu {
            z-index: 1;
            opacity: 0;
         }
      }
   }
</style>
