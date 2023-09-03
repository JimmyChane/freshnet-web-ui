<script lang="ts">
  import Vue from "vue";
  import ItemProduct from "./ItemProduct.vue";
  import { Mode } from "./ItemProductOption";

  export default Vue.extend({
    components: { ItemProduct },
    props: { item: { type: Object, default: null } },
    computed: { mode: () => Mode.List },
  });
</script>

<template>
  <div @click="() => $emit('click')">
    <router-link
      :style="{
        border: 'none',
        background: 'none',
        'text-decoration': 'none',
      }"
      :to="{ path: '/product', query: { productId: item.id } }"
    >
      <ItemProduct :item="item" :mode="mode" />
    </router-link>
  </div>
</template>
