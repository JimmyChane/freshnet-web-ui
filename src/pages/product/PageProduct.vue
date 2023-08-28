<script>
  import Navigation from "@/tools/Navigation";

  import Footer from "@/app/footer/Footer.vue";

  import PanelProducts from "./PanelProducts.vue";
  import PanelProduct from "./PanelProduct.vue";
  import WindowSearch from "./WindowSearch.vue";
  import WindowAddProduct from "./WindowAddProduct.vue";
  import WindowRemoveProduct from "./WindowRemoveProduct.vue";
  import WindowRemoveImage from "./WindowRemoveImage.vue";
  import WindowUpdateTitleBrand from "./WindowUpdateTitleBrand.vue";
  import WindowUpdatePrice from "./WindowUpdatePrice.vue";
  import WindowUpdateDescription from "./WindowUpdateDescription.vue";
  import WindowUpdateCategory from "./WindowUpdateCategory.vue";
  import WindowUpdateSpecifications from "./WindowUpdateSpecifications.vue";

  import PanelRight from "@/components/panel/PanelRight.vue";
  import Server from "@/host/Server";
  import IconPack from "@/app/IconPack";

  export default {
    key: "product",
    title: "Search",
    icon: new IconPack(
      Server.resource.icon("magnifying-glass"),
      Server.resource.icon("magnifying-glass"),
    ),

    components: {
      Footer,
      PanelRight,
      PanelProducts,
      PanelProduct,
      WindowSearch,
    },
    data: (c) => ({
      stylePanelProducts: {},
      stylePanelEmpty: {},
      panelListened: { isShowing: false, isWide: false },

      groups: [],

      product: null,
      drawerProduct: null,
      productBrand: null,
      scrollTop: 0,
    }),
    computed: {
      isEditable: (c) => {
        const { user } = c.loginStore.getters;
        return user.isTypeAdmin() || user.isTypeStaff();
      },
      isLoading: (c) => c.productStore.getters.isLoading,

      paths: (c) => {
        return c.$store.getters.paths;
      },
      lastPath: (c) => {
        let { paths } = c;
        if (!paths.length) {
          return "";
        }
        return paths[paths.length - 1];
      },

      products: (c) => {
        return c.groups
          .reduce((products, group) => {
            products.push(...group.products);
            return products;
          }, [])
          .filter((product) => {
            if (!c.isEditable) {
              return product.isStockAvailable();
            }
            return true;
          });
      },

      productId: (c) => c.$route.query.productId,

      productPrevious: (c) => {
        const { products } = c;
        const categoryProducts = products.filter((product) => {
          if (!c.product) {
            return true;
          }
          return product.category === c.product.category;
        });

        let productIndex = categoryProducts.indexOf(c.product);
        let productPreviousIndex = productIndex - 1;
        if (
          0 <= productPreviousIndex &&
          productPreviousIndex <= categoryProducts.length - 1
        ) {
          return categoryProducts[productPreviousIndex];
        }

        return null;
      },
      productNext: (c) => {
        const products = c.products;
        const categoryProducts = products.filter((product) => {
          if (!c.product) {
            return true;
          }
          return product.category === c.product.category;
        });

        let productIndex = categoryProducts.indexOf(c.product);
        let productNextIndex = productIndex + 1;
        if (
          0 <= productNextIndex &&
          productNextIndex <= categoryProducts.length - 1
        ) {
          return categoryProducts[productNextIndex];
        }

        return null;
      },
    },
    watch: {
      product() {
        this.onProduct();
      },
      productId() {
        this.onProductId();
      },
      "productStore.getters.lastModified"() {
        this.invalidate();
      },
      "categoryStore.getters.lastModified"() {
        this.invalidate();
      },
    },
    mounted() {
      this.invalidate();
      this.onProduct();
      this.onProductId();
      this.$store.getters.navigation.setLayout(Navigation.Layout.THIN);
    },
    methods: {
      async invalidate() {
        this.groups = [];

        let groups = await this.productStore.dispatch("getGroupsByCategory");

        const categories = await this.categoryStore.dispatch("getItems");
        categories.forEach((category) => {
          const group = groups.find((group) => {
            return group.category.id === category.id;
          });
          if (!group) {
            groups.push({ category, items: [] });
          }
        });

        this.groups = groups
          .map((group) => {
            const products = !this.isEditable
              ? group.items.filter((product) => {
                  return product.isStockAvailable();
                })
              : group.items;
            products.sort((product1, product2) => {
              return product1.compare(product2);
            });
            return { category: group.category, products };
          })
          .filter((group) => {
            return group.products.length > 0;
          })
          .sort((group1, group2) => {
            return group1.category.compare(group2.category);
          });
      },

      invalidateStyle() {
        if (this.panelListened.isWide || !this.panelListened.isShowing) {
          this.stylePanelProducts = {};
        } else {
          this.delayOnPanelListened((isSamePreviously) => {
            if (isSamePreviously) {
              this.stylePanelProducts = { display: "none" };
            }
          });
        }

        if (!this.panelListened.isWide || !this.panelListened.isShowing) {
          this.stylePanelEmpty = {};
        } else {
          this.delayOnPanelListened((isSamePreviously) => {
            if (isSamePreviously) {
              this.stylePanelEmpty = { display: "none" };
            }
          });
        }
      },

      delayOnPanelListened(callback = (isSamePreviously) => {}, delay = 700) {
        const isPreviousWide = this.panelListened.isWide;
        const isPreviousShowing = this.panelListened.isShowing;

        setTimeout(() => {
          const isSamePreviously =
            this.panelListened.isWide === isPreviousWide &&
            this.panelListened.isShowing === isPreviousShowing;

          callback(isSamePreviously);
        }, delay);
      },

      invalidatePanelShowing(isShowing) {
        this.panelListened.isShowing = isShowing;
        this.invalidateStyle();
      },
      invalidatePanelWide(isWide) {
        this.panelListened.isWide = isWide;
        this.invalidateStyle();
      },

      async onProduct() {
        this.productBrand = null;
        if (this.product) {
          this.productBrand = await this.product.fetchBrand();
        }

        if (!this.product) {
          setTimeout(() => (this.drawerProduct = this.product), 700);
        } else {
          this.drawerProduct = this.product;
        }
      },
      async onProductId() {
        this.product = null;
        if (this.productId) {
          const products = await this.productStore.dispatch("getItems");
          this.product = products.find((product) => {
            return product.id === this.productId;
          });
        }
      },

      setProduct(product) {
        this.setProductId(product?.id ?? null);
      },
      setProductId(productId) {
        this.$store.getters.nextQuery({
          query: { productId: productId ?? null },
        });
      },

      async clickSearch() {
        const popupWindow = await this.$store.dispatch("openPopupWindow", {
          component: WindowSearch,
          items: this.products,
        });
      },

      async clickAddProduct() {
        const popupWindow = await this.$store.dispatch("openPopupWindow", {
          component: WindowAddProduct,
          onConfirm: (output) => {
            this.productStore
              .dispatch("addItem", { data: output })
              .then((product) => {
                popupWindow.close();
                this.setProduct(product);
              })
              .catch((error) => {
                this.$store.dispatch("snackbarShow", "Product Creation Failed");
              });
          },
        });
      },

      async clickRemoveProduct(input) {
        const popupWindow = await this.$store.dispatch("openPopupWindow", {
          component: WindowRemoveProduct,
          input,
          onConfirm: (input) => {
            this.productStore
              .dispatch("removeItemOfId", { id: input.productId })
              .then(() => {
                popupWindow.close();
                this.setProduct(null);
              })
              .catch((error) => {
                this.$store.dispatch("snackbarShow", "Product Deletion Failed");
              });
          },
        });
      },
      async clickRemoveProductImage(input) {
        const popupWindow = await this.$store.dispatch("openPopupWindow", {
          component: WindowRemoveImage,
          input,
          onConfirm: (input) => {
            const { product, image } = input;
            this.productStore
              .dispatch("removeImageOfId", {
                id: product.id,
                image,
              })
              .then(() => popupWindow.close())
              .catch(() => {});
          },
        });
      },

      async clickUpdateProductTitleBrand(input) {
        const popupWindow = await this.$store.dispatch("openPopupWindow", {
          component: WindowUpdateTitleBrand,
          input,
          onConfirm: (input) => {
            const { product, title, brandId } = input;

            const promiseTitle = this.productStore.dispatch("updateTitleOfId", {
              id: product.id,
              title,
            });
            const promiseBrand = this.productStore.dispatch(
              "updateBrandIdOfId",
              { id: product.id, brandId },
            );
            Promise.all([promiseTitle, promiseBrand])
              .then(() => popupWindow.close())
              .catch((error) => {
                this.$store.dispatch("snackbarShow", "Some Cannot Update");
              });
          },
        });
      },
      async clickUpdateProductPrice(input) {
        const popupWindow = await this.$store.dispatch("openPopupWindow", {
          component: WindowUpdatePrice,
          input,
          onConfirm: (input) => {
            const { product, price } = input;
            this.productStore
              .dispatch("updatePriceOfId", { id: product.id, price })
              .then((product) => popupWindow.close())
              .catch((error) => {
                this.$store.dispatch("snackbarShow", "Cannot Update");
              });
          },
        });
      },
      async clickUpdateProductDescription(input) {
        const popupWindow = await this.$store.dispatch("openPopupWindow", {
          component: WindowUpdateDescription,
          input,
          onConfirm: (input) => {
            const { product, description } = input;
            this.productStore
              .dispatch("updateDescriptionOfId", {
                id: product.id,
                description,
              })
              .then((product) => popupWindow.close())
              .catch((error) => {
                this.$store.dispatch("snackbarShow", "Cannot Update");
              });
          },
        });
      },
      async clickUpdateProductCategory(input) {
        const popupWindow = await this.$store.dispatch("openPopupWindow", {
          component: WindowUpdateCategory,
          input,
          onConfirm: (input) => {
            const { product, categoryId } = input;
            this.productStore
              .dispatch("updateCategoryIdOfId", {
                id: product.id,
                categoryId,
              })
              .then((product) => popupWindow.close())
              .catch((error) => {
                this.$store.dispatch("snackbarShow", "Cannot Update");
              });
          },
        });
      },
      async clickUpdateProductSpecifications(input) {
        const popupWindow = await this.$store.dispatch("openPopupWindow", {
          component: WindowUpdateSpecifications,
          input,
          onConfirm: (input) => {
            const { product, specifications } = input;
            this.productStore
              .dispatch("updateSpecificationsOfId", {
                id: product.id,
                specifications: specifications.map((specification) => {
                  return {
                    type: specification.typeKey,
                    content: specification.content,
                  };
                }),
              })
              .then((product) => popupWindow.close())
              .catch((error) => {
                this.$store.dispatch("snackbarShow", "Cannot Update");
              });
          },
        });
      },
    },
  };
