<script>
  const Mode = { List: 1, Grid: 2 };

  import Setting from "@/items/Setting";
  import ProductPrice from "@/items/ProductPrice";
  import ProductPreset from "@/objects/ProductPreset";

  import ImageView from "@/components/ImageView.vue";
  import Label from "./ItemProduct-Label.vue";
  import chroma from "chroma-js";
  import U from "@/U";
  import Product from "@/items/Product";

  export default {
    Mode,

    emits: ["click"],
    components: { ImageView, Label },
    data: (c) => ({ primaryColorHex: "", fullTitle: "" }),
    props: {
      mode: { type: Number, default: Mode.Grid },
      item: { type: Product, default: () => null },
      isSelected: { type: Boolean, default: false },
    },
    computed: {
      isList: (c) => c.mode === Mode.List,
      isGrid: (c) => c.mode === Mode.Grid,

      primaryColor: (c) => {
        return chroma.valid(c.primaryColorHex)
          ? chroma(c.primaryColorHex)
          : chroma("cccccc");
      },
      isPrimaryColorDark: (c) => U.isColorDark(c.primaryColor),

      user: (c) => c.loginStore.getters.user,
      allowEdit: (c) => c.user.isTypeAdmin() || c.user.isTypeStaff(),

      shouldShowPrice: (c) => {
        let setting = c.settingStore.getters.items.find((setting) => {
          return setting.key === Setting.Key.PublicShowPrice;
        });
        return setting?.value ?? false;
      },

      preview: (c) => c.item?.toImageThumbnail() ?? null,
      productBrandId: (c) => c.item?.brandId ?? "",
      isAvailable: (c) => c.item?.isStockAvailable() ?? false,

      productPrice: (c) => {
        if (!c.allowEdit && !c.shouldShowPrice) return null;
        return c.item.price;
      },
      productPriceNormal: (c) => {
        return c.productPrice?.normal ?? new ProductPrice().fromData({});
      },
      productPricePromotion: (c) => {
        return c.productPrice?.promotion ?? new ProductPrice().fromData({});
      },
      price: (c) => {
        if (!c.allowEdit && !c.shouldShowPrice) return null;

        let normal = c.productPriceNormal;
        let promotion = c.productPricePromotion;

        if (normal.value > 0 && promotion.value <= 0) return { to: normal };
        if (normal.value > 0 && promotion.value > 0)
          return { from: normal, to: promotion };
        if (normal.value <= 0 && promotion.value > 0)
          return { from: normal, to: promotion };
        return null;
      },
      specLabels: (c) => ProductPreset.generateSpecificationLabels(c.item),
      labels: (c) => {
        return ProductPreset.generateStockLabels(c.item).map((label) => {
          return { title: label.text, primaryColor: chroma(label.color) };
        });
      },
    },
    watch: {
      preview() {
        this.invalidatePreview();
      },
      item() {
        this.invalidateFullTitle();
      },
      productBrandId() {
        this.invalidateFullTitle();
      },
    },
    async mounted() {
      this.settingStore.dispatch("getItems");
      this.invalidateFullTitle();
      this.invalidatePreview();
    },
    methods: {
      async invalidateFullTitle() {
        try {
          this.fullTitle = "";
          if (!this.item) return;
          this.fullTitle = await this.item.fetchFullTitle();
        } catch (error) {
          console.error(error);
          this.fullTitle = "";
        }

        this.fullTitle = "";
        if (this.item) {
          this.fullTitle =
            (await this.item.fetchFullTitle()?.catch(() => null)) ?? "";
        }
      },
      async invalidatePreview() {
        this.primaryColorHex = "inherit";
      },
    },
  };
</script>

