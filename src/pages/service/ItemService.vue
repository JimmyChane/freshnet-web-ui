<script>
   const Mode = { Grid: 1, List: 2, Detail: 3 };

   import MenuOption from "@/components/button/MenuOption.vue";
   import Button3 from "@/components/button/Button3.vue";
   import LabelCount from "@/components/LabelCount.vue";
   import ImageViews from "@/components/ImageViews.vue";
   import ImageView from "@/components/ImageView.vue";

   import ServicePrice from "@/items/ServicePrice";
   import ServiceState from "@/items/tools/ServiceState.js";

   import { format } from "date-fns"; // https://date-fns.org/v2.29.3/docs/Getting-Started
   import U from "@/U";

   export default {
      Mode,

      components: { MenuOption, Button3, LabelCount, ImageViews, ImageView },
      emits: ["click"],
      props: {
         mode: { type: Number, default: Mode.List },
         item: { type: Object, default: null },
         isSelected: { type: Boolean, default: false },
         properties: { type: Array, default: () => [] },
      },
      computed: {
         isGrid: (c) => c.mode === Mode.Grid,
         isList: (c) => c.mode === Mode.List,
         isDetail: (c) => c.mode === Mode.Detail,

         customer: (c) => c.item.customer,
         name: (c) => c.customer.name,
         phoneNumber: (c) => c.customer.phoneNumber,
         phoneNumberStr: (c) => (c.phoneNumber ? c.phoneNumber.toString() : ""),
         description: (c) => c.item.description,
         images: (c) => c.item.imageFiles,
         isUrgent: (c) => c.item.isUrgent(),
         isWarranty: (c) => c.item.isWarranty(),
         events: (c) => {
            return U.optArray(c.item.events)
               .map((event) => event)
               .sort((event1, event2) => event1.compare(event2));
         },
         totalCost: (c) => {
            return c.events.reduce((cost, event) => {
               if (event.isPurchase()) return cost.plus(event.price);
               return cost;
            }, new ServicePrice().fromData({ amount: 0 }));
         },
         totalQuote: (c) => {
            return c.events.reduce((cost, event) => {
               if (event.isQuotation()) return cost.plus(event.price);
               return cost;
            }, new ServicePrice().fromData({ amount: 0 }));
         },
         totalCostAmount: (c) => (c.totalCost ? c.totalCost.amount : 0),
         totalQuoteAmount: (c) => (c.totalQuote ? c.totalQuote.amount : 0),
         timestamp: (c) => c.item.timestamp,
         timestampText() {
            if (!this.timestamp) return "";
            if (this.timestamp.isThisYear()) {
               return format(this.timestamp.time, "hh:mmaaa");
            }

            return format(this.timestamp.time, "EEEE, hh:mmaaa, dd/LL/yyyy");
         },

         state: (c) => c.item.state,
         primaryColor: (c) => ServiceState.getResourceByKey(c.state).color,
      },
      methods: {
         getPropertyByKey(key) {
            return this.properties.find((property) => property.key === key);
         },
      },
   };
</script>

