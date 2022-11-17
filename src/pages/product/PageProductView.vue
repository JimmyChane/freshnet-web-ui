<script>
	import LayoutProductViewer from "@/pages/product/LayoutProductViewer/LayoutProductViewer.vue";
	import LoadingDots from "@/components/LoadingDots.vue";

	export default {
		components: { LayoutProductViewer, LoadingDots },
		data() {
			return { product: null };
		},
		computed: {
			isLoading: (context) => context.productStore.getters.isLoading,
			isOver1200px: (context) => context.$root.window.innerWidth > 1200,
			productId: (context) => context.$route.query.productId,
		},
		watch: {
			productId() {
				this.invalidate();
			},
		},
		mounted() {
			this.$root.setAppLayout(this.$root.APP_LAYOUT_MODE.FULL);
			this.$root.setNavigationDrawerVisibiliy(
				this.$root.DRAWER_VISIBILITY.NONE,
			);

			this.invalidate();
		},
		methods: {
			async invalidate() {
				const products = await this.productStore.dispatch("getItems");
				this.product = products.find((product) => {
					return product.id === this.productId;
				});

				if (!this.product) return;

				document.title = await this.product.fetchFullTitle();
			},
		},
	};
</script>

<template>
	<div class="PageProductView">
		<LayoutProductViewer
			:product="product"
			:isWide="isOver1200px"
			:isEditable="false"
		/>

		<LoadingDots class="PageProductView-loading" v-if="isLoading" />
	</div>
</template>

<style lang="scss" scoped>
	.PageProductView {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-start;

		.PageProductView-loading {
			z-index: 2;
		}
	}
</style>
