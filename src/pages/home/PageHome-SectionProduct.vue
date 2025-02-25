<script>
import chroma from 'chroma-js';
import { mapStores } from 'pinia';

import { isColorDark } from '@/U';
import IconArrowDownDark from '@/assets/icon/arrowDown-000000.svg';
import IconArrowDownLight from '@/assets/icon/arrowDown-FFFFFF.svg';
import { CategoryKey } from '@/entity/model/Category';
import { useAppStore } from '@/stores/app.store';
import { useCategoryStore } from '@/stores/category.store';
import { useProductStore } from '@/stores/product.store';

import ImageView from '@/components/ImageView.vue';

export default {
  components: { ImageView },
  props: { isThin: { type: Boolean, default: false } },
  data: (c) => ({
    groupMenus: [],

    maxLength: 8,
    products: [],
    productIndex: 0,

    itemTitle: '',
    primaryColor: chroma('cccccc'),

    timeClicked: 0,
    timeout: 8000,
    isDestroyed: false,
  }),
  computed: {
    ...mapStores(useCategoryStore, useAppStore),

    item() {
      if (this.productIndex < 0) this.productIndex = this.products.length - 1;
      if (this.productIndex >= this.products.length) this.productIndex = 0;
      return this.products[this.productIndex];
    },
    itemImage: (c) => c.item?.toImageThumbnail() ?? null,
    itemImageUrl: (c) => c.itemImage?.toUrl({ width: 350 }) ?? '',
    itemId: (c) => c.item?.id ?? '',

    color: (c) =>
      chroma.valid(c.primaryColor) ? c.primaryColor : chroma('cccccc'),
    color1: (c) => c.getColorMixed(c.color, 0.2),
    color2: (c) => c.getColorMixed(c.color, 0.3),
    color3: (c) => c.getColorMixed(c.color, 0.9),

    arrowIcon: (c) => {
      return isColorDark(c.color) ? IconArrowDownLight : IconArrowDownDark;
    },
  },
  watch: {
    'categoryStore.lastModified'() {
      this.invalidate();
    },
    item() {
      this.invalidateProduct();
    },
  },
  mounted() {
    this.invalidate();
    this.invalidateProduct();
    this.shuffle();
  },
  destroyed() {
    this.isDestroyed = true;
  },
  methods: {
    shuffle() {
      if (this.isDestroyed) return;
      if (this.timeClicked > 0) {
        const now = Date.now();
        const distance = now - this.timeClicked;
        if (distance < this.timeout)
          return setTimeout(this.shuffle, this.timeout - distance);
      }

      this.clickNext();
      setTimeout(this.shuffle, this.timeout);
    },

    async invalidate() {
      this.products = [];
      const groups = await useProductStore().getGroupsByCategory();
      if (!groups.length) return;

      this.itemTitle = '';
      const products = groups
        .filter((group) => {
          return (
            group.category.key === CategoryKey.Notebook ||
            group.category.key === CategoryKey.Desktop ||
            group.category.key === CategoryKey.Printer
          );
        })
        .sort((group1, group2) => group1.category.compare(group2.category))
        .reduce((products, group) => {
          products.push(...group.items);
          return products;
        }, [])
        .filter((product) => {
          return product.toImageThumbnail() && product.isStockAvailable();
        });

      while (products.length > this.maxLength) {
        const delta = Math.random() * products.length;
        const index = Math.floor(delta);
        products.splice(index, 1);
      }

      this.products = products;
    },
    async invalidateProduct() {
      if (!this.item) {
        this.itemTitle = '';
        this.primaryColor = null;
        return;
      }

      this.itemTitle = await this.item.fetchFullTitle();
      this.primaryColor = chroma('cccccc');
    },

    getColorMixed(color, value) {
      return color.mix(isColorDark(this.color) ? '#ffffff' : '#000000', value);
    },

    clickNext() {
      this.productIndex++;
      this.timeClicked = Date.now();
    },
    clickPrevious() {
      this.productIndex--;
      this.timeClicked = Date.now();
    },
  },
};
</script>

