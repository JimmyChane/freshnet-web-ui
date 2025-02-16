<script>
import { mapStores } from 'pinia';

import { optString } from '@/U';
import { useServiceStore } from '@/stores/service.store';

import Input from '@/components/Input.vue';
import PanelAction from '@/components/panel/PanelAction.vue';

export default {
  components: { PanelAction, Input },
  props: { popupWindow: { type: Object } },
  data: (c) => ({ customerName: '', customerPhoneNumber: '' }),
  computed: {
    ...mapStores(useServiceStore),

    isShowing: (c) => c.popupWindow.isShowing,
    value: (c) => c.popupWindow.value,
  },
  watch: {
    value() {
      this.onNewValue();
    },
  },
  methods: {
    onNewValue() {
      const value = this.value ?? {};
      this.customerName = optString(value.name);
      this.customerPhoneNumber = value.phoneNumber?.toString() ?? '';
    },
    onChange() {
      const accept = () => {
        this.popupWindow.close();
      };
      const reject = () => {};
      this.popupWindow.onConfirm(accept, reject, {
        name: this.customerName,
        phoneNumber: this.customerPhoneNumber,
      });
    },

    focus() {
      this.$refs.InputName.focus();
    },
  },
  mounted() {
    this.onNewValue();
    this.focus();
  },
};
</script>

<template>
  <PanelAction
    title="Edit Customer"
    :isShowing="isShowing"
    :isLoading="serviceStore.isFetching"
    :isClickable="!serviceStore.isFetching"
    @click-ok="onChange"
    @click-cancel="() => popupWindow.close()"
    @click-dismiss="() => popupWindow.close()"
  >
    <div class="WindowCustomer-body">
      <Input
        label="Name"
        ref="InputName"
        autocapitalize="words"
        :isRequired="true"
        :bindValue="customerName"
        @input="(comp) => (customerName = comp.value)"
      />
      <Input
        ref="WindowCustomerPhoneNumber"
        label="Phone Number"
        type="tel"
        :bindValue="customerPhoneNumber"
        @input="(comp) => (customerPhoneNumber = comp.value)"
      />
    </div>
  </PanelAction>
</template>

<style lang="scss" scoped>
.WindowCustomer-body {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 1rem 0;

  & > * {
    max-width: 100%;
    width: 35rem;
    padding: 0.6rem 0.4rem;
    font-size: 1rem;
    margin-top: 0;

    border: none;
    border-bottom: 1px solid hsl(0, 0%, 70%);
    border-radius: 0.2rem;
    background: hsla(0, 0%, 0%, 0.03);
  }
}
</style>
