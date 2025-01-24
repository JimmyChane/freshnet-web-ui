<script>
import { format, formatDistanceToNow } from 'date-fns';

import IconTrash from '@/assets/icon/trash-000000.svg';
import MenuOption from '@/components/button/MenuOption.vue';
import WindowRemove from '@/components/window/WindowRemove.vue';
import Service from '@/items/Service';
import ServiceEvent from '@/items/ServiceEvent';
import {
  INFO_SERVICE_EVENT_METHOD,
  INITIAL_SERVICE_EVENT_METHOD,
  PURCHASE_SERVICE_EVENT_METHOD,
  QUOTATION_SERVICE_EVENT_METHOD,
} from '@/items/ServiceEventMethod';

import ImageView from './ServiceEvent-Image.vue';
import WindowUpdateEventDescription from './WindowUpdateEventDescription.vue';

export default {
  components: { MenuOption, ImageView },
  props: {
    service: { type: Service },
    event: { type: ServiceEvent, default: null },
    actions: { type: Object },
  },
  emits: ['callback-delete'],
  data: (c) => ({
    nameOfUser: 'loading...',
    isShowingMenu: false,
    isHovered: false,
  }),
  computed: {
    time() {
      return this.event?.timestamp?.time ?? 0;
    },
    timestampText() {
      const time = this.time;
      if (time === 0) return '';

      const distance = formatDistanceToNow(time);
      const distanceText = `(${distance} ago)`;

      const timeText = format(time, 'hh:mmaaa');

      return `${timeText} ${distanceText}`;
    },

    description() {
      return this.event.description;
    },
    images() {
      return this.event.images;
    },

    methodPrimaryColor() {
      return this.methodContext('primaryColor') ?? '';
    },
    methodTitle() {
      return this.methodContext('title') ?? '';
    },
    methodResult() {
      return this.event.toResult() ?? '';
    },

    infoTexts() {
      const texts = [this.timestampText, this.methodTitle, this.nameOfUser];
      return texts.filter((text) => text.length > 0);
    },

    shouldShowMenu() {
      return this.isShowingMenu || this.isHovered;
    },

    isInitial() {
      return this.event.method === INITIAL_SERVICE_EVENT_METHOD.key;
    },

    menus() {
      const menus = [
        {
          title: 'Edit Description',
          click: this.isInitial
            ? this.clickEditServiceDescription
            : this.clickEditDescription,
        },
      ];

      if (this.isInitial) {
        menus.push({
          title: 'Add Image',
          click: () => {
            const element = document.createElement('input');
            element.type = 'file';
            element.accept = '.jpeg, .jpg, .png, .webp';
            element.multiple = true;
            element.addEventListener('change', (event) => {
              const imageFiles = event.target.files;

              this.$store.state.stores.service
                .dispatch('addImageToId', {
                  serviceID: this.service.id,
                  imageFiles,
                })
                .then((serivce) => {})
                .catch((error) => {
                  this.$store.dispatch('snackbarShow', 'Failed to Add Image');
                });
            });

            const mouseEventOption = {
              view: window,
              bubbles: true,
              cancelable: false,
            };
            element.dispatchEvent(new MouseEvent('click', mouseEventOption));
          },
        });
      }
      if (!this.isInitial) {
        menus.push({
          title: 'Add Image',
          click: () => {
            const element = document.createElement('input');
            element.type = 'file';
            element.accept = '.jpeg, .jpg, .png, .webp';
            element.multiple = true;
            element.addEventListener('change', (e) => {
              this.$store.state.stores.service
                .dispatch('addEventImage', {
                  serviceID: this.service.id,
                  eventTime: this.time,
                  imageFiles: e.target.files,
                })
                .then((serivce) => {})
                .catch((error) => {
                  this.$store.dispatch('snackbarShow', 'Failed to Add Image');
                });
            });
            element.dispatchEvent(
              new MouseEvent('click', {
                view: window,
                bubbles: true,
                cancelable: false,
              }),
            );
          },
        });
        menus.push({
          title: 'Delete Event',
          icon: IconTrash,
          click: () => this.$emit('callback-delete', this.event),
        });
      }

      return menus;
    },
  },
  watch: {
    event() {
      this.invalidate();
    },
  },
  mounted() {
    this.invalidate();
  },
  methods: {
    async invalidate() {
      const { event } = this;

      if (!event) return (this.nameOfUser = '');

      const name = await this.event.fetchName().catch((error) => {
        this.$store.dispatch('snackbarShow', 'Error getting user for event');
        return '';
      });

      if (this.event !== event) return;
      if (name) this.nameOfUser = name;
    },

    methodContext(property = '') {
      if (this.event.isInfo()) return INFO_SERVICE_EVENT_METHOD[property];
      if (this.event.isQuotation())
        return QUOTATION_SERVICE_EVENT_METHOD[property];
      if (this.event.isPurchase())
        return PURCHASE_SERVICE_EVENT_METHOD[property];
      return null;
    },

    clickEditServiceDescription() {
      this.actions.onClickUpdateDescription(this.service.description);
    },
    clickEditDescription() {
      this.$store.dispatch('openPopupWindow', {
        component: WindowUpdateEventDescription,
        service: this.service,
        serviceEvent: this.event,
      });
    },
    clickRemoveServiceImage(image) {
      let onConfirm;
      if (this.isInitial) {
        onConfirm = async (accept, reject) => {
          try {
            const service = await this.$store.state.stores.service.dispatch(
              'removeImageFromId',
              { serviceID: this.service.id, image },
            );
            this.$store.dispatch('imageViewerHide');
            accept();
          } catch (error) {
            this.$store.dispatch('snackbarShow', 'Delete Image Failed');
            reject();
            throw error;
          }
        };
      } else {
        onConfirm = async (accept, reject) => {
          try {
            const requestOption = {
              serviceID: this.service.id,
              eventTime: this.time,
              image,
            };
            const service = await this.$store.state.stores.service.dispatch(
              'removeEventImage',
              requestOption,
            );
            this.$store.dispatch('imageViewerHide');
            accept();
          } catch (error) {
            this.$store.dispatch('snackbarShow', 'Delete Image Failed');
            reject();
            throw error;
          }
        };
      }

      this.$store.dispatch('openPopupWindow', {
        component: WindowRemove,
        title: 'Delete Image',
        message: 'After deleting this image, it cannot be reverted.',
        value: image,
        onConfirm,
      });
    },
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
          <span v-for="(info, index) in infoTexts" :key="info">
            {{ info }}
            <div
              class="ItemService-dot"
              v-if="index < infoTexts.length - 1"
            ></div>
          </span>
        </div>

        <span class="ItemEvent-problem" v-if="isInitial">Problem</span>

        <span class="ItemEvent-description">{{ description }}</span>

        <span :class="['ItemEvent-result', 'transition']" v-if="methodResult">
          {{ methodResult }}
        </span>
      </div>

      <div class="ItemEvent-right">
        <MenuOption
          class="ItemEvent-menu"
          :menus="menus"
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
        :event="event"
        @click="
          () => {
            const option = { image, thumbnails: images };
            $store.dispatch('imageViewerShow', option);
          }
        "
        @click-remove="() => clickRemoveServiceImage(image)"
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

  border-left: 3px solid var(--primary-color);
  border-radius: 0.6rem;

  --body-padding: 1rem;

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
      .ItemEvent-problem {
        font-size: 0.9rem;
        font-weight: 600;
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
    --image-height: 80px;

    padding: var(--padding);
    padding-top: 0;
    height: calc(var(--image-height) + var(--padding));
    display: flex;
    flex-direction: row;
    gap: 1px;

    overflow-x: auto;
  }
}
</style>
