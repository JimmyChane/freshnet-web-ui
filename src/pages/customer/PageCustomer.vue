<script>
  import Loading from "@/components/Loading.vue";
  import PopupWindow from "@/components/window/PopupWindow.vue";
  import Input from "@/components/Input.vue";

  import WindowAddCustomer from "./WindowAddCustomer.vue";
  import WindowRemoveCustomer from "./WindowRemoveCustomer.vue";
  import WindowUpdateCustomer from "./WindowUpdateCustomer.vue";
  import WindowUpdateDescription from "./WindowUpdateDescription.vue";
  import WindowAddDevice from "./WindowAddDevice.vue";
  import WindowRemoveDevice from "./WindowRemoveDevice.vue";
  import WindowUpdateDeviceSpecifications from "./WindowUpdateDeviceSpecifications.vue";
  import WindowUpdateDeviceDescription from "./WindowUpdateDeviceDescription.vue";

  import PanelCustomers from "./PanelCustomers.vue";
  import PanelCustomer from "./PanelCustomer.vue";
  import PanelRight from "@/components/panel/PanelRight.vue";

  import Server from "@/host/Server";
  import IconPack from "@/app/IconPack";

  export default {
    key: "customer",
    title: "Customers",
    icon: new IconPack(
      Server.resource.icon("customers-FFFFFF"),
      Server.resource.icon("customers-000000"),
    ),

    userPermissions: ["admin", "staff"],

    components: {
      Loading,
      PopupWindow,
      Input,
      PanelCustomers,
      PanelCustomer,
      PanelRight,
    },
    data: (c) => ({
      panelListened: { isWide: false },
      items: [],
      drawerCustomer: null,
    }),
    computed: {
      isLoading: (c) => c.$store.state.stores.customer.getters.isLoading,

      queryId: (c) => c.$route.query.id,
      queryName: (c) => c.$route.query.name,
      queryPhoneNumber: (c) => c.$route.query.phoneNumber,

      currentCustomer: (c) => {
        if (!c.items.length) return null;

        const { queryId, queryName, queryPhoneNumber } = c;

        const isSearchById = !!queryId;

        let customer = null;

        if (isSearchById) {
          customer = c.items.find((customer) => customer.id === queryId);
        } else {
          customer = c.items.find((customer) => {
            const phoneNumberValue = customer.phoneNumber?.value ?? "";
            return (
              customer.name === queryName &&
              phoneNumberValue === queryPhoneNumber
            );
          });
        }

        if (!isSearchById && (customer?.isFromStoreCustomer() ?? false)) {
          c.$store.getters.replaceQuery({
            query: {
              id: customer.id,
              name: null,
              phoneNumber: null,
            },
          });
        }

        return customer;
      },
    },
    watch: {
      "$store.state.stores.customer.getters.items"() {
        this.invalidate();
      },
      currentCustomer() {
        if (!this.currentCustomer) {
          setTimeout(() => (this.drawerCustomer = this.currentCustomer), 1000);
        } else {
          this.drawerCustomer = this.currentCustomer;
        }
      },
    },
    mounted() {
      this.invalidate();
    },
    methods: {
      async invalidate() {
        this.items = [];
        this.items = await this.$store.state.stores.customer.dispatch(
          "generateCustomersAcross",
        );
      },

      clickRefresh() {
        this.$store.state.stores.customer.dispatch("refresh");
        this.invalidate();
      },
      clickClose() {
        this.$store.getters.nextQuery({
          query: { id: null, name: null, phoneNumber: null },
        });
      },

      clickItemAdd() {
        this.$store.dispatch("openPopupWindow", {
          component: WindowAddCustomer,
        });
      },
      clickAddItemDevice(data) {
        this.$store.dispatch("openPopupWindow", {
          component: WindowAddDevice,
          item: data?.item ?? null,
        });
      },

      clickItemRemove(item) {
        const data = { item };

        this.$store.dispatch("openPopupWindow", {
          component: WindowRemoveCustomer,
          item: data?.item ?? null,
          onConfirm: () => {
            if (data.id === this.queryCustomerId) {
              this.clickClose();
            }
          },
        });
      },
      clickRemoveItemDevice(data) {
        this.$store.dispatch("openPopupWindow", {
          component: WindowRemoveDevice,
          param: data ? { customer: data.item, device: data.device } : null,
        });
      },

      clickUpdateCustomer(data) {
        this.$store.dispatch("openPopupWindow", {
          component: WindowUpdateCustomer,
          item: data?.item ?? null,
        });
      },
      clickUpdateDescription(data) {
        this.$store.dispatch("openPopupWindow", {
          component: WindowUpdateDescription,
          item: data?.item ?? null,
        });
      },
      clickUpdateItemDeviceSpecifications(data) {
        this.$store.dispatch("openPopupWindow", {
          component: WindowUpdateDeviceSpecifications,
          param: data
            ? {
                customer: data.customer,
                device: data.device,
                specifications: data.specifications,
              }
            : null,
        });
      },
      clickUpdateItemDeviceDescription(data) {
        this.$store.dispatch("openPopupWindow", {
          component: WindowUpdateDeviceDescription,
          customer: data?.customer ?? null,
          device: data?.device ?? null,
        });
      },
    },
  };
</script>

<template>
  <div class="PageCustomer" :isPanelWide="`${panelListened.isWide}`">
    <PanelCustomers
      class="PageCustomer-panelLeft transition"
      :items="items"
      :itemSelected="currentCustomer"
      :title="$options.title"
      @click-refresh="() => invalidate()"
      @click-item-add="() => clickItemAdd()"
      @click-item-remove="(param) => clickItemRemove(param.item)"
    />

    <PanelRight
      class="PageCustomer-PanelRight"
      titleEmpty="Select customer to view"
      :isShowing="!!currentCustomer"
      @click-collapse="() => clickClose()"
      @on-isWide="(isWide) => (panelListened.isWide = isWide)"
    >
      <PanelCustomer
        class="PageCustomer-PanelCustomer transition"
        :item="drawerCustomer"
        @click-item-close="() => clickClose()"
        @click-item-remove="(param) => this.clickItemRemove(param.item)"
        @click-item-customer-update="(param) => clickUpdateCustomer(param)"
        @click-item-description-update="
          (param) => clickUpdateDescription(param)
        "
        @click-item-device-add="(param) => clickAddItemDevice(param)"
        @click-item-device-remove="(param) => clickRemoveItemDevice(param)"
        @click-item-device-update-specifications="
          (param) => clickUpdateItemDeviceSpecifications(param)
        "
        @click-item-device-update-description="
          (param) => clickUpdateItemDeviceDescription(param)
        "
      />
    </PanelRight>

    <Loading class="PageCustomer-loading" :isShowing="isLoading" />
  </div>
</template>

<style lang="scss" scoped>
  .PageCustomer {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    flex-grow: 1;

    .PageCustomer-panelLeft {
      z-index: 1;
      height: 100%;
    }
    .PageCustomer-PanelRight {
      z-index: 2;
    }
    .PageCustomer-loading {
      position: absolute;
      bottom: 0;
      width: 100%;
      z-index: 1;
    }
  }
  .PageCustomer[isPanelWide="false"] {
    .PageCustomer-panelLeft {
      width: 100dvw;
      max-width: 100%;
    }
  }
  .PageCustomer[isPanelWide="true"] {
    .PageCustomer-panelLeft {
      width: 100dvw;
      max-width: 50%;
    }
  }
</style>
