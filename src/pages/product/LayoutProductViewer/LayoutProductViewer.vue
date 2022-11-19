<script>
	import ProductSpecType from "@/items/ProductSpecType.js";
	import ProductPrice from "@/items/ProductPrice.js";
	import SettingModule from "@/items/data/Setting.js";

	import Tabs from "./LayoutProductViewer-Tabs.vue";
	import Contacts from "./LayoutProductViewer_Contacts.vue";
	import LayoutProductViewerSection from "./LayoutProductViewer_Section.vue";
	import LayoutProductViewerImagePreview from "./LayoutProductViewer_ImagePreview.vue";
	import LayoutProductViewerImages from "./LayoutProductViewer_Images.vue";
	import LayoutProductViewerPriceViewer from "./LayoutProductViewer_PriceViewer.vue";
	import LayoutProductViewerPriceEditor from "./LayoutProductViewer_PriceEditor.vue";
	import ItemProductStockCheckbox from "./LayoutProductViewer_StockCheckbox.vue";
	import ItemProductSpecification from "./LayoutProductViewer-ItemSpecification.vue";
	import ItemProductSuggest from "./LayoutProductViewer_ItemProductSuggest.vue";

	import Actionbar from "@/components/navigation/actionbar2/Actionbar.vue";

	import chroma from "chroma-js"; // https://gka.github.io/chroma.js/

	export default {
		components: {
			LayoutProductViewerSection,
			LayoutProductViewerImagePreview,
			LayoutProductViewerImages,
			LayoutProductViewerPriceViewer,
			LayoutProductViewerPriceEditor,
			ItemProductSpecification,
			ItemProductStockCheckbox,
			ItemProductSuggest,
			Actionbar,
			Tabs,
			Contacts,
		},
		emits: [
			"click-product-imageRemove",
			"click-product-titleBrandUpdate",
			"click-product-priceUpdate",
			"click-product-descriptionUpdate",
			"click-product-categoryUpdate",
			"click-product-specificationsUpdate",
		],
		props: {
			isWide: { type: Boolean, default: false },
			isEditable: { type: Boolean, default: false },

			leftMenus: { default: () => [] },
			rightMenus: { default: () => [] },

			product: { type: Object, default: () => null },
			productPrevious: { type: Object, default: () => null },
			productNext: { type: Object, default: () => null },
		},
		data() {
			return {
				primaryColorHex: "inherit",

				imagePreviewIndex: 0,
				onKeyUp: null,

				category: null,
				fullTitle: "",
				brand: null,

				tabKeyNow: "",

				height: 0,
				scrollTop: 0,
			};
		},
		computed: {
			tabs() {
				if (!this.product) return [];

				const tabs = [
					!this.isWide && this.imagePreview
						? { key: "image", title: "Image" }
						: null,
					this.isEditable ? { key: "brand", title: "Brand" } : null,
					this.isEditable ? { key: "title", title: "Title" } : null,
					// { key: "capability", title: "Capability" },
					this.isEditable || this.productSpecifications.length
						? { key: "specification", title: "Specification" }
						: null,
					this.isEditable || this.whatIncludeds.length
						? { key: "include", title: "What's Included" }
						: null,
					this.isEditable || this.description
						? { key: "description", title: "Description" }
						: null,
					this.isEditable || this.settingShowPrice
						? { key: "price", title: "Price" }
						: null,
					this.isEditable ? { key: "stock", title: "Stock" } : null,
					this.isEditable ? { key: "category", title: "Category" } : null,
				];

				return tabs.filter((tab) => {
					if (tab) {
						tab.isSelected = () => tab.key === this.tabKeyNow;
					}
					return tab;
				});
			},

			hasImagePrevious: (context) =>
				context.images.length > 0 && context.imagePreviewIndex > 0,
			hasImageNext: (context) =>
				context.images.length - 1 > context.imagePreviewIndex,
			hasProductPrevious: (context) => !!context.productPrevious,
			hasProductNext: (context) => !!context.productNext,

			settings() {
				let settings = this.settingStore.getters.items;
				return Array.isArray(settings) ? settings : [];
			},
			settingShowPrice() {
				let theSetting = this.settings.find((setting) => {
					return setting.key === SettingModule.Key.PublicShowPrice;
				});
				return theSetting ? theSetting.value : false;
			},

			title: (context) => (context.product ? context.product.title : ""),

			imagePreview: (context) => {
				if (context.imagePreviewIndex >= context.images.length)
					context.imagePreviewIndex = 0;
				return context.images.length
					? context.images[context.imagePreviewIndex]
					: null;
			},
			images: (context) => (!context.product ? [] : context.product.images),

			brandId: (context) => (context.product ? context.product.brandId : ""),
			brandTitle: (context) => (context.brand ? context.brand.title : ""),
			brandIcon: (context) => (context.brand ? context.brand.icon : null),
			brandIconUrl: (context) =>
				context.brandIcon ? context.brandIcon.toUrl() : "",

			categoryId: (context) =>
				context.product ? context.product.categoryId : "",
			categoryTitle: (context) =>
				context.category ? context.category.title : "",
			categoryIcon: (context) =>
				context.category ? context.category.icon : null,
			categoryIconUrl: (context) =>
				context.categoryIcon ? context.categoryIcon.toUrl() : "",

			price: (context) => {
				if (!context.isEditable && !context.settingShowPrice) return null;
				return context.product ? context.product.price : null;
			},
			priceNormal: (context) => {
				return context.price && context.price.normal
					? context.price.normal
					: new ProductPrice();
			},
			pricePromotion: (context) => {
				return context.price && context.price.promotion
					? context.price.promotion
					: new ProductPrice();
			},
			fullPrice: (context) => {
				let normal = context.priceNormal;
				let promotion = context.pricePromotion;

				if (context.isEditable) {
					return { original: normal, sell: promotion };
				}

				if (context.settingShowPrice) {
					if (normal.value > 0 && promotion.value <= 0) {
						return { original: null, sell: normal };
					}
					if (normal.value > 0 && promotion.value > 0) {
						return { original: normal, sell: promotion };
					}
					if (normal.value <= 0 && promotion.value > 0) {
						return { original: normal, sell: promotion };
					}
				}
				return { original: null, sell: null };
			},

			productIsPromotion() {
				if (!this.product) return false;
				return this.product.isPricePromotion();
			},
			productIsAvailable() {
				if (!this.product) return true;
				return this.product.isStockAvailable();
			},
			productIsSecondHand() {
				if (!this.product) return false;
				return this.product.isStockSecondHand();
			},

			description() {
				if (!this.product) return "";
				return this.product.description;
			},

			specificationKeys: () => {
				return Object.keys(ProductSpecType.Key).map((objectKey) => {
					return ProductSpecType.Key[objectKey];
				});
			},
			productSpecifications: (context) => {
				if (!context.product) return [];
				if (!Array.isArray(context.product.specifications)) return [];

				return context.product.specifications
					.filter((spec) => spec && spec.type && spec.content)
					.sort((spec1, spec2) => {
						const key1 = context.obtainKeyOfSpecificationType(spec1.type);
						const key2 = context.obtainKeyOfSpecificationType(spec2.type);

						let index1 = context.specificationKeys.indexOf(key1);
						let index2 = context.specificationKeys.indexOf(key2);

						index1 = index1 >= 0 ? index1 : context.specificationKeys.length;
						index2 = index2 >= 0 ? index2 : context.specificationKeys.length;

						return index1 !== index2
							? index1 - index2
							: key1.localeCompare(key2);
					});
			},

			gifts: (context) => (context.product ? context.product.gifts : []),
			bundles: (context) => (context.product ? context.product.bundles : []),
			whatIncludeds: (context) => {
				return [
					...context.gifts
						.filter((gift) => typeof gift === "string")
						.map((gift) => gift.trim())
						.filter((gift) => gift.length),
					...context.bundles
						.filter((bundle) => typeof bundle === "object" && bundle !== null)
						.map((bundle) => bundle.title)
						.filter((bundle) => typeof bundle === "string")
						.map((bundle) => bundle.trim())
						.filter((bundle) => bundle.length),
				];
			},

			primaryColor() {
				return chroma.valid(this.primaryColorHex)
					? chroma(this.primaryColorHex)
					: chroma("294656");
			},
			actionbarColor: (c) => c.primaryColor.mix("ffffff", 0.6),
			backgroundColor: (c) => c.primaryColor.mix("ffffff", 0.3),
			headerBackgroundColor: (c) => c.primaryColor.mix("000000", 0.4),
			titleColor() {
				const isDark = chroma.deltaE(this.primaryColor, "000000") < 60;
				return isDark ? "white" : this.primaryColor.mix("000000", 0.96);
			},
		},
		watch: {
			isWide() {
				setTimeout(() => this.invalidateBound(), 500);
			},
			product() {
				this.invalidateBound();
				this.invalidateProduct();
			},
			imagePreview() {
				this.invalidateImagePreview();
			},
		},
		methods: {
			invalidateBound() {
				this.scrollTop = this._self.$el.scrollTop;
				this.height = this._self.$el.offsetHeight;
			},
			async invalidateProduct() {
				if (this.product) this.scrollToTop();
				// this._self.$el.scrollTop = 0;
				this.tabKeyNow = this.tabs.length ? this.tabs[0].key : "";

				if (this.product) this.addArrowListener();
				else this.removeArrowListener();

				this.category = null;
				this.fullTitle = "";
				this.brand = null;
				if (!this.product) return;
				this.category = await this.product.fetchCategory();
				this.fullTitle = await this.product.fetchFullTitle();
				this.brand = await this.product.fetchBrand();
			},
			async invalidateImagePreview() {
				const color = this.imagePreview
					? await this.imagePreview.fetchColor().catch(() => null)
					: null;

				this.primaryColorHex = color ? color.toString() : "inherit";
			},

			clickPrevious() {
				if (this.hasImagePrevious) {
					this.imagePreviewIndex--;
					return;
				}

				return; // disable previous product

				if (!this.hasImagePrevious && this.hasProductPrevious) {
					this.imagePreviewIndex = this.productPrevious.images.length - 1;
					this.$root.replaceRoute({
						query: { productId: this.productPrevious.id },
					});
				}
			},
			clickNext() {
				if (this.hasImageNext) {
					this.imagePreviewIndex++;
					return;
				}

				return; // disable next product

				if (!this.hasImageNext && this.hasProductNext) {
					this.imagePreviewIndex = 0;
					this.$root.replaceRoute({
						query: { productId: this.productNext.id },
					});
				}
			},

			obtainKeyOfSpecificationType(type) {
				if (typeof type === "object") return type.key;
				if (typeof type === "string") return type;
				return "";
			},

			addArrowListener() {
				if (this.onKeyUp === null) {
					this.onKeyUp = (event) => {
						if (event.shiftKey || event.altKey || event.ctrlKey) return;

						if (event.key === "ArrowLeft") this.clickPrevious();
						if (event.key === "ArrowRight") this.clickNext();
					};
					window.addEventListener("keyup", this.onKeyUp);
				}
			},
			removeArrowListener() {
				if (this.onKeyUp !== null) {
					window.removeEventListener("keyup", this.onKeyUp);
					this.onKeyUp = null;
				}
			},

			scrollToTop() {
				const ref = this.$refs.toolbar;
				if (ref) {
					setTimeout(() => {
						ref.scrollIntoView({ behavior: "smooth", block: "start" });
					}, 300);
				}
			},
			scrollTo(key = "") {
				const ref = this.$refs[`key${key}`];
				if (!ref) return;
				ref.$el.scrollIntoView({ behavior: "smooth", block: "start" });
			},
			scrolling(event) {
				this.invalidateBound();

				const parent = event.target;
				const parentOffset = this.getOffset(parent);
				const pointHeight = parentOffset.height / 4;

				for (const tab of this.tabs) {
					const ref = this.$refs[`key${tab.key}`];
					if (!ref) continue;
					const target = ref.$el;
					if (!target) continue;

					const bound = target.getBoundingClientRect();

					const start = bound.y;
					if (0 < start && start < pointHeight) {
						this.tabKeyNow = tab.key;
						continue;
					}
					const end = bound.y + bound.height;
					if (0 < end && end < pointHeight) {
						this.tabKeyNow = tab.key;
						continue;
					}
				}
			},
			getOffset(element) {
				return {
					width: element.offsetWidth,
					height: element.offsetHeight,
					left: element.offsetLeft,
					top: element.offsetTop,
				};
			},
		},
		mounted() {
			this.invalidateBound();
			this.invalidateProduct();
			this.invalidateImagePreview();
		},
		destroy() {
			this.removeArrowListener();
		},
	};