</script>

<template>
  <div class="PageProduct" :isPanelWide="`${panelListened.isWide}`">
    <PanelProducts
      class="PageProduct-products"
      :style="stylePanelProducts"
      :products="products"
      @click-productAdd="() => clickAddProduct()"
      @click-search="() => clickSearch()"
    />

    <PanelRight
      class="PageProduct-PanelRight"
      titleEmpty="Select product to view"
      :isShowing="!!product"
      @click-collapse="() => setProduct(null)"
      @on-isShowing="(isShowing) => invalidatePanelShowing(isShowing)"
      @on-isWide="(isWide) => invalidatePanelWide(isWide)"
    >
      <PanelProduct
        class="PageProduct-PanelProduct"
        :product="drawerProduct"
        :productPrevious="productPrevious"
        :productNext="productNext"
        :isWide="false"
        :isEditable="isEditable"
        @click-dismiss="() => setProduct(null)"
        @click-productRemove="(output) => clickRemoveProduct(output)"
        @click-product-imageRemove="(output) => clickRemoveProductImage(output)"
        @click-product-titleBrandUpdate="
          (output) => clickUpdateProductTitleBrand(output)
        "
        @click-product-priceUpdate="(output) => clickUpdateProductPrice(output)"
        @click-product-descriptionUpdate="
          (output) => clickUpdateProductDescription(output)
        "
        @click-product-categoryUpdate="
          (output) => clickUpdateProductCategory(output)
        "
        @click-product-specificationsUpdate="
          (output) => clickUpdateProductSpecifications(output)
        "
      />
    </PanelRight>
  </div>
</template>

<style lang="scss" scoped>
  .PageProduct {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    overflow: hidden;
    position: relative;

    .PageProduct-products {
      z-index: 1;
    }
    .PageProduct-PanelRight {
      z-index: 2;
    }
  }
  .PageProduct[isPanelWide="false"] {
    .PageProduct-products {
      max-width: 100%;
    }
  }
  .PageProduct[isPanelWide="true"] {
    .PageProduct-products {
      width: 100dvw;
      max-width: 60%;
      min-width: 60%;
    }
  }
</style>
