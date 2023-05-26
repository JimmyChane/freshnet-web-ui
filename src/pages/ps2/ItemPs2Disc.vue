<script>
   import ImageView from "@/components/ImageView.vue";
   export default {
      components: { ImageView },
      props: {
         ps2Disc: { type: Object, default: () => null },
      },
      computed: {
         imageUrl: (c) => `ps2/disc/${c.code}.jpg`,
         code: (c) => c.ps2Disc.code,
         title: (c) => c.ps2Disc.title,
      },
   };
</script>

<template>
   <div class="ItemPs2Disc">
      <ImageView
         class="ItemPs2Disc-image"
         :src="host.cloudinary({ url: imageUrl })"
      />

      <div class="ItemPs2Disc-content">
         <p>{{ code }}</p>
         <p>{{ title }}</p>
      </div>
   </div>
</template>

<style lang="scss" scoped>
   .ItemPs2Disc {
      display: flex;
      flex-direction: row;
      column-gap: 10px;
      align-items: center;
      padding: 10px 0;

      .ItemPs2Disc-image {
         height: 4rem;
         aspect-ratio: 14/9;
         object-fit: contain;
         border-radius: 0.2rem;
      }

      .ItemPs2Disc-content {
         display: flex;
         flex-direction: column;
         :nth-child(1) {
            font-size: 0.8rem;
         }
         :nth-child(2) {
            font-size: 1rem;
         }
      }
   }
</style>
