<script>
   export default {
      emtis: ["click", "click-remove"],
      props: {
         item: { type: Object, default: null },
      },
      data: (c) => ({ specificationType: null }),
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
            this.specificationStore
               .dispatch("getItemOfKey", this.item ? this.item.typeKey : "")
               .then((specificationType) => {
                  this.specificationType = specificationType;
               });
         },
      },
   };
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
