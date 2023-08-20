<script>
  import IconLinkWhite from "@/assets/link-FFFFFF.svg";
  import IconLinkColor from "@/assets/link-1673E1.svg";
  import IconExternalColor from "@/assets/external-1673E1.svg";
  import IconExternalWhite from "@/assets/external-FFFFFF.svg";
  export default {
    props: {
      to: { default: "" },
      href: { type: String, default: "" },
      target: { type: String, default: "" },
      icon: { type: String },
    },
    data: () => ({ isHover: false }),
    computed: {
      iconLinkWhite() {
        return this.icon ?? IconLinkWhite;
      },
      iconLinkColor() {
        return this.icon ?? IconLinkColor;
      },
      iconExternalWhite() {
        return this.icon ?? IconExternalWhite;
      },
      iconExternalColor() {
        return this.icon ?? IconExternalColor;
      },
    },
    mounted() {
      const refLink = this.$refs.link;
      const refExternal = this.$refs.external;

      if (refLink) this.listenElement(refLink.$el);
      if (refExternal) this.listenElement(refExternal);
    },
    methods: {
      listenElement(element) {
        element.addEventListener("mouseenter", this.mouseEnter);
        element.addEventListener("mouseleave", this.mouseLeave);
        element.addEventListener("touchstart", this.mouseEnter);
        element.addEventListener("touchend", this.mouseLeave);
      },
      mouseEnter() {
        this.isHover = true;
      },
      mouseLeave() {
        this.isHover = false;
      },
    },
  };
</script>

<template>
  <a
    class="SectionWhatElse-Item"
    ref="external"
    v-if="!!href"
    :href="href"
    :target="target"
  >
    <slot />
    <img :src="isHover ? iconExternalWhite : iconExternalColor" />
  </a>

  <router-link
    class="SectionWhatElse-Item"
    ref="link"
    v-else-if="!!to"
    :to="to"
  >
    <slot />
    <img :src="isHover ? iconLinkWhite : iconLinkColor" />
  </router-link>

  <span class="SectionWhatElse-Item" v-else>
    <slot />
  </span>
</template>

<style lang="scss" scoped>
  .SectionWhatElse-Item {
    width: 100%;
    height: 100%;
    min-height: 3.5em;
    color: var(--primary-color);

    font-size: 0.9em;
    font-weight: 600;

    position: relative;

    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  a.SectionWhatElse-Item {
    border: 2px solid var(--primary-color);
    border-radius: 1em;
    text-decoration: none;

    &:hover {
      background: var(--primary-color);
      color: white;
    }
    img {
      position: absolute;
      pointer-events: none;
      right: 0.8em;

      width: 0.8em;
      height: 0.8em;
    }
  }
</style>
