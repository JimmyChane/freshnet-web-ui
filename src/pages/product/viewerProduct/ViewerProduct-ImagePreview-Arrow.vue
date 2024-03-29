<script>
  import ImageView from "@/components/ImageView.vue";
  import IconDynamic from "@/components/IconDynamic.vue";
  import chroma from "chroma-js";

  import IconArrowDownWhite from "@/assets/icon/arrowDown-white.svg";
  import IconArrowDownDark from "@/assets/icon/arrowDown-black.svg";
  import { isColorDark } from "@/U";

  const Direction = { Left: 1, Right: 2 };

  export default {
    Direction,

    components: { ImageView, IconDynamic },
    props: {
      primaryColor: { type: Object },
      direction: { type: Number, default: Direction.Left },
      isShowing: { type: Boolean, default: false },
    },
    data() {
      return { IconArrowDownWhite, IconArrowDownDark };
    },
    computed: {
      isLeft: (c) => c.direction === Direction.Left,
      isRight: (c) => c.direction === Direction.Right,

      primaryColorIsDark: (c) => {
        const primaryColor = chroma.valid(c.primaryColor)
          ? c.primaryColor
          : chroma("ffffff");
        return isColorDark(primaryColor, 60);
      },

      rotation: (c) => {
        if (c.isLeft) return "90deg";
        if (c.isRight) return "-90deg";
        return "unset";
      },
      arrowIcon: (c) =>
        c.host
          .icon(c.primaryColorIsDark ? "arrowDown-white" : "arrowDown-black")
          .toUrl(),
    },
  };
</script>

<template>
  <button
    :class="[
      'transition',
      'ImagePreviewArrow',
      isShowing ? '' : 'ImagePreviewArrow-isHidden',
    ]"
    :style="{
      '--rotation': rotation,
      left: isLeft ? '0' : 'unset',
      right: isRight ? '0' : 'unset',
    }"
    @click="() => $emit('click')"
  >
    <IconDynamic
      class="ImagePreviewArrow-arrow transition"
      :primaryColor="primaryColor"
      :srcLight="IconArrowDownWhite"
      :srcDark="IconArrowDownDark"
    />
  </button>
</template>

<style lang="scss" scoped>
  .ImagePreviewArrow {
    --rotation: 90deg;

    position: absolute;
    top: 3.5rem;
    bottom: 0;

    width: 4rem;
    height: calc(100% - 7rem);

    background: none;
    border: none;
    cursor: pointer;

    display: flex;
    align-items: center;
    justify-content: center;

    .ImagePreviewArrow-arrow {
      font-size: 1.8rem;
      padding: 0;

      opacity: 0.8;
      pointer-events: none;

      transform: rotate(var(--rotation));
    }

    &:hover {
      .ImagePreviewArrow-arrow {
        transform: rotate(var(--rotation)) scale(1.3);
      }
    }
  }
  .ImagePreviewArrow-isHidden {
    opacity: 0;
    pointer-events: none;
  }
</style>
