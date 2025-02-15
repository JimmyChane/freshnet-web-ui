<script>
import { isArray } from '@/U';
import { RequirementCustomer } from '@/items/Customer';
import { CustomerDeviceSpecification } from '@/items/CustomerDeviceSpecification';
import { useCustomerStore } from '@/stores/customer.store';

import PanelAction from '@/components/panel/PanelAction.vue';

import SpecificationInputs from './SpecificationInputs.vue';
import WindowSection from './WindowSection.vue';

export default {
  components: { PanelAction, WindowSection, SpecificationInputs },
  props: {
    popupWindow: { type: Object },
  },
  data: (c) => ({
    Requirement: RequirementCustomer,
    data: { specifications: [] },
  }),
  computed: {
    isShowing: (c) => c.popupWindow.isShowing,
    param: (c) => c.popupWindow.param,
    isLoading: (c) => useCustomerStore().isLoading,
    isClickable: (c) => !useCustomerStore().isLoading,
    customer: (c) => c.param?.customer ?? undefined,
    device: (c) => c.param?.device ?? undefined,
    specifications: (c) => {
      const specifications = c.param?.specifications;
      return isArray(specifications) ? [...specifications] : [];
    },
  },
  watch: {
    param() {
      this.invalidateData();
    },
  },
  mounted() {
    this.invalidateData();
  },
  methods: {
    invalidateData() {
      this.data.specifications = this.specifications.map((specification) => {
        return new CustomerDeviceSpecification()
          .fromData(specification)
          .toData();
      });
    },

    clickOk() {
      useCustomerStore()
        .updateDeviceSpecifications({
          _id: this.device.id,
          specifications: this.data.specifications,
        })
        .then((item) => this.popupWindow.close());
    },
  },
};
</script>

<template>
  <PanelAction
    class="WindowUpdateDeviceSpecifications"
    :title="`Update Device Specifications${
      customer ? ` for ${customer.name}` : ''
    }`"
    :isShowing="isShowing"
    :isLoading="isLoading"
    :isClickable="isClickable"
    @click-dismiss="() => popupWindow.close()"
    @click-cancel="() => popupWindow.close()"
    @click-ok="() => clickOk()"
  >
    <div class="WindowUpdateDeviceSpecifications-body">
      <WindowSection class="WindowUpdateDeviceSpecifications-description">
        <SpecificationInputs :items="data.specifications" />
      </WindowSection>
    </div>
  </PanelAction>
</template>

<style lang="scss" scoped>
.WindowUpdateDeviceSpecifications-reuse-input {
  font-size: 1rem;
  border: none;
  background: hsla(0, 0%, 0%, 0.03);
  border-bottom: 1px solid hsl(0, 0%, 70%);
  border-radius: 0.2rem;
  padding: 0.2rem 0.4rem;
}

.WindowUpdateDeviceSpecifications {
  width: 100%;
  height: 100%;
  .WindowUpdateDeviceSpecifications-body {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 40px;

    .WindowUpdateDeviceSpecifications-customer {
      .WindowUpdateDeviceSpecifications-customer-body {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        .WindowUpdateDeviceSpecifications-customer-part {
          width: 100%;
          min-height: 2.5rem;
          display: flex;
          flex-direction: row;
          column-gap: 1rem;
          .WindowUpdateDeviceSpecifications-customer-title {
            flex-grow: 0;
            max-width: 120px;
            min-width: 120px;
          }
          .WindowUpdateDeviceSpecifications-reuse-input {
            flex-grow: 1;
          }
        }
      }
    }
    .WindowUpdateDeviceSpecifications-description {
      .WindowUpdateDeviceSpecifications-reuse-input {
        height: 6rem;
        resize: none;
      }
    }
  }
}
</style>
