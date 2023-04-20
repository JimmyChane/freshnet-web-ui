<script>
   import Actionbar from "./PanelService-Actionbar.vue";
   import MenuIcon from "@/components/MenuIcon.vue";
   import Selector from "@/components/selector/Selector.vue";

   import ButtonAddImage from "./ButtonAddImage.vue";
   import ButtonImage from "./ButtonImage.vue";
   import ItemBelonging from "./ItemBelonging.vue";
   import Section from "@/pages/manage/PanelItem-Section.vue";
   import AddEvent from "./PanelService-AddEvent.vue";
   import Events from "./PanelEvents.vue";

   import ServiceStates from "@/objects/ServiceStates.js";

   import chroma from "chroma-js";

   export default {
      components: {
         Actionbar,
         Selector,
         MenuIcon,
         ButtonAddImage,
         ButtonImage,
         AddEvent,
         Events,
         ItemBelonging,
         Section,
      },
      props: {
         service: { type: Object, default: () => null },
         actions: { type: Object, default: () => null },
      },
      data: (c) => ({
         ServiceStates,
         nameOfUser: "",
         bookmarkHeaderIconIsHover: false,
      }),
      computed: {
         windowWidth: (c) => c.$root.window.innerWidth,

         isWide: (c) => c.windowWidth > 600,

         bookmarkMenuCorner: () => MenuIcon.Corner.BOTTOM_LEFT,

         isUrgent: (c) => c.service.isUrgent(),
         isWarranty: (c) => c.service.isWarranty(),

         customer: (c) => c.service.customer,
         name: (c) => c.customer.name,
         phoneNumber: (c) => c.customer.phoneNumber,
         phoneNumberStr: (c) => c.phoneNumber?.toString() ?? "",
         isPhoneNumber: (c) => !!c.phoneNumberStr,

         description: (c) => c.service.description,
         belongings: (c) => c.service.belongings.map((belonging) => belonging),
         imageFiles: (c) => c.service.imageFiles,

         labels: (c) => c.service.labels,

         primaryColor: (c) => c.stateColor,
         stateColor() {
            if (!this.service) {
               return;
            }

            const res = ServiceStates.list.find((s) => {
               return s.key === this.service.state;
            });
            if (!res) {
               return chroma("white");
            }

            return chroma(res.color);
         },
         backgroundColor() {
            const { primaryColor } = this;

            if (!primaryColor) {
               return chroma("white");
            }
            return primaryColor.mix("e6e6e6", 0.9);
         },
         actionbarColor() {
            const { backgroundColor } = this;
            if (!backgroundColor) {
               return "inherit";
            }
            return backgroundColor.brighten(0.4);
         },
         actionbarBorder() {
            const { actionbarColor } = this;
            if (!actionbarColor) {
               return "none";
            }
            return actionbarColor.darken(0.8);
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

            if (!service) {
               return "";
            }

            const name = await service.fetchName().catch((error) => {
               this.store.dispatch(
                  "snackbarShow",
                  "Error getting user for service",
               );
               return "";
            });

            if (service !== this.service) {
               return;
            }
            if (name.length) {
               return name;
            }

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
                  this.store.dispatch("snackbarShow", "Failed to Add Image");
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
         <div class="PanelService-body-body" :isWide="`${isWide}`">
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
                        <span
                           class="PanelService-section-labels-item-title transition"
                        >
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
                           ? host.icon('bookmark-add-000000')
                           : host.icon('bookmark-000000')
                     "
                  />
               </div>
            </div>

            <AddEvent
               class="PanelService-AddEvent"
               @callback-create="(event) => actions.onClickToAddEvent(event)"
            />

            <Events
               class="PanelService-Events"
               v-if="service"
               :service="service"
               @click-remove-event="
                  (event) => actions.onClickRemoveEvent({ service, event })
               "
            />

            <div class="PanelService-sections">
               <div class="PanelService-sections-body">
                  <Section
                     title="Problem"
                     :menus="{
                        title: 'Update Problem',
                        icon: host.icon('edit-505050'),
                        click: () => {
                           actions.onClickUpdateDescription(description);
                        },
                     }"
                  >
                     <div
                        class="PanelService-section-description"
                        v-if="description"
                     >
                        <p class="PanelService-section-description-text">{{
                           description
                        }}</p>
                     </div>
                  </Section>

                  <Section
                     :title="`Belongings (${belongings.length})`"
                     :menus="{
                        title: 'Update Belongings',
                        icon: host.icon('edit-505050'),
                        click: () =>
                           actions.onClickUpdateBelongings(belongings),
                     }"
                  >
                     <div
                        class="PanelService-section-belonging"
                        v-if="belongings.length"
                     >
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

                  <Section :title="`Image Reference (${imageFiles.length})`">
                     <div class="PanelService-section-image scrollbar">
                        <ButtonAddImage
                           class="PanelService-section-image-add"
                           @callback-result="onImageAdd"
                        />
                        <ButtonImage
                           class="PanelService-section-image-item"
                           v-for="imageFile in imageFiles"
                           :key="imageFile.name"
                           :src="imageFile"
                           @click="
                              () =>
                                 store.dispatch('imageViewerShow', {
                                    image: imageFile,
                                    thumbnails: imageFiles,
                                 })
                           "
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

                  <Section title="Collected By">
                     <div class="PanelService-section-collectedBy">
                        <span>{{ nameOfUser }}</span>
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

      width: 100dvw;
      max-width: 100%;

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

            .PanelService-body-header {
               z-index: 2;
               width: 100%;
               max-width: 40rem;
               gap: 1.2rem;

               display: flex;
               flex-direction: row;
               flex-wrap: nowrap;
               flex-grow: 1;
               align-items: flex-start;
               justify-content: space-between;

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
                  flex-wrap: wrap;
                  align-items: center;
                  overflow-y: visible;
                  overflow-x: auto;
                  gap: 2px;

                  --image-width: 5.5rem;
                  --image-height: 5.5rem;
                  --scrollbar-size: 0.3em;
                  --scrollbar-thumb-color: rgba(0, 0, 0, 0.2);
                  --scrollbar-thumb-color-hover: rgba(0, 0, 0, 0.4);

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

         .PanelService-body-body[isWide="true"] {
            padding: 1rem;

            .PanelService-AddEvent {
               border-radius: 1em;
            }
            .PanelService-Events {
               border-radius: 1rem;
            }
            .PanelService-sections {
               border-radius: 1rem;
            }
         }
         .PanelService-body-body[isWide="false"] {
            .PanelService-body-header {
               padding: 1rem;
               margin-bottom: -1rem;
            }
         }
      }
   }
</style>
