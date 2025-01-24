<script>
import TextArea from '@/components/InputTextArea.vue';
import PanelAction from '@/components/panel/PanelAction.vue';
import Customer from '@/items/Customer';

import WindowSection from './WindowSection.vue';

export default {
  components: { PanelAction, WindowSection, TextArea },
  props: {
    popupWindow: { type: Object },
  },
  data: (c) => ({ Requirement: Customer.Requirement, data: {} }),
  computed: {
    isShowing: (c) => c.popupWindow.isShowing,
    item: (c) => c.popupWindow.item,
    isLoading: (c) => c.$store.state.stores.customer.getters.isLoading,
    isClickable: (c) => !c.$store.state.stores.customer.getters.isLoading,
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
        this.$store.dispatch(
          'snackbarShow',
          'You must specify the "Description"',
        );
        return;
      }
      this.$store.state.stores.customer
        .dispatch('updateDescriptionOfId', {
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
