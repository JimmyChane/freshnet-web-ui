<script>
import { RequirementCustomer } from '@/items/Customer';
import { useAppStore } from '@/stores/app.store';
import { useCustomerStore } from '@/stores/customer.store';

import TextArea from '@/components/InputTextArea.vue';
import PanelAction from '@/components/panel/PanelAction.vue';

import WindowSection from './WindowSection.vue';

export default {
  components: { PanelAction, WindowSection, TextArea },
  props: {
    popupWindow: { type: Object },
  },
  data: (c) => ({ Requirement: RequirementCustomer, data: {} }),
  computed: {
    isShowing: (c) => c.popupWindow.isShowing,
    item: (c) => c.popupWindow.item,
    isLoading: (c) => useCustomerStore().isLoading,
    isClickable: (c) => !useCustomerStore().isLoading,
  },
  watch: {
    isShowing() {
      if (!this.isShowing) return;
      const { Description } = this.$refs;
      if (Description) Description.focus();
    },
    item() {
      this.bindData();
    },
  },
  mounted() {
    this.bindData();
  },
  methods: {
    bindData() {
      if (this.item) {
        const { description } = this.item;
        this.data.description = description;
      }
    },

    clickOk() {
      this.data.description = this.data.description.trim();

      if (this.Requirement.description.isRequired && !this.data.description) {
        useAppStore().snackbarShow('You must specify the "Description"');
        return;
      }
      useCustomerStore()
        .updateDescriptionOfId({
          _id: this.item.id,
          description: this.data.description,
        })
        .then((item) => this.popupWindow.close());
    },
  },
};
</script>

<template>
  <PanelAction
    class="WindowUpdateDescription"
    :title="`Update Description${item ? ` for ${item.name}` : ''}`"
    :isShowing="isShowing"
    :isLoading="isLoading"
    :isClickable="isClickable"
    @click-dismiss="() => popupWindow.close()"
    @click-cancel="() => popupWindow.close()"
    @click-ok="() => clickOk()"
  >
    <TextArea
      class="WindowUpdateDescription-description"
      ref="Description"
      type="text"
      label="Description"
      :bindValue="data.description"
      @input="(comp) => (data.description = comp.value)"
    />
  </PanelAction>
</template>

<style lang="scss" scoped>
.WindowUpdateDescription {
  width: 100%;
  height: 100%;
  .WindowUpdateDescription-description {
    width: 35rem;
    max-width: 100%;
    height: 6rem;
  }
}
</style>
