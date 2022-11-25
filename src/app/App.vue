<script>
	import PageHome from "@/pages/home/PageHome.vue";
	import PageProduct from "@/pages/product/PageProduct.vue";
	import PagePs2 from "@/pages/ps2/PagePs2.vue";
	import PageManage from "@/pages/manage/PageManage.vue";

	import LeftNav from "./leftNav/LeftNav.vue";
	import ViewerImage from "./ViewerImage.vue";
	import Snackbar from "./Snackbar.vue";

	export default {
		name: "App",

		_children() {
			return [PageHome, PageProduct, PagePs2, PageManage];
		},

		components: { LeftNav, ViewerImage, Snackbar },
		data() {
			return { statusIsShown: false, layoutLoginIsShown: false };
		},
		computed: {
			isLogging: (c) => c.loginStore.getters.isLogging,
			isConnected: (c) => c.store.getters.isConnected,
		},
		watch: {
			isLogging() {
				if (!this.loginStore.getters.user && this.isLogging)
					this.$root.feedback("User Logging");
			},
			isConnected() {
				this.onConnectionChange();
			},
		},
		methods: {
			onConnectionChange() {
				if (!this.isConnected) {
					this.statusIsShown = true;
					return;
				}

				this.statusIsShown = true;
				setTimeout(() => (this.statusIsShown = false), 3000);
			},

			logout() {
				this.loginStore.dispatch("logout").then((user) => {
					this.$root.feedback(`${user.name} is now logged out`);
				});
			},
		},
		mounted() {
			setTimeout(() => this.onConnectionChange(), 3000);
		},
	};
</script>

<template>
	<div
		:class="[
			'App',
			`App-${$root.appLayout.isNormal() ? 'isNormal' : ''}`,
			`App-${$root.appLayout.isFull() ? 'isFull' : ''}`,
			`App-${statusIsShown ? 'isShowingStatus' : 'isHidingStatus'}`,
		]"
	>
		<div class="App-background"></div>

		<div class="App-body">
			<div class="App-layout">
				<div
					v-if="false"
					:class="[
						'App-status',
						`App-status-${isConnected ? 'isConnected' : 'isDisconnected'}`,
					]"
				>
					<span>{{ isConnected ? "Connected" : "Disconnected" }}</span>
				</div>

				<div class="App-layout-body">
					<LeftNav
						class="App-LeftNav"
						v-if="!$root.navigation.isNone()"
						:isDrawer="$root.navigation.isDrawer()"
						:isExpand="$root.navigation.isExpanded()"
						:selectedPageKey="$root.currentPageKey"
						:selectedViewKey="$root.currentViewKey"
						:isWide="$root.navigation.isWide()"
						@click-collapse="() => $root.closeNavigationDrawer()"
						@click-logout="logout"
					/>
					<router-view class="App-routerView" ref="AppRouterView" />
				</div>
			</div>
		</div>

		<div class="App-overflow">
			<div class="App-overflow-body">
				<ViewerImage class="App-imageViewer" />
			</div>
		</div>

		<Snackbar
			class="App-Snackbar"
			v-for="snackbar of $root.snackbars"
			:key="snackbar.key"
			:item="snackbar"
		/>
	</div>
</template>

