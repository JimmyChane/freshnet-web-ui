<script>
	const Mode = { List: 1, Grid: 2 };

	import User from "@/items/User.js";
	import Setting from "@/items/data/Setting.js";
	import ProductPrice from "@/items/ProductPrice.js";
	import ProductPreset from "@/items/tools/ProductPreset";

	import ImageView from "@/components/ImageView.vue";
	import chroma from "chroma-js"; // https://gka.github.io/chroma.js/

	export default {
		Mode,

		emits: ["click"],
		components: { ImageView },
		data() {
			return { primaryColorHex: "", fullTitle: "" };
		},
		props: {
			mode: { type: Number, default: Mode.Grid },
			item: { type: Object, default: () => null },
			isSelected: { type: Boolean, default: false },
		},
		computed: {
			isList: (c) => c.mode === Mode.List,
			isGrid: (c) => c.mode === Mode.Grid,

			primaryColor() {
				return chroma.valid(this.primaryColorHex)
					? chroma(this.primaryColorHex)
					: chroma("cccccc");
			},

			user: (c) => c.loginStore.getters.user,
			allowEdit: (c) => c.user.isTypeAdmin() || c.user.isTypeStaff(),

			shouldShowPrice: (c) => {
				let setting = c.settingStore.getters.items.find((setting) => {
					return setting.key === Setting.Key.PublicShowPrice;
				});
				return setting ? setting.value : false;
			},

			preview: (c) => (c.item ? c.item.toImageThumbnail() : null),
			productBrandId: (c) => (c.item ? c.item.brandId : ""),
			isAvailable: (c) => (c.item ? c.item.isStockAvailable() : false),

			productPrice: (c) => {
				if (!c.allowEdit && !c.shouldShowPrice) return null;
				return c.item.price;
			},
			productPriceNormal: (c) => {
				return c.productPrice && c.productPrice.normal
					? c.productPrice.normal
					: new ProductPrice();
			},
			productPricePromotion: (c) => {
				return c.productPrice && c.productPrice.promotion
					? c.productPrice.promotion
					: new ProductPrice();
			},
			price: (c) => {
				if (!c.allowEdit && !c.shouldShowPrice) return null;

				let normal = c.productPriceNormal;
				let promotion = c.productPricePromotion;

				if (normal.value > 0 && promotion.value <= 0) return { to: normal };
				if (normal.value > 0 && promotion.value > 0)
					return { from: normal, to: promotion };
				if (normal.value <= 0 && promotion.value > 0)
					return { from: normal, to: promotion };
				return null;
			},
			specLabels: (c) => ProductPreset.generateSpecificationLabels(c.item),
		},
		watch: {
			preview() {
				this.invalidatePreview();
			},
			item() {
				this.invalidateFullTitle();
			},
			productBrandId() {
				this.invalidateFullTitle();
			},
		},
		mounted() {
			this.settingStore.dispatch("getItems");
			this.invalidateFullTitle();
			this.invalidatePreview();
		},
		methods: {
			async invalidateFullTitle() {
				this.fullTitle = "";
				if (!this.item) return;
				this.fullTitle = await this.item.fetchFullTitle();
			},
			async invalidatePreview() {
				const color = this.preview
					? await this.preview.fetchColor().catch(() => null)
					: null;

				this.primaryColorHex = color ? color.toString() : "inherit";
			},
		},
	};
</script>

