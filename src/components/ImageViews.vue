<script>
   import Image from "@/items/Image";
   import ServiceImage from "@/items/ServiceImage";
   import ImageView from "@/components/ImageView.vue";

   export default {
      components: { ImageView },
      props: {
         width: { type: Number, default: 0 },
         height: { type: Number, default: 0 },
         images: { type: Array, default: () => [] },
      },
      computed: {
         parsedImages() {
            return (Array.isArray(this.images) ? this.images : [this.images])
               .filter((image) => image instanceof Image || image instanceof ServiceImage)
               .reduce((images, image, index, sources) => {
                  if (index < 4) images.push(image);
                  return images;
               }, []);
         },
         parsedImage: (c) => (c.parsedImages.length === 1 ? c.parsedImages[0] : null),

         cssWidth: (c) => `${c.width}px`,
         cssHeight: (c) => `${c.height}px`,
         cssBorderRadius: () => "4px",
         cssGridTemplateAreas: (c) => {
            if (c.parsedImages.length === 2) return '"img0 img1"';
            if (c.parsedImages.length === 3) return '"img0 img1" "img2 img2"';
            if (c.parsedImages.length === 4) return '"img0 img1" "img2 img3"';
            return `"${c.width} ${c.width}" "${c.width} ${c.width}"`;
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
      :style="{ width: cssWidth, height: cssHeight, 'border-radius': cssBorderRadius }"
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
         :class="['ImageViews-item']"
         :style="{
            width: '100%',
            height: '100%',
            'grid-area': `img${parsedImages.indexOf(image)}`,
         }"
         v-for="image of parsedImages"
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
      // border: 1px solid hsl(0, 0%, 80%);
   }
</style>
