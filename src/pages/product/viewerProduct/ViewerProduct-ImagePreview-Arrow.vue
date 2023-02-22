<script>
   import ImageView from "@/components/ImageView.vue";
   import chroma from "chroma-js"; // https://gka.github.io/chroma.js/

   const Direction = { Left: 1, Right: 2 };

   export default {
      Direction,

      components: { ImageView },
      props: {
         primaryColor: { type: Object },
         direction: { type: Number, default: Direction.Left },
         isShowing: { type: Boolean, default: false },
      },
      computed: {
         isLeft: (c) => c.direction === Direction.Left,
         isRight: (c) => c.direction === Direction.Right,

         primaryColorIsDark: (c) => {
            const primaryColor = chroma.valid(c.primaryColor)
               ? c.primaryColor
               : chroma("ffffff");
            return chroma.deltaE(primaryColor, "000000") < 60;
         },

         rotation() {
            if (this.isLeft) return "90deg";
            if (this.isRight) return "-90deg";
            return "unset";
         },
         arrowIcon: (c) =>
            c.primaryColorIsDark
               ? c.host.icon("arrowDown-white")
               : c.host.icon("arrowDown-black"),
      },
   };
</script>

<template>
   <button
      :class="[
         'ImagePreviewArrow',
         isShowing ? '' : 'ImagePreviewArrow-isHidden',
         'transition',
      ]"
      :style="{
         '--rotation': rotation,
         left: isLeft ? '0' : 'unset',
         right: isRight ? '0' : 'unset',
      }"
      @click="() => $emit('click')"
   >
      <img class="ImagePreviewArrow-arrow transition" :src="arrowIcon" />
   </button>
</template>

<style lang="scss" scoped>
   .ImagePreviewArrow {
      --rotation: 90deg;

      position: absolute;
      top: 0;
      bottom: 0;

      width: 4rem;
      height: 100%;

      background: none;
      border: none;
      cursor: pointer;

      display: flex;
      align-items: center;
      justify-content: center;

      .ImagePreviewArrow-arrow {
         width: 1.8rem;
         height: 1.8rem;
         opacity: 0.66;
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
