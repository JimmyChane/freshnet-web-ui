<script>
	import ImageView from "@/components/ImageView.vue";

	export default {
		components: { ImageView },
		props: { item: { type: Object, default: null } },
		computed: {
			thumbnail: (c) => c.host.cloudinary({ url: `ps2/disc/${c.code}.jpg` }),
			title: (c) => (c.item ? c.item.title : ""),
			code: (c) => (c.item ? c.item.code : ""),
		},
	};
</script>

<template>
	<div class="ItemSearchPs2Disc">
		<div
			class="ItemSearchPs2Disc-image"
			:class="[thumbnail ? '' : 'ItemSearchPs2Disc-image-noImage']"
		>
			<ImageView class="ItemSearchProduct-thumbnail" :src="thumbnail" />
		</div>
		<div class="ItemSearchPs2Disc-body">
			<div class="ItemSearchPs2Disc-labels">
				<span class="ItemSearchPs2Disc-label">Product</span>
				<span class="ItemSearchPs2Disc-label">PS2</span>
				<span class="ItemSearchPs2Disc-label">Disc</span>
			</div>
			<span class="ItemSearchPs2Disc-title">{{ title }}</span>
			<span class="ItemSearchPs2Disc-subTitle">{{ code }}</span>
		</div>
	</div>
</template>

<style lang="scss" scoped>
	.ItemSearchPs2Disc {
		width: 100%;
		display: flex;
		flex-direction: row;
		align-items: flex-start;
		justify-content: flex-start;
		gap: 1em;
		padding: 0.5em;
		color: black;
		border-radius: 0.3em;
		font-size: 1.1em;

		.ItemSearchPs2Disc-image {
			width: 3.5em;
			height: 3.5em;
			border-radius: 0.2em;
			.ItemSearchProduct-thumbnail {
				width: 3.5em;
				height: 3.5em;
				border-radius: 0.2em;
				object-fit: contain;
			}
		}
		.ItemSearchPs2Disc-image-noImage {
			background: #ffffff80;
			.ItemSearchProduct-thumbnail {
				display: none;
			}
		}

		.ItemSearchPs2Disc-body {
			min-height: 3.5em;
			display: flex;
			flex-direction: column;
			justify-content: center;
			gap: 0.3em;
			.ItemSearchPs2Disc-labels {
				display: flex;
				flex-direction: row;
				flex-wrap: wrap;
				gap: 0.2em;
				.ItemSearchPs2Disc-label {
					background: #ffffff80;
					font-size: 0.6em;
					padding: 0.4em 0.6em;
					border-radius: 0.3em;
				}
			}
			.ItemSearchPs2Disc-title {
				font-weight: 600;
			}
			.ItemSearchPs2Disc-subTitle {
				font-size: 0.8em;
				font-weight: 400;
				color: #808080;
			}
		}
	}
</style>
