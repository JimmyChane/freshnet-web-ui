<script>
	import ProductPrice from "@/items/ProductPrice.js";

	import LayoutProductViewerSection from "./LayoutProductViewer_Section.vue";

	export default {
		components: { LayoutProductViewerSection },
		props: {
			product: { type: Object, default: () => null },
		},
		computed: {
			price: (context) => (context.product ? context.product.price : null),
			priceNormal() {
				const normal = this.product ? this.product.getPriceNormal() : null;
				if (normal && normal.value >= 0) return normal;
				return new ProductPrice();
			},
			pricePromotion() {
				const promotion = this.product ? this.product.getPricePromotion() : null;
				if (promotion && promotion.value >= 0) return promotion;
				return new ProductPrice();
			},
		},
	};
</script>

<template>
	<LayoutProductViewerSection
		class="LayoutProductViewerPriceEditor"
		title="Price"
		:menu="{
			title: 'Edit',
			icon: host.res('icon/edit-000000.svg'),
			click: () => {
				$emit('click-product-priceUpdate', {
					product: product,
					price: price,
				});
			},
		}"
	>
		<div class="LayoutProductViewerPriceEditor-body">
			<div class="LayoutProductViewerPriceEditor-row">
				<span class="LayoutProductViewerPriceEditor-row-title">Normal</span>
				<span class="LayoutProductViewerPriceEditor-row-value">{{
					priceNormal.toString()
				}}</span>
			</div>
			<div class="LayoutProductViewerPriceEditor-row">
				<span class="LayoutProductViewerPriceEditor-row-title">Promotion</span>
				<span class="LayoutProductViewerPriceEditor-row-value">{{
					pricePromotion.toString()
				}}</span>
			</div>
		</div>
	</LayoutProductViewerSection>
</template>

<style lang="scss" scoped>
	.LayoutProductViewerPriceEditor {
		display: flex;
		flex-direction: column;
		align-items: stretch;
		justify-content: flex-start;
		.LayoutProductViewerPriceEditor-body {
			display: flex;
			flex-direction: column;
			align-items: stretch;
			justify-content: flex-start;

			gap: 0.2rem;
			border-radius: 0.6rem;
			overflow: hidden;
			.LayoutProductViewerPriceEditor-row {
				display: flex;
				flex-direction: row;
				align-items: flex-start;
				gap: 1rem;
				background: hsla(0, 0%, 100%, 0.6);
				padding: 1.2rem;

				.LayoutProductViewerPriceEditor-row-title {
					min-width: 5rem;
					min-height: 1rem;
					font-size: 1rem;
					color: black;
					opacity: 0.63;
				}
				.LayoutProductViewerPriceEditor-row-value {
					min-height: 1rem;
					font-size: 1rem;
				}
			}
		}
	}
</style>
