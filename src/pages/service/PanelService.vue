<script>
   import Actionbar from "./PanelService-Actionbar.vue";
   import MenuIcon from "@/components/MenuIcon.vue";
   import Selector from "@/components/selector/Selector.vue";

   import ButtonAddImage from "./ButtonAddImage.vue";
   import ButtonImage from "./ButtonImage.vue";
   import ItemBelonging from "./ItemBelonging.vue";
   import Section from "./PanelService-Section.vue";
   import AddEvent from "./PanelService-AddEvent.vue";
   import PanelEvents from "./PanelEvents.vue";

   import ServiceStates from "@/items/tools/ServiceStates.js";

   import chroma from "chroma-js"; // https://gka.github.io/chroma.js/

   export default {
      components: {
         Actionbar,
         Selector,
         MenuIcon,
         ButtonAddImage,
         ButtonImage,
         AddEvent,
         PanelEvents,
         ItemBelonging,
         Section,
      },
      props: {
         service: { type: Object, default: () => null },
         actions: { type: Object, default: () => null },
      },
      data() {
         return {
            ServiceStates,
            nameOfUser: "",
            bookmarkHeaderIconIsHover: false,
         };
      },
      computed: {
         bookmarkMenuCorner: () => MenuIcon.Corner.BOTTOM_LEFT,

         isUrgent: (c) => c.service.isUrgent(),
         isWarranty: (c) => c.service.isWarranty(),

         customer: (c) => c.service.customer,
         name: (c) => c.customer.name,
         phoneNumber: (c) => c.customer.phoneNumber,
         phoneNumberStr: (c) => (c.phoneNumber ? c.phoneNumber.toString() : ""),
         isPhoneNumber: (c) => !!c.phoneNumberStr,

         description: (c) => c.service.description,
         belongings: (c) => c.service.belongings.map((belonging) => belonging),
         imageFiles: (c) => c.service.imageFiles,

         labels: (c) => c.service.labels,

         primaryColor: (c) => c.stateColor,
         stateColor() {
            if (this.service) {
               const res = ServiceStates.list.find((s) => {
                  return s.key === this.service.state;
               });
               if (res) return chroma(res.color);
            }

            return chroma("white");
         },
         backgroundColor() {
            const { primaryColor } = this;
            if (primaryColor) return primaryColor.mix("e6e6e6", 0.9);
            return chroma("white");
         },
         actionbarColor() {
            const { backgroundColor } = this;
            if (backgroundColor) return backgroundColor.brighten(0.4);
            return "inherit";
         },
         actionbarBorder() {
            const { actionbarColor } = this;
            if (actionbarColor) return actionbarColor.darken(0.8);
            return "none";
         },
      },
      watch: {
         service() {
            this.invalidate();
         },
      },
      methods: {
         async invalidate() {
            this.nameOfUser = await this.getOwnerNameFromItem();
         },
         async getOwnerNameFromItem() {
            const { service } = this;

            if (!service) return "";

            const name = await service.fetchName().catch((error) => {
               this.$root.feedback("Error getting user for service");
               return "";
            });

            if (service !== this.service) return;
            if (name.length) return name;

            return "unknown";
         },
         onImageAdd(imageFile) {
            this.serviceStore
               .dispatch("addImageToId", {
                  serviceID: this.service.id,
                  imageFile,
               })
               .then((serivce) => {})
               .catch((error) => {
                  this.$root.feedback("Failed to Add Image");
               });
         },
      },
      mounted() {
         this.invalidate();
      },
   };
</script>

