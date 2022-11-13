<script>
	import ActionbarMenus from "@/components/navigation/actionbar2/ActionbarMenus.vue";
	import SearchInput from "@/components/SearchInput.vue";
	import LayoutViewSelector from "@/pages/service/PageService_LayoutViewSelector.vue";
	import LabelMenus from "@/components/LabelMenus.vue";

	import ItemService from "./ItemService.vue";

	export default {
		components: {
			ActionbarMenus,
			SearchInput,
			LayoutViewSelector,
			LabelMenus,
			ItemService,
		},
		emits: ["click-drawer-expand", "click-service"],
		props: {
			title: { type: String, default: "" },
			menus: { type: Array, default: () => [] },

			services: { type: Array, default: () => [] },

			stateMenus: { type: Array, default: () => [] },

			layoutMenus: { type: Array, default: () => [] },
			layoutMenuIndex: { type: Number, default: -1 },

			sortMenus: { type: Array, default: () => [] },
			sortMenuIndex: { type: Number, default: -1 },
		},
		data() {
			return { results: [] };
		},
		computed: {
			isWide: (c) => c.$root.window.innerWidth > 600,
		},
		methods: {
			tabClass(menu) {
				if (this.isWide) {
					return menu.isSelected()
						? "Actionbar-tab-isSelected Actionbar-tab-isWide"
						: "Actionbar-tab-isDeselected Actionbar-tab-isWide";
				} else {
					return menu.isSelected()
						? "Actionbar-tab-isSelected Actionbar-tab-isWide"
						: "Actionbar-tab-isDeselected Actionbar-tab-isThin";
				}
			},

			searchResults(str) {
				const strs = str
					.toLowerCase()
					.split(/[\s,]+/)
					.filter((str) => str.trim().replace(" ", "").length);

				if (!strs.length) return [];

				let countHighest = 0;

				let filters = this.services.reduce((filters, item) => {
					try {
						const count = item.toCount(strs);
						if (count < 1) return filters;
						if (countHighest < count) countHighest = count;
						filters.push({ count, item });
					} catch (error) {
						console.error(error);
					}

					return filters;
				}, []);

				if (filters.length > 10) {
					const valueToPass = countHighest / 2;
					filters = filters.filter((filter) => filter.count >= valueToPass);
				}

				return filters
					.sort((filter1, filter2) => filter2.count - filter1.count)
					.map((filter) => filter.item);
			},
		},
	};
</script>

