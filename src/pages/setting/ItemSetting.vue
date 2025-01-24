<script>
import { optArray } from '@/U';

import ItemSettingHeader from './ItemSetting-Header.vue';
import List from './ItemSetting-List.vue';
import TextArea from './ItemSetting-TextArea.vue';
import Toggle from './ItemSetting-Toggle.vue';

export default {
  name: 'ItemSetting',
  components: { ItemSettingHeader, Toggle, TextArea, List },
  props: {
    item: { type: Object, default: () => null },
    title: { type: String, default: '' },
  },
  data: (c) => ({ U }),
  computed: { list: (c) => optArray(c.item.list) },
};
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
