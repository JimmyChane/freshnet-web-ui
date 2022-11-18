<script>
	import ItemDevice from "@/pages/customer/ItemDevice.vue";
	export default {
		components: { ItemDevice },
		emits: ["click-remove", "click-previous", "click-next"],
		props: {
			image: { type: Object, default: () => null },

			hasImagePrevious: { type: Boolean, default: false },
			hasImageNext: { type: Boolean, default: false },

			hasProductPrevious: { type: Boolean, default: false },
			hasProductNext: { type: Boolean, default: false },

			isEditable: { type: Boolean, default: false },
		},
		data() {
			return {
				imageStyle: { scale: "1", x: "0%", y: "0%" },
				imageUrl: "",
				imageIsFetching: false,
			};
		},
		computed: {
			isThin: (c) => c.$root.window.innerWidth < 550,
			imageIsShowing() {
				if (this.imageIsFetching) return true;
				return !!this.imageUrl;
			},
		},
		watch: {
			image() {
				this.onImage();
			},
		},
		methods: {
			onImage() {
				this.imageUrl = "";
				if (this.image) {
					this.imageUrl = this.image.toUrl({
						height: this.isThin ? 350 : 1200,
					});
					// this.imageIsFetching = true;
					// setTimeout(() => {
					// 	this.imageIsFetching = false;
					// 	this.imageUrl = this.image.toUrl({
					// 		height: this.isThin ? 350 : 1200,
					// 	});
					// }, 200);
				}
			},
			onImageMouseEnter(event) {
				this.imageStyle.scale = "1.5";
			},
			onImageMouseMove(event) {
				const { offsetWidth, offsetHeight } = event.target;
				const { offsetX, offsetY } = event;
				const centerX = offsetWidth / 2,
					centerY = offsetHeight / 2;

				const percentX = centerX - offsetX;
				const percentY = centerY - offsetY;

				console.log({ percentX, percentY });

				this.imageStyle.x = `${percentX}%`;
				this.imageStyle.y = `${percentY}%`;
			},
			onImageMouseLeave(event) {
				this.imageStyle.scale = "1";
				this.imageStyle.x = "0%";
				this.imageStyle.y = "0%";
			},
		},
		mounted() {
			this.onImage();
		},
	};
</script>

<template>
	<div
		:class="[
			'LayoutProductViewerImagePreview',
			`LayoutProductViewerImagePreview-${
				imageIsShowing ? 'isShown' : 'isHidden'
			}`,
		]"
	>
		<img
			:class="[
				'LayoutProductViewerImagePreview-preview',
				`LayoutProductViewerImagePreview-preview-${
					imageUrl ? 'isShown' : 'isHidden'
				}`,
			]"
			:src="imageUrl"
		/>

		<button
			:class="[
				'LayoutProductViewerImagePreview-arrowParent',
				`LayoutProductViewerImagePreview-arrowParent-${
					hasImagePrevious || hasProductPrevious ? 'isShown' : 'isHidden'
				}`,
				'LayoutProductViewerImagePreview-toLeft',
			]"
			@click="(event) => $emit('click-previous')"
		>
			<img
				class="LayoutProductViewerImagePreview-arrow"
				:src="host.res('icon/arrowDown-black.svg')"
			/>
		</button>

		<button
			:class="[
				'LayoutProductViewerImagePreview-arrowParent',
				`LayoutProductViewerImagePreview-arrowParent-${
					hasImageNext || hasProductNext ? 'isShown' : 'isHidden'
				}`,
				'LayoutProductViewerImagePreview-toRight',
			]"
			@click="(event) => $emit('click-next')"
		>
			<img
				class="LayoutProductViewerImagePreview-arrow"
				:src="host.res('icon/arrowDown-black.svg')"
			/>
		</button>

		<div
			:class="[
				'LayoutProductViewerImagePreview-tool',
				`LayoutProductViewerImagePreview-tool-${
					isEditable && image ? 'isShown' : 'isHidden'
				}`,
			]"
		>
			<div class="LayoutProductViewerImagePreview-tool-body">
				<button @click="$emit('click-remove', image)">
					<img :src="host.res('icon/trash-505050.svg')" />
				</button>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
	.LayoutProductViewerImagePreview {
		width: 100%;
		max-height: 55vh;
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;

		.LayoutProductViewerImagePreview-tool {
			z-index: 3;
			width: calc(100%);
			height: fit-content;
			padding: 1rem;
			position: absolute;
			top: 0;
			left: 0;
			right: 0;

			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			transition: var(--animation-duration);

			.LayoutProductViewerImagePreview-tool-body {
				display: flex;
				flex-direction: row;
				background: red;
				// padding: 0.2rem 1.2rem;
				background-color: hsla(0, 0%, 100%, 0.6);
				border: 0.1rem solid hsla(0, 0%, 0%, 0.2);
				box-shadow: 0 0 0.5rem hsla(0, 0%, 0%, 0.2);
				border-radius: 0.5rem;

				button {
					width: 2.5rem;
					height: 2.5rem;
					background: none;
					border: none;
					display: flex;
					align-items: center;
					justify-content: center;
					border-radius: 50%;
					border-radius: 0.5rem;
					transition: var(--animation-duration);
					cursor: pointer;
					&:hover {
						background: hsla(0, 0%, 0%, 0.2);
					}
					img {
						width: 1rem;
						height: 1rem;
					}
				}
			}
		}
		.LayoutProductViewerImagePreview-tool-isHidden {
			top: -150%;
			opacity: 0;
			pointer-events: none;
		}

		.LayoutProductViewerImagePreview-arrowParent {
			z-index: 2;

			width: 4rem;
			height: 100%;

			position: absolute;
			top: 0;
			bottom: 0;
			transition: var(--animation-duration);
			background: none;
			border: none;
			cursor: pointer;

			display: flex;
			align-items: center;
			justify-content: center;

			.LayoutProductViewerImagePreview-arrow {
				width: 1.8rem;
				height: 1.8rem;
				opacity: 0.66;
				transition: var(--animation-duration);
				pointer-events: none;
			}
		}
		.LayoutProductViewerImagePreview-arrowParent-isHidden {
			opacity: 0;
			pointer-events: none;
		}

		.LayoutProductViewerImagePreview-toLeft {
			left: 0;

			.LayoutProductViewerImagePreview-arrow {
				transform: rotate(90deg);
			}

			&:hover {
				img {
					transform: rotate(90deg) scale(1.3);
				}
			}
		}
		.LayoutProductViewerImagePreview-toRight {
			right: 0;

			.LayoutProductViewerImagePreview-arrow {
				transform: rotate(-90deg);
			}

			&:hover {
				img {
					transform: rotate(-90deg) scale(1.3);
				}
			}
		}

		.LayoutProductViewerImagePreview-preview {
			z-index: 1;
			object-fit: contain;

			width: 100%;
			height: inherit;
			max-height: 55vh;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			aspect-ratio: 16/10;
		}
	}
	.LayoutProductViewerImagePreview-isShown {
		.LayoutProductViewerImagePreview-preview {
			opacity: 1;
		}
	}
	.LayoutProductViewerImagePreview-isHidden {
		height: 6rem;
		.LayoutProductViewerImagePreview-preview {
			pointer-events: none;
			height: inherit;
			opacity: 0;
		}
	}
</style>