<template>
   <Button3
      class="ItemService"
      :style="{ '--primary-color': primaryColor }"
      :isSelected="isSelected"
      @click="$emit('click', item)"
   >
      <div
         v-if="isGrid"
         :class="[
            'ItemServiceGrid-body',
            `ItemServiceGrid-body-${
               isSelected ? 'isSelected' : 'isDeselected'
            }`,
            'transition',
         ]"
      >
         <div class="ItemService-top">
            <div class="ItemService-top-customer">
               <router-link
                  class="ItemService-link-customer transition"
                  :to="{
                     path: '/manage/customer',
                     query: { name: name, phoneNumber: phoneNumberStr },
                  }"
               >
                  <span class="ItemService-link-customer-name">{{ name }}</span>
                  <div
                     class="ItemService-link-customer-dot"
                     v-if="name && phoneNumberStr"
                  />
                  <span class="ItemService-link-customer-phoneNumber">{{
                     phoneNumberStr
                  }}</span>
               </router-link>
            </div>

            <div class="ItemService-top-dot-body">
               <div class="ItemService-state-dot"></div>
            </div>
         </div>

         <div class="ItemServiceGrid-middle">
            <div class="ItemServiceGrid-images">
               <ImageView
                  class="ItemServiceGrid-image"
                  v-for="image of images"
                  :key="image.name"
                  :src="image"
               />
            </div>
         </div>

         <div class="ItemServiceGrid-bottom">
            <span class="ItemServiceGrid-timestamp">{{ timestampText }}</span>
         </div>
      </div>

      <div
         v-if="isList"
         :class="[
            'transition',
            'ItemServiceList-body',
            isSelected
               ? 'ItemServiceList-body-isSelected'
               : 'ItemServiceList-body-isDeselected',
         ]"
      >
         <div class="ItemService-top">
            <div class="ItemService-top-customer">
               <router-link
                  class="ItemService-link-customer"
                  :to="{
                     path: '/manage/customer',
                     query: { name: name, phoneNumber: phoneNumberStr },
                  }"
               >
                  <span class="ItemService-link-customer-name">{{ name }}</span>
                  <div
                     class="ItemService-link-customer-dot"
                     v-if="name && phoneNumberStr"
                  />
                  <span class="ItemService-link-customer-phoneNumber">{{
                     phoneNumberStr
                  }}</span>
               </router-link>
            </div>

            <div class="ItemService-top-dot-body">
               <div class="ItemService-state-dot"></div>
            </div>
         </div>

         <div class="ItemServiceList-middle">
            <div class="ItemServiceList-description">
               <span class="ItemServiceList-description-body">{{
                  description
               }}</span>
            </div>
            <ImageViews :width="40" :height="40" :images="images" />
         </div>

         <div class="ItemServiceList-bottom">
            <div class="ItemServiceList-notices">
               <LabelCount
                  :style="{ '--primary-color': '#d93f35' }"
                  v-if="isUrgent"
                  title="Urgent"
               />
               <LabelCount
                  :style="{ '--primary-color': '#db950c' }"
                  v-if="isWarranty"
                  title="Warranty"
               />
               <LabelCount
                  :style="{ '--primary-color': '#258915' }"
                  v-if="totalCostAmount !== 0"
                  :title="totalCost.toString()"
               />
               <LabelCount
                  :style="{ '--primary-color': '#961d96' }"
                  v-if="totalQuoteAmount !== 0"
                  :title="totalQuote.toString()"
               />
               <LabelCount
                  :style="{ '--primary-color': '#294656' }"
                  v-if="events.length"
                  title="Event"
                  :count="events.length"
               />
               <LabelCount
                  :style="{ '--primary-color': '#8C623A' }"
                  v-if="images.length"
                  :icon="host.icon('image-FFFFFF')"
                  :count="images.length"
               />
            </div>

            <span class="ItemServiceList-timestamp">{{ timestampText }}</span>
         </div>
      </div>

      <div
         v-if="isDetail"
         :class="[
            'ItemServiceDetail-body',
            `ItemServiceDetail-body-${
               isSelected ? 'isSelected' : 'isDeselected'
            }`,
            'transition',
         ]"
      >
         <span
            class="ItemServiceDetail-customerName"
            :style="{
               '--width': `${getPropertyByKey('customerName').width}px`,
            }"
            >{{ name }}</span
         >
         <span
            class="ItemServiceDetail-customerPhoneNumber"
            :style="{
               '--width': `${getPropertyByKey('customerPhoneNumber').width}px`,
            }"
            >{{ phoneNumber }}</span
         >

         <div
            class="ItemServiceDetail-description"
            :style="{ '--width': `${getPropertyByKey('description').width}px` }"
            >{{ description }}</div
         >

         <div
            class="ItemServiceDetail-images"
            :style="{ '--width': `${getPropertyByKey('images').width}px` }"
         >
            <span>Images x{{ images.length }}</span>
         </div>

         <div
            class="ItemServiceDetail-notices"
            :style="{ '--width': `${getPropertyByKey('notice').width}px` }"
         >
            <LabelCount
               :style="{ '--primary-color': '#d93f35' }"
               v-if="isUrgent"
               title="Urgent"
            />
            <LabelCount
               :style="{ '--primary-color': '#db950c' }"
               v-if="isWarranty"
               title="Warranty"
            />
            <LabelCount
               :style="{ '--primary-color': '#258915' }"
               v-if="totalCostAmount !== 0"
               :title="totalCost.toString()"
            />
            <LabelCount
               :style="{ '--primary-color': '#294656' }"
               v-if="events.length"
               title="Event"
               :count="events.length"
            />
         </div>

         <span
            class="ItemServiceDetail-timestamp"
            :style="{ '--width': `${getPropertyByKey('timestamp').width}px` }"
            >{{ timestampText }}</span
         >
      </div>
   </Button3>
