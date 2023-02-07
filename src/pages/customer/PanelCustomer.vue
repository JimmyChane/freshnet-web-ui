<script>
   import Actionbar from "@/components/actionbar/Actionbar.vue";
   import Loadingv1 from "@/components/Loading.vue";

   import Section from "./PanelCustomer_Section.vue";
   import ItemDevice from "./ItemDevice.vue";

   import chroma from "chroma-js"; // https://gka.github.io/chroma.js/

   export default {
      components: { Actionbar, Loadingv1, Section, ItemDevice },
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
      data() {
         return {
            top: { showShadow: false },

            devices: [],
            isLoadingDevices: false,
         };
      },
      computed: {
         id() {
            if (this.item) return this.item.id;
            return "";
         },
         name() {
            if (this.item) return this.item.name;
            return "";
         },
         phoneNumber() {
            if (this.item) return this.item.phoneNumber;
            return null;
         },
         phoneNumberStr() {
            return this.phoneNumber ? this.phoneNumber.toString() : "";
         },
         description() {
            if (this.item) return this.item.description;
            return "";
         },
         deviceIds() {
            if (this.item) return this.item.deviceIds;
            return [];
         },
         services() {
            if (this.item) return this.item.services;
            return [];
         },
         orders() {
            if (this.item) return this.item.orders;
            return [];
         },

         primaryColor: () => chroma("294656"),
         actionbarColor() {
            return this.backgroundColor.brighten(0.4);
         },
         actionbarShadow() {
            return this.actionbarColor.darken(0.8);
         },
         backgroundColor() {
            return this.primaryColor.mix("ffffff", 0.65);
         },
      },
      watch: {
         item() {
            this.invalidate();
         },
         "item.deviceIds"() {
            this.invalidateDevices();
         },
      },
      mounted() {
         this.invalidate();
      },
      methods: {
         async invalidate() {
            this.invalidateDevices();
         },
         async invalidateDevices() {
            this.devices = [];

            if (!this.deviceIds.length) return;

            const cacheItem = this.item;
            this.isLoadingDevices = true;

            const devices = await this.customerStore.dispatch("getDevices");
            if (this.item !== cacheItem) return;

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

         <div class="PanelCustomer-main">
            <Section
               title="Name & Phone Number"
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
                  <span class="PanelCustomer-customer-empty" v-else>Empty</span>
               </div>
            </Section>

            <Section
               title="Description"
               v-if="id"
               :menus="{
                  icon: host.icon('edit-505050'),
                  click: () => $emit('click-item-description-update', { item }),
               }"
            >
               <div class="PanelCustomer-description" v-if="description">
                  <span>{{ description }}</span>
               </div>
            </Section>

            <Section
               title="Devices"
               v-if="id"
               :menus="{
                  icon: host.icon('add-505050'),
                  click: () => $emit('click-item-device-add', { item }),
               }"
            >
               <div class="PanelCustomer-devices-items" v-if="devices.length">
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
               </div>
               <Loadingv1
                  class="PanelCustomer-devices-loading"
                  v-if="isLoadingDevices"
                  :isRunning="isLoadingDevices"
               />
            </Section>

            <Section title="Services" v-if="services.length">
               <div class="PanelCustomer-service">
                  <router-link
                     class="PanelCustomer-service-item"
                     v-for="service of services"
                     :key="service.id"
                     :to="{
                        path: '/manage/service',
                        query: { service: service.id },
                     }"
                  >
                     <span class="PanelCustomer-service-item-title"
                        >Problem</span
                     >
                     <span class="PanelCustomer-service-item-description">{{
                        service.description
                     }}</span>
                  </router-link>
               </div>
            </Section>

            <Section title="Orders" v-if="orders.length">
               <div class="PanelCustomer-order">
                  <router-link
                     class="PanelCustomer-order-item"
                     v-for="order of orders"
                     :key="order.id"
                     :to="{ path: '/manage/order', query: { order: order.id } }"
                  >
                     <span class="PanelCustomer-order-item-title">Content</span>
                     <span class="PanelCustomer-order-item-description">{{
                        order.content
                     }}</span>
                  </router-link>
               </div>
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
            padding: 1rem;
            padding-bottom: 10rem;
            display: flex;
            flex-direction: column;
            gap: 2rem;
            row-gap: 0.5rem;

            & > * {
               border-radius: 1rem;
               overflow: hidden;
            }
         }

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
         .PanelCustomer-description {
            display: flex;
            flex-direction: column;
         }
         .PanelCustomer-devices-items {
            display: flex;
            flex-direction: column;
            flex-grow: 1;
            align-items: stretch;
            gap: 0.5rem;
         }
         .PanelCustomer-devices-loading {
            width: 100%;
            height: 4px;
         }
         .PanelCustomer-service {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;

            .PanelCustomer-service-item {
               width: 100%;
               display: flex;
               flex-direction: column;
               gap: 0.2rem;
               padding: 1rem;

               border-radius: 1rem;
               background: white;
               border: 1px solid hsla(0, 0%, 0%, 0.2);
               font-size: 1rem;
               cursor: pointer;
               text-align: start;
               text-decoration: none;
               color: inherit;

               .PanelCustomer-service-item-title {
                  font-weight: 600;
               }
            }
         }
         .PanelCustomer-order {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;

            .PanelCustomer-order-item {
               width: 100%;
               display: flex;
               flex-direction: column;
               gap: 0.2rem;
               padding: 1rem;

               border-radius: 1rem;
               background: white;
               border: 1px solid hsla(0, 0%, 0%, 0.2);
               font-size: 1rem;
               cursor: pointer;
               text-align: start;
               text-decoration: none;
               color: inherit;

               .PanelCustomer-order-item-title {
                  font-weight: 600;
               }
            }
         }
      }
   }
</style>
