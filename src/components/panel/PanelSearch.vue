<script>
import IconArrowLeft from '@/assets/icon/arrow-left-000000.svg';

import Searchbar from '@/components/Searchbar.vue';
import Actionbar from '@/components/actionbar/Actionbar.vue';
import PopupWindow from '@/components/window/PopupWindow.vue';

export default {
  components: { PopupWindow, Actionbar, Searchbar },
  props: { placeholder: { type: String, default: 'Search' } },
  data: (c) => ({ search: '', results: [], IconArrowLeft }),
  watch: {
    search() {
      this.onInput();
    },
  },
  mounted() {
    this.onInput();
  },
  methods: {
    blur() {
      this.$refs.inputSearch.blur();
    },
    focus() {
      this.$refs.inputSearch.focus();
    },

    onInput() {
      this.$emit('input-text', this.search);
    },
  },
};
</script>

<template>
  <div class="WindowSearch-body">
    <Searchbar
      class="WindowSearch-input"
      ref="inputSearch"
      :model="search"
      :placeholder="placeholder"
      :enterIcon="IconArrowLeft"
      @input="(e) => (search = e.value)"
      @clear="(e) => (search = '')"
      @enter="() => $emit('click-dismiss')"
    />

    <div class="WindowSearch-items"><slot /></div>
  </div>
</template>

<style lang="scss" scoped>
.WindowSearch-body {
  width: 100dvw;
  height: 100dvh;
  max-width: 100%;
  max-height: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
  overflow-y: auto;
  position: relative;

  .WindowSearch-input {
    --margin: 0.5rem;

    z-index: 2;
    position: sticky;
    top: var(--margin);

    height: max-content;
    width: calc(100% - var(--margin) - var(--margin));
    margin: var(--margin);
  }

  .WindowSearch-items {
    z-index: 1;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
    padding: 0.5rem;
  }
}
</style>
