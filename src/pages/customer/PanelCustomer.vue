<script>
   import Actionbar from "@/components/actionbar/Actionbar.vue";
   import Loading from "@/components/Loading.vue";

   import Section from "@/pages/manage/PanelItem-Section.vue";
   import Item from "./PanelCustomer-Item.vue";
   import ItemDevice from "./ItemDevice.vue";

   import chroma from "chroma-js";

   export default {
      components: { Actionbar, Loading, Section, Item, ItemDevice },
      emits: [
         "click-item-close",
         "click-item-remove",
         "click-item-device-remove",
         "click-item-device-update-specifications",
         "click-item-device-update-description",
      ],
      props: {
         item: { type: Object, default: () => null },
      },
      data: (c) => ({
         top: { showShadow: false },

         devices: [],
         isLoadingDevices: false,
      }),
      computed: {
         isWide: (c) => c.$root.window.innerWidth > 600,

         id: (c) => (c.item ? c.item.id : ""),
         name: (c) => (c.item ? c.item.name : ""),
         phoneNumber: (c) => (c.item ? c.item.phoneNumber : null),
         phoneNumberStr: (c) => (c.phoneNumber ? c.phoneNumber.toString() : ""),
         description: (c) => (c.item ? c.item.description : ""),
         deviceIds: (c) => (c.item ? c.item.deviceIds : []),
         services: (c) => (c.item ? c.item.services : []),
         orders: (c) => (c.item ? c.item.orders : []),

         primaryColor: () => chroma("294656"),
         actionbarColor: (c) => c.backgroundColor.brighten(0.4),
         actionbarShadow: (c) => c.actionbarColor.darken(0.8),
         backgroundColor: (c) => c.primaryColor.mix("ffffff", 0.65),
      },
      watch: {
         item() {
            this.invalidateDevices();
         },
         "item.deviceIds"() {
            this.invalidateDevices();
         },
      },
      mounted() {
         this.invalidateDevices();
      },
      methods: {
         async invalidateDevices() {
            this.devices = [];

            if (!this.deviceIds.length) {
               return;
            }

            const cacheItem = this.item;
            this.isLoadingDevices = true;

            const devices = await this.customerStore.dispatch("getDevices");
            if (this.item !== cacheItem) {
               return;
            }

            this.isLoadingDevices = false;
            this.devices = this.item.deviceIds.map((deviceId) => {
               const device = devices.find((device) => device.id === deviceId);
               return { deviceId, device };
            });
         },
      },
   };
</script>

<template>
   <div
      class="PanelCustomer"
      :style="{ 'background-color': backgroundColor }"
      @scroll="(event) => (top.showShadow = event.target.scrollTop > 0)"
   >
      <div class="PanelCustomer-body">
         <Actionbar
            class="PanelCustomer-actionbar"
            :style="{
               'background-color': actionbarColor,
               'box-shadow': top.showShadow
                  ? `0 0 20px ${actionbarShadow}`
                  : 'none',
            }"
            :leftMenus="{
               key: 'close',
               title: 'Close',
               icon: host.icon('close-000000'),
               click: () => $emit('click-item-close', { item }),
            }"
            :rightMenus="
               id
                  ? {
                       key: 'remove',
                       title: 'Delete',
                       icon: host.icon('trash-000000'),
                       click: () => $emit('click-item-remove', { item }),
                    }
                  : null
            "
         />

         <div class="PanelCustomer-main" :isWide="`${isWide}`">
            <div>
               <Section
                  title="Customer Info"
                  :menus="
                     id
                        ? {
                             icon: host.icon('edit-505050'),
                             click: () =>
                                $emit('click-item-customer-update', { item }),
                          }
                        : null
                  "
               >
                  <div class="PanelCustomer-customer">
                     <span class="PanelCustomer-customer-content" v-if="name">{{
                        name
                     }}</span>
                     <span class="PanelCustomer-reuse-contentEmpty" v-else
                        >Empty</span
                     >

                     <span
                        class="PanelCustomer-customer-content"
                        v-if="phoneNumber"
                        >{{ phoneNumber }}</span
                     >
                     <span class="PanelCustomer-customer-empty" v-else
                        >Empty</span
                     >
                  </div>
               </Section>

               <Section
                  title="Description"
                  v-if="id"
                  :menus="{
                     icon: host.icon('edit-505050'),
                     click: () =>
                        $emit('click-item-description-update', { item }),
                  }"
               >
                  <span v-if="description">{{ description }}</span>
               </Section>
            </div>

            <Section
               title="Owned Devices"
               v-if="id"
               :menus="{
                  icon: host.icon('add-505050'),
                  click: () => $emit('click-item-device-add', { item }),
               }"
            >
               <ItemDevice
                  v-for="deviceContext of devices"
                  :key="deviceContext.deviceId"
                  :item="deviceContext.device"
                  @click-remove="
                     (param) =>
                        $emit('click-item-device-remove', {
                           item,
                           device: param.item,
                        })
                  "
                  @click-update-specifications="
                     (param) =>
                        $emit('click-item-device-update-specifications', {
                           item,
                           device: param.item,
                           specifications: param.item.specifications,
                        })
                  "
                  @click-update-description="
                     (param) =>
                        $emit('click-item-device-update-description', {
                           item,
                           device: param.item,
                           description: param.item.description,
                        })
                  "
               />
               <Loading
                  class="PanelCustomer-devices-loading"
                  :isShowing="isLoadingDevices"
               />
            </Section>

            <Section title="Services" v-if="services.length">
               <Item
                  v-for="service of services"
                  :key="service.id"
                  :to="{
                     path: '/manage/service',
                     query: { service: service.id },
                  }"
                  title="Problem"
               >
                  <span>{{ service.description }}</span>
               </Item>
            </Section>

            <Section title="Orders" v-if="orders.length">
               <Item
                  v-for="order of orders"
                  :key="order.id"
                  :to="{
                     path: '/manage/order',
                     query: { order: order.id },
                  }"
                  title="Content"
               >
                  <span>{{ order.content }}</span>
               </Item>
            </Section>
         </div>
      </div>
   </div>
</template>

<style lang="scss" scoped>
   .PanelCustomer {
      width: 100%;
      height: 100%;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      align-items: stretch;
      overflow-x: hidden;

      .PanelCustomer-body {
         display: flex;
         flex-direction: column;

         .PanelCustomer-main {
            padding-bottom: 10rem;
            display: flex;
            flex-direction: column;
            gap: 2rem;
            row-gap: 0.5rem;

            .PanelCustomer-customer {
               display: flex;
               flex-direction: column;
               flex-wrap: wrap;
               flex-grow: 1;
               align-items: flex-start;
               gap: 0.5rem;
               overflow: hidden;

               & > * {
                  flex-grow: 1;
                  display: flex;
                  flex-direction: row;
                  align-items: center;
               }

               .PanelCustomer-customer-content {
                  flex-grow: 1;
                  display: flex;
                  flex-direction: row;
                  align-items: center;
               }
               .PanelCustomer-customer-empty {
                  font-weight: 400;
                  font-size: 0.9rem;
                  color: #535353;
               }
            }
            .PanelCustomer-devices-loading {
               width: 100%;
               height: 4px;
            }
         }
         .PanelCustomer-main[isWide="true"] {
            padding: 1rem;

            & > * {
               border-radius: 1rem;
               overflow: hidden;
            }
         }
         .PanelCustomer-main[isWide="false"] {
            padding: 1rem 0;
         }
      }
   }
</style>