<template>
	<div class="Actionbar">
		<div class="Actionbar-top">
			<div>
				<ActionbarMenus
					class="Actionbar-leftMenus"
					v-if="$root.navigation.isDrawer()"
					:menus="[
						{
							key: 'hamburgerMenu',
							title: 'Hamburger Menu',
							icon: host.res('icon/hamburgerMenu-2A4858.svg'),
							click: () => $emit('click-drawer-expand'),
						},
					]"
				/>

				<SearchInput
					class="Actionbar-SearchInput"
					v-if="isWide && services.length"
					placeholder="Search services"
					:list="results"
					@callback-search="(strs) => (results = searchResults(strs))"
					v-slot="{ collapse }"
				>
					<ItemService
						v-for="item in results"
						:key="item.id"
						:item="item"
						@click="
							() => {
								collapse();
								$emit('click-service', item);
							}
						"
					/>
				</SearchInput>

				<ActionbarMenus
					class="Actionbar-rightMenus"
					v-if="menus.length"
					:menus="[
						isWide
							? null
							: {
									title: 'Search',
									icon: host.res('icon/search-2A4858.svg'),
									click: () => $emit('click-search'),
							  },
						...menus,
					]"
				/>
			</div>
		</div>

		<div class="Actionbar-toolbar">
			<div>
				<LayoutViewSelector :menus="layoutMenus" :index="layoutMenuIndex" />
				<LabelMenus
					title="Sort"
					:menu="sortMenus[sortMenuIndex] ? sortMenus[sortMenuIndex] : null"
					:menus="sortMenus"
				/>
			</div>
		</div>

		<div class="Actionbar-tabs">
			<div>
				<button
					:class="['Actionbar-tab', tabClass(stateMenu)]"
					:style="{ '--primary-color': stateMenu.primaryColor }"
					v-for="stateMenu of stateMenus"
					:key="stateMenu.title"
					@click="stateMenu.click()"
				>
					<span class="Actionbar-tab-title">{{ stateMenu.title }}</span>
					<img class="Actionbar-tab-icon" :src="stateMenu.icon" />
				</button>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
	.Actionbar {
		height: max-content;
		background-color: #c9d7df;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;

		.Actionbar-top {
			z-index: 3;
			width: 100%;

			padding: 0 1rem;

			display: flex;
			flex-direction: column;
			align-items: center;

			& > * {
				width: 100%;
				max-width: var(--max-width);
				padding: 0.3rem 0;
				gap: 0.5rem;

				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: flex-end;

				.Actionbar-SearchInput {
					z-index: 3;
					width: 100%;
					padding: 0;
					flex-grow: 2;
				}
				.Actionbar-leftMenus {
					flex-grow: 0;
				}
				.Actionbar-rightMenus {
					flex-grow: 1;
				}
			}
		}

		.Actionbar-toolbar {
			width: 100%;
			padding: 0.3rem 1rem;
			gap: 1rem;

			z-index: 2;

			display: flex;
			flex-direction: column;
			flex-wrap: nowrap;
			align-items: center;
			justify-content: center;

			& > * {
				width: 100%;
				max-width: var(--max-width);
				gap: 0.2rem;

				display: flex;
				flex-direction: row;
				flex-wrap: nowrap;
				align-items: center;
				justify-content: space-between;
			}
		}

		.Actionbar-tabs {
			z-index: 1;
			width: 100%;
			padding: 0 1rem;
			overflow-x: auto;

			--scrollbar-size: 0.2rem;
			--scrollbar-thumb-color: hsla(0, 0%, 0%, 0.05);
			--scrollbar-thumb-color-hover: hsla(0, 0%, 0%, 0.1);
			--scrollbar-track-color: transparent;
			--scrollbar-track-color-hover: transparent;
			--scrollbar-track-margin: 1rem;

			display: flex;
			flex-direction: column;
			align-items: center;

			& > * {
				width: 100%;
				max-width: var(--max-width);
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: flex-start;
				.Actionbar-tab {
					height: 2.4rem;
					border-radius: 0.8rem 0.8rem 0 0;
					transition: var(--animation-duration);

					border: none;
					background: none;
					font-size: 1rem;
					padding-top: 0.1rem;

					display: flex;
					flex-direction: row;
					align-items: center;
					justify-content: center;

					.Actionbar-tab-title {
						z-index: 1;
						transition: var(--animation-duration);
						text-align: center;
						text-overflow: ellipsis;
						white-space: nowrap;
						overflow: hidden;
						font-weight: 900;
						color: var(--primary-color);
					}
					.Actionbar-tab-icon {
						z-index: 2;
						width: 1.5rem;
						height: 1.5rem;
						padding: 0.25rem;
					}
				}

				.Actionbar-tab-isWide {
					width: 8.2rem;
					gap: 0.5rem;
					.Actionbar-tab-title {
						width: 4.8rem;
					}
				}
				.Actionbar-tab-isThin {
					width: 2.8rem;
					gap: 0;
					.Actionbar-tab-title {
						width: 0;
						height: 0;
						opacity: 0;
					}
				}

				.Actionbar-tab-isSelected {
					background-color: #e5ecee;

					// .Actionbar-tab-title {
					// 	width: 4.8rem;
					// }
				}
				.Actionbar-tab-isDeselected {
					background-color: transparent;
					cursor: pointer;

					// .Actionbar-tab-title {
					// 	width: 0;
					// 	height: 0;
					// 	opacity: 0;
					// }

					&:hover {
						background-color: hsla(0, 0%, 96%, 0.5);
					}
				}
			}
		}
	}
</style>
