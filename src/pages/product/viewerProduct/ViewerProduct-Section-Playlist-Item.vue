<script>
	export default {
		emits: ["click"],
		props: {
			item: { type: Object, default: () => null },
		},
		computed: {
			itemTitle: (c) => (c.item ? c.item.title : ""),
			itemThumbnail: (c) => (c.item ? c.item.toImageThumbnail() : null),
			itemThumbnailUrl: (c) =>
				c.itemThumbnail ? c.itemThumbnail.toUrl({ width: 100 }) : "",
		},
	};
</script>

<template>
	<div class="ItemProductSuggest2">
		<span class="ItemProductSuggest2-title">{{ itemTitle }}</span>
		<img
			class="ItemProductSuggest2-thumbnail"
			v-if="itemThumbnailUrl"
			:src="itemThumbnailUrl"
		/>
	</div>
</template>

<style lang="scss" scoped>
	.ItemProductSuggest2 {
		width: 100%;
		height: 6rem;
		min-height: 6rem;
		border-radius: 0.5rem;
		border: none;
		background: hsla(0, 0%, 100%, 0.6);
		transition: var(--transition-duration);

		cursor: pointer;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;

		&:hover {
			background: hsla(0, 0%, 100%, 0.8);
		}

		.ItemProductSuggest2-thumbnail {
			height: 6rem;
			aspect-ratio: 16/10;
			overflow: hidden;
			background-color: white;
			align-items: center;
			justify-content: center;
			object-fit: cover;
		}

		.ItemProductSuggest2-title {
			width: fit-content;
			padding: 0 2rem;
			line-height: 1rem;
			font-weight: 600;
			font-size: 1rem;
			flex-grow: 1;
		}
	}
</style>
