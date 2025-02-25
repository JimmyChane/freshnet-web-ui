<script setup lang="ts">
import { computed } from 'vue';

import { optArray } from '@/U';
import { Image } from '@/entity/model/Image';
import { ServiceImage } from '@/entity/model/ServiceImage';

import ImageView from '@/components/ImageView.vue';

const props = withDefaults(
  defineProps<{ width?: number; height?: number; images?: any[] }>(),
  { width: 0, height: 0, images: () => [] },
);

const parsedImages = computed(() => {
  return optArray(props.images, [props.images])
    .filter((image) => {
      return image instanceof Image || image instanceof ServiceImage;
    })
    .reduce((images: any[], image, index, sources) => {
      if (index < 4) images.push(image);
      return images;
    }, []);
});
const parsedImage = computed((c) =>
  parsedImages.value.length === 1 ? parsedImages.value[0] : null,
);

const cssWidth = computed(() => `${props.width}px`);
const cssHeight = computed(() => `${props.height}px`);
const cssBorderRadius = computed(() => '4px');
const cssGridTemplateAreas = computed(() => {
  if (parsedImages.value.length === 2) return '"img0 img1"';
  if (parsedImages.value.length === 3) return '"img0 img1" "img2 img2"';
  return '"img0 img1" "img2 img3"';
});

function onLoad(element: any, image: any) {}
function onError(element: any, image: any) {}
function onAbort(element: any, image: any) {}
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
    @load="(event: any) => onLoad(event.target, parsedImage)"
    @error="(event: any) => onError(event.target, parsedImage)"
    @abort="(event: any) => onAbort(event.target, parsedImage)"
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
      :style="{ width: '100%', height: '100%', 'grid-area': `img${index}` }"
      v-for="(image, index) in parsedImages"
      :key="image.toUrl()"
      :src="image"
      @load="(event: any) => onLoad(event.target, image)"
      @error="(event: any) => onError(event.target, image)"
      @abort="(event: any) => onAbort(event.target, image)"
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
