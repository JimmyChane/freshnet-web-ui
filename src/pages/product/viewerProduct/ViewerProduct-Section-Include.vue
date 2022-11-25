<script>
	import Section from "./ViewerProduct-Section.vue";

	export default {
		components: { Section },
		props: {
			primaryColor: { type: Object },
			allowEdit: { type: Boolean, default: false },
			product: { type: Object, default: () => null },
		},
		computed: {
			gifts: (context) => (context.product ? context.product.gifts : []),
			bundles: (context) => (context.product ? context.product.bundles : []),

			items() {
				return [
					...this.gifts
						.filter((gift) => typeof gift === "string")
						.map((gift) => gift.trim())
						.filter((gift) => gift.length),
					...this.bundles
						.filter((bundle) => typeof bundle === "object" && bundle !== null)
						.map((bundle) => bundle.title)
						.filter((bundle) => typeof bundle === "string")
						.map((bundle) => bundle.trim())
						.filter((bundle) => bundle.length),
				];
			},
		},
	};
</script>

<template>
	<Section
		v-if="allowEdit || items.length"
		title="What's Included"
		:primaryColor="primaryColor"
	>
		<div class="SectionInclude">
			<div class="SectionInclude-items" v-if="items.length">
				<div class="SectionInclude-item" v-for="item of items" :key="item">
					<span>{{ item }}</span>
				</div>
			</div>

			<span class="SectionInclude-noContent" v-else>Nothing Included</span>
		</div>
	</Section>
</template>

<style lang="scss" scoped>
	.SectionInclude {
		grid-area: gift;
		width: 100%;
		font-size: 1rem;

		display: flex;
		flex-direction: column;
		align-items: flex-start;

		.SectionInclude-items {
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

			.SectionInclude-item {
				width: 100%;
				padding: 1.2rem;
				background: hsla(0, 0%, 100%, 0.6);
				font-weight: 600;
			}
		}
		.SectionInclude-noContent {
			width: 100%;
			padding: 1.2rem;
			border-radius: 0.6rem;
			font-style: italic;
			font-size: 0.8rem;
			color: hsla(0, 0%, 0%, 0.6);
			background: hsla(0, 0%, 100%, 0.6);
		}
	}
</style>
