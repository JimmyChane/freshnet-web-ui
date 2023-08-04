<script>
  const SortMode = { DateCreated: 1, Name: 2, PhoneNumber: 3, Price: 4 };
  const GroupMode = { None: 0, DateCreated: 1 };

  import ItemService from "./item-service/ItemService.vue";
  import FloatingTimestamp from "./FloatingTimestamp.vue";

  import { format } from "date-fns";

  export default {
    LayoutMode: ItemService.Mode,
    SortMode,
    GroupMode,

    components: { FloatingTimestamp, ItemService },
    props: {
      layoutMode: { type: Number, default: ItemService.Mode.List },
      sortMode: { type: Number, default: SortMode.DateCreated },
      groupMode: { type: Number, default: GroupMode.DateCreated },

      items: { type: Array, default: () => [] },
      item: { type: Object, default: () => null },
    },
    data: (c) => ({
      detailProperties: [
        { key: "customerName", width: 128 },
        { key: "customerPhoneNumber", width: 112 },
        { key: "description", width: 224 },
        { key: "images", width: 80 },
        { key: "notice", width: 220 },
        { key: "timestamp", width: 176 },
      ],
      itemSelected: null,
    }),
    computed: {
      isOver460px: (c) => c.store.getters.window.innerWidth > 460,

      isGridView: (c) => c.layoutMode === ItemService.Mode.Grid,
      isListView: (c) => c.layoutMode === ItemService.Mode.List,
      isDetailView: (c) => c.layoutMode === ItemService.Mode.Detail,

      viewMode: (c) => {
        switch (c.layoutMode) {
          case ItemService.Mode.Grid:
            return "grid";
          case ItemService.Mode.List:
            return "list";
          case ItemService.Mode.Detail:
            return "detail";
          default:
            "";
        }
      },

      isSortDateCreated: (c) => c.sortMode === SortMode.DateCreated,
      isSortName: (c) => c.sortMode === SortMode.Name,
      isSortPhoneNumber: (c) => c.sortMode === SortMode.PhoneNumber,
      isSortPrice: (c) => c.sortMode === SortMode.Price,

      sortedItems: (c) => {
        if (c.isSortDateCreated)
          return c.items.sort((item1, item2) => {
            return item1.compareTimestamp(item2);
          });
        if (c.isSortName)
          return c.items.sort((item1, item2) => {
            return item1.customer.compareName(item2.customer);
          });
        if (c.isSortPhoneNumber)
          return c.items.sort((item1, item2) => {
            return item1.customer.comparePhoneNumber(item2.customer);
          });
        if (c.isSortPrice)
          return c.items.sort((item1, item2) => {
            return item1.comparePrice(item2);
          });

        return items;
      },

      groups() {
        const groups =
          this.groupMode === GroupMode.DateCreated
            ? this.groupsOfDate(this.items)
            : [{ items: this.items }];

        for (const group of groups) this.sortItems(group.items);

        return groups;
      },
    },
    watch: {
      item() {
        if (!this.item) {
          setTimeout(() => {
            this.itemSelected = this.item;
          }, 500);
        } else {
          this.itemSelected = this.item;
        }
      },
    },
    methods: {
      groupsOfDate(items) {
        return items.reduce((groups, item) => {
          const ts = item.timestamp;
          const time = ts.time;

          const optGroup = (title) => {
            let group = groups.find((group) => group.title === title);
            if (!group) groups.push((group = { title, items: [] }));
            return group;
          };
          const putItem = (title) => optGroup(title).items.push(item);

          if (ts.isToday()) {
            putItem(`Today, ${format(time, "EEE, dd/LL/yyyy")}`);
          } else if (ts.isYesterday()) {
            putItem(`Yesterday, ${format(time, "EEE, dd/LL/yyyy")}`);
          } else {
            putItem(format(time, "EEE, dd/LL/yyyy"));
          }

          return groups;
        }, []);
      },
      sortItems(items) {
        if (this.isSortDateCreated)
          return items.sort((item1, item2) => {
            return item1.compareTimestamp(item2);
          });
        if (this.isSortName)
          return items.sort((item1, item2) => {
            return item1.customer.compareName(item2.customer);
          });
        if (this.isSortPhoneNumber)
          return items.sort((item1, item2) => {
            return item1.customer.comparePhoneNumber(item2.customer);
          });
        if (this.isSortPrice)
          return items.sort((item1, item2) => {
            return item1.comparePrice(item2);
          });

        return items;
      },

      isItemSelected(item) {
        return item === this.itemSelected;
      },
      clickItem(item) {
        this.$emit("click-item", item);
      },

      getPropertyByKey(key) {
        return this.detailProperties.find((property) => {
          return property.key === key;
        });
      },
    },
  };
