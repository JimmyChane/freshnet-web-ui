<script>
   import chroma from "chroma-js";
   import Menu from "@/components/Menu.vue";
   import ModuleEvent from "@/items/data/ServiceEvent.js";
   import TextArea from "@/components/InputTextArea.vue";
   import AddImage from "./PanelService-AddEvent-AddImage.vue";

   export default {
      components: { Menu, TextArea, AddImage },
      data: (c) => ({
         ModuleEvent,

         nameOfUser: "unknown",
         eventMethod: ModuleEvent.Method.Quotation,
         eventDescription: "",
         eventStatus: "",
         eventAmount: 0,

         eventImages: [],
         eventImagePreviews: [],
      }),
      computed: {
         primaryColor: (c) => c.methodMenu.color,
         primaryColor1: (c) => c.primaryColor.mix("ffffff", 0.45),
         primaryColor2: (c) => c.primaryColor.mix("ffffff", 0.6),

         isMethodInfo: (c) => c.eventMethod === ModuleEvent.Method.Info,
         isMethodQuotation: (c) =>
            c.eventMethod === ModuleEvent.Method.Quotation,
         isMethodPurchase: (c) => c.eventMethod === ModuleEvent.Method.Purchase,

         methodMenu: (c) =>
            c.methodMenus.find((menu) => menu.key === c.eventMethod),
         methodMenus: (c) => [
            {
               key: ModuleEvent.Method.Quotation,
               title: "Quotation",
               color: chroma("961d96"),
               click: (menu) => {
                  c.eventMethod = menu.key;
                  c.invalidateMethod();
               },
            },
            {
               key: ModuleEvent.Method.Purchase,
               title: "Purchase",
               color: chroma("258915"),
               click: (menu) => {
                  c.eventMethod = menu.key;
                  c.invalidateMethod();
               },
            },
         ],
         methodMenuCorner: () => Menu.Corner.BOTTOM,
         methodMenuWidth: () => Menu.Width.SAME,

         user: (c) => c.loginStore.getters.user,
         isUserDefault: (c) => {
            if (c.user.isTypeNone()) return false;
            const isUserAdmin = c.user.isTypeAdmin() && c.user.isDefault();
            const isUserStaff = c.user.isTypeStaff() && c.user.isDefault();
            return isUserAdmin || isUserStaff;
         },
         nameUserType: (c) => {
            if (c.user.isTypeAdmin()) return "Admin";
            if (c.user.isTypeStaff()) return "Staff";
            return "unknown";
         },
      },
      watch: {
         user() {
            this.invalidateUser();
         },
         nameOfUser() {
            if (this.nameOfUser.includes(" ")) {
               this.nameOfUser = this.nameOfUser.trim().replace(" ", "");
            }
         },
         eventMethod() {
            setTimeout(() => this.invalidateMethod(), 10);
         },
      },
      mounted() {
         this.clear();
      },
      methods: {
         invalidateMethod() {
            const { InputStatus, InputAmount } = this.$refs;
            if (this.isMethodInfo) InputStatus.focus();
            if (this.isMethodQuotation || this.isMethodPurchase)
               InputAmount.focus();
         },
         invalidateUser() {
            const user = this.user;
            if (!user.isTypeNone()) {
               this.nameOfUser = this.isUserDefault ? "" : user.name;
            }
         },

         toEvent() {
            const event = {
               timestamp: Date.now(),
               method: this.eventMethod,
               description: this.eventDescription,
            };

            if (this.isMethodInfo) {
               event.status = this.eventStatus;
               return event;
            }

            if (this.isMethodQuotation || this.isMethodPurchase) {
               event.price = { amount: this.eventAmount, currency: "RM" };
               return event;
            }

            return null;
         },

         clear() {
            this.nameOfUser = "";

            this.eventDescription = "";
            this.eventStatus = "";
            this.eventAmount = 0;
            this.eventImages = [];

            this.invalidateEventImages();
            this.invalidateUser();
         },
         submit() {
            if (this.isUserDefault && !this.nameOfUser.trim()) {
               this.store.dispatch(
                  "snackbarShow",
                  "You must specify your name",
               );
               return;
            }
            if (!this.eventDescription.trim()) {
               this.store.dispatch(
                  "snackbarShow",
                  'You must specify "Description"',
               );
               return;
            }

            let event = this.toEvent();
            if (this.isUserDefault && this.nameOfUser.trim()) {
               event.nameOfUser = this.nameOfUser;
            }

            // todo this.eventImages

            if (event) {
               this.$emit("click-submit", event);
               this.clear();
            }
         },

         focus() {
            setTimeout(() => {
               this.$refs.InputDescription.focus();
            }, 100);
         },

         onInputFile(event) {
            const { files } = event.target;

            for (const file of files) {
               const eventImage = this.eventImages.find((eventImage) => {
                  return eventImage.name === file.name;
               });

               if (!eventImage) this.eventImages.push(file);
            }

            this.invalidateEventImages();
         },
         async invalidateEventImages() {
            const promises = this.eventImages.map((eventImage) => {
               return new Promise((resolve) => {
                  const reader = new FileReader();
                  reader.onload = (event) => {
                     resolve(event.target.result);
                  };
                  reader.readAsDataURL(eventImage);
               });
            });

            const results = await Promise.allSettled(promises);
            this.eventImagePreviews = results.map((result) => result.value);
         },
      },
   };
