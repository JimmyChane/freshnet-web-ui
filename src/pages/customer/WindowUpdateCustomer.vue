<script>
import Input from '@/components/Input.vue';
import PanelAction from '@/components/panel/PanelAction.vue';
import { RequirementCustomer } from '@/items/Customer';
import { useCustomerStore } from '@/pinia-stores/customer.store';

import WindowSection from './WindowSection.vue';

export default {
  components: { PanelAction, WindowSection, Input },
  props: {
    popupWindow: { type: Object },
  },
  data: (c) => ({
    Requirement: RequirementCustomer,
    data: { name: '', phoneNumber: '' },
  }),
  computed: {
    isShowing: (c) => c.popupWindow.isShowing,
    item: (c) => c.popupWindow.item,
    isLoading: (c) => useCustomerStore().isLoading,
    isClickable: (c) => !useCustomerStore().isLoading,
  },
  watch: {
    isShowing() {
      if (!this.isShowing) return;
      const { CustomerName } = this.$refs;
      if (CustomerName) {
        CustomerName.focus();
      }
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
        const { name, phoneNumber } = this.item;
        this.data.name = name;
        this.data.phoneNumber = phoneNumber?.toString() ?? '';
      }
    },

    clickOk() {
      this.data.name = this.data.name.trim();
      this.data.phoneNumber = this.data.phoneNumber.trim();

      if (this.Requirement.name.isRequired && !this.data.name) {
        this.$store.dispatch('snackbarShow', 'You must specify the "Name"');
        return;
      }
      if (this.Requirement.phoneNumber.isRequired && !this.data.phoneNumber) {
        this.$store.dispatch(
          'snackbarShow',
          'You must specify the "Phone Number"',
        );
        return;
      }

      useCustomerStore()
        .updateNamePhoneNumberOfItemId({
          _id: this.item.id,
          name: this.data.name,
          phoneNumber: this.data.phoneNumber,
        })
        .then((item) => this.popupWindow.close());
    },
  },
};
</script>

<template>
  <PanelAction
    class="WindowUpdateCustomer"
    :title="`Update Customer${item ? ` for ${item.name}` : ''}`"
    :isShowing="isShowing"
    :isLoading="isLoading"
    :isClickable="isClickable"
    @click-dismiss="() => popupWindow.close()"
    @click-cancel="() => popupWindow.close()"
    @click-ok="clickOk()"
  >
    <div class="WindowUpdateCustomer-body">
      <WindowSection class="WindowUpdateCustomer-customer">
        <div class="WindowUpdateCustomer-customer-body">
          <Input
            class="WindowUpdateCustomer-customer-part"
            label="Name"
            type="text"
            :isRequired="true"
            :bindValue="data.name"
            @input="(comp) => (data.name = comp.value)"
          />
          <Input
            class="WindowUpdateCustomer-customer-part"
            label="Phone Number"
            type="text"
            :bindValue="data.phoneNumber"
            @input="(comp) => (data.phoneNumber = comp.value)"
          />
        </div>
      </WindowSection>
    </div>
  </PanelAction>
</template>

<style lang="scss" scoped>
.WindowUpdateCustomer-reuse-input {
  font-size: 1rem;
  border: none;
  background: hsla(0, 0%, 0%, 0.03);
  border-bottom: 1px solid hsl(0, 0%, 70%);
  border-radius: 0.2rem;
  padding: 0.2rem 0.4rem;
}

.WindowUpdateCustomer {
  width: 100%;
  height: 100%;
  .WindowUpdateCustomer-body {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 40px;

    .WindowUpdateCustomer-customer {
      .WindowUpdateCustomer-customer-body {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        .WindowUpdateCustomer-customer-part {
          width: 100%;
          min-height: 2.5rem;
        }
      }
    }
  }
}
</style>
