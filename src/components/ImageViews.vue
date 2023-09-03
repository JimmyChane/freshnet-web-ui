<script lang="ts">
  import Image from "@/items/Image";
  import ServiceImage from "@/items/ServiceImage";
  import ImageView from "@/components/ImageView.vue";
  import U from "@/U";
  import Vue from "vue";

  export default Vue.extend({
    components: { ImageView },
    props: {
      width: { type: Number, default: 0 },
      height: { type: Number, default: 0 },
      images: {
        type: Array as () => (Image | ServiceImage)[],
        default: () => [],
      },
    },
    computed: {
      parsedImages(): (Image | ServiceImage)[] {
        return this.images
          .filter((image) => {
            return image instanceof Image || image instanceof ServiceImage;
          })
          .reduce((images: (Image | ServiceImage)[], image, index) => {
            if (index < 4) images.push(image);
            return images;
          }, []);
      },
      parsedImage(): Image | ServiceImage | null {
        return this.parsedImages.length === 1 ? this.parsedImages[0] : null;
      },

      cssWidth(): string {
        return `${this.width}px`;
      },
      cssHeight(): string {
        return `${this.height}px`;
      },
      cssBorderRadius(): string {
        return "4px";
      },
      cssGridTemplateAreas() {
        if (this.parsedImages.length === 2) return '"img0 img1"';
        if (this.parsedImages.length === 3) return '"img0 img1" "img2 img2"';
        return '"img0 img1" "img2 img3"';
      },
    },
    methods: {
      onLoad(element: HTMLElement, image: Image | ServiceImage) {},
      onError(element: HTMLElement, image: Image | ServiceImage) {},
      onAbort(element: HTMLElement, image: Image | ServiceImage) {},
    },
  });
</script>

<template>
  <ImageView
    v-if="parsedImages.length === 1"
    class="ImageViews-item"
    :style="{
      width: cssWidth,
      height: cssHeight,
      'border-radius': cssBorderRadius,
    }"
    :src="parsedImage"
    @load="(event) => onLoad(event.target, parsedImage)"
    @error="(event) => onError(event.target, parsedImage)"
    @abort="(event) => onAbort(event.target, parsedImage)"
  />
  <div
    v-else
    class="ImageViews"
    :style="{
      width: cssWidth,
      height: cssHeight,
      'border-radius': cssBorderRadius,
      'grid-template-areas': cssGridTemplateAreas,
    }"
  >
    <ImageView
      class="ImageViews-item"
      :style="{
        width: '100%',
        height: '100%',
        'grid-area': `img${index}`,
      }"
      v-for="(image, index) in parsedImages"
      :key="image.toUrl()"
      :src="image"
      @load="(event) => onLoad(event.target, image)"
      @error="(event) => onError(event.target, image)"
      @abort="(event) => onAbort(event.target, image)"
    />
  </div>
</template>

<style lang="scss" scoped>
  .ImageViews {
    display: grid;
    gap: 1px;
    overflow: hidden;
  }
  .ImageViews-item {
    object-fit: cover;
    overflow: hidden;
    object-fit: cover;
  }
</style>
