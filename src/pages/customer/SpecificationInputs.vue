<script>
import { SpecificationKey } from '@/items/Specification';
import { useSpecificationStore } from '@/stores/specification.store';

import Selector4 from '@/components/selector/Selector4.vue';

import ItemSpec from './ItemSpecificationInput.vue';

export default {
  components: { ItemSpec, Selector4 },
  props: { items: { type: Array, default: () => [] } },
  data: (c) => ({ list: [] }),
  computed: {
    KeyNone: (c) => 'none',
    SpecKey: (c) => SpecificationKey,
    SpecKeys: (c) => [
      c.KeyNone,
      ...Object.keys(c.SpecKey).map((key) => c.SpecKey[key]),
    ],
    SpecificationMenus: (c) => {
      return [
        { key: c.KeyNone, title: 'None' },
        ...useSpecificationStore().items.map((item) => item),
      ]
        .map((item) => ({
          key: item.key,
          title: item.title,
          icon: item.icon?.toUrl() ?? '',
        }))
        .filter((menu) => {
          if (menu.key === 'none') return true;

          const dataSpecification = c.list.find((dataSpec) => {
            return dataSpec.typeKey === menu.key;
          });
          return !dataSpecification;
        })
        .sort((menu1, menu2) => {
          return c.SpecKeys.indexOf(menu1.key) - c.SpecKeys.indexOf(menu2.key);
        });
    },
  },
  watch: {
    items() {
      this.list = this.items;
    },
  },
  methods: {
    addItem(item) {
      this.list.push(item);
    },
    removeItem(item) {
      this.list.splice(this.list.indexOf(item), 1);
    },
  },
  mounted() {
    useSpecificationStore().refresh();
  },
};
</script>

<template>
  <div class="SpecificationInputs">
    <div class="SpecificationInputs-contents">
      <ItemSpec
        v-for="item in list"
        :key="item.key"
        :item="item"
        @input-content="(value) => (item.content = value)"
        @click-remove="(item) => removeItem(item)"
      />
    </div>
    <Selector4
      :menus="SpecificationMenus"
      @click-menu="(menu) => addItem({ content: '', typeKey: menu.key })"
    />
  </div>
</template>

<style lang="scss" scoped>
.SpecificationInputs {
  display: flex;
  flex-direction: column;
  gap: 1em;
  --primary-color: hsl(0, 0%, 30%);
  .SpecificationInputs-contents {
    display: flex;
    flex-direction: column;
    gap: 0.3em;
  }
}
</style>
