<script>
	import ProductSpecType from "@/items/ProductSpecType.js";
	import ProductPrice from "@/items/ProductPrice.js";
	import SettingModule from "@/items/data/Setting.js";

	import Contacts from "./LayoutProductViewer_Contacts.vue";

	import LayoutProductViewerSection from "./LayoutProductViewer_Section.vue";
	import LayoutProductViewerImagePreview from "./LayoutProductViewer_ImagePreview.vue";
	import LayoutProductViewerImages from "./LayoutProductViewer_Images.vue";
	import LayoutProductViewerPriceViewer from "./LayoutProductViewer_PriceViewer.vue";
	import LayoutProductViewerPriceEditor from "./LayoutProductViewer_PriceEditor.vue";
	import ItemProductStockCheckbox from "./LayoutProductViewer_StockCheckbox.vue";
	import ItemProductSpecification from "./LayoutProductViewer_ItemSpecification.vue";
	import ItemProductSuggest from "./LayoutProductViewer_ItemProductSuggest.vue";

	import chroma from "chroma-js"; // https://gka.github.io/chroma.js/

	export default {
		components: {
			Contacts,
			LayoutProductViewerSection,
			LayoutProductViewerImagePreview,
			LayoutProductViewerImages,
			LayoutProductViewerPriceViewer,
			LayoutProductViewerPriceEditor,
			ItemProductSpecification,
			ItemProductStockCheckbox,
			ItemProductSuggest,
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
			product: { type: Object, default: () => null },
			productPrevious: { type: Object, default: () => null },
			productNext: { type: Object, default: () => null },

			isWide: { type: Boolean, default: false },
			isEditable: { type: Boolean, default: false },
		},
		data() {
			return {
				primaryColorHex: "inherit",

				imagePreviewIndex: 0,
				onKeyUp: null,

				category: null,
				fullTitle: "",
				brand: null,
			};
		},
		computed: {
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
			backgroundColor: (c) => c.primaryColor.mix("ffffff", 0.4),
			headerBackgroundColor: (c) => c.primaryColor.mix("000000", 0.4),
			titleColor() {
				const isDark = chroma.deltaE(this.primaryColor, "000000") < 60;
				return isDark ? "white" : this.primaryColor.mix("000000", 0.96);
			},
		},
		watch: {
			product() {
				this.invalidateProduct();
			},
			imagePreview() {
				this.invalidateImagePreview();
			},
			primaryColor() {
				this.$emit("change-primaryColor", this.primaryColor);
			},
		},
		methods: {
			async invalidateProduct() {
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
		},
		mounted() {
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
	>
		<div class="LayoutProductViewer-header">
			<div
				class="LayoutProductViewer-preview"
				v-if="product"
				:style="{ 'background-color': headerBackgroundColor }"
			>
				<LayoutProductViewerImagePreview
					class="LayoutProductViewer-image"
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
						/>
					</div>

					<span class="LayoutProductViewer-specification-noContent" v-else
						>No Specifications</span
					>
				</div>
			</LayoutProductViewerSection>

			<!-- include -->
			<LayoutProductViewerSection
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
			<LayoutProductViewerPriceViewer :product="product" v-if="!isEditable" />
			<LayoutProductViewerPriceEditor
				:product="product"
				v-if="isEditable"
				@click-product-priceUpdate="
					(x) => $emit('click-product-priceUpdate', x)
				"
			/>

			<!-- stock -->
			<LayoutProductViewerSection
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
	</div>
</template>

<style lang="scss" scoped>
	.LayoutProductViewer {
		width: 100%;
		position: relative;
		background: hsl(0, 0%, 90%);
		color: #2a4858;
		font-size: 1.2rem;
		display: grid;

		.LayoutProductViewer-header {
			grid-area: header;
			display: flex;
			flex-direction: column;
			align-items: center;

			.LayoutProductViewer-preview {
				z-index: 1;

				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				overflow: hidden;

				.LayoutProductViewer-image {
					z-index: 1;
				}

				.LayoutProductViewer-thumbnails {
					z-index: 2;
				}

				.LayoutProductViewer-text {
					z-index: 3;
					width: 100%;
					max-width: 90rem;
					color: white;
					font-size: 2.2rem;
					font-weight: 600;
					text-align: center;
					padding: 2rem;

					@media (max-width: 480px) {
						font-size: 1.6rem;
					}
				}
			}
		}

		.LayoutProductViewer-info {
			grid-area: info;

			z-index: 2;
			overflow: hidden;
			gap: 1.5rem;
			color: black;

			height: inherit;

			display: flex;
			flex-direction: column;
			align-items: center;

			& > * {
				max-width: 50rem;
			}

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
					}
					.LayoutProductViewer-brand-item-title {
						font-size: 1.1rem;
						font-weight: 600;
						background: hsla(0, 0%, 100%, 0.5);
						border: 1px solid white;
						border-radius: 0.2rem;
						padding: 0.5rem 0.8rem;
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

					display: grid;
					grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
					gap: 0.2rem;
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
					gap: 0.2rem;
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
	}

	.LayoutProductViewer-isThin {
		grid-template-areas: "header" "info";
		grid-template-rows: max-content minmax(1fr, max-content);
		grid-template-columns: 100%;

		display: flex;
		flex-direction: column;
		align-items: center;

		// display: flex;
		// flex-direction: column;
		// align-items: center;

		.LayoutProductViewer-header {
			width: 100%;
			.LayoutProductViewer-preview {
				border-radius: 1.5rem;
				margin: 1rem;
				width: calc(100% - 2rem);
				max-width: 50rem;
				height: max-content;
			}
			.LayoutProductViewer-contact {
				max-width: 52rem;
			}
		}
		.LayoutProductViewer-info {
			padding-bottom: 10rem;
			margin: 1rem;
			width: calc(100% - 2rem);
		}
	}
	.LayoutProductViewer-isWide {
		grid-template-areas: "header info";
		grid-template-rows: minmax(1fr, max-content);
		grid-template-columns: 45% 1fr;

		.LayoutProductViewer-header {
			position: sticky;
			left: 1.5rem;
			top: 1.5rem;
			margin: 1.5rem;
			height: calc(100vh - 3rem);
			max-height: calc(100vh - 3rem);
			gap: 1rem;

			.LayoutProductViewer-preview {
				height: calc(100% - 2rem);
				border-radius: 2rem;
			}
			.LayoutProductViewer-contact {
				width: calc(100% + 3rem);
			}
		}
		.LayoutProductViewer-info {
			padding-bottom: 0;
			margin: 1.5rem;
			width: calc(100% - 3rem);
		}
	}
</style>