</script>

<template>
	<div
		:class="[
			'LayoutProductViewer',
			`LayoutProductViewer-${isWide ? 'isWide' : 'isThin'}`,
		]"
		:style="{
			'--primary-color': primaryColor,
			'background-color': backgroundColor,
		}"
		@scroll="(event) => scrolling(event)"
	>
		<div
			class="LayoutProductViewer-toolbar"
			:style="{ 'background-color': actionbarColor }"
		>
			<Actionbar
				class="LayoutProductViewer-actionbar"
				:leftMenus="leftMenus"
				:rightMenus="rightMenus"
				:style="{ 'background-color': actionbarColor }"
			>
				<span class="LayoutProductViewer-actionbar-title" v-if="fullTitle">{{
					fullTitle
				}}</span>
			</Actionbar>

			<Tabs
				v-if="tabs.length"
				@click-item="(tab) => scrollTo(tab.key)"
				:items="tabs"
			/>
		</div>

		<div class="LayoutProductViewer-header" ref="toolbar">
			<div
				class="LayoutProductViewer-preview"
				v-if="product"
				:style="{ 'background-color': headerBackgroundColor }"
			>
				<LayoutProductViewerImagePreview
					class="LayoutProductViewer-image"
					ref="keyimage"
					v-if="imagePreview"
					:image="imagePreview"
					:hasImagePrevious="hasImagePrevious"
					:hasImageNext="hasImageNext"
					:hasProductPrevious="false"
					:hasProductNext="false"
					:isEditable="isEditable"
					@click-previous="clickPrevious"
					@click-next="clickNext"
					@click-remove="
						(image) => $emit('click-product-imageRemove', { product, image })
					"
				/>
				<LayoutProductViewerImages
					class="LayoutProductViewer-thumbnails"
					v-if="isEditable || images.length > 1"
					:images="images"
					:indexAt="imagePreviewIndex"
					:isEditable="isEditable"
					@click-image="
						(image) => {
							imagePreviewIndex = images.indexOf(image);
						}
					"
					@click-add-image-file="
						(file) => {
							productStore.dispatch('addImageOfId', {
								id: product.id,
								imageFile: file,
							});
						}
					"
				/>
				<div class="LayoutProductViewer-text" :style="{ color: titleColor }">{{
					fullTitle
				}}</div>
			</div>

			<Contacts
				class="LayoutProductViewer-contact"
				v-if="product"
				:product="product"
				:isWide="isWide"
			/>
		</div>

		<div class="LayoutProductViewer-info">
			<!-- brand -->
			<LayoutProductViewerSection
				ref="keybrand"
				v-if="isEditable"
				title="Brand"
				:menu="{
					title: 'Edit',
					icon: host.res('icon/edit-000000.svg'),
					click: () => {
						$emit('click-product-titleBrandUpdate', {
							product,
							title: title,
							brandId: brandId,
						});
					},
				}"
			>
				<div class="LayoutProductViewer-brand">
					<div class="LayoutProductViewer-brand-item" v-if="brand">
						<img
							class="LayoutProductViewer-brand-item-icon"
							v-if="brandIconUrl"
							:src="brandIconUrl"
						/>
						<span
							class="LayoutProductViewer-brand-item-title"
							v-if="brandTitle"
							>{{ brandTitle }}</span
						>
					</div>

					<span class="LayoutProductViewer-brand-noContent" v-else
						>No Brand</span
					>
				</div>
			</LayoutProductViewerSection>

			<!-- title -->
			<LayoutProductViewerSection
				ref="keytitle"
				v-if="isEditable"
				title="Title"
				:menu="{
					title: 'Edit',
					icon: host.res('icon/edit-000000.svg'),
					click: () => {
						$emit('click-product-titleBrandUpdate', {
							product,
							title: title,
							brandId: brandId,
						});
					},
				}"
			>
				<div class="LayoutProductViewer-title">
					<span v-if="title">{{ title }}</span>

					<span class="LayoutProductViewer-title-noContent" v-else
						>No Title</span
					>
				</div>
			</LayoutProductViewerSection>

			<!-- specification -->
			<LayoutProductViewerSection
				ref="keyspecification"
				v-if="isEditable || productSpecifications.length"
				:primaryColor="primaryColor.toString()"
				:menu="
					isEditable
						? {
								title: 'Edit',
								icon: host.res('icon/edit-000000.svg'),
								click: () => {
									$emit('click-product-specificationsUpdate', {
										product: product,
										specifications: productSpecifications,
									});
								},
						  }
						: null
				"
				title="Specification"
			>
				<div class="LayoutProductViewer-specification">
					<div
						class="LayoutProductViewer-specifications"
						v-if="productSpecifications.length"
					>
						<ItemProductSpecification
							v-for="spec in productSpecifications"
							:key="spec.name"
							:productSpecification="spec"
							:isVertical="false"
						/>
					</div>

					<span class="LayoutProductViewer-specification-noContent" v-else
						>No Specifications</span
					>
				</div>
			</LayoutProductViewerSection>

			<!-- include -->
			<LayoutProductViewerSection
				ref="keyinclude"
				v-if="isEditable || whatIncludeds.length"
				:primaryColor="primaryColor.toString()"
				title="What's Included"
			>
				<div class="LayoutProductViewer-whatIncluded">
					<div
						class="LayoutProductViewer-whatIncludeds"
						v-if="whatIncludeds.length"
					>
						<div
							class="LayoutProductViewer-whatIncludeds-item"
							v-for="whatIncludeds of whatIncludeds"
							:key="whatIncludeds"
						>
							<span>{{ whatIncludeds }}</span>
						</div>
					</div>

					<span class="LayoutProductViewer-whatIncluded-noContent" v-else
						>Nothing Included</span
					>
				</div>
			</LayoutProductViewerSection>

			<!-- description -->
			<LayoutProductViewerSection
				ref="keydescription"
				class="LayoutProductViewer-descriptionParent"
				v-if="isEditable || description"
				:primaryColor="primaryColor.toString()"
				title="Description"
				:menu="
					isEditable
						? {
								title: 'Edit',
								icon: host.res('icon/edit-000000.svg'),
								click: () => {
									$emit('click-product-descriptionUpdate', {
										product: product,
										description: description,
									});
								},
						  }
						: null
				"
			>
				<div class="LayoutProductViewer-description">
					<p
						class="LayoutProductViewer-description-content"
						v-if="description"
						>{{ description }}</p
					>

					<span class="LayoutProductViewer-description-noContent" v-else
						>No Description</span
					>
				</div>
			</LayoutProductViewerSection>

			<!-- price -->
			<LayoutProductViewerPriceViewer
				ref="keyprice"
				:product="product"
				v-if="!isEditable"
			/>
			<LayoutProductViewerPriceEditor
				ref="keyprice"
				:product="product"
				v-if="isEditable"
				@click-product-priceUpdate="
					(x) => $emit('click-product-priceUpdate', x)
				"
			/>

			<!-- stock -->
			<LayoutProductViewerSection
				ref="keystock"
				:primaryColor="primaryColor.toString()"
				title="Stock"
				v-if="isEditable"
			>
				<div class="LayoutProductViewer-stock">
					<ItemProductStockCheckbox
						class="LayoutProductViewer-stock-outOfStock"
						title="Out of Stock"
						:checked="!productIsAvailable"
						@click="
							() => {
								productStore.dispatch('updateAvailabilityOfId', {
									id: product.id,
									isAvailable: !productIsAvailable,
								});
							}
						"
					/>
					<ItemProductStockCheckbox
						class="LayoutProductViewer-stock-secondHand"
						title="Second Hand"
						:checked="productIsSecondHand"
						@click="
							() => {
								productStore.dispatch('updateSecondHandOfId', {
									id: product.id,
									isSecondHand: !productIsSecondHand,
								});
							}
						"
					/>
				</div>
			</LayoutProductViewerSection>

			<!-- category -->
			<LayoutProductViewerSection
				ref="keycategory"
				v-if="isEditable"
				:primaryColor="primaryColor.toString()"
				title="Category"
				:menu="{
					title: 'Edit',
					icon: host.res('icon/edit-000000.svg'),
					click: () => {
						$emit('click-product-categoryUpdate', {
							product,
							categoryId: categoryId,
						});
					},
				}"
			>
				<div class="LayoutProductViewer-category">
					<div class="LayoutProductViewer-category-item" v-if="category">
						<img
							class="LayoutProductViewer-category-item-icon"
							v-if="categoryIconUrl"
							:src="categoryIconUrl"
						/>
						<span
							class="LayoutProductViewer-category-item-title"
							v-if="categoryTitle"
							>{{ categoryTitle }}</span
						>
					</div>

					<span class="LayoutProductViewer-category-noContent" v-else
						>No Category</span
					>
				</div>
			</LayoutProductViewerSection>

			<div
				class="LayoutProductViewer-playlistSections"
				v-if="hasProductNext || hasProductPrevious"
			>
				<LayoutProductViewerSection
					v-if="hasProductNext"
					title="Next"
					:primaryColor="primaryColor.toString()"
				>
					<div class="LayoutProductViewer-playlist">
						<ItemProductSuggest
							:item="productNext"
							@click="
								(productNext) => {
									$root.replaceRoute({
										query: { productId: productNext.id },
									});
								}
							"
						/>
					</div>
				</LayoutProductViewerSection>

				<LayoutProductViewerSection
					v-if="hasProductPrevious"
					title="Previous"
					:primaryColor="primaryColor.toString()"
				>
					<div class="LayoutProductViewer-playlist">
						<ItemProductSuggest
							:item="productPrevious"
							@click="
								(productPrevious) => {
									$root.replaceRoute({
										query: { productId: productPrevious.id },
									});
								}
							"
						/>
					</div>
				</LayoutProductViewerSection>
			</div>
		</div>

		<div class="LayoutProductViewer-emtpy" v-if="!product">
			<div class="LayoutProductViewer-emtpy-cardBackground"></div>
			<span class="LayoutProductViewer-emtpy-title">Viewer</span>
		</div>

		<button
			:class="[
				'LayoutProductViewer-backToTop',
				scrollTop > 10 ? '' : 'LayoutProductViewer-backToTop-isHidden',
			]"
			:style="{
				'--parent-height': `${height}px`,
				'--parent-scrollTop': `${scrollTop}px`,
				'background-color': actionbarColor,
				'box-shadow': `0 0 1rem ${headerBackgroundColor}`,
			}"
			@click="() => scrollToTop()"
		>
			<img :src="host.res('icon/arrow-left-000000.svg')" />
		</button>
	</div>
