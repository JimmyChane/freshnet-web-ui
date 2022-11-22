<script>
	import ImageView from "@/components/ImageView.vue";

	export default {
		emtis: ["callback-click"],
		components: { ImageView },
		props: {
			item: { type: Object, default: null },
		},
		data() {
			return { categoryTitle: "", title: "" };
		},
		computed: {
			thumbnail() {
				const thumbnail = this.item.toImageThumbnail();
				if (thumbnail) return thumbnail.toUrl({ width: 200 });
				return "";
			},
			thumbnail: (context) => context.item.toImageThumbnail(),
		},
		watch: {
			item() {
				this.invalidate();
			},
		},
		mounted() {
			this.invalidate();
		},
		methods: {
			async invalidate() {
				this.categoryTitle = "";
				this.title = "";

				if (!this.item) return;

				this.categoryTitle = await this.item
					.fetchCategory()
					.then((category) => (category ? category.title : ""))
					.catch((error) => "");
				this.title = await this.item.fetchFullTitle().catch((error) => "");
			},
		},
	};
</script>

<template>
	<div class="ItemSearchProduct">
		<div
			class="ItemSearchProduct-image"
			:class="[thumbnail ? '' : 'ItemSearchProduct-image-noImage']"
		>
			<ImageView class="ItemSearchProduct-thumbnail" :src="thumbnail" />
		</div>
		<div class="ItemSearchProduct-body">
			<div class="ItemSearchProduct-labels">
				<span class="ItemSearchProduct-label">Product</span>
				<span class="ItemSearchProduct-label">{{ categoryTitle }}</span>
			</div>
			<span class="ItemSearchProduct-title">{{ title }}</span>
		</div>
	</div>
</template>

<style lang="scss" scoped>
	.ItemSearchProduct {
		width: 100%;
		padding: 10px;
		display: flex;
		flex-direction: row;
		align-items: flex-start;
		justify-content: flex-start;
		gap: 10px;
		border-radius: 8px;
		border-radius: 0.3em;
		font-size: 1.1em;

		.ItemSearchProduct-image {
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
		.ItemSearchProduct-image-noImage {
			background: #ffffff80;
			.ItemSearchProduct-thumbnail {
				display: none;
			}
		}

		.ItemSearchProduct-body {
			min-height: 3.5em;
			display: flex;
			flex-direction: column;
			justify-content: center;
			gap: 0.3em;
			.ItemSearchProduct-labels {
				display: flex;
				flex-direction: row;
				flex-wrap: wrap;
				gap: 0.2em;
				.ItemSearchProduct-label {
					background: #ffffff80;
					font-size: 0.6em;
					padding: 0.4em 0.6em;
					border-radius: 0.3em;
				}
			}
			.ItemSearchProduct-title {
				font-weight: 600;
			}
		}
	}
</style>
