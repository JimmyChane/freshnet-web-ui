<script>
	import Bottomsheet from "@/components/window/BottomsheetWindow.vue";
	import Actionbar from "@/components/navigation/actionbar2/Actionbar.vue";
	import ImageView from "@/components/ImageView.vue";

	export default {
		components: { Bottomsheet, Actionbar, ImageView },
		data() {
			return {
				isZoomedIn: false,
			};
		},
		computed: {
			isShowing() {
				return this.$root.imageViewer.isShowing;
			},
			image() {
				return this.$root.imageViewer.image;
			},
			thumbnails() {
				return this.$root.imageViewer.thumbnails;
			},
		},
		methods: {
			clickDismiss() {
				this.$root.imageViewerHide();
			},
		},
	};
</script>

<template>
	<Bottomsheet
		class="ImageViewer"
		:isShowing="isShowing"
		@click-dismiss="() => clickDismiss()"
		:style="{
			'--thumbnails-height': thumbnails.length > 1 ? '5rem' : '0',
		}"
	>
		<div class="ImageViewer-body">
			<Actionbar
				class="ImageViewer-actionbar"
				:leftMenus="{
					icon: host.res('icon/close-000000.svg'),
					click: () => clickDismiss(),
				}"
			/>
			<div
				class="ImageViewer-main"
				:style="{
					height:
						thumbnails.length > 1
							? 'calc(100% - var(--thumbnails-height))'
							: '100%',
				}"
			>
				<ImageView
					class="ImageViewer-image"
					v-if="image"
					:src="image.toUrl()"
					:style="{
						transform: isZoomedIn ? 'scale(2)' : 'scale(1)',
						cursor: isZoomedIn ? 'zoom-out' : 'zoom-in',
						'background-color': 'white',
					}"
					@click="
						() => {
							isZoomedIn = !isZoomedIn;
						}
					"
				/>
			</div>
			<div class="ImageView-footer" v-if="thumbnails.length > 1">
				<div class="ImageView-images">
					<button
						:class="[
							'ImageView-images-item-button',
							thumbnail === image
								? 'ImageView-images-item-button-isSelected'
								: 'ImageView-images-item-button-isDeselected',
						]"
						v-for="thumbnail of thumbnails"
						:key="thumbnail.toUrl()"
						@click="
							() => {
								$root.imageViewer.image = thumbnail;
							}
						"
					>
						<ImageView class="ImageView-images-item" :src="thumbnail" />
					</button>
				</div>
			</div>
		</div>
	</Bottomsheet>
</template>

<style lang="scss" scoped>
	.ImageViewer {
		--default-size-top: 0;
		--default-size-right: 0;
		--default-size-bottom: 0;
		--default-size-left: 0;

		--actionbar-height: 5rem;
		--thumbnails-height: 5rem;
		--thumbnail-height: 4.2rem;

		.ImageViewer-body {
			width: 100%;
			height: 100%;
			display: flex;
			flex-direction: column;
			overflow: hidden;
			background-color: hsla(0, 0%, 100%, 0.9);
			.ImageViewer-actionbar {
				z-index: 3;
				background: none;
				color: black;
				height: var(--actionbar-height);
				position: absolute;
			}
			.ImageViewer-main {
				z-index: 2;
				width: 100vw;
				height: calc(100vh - var(--thumbnails-height));
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				padding: 1rem;
				.ImageViewer-image {
					z-index: 2;
					width: 100%;
					height: 100%;
					max-width: max-content;
					max-height: max-content;
					object-fit: contain;
					transition: all 100ms;
				}
			}
			.ImageView-footer {
				z-index: 1;
				height: var(--thumbnails-height);
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: center;

				.ImageView-images {
					width: max-content;
					max-width: 100%;
					height: var(--thumbnails-height);
					overflow-y: auto;
					display: flex;
					flex-direction: row;
					align-items: center;
					align-items: flex-start;
					justify-content: flex-start;
					gap: 0.5rem;

					--scrollbar-size: 0;
					--scrollbar-thumb-radius: 0;
					--scrollbar-track-margin: 0;

					--scrollbar-thumb-color: 0;
					--scrollbar-thumb-color-hover: 0;
					--scrollbar-track-color: 0;
					--scrollbar-track-color-hover: 0;

					scrollbar-width: var(--scrollbar-size);
					scrollbar-color: var(--scrollbar-thumb-color) var(--scrollbar-track-color);
					&::-webkit-scrollbar {
						height: var(--scrollbar-size);
						width: var(--scrollbar-size);
						&-thumb {
							border-radius: var(--scrollbar-thumb-radius);
							background-color: var(--scrollbar-thumb-color);
							&:hover {
								background-color: var(--scrollbar-thumb-color-hover);
							}
						}
						&-track {
							margin: var(--scrollbar-track-margin);
							background-color: var(--scrollbar-track-color);
							&:hover {
								background-color: var(--scrollbar-track-color-hover);
							}
						}
					}

					.ImageView-images-item-button {
						height: var(--thumbnail-height);
						background: none;
						border: none;
						display: flex;
						align-items: center;
						justify-content: center;
						border-radius: 0.2rem;
						overflow: hidden;
						transition: var(--animation-duration);
						padding: 0.2rem;
						.ImageView-images-item {
							height: 100%;
							width: 100%;
							object-fit: contain;
						}
					}
					.ImageView-images-item-button-isSelected {
						background-color: var(--accent-color);
					}
					.ImageView-images-item-button-isDeselected {
						cursor: pointer;
						&:hover {
							background-color: hsla(0, 0%, 0%, 0.1);
						}
					}
				}
			}
		}
	}
</style>
