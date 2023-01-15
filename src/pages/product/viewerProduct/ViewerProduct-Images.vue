<script>
   import ProductViewerImage from "./ViewerProduct-Images-Image.vue";
   import ProductViewerImageSelector from "./ViewerProduct-Images-Selector.vue";
   import chroma from "chroma-js";

   export default {
      components: { ProductViewerImage, ProductViewerImageSelector },
      emits: ["click-image", "click-add-image-file"],
      props: {
         indexAt: { type: Number, default: -1 },
         images: { type: Array, default: () => [] },
         isEditable: { type: Boolean, default: false },
         primaryColor: { type: Object },
      },
      computed: {
         isPrimaryColorDark: (c) => chroma.deltaE(c.primaryColor, "000000") < 60,
      },
   };
</script>

<template>
   <div
      :class="[
         'ProductViewerImages',
         isPrimaryColorDark
            ? 'ProductViewerImages-isDark'
            : 'ProductViewerImages-isLight',
      ]"
   >
      <div class="ProductViewerImages-list">
         <ProductViewerImage
            v-for="image of images"
            :image="image"
            :key="image.toUrl()"
            :isSelected="images.indexOf(image) === indexAt"
            @click="() => $emit('click-image', image)"
         />
         <ProductViewerImageSelector
            v-if="isEditable"
            @click-file="(file) => $emit('click-add-image-file', file)"
         />
      </div>
   </div>
</template>

<style lang="scss" scoped>
   .ProductViewerImages {
      width: 100%;
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      justify-content: flex-start;

      overflow-x: auto;
      overflow-y: hidden;

      padding-left: 1.75rem;
      padding-right: 1.75rem;

      --scrollbar-size: 0.3rem;
      --scrollbar-thumb-radius: 0.2rem;
      --scrollbar-track-margin: 1.9rem;
      --scrollbar-track-color: none;
      --scrollbar-track-color-hover: none;

      scrollbar-width: var(--scrollbar-size);
      scrollbar-color: var(--scrollbar-thumb-color) var(--scrollbar-track-color);
      &::-webkit-scrollbar {
         height: var(--scrollbar-size);
         width: var(--scrollbar-size);
      }
      &::-webkit-scrollbar-thumb {
         border-radius: var(--scrollbar-thumb-radius);
         background-color: var(--scrollbar-thumb-color);
         &:hover {
            background-color: var(--scrollbar-thumb-color-hover);
         }
      }
      &::-webkit-scrollbar-track {
         margin: var(--scrollbar-track-margin);
         background-color: var(--scrollbar-track-color);
         &:hover {
            background-color: var(--scrollbar-track-color-hover);
         }
      }

      .ProductViewerImages-list {
         --height: 4rem;
         width: 100%;
         min-width: max-content;
         height: var(--height);
         min-height: var(--height);

         display: flex;
         flex-direction: row;
         align-items: center;
         justify-content: center;
      }
   }
   .ProductViewerImages-isLight {
      --scrollbar-thumb-color: hsla(0, 0%, 0%, 0.4);
      --scrollbar-thumb-color-hover: hsla(0, 0%, 0%, 0.6);
   }
   .ProductViewerImages-isDark {
      --scrollbar-thumb-color: hsla(0, 0%, 100%, 0.4);
      --scrollbar-thumb-color-hover: hsla(0, 0%, 100%, 0.6);
   }
</style>
