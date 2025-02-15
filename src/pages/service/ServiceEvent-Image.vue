<script>
import { ServiceEvent } from '@/items/ServiceEvent';
import { INITIAL_SERVICE_EVENT_METHOD } from '@/items/ServiceEventMethod';

import ImageView from '@/components/ImageView.vue';
import MenuOption from '@/components/button/MenuOption.vue';

export default {
  components: { MenuOption, ImageView },
  props: {
    event: { type: ServiceEvent },
    src: {},
  },
  computed: {
    isInitial() {
      return this.event.method === INITIAL_SERVICE_EVENT_METHOD.key;
    },
    menus() {
      return [
        {
          key: 'delete',
          title: 'Delete Image',
          interact: () => this.$emit('click-remove', this.src),
        },
      ];
    },
  },
};
</script>

<template>
  <div class="ServiceEvent-Image">
    <button class="ServiceEvent-Image-img-button" @click="$emit('click')">
      <ImageView class="ServiceEvent-Image-img" :src="src" />
    </button>

    <div class="ServiceEvent-Image-foreground transition"></div>
    <div class="ServiceEvent-Image-option">
      <MenuOption :menus="menus" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.ServiceEvent-Image {
  width: max-content;
  min-width: 6rem;
  height: var(--image-height);
  position: relative;
  display: flex;
  flex-direction: row;
  border-radius: 0.3em;
  object-fit: cover;

  &:hover {
    .ServiceEvent-Image-foreground {
      opacity: 1;
    }
  }

  .ServiceEvent-Image-img-button {
    width: inherit;
    height: inherit;
    min-width: inherit;
    z-index: 1;
    display: flex;
    flex-direction: row;
    border: none;
    border-radius: inherit;
    background: none;
    cursor: pointer;
    object-fit: inherit;
    &:focus {
      .ServiceEvent-Image-img {
        transform: scale(0.96);
      }
    }

    .ServiceEvent-Image-img {
      width: inherit;
      height: inherit;
      min-width: inherit;
      object-fit: cover;
      display: flex;
      flex-direction: row;
      border-radius: inherit;
      border: 1px solid hsl(0, 0%, 80%);
      object-fit: inherit;
    }
  }
  .ServiceEvent-Image-foreground {
    z-index: 2;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 100%;
    min-width: 100%;
    min-height: 100%;
    max-width: 100%;
    max-height: 100%;
    border-radius: inherit;
    pointer-events: none;
    background: hsla(0, 0%, 100%, 0.7);
    opacity: 0;
  }
  .ServiceEvent-Image-option {
    z-index: 3;
    position: absolute;
    top: 0.2rem;
    right: 0.2rem;
  }
}
</style>
