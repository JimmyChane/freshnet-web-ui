<script>
	import ImageView from "@/components/ImageView.vue";
	export default {
		components: { ImageView },
		props: {
			images: { type: Array, default: () => [] },
			width: { type: Number, default: () => 0 },
			height: { type: Number, default: () => 0 },
		},
		data() {
			return {
				listImage: [],

				gridTemplateAreas: "",

				gridArea: ["", "", "", ""],
				borderRadius: ["", "", "", ""],
			};
		},
		watch: {
			images() {
				this.invalidate();
			},
		},
		mounted() {
			this.invalidate();
		},
		methods: {
			invalidate() {
				const maxIndex = 4;
				this.listImage = this.images
					.filter((image, index) => index <= maxIndex)
					.map((image) => image);

				const radius = "var(--default-border-radius)";
				// const radius = "inherit";

				if (this.listImage.length === 1) {
					this.gridTemplateAreas = '"item0"';
					this.borderRadius = [radius];
					return;
				}

				if (this.listImage.length === 2) {
					this.gridTemplateAreas = '"item0 item1"';
					this.borderRadius = [`${radius} ${radius} 0 0`, `0 0 ${radius} ${radius}`];
					return;
				}

				if (this.listImage.length === 3) {
					this.gridTemplateAreas = '"item0 item0" "item1 item2"';
					this.borderRadius = [
						`${radius} ${radius} 0 0`,
						`0 0 0 ${radius}`,
						`0 0 ${radius} 0`,
					];
					return;
				}

				if (this.listImage.length === 4) {
					this.gridTemplateAreas = '"item0 item1" "item2 item3"';
					this.borderRadius = [
						`${radius} 0 0 0`,
						`0 ${radius} 0 0`,
						`0 0 0 ${radius}`,
						`0 0 ${radius} 0`,
					];
					return;
				}

				this.gridTemplateAreas = "";
				this.borderRadius = this.listImage.map(() => "");
			},
			indexOf(image) {
				let index = this.listImage.indexOf(image);

				if (index >= this.listImage.length - 1) {
					index = this.listImage.length - 1;
				}

				return index;
			},
		},
	};
</script>

<template>
	<div class="ImageLayout">
		<div class="ImageLayout-body" :style="{ 'grid-template-areas': gridTemplateAreas }">
			<ImageView
				class="ImageLayout-item"
				:class="`ImageLayout-item${indexOf(image)}`"
				:style="{
					'grid-area': `item${indexOf(image)}`,
					'border-radius': borderRadius[indexOf(image)],
				}"
				v-for="image in listImage"
				:key="image.toUrl()"
				:src="image.toUrl({ width, height })"
			/>
		</div>
	</div>
</template>

<style lang="scss" scoped>
	.ImageLayout {
		--default-border-radius: 0.5rem;
		--default-gap: 0.2rem;

		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-start;
		row-gap: 0.5rem;

		width: 100%;
		height: 100%;
		display: grid;
		flex-direction: column;
		align-items: stretch;
		justify-content: stretch;
		gap: var(--default-gap);
		border-radius: inherit;
		.ImageLayout-body {
			width: 100%;
			height: 100%;
			display: grid;
			flex-direction: column;
			align-items: stretch;
			justify-content: stretch;
			gap: var(--default-gap);
			border-radius: inherit;

			.ImageLayout-item {
				flex-grow: 1;
				width: 100%;
				height: 100%;
				min-width: 100%;
				min-height: 100%;
				max-width: 100%;
				max-height: 100%;
				display: flex;
				align-items: stretch;
				justify-content: stretch;
				object-fit: cover;
				transition: var(--animation-duration);
			}
		}
	}
</style>
