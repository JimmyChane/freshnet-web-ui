<script>
	import Drawer from "@/components/Drawer.vue";
	import LeftNavGroup1 from "./LeftNav_Group1.vue";
	import LeftNavLogin from "./LeftNav_Login.vue";

	export default {
		components: { Drawer, LeftNavGroup1, LeftNavLogin },
		emits: ["click-collapse", "click-logout"],
		props: {
			isExpand: { type: Boolean, default: false },
			isDrawer: { type: Boolean, default: true },
			isWide: { type: Boolean, default: false },
			selectedPageKey: { type: String, default: "" },
			selectedViewKey: { type: String, default: "" },
		},
		data() {
			return { expandedPageKey: "" };
		},
		computed: {
			drawerMode() {
				if (this.isDrawer && this.isExpand) return Drawer.Mode.DRAWER_EXPAND;
				if (this.isDrawer && !this.isExpand) return Drawer.Mode.DRAWER_COLLAPSE;
				if (!this.isDrawer) return Drawer.Mode.FIXED;
				return 0;
			},
			drawerEdge: () => Drawer.Edge.LEFT,

			navigations() {
				const navigations = this.$root.pages;

				navigations.forEach((nav) => {
					nav.isExpanded = () => this.expandedPageKey === nav.key;
					nav.isSelected = () => this.selectedPageKey === nav.key;
					nav.isWide = () => this.isWide;
					nav.clickExpand = () => {
						this.expandedPageKey =
							this.expandedPageKey === nav.key ? "" : nav.key;
					};
					nav.click = () => this.emitCollapse();

					nav.groups.forEach((nav2) => {
						nav2.isExpanded = () => false;
						nav2.isWide = () => this.isWide;
						nav2.getParent = () => nav;

						nav2.groups.forEach((nav3) => {
							nav3.isExpanded = () => false;
							nav3.isSelected = () => {
								if (nav2.isQuery) {
									return this.getQueryValue(nav2.key) === nav3.key;
								} else {
									return this.selectedViewKey === nav3.key;
								}
							};
							nav3.isWide = () => this.isWide;

							nav3.getParent = () => nav2;
							nav3.getLink = () => `/${nav.key}/${nav3.key}`;

							nav3.click = () => {
								if (nav2.isQuery) {
									this.clickQuery(nav3);
								}
							};
						});
					});
				});

				return navigations;
			},
		},
		methods: {
			emitCollapse() {
				this.$emit("click-collapse");
				this.expandedPageKey = "";
			},

			shouldMakeSpace(group1) {
				return (
					this.selectedPageKey === group1.key &&
					Array.isArray(group1.groups) &&
					group1.groups.length > 0 &&
					this.navigations.indexOf(group1) !== 0
				);
			},

			hasQueryKey(key) {
				const { query } = this.$route;
				return Object.keys(query).includes(key);
			},
			getQueryValue(key) {
				const { query } = this.$route;
				return query[key];
			},
			clickQuery(view) {
				const key = view.getParent().key;
				const nextValue = view.key;

				const currentValue = this.getQueryValue(key);
				if (currentValue === nextValue) return;

				console.log(this.hasQueryKey(""));

				if (
					(this.hasQueryKey("") && this.getQueryValue("") === undefined) ||
					(key === "" && nextValue === "")
				) {
					this.$root.replaceRoute({});
					return;
				}

				const query = {};
				query[key] = nextValue;

				this.$root.replaceRoute({ query });
			},
		},
	};
</script>

<template>
	<Drawer
		:class="['LeftNav', `LeftNav-${isWide ? 'isWide' : 'isThin'}`]"
		:mode="drawerMode"
		:edge="drawerEdge"
		@click-collapse="emitCollapse()"
	>
		<div class="LeftNav-body">
			<div class="LeftNav-header">
				<router-link class="LeftNav-logo" :to="{ path: '/' }">
					<img
						class="LeftNav-icon"
						:src="
							host.cloudinary({
								url: 'logo/svg/freshnet-enterprise-logo.svg',
							})
						"
					/>
					<span class="LeftNav-title">Freshnet Enterprise</span>
				</router-link>
			</div>

			<div class="LeftNav-navigations" v-if="navigations.length">
				<LeftNavGroup1
					:class="[shouldMakeSpace(group1) ? 'LeftNav-group1-marginTop' : '']"
					v-for="group1 of navigations"
					:key="group1.key"
					:group1="group1"
					@click-group3="() => emitCollapse()"
				/>
			</div>

			<LeftNavLogin
				v-if="$root.currentPageKey !== 'login'"
				@click-logout="$emit('click-logout')"
				:isWide="isWide"
			/>
		</div>
	</Drawer>
</template>

<style lang="scss" scoped>
	.LeftNav {
		.LeftNav-body {
			width: 16rem;
			height: 100%;
			max-width: 100%;
			display: flex;
			flex-direction: column;
			align-items: stretch;
			overflow-y: auto;
			overflow-x: hidden;
			background: #dfe8ee;
			position: relative;
			transition: var(--animation-duration);

			.LeftNav-header {
				padding: 1.4rem;
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: center;

				.LeftNav-logo {
					gap: 0.5rem;
					display: flex;
					flex-direction: row;
					align-items: center;
					justify-content: center;
					cursor: pointer;
					text-decoration: none;
					color: var(--primary-color);
					transition: var(--animation-duration);
					background: none;

					&:hover {
						text-decoration: underline;
					}

					.LeftNav-icon {
						transition: var(--animation-duration);
					}
					.LeftNav-title {
						font-weight: 600;
						letter-spacing: 0.25rem;
						line-height: 1;
					}
				}
			}

			.LeftNav-navigations {
				flex-grow: 1;
				width: 100%;
				display: flex;
				flex-direction: column;
				justify-content: flex-start;
				padding: 0.4em 0;
				padding-bottom: 4em;

				.LeftNav-group1-marginTop {
					margin-top: 1em;
				}
			}
			.LeftNav-login {
				position: sticky;
				bottom: 0;
				width: 100%;
				box-shadow: 0px 0px 20px #49748940;
			}
		}
	}

	.LeftNav-isWide {
		.LeftNav-body {
			.LeftNav-header {
				.LeftNav-logo {
					.LeftNav-icon {
						width: 2rem;
						height: 2rem;
					}
					.LeftNav-title {
					}
				}
			}
			.LeftNav-navigations {
				padding: 0.8em;
				padding-top: 0.8em;
				padding-bottom: 4em;
				align-items: flex-start;
			}
		}
	}
	.LeftNav-isThin {
		.LeftNav-body {
			width: fit-content;
			.LeftNav-header {
				.LeftNav-logo {
					.LeftNav-icon {
						width: 1.3rem;
						height: 1.3rem;
					}
					.LeftNav-title {
						display: none;
					}
				}
			}
			.LeftNav-navigations {
				align-items: center;
				padding: 0.3em;
			}
		}
	}
</style>
