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
         'PanelProductsGroupArrow',
         isShowing ? '' : 'PanelProductsGroupArrow-isHidden',
         'transition',
      ]"
      :style="{
         '--rotation': rotation,
         left: isLeft ? '1rem' : 'unset',
         right: isRight ? '1rem' : 'unset',
      }"
      @click="() => $emit('click')"
   >
      <img class="PanelProductsGroupArrow-arrow transition" :src="arrowIcon" />
   </button>
</template>

<style lang="scss" scoped>
   .PanelProductsGroupArrow {
      --rotation: 90deg;

      --size: 2.5rem;
      width: var(--size);
      height: var(--size);
      aspect-ratio: 1;

      position: absolute;
      top: calc(50% - var(--size));
      bottom: 0;

      border-radius: 0.5rem;
      overflow: hidden;

      background-color: hsla(0, 0%, 100%, 0.9);
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
   .PanelProductsGroupArrow-isHidden {
      opacity: 0;
      pointer-events: none;
   }
</style>
