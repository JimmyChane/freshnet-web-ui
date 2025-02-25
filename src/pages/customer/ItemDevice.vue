<script>
import IconOption from '@/assets/icon/option-000000.svg';
import IconTrash from '@/assets/icon/trash-DB4A2A.svg';
import { CustomerDevice } from '@/entity/model/CustomerDevice';
import { useCategoryStore } from '@/stores/category.store';

import MenuOption from '@/components/button/MenuOption.vue';

import ItemSpecification from './ItemSpecification.vue';
import Item from './PanelCustomer-Item.vue';

export default {
  components: { MenuOption, ItemSpecification, Item },
  emtis: ['click', 'click-remove'],
  props: {
    item: { type: CustomerDevice, default: null },
    selected: { type: Boolean, default: false },
  },
  data() {
    return { IconTrash, IconOption };
  },
  computed: {
    category: (c) => {
      const { categoryKey } = c.item;

      return useCategoryStore().items.find((category) => {
        return category.key === categoryKey;
      });
    },
  },
  mounted() {
    useCategoryStore().getItems();
  },
};
</script>

<template>
  <Item class="ItemDevice" :selected="selected" :isSelectable="false">
    <div class="ItemDevice-body" v-if="item">
      <div class="ItemDevice-header">
        <div class="ItemDevice-header-category" v-if="category">
          <img
            class="ItemDevice-header-category-icon"
            :src="category.icon.toUrl()"
          />
          <span class="ItemDevice-header-category-title">
            {{ category.title }}
          </span>
        </div>
        <span class="ItemDevice-header-category-notFound" v-if="!category">
          Category Not Found
        </span>
        <div class="ItemDevice-header-end">
          <MenuOption
            :menus="[
              {
                key: 'updateDescription',
                title: 'Update Description',
                interact: () => $emit('click-update-description', { item }),
              },
              {
                key: 'updateSpecification',
                title: 'Update Specifications',
                interact: () => $emit('click-update-specifications', { item }),
              },
              {
                key: 'delete',
                title: 'Delete',
                color: '#DB4A2A',
                icon: IconTrash,
                interact: () => $emit('click-remove', { item }),
              },
            ]"
            :icon="IconOption"
          />
        </div>
      </div>

      <div
        class="ItemDevice-main"
        v-if="item.specifications.length || item.description"
      >
        <div class="ItemDevice-description" v-if="item.description">
          {{ item.description }}
        </div>

        <div class="ItemDevice-specification" v-if="item.specifications.length">
          <ItemSpecification
            v-for="specification of item.specifications"
            :key="`${specification.typeKey}${specification.content}`"
            :item="specification"
          />
        </div>
      </div>
    </div>
    <div class="ItemDevice-notFound" v-if="!item">
      <span class="ItemDevice-notFound-title">Device Not Found</span>
    </div>
  </Item>
</template>

<style lang="scss" scoped>
.ItemDevice {
  padding-top: 0.2rem;
  border-radius: 0.5rem;

  .ItemDevice-body {
    width: 100%;
    font-weight: 400;
    font-size: 1rem;
    color: black;
    text-align: start;
    flex-grow: 1;
    height: unset;
    display: flex;
    flex-direction: column;
    align-items: stretch;

    .ItemDevice-header {
      padding: 0.4rem 0;
      width: 100%;
      column-gap: 0.5rem;
      color: black;
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      align-items: center;
      .ItemDevice-header-category {
        font-weight: 600;
        overflow: hidden;
        column-gap: 0.5rem;
        display: flex;
        flex-direction: row;
        flex-grow: 1;
        flex-wrap: nowrap;
        align-items: center;
        .ItemDevice-header-category-icon {
          --size: 1.2rem;
          width: var(--size);
          height: var(--size);
        }
      }
      .ItemDevice-header-category-notFound {
        flex-grow: 1;
        font-size: 0.8rem;
      }

      .ItemDevice-header-end {
        display: flex;
        flex-direction: row;
        flex-grow: 0;
      }
    }
    .ItemDevice-main {
      --padding: 0.8rem 0;
      line-height: 1.1;
      display: flex;
      flex-direction: column;
      align-items: stretch;

      .ItemDevice-description {
        width: 100%;
        padding: var(--padding);

        display: flex;
        flex-direction: column;
        justify-content: center;
        border-top: 1px solid hsla(0, 0%, 0%, 0.2);

        font-weight: 300;
        font-size: 0.9rem;
        line-height: 1.1;

        word-wrap: break-word;
      }
      .ItemDevice-specification {
        width: 100%;
        line-height: 1.1;
        font-size: 0.9rem;
        gap: 0.2rem;
        display: flex;
        flex-direction: column;
        border-top: 1px solid hsla(0, 0%, 0%, 0.2);
        padding: var(--padding);
      }
    }
  }
  .ItemDevice-notFound {
    display: flex;
    flex-direction: row;
    align-items: center;
    .ItemDevice-notFound-title {
      flex-grow: 1;
    }
  }
}
</style>
