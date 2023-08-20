<script>
   import MenuOption from "@/components/button/MenuOption.vue";
   import ImageView from "@/components/ImageView.vue";
   import Arrow from "./ViewerProduct-ImagePreview-Arrow.vue";

   export default {
      components: { MenuOption, ImageView, Arrow },
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
         imageUrl: "",
         imageIsFetching: false,
         imageTransitionEnabled: false,

         ArrowDirection: Arrow.Direction,
      }),
      computed: {
         isThin: (c) => c.store.getters.window.innerWidth < 550,
         imageIsShowing: (c) => (c.imageIsFetching ? !!c.imageUrl : true),
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
            this.invalidate();
         },
      },
      methods: {
         invalidate() {
            this.imageUrl = "";
            if (this.image) {
               this.imageUrl = this.image.toUrl({ height: this.isThin ? 350 : 1200 });
            }
         },
      },
      mounted() {
         this.invalidate();
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
         :style="{ transiton: imageTransitionEnabled ? '' : 'none', 'z-index': '2' }"
         :src="image"
         @click="$emit('click-image', image)"
      />

      <Arrow
         style="z-index: 2"
         :primaryColor="primaryColor"
         :direction="ArrowDirection.Left"
         :isShowing="hasImagePrevious || hasProductPrevious"
         @click="() => $emit('click-previous')"
      />
      <Arrow
         style="z-index: 2"
         :primaryColor="primaryColor"
         :direction="ArrowDirection.Right"
         :isShowing="hasImageNext || hasProductNext"
         @click="() => $emit('click-next')"
      />

      <MenuOption
         class="LayoutProductViewerImagePreview-menu"
         style="z-index: 3"
         v-if="allowEdit && image"
         :primaryColor="primaryColor"
         :menus="[
            {
               title: 'Delete Image',
               click: () => $emit('click-remove', image),
            },
         ]"
      />
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

      .LayoutProductViewerImagePreview-menu {
         position: absolute;
         top: 0.5rem;
         right: 0.5rem;
      }

      .LayoutProductViewerImagePreview-preview {
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
