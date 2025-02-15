<script>
import chroma from 'chroma-js';

import {
  POPUP_MENU_ALIGNMENT,
  POPUP_MENU_WIDTH,
} from '@/app/popupMenu/PopupMenuOption';
import {
  INFO_SERVICE_EVENT_METHOD,
  PURCHASE_SERVICE_EVENT_METHOD,
  QUOTATION_SERVICE_EVENT_METHOD,
} from '@/items/ServiceEventMethod';
import { useAppStore } from '@/stores/app.store';
import { useLoginStore } from '@/stores/login.store';
import { useServiceStore } from '@/stores/service.store';

import TextArea from '@/components/InputTextArea.vue';
import Menu from '@/components/Menu.vue';

import AddImage from './PanelService-AddEvent-AddImage.vue';

export default {
  components: { Menu, TextArea, AddImage },
  data: (c) => ({
    methodMenuWidth: POPUP_MENU_WIDTH.SAME,
    methodMenuAlignment: POPUP_MENU_ALIGNMENT.VERTICAL,

    eventImagePreviews: [],

    nameOfUser: 'unknown',
    eventMethod: QUOTATION_SERVICE_EVENT_METHOD.key,
    eventDescription: '',
    eventStatus: '',
    eventAmount: 0,
    eventImages: [],
  }),
  computed: {
    primaryColor: (c) => c.methodMenu.color,
    primaryColor1: (c) => c.primaryColor.mix('ffffff', 0.45),
    primaryColor2: (c) => c.primaryColor.mix('ffffff', 0.6),

    isMethodInfo: (c) => c.eventMethod === INFO_SERVICE_EVENT_METHOD.key,
    isMethodQuotation: (c) =>
      c.eventMethod === QUOTATION_SERVICE_EVENT_METHOD.key,
    isMethodPurchase: (c) =>
      c.eventMethod === PURCHASE_SERVICE_EVENT_METHOD.key,

    methodMenu: (c) => c.methodMenus.find((menu) => menu.key === c.eventMethod),
    methodMenus: (c) => [
      {
        key: QUOTATION_SERVICE_EVENT_METHOD.key,
        title: 'Quotation',
        color: chroma('961d96'),
        click: (menu) => {
          c.eventMethod = menu.key;
          c.invalidateMethod();
        },
      },
      {
        key: PURCHASE_SERVICE_EVENT_METHOD.key,
        title: 'Purchase',
        color: chroma('258915'),
        click: (menu) => {
          c.eventMethod = menu.key;
          c.invalidateMethod();
        },
      },
    ],

    user: (c) => useLoginStore().user,
    isUserDefault: (c) => {
      if (c.user.isTypeNone()) return false;
      const isUserAdmin = c.user.isTypeAdmin() && c.user.isDefault();
      const isUserStaff = c.user.isTypeStaff() && c.user.isDefault();
      return isUserAdmin || isUserStaff;
    },
    nameUserType: (c) => {
      if (c.user.isTypeAdmin()) return 'Admin';
      if (c.user.isTypeStaff()) return 'Staff';
      return 'unknown';
    },
  },
  watch: {
    user() {
      this.invalidateUser();
    },
    nameOfUser() {
      if (this.nameOfUser.includes(' ')) {
        this.nameOfUser = this.nameOfUser.trim().replace(' ', '');
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
      if (this.isMethodQuotation || this.isMethodPurchase) InputAmount.focus();
    },
    invalidateUser() {
      const user = this.user;
      if (!user.isTypeNone()) {
        this.nameOfUser = this.isUserDefault ? '' : user.name;
      }
    },

    clear() {
      this.nameOfUser = '';

      this.eventDescription = '';
      this.eventStatus = '';
      this.eventAmount = 0;
      this.eventImages = [];

      this.invalidateEventImages();
      this.invalidateUser();
    },
    submit() {
      if (this.isUserDefault && !this.nameOfUser.trim()) {
        useAppStore().snackbarShow('You must specify your name');
        return;
      }
      if (!this.eventDescription.trim()) {
        useAppStore().snackbarShow('You must specify "Description"');
        return;
      }

      const event = {
        timestamp: Date.now(),
        method: this.eventMethod,
        description: this.eventDescription,
        images: this.eventImages,
      };

      if (this.isMethodInfo) {
        event.status = this.eventStatus;
      } else if (this.isMethodQuotation || this.isMethodPurchase) {
        event.price = { amount: this.eventAmount, currency: 'RM' };
      }

      if (this.isUserDefault && this.nameOfUser.trim()) {
        event.nameOfUser = this.nameOfUser;
      }

      if (event) {
        this.$emit('click-submit', event);
        this.clear();
      }
    },

    focus() {
      setTimeout(() => {
        this.$refs.InputDescription.focus();
      }, 100);
    },

    async onInputImageFile(event) {
      const { files } = event.target;
      const imageFiles = [];
      for (const file of files) imageFiles.push(file);
      const tempImageContents =
        await useServiceStore().addImageTemp(imageFiles);
      const images = imageFiles.map((imageFile, index) => {
        const tempImageContent = tempImageContents[index];

        return {
          name: tempImageContent.name,
          timeout: tempImageContent.timeout,
          expiry: tempImageContent.expiry,
          file: imageFile,
        };
      });

      this.eventImages.push(...images);

      this.invalidateEventImages();
    },
    async invalidateEventImages() {
      const promises = this.eventImages.map((eventImage) => {
        const { file } = eventImage;

        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (event) => {
            resolve(event.target.result);
          };
          reader.readAsDataURL(file);
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
      <AddImage @change="(event) => onInputImageFile(event)" />

      <div class="AddEvent-line"></div>

      <input
        v-if="isUserDefault"
        class="AddEvent-user"
        :style="{ 'grid-area': 'user' }"
        type="text"
        placeholder="Your name here"
        v-model="nameOfUser"
      />
      <span v-else class="AddEvent-user" :style="{ 'grid-area': 'user' }">
        {{ nameOfUser }}
      </span>
    </div>

    <div class="AddEvent-confirm" :style="{ 'grid-area': 'confirm' }">
      <button
        class="transition"
        :style="{ 'grid-area': 'enter' }"
        @click="() => submit()"
      >
        Enter
      </button>
      <button :style="{ 'grid-area': 'clear' }" @click="() => clear()">
        Discard
      </button>
    </div>

    <div class="AddEvent-status" :style="{ 'grid-area': 'status' }">
      <div class="AddEvent-status-amount">
        <span>RM</span>
        <input
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
        :alignment="methodMenuAlignment"
        :width="methodMenuWidth"
      >
        <span>{{ methodMenu.title }}</span>
        <img src="@/assets/icon/arrowDown-FFFFFF.svg" alt="Click to select" />
      </Menu>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.AddEvent {
  width: 100%;

  display: grid;
  grid-template-areas:
    'description status'
    'images status'
    'footer confirm';
  grid-template-columns: 1fr 10rem;

  border-top: 1px solid hsla(0, 0%, 0%, 0.05);
  background: var(--primary-color-2);
  overflow: hidden;
  position: sticky;
  bottom: 0;

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
    min-height: 2.5rem;

    --scrollbar-size: 0.5em;
    --scrollbar-thumb-radius: 0.5em;
    --scrollbar-thumb-color: hsla(0, 0%, 0%, 0.1);
    --scrollbar-thumb-color-hover: hsla(0, 0%, 0%, 0.6);
    --scrollbar-track-color: hsla(0, 0%, 0%, 0.1);
    --scrollbar-track-color-hover: hsla(0, 0%, 0%, 0.1);

    --padding: 0.5rem;
    padding: var(--padding);
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
      background: white;
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

    :nth-child(1) {
      border-radius: 0.5rem;
      padding: 0.5rem 0.8rem;
      background: var(--primary-color);
      color: white;

      &:hover,
      &:focus {
        transform: scale(1.1);
      }
    }
    :nth-child(2) {
      color: var(--primary-color);

      img {
        width: 1rem;
        height: 1rem;
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
    background: var(--primary-color-1);

    .AddEvent-status-header {
      width: 100%;
      border-radius: 0;

      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      align-items: center;
      justify-content: space-between;
      background: var(--primary-color);
      color: white;
      padding: 0.5rem;
      font-size: 0.8rem;

      :nth-child(2) {
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
      :nth-child(1) {
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
      :nth-child(2) {
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