<style lang="scss">
	:root {
		@media (max-width: 320px) {
			font-size: 14px;
		}
	}

	html {
		// @import url("https://fonts.googleapis.com/css2?family=Comic+Neue:ital,wght@0,300;0,400;0,700;1,300;1,400;1,700&display=swap");
		// @import url("https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap");
		@import url("https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap");

		width: 100%;
		height: 100%;

		body {
			width: 100%;
			height: 100%;
			p {
				white-space: pre-line;
			}
		}

		* {
			box-sizing: border-box;
			margin: 0;
			padding: 0;

			outline: none;
			-webkit-tap-highlight-color: transparent;
			// font-family: 'Poppins';
			// font-family: "Comic Neue";
			font-family: "Roboto";
			// font-family: arial;
			word-break: break-word;

			// --scrollbar-size: 0.6em;
			// --scrollbar-thumb-radius: 0.2em;
			// --scrollbar-thumb-radius: 0;
			// --scrollbar-track-margin: 0;

			// --scrollbar-thumb-color: hsla(0, 0%, 0%, 0.4);
			// --scrollbar-thumb-color-hover: hsla(0, 0%, 0%, 0.6);
			// --scrollbar-track-color: hsla(0, 0%, 0%, 0.1);
			// --scrollbar-track-color-hover: hsla(0, 0%, 0%, 0.2);

			// scrollbar-width: var(--scrollbar-size);
			// scrollbar-color: var(--scrollbar-thumb-color) var(--scrollbar-track-color);
			// &::-webkit-scrollbar {
			//    height: var(--scrollbar-size);
			//    width: var(--scrollbar-size);
			//    &-thumb {
			//       border-radius: var(--scrollbar-thumb-radius);
			//       background-color: var(--scrollbar-thumb-color);
			//       &:hover {
			//          background-color: var(--scrollbar-thumb-color-hover);
			//       }
			//    }
			//    &-track {
			//       margin: var(--scrollbar-track-margin);
			//       background-color: var(--scrollbar-track-color);
			//       &:hover {
			//          background-color: var(--scrollbar-track-color-hover);
			//       }
			//    }
			// }
		}

		// color schemas
		.App {
			--primary-color: #294656;
			--primary-color-translucent: #81b6ca66;
			--primary-color-shadow: #49748940;
			--primary-color-light: var(--primary-color);
			--primary-color-dark: var(--primary-color);

			--accent-color: #fc8237;
			--accent-color-light: var(--accent-color);
			--accent-color-dark: var(--accent-color);

			--statusbar-color: #384a6a;

			--transition-duration: 500ms;
			--transition-duration: 300ms;
			--animation-duration: var(--transition-duration);

			--App-primary-color: var(--primary-color);
			--App-primary-color-light: var(--primary-color-light);
			--App-primary-color-dark: var(--primary-color-dark);
			--App-background-color: var(--background-color);
			--App-accent-color: (--accent-color);

			--Home-primary-color-light: var(--primary-color-light);
			--Home-primary-color: var(--primary-color);
			--Home-primary-color-dark: var(--primary-color-dark);

			--Manage-primary-color-light: var(--primary-color-light);
			--Manage-primary-color: var(--primary-color);
			--Manage-primary-color-dark: var(--primary-color-dark);
		}
	}

	.App {
		position: relative;
		color: black;
		width: 100%;
		height: 100%;
		height: 100vh;
		max-height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		background: none;
		transition: var(--transition-duration);
		overflow: hidden;

		.App-background {
			z-index: 1;
			position: absolute;
			width: 100%;
			height: 100%;
			pointer-events: none;
			transition: var(--transition-duration);
		}
		.App-body {
			z-index: 2;
			width: 100%;
			height: 100%;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			transition: var(--transition-duration);
			overflow: hidden;

			.App-layout {
				width: 100%;
				height: 100%;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: stretch;
				transition: var(--transition-duration);

				--status-height: 1.2em;

				.App-status {
					z-index: 2;
					font-size: 0.7em;
					display: flex;
					flex-direction: row;
					flex-grow: 0;
					align-items: center;
					justify-content: center;
					padding: 0 0.1em;
					width: 100%;
					color: white;
					pointer-events: none;
					transition: var(--animation-duration);
					background: var(--primary-color);
					--background-disconnected: #e73c2f;
					--background-connected: #0c8d0c;

					position: absolute;
					top: 0;
				}
				.App-status-isDisconnected {
					background: var(--background-disconnected);
				}
				.App-status-isConnected {
					background: var(--background-connected);
				}

				.App-layout-body {
					z-index: 1;
					width: 100%;
					height: 100%;
					display: flex;
					flex-direction: row;
					flex-grow: 1;
					align-items: center;
					justify-content: stretch;
					background-color: #f0f0f0;
					background-color: #c9d7df;
					background-color: #c9d7df;
					--background-color-light: var(--background-color);
					--background-color-dark: var(--background-color);
					transition: var(--transition-duration);
					.App-LeftNav {
						z-index: 2;
						flex-grow: 0;
					}
					.App-routerView {
						z-index: 1;
						flex-grow: 1;
						width: 100%;
						height: 100%;
					}
				}
			}
		}
		.App-overflow {
			z-index: auto;
			position: absolute;
			top: 0;
			bottom: 0;
			left: 0;
			right: 0;
			width: 100vw;
			height: 100vh;
			display: flex;
			overflow: hidden;
			.App-overflow-body {
				position: relative;
				width: 100vw;
				height: 100vh;
				display: flex;
				overflow: hidden;
				.App-imageViewer {
					z-index: 3;
				}
			}
		}
		.App-Snackbar {
			z-index: 4;
		}
	}

	.App-isNormal {
		@media (min-width: 1600px) {
			.App-body {
				padding: 1vh 4vw;
				.App-layout {
					max-width: 1800px;
					max-height: 2000px;
					box-shadow: 1px 1px 50px 0px hsla(0, 0%, 0%, 0.3);
					border-radius: 8px;
				}
			}
			.App-background {
				opacity: 0.5;
				background-image: linear-gradient(
					120deg,
					hsl(202, 61%, 33%) 4%,
					hsl(236, 66%, 24%) 95%
				);
			}
		}
	}
	.App-isFull {
		background: none;
		.App-background {
			opacity: 0;
		}
	}

	.App-isShowingStatus {
		.App-body {
			.App-layout {
				.App-status {
					height: var(--status-height);
					min-height: var(--status-height);
					max-height: var(--status-height);
					opacity: 1;
				}
				// .App-layout-body {
				//    height: calc(100% - var(--status-height));
				// }
			}
		}
	}
	.App-isHidingStatus {
		.App-body {
			.App-layout {
				.App-status {
					height: 0;
					min-height: 0;
					max-height: 0;
					opacity: 0;
				}
			}
		}
	}
</style>
