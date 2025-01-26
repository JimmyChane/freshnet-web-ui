<script>
import PanelAction from '@/components/panel/PanelAction.vue';
import TypeSelector from '@/components/selector/TypeSelector.vue';
import {
  PENDING_SERVICE_STATE,
  ServiceState,
  mapServiceState,
} from '@/items/ServiceState';

import LayoutFindCustomer from './LayoutFindCustomer.vue';
import BodyBelongings from './WindowUpdateService-belongings.vue';
import BodyCustomer from './WindowUpdateService-customer.vue';
import BodyDescription from './WindowUpdateService-description.vue';
import BodyLine from './WindowUpdateService-line.vue';
import BodyUser from './WindowUpdateService-user.vue';

export default {
  components: {
    PanelAction,
    TypeSelector,
    LayoutFindCustomer,
    BodyUser,
    BodyCustomer,
    BodyDescription,
    BodyBelongings,
    BodyLine,
  },
  props: {
    popupWindow: { type: Object },
  },
  data: (c) => ({
    ServiceState,

    data: {
      nameOfUser: '',
      customer: { name: '', phoneNumber: '' },
      description: '',
      belongings: [],
    },
  }),
  computed: {
    isShowing: (c) => c.popupWindow.isShowing,

    user: (c) => c.$store.state.stores.login.getters.user,
    nameUserType: (c) => {
      if (c.user.isTypeAdmin()) return 'Admin';
      if (c.user.isTypeStaff()) return 'Staff';
      return 'unknown';
    },

    stateMenus: (c) => {
      return mapServiceState((state) => {
        return {
          key: state.key,
          title: state.title,
          icon: state.icon,
          color: state.primaryColor,
        };
      });
    },
  },
  methods: {
    resetData() {
      this.data = {
        nameOfUser: '',
        customer: { name: '', phoneNumber: '' },
        description: '',
        belongings: [],
      };

      if (!this.state) {
        this.data.state = PENDING_SERVICE_STATE.key;
      }

      const now = new Date();
      now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
      now.setMilliseconds(null);
      now.setSeconds(null);
      this.$refs.DateTimeInput.value = now.toISOString().slice(0, -1);
    },
    trimData() {
      this.data.nameOfUser = this.data.nameOfUser.trim();
      this.data.customer.name = this.data.customer.name.trim();
      this.data.customer.phoneNumber = this.data.customer.phoneNumber.trim();
      this.data.description = this.data.description.trim();
      this.data.belongings = this.$refs.BelongingListEdit.getResults();
      this.data.time = Date.parse(this.$refs.DateTimeInput.value);

      return this.data;
    },

    onOk() {
      this.data = this.trimData();

      if (Number.isNaN(this.data.time)) {
        this.$store.dispatch('snackbarShow', 'Date & Time Not Set');
        return;
      }
      if (!this.data.state) {
        this.$store.dispatch('snackbarShow', 'State Not Set');
        return;
      }

      this.$store.state.stores.service
        .dispatch('importItem', { data: this.data })
        .then((service) => {
          this.popupWindow.showService(service);
          this.popupWindow.close();
        })
        .catch((error) => {
          this.$store.dispatch('snackbarShow', 'Failed to import a service');
          console.error(error);
        });
    },

    clickCustomerSuggestion(customer) {
      this.data.customer.name = customer.name;
      this.data.customer.phoneNumber = customer.phoneNumber
        ? customer.phoneNumber.toString()
        : '';
    },
  },
  mounted() {
    this.resetData();
  },
};
</script>

<template>
  <PanelAction
    title="Import Service"
    :isShowing="isShowing"
    :isLoading="$store.state.stores.service.getters.isFetching"
    :isClickable="!$store.state.stores.service.getters.isFetching"
    @click-ok="onOk()"
    @click-cancel="() => popupWindow.close()"
    @click-dismiss="() => popupWindow.close()"
  >
    <div class="WindowService-body">
      <BodyUser
        :name="data.nameOfUser"
        @input-name="(value) => (data.nameOfUser = value)"
      />

      <div class="WindowService-datetime">
        <span class="WindowService-title">Creation Date & Time</span>
        <div><input ref="DateTimeInput" type="datetime-local" /></div>
      </div>
      <BodyLine />

      <div class="WindowService-state">
        <span class="WindowService-title">States</span>
        <TypeSelector
          :items="stateMenus"
          :defaultKey="data.state"
          @click-item-key="(key) => (data.state = key)"
        />
      </div>
      <BodyLine />

      <BodyCustomer
        :name="data.customer.name"
        :phoneNumber="data.customer.phoneNumber"
        @input-name="(value) => (data.customer.name = value)"
        @input-phoneNumber="(value) => (data.customer.phoneNumber = value)"
      />
      <LayoutFindCustomer
        class="WindowService-findCustomers"
        :inputName="data.customer.name"
        :inputPhoneNumber="data.customer.phoneNumber"
        @click-item="(customer) => clickCustomerSuggestion(customer)"
      />
      <BodyLine />

      <BodyDescription
        :description="data.description"
        @input-description="(value) => (data.description = value)"
      />
      <BodyLine />

      <BodyBelongings :belongings="data.belongings" ref="BelongingListEdit" />
    </div>
  </PanelAction>
</template>

<style lang="scss" scoped>
.WindowService-body {
  max-width: 100%;
  width: 35rem;
  display: flex;
  flex-direction: column;
  gap: 40px;

  .WindowService-title {
    font-size: 1.1rem;
    font-weight: 600;
  }

  .WindowService-datetime {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    :nth-child(2) {
      display: flex;
      flex-direction: column;
      & > * {
        border: 1px solid hsla(0, 0%, 0%, 0.1);
      }
    }
  }
  .WindowService-state {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
  .WindowService-findCustomers {
    width: 100%;
    max-height: 20rem;
  }
}
</style>
