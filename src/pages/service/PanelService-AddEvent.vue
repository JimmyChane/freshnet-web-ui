<script>
   import chroma from "chroma-js";
   import Menu from "@/components/Menu.vue";
   import ModuleEvent from "@/items/data/ServiceEvent.js";
   import TextArea from "@/components/InputTextArea.vue";

   export default {
      components: { Menu, TextArea },
      data() {
         return {
            ModuleEvent,

            nameOfUser: "unknown",
            eventMethod: ModuleEvent.Method.Quotation,
            eventDescription: "",
            eventStatus: "",
            eventAmount: 0,
         };
      },
      computed: {
         primaryColor: (c) => chroma("961d96"),
         primaryColor: (c) => c.methodMenu.color,
         primaryColor1: (c) => c.primaryColor.mix("ffffff", 0.45),
         primaryColor2: (c) => c.primaryColor.mix("ffffff", 0.6),

         user: (c) => c.loginStore.getters.user,
         isUserDefault: (c) => {
            if (c.user.isTypeNone()) return false;
            const isUserAdmin = c.user.isTypeAdmin() && c.user.isDefault();
            const isUserStaff = c.user.isTypeStaff() && c.user.isDefault();
            return isUserAdmin || isUserStaff;
         },

         isMethodInfo: (c) => c.eventMethod === ModuleEvent.Method.Info,
         isMethodQuotation: (c) =>
            c.eventMethod === ModuleEvent.Method.Quotation,
         isMethodPurchase: (c) => c.eventMethod === ModuleEvent.Method.Purchase,
         nameUserType: (c) => {
            if (c.user.isTypeAdmin()) return "Admin";
            if (c.user.isTypeStaff()) return "Staff";
            return "unknown";
         },

         methodMenu: (c) =>
            c.methodMenus.find((menu) => menu.key === c.eventMethod),
         methodMenus: (c) => [
            {
               key: ModuleEvent.Method.Quotation,
               title: "Quotation",
               color: chroma("961d96"),
               click: (menu) => (c.eventMethod = menu.key),
            },
            {
               key: ModuleEvent.Method.Purchase,
               title: "Purchase",
               color: chroma("258915"),
               click: (menu) => (c.eventMethod = menu.key),
            },
         ],
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
         clear() {
            this.nameOfUser = "";
            this.eventMethod = ModuleEvent.Method.Quotation;

            this.eventDescription = "";
            this.eventStatus = "";
            this.eventAmount = 0;

            this.focus();
            this.invalidateMethod();
            this.invalidateUser();
         },
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
         submit() {
            if (this.isUserDefault && !this.nameOfUser.trim()) {
               this.$root.feedback("You must specify your name");
               return;
            }
            if (!this.eventDescription.trim()) {
               this.$root.feedback('You must specify "Description"');
               return;
            }

            let event = this.toEvent();
            if (this.isUserDefault && this.nameOfUser.trim()) {
               event.nameOfUser = this.nameOfUser;
            }

            if (event) {
               this.$emit("callback-create", event);
               this.clear();
            }
         },

         focus() {
            setTimeout(() => {
               this.$refs.InputDescription.focus();
            }, 100);
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

         <Menu class="AddEvent-status-header" :menus="methodMenus">
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

      <div class="AddEvent-footer" :style="{ 'grid-area': 'footer' }">
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
            <img :src="host.icon('trash-505050')" alt="Click to clear" />
         </button>
      </div>
   </div>
</template>

<style lang="scss" scoped>
   .AddEvent {
      width: 100%;
      max-width: 40rem;
      display: flex;
      flex-direction: row;

      display: grid;
      grid-template-areas: "header status" "description status" "footer status";
      grid-template-columns: 1fr 10rem;

      background-color: var(--primary-color-2);
      border-radius: 0.5em;
      overflow: hidden;

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
      .AddEvent-header {
         font-size: 0.7rem;
         margin: 1rem;
         margin-bottom: 0;
      }
      .AddEvent-footer {
         display: flex;
         flex-direction: row;
         align-items: center;

         border-top: 1px solid rgba(0, 0, 0, 0.1);
         gap: 0.8rem;
         margin: 0 0.5rem;

         display: grid;
         grid-template-areas: "user clear enter";
         grid-template-columns: 1fr max-content max-content;

         .AddEvent-user {
            font-size: 0.8rem;
            padding: 0.5rem;
            border: none;
            background: none;
            flex-grow: 1;
         }
         .AddEvent-clear {
            border: none;
            background: none;
            cursor: pointer;
            img {
               width: 1rem;
               height: 1rem;
            }

            &:hover,
            &:focus {
               transform: scale(1.1);
            }
         }
         .AddEvent-enter {
            border: none;
            background: none;
            cursor: pointer;

            background: var(--primary-color);
            color: white;
            border-radius: 0.5rem;
            padding: 0.6rem 1rem;
            margin: 0.5rem 0;

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
