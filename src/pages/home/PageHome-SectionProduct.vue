<script>
  import Category from "@/items/Category";
  import ImageView from "@/components/ImageView.vue";
  import chroma from "chroma-js";
  import U from "@/U";

  export default {
    components: { ImageView },
    props: { isThin: { type: Boolean, default: false } },
    data: (c) => ({
      groupMenus: [],

      maxLength: 8,
      products: [],
      productIndex: 0,

      itemTitle: "",
      primaryColor: chroma("cccccc"),

      timeClicked: 0,
      timeout: 8000,
      isDestroyed: false,
    }),
    computed: {
      "categoryStore.getters.lastModified"() {
        this.invalidate();
      },
      item() {
        if (this.productIndex < 0) this.productIndex = this.products.length - 1;
        if (this.productIndex >= this.products.length) this.productIndex = 0;
        return this.products[this.productIndex];
      },
      itemImage: (c) => c.item?.toImageThumbnail() ?? null,
      itemImageUrl: (c) => c.itemImage?.toUrl({ width: 350 }) ?? "",
      itemId: (c) => c.item?.id ?? "",

      color: (c) =>
        chroma.valid(c.primaryColor) ? c.primaryColor : chroma("cccccc"),
      color1: (c) => c.getColorMixed(c.color, 0.2),
      color2: (c) => c.getColorMixed(c.color, 0.3),
      color3: (c) => c.getColorMixed(c.color, 0.9),

      arrowIcon: (c) => {
        return U.isColorDark(c.color)
          ? c.host.icon("arrowDown-ffffff").toUrl()
          : c.host.icon("arrowDown-000000").toUrl();
      },
    },
    watch: {
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
        const groups = await this.productStore.dispatch("getGroupsByCategory");
        if (!groups.length) return;

        this.itemTitle = "";
        const products = groups
          .filter((group) => {
            return (
              group.category.key === Category.Key.Notebook ||
              group.category.key === Category.Key.Desktop ||
              group.category.key === Category.Key.Printer
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
          this.itemTitle = "";
          this.primaryColor = null;
          return;
        }

        this.itemTitle = await this.item.fetchFullTitle();
        this.primaryColor = this.itemImage
          ? await this.itemImage.fetchColor().catch(() => chroma("cccccc"))
          : chroma("cccccc");
      },

      getColorMixed(color, value) {
        return color.mix(
          U.isColorDark(this.color) ? "#ffffff" : "#000000",
          value,
        );
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
    <div class="HomeSectionProduct-body">
      <ImageView
        class="HomeSectionProduct-img"
        v-if="itemImage"
        :src="itemImage"
        @click="
          () =>
            $router.push({
              path: '/product',
              query: { productId: itemId },
            })
        "
      />

      <span class="HomeSectionProduct-title">{{ itemTitle }}</span>

      <button
        class="HomeSectionProduct-arrow HomeSectionProduct-arrow-left transition"
        @click="() => clickPrevious()"
      >
        <img :src="arrowIcon" />
      </button>
      <button
        class="HomeSectionProduct-arrow HomeSectionProduct-arrow-right transition"
        @click="() => clickNext()"
      >
        <img :src="arrowIcon" />
      </button>
    </div>

    <div class="HomeSectionProduct-footer" v-if="products.length > 1">
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
</template>

<style lang="scss" scoped>
  .HomeSectionProduct {
    text-decoration: none;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.7rem;

    --header-height: 2.2em;
    --footer-height: 3em;

    .HomeSectionProduct-body {
      width: 100%;
      height: 30rem;
      min-height: 30rem;
      max-height: 30rem;

      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      position: relative;
      background: var(--color0);
      color: var(--color3);
      border-radius: 1.5em;
      overflow: hidden;

      .HomeSectionProduct-img {
        --height: calc(100% - var(--header-height) - var(--footer-height));
        height: var(--height);
        min-height: var(--height);
        max-height: var(--height);
        overflow: hidden;

        width: 100%;
        object-fit: contain;
        flex-grow: 1;
        padding: 1em;
        padding: 3em;
        cursor: pointer;

        border-radius: 1rem;
        filter: drop-shadow(0 0 1rem hsla(0, 0%, 0%, 0.2));
      }

      .HomeSectionProduct-title {
        width: 100%;
        height: var(--header-height);
        min-height: var(--header-height);
        max-height: var(--header-height);

        font-size: 1.5em;
        font-weight: 600;
        text-align: center;
        line-height: 1em;

        display: flex;
        flex-grow: 0;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
      }

      .HomeSectionProduct-arrow {
        --size: 3.5em;
        --padding: 0.8em;
        position: absolute;
        display: flex;
        align-items: center;
        justify-content: center;

        padding: var(--padding);
        border-radius: 50%;
        cursor: pointer;
        background: none;
        border: none;

        width: var(--size);
        height: var(--size);
        min-width: var(--size);
        min-height: var(--size);
        max-width: var(--size);
        max-height: var(--size);

        & > * {
          width: calc(var(--size) - calc(var(--padding) * 2));
          height: calc(var(--size) - calc(var(--padding) * 2));
        }

        &:hover {
          background: hsla(0, 0%, 0%, 0.05);
        }
        &:focus {
          transform: scale(0.9);
        }
      }
      .HomeSectionProduct-arrow-left {
        top: calc(50% - calc(var(--size) / 2));
        left: 1em;
        & > * {
          transform: rotate(90deg) translateY(5%);
        }
      }
      .HomeSectionProduct-arrow-right {
        top: calc(50% - calc(var(--size) / 2));
        right: 1em;
        & > * {
          transform: rotate(270deg) translateY(5%);
        }
      }
    }
    .HomeSectionProduct-footer {
      width: 100%;
      height: var(--footer-height);
      min-height: var(--footer-height);
      max-height: var(--footer-height);

      display: flex;
      flex-grow: 0;
      flex-direction: row;
      align-items: flex-start;
      justify-content: center;

      .HomeSectionProduct-footer-item {
        width: var(--size);
        height: var(--size);
        min-width: var(--size);
        min-height: var(--size);
        max-width: var(--size);
        max-height: var(--size);

        border-radius: 50%;
        border: none;
      }
      .HomeSectionProduct-footer-item-isSelected {
        transform: scale(1.5);
        margin-left: calc(var(--size) * 0.33);
        margin-right: calc(var(--size) * 0.33);
        background: var(--color3);
        background: black;
      }
      .HomeSectionProduct-footer-item-isDeselected {
        background: var(--color3);
        background: black;
        cursor: pointer;
        &:hover {
          box-shadow: 0px 0px 0.5rem black;
        }
      }
    }
  }
  .HomeSectionProduct-isThin {
    width: 100%;
    height: 100%;
    font-size: 0.9rem;
    .HomeSectionProduct-footer {
      gap: 0.3em;
      .HomeSectionProduct-footer-item {
        --size: 14px;
      }
    }
  }
  .HomeSectionProduct-isWide {
    width: 100%;
    height: 100%;
    font-size: 1.2rem;
    .HomeSectionProduct-footer {
      gap: 0.5em;
      .HomeSectionProduct-footer-item {
        --size: 16px;
      }
    }
  }
</style>