<template>
   <div class="PanelService" :style="{ '--primary-color': backgroundColor }">
      <Actionbar
         :style="{ 'z-index': '3' }"
         :service="service"
         :actionbarColor="actionbarColor"
         :actionbarBorder="actionbarBorder"
         :actions="actions"
      />

      <div v-if="service" class="PanelService-body">
         <div class="PanelService-body-body">
            <div class="PanelService-body-header">
               <Selector
                  class="PanelService-actionbar-state-selector"
                  :list="ServiceStates.list"
                  :keySelected="service.state"
                  @callback-select="
                     (state) => {
                        serviceStore.dispatch('updateStateOfId', {
                           serviceID: service.id,
                           state,
                        });
                     }
                  "
               />

               <div class="PanelService-section-label">
                  <div class="PanelService-section-labels">
                     <button
                        class="PanelService-section-labels-item"
                        v-for="label in labels"
                        :key="label.title"
                        :style="{ '--primary-color': `#${label.hexColor}` }"
                        @click="
                           () => {
                              serviceStore.dispatch('removeLabelFromId', {
                                 serviceID: service.id,
                                 label,
                              });
                           }
                        "
                     >
                        <span class="PanelService-section-labels-item-title transition">
                           {{ label.title }}
                        </span>
                        <img
                           class="PanelService-section-labels-item-close transition"
                           :src="host.icon('close-FFFFFF')"
                        />
                     </button>
                  </div>

                  <MenuIcon
                     class="PanelService-section-label-option"
                     :corner="bookmarkMenuCorner"
                     :menus="
                        [
                           {
                              key: 'urgent',
                              title: 'Urgent',
                              click: () => {
                                 serviceStore.dispatch('updateUrgentOfId', {
                                    serviceID: service.id,
                                    isUrgent: !service.isUrgent(),
                                 });
                              },
                           },
                           {
                              key: 'warranty',
                              title: 'Warranty',
                              click: () => {
                                 serviceStore.dispatch('updateWarrantyOfId', {
                                    serviceID: service.id,
                                    isWarranty: !service.isWarranty(),
                                 });
                              },
                           },
                        ].filter((menu) => {
                           const label = labels.find(
                              (label) => label.title === menu.title,
                           );
                           return !label;
                        })
                     "
                     @mouseover="bookmarkHeaderIconIsHover = true"
                     @mouseleave="bookmarkHeaderIconIsHover = false"
                     :src="
                        bookmarkHeaderIconIsHover
                           ? host.icon('bookmark-add-505050')
                           : host.icon('bookmark-505050')
                     "
                  />
               </div>
            </div>

            <AddEvent @callback-create="(event) => actions.onClickToAddEvent(event)" />

            <PanelEvents
               v-if="service"
               :service="service"
               @click-remove-event="
                  (event) => actions.onClickRemoveEvent({ service, event })
               "
            />

            <div class="PanelService-sections">
               <div class="PanelService-sections-body">
                  <Section title="Collected By">
                     <div class="PanelService-section-collectedBy">
                        <span>{{ nameOfUser }}</span>
                     </div>
                  </Section>

                  <Section
                     :menus="{
                        title: 'Update Customer',
                        icon: host.icon('edit-505050'),
                        click: () => actions.onClickUpdateCustomer(customer),
                     }"
                  >
                     <div class="PanelService-section-customer">
                        <div class="PanelService-section-customer-info" v-if="customer">
                           <span class="PanelService-section-customer-name" v-if="name">{{
                              name
                           }}</span>
                           <span
                              class="PanelService-section-customer-phoneNumber"
                              v-if="phoneNumberStr"
                              >{{ phoneNumberStr }}</span
                           >
                        </div>

                        <div class="PanelService-section-customer-contactLinks">
                           <a
                              class="transition"
                              :href="`https://api.whatsapp.com/send?phone=6${phoneNumberStr}`"
                              target="_blank"
                              v-if="isPhoneNumber"
                           >
                              <img
                                 :src="host.icon('whatsapp-color')"
                                 alt="Whatsapp Logo"
                              />
                              <span>Chat with Whatsapp</span>
                           </a>

                           <a
                              class="transition"
                              :href="`tel:+6${phoneNumberStr}`"
                              v-if="isPhoneNumber"
                           >
                              <img :src="host.icon('call-000000')" alt="Call Logo" />
                              <span>Call</span>
                           </a>

                           <router-link
                              class="transition"
                              :to="{
                                 path: '/manage/customer',
                                 query: {
                                    name: name,
                                    phoneNumber: phoneNumberStr,
                                 },
                              }"
                           >
                              <span>Find</span>
                           </router-link>
                        </div>
                     </div>
                  </Section>

                  <Section
                     title="Problem"
                     :menus="{
                        title: 'Update Problem',
                        icon: host.icon('edit-505050'),
                        click: () => actions.onClickUpdateDescription(description),
                     }"
                  >
                     <div class="PanelService-section-description" v-if="description">
                        <p class="PanelService-section-description-text">{{
                           description
                        }}</p>
                     </div>
                  </Section>

                  <Section
                     title="Belongings"
                     :menus="{
                        title: 'Update Belongings',
                        icon: host.icon('edit-505050'),
                        click: () => actions.onClickUpdateBelongings(belongings),
                     }"
                  >
                     <div class="PanelService-section-belonging" v-if="belongings.length">
                        <ItemBelonging
                           v-for="belonging in belongings"
                           :key="belonging.title"
                           :belonging="belonging"
                        />
                     </div>
                     <div class="PanelService-section-belonging-empty" v-else>
                        <span>Emtpy</span>
                     </div>
                  </Section>

                  <Section>
                     <div class="PanelService-section-image">
                        <ButtonAddImage
                           class="PanelService-section-image-add"
                           @callback-result="onImageAdd"
                        />
                        <ButtonImage
                           class="PanelService-section-image-item"
                           v-for="imageFile in imageFiles"
                           :key="imageFile.name"
                           :src="imageFile"
                           @click="() => $root.imageViewerShow(imageFile, imageFiles)"
                           @click-remove="actions.onClickRemoveImage(imageFile)"
                        />
                        <div
                           class="PanelService-section-image-empty"
                           v-if="!imageFiles.length"
                        >
                           <span>No Images</span>
                        </div>
                     </div>
                  </Section>
               </div>
            </div>
         </div>
      </div>
   </div>