<template>
  <div
    :class="[
      'ItemProduct',
      isList ? 'ItemProduct-modeList' : '',
      isGrid ? 'ItemProduct-modeGrid' : '',
      'transition',
    ]"
    :style="{
      '--available-opacity': isAvailable ? '1' : '0.1',
      '--primary-color': primaryColor,
    }"
    :ref="item.id"
    :isSelected="`${isSelected}`"
    @click="$emit('click', item)"
  >
    <div class="ItemProduct-preview transition">
      <ImageView
        class="ItemProduct-preview-image"
        v-if="preview"
        :src="preview"
      />
      <span :class="['ItemProduct-preview-empty', 'transition']" v-else
        >No Preview</span
      >

      <div class="ItemProduct-preview-labels" v-if="labels.length">
        <Label
          v-for="label of labels"
          :key="label.title"
          :title="label.title"
          :primaryColor="label.primaryColor"
        />
      </div>
    </div>

    <div
      :class="[
        'ItemProduct-title',
        !isPrimaryColorDark
          ? 'ItemProduct-title-isDark'
          : 'ItemProduct-title-isWhite',
      ]"
    >
      <div class="ItemProduct-title-specs" v-if="specLabels.length">
        <Label
          v-for="label in specLabels"
          :key="label.text"
          :title="label.text"
        />
      </div>
      <span class="ItemProduct-title-text">{{ fullTitle }}</span>
      <span class="ItemProduct-title-price" v-if="price">{{ price.to }}</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .ItemProduct {
    --available-opacity: 1;

    width: 100%;
    text-decoration: none;
    border: none;

    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    justify-content: flex-start;
    border-radius: var(--border-radius);
    --transition-timing: cubic-bezier(1, 0, 0, 1);

    .ItemProduct-preview {
      flex-grow: 0;
      object-fit: cover;
      aspect-ratio: 16/12;

      --preview-border-radius: var(--border-radius);
      --preview-border-radius-focus: var(--border-radius);
      --transition-timing: cubic-bezier(1, 0, 0, 1);

      position: relative;

      .ItemProduct-preview-image {
        object-fit: contain;
      }
      .ItemProduct-preview-empty {
        font-size: 0.8rem;
        font-weight: 600;
        color: hsla(0, 0%, 0%, 0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .ItemProduct-preview-image {
        width: 100%;
        height: 100%;
        aspect-ratio: inherit;
        border-radius: var(--preview-border-radius);
        background: white;
      }
      .ItemProduct-preview-empty {
        width: 100%;
        height: 100%;
        aspect-ratio: inherit;
        border-radius: var(--preview-border-radius);
        background: white;
      }

      .ItemProduct-preview-labels {
        position: absolute;
        bottom: 0;
        right: 0;

        width: 100%;
        max-height: 2.3rem;
        gap: 3px;
        padding: 0.5rem;

        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;

        overflow: hidden;
      }
    }

    .ItemProduct-title {
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      justify-content: flex-start;
      text-align: start;

      gap: 0.5rem;
      color: black;

      .ItemProduct-title-specs {
        width: 100%;
        gap: 2px;

        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: flex-start;
        align-items: flex-end;

        overflow: hidden;
      }
      .ItemProduct-title-text {
        min-height: 1em;
        max-height: 2em;

        font-size: 1rem;
        font-weight: 600;
        overflow: hidden;

        display: flex;
        flex-direction: column;
        align-items: flex-start;
      }
      .ItemProduct-title-price {
        font-size: 0.7rem;
      }
    }
    .ItemProduct-title-isDark {
      --color-theme: black;
    }
    .ItemProduct-title-isWhite {
      --color-theme: white;
    }
  }

  .ItemProduct-modeList {
    --border-radius: 0.8rem;
    --height: 6rem;

    min-height: var(--height);
    max-height: var(--height);

    flex-direction: row;
    align-items: center;
    justify-content: flex-start;

    .ItemProduct-preview {
      height: var(--height);
      min-height: var(--height);
      max-height: var(--height);
      transform: scale(0.92);
      --preview-border-radius-focus: var(--border-radius) 0 0
        var(--border-radius);
    }
    .ItemProduct-title {
      height: 100%;
      flex-grow: 1;
      padding: 0.3rem 0.3rem;
      .ItemProduct-title-specs {
        max-height: 1.2em;
      }
    }
  }
  .ItemProduct-modeGrid {
    --border-radius: 0.8rem;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 0.25rem;

    .ItemProduct-preview {
      width: 100%;
      transform: scale(0.92) translateY(1rem);
      --preview-border-radius-focus: var(--border-radius) var(--border-radius) 0
        0;
    }
    .ItemProduct-title {
      width: 100%;
      padding: 1rem 0.5rem;
      .ItemProduct-title-specs {
        max-height: 2.4em;
        margin-top: -0.4em;
      }
    }
  }

  .ItemProduct[isSelected="false"] {
    cursor: pointer;

    &:hover,
    &:focus,
    &:focus-within {
      background: hsla(0, 0%, 0%, 0.1);
    }
  }
  .ItemProduct[isSelected="true"] {
    background: hsla(0, 0%, 0%, 0.2);
  }
</style>
