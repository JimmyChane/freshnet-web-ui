<script lang="ts">
  import CustomerDeviceSpecification from "@/items/CustomerDeviceSpecification";
  import { Type } from "@/items/Specification";
  import Vue from "vue";

  interface Data {
    specificationType: Type | null;
  }

  export default Vue.extend({
    props: {
      item: { type: CustomerDeviceSpecification, default: null },
    },
    data(): Data {
      return { specificationType: null };
    },
    watch: {
      item() {
        this.invalidate();
      },
    },
    mounted() {
      this.invalidate();
    },
    methods: {
      invalidate() {
        this.$store.state.stores.specification
          .dispatch("getItemOfKey", this.item?.typeKey ?? "")
          .then((specificationType: Type) => {
            this.specificationType = specificationType;
          });
      },
    },
  });
</script>

<template>
  <div class="ItemSpecification">
    <img
      class="ItemSpecification-icon"
      v-if="specificationType"
      :src="specificationType.icon.toUrl()"
    />

    <span class="ItemSpecification-content">{{ item.content }}</span>
  </div>
</template>

<style lang="scss" scoped>
  .ItemSpecification {
    display: flex;
    flex-direction: row;
    align-items: center;
    align-items: flex-start;
    gap: 0.5rem;
    --min-height: 0.9rem;
    .ItemSpecification-icon {
      --size: var(--min-height);
      width: var(--size);
      height: var(--size);
    }
    .ItemSpecification-content {
      min-height: var(--min-height);
      line-height: 1;
    }
  }
</style>