</script>

<template>
   <div
      class="AddEvent"
      :style="{
         '--primary-color': primaryColor,
         '--primary-color-1': primaryColor1,
         '--primary-color-2': primaryColor2,
      }"
   >
      <span class="AddEvent-header" :style="{ 'grid-area': 'header' }"
         >Add Event</span
      >

      <textarea
         class="AddEvent-description scrollbar"
         ref="InputDescription"
         :style="{ 'grid-area': 'description' }"
         type="text"
         placeholder="Description"
         v-model="eventDescription"
      />

      <div class="AddEvent-images scrollbar" :style="{ 'grid-area': 'images' }">
         <img
            v-for="eventImagePreview of eventImagePreviews"
            :key="eventImagePreview"
            :src="eventImagePreview"
            alt=""
         />
      </div>

      <div class="AddEvent-footer" :style="{ 'grid-area': 'footer' }">
         <!-- <AddImage @change="(event) => onInputFile(event)" /> -->

         <!-- <div class="AddEvent-line"></div> -->

         <input
            v-if="isUserDefault"
            class="AddEvent-user"
            :style="{ 'grid-area': 'user' }"
            type="text"
            placeholder="Your name here"
            v-model="nameOfUser"
         />
         <span v-else class="AddEvent-user" :style="{ 'grid-area': 'user' }">{{
            nameOfUser
         }}</span>
      </div>

      <div class="AddEvent-confirm" :style="{ 'grid-area': 'confirm' }">
         <button
            class="AddEvent-enter transition"
            :style="{ 'grid-area': 'enter' }"
            @click="() => submit()"
            >Enter</button
         >
         <button
            class="AddEvent-clear transition"
            :style="{ 'grid-area': 'clear' }"
            @click="() => clear()"
         >
            <!-- <img :src="host.icon('trash-505050')" alt="Click to clear" /> -->
            Discard
         </button>
      </div>

      <div class="AddEvent-status" :style="{ 'grid-area': 'status' }">
         <div class="AddEvent-status-amount">
            <span class="AddEvent-status-amount-currency">RM</span>
            <input
               class="AddEvent-status-amount-input"
               type="number"
               :value="eventAmount === 0 ? undefined : eventAmount"
               ref="InputAmount"
               placeholder="0.00"
               @input="
                  (event) => {
                     let amount = Number.parseFloat(event.target.value);
                     if (Number.isNaN(amount)) amount = 0;
                     eventAmount = amount;
                  }
               "
               @change="
                  (event) => {
                     let amount = Number.parseFloat(event.target.value);
                     if (Number.isNaN(amount)) amount = 0;
                     eventAmount = amount;
                  }
               "
            />
         </div>

         <Menu
            class="AddEvent-status-header"
            :menus="methodMenus"
            :corner="methodMenuCorner"
            :width="methodMenuWidth"
         >
            <span class="AddEvent-status-header-title">{{
               methodMenu.title
            }}</span>
            <img
               class="AddEvent-status-header-arrow"
               :src="host.icon('arrowDown-FFFFFF')"
               alt="Click to select"
            />
         </Menu>
      </div>
   </div>
