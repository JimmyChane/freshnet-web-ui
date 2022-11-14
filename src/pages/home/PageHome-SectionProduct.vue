<script>
	export default {
		props: { isThin: { type: Boolean, default: false } },
		data() {
			return {
				groupMenus: [],
				categoryId: "monitor",

				itemIndex: 0,
			};
		},
		computed: {
			"categoryStore.getters.lastModified"() {
				this.invalidate();
			},
			groupMenu() {
				this.itemIndex = 0;
				return this.groupMenus.find((menu) => menu.key === this.categoryId);
			},
			items() {
				return this.groupMenu ? this.groupMenu.items : [];
			},
			item() {
				if (this.itemIndex >= this.items.length) this.itemIndex = 0;
				return this.items[this.itemIndex];
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
		},
		mounted() {
			this.invalidate();
		},
		methods: {
			async invalidate() {
				this.groupMenus = [];
				const groups = await this.productStore.dispatch("getGroupsByCategory");
				if (groups.length) {
					this.groupMenus = groups
						.sort((group1, group2) => group1.category.compare(group2.category))
						.filter((group) => {
							group.items = group.items.filter((item) => {
								return item.toImageThumbnail() && item.isStockAvailable();
							});

							while (group.items.length > 5) {
								const delta = Math.random() * group.items.length;
								const index = Math.floor(delta);
								group.items.splice(index, 1);
							}

							return group.items.length;
						})
						.map((group) => {
							return {
								key: group.category.id,
								title: group.category.title,
								items: group.items,
								click: () => (this.categoryId = group.category.id),
							};
						});

					const menu = this.groupMenus.find((menu) => {
						return menu.key === this.categoryId;
					});
					if (!menu && this.groupMenus.length) {
						this.categoryId = this.groupMenus[0].key;
					}
				}
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
	>
		<div class="HomeSectionProduct-left" v-if="groupMenus.length > 1">
			<div class="HomeSectionProduct-categories">
				<button
					:class="[
						'HomeSectionProduct-categories-item',
						`HomeSectionProduct-categories-item-${
							categoryId === menu.key ? 'isSelected' : 'isDeselected'
						}`,
					]"
					v-for="menu of groupMenus"
					:key="menu.key"
					@click="() => menu.click(menu)"
					>{{ menu.title }}</button
				>
			</div>
		</div>

		<div class="HomeSectionProduct-right">
			<img
				class="HomeSectionProduct-img"
				v-if="itemImageUrl"
				:src="itemImageUrl"
			/>
			<div class="HomeSectionProduct-footer">
				<div class="HomeSectionProduct-indexes" v-if="items.length > 1">
					<button
						:class="[
							'HomeSectionProduct-indexes-item',
							`HomeSectionProduct-indexes-item-${
								items.indexOf(item) === itemIndex
									? 'isSelected'
									: 'isDeselected'
							}`,
						]"
						v-for="item of items"
						:key="item.id"
						@click="() => (itemIndex = items.indexOf(item))"
					/>
				</div>
				<router-link
					class="HomeSectionProduct-click"
					v-if="itemId"
					:to="{ path: '/product', query: { productId: itemId } }"
					>View</router-link
				>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
	.HomeSectionProduct {
		--primary-color: #1b4078;

		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;

		background-color: #bddff5;
		background: linear-gradient(119.28deg, #bddff5 0%, #d5edff 100%);

		aspect-ratio: 16/12;
		border-radius: 1em;
		overflow: hidden;
		color: var(--primary-color);

		text-decoration: none;
		transition: var(--animation-duration);

		.HomeSectionProduct-left {
			width: 33.33%;
			width: 30%;
			height: 100%;
			display: flex;
			flex-direction: column;
			justify-content: center;
			gap: 1rem;

			.HomeSectionProduct-categories {
				width: max-content;
				display: flex;
				flex-direction: column;
				align-items: stretch;
				justify-content: flex-start;
				gap: 0.1rem;
				padding: 1.5rem 1rem;
				overflow: hidden;
				overflow-y: auto;

				--scrollbar-size: 5px;
				--scrollbar-thumb-radius: 0;
				--scrollbar-thumb-radius: 0.5rem;
				--scrollbar-track-margin: 1.5rem;

				--scrollbar-thumb-color: hsla(0, 0%, 0%, 0.4);
				--scrollbar-thumb-color-hover: hsla(0, 0%, 0%, 0.6);
				--scrollbar-track-color: hsla(0, 0%, 0%, 0.1);
				--scrollbar-track-color-hover: hsla(0, 0%, 0%, 0.2);

				scrollbar-width: var(--scrollbar-size);
				scrollbar-color: var(--scrollbar-thumb-color)
					var(--scrollbar-track-color);
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

				.HomeSectionProduct-categories-item {
					font-size: 1em;
					text-align: start;
					background: none;
					border: none;
					padding: 0.6em 1.2em;
					padding-right: 2em;
					border-radius: 2em;
					transition: var(--animation-duration);
				}
				.HomeSectionProduct-categories-item-isDeselected {
					background-color: transparent;
					color: var(--primary-color);
					cursor: pointer;
					&:hover {
						background-color: var(--primary-color);
						color: white;
					}
				}
				.HomeSectionProduct-categories-item-isSelected {
					font-weight: 600;
					background-color: var(--primary-color);
					color: white;
				}
			}
		}
		.HomeSectionProduct-right {
			// width: 66.66%;
			// width: 70%;
			height: 100%;
			display: flex;
			flex-direction: column;
			align-items: center;
			flex-grow: 1;
			justify-content: flex-end;

			.HomeSectionProduct-img {
				width: calc(100% - 4rem);
				height: calc(100% - 4rem - 4rem);
				flex-grow: 1;
				object-fit: scale-down;
				margin: 2rem;
				border-radius: 1rem;
				// filter: drop-shadow(0 0 0.4rem var(--primary-color));
			}
			.HomeSectionProduct-footer {
				height: 4rem;
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
					// padding-left: 6.5em;
					// padding-right: 0.5em;

					.HomeSectionProduct-indexes-item {
						width: var(--size);
						height: var(--size);
						min-width: var(--size);
						min-height: var(--size);
						max-width: var(--size);
						max-height: var(--size);

						border-radius: 50%;
						background-color: #1267a4;
						border: none;
						cursor: pointer;
						transition: var(--animation-duration);
					}
					.HomeSectionProduct-indexes-item-isSelected {
						transform: scale(1.5);
					}
					.HomeSectionProduct-indexes-item-isDeselected {
						&:hover {
							transform: scale(1.2);
							box-shadow: 0px 0px 1.5rem var(--primary-color);
						}
					}
				}
				.HomeSectionProduct-click {
					min-width: max-content;
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;

					background-color: var(--primary-color);
					color: white;
					cursor: pointer;
					font-weight: 600;
					text-decoration: none;
					padding: 0.6em 1.2em;
					border-radius: 3em;
					transition: var(--animation-duration);

					&:hover {
						transform: scale(1.01);
						box-shadow: 0px 0px 1.5rem var(--primary-color);
						text-decoration: underline;
					}
				}
			}
		}
	}
	.HomeSectionProduct-isThin {
		width: 100%;
		height: 100%;
		font-size: 0.9rem;
		.HomeSectionProduct-right {
			.HomeSectionProduct-footer {
				.HomeSectionProduct-indexes {
					gap: 0.3em;
					.HomeSectionProduct-indexes-item {
						--size: 10px;
					}
				}
			}
		}
	}
	.HomeSectionProduct-isWide {
		width: 100%;
		height: 100%;
		font-size: 1.2rem;
		.HomeSectionProduct-right {
			.HomeSectionProduct-footer {
				.HomeSectionProduct-indexes {
					gap: 0.5em;
					.HomeSectionProduct-indexes-item {
						--size: 16px;
					}
				}
			}
		}
	}
</style>
