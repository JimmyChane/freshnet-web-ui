<script>
  const Mode = { Grid: 1, List: 2, Detail: 4 };

  import ItemButton from "@/pages/manage/PanelItems-ItemButton.vue";
  import LabelCount from "@/components/LabelCount.vue";
  import ImageViews from "@/components/ImageViews.vue";
  import ImageView from "@/components/ImageView.vue";

  import ServicePrice from "@/items/ServicePrice";
  import State from "@/items/ServiceState";

  import U from "@/U";

  import ItemServiceCustomer from "./ItemService-Customer.vue";
  import ItemServiceTimestamp from "./ItemService-Timestamp.vue";
  import ItemServiceDetailColumn from "./ItemService-DetailColumn.vue";

  export default {
    Mode,

    components: {
      ItemButton,
      LabelCount,
      ImageViews,
      ImageView,
      ItemServiceCustomer,
      ItemServiceTimestamp,
      ItemServiceDetailColumn,
    },
    emits: ["click"],
    props: {
      mode: { type: Number, default: Mode.List },
      item: { type: Object, default: null },
      isSelected: { type: Boolean, default: false },
      detailProperties: { type: Array, default: () => [] },
      headerCustomer: { type: Boolean, default: true },
    },
    computed: {
      isGrid: (c) => c.mode === Mode.Grid,
      isList: (c) => c.mode === Mode.List,
      isDetail: (c) => c.mode === Mode.Detail,

      customer: (c) => c.item.customer,
      name: (c) => c.customer.name,
      phoneNumber: (c) => c.customer.phoneNumber,
      phoneNumberStr: (c) => c.phoneNumber?.toString() ?? "",
      description: (c) => c.item.description,
      images: (c) => c.item.imageFiles,
      isUrgent: (c) => c.item.isUrgent(),
      isWarranty: (c) => c.item.isWarranty(),
      totalCostAmount: (c) => c.totalCost?.amount ?? 0,
      totalQuoteAmount: (c) => c.totalQuote?.amount ?? 0,
      timestamp: (c) => c.item.timestamp,
      state: (c) => c.item.state,
      primaryColor: (c) => State.findByKey(c.state).primaryColor,

      events: (c) => {
        return U.optArray(c.item.events)
          .map((event) => event)
          .sort((event1, event2) => event1.compare(event2));
      },
      totalCost: (c) => {
        return c.events.reduce((cost, event) => {
          if (event.isPurchase()) {
            return cost.plus(event.price);
          }
          return cost;
        }, new ServicePrice().fromData({ amount: 0 }));
      },
      totalQuote: (c) => {
        return c.events.reduce((cost, event) => {
          if (event.isQuotation()) {
            return cost.plus(event.price);
          }
          return cost;
        }, new ServicePrice().fromData({ amount: 0 }));
      },
      labels: (c) => {
        const labels = [];

        if (c.isUrgent) {
          labels.push({
            key: "urgent",
            title: "Urgent",
            primaryColor: "#d93f35",
          });
        }
        if (c.isWarranty) {
          labels.push({
            key: "warranty",
            title: "Warranty",
            primaryColor: "#db950c",
          });
        }
        if (c.totalCostAmount !== 0) {
          labels.push({
            key: `price${c.totalCost.toString()}`,
            title: c.totalCost.toString(),
            primaryColor: "#258915",
          });
        }
        if (c.totalQuoteAmount !== 0) {
          labels.push({
            key: `quotation${c.totalQuote.toString()}`,
            title: c.totalQuote.toString(),
            primaryColor: "#961d96",
          });
        }
        if (c.events.length) {
          labels.push({
            key: "event",
            title: "Event",
            count: c.events.length,
            primaryColor: "#294656",
          });
        }
        if (c.images.length) {
          labels.push({
            key: "images",
            icon: c.host.icon("image-FFFFFF"),
            count: c.images.length,
            primaryColor: "#8C623A",
          });
        }

        return labels;
      },

      classes: (c) => {
        if (c.isGrid) return ["ItemService-isGrid"];
        if (c.isList) return ["ItemService-isList"];
        if (c.isDetail) return ["ItemService-isDetail"];
        return [];
      },
    },
    methods: {
      getPropertyByKey(key) {
        return this.detailProperties.find((property) => {
          return property.key === key;
        });
      },
    },
  };
</script>