</template>

<style lang="scss" scoped>
   .ItemService-top {
      padding: 0.5rem;
      margin-right: 0.6em;
      border-bottom: 0.05em solid hsla(0, 0%, 0%, 0.1);
      display: flex;
      flex-direction: row;
      align-items: center;
      .ItemService-top-customer {
         display: flex;
         flex-direction: row;
         flex-grow: 1;
         align-items: center;

         .ItemService-link-customer {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;

            gap: 0.6rem;
            padding: 0.3rem 0.5rem;
            color: black;
            border: 1px solid #dddddd;
            border-radius: 1em;
            background-color: #f4f4f4;
            font-weight: 600;
            font-size: 0.8rem;

            text-decoration: none;
            cursor: pointer;

            &:hover {
               background-color: #ebebeb;
            }

            .ItemService-link-customer-icon {
               width: 0.5rem;
               height: 0.5rem;
            }
            .ItemService-link-customer-dot {
               --size: 0.3em;
               width: var(--size);
               height: var(--size);
               min-height: var(--size);
               max-width: var(--size);
               min-width: var(--size);
               max-height: var(--size);
               display: flex;
               background: hsla(0, 0%, 0%, 0.3);
               border-radius: 50%;
            }
         }
      }
      .ItemService-top-dot-body {
         display: flex;
         flex-direction: column;
         align-items: center;
         justify-content: flex-end;
         .ItemService-state-dot {
            --size: 0.5em;
            min-width: var(--size);
            min-height: var(--size);
            width: var(--size);
            height: var(--size);
            background: var(--primary-color);
            border-radius: var(--size);
         }
      }
   }

   .ItemService {
      width: initial;
      background: white;

      .ItemServiceGrid-body {
         width: 100%;
         height: 100%;
         font-weight: 400;
         font-size: 1em;
         color: black;
         text-align: start;
         line-height: 1.1;
         gap: 0.5rem;
         padding: 0.6rem 0.2rem;

         display: flex;
         flex-direction: column;
         align-items: stretch;
         border-radius: 0 0.5em 0.5em 0;
         border: 0.1em solid transparent;

         .ItemService-top {
            padding: 0;
            padding-bottom: 0.6rem;
         }
         .ItemServiceGrid-middle {
            width: 100%;
            height: 100%;
            gap: 0.7em;
            font-weight: 400;
            font-size: 1em;
            color: black;
            text-align: start;
            line-height: 1.1;
            overflow: hidden;

            display: flex;
            flex-direction: row;
            flex-direction: column;
            flex-wrap: wrap;
            flex-grow: 1;
            align-items: flex-start;
            justify-content: space-between;

            .ItemServiceGrid-images {
               flex-grow: 0;
               display: flex;
               flex-direction: row;
               flex-wrap: wrap;
               align-items: flex-start;
               justify-content: flex-start;
               gap: 0.2em;
               overflow: hidden;
               .ItemServiceGrid-image {
                  height: 40px;
               }
            }
         }
         .ItemServiceGrid-bottom {
            width: 100%;
            display: flex;
            flex-direction: row;
            align-items: flex-end;
            justify-content: flex-start;
            gap: 1rem;

            .ItemServiceGrid-timestamp {
               font-size: 0.8em;
               color: rgb(112, 112, 112);
               text-align: start;
            }
         }
      }
      .ItemServiceList-body {
         width: 100%;
         height: 100%;
         font-weight: 400;
         font-size: 1em;
         color: black;
         text-align: start;
         line-height: 1.1;

         display: flex;
         flex-direction: column;
         align-items: stretch;
         border-radius: 0 0.5em 0.5em 0;
         border: 0.1em solid transparent;

         .ItemServiceList-middle {
            width: 100%;
            height: 100%;
            font-weight: 400;
            font-size: 1em;
            color: black;
            text-align: start;
            line-height: 1.1;

            gap: 1rem;
            height: unset;
            padding: 0.8rem;
            overflow: hidden;

            display: flex;
            flex-direction: row;
            align-items: flex-start;
            justify-content: space-between;

            .ItemServiceList-description {
               width: max-content;
               flex-grow: 1;
               display: flex;
               flex-direction: column;

               .ItemServiceList-description-body {
                  width: 100%;
                  display: flex;
                  white-space: pre-line;
                  text-overflow: ellipsis;
                  word-wrap: break-word;
                  overflow: hidden;
                  max-height: 2.2em;
                  line-height: 1.1em;
               }
            }
         }
         .ItemServiceList-bottom {
            padding: 1em;
            display: flex;
            flex-direction: row;
            align-items: flex-end;
            justify-content: flex-end;
            gap: 1rem;
            .ItemServiceList-notices {
               display: flex;
               flex-grow: 1;
               flex-direction: row;
               flex-wrap: wrap;
               font-size: 0.8rem;
               gap: 0.1rem;

               & > * {
                  border-radius: 0.5rem;
                  padding: 0.4rem;
               }
            }
            .ItemServiceList-timestamp {
               font-size: 0.8em;
               color: rgb(112, 112, 112);
            }
         }
      }
      .ItemServiceDetail-body {
         height: 100%;
         gap: 0.5rem;
         padding: 0.3rem;

         font-weight: 400;
         font-size: 1rem;
         color: black;
         text-align: start;
         line-height: 1.1;
         border-radius: 0 0.5em 0.5em 0;
         border: 0.1em solid transparent;

         display: flex;
         flex-direction: row;
         align-items: flex-start;

         & > * {
            --width: 2rem;
            height: 1.1rem;
            white-space: pre-line;
            text-overflow: ellipsis;
            word-wrap: break-word;
            overflow: hidden;
         }

         .ItemServiceDetail-customerName {
            width: var(--width);
            min-width: var(--width);
            max-width: var(--width);
         }

         .ItemServiceDetail-customerPhoneNumber {
            width: var(--width);
            min-width: var(--width);
            max-width: var(--width);
         }

         .ItemServiceDetail-description {
            width: var(--width);
            min-width: var(--width);
            max-width: var(--width);
         }

         .ItemServiceDetail-images {
            width: var(--width);
            min-width: var(--width);
            max-width: var(--width);

            display: flex;
            flex-direction: row;
            align-items: flex-start;
            justify-content: flex-start;
            .ItemServiceDetail-image {
               height: 40px;
            }
         }

         .ItemServiceDetail-notices {
            width: var(--width);
            min-width: var(--width);
            max-width: var(--width);

            gap: 0.1rem;

            display: flex;
            flex-direction: row;
         }

         .ItemServiceDetail-timestamp {
            width: var(--width);
            min-width: var(--width);
            max-width: var(--width);
         }
      }
   }
</style>
