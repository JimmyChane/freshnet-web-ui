<script>
	import ButtonIcon from "@/components/button/ButtonIcon.vue";
	import chroma from "chroma-js"; // https://gka.github.io/chroma.js/

	export default {
		components: { ButtonIcon },
		props: {
			title: { type: String, default: "" },
			menu: { type: Object, default: () => null },
			primaryColor: { type: String, default: "" },
		},
		computed: {
			titleColor() {
				if (!chroma.valid(this.primaryColor)) return "#4E504D";
				return chroma(this.primaryColor).mix("000000", 0.9).toString();
			},
		},
	};
</script>

<template>
	<div class="LayoutProductViewerSection">
		<div class="LayoutProductViewerSection-header" v-if="title || menu">
			<span
				class="LayoutProductViewerSection-title"
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
	.LayoutProductViewerSection {
		width: 100%;
		display: flex;
		flex-direction: column;

		.LayoutProductViewerSection-header {
			width: 100%;
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: space-between;
			gap: 0.5rem;

			.LayoutProductViewerSection-title {
				font-weight: 900;
				font-size: 1rem;
				padding: 0.8rem 0;
			}
		}
	}
</style>
