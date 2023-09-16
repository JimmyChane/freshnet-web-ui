<script>
  import Setting from "@/items/Setting";

  export default {
    props: { isThin: { type: Boolean, default: false } },
    data: (c) => ({ address: "", link: "" }),
    watch: {
      "$store.state.stores.setting.getters.lastModified"() {
        this.invalidate();
      },
    },
    mounted() {
      this.invalidate();
    },
    methods: {
      async invalidate() {
        this.address = await this.$store.state.stores.setting.dispatch(
          "findValueOfKey",
          {
            key: Setting.Key.Location,
          },
        );
        this.link = await this.$store.state.stores.setting.dispatch(
          "findValueOfKey",
          {
            key: Setting.Key.LocationLink,
          },
        );
      },
    },
  };
</script>

<template>
  <a
    :class="[
      'HomeSectionLocation',
      `HomeSectionLocation-${isThin ? 'isThin' : 'isWide'}`,
      'transition',
    ]"
    :href="link"
    target="__blank"
    v-if="address.length || link.length"
  >
    <div class="HomeSectionLocation-main">
      <span class="HomeSectionLocation-title">Find Us</span>
      <p class="HomeSectionLocation-content" v-if="address.length">{{
        address
      }}</p>
      <span class="HomeSectionLocation-click" v-if="link.length"
        >Click to Navigate</span
      >
    </div>

    <img
      class="HomeSectionLocation-img transition"
      :style="{ 'grid-area': 'img' }"
      src="@/assets/bg/store_front.webp"
    />
  </a>
</template>

<style lang="scss" scoped>
  .HomeSectionLocation {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;

    background: linear-gradient(101deg, #02b977 0%, #278b73 100%);

    aspect-ratio: 16/7;
    border-radius: 1em;
    overflow: hidden;
    color: white;

    text-decoration: none;
    position: relative;

    &:hover,
    &:focus {
      box-shadow: 0px 0px 1.5rem #278b73;
    }

    .HomeSectionLocation-main {
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      align-items: flex-start;
      padding: 2em;
      height: 100%;
      max-height: 12em;
      gap: 0.5em;
      z-index: 2;

      .HomeSectionLocation-title {
        font-weight: 600;
        font-size: 1.9em;
      }
      .HomeSectionLocation-content {
        font-size: 0.8em;
        opacity: 0.7;
        display: flex;
        flex-flow: column nowrap;
      }
      .HomeSectionLocation-click {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        text-decoration: underline;
        font-size: 0.8em;
      }
    }
    .HomeSectionLocation-img {
      z-index: 1;
      height: calc(100% - 5em);
      aspect-ratio: 1/1;
      aspect-ratio: 3/2;
      object-fit: cover;
      position: absolute;
      right: 0;
      top: 0;
      bottom: 0;
      border-radius: 0.5rem;
    }
  }
  .HomeSectionLocation-isThin {
    width: 100%;
    height: 100%;
    font-size: 0.8rem;
    .HomeSectionLocation-img {
      margin: 2.5em 2em 2.5em 0;
    }
  }
  .HomeSectionLocation-isWide {
    width: 100%;
    height: 100%;
    font-size: 1.2rem;
    .HomeSectionLocation-img {
      margin: 2.5em 2.5em 2.5em 0;
    }
  }
</style>
