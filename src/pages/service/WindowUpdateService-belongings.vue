<script>
import BelongingListEdit from './BelongingListEdit.vue';

export default {
  components: { BelongingListEdit },
  props: {
    belongings: { type: Array, default: () => [] },
  },
  methods: {
    getResults() {
      return this.$refs.BelongingListEdit.getResults();
    },
  },
};
</script>

<template>
  <div class="WindowServiceUpdate-belonging">
    <span class="WindowServiceUpdate-title">Belonging</span>
    <BelongingListEdit
      class="WindowServiceUpdate-belonging-list"
      ref="BelongingListEdit"
      :values="belongings"
    />
  </div>
</template>

<style lang="scss" scoped>
.WindowServiceUpdate-belonging {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  .WindowServiceUpdate-title {
    font-size: 1.1rem;
    font-weight: 600;
  }
  .WindowServiceUpdate-belonging-list {
    width: 100%;
  }
}
</style>
