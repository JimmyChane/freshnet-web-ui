<script>
	import ProductViewerPriceEditor from "./ViewerProduct-PriceEditor.vue";
	import ProductViewerPriceViewer from "./ViewerProduct-PriceViewer.vue";

	export default {
		components: { ProductViewerPriceEditor, ProductViewerPriceViewer },
		props: {
			primaryColor: { type: Object },
			allowEdit: { type: Boolean, default: false },
			product: { type: Object, default: () => null },
		},
	};
</script>

<template>
	<ProductViewerPriceEditor
		v-if="allowEdit"
		:product="product"
		:primaryColor="primaryColor"
		@click-product-priceUpdate="(x) => $emit('click-edit', x)"
	/>
	<ProductViewerPriceViewer
		v-else
		:product="product"
		:primaryColor="primaryColor"
	/>
</template>
