<script>
	import ButtonIcon from "@/components/button/ButtonIcon.vue";
	import chroma from "chroma-js"; // https://gka.github.io/chroma.js/

	export default {
		components: { ButtonIcon },
		props: {
			title: { type: String, default: "" },
			menu: { type: Object, default: () => null },
			primaryColor: { type: chroma, default: () => null },
		},
		computed: {
			titleColor() {
				if (!this.primaryColor) return "#4E504D";
				return this.primaryColor.mix("000000", 0.9).toString();
			},
		},
	};
</script>

<template>
	<div class="ProductViewerSection">
		<div class="ProductViewerSection-header" v-if="title || menu">
			<span
				class="ProductViewerSection-title"
				v-if="title"
				:style="{ color: titleColor }"
				>{{ title }}</span
			>
			<ButtonIcon v-if="menu" :src="menu.icon" @click="() => menu.click()" />
		</div>
		<slot />
	</div>
</template>

<style lang="scss" scoped>
	.ProductViewerSection {
		width: 100%;
		display: flex;
		flex-direction: column;

		.ProductViewerSection-header {
			width: 100%;
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: space-between;
			gap: 0.5rem;
			padding: 0 1.2rem;

			.ProductViewerSection-title {
				font-weight: 600;
				font-size: 1rem;
				padding: 0.8rem 0;
			}
		}
	}
</style>
