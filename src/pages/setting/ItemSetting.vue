<script lang="ts">
  import ItemSettingHeader from "./ItemSetting-Header.vue";
  import Toggle from "./ItemSetting-Toggle.vue";
  import TextArea from "./ItemSetting-TextArea.vue";
  import List from "./ItemSetting-List.vue";
  import U from "@/U";
  import Vue from "vue";

  interface Setting {
    list: any[];
  }

  export default Vue.extend({
    name: "ItemSetting",
    components: { ItemSettingHeader, Toggle, TextArea, List },
    props: {
      item: { type: Object as () => Setting },
      title: { type: String, default: "" },
    },
    data() {
      return { U };
    },
    computed: {
      list(): any[] {
        return U.optArray(this.item?.list);
      },
    },
  });
</script>

<template>
  <div class="ItemSetting">
    <ItemSettingHeader :title="item.getTitle()" />

    <div
      class="ItemSetting-item"
      v-for="subItem in list"
      :key="`${item.getKey()}${item.getTitle()}${item.getParentTitle()}${subItem.getKey()}${subItem.getParentTitle()}`"
    >
      <TextArea v-if="subItem.type === 'text'" :item="subItem" />
      <Toggle v-else-if="subItem.type === 'boolean'" :item="subItem" />
      <ItemSetting v-else :item="subItem" />
    </div>

    <List v-if="item.type === 'array-text'" :item="item" />
  </div>
</template>

<style lang="scss" scoped>
  .ItemSetting {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    align-items: stretch;
    justify-content: flex-start;
    overflow: hidden;
    gap: 2px;
    border-radius: 1rem;

    .ItemSetting-item {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: stretch;
    }
  }
</style>