</template>

<style lang="scss" scoped>
   .PanelService {
      width: unset;
      height: 100%;
      min-width: 100%;
      display: flex;
      flex-direction: column;
      line-height: 1.2;
      position: relative;
      overflow-y: auto;
      background-color: var(--primary-color);
      padding-bottom: 10rem;

      .PanelService-body {
         z-index: 2;
         display: flex;
         flex-direction: column;
         align-items: center;

         .PanelService-body-body {
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 1rem;

            .PanelService-body-header {
               z-index: 2;
               width: 100%;
               max-width: 40rem;
               display: flex;
               flex-direction: row;
               flex-wrap: nowrap;
               flex-grow: 1;
               align-items: flex-start;
               justify-content: space-between;
               gap: 1.2rem;

               .PanelService-actionbar-state-selector {
                  width: 100%;
                  max-width: 12rem;
                  flex-grow: 1;
               }

               .PanelService-section-label {
                  width: max-content;
                  display: flex;
                  flex-direction: row;
                  align-items: flex-start;
                  justify-content: flex-start;
                  gap: 0.1em;

                  .PanelService-section-labels {
                     min-height: 2.5em;
                     display: flex;
                     flex-direction: row;
                     flex-wrap: wrap;
                     align-items: center;
                     justify-content: flex-start;
                     gap: 0.1em;
                     & > * {
                        display: flex;
                        flex-direction: row;
                        align-items: center;
                        justify-content: center;
                        gap: 0.3em;
                        background: var(--primary-color);
                        color: white;
                        font-size: 0.8em;
                        padding: 0.2em 0.4em;
                        border-radius: 0.2em;
                        cursor: pointer;
                        padding-left: 0.5em;
                        border: none;
                        .PanelService-section-labels-item-close {
                           width: 0.8em;
                           height: 0.8em;
                           opacity: 0;
                        }
                        &:hover {
                           .PanelService-section-labels-item-title {
                              opacity: 0.5;
                           }
                           .PanelService-section-labels-item-close {
                              opacity: 1;
                           }
                        }
                     }
                  }
               }
            }

            .PanelService-sections {
               width: 100%;
               max-width: 40rem;
               z-index: 1;
               display: flex;
               flex-direction: column;
               align-items: stretch;

               border: 1px solid rgba(0, 0, 0, 0.05);
               border-bottom: none;
               border-radius: 1rem;
               overflow: hidden;

               .PanelService-section-collectedBy {
                  display: flex;
                  flex-direction: column;
                  align-items: flex-start;
                  justify-content: flex-start;
                  .PanelService-section-user {
                     width: 100%;
                     display: flex;
                     flex-direction: column;
                     align-items: flex-start;
                     text-align: start;
                  }
               }
               .PanelService-section-customer {
                  width: 100%;
                  display: flex;
                  flex-direction: row;
                  flex-direction: column;
                  align-items: flex-start;
                  flex-wrap: nowrap;
                  justify-content: space-between;

                  align-items: center;
                  gap: 0.5rem;

                  .PanelService-section-customer-info {
                     width: 100%;
                     display: flex;
                     flex-direction: column;
                     align-items: flex-start;

                     .PanelService-section-customer-name {
                        font-weight: 500;
                     }
                     .PanelService-section-customer-phoneNumber {
                        font-size: 0.9rem;
                     }
                  }

                  .PanelService-section-customer-contactLinks {
                     width: 100%;
                     gap: 0.2rem;
                     display: flex;
                     flex-direction: row;
                     flex-wrap: wrap;

                     & > * {
                        padding: 0.7rem;
                        gap: 0.5rem;
                        text-decoration: none;
                        color: inherit;
                        background-color: #f4f4f4;
                        border: 1px solid #dddddd;
                        border-radius: 1rem;

                        display: flex;
                        flex-direction: row;
                        align-items: center;

                        &:hover {
                           background-color: #e4e4e4;
                        }

                        img {
                           width: 1rem;
                           height: 1rem;
                        }
                     }
                  }
               }
               .PanelService-section-description {
                  width: 100%;
                  display: flex;
                  flex-direction: column;

                  .PanelService-section-description-text {
                     display: flex;
                     flex-direction: row;
                     align-items: flex-start;
                     justify-content: flex-start;
                     word-wrap: break-word;

                     white-space: pre-line;
                  }
               }

               .PanelService-section-belonging {
                  display: flex;
                  flex-direction: column;
                  gap: 0.2rem;
                  border-radius: 0.6rem;
                  overflow: hidden;
               }
               .PanelService-section-belonging-empty {
                  & > * {
                     font-size: 0.8rem;
                     color: hsla(0, 0%, 0%, 0.4);
                  }
               }

               .PanelService-section-image {
                  display: flex;
                  flex-direction: row;
                  align-items: center;
                  overflow-y: visible;
                  overflow-x: auto;
                  gap: 8px;

                  --image-width: 5.5rem;
                  --image-height: 5.5rem;
                  --scrollbar-size: 0.3em;
                  --scrollbar-track-margin: 1.2rem;

                  & > * {
                     border-radius: 0.5rem;
                  }

                  .PanelService-section-image-add {
                     width: var(--image-width);
                     height: var(--image-height);
                     min-width: var(--image-width);
                     min-height: var(--image-height);
                     max-width: var(--image-width);
                     max-height: var(--image-height);
                  }
                  .PanelService-section-image-item {
                     height: var(--image-height);
                     // width: var(--image-width);
                  }
                  .PanelService-section-image-empty {
                     width: 100%;
                     height: var(--image-height);
                     flex-grow: 1;

                     border-radius: 0.6rem;
                     background-color: hsla(0, 0%, 100%, 0.3);
                     display: flex;
                     align-items: center;
                     justify-content: center;

                     & > * {
                        font-size: 0.8rem;
                        color: hsla(0, 0%, 0%, 0.5);
                     }
                  }
               }
               .PanelService-section-image-empty {
                  padding: 0.25rem 1.2rem 0.25rem 1.2rem;
               }
            }
         }
      }
   }
</style>
