<script>
	import Actionbar from "@/components/actionbar/Actionbar.vue";
	import SearchInput from "@/components/SearchInput.vue";

	import ItemSearchProduct from "./ItemSearchProduct.vue";
	import ItemSearchCategory from "./ItemSearchCategory.vue";
	import ItemSearchBrand from "./ItemSearchBrand.vue";
	import ItemSearchPs2Disc from "./ItemSearchPs2Disc.vue";
	import ItemSearchService from "./ItemSearchService.vue";

	export default {
		components: {
			Actionbar,
			SearchInput,
			ItemSearchProduct,
			ItemSearchCategory,
			ItemSearchBrand,
			ItemSearchPs2Disc,
			ItemSearchService,
		},
		props: {
			isTop: { type: Boolean, default: false },
			isThin: { type: Boolean, default: false },
		},
		data() {
			return { searchText: "", searches: [] };
		},
		computed: {
			user: (c) => c.loginStore.getters.user,

			categories: (c) => c.categoryStore.getters.items,
			products: (c) => {
				return c.productStore.getters.items.filter((product) => {
					return product.isStockAvailable();
				});
			},
			brands: (c) => c.brandStore.getters.items,
			ps2Discs: (c) => c.ps2Store.getters.items,
			services: (c) => {
				if (c.user.isTypeNone()) return [];
				return c.serviceStore.getters.items;
			},
		},
		watch: {
			user() {
				if (!this.user.isTypeNone()) this.serviceStore.dispatch("getItems");
				this.search(this.searchText);
			},
		},
		mounted() {
			this.ps2Store.dispatch("getItems");
			this.brandStore.dispatch("getItems");
			this.categoryStore.dispatch("getItems");
			this.categoryStore.dispatch("refresh");
			this.productStore.dispatch("refresh");
			if (this.user.isTypeAdmin() || this.user.isTypeStaff())
				this.serviceStore.dispatch("getItems");
		},
		methods: {
			search(text) {
				text = this.searchText = text.toLowerCase();
				let texts = text.split(/[\s,]+/).filter((text) => text.trim().length);

				let productSearches = this.products.map((product) => {
					return {
						dataType: "product",
						item: product,
						count: product.toCount(texts),
					};
				});
				let categorySearches = this.categories.map((category) => {
					return {
						dataType: "category",
						item: category,
						count: category.toCount(texts),
					};
				});
				let brandSearches = this.brands.map((brand) => {
					return {
						dataType: "brand",
						item: brand,
						count: brand.toCount(texts),
					};
				});
				let ps2DiscSearches = this.ps2Discs.map((ps2Disc) => {
					return {
						dataType: "ps2Disc",
						item: ps2Disc,
						count: ps2Disc.toCount(texts),
					};
				});
				let serviceSearches = this.services.map((service) => {
					return {
						dataType: "service",
						item: service,
						count: service.toCount(texts),
					};
				});

				const searches = [
					...productSearches,
					...categorySearches,
					...brandSearches,
					...ps2DiscSearches,
					...serviceSearches,
				];
				const highCount = searches.reduce((highCount, x) => {
					return highCount < x.count ? x.count : highCount;
				}, 0);
				const valueToAccept = highCount * 0.5;

				if (valueToAccept)
					this.searches = searches
						.filter((x) => x.count >= valueToAccept)
						.sort((x1, x2) => x2.count - x1.count);
				else this.searches = [];
			},
		},
	};
</script>

