<script>
	export default {
		props: {
			image: { type: Object, default: null },
			isSelected: { type: Boolean, default: false },
		},
	};
</script>

<template>
	<div
		:class="[
			'LayoutProductViewerImage',
			`LayoutProductViewerImage-${isSelected ? 'isSelected' : 'isDeselected'}`,
		]"
	>
		<button
			class="LayoutProductViewerImage-item"
			@click="() => $emit('click', image)"
		>
			<img
				class="LayoutProductViewerImage-item-img"
				:src="image.toUrl({ height: 80 })"
			/>
		</button>
	</div>
</template>

<style lang="scss" scoped>
	.LayoutProductViewerImage-isDeselected {
		--image-width: 5rem;
		--image-height: 3rem;
		@media (max-width: 480px) {
			--image-width: calc(3.8rem * 1.3);
			--image-height: calc(2.2rem * 1.3);
		}

		.LayoutProductViewerImage-item {
			background: hsla(0, 0%, 100%, 0.6);
			cursor: pointer;
			&:hover {
				background: hsla(0, 0%, 100%, 0.8);
			}
		}
	}
	.LayoutProductViewerImage-isSelected {
		--image-width: calc(5rem * 1.3);
		--image-height: calc(3rem * 1.3);

		@media (max-width: 480px) {
			--image-width: calc(3.8rem * 1.3);
			--image-height: calc(2.2rem * 1.3);
		}

		.LayoutProductViewerImage-item {
			background: hsla(0, 0%, 100%, 0.8);
		}
	}
	.LayoutProductViewerImage {
		--box-padding: 0.18rem;

		--width: calc(var(--image-width) + var(--box-padding) + var(--box-padding));
		--height: calc(
			var(--image-height) + var(--box-padding) + var(--box-padding)
		);

		width: var(--width);
		height: var(--height);
		min-width: var(--width);
		min-height: var(--height);

		overflow: hidden;
		transition: var(--animation-duration);

		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;

		.LayoutProductViewerImage-item {
			width: var(--image-width);
			height: var(--image-height);
			min-width: var(--image-width);
			min-height: var(--image-height);

			border: none;
			border-radius: 0.4rem;

			transition: var(--animation-duration);

			display: flex;
			justify-content: center;
			align-items: center;

			.LayoutProductViewerImage-item-img {
				height: var(--image-height);
				width: var(--image-width);
				border-radius: 0.4rem;
				object-fit: contain;
				transition: var(--animation-duration);
			}
		}
	}
</style>
