<script>
	import Empty from "@/components/Empty.vue";
	import Drawer from "@/components/Drawer.vue";

	import Navigation from "@/tools/Navigation.js";

	import Footer from "@/app/Footer.vue";

	import PanelProducts from "./PanelProducts.vue";
	import PanelProduct from "./PanelProduct.vue";
	import WindowAddProduct from "./WindowAddProduct.vue";
	import WindowRemoveProduct from "./WindowRemoveProduct.vue";
	import WindowRemoveImage from "./WindowRemoveImage.vue";
	import WindowUpdateTitleBrand from "./WindowUpdateTitleBrand.vue";
	import WindowUpdatePrice from "./WindowUpdatePrice.vue";
	import WindowUpdateDescription from "./WindowUpdateDescription.vue";
	import WindowUpdateCategory from "./WindowUpdateCategory.vue";
	import WindowUpdateSpecifications from "./WindowUpdateSpecifications.vue";

	export default {
		key: "product",
		title: "Products",
		icon: { light: "products-FFFFFF", dark: "products-2A4858" },

		_queries_old() {
			return [
				{ key: "", title: "", values: [{ key: "", title: "All" }] },
				{
					key: "category",
					title: "Category",
					values: [
						{ key: "laptop", title: "Laptop" },
						{ key: "printer", title: "Printer" },
					],
				},
				{
					key: "brand",
					title: "Brand",
					values: [
						{ key: "hp", title: "HP" },
						{ key: "dell", title: "Dell" },
					],
				},
				{
					key: "size",
					title: "Size",
					values: [
						{ key: "14", title: '14"' },
						{ key: "15.6", title: '15.6"' },
					],
				},
				{
					key: "storage",
					title: "Storage",
					values: [
						{ key: "ssd512gb", title: "SSD 512GB" },
						{ key: "ssd256gb", title: "SSD 256GB" },
						{ key: "hdd1tb", title: "HDD 1TB" },
					],
				},
			];
		},

		components: {
			Empty,
			Footer,

			Drawer,
			PanelProducts,
			PanelProduct,

			WindowAddProduct,
			WindowRemoveProduct,
			WindowRemoveImage,
			WindowUpdateTitleBrand,
			WindowUpdatePrice,
			WindowUpdateDescription,
			WindowUpdateCategory,
			WindowUpdateSpecifications,
		},
		data() {
			return {
				scrollTop: 0,
				popup: {
					productAdd: {
						context: null,
						isShowing: false,
						input: null,

						show(input) {
							this.isShowing = true;
							this.input = input;
						},
						dismiss() {
							this.isShowing = false;
							this.input = null;
						},
						cancel() {
							this.isShowing = false;
							this.input = null;
						},
						confirm(output) {
							this.context.productStore
								.dispatch("addItem", { data: output })
								.then((product) => {
									this.dismiss();
									this.context.setProduct(product);
								})
								.catch((error) => {
									this.context.$root.feedback("Product Creation Failed");
									console.error(error);
								});
						},
					},
					productRemove: {
						context: null,
						isShowing: false,
						input: null,

						show(input) {
							this.isShowing = true;
							this.input = input;
						},
						dismiss() {
							this.isShowing = false;
							this.input = null;
						},
						cancel() {
							this.isShowing = false;
							this.input = null;
						},
						confirm(input) {
							this.context.productStore
								.dispatch("removeItemOfId", { id: input.productId })
								.then(() => {
									this.dismiss();
									this.context.setProduct(null);
								})
								.catch((error) => {
									this.context.$root.feedback("Product Deletion Failed");
									console.error(error);
								});
						},
					},
					productImageRemove: {
						context: null,
						isShowing: false,
						input: null,

						show(input) {
							this.isShowing = true;
							this.input = input;
						},
						dismiss() {
							this.isShowing = false;
							this.input = null;
						},
						cancel() {
							this.isShowing = false;
							this.input = null;
						},
						confirm(input) {
							let { product, image } = input;

							this.context.productStore
								.dispatch("removeImageOfId", { id: product.id, image })
								.then(() => this.dismiss());
						},
					},
					productTitleBrandUpdate: {
						context: null,
						isShowing: false,
						input: null,

						show(input) {
							this.isShowing = true;
							this.input = input;
						},
						dismiss() {
							this.isShowing = false;
							this.input = null;
						},
						cancel() {
							this.isShowing = false;
							this.input = null;
						},
						confirm(input) {
							let { product, title, brandId } = input;

							this.context.productStore
								.dispatch("updateTitleOfId", { id: product.id, title })
								.then((product) => this.dismiss())
								.catch((error) => {
									this.context.$root.feedback("Cannot Update");
									console.error(error);
								});

							this.context.productStore
								.dispatch("updateBrandIdOfId", { id: product.id, brandId })
								.then((product) => this.dismiss())
								.catch((error) => {
									this.context.$root.feedback("Cannot Update");
									console.error(error);
								});
						},
					},
					productPriceUpdate: {
						context: null,
						isShowing: false,
						input: null,
						show(input) {
							this.isShowing = true;
							this.input = input;
						},
						dismiss() {
							this.isShowing = false;
							this.input = null;
						},
						cancel() {
							this.isShowing = false;
							this.input = null;
						},
						confirm(input) {
							let { product, price } = input;

							this.context.productStore
								.dispatch("updatePriceOfId", { id: product.id, price })
								.then((product) => this.dismiss())
								.catch((error) => {
									this.context.$root.feedback("Cannot Update");
									console.error(error);
								});
						},
					},
					productDescriptionUpdate: {
						context: null,
						isShowing: false,
						input: null,
						show(input) {
							this.isShowing = true;
							this.input = input;
						},
						dismiss() {
							this.isShowing = false;
							this.input = null;
						},
						cancel() {
							this.isShowing = false;
							this.input = null;
						},
						confirm(input) {
							let { product, description } = input;

							this.context.productStore
								.dispatch("updateDescriptionOfId", {
									id: product.id,
									description,
								})
								.then((product) => this.dismiss())
								.catch((error) => {
									this.context.$root.feedback("Cannot Update");
									console.error(error);
								});
						},
					},
					productSpecificationsUpdate: {
						context: null,
						isShowing: false,
						input: null,
						show(input) {
							this.isShowing = true;
							this.input = input;
						},
						dismiss() {
							this.isShowing = false;
							this.input = null;
						},
						cancel() {
							this.isShowing = false;
							this.input = null;
						},
						confirm(input) {
							let { product, specifications } = input;

							this.context.productStore
								.dispatch("updateSpecificationsOfId", {
									id: product.id,
									specifications: specifications.map((specification) => {
										return {
											type: specification.typeKey,
											content: specification.content,
										};
									}),
								})
								.then((product) => this.dismiss())
								.catch((error) => {
									this.context.$root.feedback("Cannot Update");
									console.error(error);
								});
						},
					},
					productCategoryUpdate: {
						context: null,
						isShowing: false,
						input: null,
						show(input) {
							this.isShowing = true;
							this.input = input;
						},
						dismiss() {
							this.isShowing = false;
							this.input = null;
						},
						cancel() {
							this.isShowing = false;
							this.input = null;
						},
						confirm(input) {
							let { product, categoryId } = input;

							this.context.productStore
								.dispatch("updateCategoryIdOfId", {
									id: product.id,
									categoryId,
								})
								.then((product) => this.dismiss())
								.catch((error) => {
									this.context.$root.feedback("Cannot Update");
									console.error(error);
								});
						},
					},
				},

				product: null,
				drawerProduct: null,
				productBrand: null,

				groups: [],
			};
		},
		computed: {
			isOver1200px: (c) => c.$root.window.innerWidth > 1200,

			itemDrawerEdge: () => Drawer.Edge.RIGHT,
			itemDrawerMode() {
				if (this.isOver1200px) {
					return this.product
						? Drawer.Mode.FIXED_EXPAND
						: Drawer.Mode.FIXED_COLLAPSE;
				} else {
					return this.product
						? Drawer.Mode.DRAWER_EXPAND
						: Drawer.Mode.DRAWER_COLLAPSE;
				}
			},

			isEditable() {
				const { user } = this.loginStore.getters;
				if (!user) return false;
				return user.isTypeAdmin() || user.isTypeStaff();
			},
			isLoading() {
				return this.productStore.getters.isLoading;
			},

			paths() {
				return this.$root.paths;
			},
			lastPath() {
				let { paths } = this;
				if (!paths.length) return "";
				return paths[paths.length - 1];
			},

			products() {
				return this.groups
					.reduce((products, group) => {
						products.push(...group.products);
						return products;
					}, [])
					.filter((product) => {
						if (!this.isEditable) {
							return product.isStockAvailable();
						}
						return true;
					});
			},

			productId() {
				return this.$route.query.productId;
			},

			productPrevious() {
				return null;
				const { products } = this;
				const categoryProducts = products.filter((product) => {
					if (!this.product) return true;
					return product.category === this.product.category;
				});

				let productIndex = categoryProducts.indexOf(this.product);
				let productPreviousIndex = productIndex - 1;
				if (
					0 <= productPreviousIndex &&
					productPreviousIndex <= categoryProducts.length - 1
				) {
					return categoryProducts[productPreviousIndex];
				}

				return null;
			},
			productNext() {
				return null;
				const products = this.products;
				const categoryProducts = products.filter((product) => {
					if (!this.product) return true;
					return product.category === this.product.category;
				});

				let productIndex = categoryProducts.indexOf(this.product);
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
			"productStore.getters.items"() {
				this.invalidate();
			},
			"categoryStore.getters.items"() {
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

				let groups = await this.productStore.dispatch("getGroupsByCategory");

				const categories = await this.categoryStore.dispatch("getItems");
				categories.forEach((category) => {
					const group = groups.find((group) => group.category.id === category.id);
					if (!group) groups.push({ category, items: [] });
				});

				groups = groups.map((group) => {
					return { category: group.category, products: group.items };
				});

				groups.forEach((group) => {
					if (!this.isEditable) {
						group.products = group.products.filter((product) => {
							return product.isStockAvailable();
						});
					}
					group.products.sort((product1, product2) => {
						return product1.compare(product2);
					});
				});

				if (!this.isEditable) {
					groups = groups.filter((group) => group.products.length);
				}

				groups = groups.sort((group1, group2) => {
					return group1.category.compare(group2.category);
				});

				this.groups = groups;
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
				this.$root.nextRoute({
					query: { productId: productId ? productId : null },
				});
			},

			clickLogout() {
				this.userStore.dispatch("logout").then((user) => {
					this.$root.feedback(`${user.name} is now logged out`);
				});
			},
		},
	};
</script>

<template>
	<div class="PageProduct">
		<div
			:class="[
				'PageProduct-body',
				`PageProduct-body-${isOver1200px ? 'isOver1200' : 'isLess1200'}`,
			]"
		>
			<PanelProducts
				class="PageProduct-products"
				:products="products"
				@click-productAdd="popup.productAdd.show()"
			/>

			<div class="PageProduct-PanelRightEmpty">
				<span class="PageProduct-PanelRightEmpty-text">Select to view</span>
			</div>

			<Drawer
				class="PageProduct-panel-PanelProduct"
				:edge="itemDrawerEdge"
				:mode="itemDrawerMode"
				@click-collapse="setProduct(null)"
			>
				<PanelProduct
					class="PageProduct-PanelProduct"
					:product="drawerProduct"
					:productPrevious="productPrevious"
					:productNext="productNext"
					:isWide="false"
					:isEditable="isEditable"
					:isBackable="!isOver1200px"
					@click-dismiss="setProduct(null)"
					@click-productRemove="(output) => popup.productRemove.show(output)"
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
			</Drawer>
		</div>

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
			@click-confirm="(output) => popup.productTitleBrandUpdate.confirm(output)"
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
			@click-confirm="(output) => popup.productDescriptionUpdate.confirm(output)"
		/>
		<!-- Popup Product Category Update -->
		<WindowUpdateCategory
			v-if="isEditable"
			:isShowing="popup.productCategoryUpdate.isShowing"
			:input="popup.productCategoryUpdate.input"
			@click-dismiss="() => popup.productCategoryUpdate.dismiss()"
			@click-cancel="() => popup.productCategoryUpdate.cancel()"
			@click-confirm="(output) => popup.productCategoryUpdate.confirm(output)"
		/>
		<!-- Popup Product Description Update -->
		<WindowUpdateSpecifications
			v-if="isEditable"
			:isShowing="popup.productSpecificationsUpdate.isShowing"
			:input="popup.productSpecificationsUpdate.input"
			@click-dismiss="() => popup.productSpecificationsUpdate.dismiss()"
			@click-cancel="() => popup.productSpecificationsUpdate.cancel()"
			@click-confirm="(output) => popup.productSpecificationsUpdate.confirm(output)"
		/>
	</div>
