<script>
	import LayoutProductViewerImage from "./LayoutProductViewer_Image.vue";
	import LayoutProductViewerImageSelector from "./LayoutProductViewer_ImageSelector.vue";

	export default {
		components: { LayoutProductViewerImage, LayoutProductViewerImageSelector },
		emits: ["click-image", "click-add-image-file"],
		props: {
			indexAt: { type: Number, default: -1 },
			images: { type: Array, default: () => [] },
			isEditable: { type: Boolean, default: false },
		},
	};
</script>

<template>
	<div class="LayoutProductViewerImages">
		<div class="LayoutProductViewerImages-list">
			<LayoutProductViewerImage
				v-for="image of images"
				:image="image"
				:key="image.toUrl()"
				:isSelected="images.indexOf(image) === indexAt"
				@click="() => $emit('click-image', image)"
			/>
			<LayoutProductViewerImageSelector
				v-if="isEditable"
				@click-file="(file) => $emit('click-add-image-file', file)"
			/>
		</div>
	</div>
</template>

<style lang="scss" scoped>
	.LayoutProductViewerImages {
		width: 100%;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;

		overflow-x: auto;
		overflow-y: hidden;
		padding-left: 1.75rem;
		padding-right: 1.75rem;
		padding-bottom: 0.3rem;

		--scrollbar-size: 0.3rem;
		--scrollbar-thumb-radius: 0.2rem;
		--scrollbar-thumb-color: hsla(0, 0%, 0%, 0.4);
		--scrollbar-thumb-color-hover: hsla(0, 0%, 0%, 0.6);
		--scrollbar-track-margin: 1.9rem;
		--scrollbar-track-color: none;
		--scrollbar-track-color-hover: none;

		scrollbar-width: var(--scrollbar-size);
		scrollbar-color: var(--scrollbar-thumb-color) var(--scrollbar-track-color);
		&::-webkit-scrollbar {
			height: var(--scrollbar-size);
			width: var(--scrollbar-size);
		}
		&::-webkit-scrollbar-thumb {
			border-radius: var(--scrollbar-thumb-radius);
			background-color: var(--scrollbar-thumb-color);
			&:hover {
				background-color: var(--scrollbar-thumb-color-hover);
			}
		}
		&::-webkit-scrollbar-track {
			margin: var(--scrollbar-track-margin);
			background-color: var(--scrollbar-track-color);
			&:hover {
				background-color: var(--scrollbar-track-color-hover);
			}
		}

		.LayoutProductViewerImages-list {
			max-width: 100%;
			height: calc(3.5rem * 1.3);
			min-height: calc(3.5rem * 1.3);

			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: flex-start;
		}
	}
</style>
