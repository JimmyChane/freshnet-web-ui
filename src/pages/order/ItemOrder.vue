<script>
   import ItemOrderAction from "@/pages/order/ItemOrder-Action.vue";
   import Order from "@/items/Order";

   import { format } from "date-fns";

   export default {
      components: { ItemOrderAction },
      emits: ["onPending", "onComplete", "onRemove", "onExpand", "onCollapse"],
      props: {
         order: { type: Object, default: () => null },
         isExpand: { type: Boolean, default: false },
      },
      computed: {
         isStatusPending: (c) => c.order.status === Order.Status.Pending,
         isStatusCompleted: (c) => c.order.status === Order.Status.Completed,

         dateCreated: (c) => {
            return format(new Date(c.order.createdAt), "hh:mmaaa dd/LL/yyyy");
         },

         customer: (c) => {
            return c.order.customer ?? null;
         },

         name: (c) => c.customer?.name ?? "",
         phoneNumber: (c) => c.customer?.phoneNumber ?? null,
         phoneNumberValue: (c) => c.phoneNumber?.value ?? "",
         phoneNumberStr: (c) => c.phoneNumber?.toString() ?? "",
         content: (c) => c.order.content,
      },
   };
</script>

<template>
   <div
      :class="['ItemOrder', 'transition']"
      :isExpand="`${isExpand}`"
      @click="$emit(isExpand ? 'onCollapse' : 'onExpand')"
   >
      <div class="ItemOrder-main">
         <div class="ItemOrder-main-left">
            <span class="ItemOrder-date" v-if="dateCreated">{{
               dateCreated
            }}</span>

            <router-link
               class="ItemOrder-customer"
               v-if="name"
               :to="{
                  path: '/manage/customer',
                  query: { name: name, phoneNumber: phoneNumberValue },
               }"
            >
               <span class="ItemOrder-name" v-if="name">{{ name }}</span>
               <span class="ItemOrder-phoneNumber" v-if="phoneNumberValue">{{
                  phoneNumberValue
               }}</span>
            </router-link>

            <span class="ItemOrder-content" v-if="content">{{ content }}</span>
         </div>

         <div class="ItemOrder-main-right">
            <img
               class="ItemOrder-button transition"
               :isExpand="`${isExpand}`"
               :alt="isExpand ? 'Expand' : 'Collapse'"
               :src="host.icon('down-arrow-grey')"
            />
         </div>
      </div>

      <div class="ItemOrder-option transition" :isExpand="`${isExpand}`">
         <ItemOrderAction
            v-if="isStatusCompleted"
            color="#f4a60d"
            text="Move to Pending"
            @button-click="$emit('onPending')"
         />
         <ItemOrderAction
            v-if="isStatusPending"
            :icon="host.icon('success-green')"
            :iconActive="host.icon('success-white')"
            color="#25ad86"
            text="Move to Completed"
            @button-click="$emit('onComplete')"
         />
         <ItemOrderAction
            :icon="host.icon('trash-red')"
            :iconActive="host.icon('trash-white')"
            color="#DB4A2A"
            text=""
            @button-click="$emit('onRemove')"
         />
      </div>
   </div>
</template>

<style lang="scss" scoped>
   .ItemOrder {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: space-between;

      background: none;
      text-align: start;
      cursor: pointer;
      border: 1px solid;
      border-radius: 1rem;
      transition-timing-function: cubic-bezier(1, 0, 0, 1);

      &:hover,
      &:focus {
         background-color: hsla(0, 0%, 0%, 0.05);
      }

      .ItemOrder-main {
         width: 100%;
         display: flex;
         flex-direction: row;
         align-items: stretch;
         justify-content: stretch;
         gap: 0.2rem;

         .ItemOrder-main-left {
            width: 100%;
            display: flex;
            flex-direction: column;
            flex-grow: 1;
            align-items: flex-start;
            justify-content: flex-start;
            gap: 0.5rem;

            .ItemOrder-date {
               flex-grow: 1;
               color: #6f6f6f;
               font-size: 0.8rem;
            }

            .ItemOrder-customer {
               width: max-content;
               display: flex;
               flex-direction: row;
               align-items: center;
               justify-content: center;
               padding: 0.2rem 0.3rem;
               gap: 1rem;

               border: 1px solid #dddddd;
               border-radius: 1rem;
               background-color: #f4f4f4;
               text-decoration: none;
               text-align: start;
               color: inherit;

               .ItemOrder-name {
                  font-size: 1rem;
                  color: black;
               }
               .ItemOrder-phoneNumber {
                  font-size: 0.8rem;
                  color: #434343;
               }
            }

            .ItemOrder-content {
               width: 60%;
            }
         }
         .ItemOrder-main-right {
            .ItemOrder-button {
               --size: 2.1875rem;
               width: var(--size);
               height: var(--size);
               background-color: transparent;
               border: none;
               margin: 0 0.375rem;
               outline: none;
               border-radius: 50%;
               padding: 0.625rem;

               padding: 0;
               --size: 1rem;
               transition-timing-function: inherit;
            }
            .ItemOrder-button[isExpand="false"] {
               transform: rotate(0deg);
            }
            .ItemOrder-button[isExpand="true"] {
               transform: rotate(180deg);
            }
         }
      }
      .ItemOrder-option {
         width: 100%;
         display: flex;
         flex-direction: row;
         gap: 1rem;
         padding: 0;
         margin-top: 0;
         transition-timing-function: inherit;

         & > * {
            min-height: 100%;
            height: unset;
            max-height: unset;
            padding: 0.625rem;
            flex-grow: 1;
            transition-timing-function: inherit;
         }
      }
      .ItemOrder-option[isExpand="false"] {
         height: 0;
         pointer-events: none;
         opacity: 0;
      }
      .ItemOrder-option[isExpand="true"] {
         height: unset;
         margin-top: 1.25rem;
         pointer-events: initial;
         opacity: 1;
      }
   }
   .ItemOrder[isExpand="false"] {
      box-shadow: none;
      padding: 0.625rem;
      border-color: transparent;
   }
   .ItemOrder[isExpand="true"] {
      padding: 1.2rem;
      font-size: 1.2rem;
      border-color: hsla(0, 0%, 0%, 0.1);
   }
</style>