</template>

<style lang="scss" scoped>
	.LayoutProductViewer {
		--color-transition-duration: 2s;

		position: relative;

		width: 100%;
		height: 100%;

		display: grid;
		justify-items: center;
		align-items: start;

		background: hsl(0, 0%, 90%);
		font-size: 1.2rem;
		overflow-y: auto;
		scroll-padding-top: 8rem;
		transition: background-color var(--color-transition-duration);

		.LayoutProductViewer-toolbar {
			grid-area: toolbar;
			z-index: 4;
			width: 100%;
			position: sticky;
			border-bottom: 1px solid hsla(0, 0%, 0%, 0.1);
			top: 0;
			transition: background-color var(--color-transition-duration);
			.LayoutProductViewer-actionbar {
				border-bottom: 1px solid hsla(0, 0%, 0%, 0.1);
				transition: background-color var(--color-transition-duration);
				.LayoutProductViewer-actionbar-title {
					display: flex;
					flex-direction: column;
					align-items: flex-start;
					justify-content: center;
					gap: 0.1rem;
					line-height: 1.1rem;

					font-weight: 600;
					font-size: 1rem;

					overflow: hidden;
					color: black;
					text-align: start;
					text-overflow: clip;

					white-space: nowrap;

					width: 100%;
				}
			}
		}
		.LayoutProductViewer-header {
			--padding: 1.2rem;

			width: 100%;
			z-index: 1;
			grid-area: header;
			display: flex;
			flex-direction: column;
			align-items: center;
			padding: var(--padding);
			gap: 1rem;

			.LayoutProductViewer-preview {
				width: 100%;
				height: 100%;

				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				overflow: hidden;
				transition: background-color var(--color-transition-duration);
				border-radius: 1.5rem;

				.LayoutProductViewer-text {
					width: 100%;
					color: white;
					font-size: 2.2rem;
					font-weight: 600;
					text-align: center;
					padding: 2rem;
					transition: color var(--color-transition-duration);

					@media (max-width: 480px) {
						font-size: 1.6rem;
					}
				}
			}
			.LayoutProductViewer-contact {
				width: 100%;
			}
		}
		.LayoutProductViewer-info {
			--padding: 1.2rem;

			grid-area: info;

			width: 100%;
			z-index: 2;
			gap: 1.5rem;
			color: black;

			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: flex-start;
			padding: var(--padding);
			padding-bottom: 10rem;
			padding-bottom: 80vh;

			.LayoutProductViewer-brand {
				width: 100%;
				display: flex;
				flex-direction: row;
				justify-content: flex-start;
				align-items: flex-start;
				.LayoutProductViewer-brand-item {
					width: 100%;
					padding: 0.8rem;
					gap: 1.4rem;
					background: hsla(0, 0%, 100%, 0.6);
					border-radius: 0.6rem;

					display: flex;
					flex-direction: row;
					align-items: center;
					justify-content: flex-start;

					.LayoutProductViewer-brand-item-icon {
						padding: 0.5rem;
						height: 2rem;
						background: hsla(0, 0%, 100%, 0.5);
						border: 1px solid white;
						border-radius: 0.2rem;
					}
					.LayoutProductViewer-brand-item-title {
						font-size: 1.1rem;
						font-weight: 600;
					}
				}
				.LayoutProductViewer-brand-noContent {
					width: 100%;
					padding: 1.2rem;
					border-radius: 0.6rem;
					font-style: italic;
					font-size: 0.8rem;
					color: hsla(0, 0%, 0%, 0.6);
					background: hsla(0, 0%, 100%, 0.6);
				}
			}
			.LayoutProductViewer-title {
				font-size: 1rem;
				background: hsla(0, 0%, 100%, 0.6);
				padding: 1.2rem;
				border-radius: 0.6rem;
				font-weight: 600;
				.LayoutProductViewer-title-noContent {
					opacity: 0.6;
					font-style: italic;
				}
			}
			.LayoutProductViewer-category {
				grid-area: category;
				width: 100%;
				display: flex;
				flex-direction: row;
				justify-content: flex-start;
				align-items: flex-start;
				.LayoutProductViewer-category-item {
					width: 100%;
					padding: 1.2rem;
					gap: 1.2rem;
					background: hsla(0, 0%, 100%, 0.6);
					border-radius: 0.6rem;

					display: flex;
					flex-direction: row;
					align-items: center;
					justify-content: flex-start;

					.LayoutProductViewer-category-item-icon {
						width: 1.6rem;
						height: 1.6rem;
					}
					.LayoutProductViewer-category-item-title {
						font-size: 1rem;
						font-weight: 600;
					}
				}
				.LayoutProductViewer-category-noContent {
					opacity: 0.6;
					font-style: italic;
				}
			}
			.LayoutProductViewer-stock {
				grid-area: stock;
				display: flex;
				flex-direction: row;
				justify-content: flex-start;
				align-items: flex-start;
				gap: 0.5rem;
				.LayoutProductViewer-stock-outOfStock {
					--primary-color: #ff4b33;
				}
				.LayoutProductViewer-stock-secondHand {
					--primary-color: #249696;
				}
			}
			.LayoutProductViewer-descriptionParent {
				grid-area: description;
				align-items: flex-start;
				justify-content: flex-start;
				.LayoutProductViewer-description {
					widows: 100%;
					max-width: 40rem;
					font-size: 1rem;

					border-radius: 0.6rem;
					background: hsla(0, 0%, 100%, 0.6);
					padding: 1.2rem;
					font-size: 1rem;
					.LayoutProductViewer-description-noContent {
						opacity: 0.6;
						font-style: italic;
						font-size: 1rem;
					}
				}
			}
			.LayoutProductViewer-specification {
				grid-area: specification;
				width: 100%;
				font-size: 1rem;

				display: flex;
				flex-direction: column;
				align-items: flex-start;

				.LayoutProductViewer-specifications {
					width: 100%;
					border-radius: 1rem;
					overflow: hidden;
					gap: 1px;

					display: flex;
					flex-direction: column;
				}
				.LayoutProductViewer-specification-noContent {
					width: 100%;
					padding: 1.2rem;
					border-radius: 0.6rem;
					font-style: italic;
					font-size: 0.8rem;
					color: hsla(0, 0%, 0%, 0.6);
					background: hsla(0, 0%, 100%, 0.6);
				}
			}
			.LayoutProductViewer-whatIncluded {
				grid-area: gift;
				width: 100%;
				font-size: 1rem;

				display: flex;
				flex-direction: column;
				align-items: flex-start;

				.LayoutProductViewer-whatIncludeds {
					width: 100%;
					max-width: 30rem;
					gap: 1px;
					line-height: 0.8;
					border-radius: 1rem;
					overflow: hidden;

					display: flex;
					flex-direction: column;
					flex-wrap: nowrap;
					align-items: flex-start;

					.LayoutProductViewer-whatIncludeds-item {
						width: 100%;
						padding: 1.2rem;
						background: hsla(0, 0%, 100%, 0.6);
						font-weight: 600;
					}
				}
				.LayoutProductViewer-whatIncluded-noContent {
					width: 100%;
					padding: 1.2rem;
					border-radius: 0.6rem;
					font-style: italic;
					font-size: 0.8rem;
					color: hsla(0, 0%, 0%, 0.6);
					background: hsla(0, 0%, 100%, 0.6);
				}
			}
			.LayoutProductViewer-playlistSections {
				grid-area: playlist;
				width: 100%;
				max-width: 50rem;
				gap: 4rem;
				margin-top: 4rem;

				display: flex;
				flex-direction: column;

				.LayoutProductViewer-playlist {
					width: 100%;
					border-radius: 0.6rem;
					overflow: hidden;

					display: flex;
					flex-direction: row;
					flex-wrap: wrap;
					justify-content: space-between;
					column-gap: 2rem;
					row-gap: 1rem;

					& > * {
						margin: auto;
					}
				}
			}
		}
		.LayoutProductViewer-emtpy {
			z-index: 2;
			width: 100%;
			height: 100%;
			position: relative;

			background-color: hsl(0, 0%, 90%);

			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			.LayoutProductViewer-emtpy-cardBackground {
				z-index: 1;
				position: absolute;
				width: 100%;
				height: 100%;

				opacity: 0.15;
				background: var(--primary-color);

				pointer-events: none;
				display: flex;
			}
			.LayoutProductViewer-emtpy-title {
				color: black;
				opacity: 0.4;
			}
		}
		.LayoutProductViewer-backToTop {
			--size: 3rem;
			--margin: 0.8rem;
			width: var(--size);
			height: var(--size);

			z-index: 3;
			display: flex;
			align-items: center;
			justify-content: center;
			border-radius: 50%;
			position: absolute;
			top: 0;
			right: var(--margin);

			border: none;
			background: none;
			cursor: pointer;

			transition: var(--animation-duration);

			--parent-height: 0;
			--parent-scrollTop: 0;

			top: calc(
				var(--parent-height) - var(--margin) - var(--size) +
					var(--parent-scrollTop)
			);

			&:hover {
				transform: scale(1.1);
			}

			& > * {
				--size: 1.2rem;
				width: var(--size);
				height: var(--size);
				transform: rotate(90deg);
			}
		}
		.LayoutProductViewer-backToTop-isHidden {
			transform: scale(0);
			pointer-events: none;
			opacity: 0;
		}
	}

	.LayoutProductViewer-isThin {
		grid-template-rows: 8rem max-content minmax(1fr, max-content);
		grid-template-columns: 100%;
		grid-template-areas:
			"toolbar"
			"header"
			"info";

		.LayoutProductViewer-header {
			max-width: 50rem;
		}
		.LayoutProductViewer-info {
			max-width: 50rem;
		}
	}
	.LayoutProductViewer-isWide {
		--actionbar-height: 5.5rem;
		grid-template-rows: var(--actionbar-height) 1fr;
		grid-template-columns: 45% 55%;
		grid-template-areas:
			"toolbar toolbar"
			"header info";
		.LayoutProductViewer-header {
			height: calc(100vh - var(--actionbar-height));
			position: sticky;
			left: 0;
			top: var(--actionbar-height);
		}
		.LayoutProductViewer-header {
			--padding: 2rem;
			padding-right: calc(var(--padding) / 2);
		}
		.LayoutProductViewer-info {
			--padding: 2rem;
			padding-left: calc(var(--padding) / 2);
		}
	}
</style>
