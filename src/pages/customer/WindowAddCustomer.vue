<script>
import { RequirementCustomer } from '@/items/Customer';
import { useAppStore } from '@/stores/app.store';
import { useCustomerStore } from '@/stores/customer.store';

import Input from '@/components/Input.vue';
import TextArea from '@/components/InputTextArea.vue';
import PanelAction from '@/components/panel/PanelAction.vue';

export default {
  components: { PanelAction, Input, TextArea },
  props: { popupWindow: { type: Object } },
  data: (c) => ({
    Requirement: RequirementCustomer,
    data: { name: '', phoneNumber: '', description: '' },
  }),
  computed: {
    isShowing: (c) => c.popupWindow.isShowing,
    isLoading: (c) => useCustomerStore().isLoading,
    isClickable: (c) => !useCustomerStore().isLoading,
  },
  watch: {
    isShowing() {
      if (!this.isShowing) return;
      const { CustomerName } = this.$refs;
      if (CustomerName) CustomerName.focus();
    },
  },
  methods: {
    clickOk() {
      this.data.name = this.data.name.trim();
      this.data.phoneNumber = this.data.phoneNumber.trim();
      this.data.description = this.data.description.trim();

      if (this.Requirement.name.isRequired && !this.data.name) {
        useAppStore().snackbarShow('You must specify the "Name"');
        return;
      }
      if (this.Requirement.phoneNumber.isRequired && !this.data.phoneNumber) {
        useAppStore().snackbarShow('You must specify the "Phone Number"');
        return;
      }
      if (this.Requirement.description.isRequired && !this.data.description) {
        useAppStore().snackbarShow('You must specify the "Description"');
        return;
      }

      useCustomerStore()
        .addItem(this.data)
        .then((item) => this.popupWindow.close());
    },
  },
};
</script>

<template>
  <PanelAction
    class="WindowAddCustomer"
    title="Add New Customer"
    :isShowing="isShowing"
    :isLoading="isLoading"
    :isClickable="isClickable"
    @click-dismiss="() => popupWindow.close()"
    @click-cancel="() => popupWindow.close()"
    @click-ok="clickOk()"
  >
    <div class="WindowAddCustomer-body">
      <Input
        class="WindowAddCustomer-customer-input"
        label="Name"
        type="text"
        autocapitalize="words"
        :isRequired="true"
        :bindValue="data.name"
        @input="(comp) => (data.name = comp.value)"
      />
      <Input
        class="WindowAddCustomer-customer-input"
        label="Phone Number"
        type="text"
        :bindValue="data.phoneNumber"
        @input="(comp) => (data.phoneNumber = comp.value)"
      />
      <TextArea
        class="WindowAddCustomer-description-input"
        type="text"
        label="Description"
        :bindValue="data.description"
        @input="(comp) => (data.description = comp.value)"
      />
    </div>
  </PanelAction>
</template>

<style lang="scss" scoped>
.WindowAddCustomer {
  width: 100%;
  height: 100%;
  .WindowAddCustomer-body {
    width: 26rem;
    max-width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 0.7rem;

    .WindowAddCustomer-customer-input {
      background: hsla(0, 0%, 0%, 0.03);
    }
    .WindowAddCustomer-description-input {
      height: 7rem;
      background: hsla(0, 0%, 0%, 0.03);
    }
  }
}
</style>