<template>
	<div
		:class="[
			'ItemProduct',
			isList ? 'ItemProduct-modeList' : '',
			isGrid ? 'ItemProduct-modeGrid' : '',
			isSelected ? 'ItemProduct-isSelected' : 'ItemProduct-isDeselected',
		]"
		:style="{
			'--available-opacity': isAvailable ? '1' : '0.1',
			'--primary-color': primaryColor,
			'--background-color-hover': primaryColor.mix('ffffff', 0.2),
		}"
		:ref="item.id"
		@click="$emit('click', item)"
	>
		<div class="ItemProduct-preview">
			<ImageView
				:class="['ItemProduct-preview-image']"
				v-if="preview"
				:src="preview"
			/>
			<span :class="['ItemProduct-preview-empty']" v-else>No Preview</span>
		</div>

		<div class="ItemProduct-title">
			<span class="ItemProduct-title-text">{{ fullTitle }}</span>
			<div class="ItemProduct-title-specs" v-if="specLabels.length">
				<span v-for="label in specLabels" :key="label.text">{{ label.text }}</span>
			</div>
			<span class="ItemProduct-title-price" v-if="price">{{ price.to }}</span>
		</div>
	</div>
</template>

<style lang="scss" scoped>
	.ItemProduct {
		--available-opacity: 1;

		width: 100%;
		transition: var(--transition-duration);
		text-decoration: none;
		border: none;

		display: flex;
		flex-wrap: nowrap;
		align-items: center;
		justify-content: flex-start;
		border-radius: var(--border-radius);

		.ItemProduct-preview {
			flex-grow: 0;
			object-fit: cover;
			aspect-ratio: 16/12;

			& > * {
				width: 100%;
				height: 100%;
				aspect-ratio: 16/12;
				border-radius: var(--border-radius);
				background-color: hsl(0, 0%, 90%);
			}
			.ItemProduct-preview-image {
				object-fit: contain;
			}
			.ItemProduct-preview-empty {
				font-size: 0.8rem;
				font-weight: 600;
				color: hsla(0, 0%, 0%, 0.3);
				display: flex;
				align-items: center;
				justify-content: center;
			}
		}

		.ItemProduct-title {
			display: flex;
			flex-direction: column;
			justify-content: flex-start;

			gap: 0.3rem;
			color: black;

			.ItemProduct-title-text {
				min-height: 1.1rem;
				max-height: 2.2rem;
				line-height: 1.1rem;

				font-size: 1rem;
				font-weight: 600;
				text-align: start;
				overflow: hidden;

				display: flex;
				flex-direction: column;
				flex-grow: 1;
				align-items: flex-start;
			}
			.ItemProduct-title-specs {
				width: 100%;
				gap: 0.1rem;
				font-size: 0.6rem;
				font-weight: 400;
				color: black;
				margin: -0.1rem;

				display: flex;
				flex-direction: row;
				flex-wrap: wrap;
				justify-content: flex-start;
				align-items: flex-start;

				& > * {
					min-width: max-content;
					width: max-content;
					padding: 0.15rem 0.2rem;
					background-color: hsla(0, 0%, 100%, 0.4);
					border-radius: 0.2rem;
					border: 1px solid hsla(0, 0%, 0%, 0.1);
				}
			}
			.ItemProduct-title-price {
				font-size: 0.7rem;
			}
		}
	}

	.ItemProduct-modeList {
		--border-radius: 0.8rem;
		--height: 5rem;

		min-height: var(--height);
		max-height: var(--height);

		flex-direction: row;
		align-items: center;
		justify-content: flex-start;

		.ItemProduct-preview {
			height: 100%;
		}
		.ItemProduct-title {
			flex-grow: 1;
			padding: 1rem;
		}
	}
	.ItemProduct-modeGrid {
		--border-radius: 0.8rem;
		flex-direction: column;
		align-items: flex-start;
		justify-content: flex-start;
		aspect-ratio: 17/18;

		.ItemProduct-preview {
			width: 100%;
		}
		.ItemProduct-title {
			width: 100%;
			padding: 1rem 0.5rem;
		}
	}

	.ItemProduct-isDeselected {
		cursor: pointer;
		&:hover,
		&:focus,
		&:focus-within {
			background-color: rgba(0, 0, 0, 0.08);
		}
	}
	.ItemProduct-isSelected {
		.ItemProduct-preview {
			opacity: 0.5;
		}
		.ItemProduct-title {
			opacity: 0;
		}
		background-color: var(--primary-color);
	}
</style>
