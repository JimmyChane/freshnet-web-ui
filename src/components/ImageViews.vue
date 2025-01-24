<script>
import { optArray } from '@/U';
import ImageView from '@/components/ImageView.vue';
import Image from '@/items/Image';
import ServiceImage from '@/items/ServiceImage';

export default {
  components: { ImageView },
  props: {
    width: { type: Number, default: 0 },
    height: { type: Number, default: 0 },
    images: { type: Array, default: () => [] },
  },
  computed: {
    parsedImages() {
      return optArray(this.images, [this.images])
        .filter((image) => {
          return image instanceof Image || image instanceof ServiceImage;
        })
        .reduce((images, image, index, sources) => {
          if (index < 4) images.push(image);
          return images;
        }, []);
    },
    parsedImage: (c) =>
      c.parsedImages.length === 1 ? c.parsedImages[0] : null,

    cssWidth: (c) => `${c.width}px`,
    cssHeight: (c) => `${c.height}px`,
    cssBorderRadius: () => '4px',
    cssGridTemplateAreas: (c) => {
      if (c.parsedImages.length === 2) return '"img0 img1"';
      if (c.parsedImages.length === 3) return '"img0 img1" "img2 img2"';
      return '"img0 img1" "img2 img3"';
    },
  },
  methods: {
    onLoad(element, image) {},
    onError(element, image) {},
    onAbort(element, image) {},
  },
};
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
