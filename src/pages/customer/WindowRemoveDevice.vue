<script>
import { RequirementCustomer } from '@/entity/model/Customer';
import { useCustomerStore } from '@/stores/customer.store';

import PanelAction from '@/components/panel/PanelAction.vue';

import WindowSection from './WindowSection.vue';

export default {
  components: { PanelAction, WindowSection },
  props: { popupWindow: { type: Object } },
  data: (c) => ({ Requirement: RequirementCustomer }),
  computed: {
    isShowing: (c) => c.popupWindow.isShowing,
    param: (c) => c.popupWindow.param,
    isLoading: (c) => useCustomerStore().isLoading,
    isClickable: (c) => !useCustomerStore().isLoading,
    customer: (c) => c.param?.customer ?? null,
    device: (c) => c.param?.device ?? null,
  },
  methods: {
    clickOk() {
      useCustomerStore()
        .removeDevice({
          ownerCustomerId: this.device.ownerCustomerId,
          id: this.device.id,
        })
        .then((item) => this.popupWindow.close());
    },
  },
};
</script>

<template>
  <PanelAction
    class="WindowRemoveDevice"
    title="Remove Device?"
    :isShowing="isShowing"
    :isLoading="isLoading"
    :isClickable="isClickable"
    @click-dismiss="() => popupWindow.close()"
    @click-cancel="() => popupWindow.close()"
    @click-ok="() => clickOk()"
  >
    <div class="WindowRemoveDevice-body" v-if="param">
      <div class="WindowRemoveDevice-description" v-if="device.description">
        <span class="WindowRemoveDevice-description-header">Description</span>
        <span class="WindowRemoveDevice-description-body">
          {{ device.description }}
        </span>
      </div>

      <div class="WindowRemoveDevice-description" v-if="device.categoryKey">
        <span class="WindowRemoveDevice-description-header">Category</span>
        <span class="WindowRemoveDevice-description-body">
          {{ device.categoryKey }}
        </span>
      </div>
    </div>
  </PanelAction>
</template>

<style lang="scss" scoped>
.WindowRemoveDevice-reuse-input {
  font-size: 1rem;
  border: none;
  background: hsla(0, 0%, 0%, 0.03);
  border-bottom: 1px solid hsl(0, 0%, 70%);
  border-radius: 0.2rem;
  padding: 0.2rem 0.4rem;
}

.WindowRemoveDevice {
  width: 100%;
  height: 100%;
  .WindowRemoveDevice-body {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 0.5rem;

    .WindowRemoveDevice-namePhoneNumber {
      background: hsla(201, 35%, 25%, 0.02);
      border: 1px solid hsla(201, 35%, 25%, 0.05);
      border-radius: 0.5rem;
      padding: 0.5rem 1rem;
      flex-grow: 1;
      overflow: hidden;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      align-items: flex-start;
      column-gap: 2rem;
      row-gap: 0.3rem;

      .WindowRemoveDevice-namePhoneNumber-section {
        flex-grow: 0;
        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        line-height: 1.2;
        .WindowRemoveDevice-namePhoneNumber-section-header {
          min-width: 8rem;
          min-height: 2.5rem;
          word-break: break-all;
          text-overflow: clip;
          overflow-x: hidden;

          font-weight: 600;
          font-size: 0.8rem;
          display: flex;
          flex-direction: row;
          align-items: center;

          flex-grow: 0;
          display: flex;
          flex-direction: row;
          align-items: center;
        }
        .WindowRemoveDevice-namePhoneNumber-section-content {
          min-height: 2.5rem;
          flex-grow: 1;
          display: flex;
          flex-direction: row;
          align-items: center;
        }
      }
    }
    .WindowRemoveDevice-description {
      background: hsla(201, 35%, 25%, 0.02);
      border: 1px solid hsla(201, 35%, 25%, 0.05);
      padding: 0.5rem;
      border-radius: 0.5rem;
      display: flex;
      flex-direction: column;
      align-items: stretch;
      row-gap: 0.5rem;
      .WindowRemoveDevice-description-header {
        min-height: 2.5rem;
        flex-grow: 1;
        padding: 0.5rem;
        font-weight: 600;
        font-size: 0.8rem;

        display: flex;
        flex-direction: row;
        align-items: center;
      }
      .WindowRemoveDevice-description-body {
        padding: 0.5rem;
        flex-grow: 1;
        display: flex;
        flex-direction: column;
      }
    }
  }
}
</style>