<template>
	<Actionbar
		class="HomeActionbar"
		:leftMenus="[
			$root.navigation.isDrawer()
				? {
						title: 'Hamburger Menu',
						icon: host.res('icon/hamburgerMenu-000000.svg'),
						click: () => $root.openNavigationDrawer(),
				  }
				: null,
			isThin
				? {
						icon: host.res('img/freshnet-enterprise-logo.svg'),
						click: () => {},
				  }
				: null,
		]"
	>
		<div class="HomeActionbar-body">
			<!-- <router-link class="HomeActionbar-nav" v-if="!isThin" :to="{ path: '/product' }"
				>Product</router-link
			>
			<router-link class="HomeActionbar-nav" v-if="!isThin" :to="{ path: '/ps2' }"
				>PS2 Disc</router-link
			> -->

			<div class="Home-actionbar-search-body">
				<SearchInput
					:class="[
						'Home-actionbar-search',
						isThin
							? 'Home-actionbar-search-isThin'
							: 'Home-actionbar-search-isWide',
					]"
					placeholder="Search"
					:list="searches"
					@callback-search="(text) => search(text)"
				>
					<div
						class="Home-actionbar-search-item"
						v-for="x in searches"
						:key="x.item.id"
					>
						<router-link
							class="Home-actionbar-search-item-button"
							v-if="x.dataType === 'product'"
							:to="{ path: '/product', query: { productId: x.item.id } }"
						>
							<ItemSearchProduct :item="x.item" />
						</router-link>

						<router-link
							class="Home-actionbar-search-item-button"
							v-if="x.dataType === 'category'"
							:to="{ path: '/product', query: { category: x.item.id } }"
						>
							<ItemSearchCategory :item="x.item" />
						</router-link>

						<router-link
							class="Home-actionbar-search-item-button"
							v-if="x.dataType === 'brand'"
							:to="{ path: '/product', query: { brand: x.item.id } }"
						>
							<ItemSearchBrand :item="x.item" />
						</router-link>

						<router-link
							class="Home-actionbar-search-item-button"
							v-if="x.dataType === 'ps2Disc'"
							:to="{ path: '/ps2', query: { discCode: x.item.code } }"
						>
							<ItemSearchPs2Disc :item="x.item" />
						</router-link>

						<router-link
							class="Home-actionbar-search-item-button"
							v-if="x.dataType === 'service'"
							:to="{
								path: '/manage/service',
								query: { service: x.item.id },
							}"
						>
							<ItemSearchService :item="x.item" />
						</router-link>
					</div>
				</SearchInput>
			</div>
		</div>
	</Actionbar>
</template>

<style lang="scss" scoped>
	.HomeActionbar {
		width: 100%;
		background-color: hsla(0, 0%, 89%, 0.96);
		background-color: hsl(0, 0%, 89%);

		// @supports (-webkit-backdrop-filter: none) or (backdrop-filter: none) {
		// 	--blur: 0.5rem;
		// 	-webkit-backdrop-filter: blur(var(--blur));
		// 	backdrop-filter: blur(var(--blur));
		// }

		.HomeActionbar-navigations {
			grid-area: navigations;
			width: 100%;
			display: flex;
			flex-direction: row;
			align-items: center;
			gap: 1rem;
			padding: 0.2rem 1.5rem;
			background-color: white;
		}
		.HomeActionbar-nav {
			transition: var(--transition-duration);
			padding: 0.5rem;
			font-size: 1rem;
			font-weight: 600;
			text-decoration: none;
			color: black;
			min-width: max-content;
		}

		.HomeActionbar-body {
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: space-between;

			.Home-actionbar-search-body {
				width: 100%;
				display: flex;
				flex-direction: row;
				justify-content: center;
				align-items: center;

				.Home-actionbar-search {
					max-width: 24rem;
					flex-grow: 1;
					transition: var(--transition-duration);
					--border-radius: 4rem;
					--background-color: hsla(0, 0%, 100%, 0.9);

					.Home-actionbar-search-item {
						width: 100%;
						display: flex;
						flex-direction: column;

						.Home-actionbar-search-item-button {
							width: 100%;
							display: flex;
							flex-direction: column;
							text-decoration: none;
							justify-content: center;
							align-items: flex-start;
							color: black;
							cursor: pointer;
							text-align: start;
							border: none;
							background: none;
							border-radius: 0.5em;
							transition: var(--transition-duration);

							&:hover {
								background: rgba(255, 255, 255, 0.5);
							}
						}
					}
				}
				.Home-actionbar-search-isThin {
					margin-left: 1rem;
				}
				.Home-actionbar-search-isWide {
					margin-left: -0.7rem;
				}
			}
		}
	}
</style>
