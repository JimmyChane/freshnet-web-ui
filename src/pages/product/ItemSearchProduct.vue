<script>
   import ItemProduct from "./ItemProduct.vue";

   export default {
      components: { ItemProduct },
      props: { item: { type: Object, default: null } },
      computed: { mode: () => ItemProduct.Mode.List },
   };
</script>

<template>
   <router-link
      :style="{ border: 'none', background: 'none', 'text-decoration': 'none' }"
      :to="{ path: '/product', query: { productId: item.id } }"
   >
      <ItemProduct :item="item" :mode="mode" />
   </router-link>
</template>
