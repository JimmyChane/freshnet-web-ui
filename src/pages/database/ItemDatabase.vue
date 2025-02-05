<script>
import IconDownload from '@/assets/icon/download-black.svg';
import IconMinus from '@/assets/icon/minus-black.svg';
import IconPlus from '@/assets/icon/plus-black.svg';
import ButtonIconText from '@/components/button/ButtonIconText.vue';
import { useDatabaseStore } from '@/pinia-stores/database.store';

import ItemCollection from './ItemCollection.vue';

export default {
  components: { ButtonIconText, ItemCollection },
  props: {
    database: { type: Object, default: null },
  },
  data: (c) => ({
    IconDownload,
    IconMinus,
    IconPlus,
    isSelfExpand: false,
    expands: [],
  }),
  computed: {
    collections: (c) => c.database.collections,
    areExpanded: (c) => c.expands.length >= c.collections.length,
    areCollapsed: (c) => c.expands.length === 0,
    isWide: (c) => c.$store.getters.window.innerWidth > 500,
  },
  methods: {
    addExpand(name) {
      this.expands.push(name);
    },
    removeExpand(name) {
      this.expands.splice(this.expands.indexOf(name), 1);
    },

    allExpand() {
      this.expands = this.collections.map((collection) => collection.name);
    },
    allCollapse() {
      this.expands = [];
    },

    pushDownloadDatabase() {
      useDatabaseStore()
        .exportDatabase({ database: this.database.name })
        .then((databaseContext) => {
          let { filename, data } = databaseContext;
          let dataString = JSON.stringify(data, null, 0);
          this.$store.getters.pushDownload(filename, dataString);
        });
    },
  },
};
</script>

<template>
  <div class="ItemDatabase">
    <div class="ItemDatabase-header">
      <span class="ItemDatabase-title">{{ database.name }}</span>
      <div class="ItemDatabase-actions">
        <ButtonIconText
          :src="IconDownload"
          :text="isWide ? 'Export' : ''"
          @click="pushDownloadDatabase()"
        />
        <ButtonIconText
          :src="isSelfExpand ? IconMinus : IconPlus"
          :text="isWide ? (isSelfExpand ? 'Collapse' : 'Expand') : ''"
          @click="
            if (isSelfExpand) {
              isSelfExpand = false;
              allCollapse();
            } else {
              isSelfExpand = true;
              allCollapse();
            }
          "
        />
      </div>
    </div>

    <div class="ItemDatabase-body" v-if="isSelfExpand">
      <ItemCollection
        v-for="collection in collections"
        :key="collection.name"
        :collection="collection"
        :isExpand="expands.includes(collection.name)"
        @click-expand="
          if (expands.includes(collection.name)) removeExpand(collection.name);
          else addExpand(collection.name);
        "
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.ItemDatabase {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  .ItemDatabase-header {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 1rem;
    .ItemDatabase-title {
      flex-grow: 1;
      font-size: 1rem;
      color: black;
    }
    .ItemDatabase-actions {
      width: max-content;
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 0.1rem;
    }
  }
  .ItemDatabase-body {
    padding-left: 1rem;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 1rem;

    background: hsla(0, 0%, 0%, 0.025);
    border-left: 2px solid hsla(0, 0%, 0%, 0.2);
    border-radius: 0.2rem;
    padding: 1rem;
    padding-right: 0.4rem;
  }
}
</style>
