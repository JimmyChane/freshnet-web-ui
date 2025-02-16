<script>
import { mapStores } from 'pinia';

import { useAppStore } from '@/stores/app.store';
import { useServiceStore } from '@/stores/service.store';

import TextArea from '@/components/InputTextArea.vue';
import PanelAction from '@/components/panel/PanelAction.vue';

export default {
  components: { PanelAction, TextArea },
  props: { popupWindow: { type: Object } },
  data: (c) => ({ value: '' }),
  computed: {
    ...mapStores(useServiceStore),

    isShowing: (c) => c.popupWindow.isShowing,
    description: (c) => c.popupWindow.description,
  },
  watch: {
    description() {
      this.value = this.description;
    },
  },
  methods: {
    onChange() {
      if (this.description === this.value) {
        useAppStore().snackbarShow('No Changes');
        return;
      }

      const accept = () => this.popupWindow.close();
      const reject = () => {};
      this.popupWindow.onConfirm(accept, reject, this.value);
    },

    focus() {
      this.$refs.Input.focus();
    },
  },
  mounted() {
    this.focus();
    this.value = this.description;
  },
};
</script>

<template>
  <PanelAction
    title="Edit Description"
    :isShowing="isShowing"
    :isLoading="serviceStore.isFetching"
    :isClickable="!serviceStore.isFetching"
    @click-ok="() => onChange()"
    @click-cancel="() => popupWindow.close()"
    @click-dismiss="() => popupWindow.close()"
  >
    <div class="WindowDescription-main">
      <TextArea
        ref="Input"
        type="text"
        label="Description"
        :isRequired="true"
        :bindValue="value"
        @input="(comp) => (value = comp.value)"
      />
    </div>
  </PanelAction>
</template>

<style lang="scss" scoped>
.WindowDescription-main {
  width: 35rem;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  & > * {
    height: 7rem;
    background: hsla(0, 0%, 0%, 0.03);
    padding: 0.6rem 0.4rem;
  }
}
</style>
