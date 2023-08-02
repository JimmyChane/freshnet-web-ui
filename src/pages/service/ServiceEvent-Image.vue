<script>
  import MenuOption from "@/components/button/MenuOption.vue";
  import ImageView from "@/components/ImageView.vue";
  import ServiceEvent from "@/items/ServiceEvent";
  import ServiceEventMethod from "@/items/ServiceEventMethod";

  export default {
    components: { MenuOption, ImageView },
    props: {
      event: { type: ServiceEvent },
      src: {},
    },
    computed: {
      isInitial() {
        return this.event.method === ServiceEventMethod.INITIAL.key;
      },
    },
  };
</script>

<template>
  <div class="ServiceEventImage" v-if="isInitial">
    <button class="ServiceEventImage-image-button" @click="$emit('click')">
      <ImageView class="ServiceEventImage-image" :src="src" />
    </button>

    <div class="ServiceEventImage-foreground transition"></div>
    <div class="ServiceEventImage-option">
      <MenuOption
        :menus="[
          {
            key: 'delete',
            title: 'Delete',
            interact: () => $emit('click-remove', src),
          },
        ]"
      />
    </div>
  </div>

  <ImageView
    class="ServiceEvent-Image"
    v-else
    :src="src"
    @click="() => $emit('click')"
  />
</template>

<style lang="scss" scoped>
  .ServiceEventImage {
    width: inherit;
    height: var(--image-height);
    position: relative;
    display: flex;
    flex-direction: row;
    border-radius: inherit;
    &:hover {
      .ServiceEventImage-foreground {
        opacity: 1;
      }
    }
    .ServiceEventImage-image-button {
      width: inherit;
      height: inherit;
      z-index: 1;
      display: flex;
      flex-direction: row;
      border: none;
      border-radius: inherit;
      background: none;
      cursor: pointer;
      &:focus {
        .ServiceEventImage-image {
          transform: scale(0.96);
        }
      }
      .ServiceEventImage-image {
        width: inherit;
        height: inherit;
        object-fit: cover;
        display: flex;
        flex-direction: row;
        border-radius: inherit;
        border: 1px solid hsl(0, 0%, 80%);
      }
    }
    .ServiceEventImage-foreground {
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
    .ServiceEventImage-option {
      z-index: 3;
      position: absolute;
      top: 0.2rem;
      right: 0.2rem;
    }
  }

  .ServiceEvent-Image {
    height: var(--image-height);
    width: max-content;
    border-radius: 0.3em;
  }
</style>
