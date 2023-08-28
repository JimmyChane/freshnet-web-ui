<script>
  import WindowAdd from "./WindowAdd.vue";
  import Loading from "@/components/Loading.vue";
  import Input from "@/components/Input.vue";

  import Actionbar from "./Actionbar.vue";
  import SectionOrder from "./SectionOrder.vue";
  import U from "@/U";

  import Order from "@/items/Order";

  import Server from "@/host/Server";
  import IconPack from "@/app/IconPack";

  export default {
    key: "order",
    name: "ViewOrder",
    title: "Orders",
    icon: new IconPack(
      Server.resource.icon("order-FFFFFF"),
      Server.resource.icon("order-000000"),
    ),
    userPermissions: ["admin", "staff"],

    components: { Loading, Actionbar, SectionOrder, Input },
    data: (c) => ({
      display: { showDialogAppendOrder: false },

      scrollTop: 0,

      pendingItems: [],
      completedItems: [],
    }),
    computed: {
      isLoading: (c) => c.orderStore.getters.isLoading,
      items: (c) => U.optArray(c.orderStore.getters.items),
      currentExpandedOrderid: (c) => c.$route.query.order,
    },
    watch: {
      "orderStore.getters.lastModified"() {
        this.invalidate();
      },
    },
    mounted() {
      this.invalidate();
    },
    methods: {
      async invalidate() {
        this.pendingItems = [];
        this.completedItems = [];

        const groups = await this.orderStore.dispatch("getGroupsByStatus");
        const groupPending = groups.find((group) => {
          return group.status === Order.Status.Pending;
        });
        const groupCompleted = groups.find((group) => {
          return group.status === Order.Status.Completed;
        });

        this.pendingItems = groupPending?.items ?? [];
        this.completedItems = groupCompleted?.items ?? [];
      },
      refresh() {
        this.orderStore.dispatch("refresh").catch((error) => {
          this.$store.dispatch("snackbarShow", "Error While Refreshing Order");
          console.error(error);
        });
      },
      toAdd() {
        this.$store.dispatch("openPopupWindow", { component: WindowAdd });
      },
    },
  };
</script>

<template>
  <div
    class="PageOrder transition"
    @scroll="(event) => (scrollTop = event.target.scrollTop)"
  >
    <Actionbar
      class="PageOrder-actionbar"
      :title="$options.title"
      :items="items"
      @click-item="
        (item) => $store.getters.replaceQuery({ query: { order: item.id } })
      "
      @click-item-add="() => toAdd()"
      @click-refresh="() => refresh()"
    />

    <main>
      <SectionOrder
        class="main-section"
        title="Pending"
        :items="pendingItems"
        :currentItemIdSelected="currentExpandedOrderid"
        @click-collapse="
          (item) => $store.getters.replaceQuery({ query: { order: null } })
        "
        @click-expand="
          (item) => $store.getters.replaceQuery({ query: { order: item.id } })
        "
        @click-complete="
          (item) => orderStore.dispatch('updateToCompletedOfId', item.id)
        "
        @click-remove="
          (item) => orderStore.dispatch('removeOItemOfId', { id: item.id })
        "
      />

      <SectionOrder
        class="main-section"
        title="Completed"
        :items="completedItems"
        :currentItemIdSelected="currentExpandedOrderid"
        @click-collapse="
          (item) => $store.getters.replaceQuery({ query: { order: null } })
        "
        @click-expand="
          (item) => $store.getters.replaceQuery({ query: { order: item.id } })
        "
        @click-pending="
          (item) => orderStore.dispatch('updateToPendingOfId', item.id)
        "
        @click-remove="
          (item) => orderStore.dispatch('removeOItemOfId', { id: item.id })
        "
      />
    </main>

    <Loading
      class="viewOrder-loading"
      :isShowing="orderStore.getters.isLoading"
    />
  </div>
</template>

<style lang="scss" scoped>
  .PageOrder {
    --width-max: 550px;

    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    align-items: stretch;

    overflow-y: auto;
    height: 100%;
    width: 100%;
    padding-bottom: 80px;

    main {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-top: 10px;

      .main-section {
        margin-top: 10px;
        margin-bottom: 20px;
        background: white;
        box-shadow: 0 2px 4px #b5b5b5;
        padding: 10px;
      }
      @media (min-width: 550px) {
        padding-left: 20px;
        padding-right: 20px;
        .main-section {
          border-radius: 1rem;
        }
      }
    }

    .viewOrder-item {
      .viewOrder-item-seperator {
        margin: 4px 0;
        min-width: auto;
        min-height: 0.5px;
        background: hsla(0, 0%, 0%, 0.1);
      }
    }

    .viewOrder-loading {
      position: absolute;
    }
  }
</style>
