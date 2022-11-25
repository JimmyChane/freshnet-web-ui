<script>
	import ProductPrice from "@/items/ProductPrice.js";
	import SettingModule from "@/items/data/Setting.js";

	import Section from "./ViewerProduct-Section.vue";

	export default {
		components: { Section },
		props: {
			product: { type: Object, default: () => null },
			primaryColor: { type: Object },
		},
		computed: {
			settings: (context) => context.settingStore.getters.items,
			settingShowPrice: (c) => {
				let theSetting = c.settings.find((setting) => {
					return setting.key === SettingModule.Key.PublicShowPrice;
				});
				return theSetting ? theSetting.value : false;
			},

			priceNormal() {
				if (!this.product) return null;
				const normal = this.product.getPriceNormal();
				if (normal && normal.value >= 0) return normal;
				new ProductPrice();
			},
			pricePromotion() {
				if (!this.product) return null;
				const promotion = this.product.getPricePromotion();
				if (promotion && promotion.value >= 0) return promotion;
				new ProductPrice();
			},

			title() {
				if (!this.settingShowPrice) return "";

				const normal = this.priceNormal;
				const promotion = this.pricePromotion;

				if (!normal || !promotion) return "";

				if (normal.value > promotion.value) {
					return promotion.toString();
				}
				return normal.toString();
			},
			subtitle() {
				if (!this.settingShowPrice) return "";

				const normal = this.priceNormal;
				const promotion = this.pricePromotion;

				if (!normal || !promotion) return "";

				if (normal.value > 0 && normal.value > promotion.value) {
					return normal.toString();
				}

				return "";
			},

			isPromotion: (context) => context.product.isPricePromotion(),
			isAvailable: (context) => context.product.isStockAvailable(),
			isSecondHand: (context) => context.product.isStockSecondHand(),
		},
	};
</script>

<template>
	<Section
		class="ProductViewerPriceViewer"
		:title="title"
		:primaryColor="primaryColor"
		v-if="
			product &&
			(title || subtitle || !isAvailable || isPromotion || isSecondHand)
		"
	>
		<span class="ProductViewerPriceViewer-subtitle" v-if="subtitle">
			{{ subtitle }}
		</span>

		<div class="ProductViewerPriceViewer-tag">
			<span class="ProductViewerPriceViewer-tag-outOfStock" v-if="!isAvailable"
				>Out of Stock</span
			>
			<span class="ProductViewerPriceViewer-tag-promotion" v-if="isPromotion"
				>Promotion</span
			>
			<span class="ProductViewerPriceViewer-tag-secondHand" v-if="isSecondHand"
				>Second Hand</span
			>
		</div>
	</Section>
</template>

<style lang="scss" scoped>
	.ProductViewerPriceViewer {
		.ProductViewerPriceViewer-subtitle {
			text-decoration: line-through;
		}

		.ProductViewerPriceViewer-tag {
			flex-grow: 0;
			font-size: 1rem;
			display: flex;
			flex-direction: row;
			align-items: flex-start;
			justify-content: flex-start;
			gap: 1px;
			& > * {
				border-radius: 0.2em;
				padding: 0.2em 0.6em;
				color: white;
			}
			.ProductViewerPriceViewer-tag-outOfStock {
				background: #ff4b33;
			}
			.ProductViewerPriceViewer-tag-promotion {
				background: #ff9900;
			}
			.ProductViewerPriceViewer-tag-secondHand {
				background: #249696;
			}
		}
	}
</style>
