<script>
	import Actionbar from "@/components/navigation/actionbar2/Actionbar.vue";
	import SearchInput from "@/components/SearchInput.vue";
	import ItemSearchProduct from "./ItemSearchProduct.vue";

	export default {
		components: { Actionbar, SearchInput, ItemSearchProduct },
		props: {
			products: { type: Array, default: () => [] },
			leftMenus: { default: () => null },
			rightMenus: { default: () => null },
		},
		data() {
			return { searchText: "" };
		},
		computed: {
			isOver550px: (c) => c.$root.window.innerWidth > 550,

			paths: (c) => c.$root.paths,
			lastPath() {
				let { paths } = this;
				if (!paths.length) return "";
				return paths[paths.length - 1];
			},
			productSearches() {
				const str = this.searchText;

				if (!str) return [];

				const strs = str
					.toLowerCase()
					.split(/[\s,]+/)
					.filter((text) => text);

				return this.products
					.reduce((results, product) => {
						try {
							const count = product.toCount(strs);
							if (count > 0) results.push({ count, product });
						} catch (error) {
							console.error("one of search result failed");
							console.error(error);
						}
						return results;
					}, [])
					.sort((result1, result2) => result2.count - result1.count)
					.map((result) => result.product);
			},

			initLeftMenus() {
				const menus = [];

				if (Array.isArray(this.leftMenus)) menus.push(...this.leftMenus);
				if (
					!Array.isArray(this.leftMenus) &&
					this.leftMenus !== null &&
					this.leftMenus !== undefined
				) {
					menus.push(this.leftMenus);
				}

				if (this.$root.navigation.isDrawer()) {
					menus.push({
						key: "home",
						title: "Home",
						icon: this.host.res("icon/home-2A4858.svg"),
						click: () => this.$router.push("/home"),
					});
					menus.push({
						key: "hamburgerMenu",
						title: "Hamburger Menu",
						icon: this.host.res("icon/hamburgerMenu-2A4858.svg"),
						click: () => this.$root.openNavigationDrawer(),
					});
				}

				return menus;
			},
			initRightMenus() {
				const menus = [];

				if (Array.isArray(this.rightMenus)) menus.push(...this.rightMenus);
				if (
					!Array.isArray(this.rightMenus) &&
					this.rightMenus !== null &&
					this.rightMenus !== undefined
				) {
					menus.push(this.rightMenus);
				}

				menus.push({
					key: "refresh",
					title: "Refresh",
					icon: this.host.res("icon/refresh-2A4858.svg"),
					click: () => {
						this.categoryStore.dispatch("refresh");
						this.productStore.dispatch("refresh");
					},
				});

				return menus;
			},
		},
	};
</script>

<template>
	<div class="ActionbarProduct">
		<Actionbar
			class="ActionbarProduct-actionbar"
			:leftMenus="initLeftMenus"
			:rightMenus="initRightMenus"
		>
			<div class="ActionbarProduct-search" v-if="isOver550px">
				<SearchInput
					class="ActionbarProduct-searchInput"
					placeholder="Search products"
					:list="productSearches"
					@callback-search="(text) => (searchText = text)"
					v-slot="{ list }"
				>
					<router-link
						class="ActionbarProduct-search-item-link"
						v-for="product in list"
						:key="product.id"
						:to="{ query: { productId: product.id } }"
					>
						<ItemSearchProduct
							class="ActionbarProduct-search-item"
							:item="product"
						/>
					</router-link>
				</SearchInput>
			</div>
		</Actionbar>

		<div class="ActionbarProduct-outside" v-if="!isOver550px">
			<SearchInput
				class="ActionbarProduct-searchInput"
				placeholder="Search products"
				:list="productSearches"
				@callback-search="(text) => (searchText = text)"
				v-slot="{ list }"
			>
				<router-link
					class="ActionbarProduct-search-item-link"
					v-for="product in list"
					:key="product.id"
					:to="{ query: { productId: product.id } }"
				>
					<ItemSearchProduct
						class="ActionbarProduct-search-item"
						:item="product"
					/>
				</router-link>
			</SearchInput>
		</div>
	</div>
</template>

<style lang="scss" scoped>
	.ActionbarProduct {
		width: 100%;
		position: sticky;
		top: 0;
		.ActionbarProduct-actionbar {
			width: 100%;

			.ActionbarProduct-search {
				width: 100%;
				display: flex;
				flex-direction: row;
				flex-wrap: nowrap;
				align-items: center;
				justify-content: center;
				gap: 0.8rem;

				.ActionbarProduct-searchInput {
					flex-grow: 1;
					z-index: 1;
					max-width: 40em;
					border: none;
					--background: white;
					.ActionbarProduct-search-item-link {
						text-decoration: none;
						display: flex;
						width: 100%;
						.ActionbarProduct-search-item {
							width: 100%;
						}
					}
				}
			}
		}

		.ActionbarProduct-outside {
			width: 100%;
			display: flex;
			flex-direction: row;
			flex-wrap: nowrap;
			align-items: center;
			justify-content: center;
			gap: 0.8rem;
			background-color: #e2e8eb;

			.ActionbarProduct-searchInput {
				flex-grow: 1;
				z-index: 1;
				max-width: 40em;
				border: none;
				--background: white;
				--border: none;
				--border-radius: 0;
				.ActionbarProduct-search-item-link {
					text-decoration: none;
					display: flex;
					width: 100%;
					.ActionbarProduct-search-item {
						width: 100%;
					}
				}
			}
		}
	}
</style>