</template>

<style lang="scss" scoped>
   .AddEvent {
      width: 100%;
      max-width: 40rem;
      margin-top: 1rem;

      display: grid;
      grid-template-areas:
         "header status"
         "description status"
         "images status"
         "footer confirm";
      grid-template-columns: 1fr 10rem;

      background-color: var(--primary-color-2);
      overflow: hidden;

      .AddEvent-header {
         font-size: 0.7rem;
         margin: 1rem;
         margin-bottom: 0;
      }
      .AddEvent-description {
         resize: none;
         background: none;
         border: none;
         height: 100%;
         min-height: 6rem;
         padding-top: 1rem;

         --scrollbar-size: 0.5em;
         --scrollbar-thumb-radius: 0.5em;
         --scrollbar-thumb-color: hsla(0, 0%, 0%, 0.1);
         --scrollbar-thumb-color-hover: hsla(0, 0%, 0%, 0.6);
         --scrollbar-track-color: hsla(0, 0%, 0%, 0.1);
         --scrollbar-track-color-hover: hsla(0, 0%, 0%, 0.1);

         --padding: 1rem;
         padding: 0.5rem var(--padding);
         scroll-padding: var(--padding);

         &::placeholder {
            color: rgba(0, 0, 0, 0.4);
         }
      }
      .AddEvent-images {
         width: 100%;
         display: flex;
         flex-direction: row;
         padding: 1rem;
         gap: 2px;

         overflow-x: auto;

         & > * {
            height: 3rem;
            border-radius: 0.3rem;
            background-color: white;
         }
      }
      .AddEvent-footer {
         border-top: 1px solid rgba(0, 0, 0, 0.1);
         gap: 0.2rem;
         margin: 0 0.5rem;

         display: flex;
         flex-direction: row;
         align-items: center;

         .AddEvent-line {
            min-width: 1px;
            margin: 0.5rem 0;
            height: calc(100% - 1rem);
            background: rgba(0, 0, 0, 0.1);
         }

         .AddEvent-user {
            font-size: 0.8rem;
            padding: 0.5rem;
            border: none;
            background: none;
            flex-grow: 1;
         }
      }
      .AddEvent-confirm {
         display: flex;
         flex-direction: row-reverse;
         align-items: center;
         justify-content: space-between;

         padding: 0.5rem;

         & > * {
            font-size: 0.8rem;
            border: none;
            background: none;
            cursor: pointer;
         }

         .AddEvent-clear {
            color: var(--primary-color);

            img {
               width: 1rem;
               height: 1rem;
            }
         }
         .AddEvent-enter {
            border-radius: 0.5rem;
            padding: 0.5rem 0.8rem;
            background: var(--primary-color);
            color: white;

            &:hover,
            &:focus {
               transform: scale(1.1);
            }
         }
      }
      .AddEvent-status {
         border-radius: 0.5rem;
         overflow: hidden;
         margin: 0.5rem;
         margin-left: 0;
         margin-bottom: 0;

         display: flex;
         flex-direction: column-reverse;
         background-color: var(--primary-color-1);

         .AddEvent-status-header {
            width: 100%;
            border-radius: 0;

            display: flex;
            flex-direction: row;
            flex-wrap: nowrap;
            align-items: center;
            justify-content: space-between;
            background-color: var(--primary-color);
            color: white;
            padding: 0.5rem;
            font-size: 0.8rem;

            .AddEvent-status-header-arrow {
               width: 1em;
               height: 1em;
            }
         }
         .AddEvent-status-amount {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: row;
            flex-wrap: nowrap;
            align-items: center;
            overflow: hidden;
            .AddEvent-status-amount-currency {
               height: 100%;
               min-width: max-content;
               padding: 0.5rem;
               font-weight: 600;

               display: flex;
               flex-grow: 0;
               flex-direction: row;
               align-items: center;
               justify-content: center;
               text-align: center;
            }
            .AddEvent-status-amount-input {
               width: 100%;
               height: 100%;
               padding: 1rem;
               flex-grow: 1;
               font-size: inherit;
               color: black;
               border: none;
               background: none;
               resize: none;

               &::placeholder {
                  color: rgba(0, 0, 0, 0.3);
               }
            }
         }
      }
   }
</style>
