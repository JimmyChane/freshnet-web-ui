<script>
   import ImageView from "@/components/ImageView.vue";
   import Arrow from "./ViewerProduct-ImagePreview-Arrow.vue";
   import chroma from "chroma-js"; // https://gka.github.io/chroma.js/

   export default {
      components: { ImageView, Arrow },
      emits: ["click-image", "click-remove", "click-previous", "click-next"],
      props: {
         primaryColor: { type: Object },
         allowEdit: { type: Boolean, default: false },
         product: { type: Object, default: () => null },

         image: { type: Object, default: () => null },

         hasImagePrevious: { type: Boolean, default: false },
         hasImageNext: { type: Boolean, default: false },

         hasProductPrevious: { type: Boolean, default: false },
         hasProductNext: { type: Boolean, default: false },
      },
      data: (c) => ({
         imageStyle: { scale: "1", x: "0%", y: "0%" },
         imageUrl: "",
         imageIsFetching: false,
         imageTransitionEnabled: false,

         ArrowDirection: Arrow.Direction,
      }),
      computed: {
         primaryColorIsDark: (c) => chroma.deltaE(c.primaryColor, "000000") < 60,

         arrowIcon: (c) =>
            c.primaryColorIsDark
               ? c.host.icon("arrowDown-white")
               : c.host.icon("arrowDown-black"),

         isThin: (c) => c.$root.window.innerWidth < 550,
         imageIsShowing() {
            if (this.imageIsFetching) return true;
            return !!this.imageUrl;
         },
      },
      watch: {
         product(product, wasProduct) {
            this.imageTransitionEnabled = true;
            if (!wasProduct && product) {
               this.imageTransitionEnabled = false;
               setTimeout(() => (this.imageTransitionEnabled = true), 700);
            }
         },
         image() {
            this.onImage();
         },
      },
      methods: {
         onImage() {
            this.imageUrl = "";
            if (this.image) {
               this.imageUrl = this.image.toUrl({
                  height: this.isThin ? 350 : 1200,
               });
            }
         },
         onImageMouseEnter(event) {
            this.imageStyle.scale = "1.5";
         },
         onImageMouseMove(event) {
            const { offsetWidth, offsetHeight } = event.target;
            const { offsetX, offsetY } = event;
            const centerX = offsetWidth / 2,
               centerY = offsetHeight / 2;

            const percentX = centerX - offsetX;
            const percentY = centerY - offsetY;

            this.imageStyle.x = `${percentX}%`;
            this.imageStyle.y = `${percentY}%`;
         },
         onImageMouseLeave(event) {
            this.imageStyle.scale = "1";
            this.imageStyle.x = "0%";
            this.imageStyle.y = "0%";
         },
      },
      mounted() {
         this.onImage();
      },
   };
</script>

<template>
   <div
      :class="[
         'LayoutProductViewerImagePreview',
         `LayoutProductViewerImagePreview-${imageIsShowing ? 'isShown' : 'isHidden'}`,
      ]"
   >
      <ImageView
         :class="[
            'LayoutProductViewerImagePreview-preview',
            image
               ? 'LayoutProductViewerImagePreview-preview-isShown'
               : 'LayoutProductViewerImagePreview-preview-isHidden',
         ]"
         :style="{
            transiton: imageTransitionEnabled ? '' : 'none',
         }"
         :src="image"
         @click="$emit('click-image', image)"
      />

      <Arrow
         class="LayoutProductViewerImagePreview-arrow"
         :primaryColor="primaryColor"
         :direction="ArrowDirection.Left"
         :isShowing="hasImagePrevious || hasProductPrevious"
         @click="() => $emit('click-previous')"
      />
      <Arrow
         class="LayoutProductViewerImagePreview-arrow"
         :primaryColor="primaryColor"
         :direction="ArrowDirection.Right"
         :isShowing="hasImageNext || hasProductNext"
         @click="() => $emit('click-next')"
      />

      <div
         :class="[
            'LayoutProductViewerImagePreview-tool',
            `LayoutProductViewerImagePreview-tool-${
               allowEdit && image ? 'isShown' : 'isHidden'
            }`,
            'transition',
         ]"
      >
         <div class="LayoutProductViewerImagePreview-tool-body">
            <button class="transition" @click="$emit('click-remove', image)">
               <img :src="host.icon('trash-505050')" />
            </button>
         </div>
      </div>
   </div>
</template>

<style lang="scss" scoped>
   .LayoutProductViewerImagePreview {
      width: 100%;
      max-height: 55vh;
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      .LayoutProductViewerImagePreview-tool {
         z-index: 3;
         width: calc(100%);
         height: fit-content;
         padding: 1rem;
         position: absolute;
         top: 0;
         left: 0;
         right: 0;

         display: flex;
         flex-direction: column;
         align-items: center;
         justify-content: center;

         .LayoutProductViewerImagePreview-tool-body {
            display: flex;
            flex-direction: row;
            background: red;
            background-color: hsla(0, 0%, 100%, 0.6);
            border: 0.1rem solid hsla(0, 0%, 0%, 0.2);
            box-shadow: 0 0 0.5rem hsla(0, 0%, 0%, 0.2);
            border-radius: 0.5rem;

            button {
               width: 2.5rem;
               height: 2.5rem;
               background: none;
               border: none;
               display: flex;
               align-items: center;
               justify-content: center;
               border-radius: 50%;
               border-radius: 0.5rem;
               cursor: pointer;
               &:hover {
                  background: hsla(0, 0%, 0%, 0.2);
               }
               img {
                  width: 1rem;
                  height: 1rem;
               }
            }
         }
      }
      .LayoutProductViewerImagePreview-tool-isHidden {
         top: -150%;
         opacity: 0;
         pointer-events: none;
      }

      .LayoutProductViewerImagePreview-arrow {
         z-index: 2;
      }

      .LayoutProductViewerImagePreview-preview {
         z-index: 1;
         object-fit: contain;

         width: 100%;
         height: inherit;
         max-height: 55vh;
         display: flex;
         flex-direction: column;
         align-items: center;
         justify-content: center;
         aspect-ratio: 16/10;
      }
   }
   .LayoutProductViewerImagePreview-isHidden {
      height: 12rem;
      .LayoutProductViewerImagePreview-preview {
         pointer-events: none;
         height: inherit;
      }
   }

   .LayoutProductViewerImagePreview-preview-isHidden {
      opacity: 0;
   }
</style>