<template>
  <ItemButton
    :class="['ItemService', ...classes]"
    :style="{ '--primary-color': primaryColor }"
    :isSelected="isSelected"
    @click="$emit('click', item)"
  >
    <div v-if="isGrid" :class="['transition', 'ItemService-body']">
      <div class="ItemService-top">
        <ItemServiceCustomer
          v-if="headerCustomer"
          :name="name"
          :phoneNumberStr="phoneNumberStr"
        />

        <div class="ItemService-state-dot"></div>
      </div>
      <div class="ItemService-middle">
        <ImageView
          class="ItemService-image"
          v-for="image of images"
          :key="image.name"
          :src="image"
        />
      </div>
      <div class="ItemService-bottom">
        <ItemServiceTimestamp class="ItemService-timestamp" :service="item" />
      </div>
    </div>

    <div v-if="isList" :class="['transition', 'ItemService-body']">
      <div class="ItemService-top">
        <ItemServiceCustomer
          v-if="headerCustomer"
          :name="name"
          :phoneNumberStr="phoneNumberStr"
        />
        <span class="ItemService-description">{{ description }}</span>
        <ImageViews
          class="ItemService-image"
          :width="60"
          :height="40"
          :images="images"
        />
      </div>
      <div class="ItemService-bottom">
        <div class="ItemService-labels">
          <LabelCount
            class="ItemService-label"
            v-for="label of labels"
            :key="label.key"
            :style="{ '--primary-color': label.primaryColor }"
            :title="label.title"
            :icon="label.icon"
            :count="label.count"
          />
        </div>
        <ItemServiceTimestamp class="ItemService-timestamp" :service="item" />
      </div>
    </div>

    <div v-if="isDetail" :class="['transition', 'ItemService-body']">
      <ItemServiceDetailColumn
        :width="getPropertyByKey('customerName').width"
        >{{ name }}</ItemServiceDetailColumn
      >
      <ItemServiceDetailColumn
        :width="getPropertyByKey('customerPhoneNumber').width"
        >{{ phoneNumberStr }}</ItemServiceDetailColumn
      >
      <ItemServiceDetailColumn :width="getPropertyByKey('description').width">{{
        description
      }}</ItemServiceDetailColumn>
      <ItemServiceDetailColumn :width="getPropertyByKey('images').width"
        >Images x{{ images.length }}</ItemServiceDetailColumn
      >
      <ItemServiceDetailColumn :width="getPropertyByKey('notice').width">
        <LabelCount
          class="ItemService-label"
          v-for="label of labels"
          :key="label.key"
          :style="{ '--primary-color': label.primaryColor }"
          :title="label.title"
          :icon="label.icon"
          :count="label.count"
        />
      </ItemServiceDetailColumn>
      <ItemServiceDetailColumn :width="getPropertyByKey('timestamp').width">
        <ItemServiceTimestamp class="ItemService-timestamp" :service="item" />
      </ItemServiceDetailColumn>
    </div>
  </ItemButton>
</template>

<style lang="scss" scoped>
  .ItemService-top {
    padding: 0.6rem;
    margin-right: 0.6em;
    border-bottom: 0.05em solid hsla(0, 0%, 0%, 0.1);
    display: flex;
    flex-direction: row;
    align-items: center;

    .ItemService-state-dot {
      --size: 0.5em;
      min-width: var(--size);
      min-height: var(--size);
      width: var(--size);
      height: var(--size);
      background: var(--primary-color);
      border-radius: var(--size);
    }
  }

  .ItemService {
    width: initial;
    background: white;
  }

  .ItemService-isGrid {
    .ItemService-body {
      width: 100%;
      height: 100%;
      font-weight: 400;
      font-size: 1em;
      color: black;
      text-align: start;
      line-height: 1.1;
      gap: 0.5rem;
      padding: 0.6rem 0.2rem;

      display: flex;
      flex-direction: column;
      align-items: stretch;
      border-radius: 0 0.5em 0.5em 0;
      border: 0.1em solid transparent;

      .ItemService-top {
        padding: 0;
        padding-bottom: 0.6rem;

        display: flex;
        flex-direction: row;
        justify-content: space-between;
      }
      .ItemService-middle {
        gap: 0.2em;

        flex-grow: 1;
        overflow: hidden;

        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        align-items: flex-start;
        justify-content: flex-start;

        .ItemService-image {
          --size: 2.5rem;
          width: var(--size);
          height: var(--size);
          border-radius: 0.4rem;
        }
      }
      .ItemService-bottom {
        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: flex-end;
        justify-content: flex-start;
        gap: 1rem;
        .ItemService-timestamp {
          text-align: start;
        }
      }
    }
  }
  .ItemService-isList {
    .ItemService-body {
      width: 100%;

      font-weight: 400;
      font-size: 1em;
      color: black;
      text-align: start;

      display: flex;
      flex-direction: column;
      align-items: center;
      border-radius: 0.5em;
      border: 0.1em solid transparent;

      .ItemService-top {
        width: 100%;
        height: 4rem;
        min-height: 4rem;
        max-height: 4rem;

        display: flex;
        flex-direction: row;
        align-items: center;

        .ItemService-description {
          padding: 0 0.5rem;

          display: flex;
          align-items: flex-start;
          white-space: pre-line;
          text-overflow: ellipsis;
          word-wrap: break-word;
          overflow: hidden;
          max-height: 2.2em;
          line-height: 1.1em;
          flex-grow: 1;
        }
      }

      .ItemService-bottom {
        width: 100%;
        font-size: 0.8rem;
        gap: 0.1rem;
        padding: 0.6rem 0.8rem;

        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-end;
        flex-wrap: nowrap;

        .ItemService-labels {
          gap: 0.1rem;

          flex-grow: 1;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: flex-start;
          flex-wrap: nowrap;
          flex-wrap: wrap;

          .ItemService-label {
            border-radius: 0.5rem;
            padding: 0.4rem;
          }
        }
        .ItemService-timestamp {
          text-align: end;
        }
      }
    }
  }
  .ItemService-isDetail {
    border-radius: 0;
    .ItemService-body {
      height: 100%;
      gap: 0.5rem;
      padding: 0.3rem;

      font-weight: 400;
      font-size: 1rem;
      color: black;
      text-align: start;
      line-height: 1.1;
      border-radius: 0 0.5em 0.5em 0;
      border-radius: 0.5em;
      border: 0.1em solid transparent;

      display: flex;
      flex-direction: row;
      align-items: flex-start;

      .ItemService-timestamp {
        text-align: start;
        color: inherit;
      }
    }
  }
</style>
