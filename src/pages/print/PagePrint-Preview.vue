<script>
	import Item from "./PagePrint-Item.vue";

	export default {
		components: { Item },
		props: { preview: { type: Object } },
	};
</script>

<template>
	<div class="PagePrint-preview">
		<div class="PagePrint-preview-header">
			<img class="PagePrint-preview-icon" :src="preview.icon" />
			<span class="PagePrint-preview-title">{{ preview.title }}</span>
		</div>

		<div class="PagePrint-items">
			<Item
				class="PagePrint-item"
				v-for="item of preview.layers"
				:key="item.title"
				:item="item"
			/>
		</div>
	</div>
</template>

<style lang="scss" scoped>
	.PagePrint-preview {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-start;

		.PagePrint-preview-header {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			padding: 1rem;
			gap: 0.5rem;

			.PagePrint-preview-icon {
				--size: 3rem;
				width: var(--size);
				height: var(--size);
			}
			.PagePrint-preview-title {
				font-size: 1.2rem;
				font-weight: 500;
			}
		}
		.PagePrint-items {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: flex-start;
			gap: 0.5rem;
		}
	}
</style>
