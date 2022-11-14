<script>
	import Actionbar from "./PageService_Actionbar.vue";
	import ListServices from "./ListServices.vue";

	import ModuleService from "@/items/data/Service.js";
	import ServiceState from "@/items/tools/ServiceState.js";
	import Empty from "@/components/Empty.vue";

	import U from "@/U.js";

	const { State } = ModuleService;

	export default {
		emits: ["click-service", "click-service-delete"],
		components: { Empty, Actionbar, ListServices },
		props: {
			menus: { type: Array, default: () => [] },
			services: { type: Array, default: () => [] },
			currentItem: { type: Object, default: () => null },
		},
		data() {
			return {
				scrollTop: 0,

				stateMenuIndex: 0,
				stateMenus: [
					State.Pending,
					State.Waiting,
					State.Completed,
					State.Rejected,
				].map((stateKey) => {
					const resource = ServiceState.getResourceByKey(stateKey);
					return {
						key: stateKey,

						title: resource.title,

						icon: resource.icon.color,
						iconSelected: resource.icon.white,

						primaryColor: resource.color,
						isPrimaryColorBright: true,

						list: [],

						isSelected: () =>
							this.stateMenus[this.stateMenuIndex] &&
							this.stateMenus[this.stateMenuIndex].key === stateKey,
						click: () => {
							if (this.state !== stateKey)
								this.$root.replaceRoute({ query: { state: stateKey } });
						},
					};
				}),

				currentLayoutIndex: 1,
				layoutMenus: [
					{
						title: "Grid View",
						icon: this.host.res("icon/grid-000000.svg"),
						click: (menu) =>
							(this.currentLayoutIndex = this.layoutMenus.indexOf(menu)),
					},
					{
						title: "List View",
						icon: this.host.res("icon/list-000000.svg"),
						click: (menu) =>
							(this.currentLayoutIndex = this.layoutMenus.indexOf(menu)),
					},
					{
						title: "Detail View",
						icon: this.host.res("icon/detail-000000.svg"),
						click: (menu) =>
							(this.currentLayoutIndex = this.layoutMenus.indexOf(menu)),
					},
				],

				currentSortIndex: 0,
				sortMenus: [
					{ key: ListServices.Sort.DateCreated, title: "Date Created" },
					{ key: ListServices.Sort.Name, title: "Customer Name" },
					{ key: ListServices.Sort.PhoneNumber, title: "Phone Number" },
				].map((menu) => {
					menu.click = () => {
						this.currentSortIndex = this.sortMenus.indexOf(menu);
					};
					return menu;
				}),
			};
		},
		computed: {
			items() {
				return this.stateMenus[this.stateMenuIndex].list;
			},

			state: (c) => U.optString(c.$route.query.state),

			isGridView: (c) => c.currentLayoutIndex === 0,
			isListView: (c) => c.currentLayoutIndex === 1,
			isDetailView: (c) => c.currentLayoutIndex === 2,

			ViewMode() {
				if (this.isGridView) return ListServices.Mode.Grid;
				if (this.isListView) return ListServices.Mode.List;
				if (this.isDetailView) return ListServices.Mode.Detail;
				return 0;
			},
			SortMode() {
				const menu = this.sortMenus[this.currentSortIndex];
				return menu ? menu.key : ListServices.Sort.DateCreated;
			},
		},
		watch: {
			state() {
				this.invalidateState();
			},
			services() {
				this.invalidateList();
			},
		},
		methods: {
			setPageSelected(state) {
				const menu = this.stateMenus.find((menu) => menu.key === state);

				if (!menu && this.stateMenus.length && Object.keys(State).length) {
					this.$root.replaceRoute({
						query: { state: State[Object.keys(State)[0]] },
					});
				}

				this.stateMenuIndex = this.stateMenus.indexOf(menu);
			},

			invalidateList() {
				const filter = (services, key) => {
					const tab = this.stateMenus.find((tab) => tab.key === key);
					if (tab) {
						tab.list = services.filter((service) => {
							return service.state === key;
						});
					}
				};

				const services = Array.isArray(this.services) ? this.services : [];
				filter(services, State.Pending);
				filter(services, State.Waiting);
				filter(services, State.Completed);
				filter(services, State.Rejected);

				this.invalidateState();

				setTimeout(() => {
					if (this.$refs.PanelGroupServiceTabs) {
						this.$refs.PanelGroupServiceTabs.scrollLeft = 0;
					}
				}, 2000);
			},
			invalidateState() {
				this.setPageSelected(this.state);
			},
		},
		mounted() {
			this.invalidateList();
			this.invalidateState();
		},
	};
</script>

<template>
	<div class="PanelServices" @scroll="(e) => (scrollTop = e.target.scrollTop)">
		<Actionbar
			:class="[
				'PanelServices-actionbar',
				scrollTop > 0 ? 'PanelServices-actionbar-shadow' : '',
			]"
			:menus="menus"
			:services="services"
			:stateMenus="stateMenus"
			:layoutMenus="layoutMenus"
			:layoutMenuIndex="currentLayoutIndex"
			:sortMenus="sortMenus"
			:sortMenuIndex="currentSortIndex"
			@click-drawer-expand="() => $emit('click-drawer-expand')"
			@click-service="(service) => $emit('click-service', service)"
			@click-search="() => $emit('click-search')"
		/>

		<ListServices
			v-if="
				stateMenus[stateMenuIndex] && stateMenus[stateMenuIndex].list.length
			"
			:mode="ViewMode"
			:sort="SortMode"
			:items="items"
			:item="currentItem"
			@click-item="(item) => $emit('click-service', item)"
		/>

		<Empty v-if="!services.length && !serviceStore.getters.isLoading" />
	</div>
</template>

<style lang="scss" scoped>
	.PanelServices {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: stretch;
		justify-content: flex-start;
		overflow-y: auto;
		overflow-x: auto;

		--max-width: 60rem;

		.PanelServices-actionbar {
			z-index: 2;
			position: sticky;
			top: 0;
			left: 0;
			right: 0;
			width: 100%;
			flex-grow: 0;
			z-index: 2;
			transition: var(--animation-duration);
			border-bottom: 1px solid #e5ecee;
		}
		.PanelServices-actionbar-shadow {
			border-bottom: 1px solid hsla(0, 0%, 0%, 0.1);
		}
	}
</style>