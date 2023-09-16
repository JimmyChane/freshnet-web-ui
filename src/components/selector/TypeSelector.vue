<script>
   import U from "@/U";
   export default {
      emits: ["click-item-key"],
      props: { items: { type: Array }, defaultKey: { type: String } },
      data: (c) => ({ list: [], selectedKey: "" }),
      watch: {
         items() {
            this.onInvalidateList();
         },
         defaultKey() {
            this.onInvalidateDefaultKey();
         },
      },
      mounted() {
         this.onInvalidateList();
         this.onInvalidateDefaultKey();
      },
      methods: {
         onInvalidateList() {
            this.list = U.optArray(this.items).map((item) => item);
         },
         onInvalidateDefaultKey() {
            this.selectKey(U.optString(this.defaultKey));
         },

         selectKey(key) {
            this.selectedKey = key;
            this.$emit("click-item-key", this.selectedKey);
         },
      },
   };
</script>

<template>
   <div class="TypeSelector">
      <div class="TypeSelector-list">
         <button
            v-for="item of list"
            :key="item.key"
            :class="[
               item.key === selectedKey ? 'TypeSelector-item-selected' : '',
               'TypeSelector-item',
               'transition',
            ]"
            :style="{
               '--primary-color': item.color ? item.color : 'var(--primary-color)',
            }"
            @click="selectKey(item.key)"
         >
            {{ item.title }}
         </button>
      </div>
   </div>
</template>

<style lang="scss" scoped>
   .TypeSelector {
      display: flex;
      flex-direction: column;
   }
   .TypeSelector-list {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      flex-wrap: wrap;
      gap: 0.2rem;
      padding-top: 0.8rem;
      padding-bottom: 0.8rem;
      overflow-x: auto;
      .TypeSelector-separator {
         min-width: 1px;
         height: 100%;
         max-height: calc(100% - 0.8rem);
         background: hsl(0, 0%, 90%);
         margin-left: 0.8rem;
         margin-right: 0.8rem;
      }
      .TypeSelector-item {
         display: flex;
         flex-direction: row;
         align-items: center;
         justify-content: center;
         width: 7.5rem;
         min-width: max-content;
         border-width: 1px;
         border-style: solid;
         border-color: var(--primary-color);
         border-radius: 2rem;
         font-weight: 600;
         color: var(--primary-color);
         padding: 8px 24px;
         background: white;
         cursor: pointer;
         &:hover,
         &:focus {
            background: var(--primary-color);
            color: white;
         }
      }
      .TypeSelector-item-selected {
         background: var(--primary-color);
         color: white;
         cursor: initial;
      }
   }
</style>