</template>

<style lang="scss" scoped>
	.PageProduct {
		position: relative;
		width: 100%;
		width: 100vw;
		max-width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		overflow: hidden;

		.PageProduct-body {
			width: 100vw;
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
				width: 100vw;
				max-width: 100%;
			}
			.PageProduct-PanelRightEmpty {
				z-index: 2;
				background-color: #adb8bb;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				position: absolute;
				right: 0;
				top: 0;
				bottom: 0;
				.PageProduct-PanelRightEmpty-text {
					font-weight: 900;
					font-size: 1.2rem;
					color: hsl(0, 0%, 84%);
					background: hsla(0, 0%, 0%, 0.04);
					border-radius: 1rem;
					padding: 4rem 5rem;
				}
			}
			.PageProduct-panel-PanelProduct {
				z-index: 3;
				.PageProduct-PanelProduct {
					height: 100%;
					width: 100vw;
					max-width: 100%;
				}
			}
		}
		.PageProduct-body-isLess1200 {
			.PageProduct-products {
				width: 100vw;
				max-width: 100%;
			}
			.PageProduct-PanelRightEmpty {
				display: none;
			}
			.PageProduct-panel-PanelProduct {
				width: 100vw;
				max-width: 100%;
			}
		}
		.PageProduct-body-isOver1200 {
			.PageProduct-products {
				width: 100vw;
				max-width: 60%;
			}
			.PageProduct-PanelRightEmpty {
				width: 100vw;
				max-width: 40%;
			}
			.PageProduct-panel-PanelProduct {
				width: 100vw;
				max-width: 40%;
			}
		}
	}
</style>