</script>

<template>
  <div class="ListServices">
    <div
      class="ListServices-group"
      :viewMode="viewMode"
      v-for="(group, index) in groups"
      :key="group.title"
    >
      <FloatingTimestamp
        class="ListServices-group-title"
        v-if="group.title"
        :title="group.title"
      />

      <div class="ListServices-items">
        <div
          class="ListServices-items-header"
          v-if="isDetailView && index === 0"
        >
          <span
            class="Property-customerName"
            :style="{
              '--width': `${getPropertyByKey('customerName').width}px`,
            }"
            >Customer Name</span
          >
          <span
            class="Property-customerPhoneNumber"
            :style="{
              '--width': `${getPropertyByKey('customerPhoneNumber').width}px`,
            }"
            >Customer Phone Number</span
          >
          <span
            class="Property-description"
            :style="{
              '--width': `${getPropertyByKey('description').width}px`,
            }"
            >Description</span
          >
          <span
            class="Property-images"
            :style="{
              '--width': `${getPropertyByKey('images').width}px`,
            }"
            >Images</span
          >
          <span
            class="Property-notice"
            :style="{
              '--width': `${getPropertyByKey('notice').width}px`,
            }"
            >Notice</span
          >
          <span
            class="Property-timestamp"
            :style="{
              '--width': `${getPropertyByKey('timestamp').width}px`,
            }"
            >Date Created</span
          >
        </div>

        <ItemService
          class="ListServices-item"
          v-for="item in group.items"
          :mode="layoutMode"
          :key="`service${item.id}`"
          :item="item"
          :isSelected="isItemSelected(item)"
          :detailProperties="detailProperties"
          @click="() => clickItem(item)"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .ListServices {
    z-index: 1;
    scroll-padding-top: 33%;
    gap: 1rem;

    width: 100%;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    align-items: center;
    padding: 1rem;
    padding-top: 0.8rem;

    .ListServices-group {
      width: 100%;
      gap: 0.5rem;
      display: flex;
      flex-direction: column;
      align-items: center;

      .ListServices-group-title {
        z-index: 1;
        top: 7.5rem;
      }

      .ListServices-items {
        width: 100%;
        .PanelService-items-title {
          background: hsla(0, 0%, 0%, 0.04);
          border-radius: 0.4rem;
          padding: 0.3rem 0.5rem;
        }
      }
    }

    .ListServices-group[viewMode="grid"] {
      .ListServices-items {
        max-width: var(--max-width);
        gap: 0.1rem;
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr));

        .ListServices-items-header {
          grid-column: 1 / -1;
        }
        .ListServices-item {
          width: 100%;
          aspect-ratio: 1/1;
        }
      }
    }
    .ListServices-group[viewMode="list"] {
      .ListServices-items {
        gap: 0.5rem;
        display: flex;
        flex-direction: column;
        align-items: center;

        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(18rem, 1fr));

        .ListServices-item {
          width: 100%;
        }
      }
    }
    .ListServices-group[viewMode="detail"] {
      align-items: flex-start;
      .ListServices-group-title {
        left: 1rem;
      }
      .ListServices-items {
        width: max-content;

        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;

        border-radius: 0.5rem;
        overflow: hidden;

        .ListServices-items-header {
          gap: 0.5rem;
          padding: 1rem 0.6rem;

          display: flex;
          flex-direction: row;

          & > * {
            --width: 2rem;
            height: 1.1rem;
            white-space: pre-line;
            text-overflow: ellipsis;
            word-wrap: break-word;
            overflow: hidden;
          }

          .Property-customerName {
            width: var(--width);
            min-width: var(--width);
            max-width: var(--width);
          }

          .Property-customerPhoneNumber {
            width: var(--width);
            min-width: var(--width);
            max-width: var(--width);
          }

          .Property-description {
            width: var(--width);
            min-width: var(--width);
            max-width: var(--width);
          }

          .Property-images {
            width: var(--width);
            min-width: var(--width);
            max-width: var(--width);
          }

          .Property-notice {
            width: var(--width);
            min-width: var(--width);
            max-width: var(--width);
          }

          .Property-timestamp {
            width: var(--width);
            min-width: var(--width);
            max-width: var(--width);
          }
        }
      }
    }
  }
</style>
