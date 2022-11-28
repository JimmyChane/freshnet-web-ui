<script>
	import Category from "@/items/Category";
	import ImageView from "@/components/ImageView.vue";
	import chroma from "chroma-js"; // https://gka.github.io/chroma.js/

	export default {
		components: { ImageView },
		props: { isThin: { type: Boolean, default: false } },
		data() {
			return {
				groupMenus: [],

				maxLength: 8,
				products: [],
				productIndex: 0,

				itemTitle: "",
				primaryColor: chroma("cccccc"),
			};
		},
		computed: {
			"categoryStore.getters.lastModified"() {
				this.invalidate();
			},
			item() {
				if (this.productIndex < 0) this.productIndex = this.products.length - 1;
				if (this.productIndex >= this.products.length) this.productIndex = 0;
				return this.products[this.productIndex];
			},
			itemImage() {
				return this.item ? this.item.toImageThumbnail() : null;
			},
			itemImageUrl() {
				return this.itemImage ? this.itemImage.toUrl({ width: 350 }) : "";
			},
			itemId() {
				return this.item ? this.item.id : "";
			},

			color() {
				return chroma.valid(this.primaryColor) ? this.primaryColor : chroma("cccccc");
			},
			color1() {
				return this.getColorMixed(this.color, 0.2);
			},
			color2() {
				return this.getColorMixed(this.color, 0.3);
			},
			color3() {
				return this.getColorMixed(this.color, 0.9);
			},

			arrowIcon() {
				return this.isColorDark(this.color)
					? this.host.res("icon/arrowDown-ffffff.svg")
					: this.host.res("icon/arrowDown-000000.svg");
			},
		},
		watch: {
			item() {
				this.invalidateProduct();
			},
		},
		mounted() {
			this.invalidate();
			this.invalidateProduct();
		},
		methods: {
			async invalidate() {
				this.products = [];
				const groups = await this.productStore.dispatch("getGroupsByCategory");
				if (!groups.length) return;

				this.itemTitle = "";
				const products = groups
					.filter((group) => {
						return (
							group.category.key === Category.Key.Notebook ||
							group.category.key === Category.Key.Desktop ||
							group.category.key === Category.Key.Printer
						);
					})
					.sort((group1, group2) => group1.category.compare(group2.category))
					.reduce((products, group) => {
						products.push(...group.items);
						return products;
					}, [])
					.filter((product) => {
						return product.toImageThumbnail() && product.isStockAvailable();
					});

				while (products.length > this.maxLength) {
					const delta = Math.random() * products.length;
					const index = Math.floor(delta);
					products.splice(index, 1);
				}

				this.products = products;
			},
			async invalidateProduct() {
				if (!this.item) {
					this.itemTitle = "";
					this.primaryColor = null;
					return;
				}

				this.itemTitle = await this.item.fetchFullTitle();
				this.primaryColor = this.itemImage
					? await this.itemImage.fetchColor().catch(() => chroma("cccccc"))
					: chroma("cccccc");
			},

			getColorMixed(color, value) {
				return color.mix(this.isColorDark(this.color) ? "#ffffff" : "#000000", value);
			},
			isColorDark(color) {
				return chroma.deltaE(color, "000000") < 60;
			},
		},
	};
</script>

<template>
	<div
		:class="[
			'HomeSectionProduct',
			`HomeSectionProduct-${isThin ? 'isThin' : 'isWide'}`,
		]"
		:style="{
			'--color0': color,
			'--color1': getColorMixed(color, 0.2),
			'--color2': getColorMixed(color, 0.3),
			'--color3': getColorMixed(color, 0.9),
		}"
	>
		<span class="HomeSectionProduct-title">{{ itemTitle }}</span>
		<ImageView
			class="HomeSectionProduct-img"
			v-if="itemImage"
			:src="itemImage"
			@click="() => $router.push({ path: '/product', query: { productId: itemId } })"
		/>

		<div class="HomeSectionProduct-footer">
			<div class="HomeSectionProduct-dummy"></div>
			<div class="HomeSectionProduct-indexes" v-if="products.length > 1">
				<button
					:class="[
						'HomeSectionProduct-indexes-item',
						`HomeSectionProduct-indexes-item-${
							products.indexOf(item) === productIndex
								? 'isSelected'
								: 'isDeselected'
						}`,
					]"
					v-for="item of products"
					:key="item.id"
					@click="() => (productIndex = products.indexOf(item))"
				/>
			</div>
			<router-link
				class="HomeSectionProduct-click"
				v-if="itemId"
				:to="{ path: '/product', query: { productId: itemId } }"
				:style="{ color: isColorDark(color3) ? '#ffffff' : '#000000' }"
				>View</router-link
			>
		</div>

		<button
			class="HomeSectionProduct-arrow HomeSectionProduct-arrow-left"
			@click="() => productIndex--"
		>
			<img :src="arrowIcon" />
		</button>
		<button
			class="HomeSectionProduct-arrow HomeSectionProduct-arrow-right"
			@click="() => productIndex++"
		>
			<img :src="arrowIcon" />
		</button>
	</div>
