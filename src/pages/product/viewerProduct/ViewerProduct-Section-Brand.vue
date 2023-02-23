<script>
	import Section from "./ViewerProduct-Section.vue";

	export default {
		components: { Section },
		props: {
			primaryColor: { type: Object },
			allowEdit: { type: Boolean, default: false },
			product: { type: Object, default: () => null },
		},
		data() {
			return { brand: null };
		},
		computed: {
			title: (context) => (context.product ? context.product.title : ""),

			brandId: (context) => (context.product ? context.product.brandId : ""),
			brandTitle: (context) => (context.brand ? context.brand.title : ""),
			brandIcon: (context) => (context.brand ? context.brand.icon : null),
			brandIconUrl: (context) =>
				context.brandIcon ? context.brandIcon.toUrl() : "",
		},
		watch: {
			product() {
				this.invalidate();
			},
			brandId() {
				this.invalidate();
			},
		},
		mounted() {
			this.invalidate();
		},
		methods: {
			async invalidate() {
				this.brand = null;
				if (!this.product) return;
				this.brand = await this.product.fetchBrand();
			},
		},
	};
</script>

<template>
	<Section
		v-if="allowEdit"
		title="Brand"
		:primaryColor="primaryColor"
		:menu="{
			title: 'Edit',
			icon: host.icon('edit-000000'),
			click: () =>
				$emit('click-edit', { product, title: title, brandId: brandId }),
		}"
	>
		<div class="SectionBrand">
			<div class="SectionBrand-item" v-if="brand">
				<img
					class="SectionBrand-item-icon"
					v-if="brandIconUrl"
					:src="brandIconUrl"
				/>
				<span class="SectionBrand-item-title" v-if="brandTitle">{{
					brandTitle
				}}</span>
			</div>

			<span class="SectionBrand-noContent" v-else>No Brand</span>
		</div>
	</Section>
</template>

<style lang="scss" scoped>
	.SectionBrand {
		width: 100%;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: flex-start;
		.SectionBrand-item {
			width: 100%;
			padding: 0.8rem;
			gap: 1.4rem;
			background: hsla(0, 0%, 100%, 0.6);

			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: flex-start;

			.SectionBrand-item-icon {
				padding: 0.5rem;
				height: 2rem;
				background: hsla(0, 0%, 100%, 0.5);
				border: 1px solid white;
				border-radius: 0.2rem;
			}
			.SectionBrand-item-title {
				font-size: 1.1rem;
				font-weight: 600;
			}
		}
		.SectionBrand-noContent {
			width: 100%;
			padding: 1.2rem;
			font-style: italic;
			font-size: 0.8rem;
			color: hsla(0, 0%, 0%, 0.6);
			background: hsla(0, 0%, 100%, 0.6);
		}
	}
</style>
