<script>
	import PopupWindow from "@/components/window/PopupWindow.vue";
	import Actionbar from "@/components/actionbar/Actionbar.vue";
	import ImageView from "@/components/ImageView.vue";

	export default {
		components: { PopupWindow, Actionbar, ImageView },
		emits: ["click-close"],
		props: {
			isShowing: { type: Boolean, default: false },
			imageFiles: { type: Array, default: () => [] },
			index: { type: Number, default: 0 },
		},
		data() {
			return { imageRotation: "", indexNow: -1, imageUrl: "" };
		},
		computed: {
			image() {
				if (this.indexNow === -1) return null;

				if (this.imageFiles.length > this.indexNow)
					return this.imageFiles[this.indexNow];

				return null;
			},
		},
		watch: {
			index() {
				this.indexNow = this.index;
			},
			indexNow() {
				this.imageUrl = !this.image ? "" : this.image.toUrl();
			},
		},
		methods: {
			clickClose() {
				this.$emit("click-close");
			},
			clickImage(image) {
				if (this.isThumbnailNow(image)) return;

				this.imageUrl = "";
				setTimeout(() => {
					this.indexNow = this.thumbnailIndex(image);
				}, 200);
			},

			thumbnailIndex(image) {
				return this.imageFiles.indexOf(image);
			},
			thumbnailUrl: (image) => image.toUrl({ height: 160 }),
			isThumbnailNow(image) {
				return this.thumbnailIndex(image) === this.indexNow;
			},
		},
		mounted() {
			this.indexNow = this.index;
		},
	};
</script>

<template>
	<div class="WindowViewImage">
		<Actionbar
			class="WindowViewImage-actionbar"
			:leftMenus="[
				{
					title: 'Close',
					icon: host.res('icon/close-2A4858.svg'),
					click: () => clickClose(),
				},
			]"
		/>

		<div class="WindowViewImage-placeholder">
			<PopupWindow
				class="WindowViewImage-popup"
				:isShowing="isShowing"
				@click-dismiss="() => clickClose()"
			>
				<div class="WindowViewImage-body">
					<ImageView class="WindowViewImage-image" v-if="imageUrl" :src="imageUrl" />
				</div>
			</PopupWindow>
		</div>

		<div class="WindowViewImage-thumbnails">
			<button
				:class="[
					'WindowViewImage-thumbnail-button',
					`WindowViewImage-thumbnail-button-${
						isThumbnailNow(imageFile) ? 'isSelected' : 'isDeselected'
					}`,
				]"
				v-for="imageFile of imageFiles"
				:key="imageFile.name"
				@click="() => clickImage(imageFile)"
			>
				<ImageView class="WindowViewImage-thumbnail" :src="imageFile" />
			</button>
		</div>
	</div>
</template>

<style lang="scss" scoped>
	.WindowViewImage {
		width: 100%;
		height: 100%;
		position: absolute;
		display: flex;
		flex-direction: column;
		align-items: center;

		.WindowViewImage-actionbar {
			flex-grow: 0;
			height: 3.5rem;
		}
		.WindowViewImage-placeholder {
			flex-grow: 1;
			width: 100%;
			height: 100%;
			position: relative;

			.WindowViewImage-popup {
				z-index: 4;
				position: absolute;

				.WindowViewImage-body {
					width: fit-content;
					height: 100%;
					max-width: 100%;
					max-height: fit-content;
					display: flex;
					flex-direction: column;
					align-items: stretch;
					overflow: hidden;

					.WindowViewImage-image {
						width: 100%;
						height: 100%;
						object-fit: scale-down;
					}
				}
			}
		}
		.WindowViewImage-thumbnails {
			width: 100%;
			height: 8em;
			gap: 0.5rem;
			padding: 0.5rem;

			overflow-x: auto;
			background: hsla(0, 0%, 100%, 0.9);
			flex-grow: 0;

			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: flex-start;

			.WindowViewImage-thumbnail-button {
				height: 100%;
				border-radius: 0.3rem;
				background: none;
				border: none;
				transition: var(--transition-duration);
				padding: 0.3rem;

				.WindowViewImage-thumbnail {
					height: 100%;
					border-radius: 0.2rem;
					object-fit: contain;
				}
			}
			.WindowViewImage-thumbnail-button-isDeselected {
				cursor: pointer;
				&:hover {
					background: var(--accent-color);
					opacity: 0.5;
				}
			}
			.WindowViewImage-thumbnail-button-isSelected {
				background: var(--accent-color);
			}
		}
	}
</style>