</template>

<style lang="scss" scoped>
	.HomeSectionProduct {
		aspect-ratio: 16/12;
		border-radius: 1em;
		overflow: hidden;
		text-decoration: none;
		transition: var(--animation-duration);
		background-color: var(--color0);
		color: var(--color3);

		width: 100%;
		height: 100%;
		position: relative;

		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;

		.HomeSectionProduct-title {
			font-size: 1.4em;
			font-weight: 600;
			height: 3em;
			display: flex;
			justify-content: center;
			align-items: flex-end;
		}

		.HomeSectionProduct-img {
			--width: calc(100% - 6em);
			--height: calc(100% - 9em);
			width: var(--width);
			height: var(--height);
			min-width: var(--width);
			min-height: var(--height);
			max-width: var(--width);
			max-height: var(--height);
			flex-grow: 1;
			object-fit: scale-down;
			cursor: pointer;

			margin: 1em;
			border-radius: 1rem;
			filter: drop-shadow(0 0 1rem hsla(0, 0%, 0%, 0.2));
		}
		.HomeSectionProduct-footer {
			height: 4em;
			width: 100%;
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: flex-end;
			padding: 1em;

			.HomeSectionProduct-indexes {
				width: 100%;
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: center;

				.HomeSectionProduct-indexes-item {
					width: var(--size);
					height: var(--size);
					min-width: var(--size);
					min-height: var(--size);
					max-width: var(--size);
					max-height: var(--size);

					border-radius: 50%;
					border: none;
					transition: var(--animation-duration);
				}
				.HomeSectionProduct-indexes-item-isSelected {
					transform: scale(1.5);
					background-color: var(--color3);
				}
				.HomeSectionProduct-indexes-item-isDeselected {
					background-color: var(--color3);
					cursor: pointer;
					&:hover {
						box-shadow: 0px 0px 0.5rem var(--color3);
					}
				}
			}
			.HomeSectionProduct-click {
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;

				cursor: pointer;
				font-weight: 600;
				text-decoration: none;
				padding: 0.6em 1.2em;
				border-radius: 3em;
				background-color: var(--color3);
				transition: var(--animation-duration);

				&:hover {
					box-shadow: 0px 0px 0.2rem var(--color3);
				}
			}
		}

		.HomeSectionProduct-arrow {
			--size: 3.5em;
			--padding: 0.8em;
			position: absolute;
			display: flex;
			align-items: center;
			justify-content: center;

			padding: var(--padding);
			border-radius: 50%;
			cursor: pointer;
			background: none;
			border: none;

			width: var(--size);
			height: var(--size);
			min-width: var(--size);
			min-height: var(--size);
			max-width: var(--size);
			max-height: var(--size);

			transition: var(--animation-duration);

			& > * {
				width: calc(var(--size) - calc(var(--padding) * 2));
				height: calc(var(--size) - calc(var(--padding) * 2));
			}

			&:hover {
				background-color: hsla(0, 0%, 0%, 0.05);
			}
			&:focus {
				transform: scale(0.9);
			}
		}
		.HomeSectionProduct-arrow-left {
			top: calc(50% - calc(var(--size) / 2));
			left: 1em;
			& > * {
				transform: rotate(90deg) translateY(5%);
			}
		}
		.HomeSectionProduct-arrow-right {
			top: calc(50% - calc(var(--size) / 2));
			right: 1em;
			& > * {
				transform: rotate(270deg) translateY(5%);
			}
		}
	}
	.HomeSectionProduct-isThin {
		width: 100%;
		height: 100%;
		font-size: 0.9rem;
		.HomeSectionProduct-footer {
			.HomeSectionProduct-dummy {
				width: 6rem;
			}
			.HomeSectionProduct-indexes {
				gap: 0.3em;
				.HomeSectionProduct-indexes-item {
					--size: 10px;
				}
			}
			.HomeSectionProduct-click {
				width: 6rem;
			}
		}
	}
	.HomeSectionProduct-isWide {
		width: 100%;
		height: 100%;
		font-size: 1.2rem;
		.HomeSectionProduct-footer {
			.HomeSectionProduct-dummy {
				width: 8rem;
			}
			.HomeSectionProduct-indexes {
				gap: 0.5em;
				.HomeSectionProduct-indexes-item {
					--size: 16px;
				}
			}
			.HomeSectionProduct-click {
				width: 8rem;
			}
		}
	}
</style>
