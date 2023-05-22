<script>
   import ImageView from "@/components/ImageView.vue";
   import chroma from "chroma-js";
   import U from "@/U";

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
            return U.isColorDark(primaryColor, 60);
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
      :class="['PanelProductsGroupArrow', 'transition']"
      :style="{
         '--rotation': rotation,
         left: isLeft ? '0' : 'unset',
         right: isRight ? '0' : 'unset',
      }"
      :isShowing="`${isShowing}`"
      @click="() => $emit('click')"
   >
      <img class="PanelProductsGroupArrow-arrow" :src="arrowIcon" />
   </button>
</template>

<style lang="scss" scoped>
   .PanelProductsGroupArrow {
      --rotation: 90deg;

      --size: 3rem;
      width: var(--size);
      height: var(--size);
      min-width: var(--size);
      min-height: var(--size);
      max-width: var(--size);
      max-height: var(--size);
      aspect-ratio: 1;

      position: sticky;
      top: calc(50% - var(--size));
      bottom: 0;

      border-radius: 0.5rem;
      overflow: hidden;

      background: hsla(0, 0%, 100%, 0.9);
      box-shadow: 0 0 2rem hsla(0, 0%, 0%, 0.2);
      border: 1px solid hsla(0, 0%, 0%, 0.2);
      cursor: pointer;

      display: flex;
      align-items: center;
      justify-content: center;

      .PanelProductsGroupArrow-arrow {
         --size: 0.8rem;
         width: var(--size);
         height: var(--size);
         opacity: 0.66;
         pointer-events: none;
         transform: rotate(var(--rotation));
      }

      &:hover {
         transform: scale(1.05);
      }
   }
   .PanelProductsGroupArrow[isShowing="false"] {
      opacity: 0;
      pointer-events: none;
   }
</style>
