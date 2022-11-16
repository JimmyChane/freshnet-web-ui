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
	<button class="ItemProductSuggest2" @click="$emit('click', item)">
		<!-- <div class="ItemProductSuggest2-thumbnail" v-if="itemThumbnailUrl"> </div> -->
		<img
			class="ItemProductSuggest2-thumbnail-img"
			v-if="itemThumbnailUrl"
			:src="itemThumbnailUrl"
		/>

		<div class="ItemProductSuggest2-header">
			<span class="ItemProductSuggest2-title">{{ itemTitle }}</span>
		</div>
	</button>
</template>

<style lang="scss" scoped>
	.ItemProductSuggest2 {
		width: 100%;
		min-height: 4rem;
		border-radius: 0.5rem;
		border: none;
		background: hsla(0, 0%, 100%, 0.6);
		cursor: pointer;
		transition: var(--animation-duration);

		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;

		&:hover {
			background: hsla(0, 0%, 100%, 0.8);
		}

		.ItemProductSuggest2-thumbnail {
			height: 4rem;
			aspect-ratio: 16/10;
			overflow: hidden;
			background-color: white;
			align-items: center;
			justify-content: center;
			object-fit: cover;
		}

		.ItemProductSuggest2-header {
			padding: 0 2rem;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			.ItemProductSuggest2-hint {
				width: fit-content;
			}
			.ItemProductSuggest2-title {
				width: fit-content;
				line-height: 1rem;
				font-weight: 600;
				font-size: 1rem;
			}
		}
	}
</style>
