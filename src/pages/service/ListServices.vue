<script>
   const SortMode = { DateCreated: 1, Name: 2, PhoneNumber: 3, Price: 4 };
   const GroupMode = { None: 0, DateCreated: 1 };

   import ItemService from "./ItemService.vue";

   import { getDay, previousDay, endOfDay, format } from "date-fns"; // https://date-fns.org/v2.29.3/docs/Getting-Started

   export default {
      Mode: ItemService.Mode,
      SortMode,
      GroupMode,

      components: { ItemService },
      props: {
         mode: { type: Number, default: ItemService.Mode.List },
         sortMode: { type: Number, default: SortMode.DateCreated },
         groupMode: { type: Number, default: GroupMode.DateCreated },

         items: { type: Array, default: () => [] },
         item: { type: Object, default: () => null },
      },
      data() {
         return {
            properties: [
               { key: "customerName", width: 128 },
               { key: "customerPhoneNumber", width: 112 },
               { key: "description", width: 224 },
               { key: "images", width: 80 },
               { key: "notice", width: 220 },
               { key: "timestamp", width: 176 },
            ],
            itemSelected: null,
         };
      },
      computed: {
         isOver460px: (c) => c.$root.window.innerWidth > 460,

         viewMode: (c) => c.mode,
         isGridView: (c) => c.mode === ItemService.Mode.Grid,
         isListView: (c) => c.mode === ItemService.Mode.List,
         isDetailView: (c) => c.mode === ItemService.Mode.Detail,

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

               const isWithinWeek = () => {
                  const today = new Date();
                  const dayWeek = getDay(today);
                  const dayWeekPrevious = previousDay(today, dayWeek);
                  const timeStartWeek = endOfDay(dayWeekPrevious);
                  return time > timeStartWeek;
               };

               const optGroup = (title) => {
                  let group = groups.find((group) => group.title === title);
                  if (!group) groups.push((group = { title, items: [] }));
                  return group;
               };
               const putItem = (title) => optGroup(title).items.push(item);

               if (ts.isToday()) putItem("Today");
               else if (ts.isYesterday()) putItem("Yesterday");
               else if (isWithinWeek()) putItem(format(time, "EEEE, dd/LL/yyyy"));
               else if (ts.isThisYear()) putItem(format(time, "dd/LL/yyyy"));
               else putItem(ts.getYear().toString());

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
            return this.properties.find((property) => property.key === key);
         },
      },
   };
</script>

<template>
   <div class="ListServices">
      <div
         :class="[
            'ListServices-group',
            isGridView ? 'ListServices-group-gridView' : '',
            isListView ? 'ListServices-group-listView' : '',
            isDetailView ? 'ListServices-group-detailView' : '',
         ]"
         v-for="group of groups"
         :key="group.title"
      >
         <div
            class="ListServices-group-line"
            v-if="groups.indexOf(group) !== 0"
            :style="{ 'max-width': isListView ? '32rem' : '100%' }"
         ></div>

         <span class="ListServices-group-title" v-if="group.title">{{
            group.title
         }}</span>

         <div class="ListServices-items">
            <div class="ListServices-items-header" v-if="isGridView"></div>
            <div
               class="ListServices-items-header"
               v-if="isDetailView && groups.indexOf(group) === 0"
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
               :mode="viewMode"
               :key="`service${item.id}`"
               :item="item"
               :isSelected="isItemSelected(item)"
               :properties="properties"
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

         .ListServices-group-line {
            width: 100%;
            min-height: 1px;
            background-color: rgba(0, 0, 0, 0.1);
            display: flex;
         }

         .ListServices-group-title {
            font-size: 0.8rem;
            font-weight: 600;
            background-color: hsl(0, 0%, 96%);
            box-shadow: 0 0 0.4rem hsl(0, 0%, 80%);
            padding: 0.2rem 0.4rem;
            border-radius: 0.3rem;

            position: sticky;
            z-index: 1;
            top: 9.6rem;
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

      .ListServices-group-gridView {
         .ListServices-items {
            max-width: var(--max-width);
            margin-top: -0.5rem;
            gap: 0.2rem;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr));
            grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));

            .ListServices-items-header {
               grid-column: 1 / -1;
            }
            .ListServices-item {
               width: 100%;
               aspect-ratio: 1/1;
            }
         }
      }
      .ListServices-group-listView {
         .ListServices-items {
            max-width: 32rem;
            gap: 0.2rem;
            display: flex;
            flex-direction: column;
            align-items: center;

            .ListServices-item {
               width: 100%;
            }
         }
      }
      .ListServices-group-detailView {
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
