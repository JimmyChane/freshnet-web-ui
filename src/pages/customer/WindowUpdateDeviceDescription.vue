<script>
import { RequirementCustomer } from '@/items/Customer';
import { useCustomerStore } from '@/stores/customer.store';

import TextArea from '@/components/InputTextArea.vue';
import PanelAction from '@/components/panel/PanelAction.vue';

import ItemSpecification from './ItemSpecification.vue';
import WindowSection from './WindowSection.vue';

export default {
  components: { PanelAction, WindowSection, ItemSpecification, TextArea },
  props: { popupWindow: { type: Object } },
  data: (c) => ({
    Requirement: RequirementCustomer,
    data: { description: '' },
  }),
  computed: {
    isShowing: (c) => c.popupWindow.isShowing,
    customer: (c) => c.popupWindow.customer,
    device: (c) => c.popupWindow.device,
    isLoading: (c) => useCustomerStore().isLoading,
    isClickable: (c) => !useCustomerStore().isLoading,

    specifications: (c) => {
      const specifications = c.device ? c.device.specifications : [];
      return Array.isArray(specifications) ? specifications : [];
    },
  },
  watch: {
    isShowing() {
      if (!this.isShowing) return;
      const { Description } = this.$refs;
      if (Description) Description.focus();
    },
    device() {
      this.bindData();
    },
  },
  mounted() {
    this.bindData();
  },
  methods: {
    bindData() {
      if (this.device) {
        const { description } = this.device;
        this.data.description = description;
      }
    },

    clickOk() {
      this.data.description = this.data.description.trim();
      useCustomerStore()
        .updateDeviceDescription({
          _id: this.device.id,
          description: this.data.description,
        })
        .then((device) => this.popupWindow.close());
    },
  },
};
</script>

<template>
  <PanelAction
    class="WindowUpdateDeviceDescription"
    :title="`Update Device Description${
      customer ? ` for ${customer.name}` : ''
    }`"
    :isShowing="isShowing"
    :isLoading="isLoading"
    :isClickable="isClickable"
    @click-dismiss="() => popupWindow.close()"
    @click-cancel="() => popupWindow.close()"
    @click-ok="() => clickOk()"
  >
    <div class="WindowUpdateDeviceDescription-body">
      <div
        class="WindowUpdateDeviceDescription-specification"
        v-if="specifications.length"
      >
        <ItemSpecification
          v-for="specification of specifications"
          :key="`${specification.typeKey}${specification.content}`"
          :item="specification"
        />
      </div>

      <TextArea
        class="WindowUpdateDeviceDescription-description"
        ref="Description"
        type="text"
        label="Description"
        :bindValue="data.description"
        @input="(comp) => (data.description = comp.value)"
      />
    </div>
  </PanelAction>
</template>

<style lang="scss" scoped>
.WindowUpdateDeviceDescription-reuse-input {
  font-size: 1rem;
  border: none;
  background: hsla(0, 0%, 0%, 0.03);
  border-bottom: 1px solid hsl(0, 0%, 70%);
  border-radius: 0.2rem;
  padding: 0.2rem 0.4rem;
}

.WindowUpdateDeviceDescription {
  width: 100%;
  height: 100%;
  .WindowUpdateDeviceDescription-body {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 40px;

    .WindowUpdateDeviceDescription-specification {
      width: 100%;
      line-height: 1.1;
      font-size: 0.9rem;
      gap: 0.2rem;
      display: flex;
      flex-direction: column;
      padding: var(--padding);
      opacity: 0.4;
    }
    .WindowUpdateDeviceDescription-description {
      height: 6rem;
    }
  }
}
</style>
