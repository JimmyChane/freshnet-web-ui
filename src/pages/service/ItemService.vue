<script>
   const Mode = { Grid: 1, List: 2, Detail: 4 };

   import MenuOption from "@/components/button/MenuOption.vue";
   import Button3 from "@/components/button/Button3.vue";
   import LabelCount from "@/components/LabelCount.vue";
   import ImageViews from "@/components/ImageViews.vue";
   import ImageView from "@/components/ImageView.vue";

   import ServicePrice from "@/items/ServicePrice";
   import ServiceStates from "@/objects/ServiceStates.js";

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
         totalCostAmount: (c) => (c.totalCost ? c.totalCost.amount : 0),
         totalQuoteAmount: (c) => (c.totalQuote ? c.totalQuote.amount : 0),
         timestamp: (c) => c.item.timestamp,
         state: (c) => c.item.state,
         primaryColor: (c) => ServiceStates.findByKey(c.state).color,

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
         timestampText: (c) => {
            if (!c.timestamp) return "";
            if (c.timestamp.isThisYear()) {
               return format(c.timestamp.time, "hh:mmaaa");
            }

            return format(c.timestamp.time, "EEEE, hh:mmaaa, dd/LL/yyyy");
         },
         labels: (c) => {
            const labels = [];

            if (c.isUrgent)
               labels.push({ key: "urgent", title: "Urgent", primaryColor: "#d93f35" });
            if (c.isWarranty)
               labels.push({
                  key: "warranty",
                  title: "Warranty",
                  primaryColor: "#db950c",
               });
            if (c.totalCostAmount !== 0)
               labels.push({
                  key: `price${c.totalCost.toString()}`,
                  title: c.totalCost.toString(),
                  primaryColor: "#258915",
               });
            if (c.totalQuoteAmount !== 0)
               labels.push({
                  key: `quotation${c.totalQuote.toString()}`,
                  title: c.totalQuote.toString(),
                  primaryColor: "#961d96",
               });
            if (c.events.length)
               labels.push({
                  key: "event",
                  title: "Event",
                  count: c.events.length,
                  primaryColor: "#294656",
               });
            if (c.images.length)
               labels.push({
                  key: "images",
                  icon: c.host.icon("image-FFFFFF"),
                  count: c.images.length,
                  primaryColor: "#8C623A",
               });

            return labels;
         },

         classes: (c) => {
            if (c.isGrid) return ["ItemService-isGrid"];
            if (c.isList) return ["ItemService-isList"];
            if (c.isDetail) return ["ItemService-isDetail"];
            return [];
         },
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
      :class="['ItemService', ...classes]"
      :style="{ '--primary-color': primaryColor }"
      :isSelected="isSelected"
      @click="$emit('click', item)"
   >
      <div v-if="isGrid" :class="['transition', 'ItemService-body']">
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
                  <span class="ItemService-link-customer-phoneNumber">{{
                     phoneNumberStr
                  }}</span>
               </router-link>
            </div>

            <div class="ItemService-top-dot-body">
               <div class="ItemService-state-dot"></div>
            </div>
         </div>

         <div class="ItemService-middle">
            <div class="ItemService-images">
               <ImageView
                  class="ItemService-image"
                  v-for="image of images"
                  :key="image.name"
                  :src="image"
               />
            </div>
         </div>

         <div class="ItemService-bottom">
            <span class="ItemService-timestamp">{{ timestampText }}</span>
         </div>
      </div>

      <div v-if="isList" :class="['transition', 'ItemService-body']">
         <div class="ItemService-top">
            <router-link
               :class="['ItemService-customer', 'transition']"
               :to="{
                  path: '/manage/customer',
                  query: { name: name, phoneNumber: phoneNumberStr },
               }"
            >
               <span class="ItemService-customer-name" v-if="name.length">{{
                  name
               }}</span>
               <span
                  class="ItemService-customer-phoneNumber"
                  v-if="phoneNumberStr.length"
                  >{{ phoneNumberStr }}</span
               >
            </router-link>

            <span class="ItemService-description">{{ description }}</span>

            <ImageViews
               class="ItemService-image"
               :width="40"
               :height="40"
               :images="images"
            />
         </div>

         <div class="ItemService-bottom">
            <LabelCount
               class="ItemService-label"
               v-for="label of labels"
               :key="label.key"
               :style="{ '--primary-color': label.primaryColor }"
               :title="label.title"
               :icon="label.icon"
               :count="label.count"
            />
            <span class="ItemService-timestamp">{{ timestampText }}</span>
         </div>
      </div>

      <div v-if="isDetail" :class="['transition', 'ItemService-body']">
         <span
            class="ItemService-customerName"
            :style="{
               '--width': `${getPropertyByKey('customerName').width}px`,
            }"
            >{{ name }}</span
         >
         <span
            class="ItemService-customerPhoneNumber"
            :style="{
               '--width': `${getPropertyByKey('customerPhoneNumber').width}px`,
            }"
            >{{ phoneNumber }}</span
         >

         <div
            class="ItemService-description"
            :style="{ '--width': `${getPropertyByKey('description').width}px` }"
            >{{ description }}</div
         >

         <div
            class="ItemService-images"
            :style="{ '--width': `${getPropertyByKey('images').width}px` }"
         >
            <span>Images x{{ images.length }}</span>
         </div>

         <div
            class="ItemService-notices"
            :style="{ '--width': `${getPropertyByKey('notice').width}px` }"
         >
            <LabelCount
               class="ItemService-label"
               v-for="label of labels"
               :key="label.key"
               :style="{ '--primary-color': label.primaryColor }"
               :title="label.title"
               :icon="label.icon"
               :count="label.count"
            />
         </div>

         <span
            class="ItemService-timestamp"
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
   }

   .ItemService-isGrid {
      .ItemService-body {
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

            .ItemService-top-customer {
               .ItemService-link-customer {
                  flex-direction: column;
                  align-items: flex-start;
                  gap: 0;
               }
            }
         }
         .ItemService-middle {
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

            .ItemService-images {
               flex-grow: 0;
               display: flex;
               flex-direction: row;
               flex-wrap: wrap;
               align-items: flex-start;
               justify-content: flex-start;
               gap: 0.2em;
               overflow: hidden;
               .ItemService-image {
                  height: 40px;
               }
            }
         }
         .ItemService-bottom {
            width: 100%;
            display: flex;
            flex-direction: row;
            align-items: flex-end;
            justify-content: flex-start;
            gap: 1rem;

            .ItemService-timestamp {
               font-size: 0.8em;
               color: rgb(112, 112, 112);
               text-align: start;
            }
         }
      }
   }
   .ItemService-isList {
      .ItemService-body {
         width: 100%;

         font-weight: 400;
         font-size: 1em;
         color: black;
         text-align: start;

         display: flex;
         flex-direction: column;
         align-items: center;
         border-radius: 0.5em;
         border: 0.1em solid transparent;

         .ItemService-top {
            width: 100%;
            height: 3rem;
            min-height: 3rem;
            max-height: 3rem;

            display: flex;
            flex-direction: row;
            align-items: center;

            .ItemService-customer {
               min-width: max-content;

               display: flex;
               flex-direction: column;
               align-items: flex-start;
               justify-content: center;

               gap: 0.1rem;
               padding: 0 0.5rem;
               color: black;
               border: none;
               background: none;
               font-weight: 600;
               font-size: 0.8rem;

               text-decoration: none;
               cursor: pointer;

               border-radius: 0.5em;

               &:hover {
                  background-color: #ebebeb;
               }
            }

            .ItemService-description {
               padding: 0 0.5rem;

               display: flex;
               align-items: flex-start;
               white-space: pre-line;
               text-overflow: ellipsis;
               word-wrap: break-word;
               overflow: hidden;
               max-height: 2.2em;
               line-height: 1.1em;
               flex-grow: 1;
            }
         }

         .ItemService-bottom {
            width: 100%;
            font-size: 0.8rem;
            gap: 0.1rem;
            padding: 0.5rem;

            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: flex-start;
            flex-wrap: wrap;
            flex-wrap: nowrap;

            .ItemService-label {
               border-radius: 0.5rem;
               padding: 0.4rem;
            }
            .ItemService-timestamp {
               color: rgb(112, 112, 112);
               flex-grow: 1;
               text-align: end;
            }
         }
      }
   }
   .ItemService-isDetail {
      border-radius: 0;
      .ItemService-body {
         height: 100%;
         gap: 0.5rem;
         padding: 0.3rem;

         font-weight: 400;
         font-size: 1rem;
         color: black;
         text-align: start;
         line-height: 1.1;
         border-radius: 0 0.5em 0.5em 0;
         border-radius: 0.5em;
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

         .ItemService-customerName {
            width: var(--width);
            min-width: var(--width);
            max-width: var(--width);
         }

         .ItemService-customerPhoneNumber {
            width: var(--width);
            min-width: var(--width);
            max-width: var(--width);
         }

         .ItemService-description {
            width: var(--width);
            min-width: var(--width);
            max-width: var(--width);
         }

         .ItemService-images {
            width: var(--width);
            min-width: var(--width);
            max-width: var(--width);

            display: flex;
            flex-direction: row;
            align-items: flex-start;
            justify-content: flex-start;
            .ItemService-image {
               height: 40px;
            }
         }

         .ItemService-notices {
            width: var(--width);
            min-width: var(--width);
            max-width: var(--width);

            gap: 0.1rem;

            display: flex;
            flex-direction: row;
         }

         .ItemService-timestamp {
            width: var(--width);
            min-width: var(--width);
            max-width: var(--width);
         }
      }
   }
</style>
