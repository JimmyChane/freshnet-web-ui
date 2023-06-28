<script>
   import { format, formatDistanceToNow } from "date-fns";
   import Method from "@/items/ServiceEventMethod";
   import MenuOption from "@/components/button/MenuOption.vue";
   import ImageView from "@/components/ImageView.vue";
   // import WindowUpdateEventDescription from "./WindowUpdateEventDescription.vue";

   export default {
      components: { MenuOption, ImageView },
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
         images: (c) => c.item.images,

         methodPrimaryColor: (c) => c.methodContext("primaryColor") ?? "",
         methodTitle: (c) => c.methodContext("title") ?? "",
         methodResult: (c) => c.item.toResult() ?? "",

         infoTexts: (c) => [c.timestampText, c.methodTitle, c.nameOfUser],

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
            if (this.item.isInfo()) return Method.INFO[property];
            if (this.item.isQuotation()) return Method.QUOTATION[property];
            if (this.item.isPurchase()) return Method.PURCHASE[property];
            return null;
         },

         // clickEditDescription() {
         //    this.store.dispatch("openPopupWindow", {
         //       component: WindowUpdateEventDescription,
         //       serviceEvent: this.item,
         //    });
         // },
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
      <div class="ItemEvent-main">
         <div class="ItemEvent-left">
            <div class="ItemEvent-infos">
               <span v-for="info of infoTexts" :key="info"
                  >{{ info }}
                  <div
                     class="ItemService-dot"
                     v-if="infoTexts.indexOf(info) < infoTexts.length - 1"
                  ></div
               ></span>
            </div>

            <span class="ItemEvent-description">{{ description }}</span>

            <span
               :class="['ItemEvent-result', 'transition']"
               v-if="methodResult"
               >{{ methodResult }}</span
            >
         </div>

         <div class="ItemEvent-right">
            <MenuOption
               class="ItemEvent-menu"
               :menus="[
                  // {
                  //    title: 'Edit Description (test)',
                  //    click: () => clickEditDescription(),
                  // },
                  // {
                  //    title: 'Add Image (test)',
                  //    click: () => {},
                  // },
                  {
                     title: 'Delete Event',
                     icon: host.icon('trash-000000'),
                     click: () => $emit('callback-delete', item),
                  },
               ]"
               @show="() => (isShowingMenu = true)"
               @hide="() => (isShowingMenu = false)"
            />
         </div>
      </div>

      <div class="ItemEvent-images scrollbar" v-if="images.length">
         <ImageView
            v-for="image of images"
            :key="image.name"
            :src="image"
            @click="
               () => {
                  store.dispatch('imageViewerShow', {
                     image,
                     thumbnails: images,
                  });
               }
            "
         />
      </div>
   </div>
</template>

<style lang="scss" scoped>
   .ItemEvent {
      display: flex;
      flex-direction: column;
      align-items: stretch;
      justify-content: flex-start;
      background: hsla(0, 0%, 100%, 0.6);
      border-bottom: 1px solid hsla(0, 0%, 0%, 0.1);
      border-left: 3px solid var(--primary-color);

      --body-padding: 0.6rem;

      .ItemEvent-main {
         --min-height: 3.5rem;

         min-height: var(--min-height);
         display: flex;
         flex-direction: row;
         border-radius: var(--border-radius) 0 0 var(--border-radius);
         overflow: hidden;

         .ItemEvent-left {
            min-height: var(--min-height);
            padding: var(--body-padding);
            gap: 0.2rem;
            display: flex;
            flex-direction: column;
            flex-grow: 1;
            justify-content: center;

            .ItemEvent-infos {
               display: flex;
               flex-direction: row;
               align-items: center;
               justify-content: flex-start;
               font-size: 0.7rem;
               color: hsla(0, 0%, 0%, 0.8);
               & > * {
                  min-width: max-content;
                  width: max-content;
                  display: flex;
                  flex-direction: row;
                  align-items: center;
               }
               .ItemService-dot {
                  width: 3px;
                  height: 3px;
                  margin: 0 0.5rem;
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
            .ItemEvent-result {
               width: max-content;

               display: flex;
               align-items: center;
               justify-content: center;

               background: var(--primary-color);
               color: white;
               text-align: center;
               font-size: 0.7rem;
               padding: 0.4em;
               border-radius: 0.3em;

               transition-timing-function: cubic-bezier(1, 0, 0, 1);
            }
         }

         .ItemEvent-right {
            height: var(--min-height);
            display: flex;
            flex-direction: row;
            align-items: center;
            padding: 0.4rem 0.8rem;
            gap: 0.8rem;
            border-radius: 0 var(--border-radius) var(--border-radius) 0;

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
      }
      .ItemEvent-images {
         --padding: var(--body-padding);
         --image-height: 60px;

         padding: var(--padding);
         padding-top: 0;
         height: calc(var(--image-height) + var(--padding));
         display: flex;
         flex-direction: row;
         gap: 1px;

         overflow-x: auto;

         & > * {
            height: var(--image-height);
            width: max-content;
            border-radius: 0.3em;
         }
      }
   }
</style>
