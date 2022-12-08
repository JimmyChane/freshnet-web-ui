<script>
	import ActionbarMenus from "@/components/actionbar/ActionbarMenus.vue";
	import SearchInput from "@/components/SearchInput.vue";
	import ItemSearch from "./ItemOrderSearch.vue";

	export default {
		components: { ActionbarMenus, SearchInput, ItemSearch },
		props: {
			hasShadow: { type: Boolean, default: false },
			title: { type: String, default: "" },
			items: { type: Array, default: () => [] },
		},
		data() {
			return { results: [] };
		},
		methods: {
			searchResults(str) {
				const strs = str
					.toLowerCase()
					.split(/[\s,]+/)
					.filter((str) => str.trim().replace(" ", "").length);

				if (!strs.length) return [];

				let countHighest = 0;

				let filters = this.items.reduce((filters, item) => {
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
		<ActionbarMenus
			class="Actionbar-leftMenus"
			v-if="$root.navigation.isDrawer()"
			:menus="[
				{
					key: 'hamburgerMenu',
					title: 'Hamburger Menu',
					icon: host.res('icon/hamburgerMenu-000000.svg'),
					click: () => $emit('click-drawer-expand'),
				},
			]"
		/>

		<SearchInput
			class="Actionbar-search"
			v-if="items.length"
			placeholder="Search orders"
			:list="results"
			@callback-search="(str) => (results = searchResults(str))"
			v-slot="{ collapse }"
		>
			<button
				class="Actionbar-search-button"
				v-for="item in results"
				:key="item.id"
				@click="
					() => {
						collapse();
						$emit('click-item', item);
					}
				"
			>
				<ItemSearch :item="item" />
			</button>
		</SearchInput>
		<div class="Actionbar-title" v-else>{{ title }}</div>

		<ActionbarMenus
			class="Actionbar-rightMenus"
			:menus="[
				{
					key: 'appendOrder',
					title: 'Append Order',
					icon: host.res('icon/add-000000.svg'),
					click: () => $emit('click-item-add'),
				},
				{
					key: 'refresh',
					title: 'Refresh',
					icon: host.res('icon/refresh-000000.svg'),
					click: () => $emit('click-refresh'),
				},
			]"
		/>
	</div>
</template>

<style lang="scss" scoped>
	.Actionbar {
		background-color: #f3f3f3;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		padding: 0.6rem 0.8rem;
		gap: 1rem;

		.Actionbar-search {
			.Actionbar-search-button {
				text-decoration: none;
				color: inherit;
				text-align: start;
				font-size: 1rem;
				cursor: pointer;
				border: none;
				border-radius: 0.6rem;
				background: none;
				transition: var(--animation-duration);
				&:hover {
					background: rgba(0, 0, 0, 0.05);
				}
			}
		}
		.Actionbar-title {
			overflow: hidden;
			display: flex;
			flex-grow: 1;
			flex-direction: row;
			align-items: center;
			justify-content: flex-start;

			font-size: 1.4rem;
			font-weight: 600;
			white-space: nowrap;
			text-overflow: clip;
			color: black;
		}
	}
</style>
