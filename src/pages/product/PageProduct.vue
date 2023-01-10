<script>
	import Empty from "@/components/Empty.vue";
	import Drawer from "@/components/Drawer.vue";

	import Navigation from "@/tools/Navigation.js";

	import Footer from "@/app/footer/Footer.vue";

	import PanelProducts from "./PanelProducts-v2.vue";
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

	class PopupContext {
		context = null;
		isShowing = false;
		input = null;

		onShowCallback;
		onDismissCallback;
		onCancelCallback;
		onConfirmCallback;

		constructor(context) {
			this.context = context;
		}
		show(input) {
			const accept = () => {
				this.isShowing = true;
				this.input = input;
			};
			if (typeof this.onShowCallback !== "function") {
				accept();
				return;
			}
			const reject = (error, reason) => {
				if (typeof reason === "string" && reason.length)
					this.context.$root.feedback(reason);
				if (error !== undefined) console.error(error);
			};
			this.onShowCallback(accept, reject, input);
		}
		dismiss() {
			const accept = () => {
				this.isShowing = false;
				this.input = null;
			};
			if (typeof this.onDismissCallback !== "function") {
				accept();
				return;
			}
			const reject = (error, reason) => {
				if (typeof reason === "string" && reason.length)
					this.context.$root.feedback(reason);
				if (error !== undefined) console.error(error);
			};
			this.onDismissCallback(accept, reject);
		}
		cancel() {
			const accept = () => {
				this.isShowing = false;
				this.input = null;
			};
			if (typeof this.onCancelCallback !== "function") {
				accept();
				return;
			}
			const reject = (error, reason) => {
				if (typeof reason === "string" && reason.length)
					this.context.$root.feedback(reason);
				if (error !== undefined) console.error(error);
			};
			this.onCancelCallback(accept, reject);
		}
		confirm(output) {
			const accept = () => {
				this.isShowing = false;
				this.input = null;
			};
			if (typeof this.onConfirmCallback !== "function") {
				accept();
				return;
			}
			const reject = (error, reason) => {
				if (typeof reason === "string" && reason.length)
					this.context.$root.feedback(reason);
				if (error !== undefined) console.error(error);
			};
			this.onConfirmCallback(accept, reject, output);
		}

		onShow(fun) {
			this.onShowCallback = fun;
			return this;
		}
		onDismiss(fun) {
			this.onDismissCallback = fun;
			return this;
		}
		onCancel(fun) {
			this.onCancelCallback = fun;
			return this;
		}
		onConfirm(fun) {
			this.onConfirmCallback = fun;
			return this;
		}
	}

	export default {
		key: "product",
		title: "Products",
		icon: { light: "products-FFFFFF", dark: "products-000000" },

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
		data() {
			return {
				scrollTop: 0,
				popup: {
					search: new PopupContext(this),
					productAdd: new PopupContext(this).onConfirm((accept, reject, output) => {
						this.productStore
							.dispatch("addItem", { data: output })
							.then((product) => {
								accept();
								this.setProduct(product);
							})
							.catch((error) => reject(error, "Product Creation Failed"));
					}),
					productRemove: new PopupContext(this).onConfirm(
						(accept, reject, input) => {
							this.productStore
								.dispatch("removeItemOfId", { id: input.productId })
								.then(() => {
									accept();
									this.setProduct(null);
								})
								.catch((error) => reject(error, "Product Deletion Failed"));
						},
					),
					productImageRemove: new PopupContext(this).onConfirm(
						(accept, reject, input) => {
							const { product, image } = input;
							this.productStore
								.dispatch("removeImageOfId", { id: product.id, image })
								.then(() => accept())
								.catch(() => reject());
						},
					),
					productTitleBrandUpdate: new PopupContext(this).onConfirm(
						(accept, reject, input) => {
							const { product, title, brandId } = input;
							Promise.all([
								this.productStore.dispatch("updateTitleOfId", {
									id: product.id,
									title,
								}),
								this.productStore.dispatch("updateBrandIdOfId", {
									id: product.id,
									brandId,
								}),
							])
								.then(() => accept())
								.catch((error) => reject(error, "Some Cannot Update"));
						},
					),
					productPriceUpdate: new PopupContext(this).onConfirm(
						(accept, reject, input) => {
							const { product, price } = input;
							this.productStore
								.dispatch("updatePriceOfId", { id: product.id, price })
								.then((product) => accept())
								.catch((error) => reject(error, "Cannot Update"));
						},
					),
					productDescriptionUpdate: new PopupContext(this).onConfirm(
						(accept, reject, input) => {
							const { product, description } = input;
							this.productStore
								.dispatch("updateDescriptionOfId", {
									id: product.id,
									description,
								})
								.then((product) => accept())
								.catch((error) => reject(error, "Cannot Update"));
						},
					),
					productSpecificationsUpdate: new PopupContext(this).onConfirm(
						(accept, reject, input) => {
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
								.then((product) => accept())
								.catch((error) => reject(error, "Cannot Update"));
						},
					),
					productCategoryUpdate: new PopupContext(this).onConfirm(
						(accept, reject, input) => {
							const { product, categoryId } = input;
							this.productStore
								.dispatch("updateCategoryIdOfId", {
									id: product.id,
									categoryId,
								})
								.then((product) => accept())
								.catch((error) => reject(error, "Cannot Update"));
						},
					),
				},

				product: null,
				drawerProduct: null,
				productBrand: null,

				groups: [],

				stylePanelProducts: {},
				stylePanelEmpty: {},
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
				// return null;
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
				// return null;
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

					productDescriptionUpdate: new PopupContext(this).onConfirm(
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
			isOver1200px() {
				this.invalidateStyle();
			},
			product() {
				this.onProduct();
				this.invalidateStyle();
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
			this.invalidateStyle();
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
			async invalidateStyle() {
				this.invalidateStylePanelProducts();
				this.invalidateStylePanelEmpty();
			},
			async invalidateStylePanelProducts() {
				if (this.isOver1200px) {
					this.stylePanelProducts = {};
					return;
				}

				if (this.product) {
					const compare = this.product;
					setTimeout(() => {
						if (compare === this.product)
							this.stylePanelProducts = { display: "none" };
					}, 700);
					return;
				}
				this.stylePanelProducts = {};
			},
			async invalidateStylePanelEmpty() {
				if (!this.isOver1200px) {
					this.stylePanelEmpty = {};
					return;
				}

				if (this.product) {
					const compare = this.product;
					setTimeout(() => {
						if (compare === this.product)
							this.stylePanelEmpty = { display: "none" };
					}, 700);
					return;
				}
				this.stylePanelEmpty = {};
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
				:style="stylePanelProducts"
				:products="products"
				@click-productAdd="() => popup.productAdd.show()"
				@click-search="() => popup.search.show()"
			/>

			<div class="PageProduct-PanelRightEmpty" :style="stylePanelEmpty">
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
					@click-dismiss="() => setProduct(null)"
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

		<!-- Popup Product Search -->
		<WindowSearch
			class="PageService-window"
			v-if="$root.window.innerWidth <= 550"
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
				background-color: hsla(0, 0%, 0%, 0.6);
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				position: absolute;
				right: 0;
				top: 0;
				bottom: 0;
				.PageProduct-PanelRightEmpty-text {
					font-weight: 600;
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