<template>
  <div
    :class="[
      'HomeSectionProduct',
      `HomeSectionProduct-${isThin ? 'isThin' : 'isWide'}`,
      'transition',
    ]"
    :style="{ '--color0': color, '--color3': getColorMixed(color, 0.9) }"
  >
    <div class="HomeSectionProduct-card">
      <ImageView
        class="HomeSectionProduct-img"
        v-if="itemImage"
        :src="itemImage"
        @click="() => appStore.imageViewerShow({ image: itemImage })"
      />

      <div class="HomeSectionProduct-content">
        <div class="HomeSectionProduct-content-left">
          <span
            class="HomeSectionProduct-title"
            :style="{ 'grid-area': 'title' }"
          >
            {{ itemTitle }}
          </span>
          <div
            class="HomeSectionProduct-footer"
            :style="{ 'grid-area': 'footer' }"
            v-if="products.length > 1"
          >
            <button
              :class="[
                'transition',
                'HomeSectionProduct-footer-item',
                `HomeSectionProduct-footer-item-${
                  index === productIndex ? 'isSelected' : 'isDeselected'
                }`,
              ]"
              v-for="(product, index) in products"
              :key="product.id"
              @click="() => (productIndex = index)"
            />
          </div>
        </div>

        <div class="HomeSectionProduct-content-right">
          <router-link
            class="HomeSectionProduct-view"
            :style="{ 'grid-area': 'view' }"
            :to="{ path: '/product', query: { productId: itemId } }"
          >
            Detail
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.HomeSectionProduct {
  width: 100%;
  max-width: 30em;
  height: 100%;
  text-decoration: none;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.7rem;

  .HomeSectionProduct-card {
    --image-height: 16rem;
    --image-inset-height: 8rem;
    --content-height: 6rem;
    --card-height: calc(var(--image-inset-height) + var(--content-height));

    width: 100%;
    height: var(--card-height);
    min-height: var(--card-height);
    max-height: var(--card-height);

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;

    position: relative;
    color: black;

    margin-top: calc(var(--card-height) / 2);
    background: white;
    border-radius: 1.5em;

    box-shadow: 0 0 2em hsla(0, 0%, 0%, 0.2);

    .HomeSectionProduct-img {
      --height: var(--image-height);

      height: var(--height);
      min-height: var(--height);
      max-height: var(--height);

      width: 100%;
      object-fit: contain;
      flex-grow: 1;
      cursor: pointer;

      filter: drop-shadow(0 0 1rem hsla(0, 0%, 0%, 0.2));

      position: absolute;
      bottom: calc(var(--content-height) * 0.9);
    }
    .HomeSectionProduct-content {
      width: 100%;
      height: var(--content-height);
      min-height: var(--content-height);
      max-height: var(--content-height);

      overflow: hidden;

      padding: 1.5rem;
      padding-top: 0;

      display: flex;
      flex-direction: row;
      align-items: flex-end;
      justify-content: space-between;

      .HomeSectionProduct-content-left {
        width: 100%;
        gap: 0.5rem;
        flex-grow: 1;

        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-end;

        .HomeSectionProduct-title {
          font-size: 1.5em;
          font-weight: 600;
          text-align: start;
          line-height: 1em;

          display: flex;
          flex-grow: 0;
          flex-direction: column;
          justify-content: flex-start;
          align-items: flex-start;
        }
        .HomeSectionProduct-footer {
          gap: 0.3em;
          display: flex;
          flex-grow: 0;
          flex-direction: row;
          align-items: flex-start;
          justify-content: center;

          .HomeSectionProduct-footer-item {
            --width: 1em;
            --height: 1em;
            width: var(--width);
            min-width: var(--width);
            max-width: var(--width);
            height: var(--height);
            min-height: var(--height);
            max-height: var(--height);

            border-radius: var(--width);
            border: none;
            transition-timing-function: cubic-bezier(0.075, 0.82, 0.165, 1);
          }
          .HomeSectionProduct-footer-item-isSelected {
            --width: 1.8em;
            background: var(--color3);
            background: black;
          }
          .HomeSectionProduct-footer-item-isDeselected {
            background: var(--color3);
            background: black;
            cursor: pointer;
          }
        }
      }
      .HomeSectionProduct-content-right {
        display: grid;
        place-items: center;
        .HomeSectionProduct-view {
          min-width: 6.5rem;
          padding: 0.8rem;
          border-radius: 5rem;
          background: var(--primary-color);
          border: none;
          color: white;
          cursor: pointer;
          text-align: center;
          text-decoration: none;
        }
      }
    }
  }
}
</style>
