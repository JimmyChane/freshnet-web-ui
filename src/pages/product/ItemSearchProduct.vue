<script>
   export default {
      emtis: ["callback-click"],
      props: {
         item: { type: Object, default: null },
      },
      data() {
         return {
            brandTitle: "",
         };
      },
      computed: {
         product: (c) => c.item,
         images: (c) => c.product.images,
         title: (c) => c.product.title,
      },
      watch: {
         product() {
            this.invalidate();
         },
      },
      mounted() {
         this.invalidate();
      },
      methods: {
         async invalidate() {
            this.brandTitle = "";

            if (!this.product) return;

            this.brandTitle = await this.product
               .fetchBrand()
               .then((brand) => brand.title)
               .catch((error) => "");
         },
      },
   };
</script>

<template>
   <button
      class="ItemSearchProduct transition"
      @click="$emit('callback-click', item)"
   >
      <img
         v-if="images.length"
         class="ItemSearchProduct-image"
         :src="images[0].toUrl()"
      />
      <div class="ItemSearchProduct-content">
         <p class="ItemSearchProduct-brand" v-if="brandTitle">
            {{ brandTitle }}
         </p>
         <p class="ItemSearchProduct-title">{{ title }}</p>
      </div>
   </button>
</template>

<style lang="scss" scoped>
   .ItemSearchProduct {
      display: flex;
      flex-direction: row;
      gap: 10px;
      align-items: center;
      border-radius: 8px;
      padding: 10px;
      cursor: pointer;
      border: none;
      background: none;
      &:hover,
      &:focus {
         background-color: #cfdbd9;
      }
      .ItemSearchProduct-image {
         width: 100px;
         height: 60px;
         object-fit: contain;
      }
      .ItemSearchProduct-content {
         font-size: 0.8rem;
         font-weight: 400;
         text-align: start;
      }
   }
</style>
