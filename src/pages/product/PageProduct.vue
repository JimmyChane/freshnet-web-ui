<script>
   import Navigation from "@/tools/Navigation.js";

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

   import HostIcon from "@/host/HostIcon";

   import PopupContext from "@/tools/PopupContext";

   export default {
      key: "product",
      title: "Products",
      icon: {
         light: new HostIcon("products-FFFFFF.svg"),
         dark: new HostIcon("products-000000.svg"),
      },

      components: {
         Footer,

         PanelRight,
         PanelProducts,
         PanelProduct,

         WindowSearch,
         WindowAddProduct,
         WindowRemoveProduct,
         WindowRemoveImage,
         WindowUpdateTitleBrand,
         WindowUpdatePrice,
         WindowUpdateDescription,
         WindowUpdateCategory,
         WindowUpdateSpecifications,
      },
      data: (c) => ({
         popup: {
            search: new PopupContext(c).onDismiss((accept, reject, input) => {
               const { windowSearch } = c.$refs;
               if (windowSearch) {
                  windowSearch.blur();
               }
               accept();
            }),
            productAdd: new PopupContext(c).onConfirm(
               (accept, reject, output) => {
                  c.productStore
                     .dispatch("addItem", { data: output })
                     .then((product) => {
                        accept();
                        c.setProduct(product);
                     })
                     .catch((error) =>
                        reject(error, "Product Creation Failed"),
                     );
               },
            ),
            productRemove: new PopupContext(c).onConfirm(
               (accept, reject, input) => {
                  c.productStore
                     .dispatch("removeItemOfId", { id: input.productId })
                     .then(() => {
                        accept();
                        c.setProduct(null);
                     })
                     .catch((error) =>
                        reject(error, "Product Deletion Failed"),
                     );
               },
            ),
            productImageRemove: new PopupContext(c).onConfirm(
               (accept, reject, input) => {
                  const { product, image } = input;
                  c.productStore
                     .dispatch("removeImageOfId", { id: product.id, image })
                     .then(() => accept())
                     .catch(() => reject());
               },
            ),
            productTitleBrandUpdate: new PopupContext(c).onConfirm(
               (accept, reject, input) => {
                  const { product, title, brandId } = input;
                  Promise.all([
                     c.productStore.dispatch("updateTitleOfId", {
                        id: product.id,
                        title,
                     }),
                     c.productStore.dispatch("updateBrandIdOfId", {
                        id: product.id,
                        brandId,
                     }),
                  ])
                     .then(() => accept())
                     .catch((error) => reject(error, "Some Cannot Update"));
               },
            ),
            productPriceUpdate: new PopupContext(c).onConfirm(
               (accept, reject, input) => {
                  const { product, price } = input;
                  c.productStore
                     .dispatch("updatePriceOfId", { id: product.id, price })
                     .then((product) => accept())
                     .catch((error) => reject(error, "Cannot Update"));
               },
            ),
            productDescriptionUpdate: new PopupContext(c).onConfirm(
               (accept, reject, input) => {
                  const { product, description } = input;
                  c.productStore
                     .dispatch("updateDescriptionOfId", {
                        id: product.id,
                        description,
                     })
                     .then((product) => accept())
                     .catch((error) => reject(error, "Cannot Update"));
               },
            ),
            productSpecificationsUpdate: new PopupContext(c).onConfirm(
               (accept, reject, input) => {
                  const { product, specifications } = input;
                  c.productStore
                     .dispatch("updateSpecificationsOfId", {
                        id: product.id,
                        specifications: specifications.map((specification) => {
                           return {
                              type: specification.typeKey,
                              content: specification.content,
                           };
                        }),
                     })
                     .then((product) => accept())
                     .catch((error) => reject(error, "Cannot Update"));
               },
            ),
            productCategoryUpdate: new PopupContext(c).onConfirm(
               (accept, reject, input) => {
                  const { product, categoryId } = input;
                  c.productStore
                     .dispatch("updateCategoryIdOfId", {
                        id: product.id,
                        categoryId,
                     })
                     .then((product) => accept())
                     .catch((error) => reject(error, "Cannot Update"));
               },
            ),
         },
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
            return c.$root.paths;
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
            // return null;
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
            // return null;
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

         popupWindow: (c) => {
            return {
               openAddProduct: () => {
                  c.popup.productAdd.isShowing = true;
               },
               openRemoveProduct: (product) => {
                  c.popup.productDelete.isShowing = true;
                  c.popup.productDelete.value = product;
               },
               openViewImage: (image) => {
                  c.popup.productImageView.value = image;
                  c.popup.productImageView.isShowing = true;
               },
               openRemoveImage: (image) => {
                  c.popup.productImageDelete.value = image;
                  c.popup.productImageDelete.isShowing = true;
               },
               openUpdateTitle: (title) => {
                  c.popup.productTitleEdit.value = title;
                  c.popup.productTitleEdit.isShowing = true;
               },
               openUpdateBrand: (brand) => {
                  c.popup.productBrandEdit.value = brand;
                  c.popup.productBrandEdit.isShowing = true;
               },
               openUpdateCategory: (category) => {
                  c.popup.productCategoryEdit.value = category;
                  c.popup.productCategoryEdit.isShowing = true;
               },
               openUpdateDescription: (description) => {
                  c.popup.productDescriptionEdit.value = description;
                  c.popup.productDescriptionEdit.isShowing = true;
               },
               openAddSpecification: () => {
                  c.popup.productSpecificationAdd.isShowing = true;
               },
               openRemoveSpecification: (specification) => {
                  c.popup.productSpecificationDelete.isShowing = true;
               },
               openUpdateSpecifications: (specifications) => {
                  c.popup.productSpecificationUpdate.value = specifications;
                  c.popup.productSpecificationUpdate.isShowing = true;
               },
               openAddBundle: () => {
                  c.popup.productBundleAdd.isShowing = true;
               },
               openRemoveBundle: (bundle) => {
                  c.popup.productBundleDelete.isShowing = true;
               },

               productDescriptionUpdate: new PopupContext(c).onConfirm(
                  (accept, reject, input) => {},
               ),

               openAddGift: () => {
                  c.popup.productGiftAdd.isShowing = true;
               },
               openRemoveGift: (gift) => {
                  c.popup.productGiftDelete.isShowing = true;
               },
               openAddPrice: () => {
                  c.popup.productPriceAdd.isShowing = true;
               },
               openRemovePrice: (price) => {
                  c.popup.productPriceDelete.isShowing = true;
               },
            };
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
      created() {
         Object.keys(this.popup).forEach((key) => {
            return (this.popup[key].context = this);
         });
      },
      mounted() {
         this.invalidate();
         this.onProduct();
         this.onProductId();
         this.$root.navigation.setLayout(Navigation.Layout.THIN);
      },
      methods: {
         async invalidate() {
            this.groups = [];

            let groups = await this.productStore.dispatch(
               "getGroupsByCategory",
            );

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

         delayOnPanelListened(
            callback = (isSamePreviously) => {},
            delay = 700,
         ) {
            setTimeout(() => {
               const isPreviousWide = this.panelListened.isWide;
               const isPreviousShowing = this.panelListened.isShowing;

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
            this.setProductId(product ? product.id : null);
         },
         setProductId(productId) {
            this.$root.nextQuery({
               query: { productId: productId ? productId : null },
            });
         },
      },
   };
</script>

<template>
   <div class="PageProduct">
      <div class="PageProduct-body" :isPanelWide="`${panelListened.isWide}`">
         <PanelProducts
            class="PageProduct-products"
            :style="stylePanelProducts"
            :products="products"
            @click-productAdd="() => popup.productAdd.show()"
            @click-search="() => popup.search.show()"
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
               @click-productRemove="
                  (output) => popup.productRemove.show(output)
               "
               @click-product-imageRemove="
                  (output) => popup.productImageRemove.show(output)
               "
               @click-product-titleBrandUpdate="
                  (output) => popup.productTitleBrandUpdate.show(output)
               "
               @click-product-priceUpdate="
                  (output) => popup.productPriceUpdate.show(output)
               "
               @click-product-descriptionUpdate="
                  (output) => popup.productDescriptionUpdate.show(output)
               "
               @click-product-categoryUpdate="
                  (output) => popup.productCategoryUpdate.show(output)
               "
               @click-product-specificationsUpdate="
                  (output) => popup.productSpecificationsUpdate.show(output)
               "
            />
         </PanelRight>
      </div>

      <!-- Popup Product Search -->
      <WindowSearch
         class="PageService-window"
         v-if="$root.window.innerWidth <= 550"
         ref="windowSearch"
         :isShowing="popup.search.isShowing"
         :items="products"
         @click-dismiss="() => popup.search.dismiss()"
         @click-item="(item) => clickProduct(item)"
      />
      <!-- Popup Product Add -->
      <WindowAddProduct
         v-if="isEditable"
         :isShowing="popup.productAdd.isShowing"
         :input="popup.productAdd.input"
         @click-dismiss="() => popup.productAdd.dismiss()"
         @click-cancel="() => popup.productAdd.cancel()"
         @click-confirm="(output) => popup.productAdd.confirm(output)"
      />
      <!-- Popup Product Remove -->
      <WindowRemoveProduct
         v-if="isEditable"
         :isShowing="popup.productRemove.isShowing"
         :input="popup.productRemove.input"
         @click-dismiss="() => popup.productRemove.dismiss()"
         @click-cancel="() => popup.productRemove.cancel()"
         @click-confirm="(output) => popup.productRemove.confirm(output)"
      />
      <!-- Popup Product Image Remove -->
      <WindowRemoveImage
         v-if="isEditable"
         :isShowing="popup.productImageRemove.isShowing"
         :input="popup.productImageRemove.input"
         @click-dismiss="() => popup.productImageRemove.dismiss()"
         @click-cancel="() => popup.productImageRemove.cancel()"
         @click-confirm="(output) => popup.productImageRemove.confirm(output)"
      />
      <!-- Popup Product Title & Brand Update -->
      <WindowUpdateTitleBrand
         v-if="isEditable"
         :isShowing="popup.productTitleBrandUpdate.isShowing"
         :input="popup.productTitleBrandUpdate.input"
         @click-dismiss="() => popup.productTitleBrandUpdate.dismiss()"
         @click-cancel="() => popup.productTitleBrandUpdate.cancel()"
         @click-confirm="
            (output) => popup.productTitleBrandUpdate.confirm(output)
         "
      />
      <!-- Popup Product Price Update -->
      <WindowUpdatePrice
         v-if="isEditable"
         :isShowing="popup.productPriceUpdate.isShowing"
         :input="popup.productPriceUpdate.input"
         @click-dismiss="() => popup.productPriceUpdate.dismiss()"
         @click-cancel="() => popup.productPriceUpdate.cancel()"
         @click-confirm="(output) => popup.productPriceUpdate.confirm(output)"
      />
      <!-- Popup Product Description Update -->
      <WindowUpdateDescription
         v-if="isEditable"
         :isShowing="popup.productDescriptionUpdate.isShowing"
         :input="popup.productDescriptionUpdate.input"
         @click-dismiss="() => popup.productDescriptionUpdate.dismiss()"
         @click-cancel="() => popup.productDescriptionUpdate.cancel()"
         @click-confirm="
            (output) => popup.productDescriptionUpdate.confirm(output)
         "
      />
      <!-- Popup Product Category Update -->
      <WindowUpdateCategory
         v-if="isEditable"
         :isShowing="popup.productCategoryUpdate.isShowing"
         :input="popup.productCategoryUpdate.input"
         @click-dismiss="() => popup.productCategoryUpdate.dismiss()"
         @click-cancel="() => popup.productCategoryUpdate.cancel()"
         @click-confirm="
            (output) => popup.productCategoryUpdate.confirm(output)
         "
      />
      <!-- Popup Product Description Update -->
      <WindowUpdateSpecifications
         v-if="isEditable"
         :isShowing="popup.productSpecificationsUpdate.isShowing"
         :input="popup.productSpecificationsUpdate.input"
         @click-dismiss="() => popup.productSpecificationsUpdate.dismiss()"
         @click-cancel="() => popup.productSpecificationsUpdate.cancel()"
         @click-confirm="
            (output) => popup.productSpecificationsUpdate.confirm(output)
         "
      />
   </div>
</template>

<style lang="scss" scoped>
   .PageProduct {
      width: 100dvw;
      height: 100%;
      max-width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      overflow: hidden;

      .PageProduct-body {
         width: 100dvw;
         max-width: 100%;
         height: 100%;
         display: flex;
         flex-direction: row;
         flex-wrap: nowrap;
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
      .PageProduct-body[isPanelWide="false"] {
         .PageProduct-products {
            max-width: 100%;
         }
      }
      .PageProduct-body[isPanelWide="true"] {
         .PageProduct-products {
            width: 100dvw;
            max-width: 60%;
            min-width: 60%;
         }
      }
   }
</style>
