<script>
	import Loadingv1 from "@/components/Loading";
	import PopupWindow from "@/components/window/PopupWindow.vue";
	import Empty from "@/components/Empty.vue";
	import ActionBarManage from "@/pages/manage/ActionBarManage.vue";
	import ItemDatabase from "./ItemDatabase.vue";

	export default {
		key: "database",
		title: "Database",
		icon: { light: "database-FFFFFF", dark: "database-2A4858" },
		userPermissions: ["admin"],

		components: { Loadingv1, PopupWindow, Empty, ActionBarManage, ItemDatabase },
		emits: ["callback-side-expand"],
		data() {
			return {
				scrollTop: 0,
				imports: { data: null },
				addDatabase: { isShowing: false },
			};
		},
		computed: {
			isLoading: (c) => {
				const { loginStore, databaseStore } = c;
				return loginStore.getters.isLoading || databaseStore.getters.isLoading;
			},
			user: (c) => c.loginStore.getters.user,
			baseInfo: (c) => c.databaseStore.getters.baseInfo,
			databases: (c) => c.databaseStore.getters.items,
		},
		mounted() {
			this.loginStore.dispatch("refresh").catch((error) => {
				this.$root.feedback("Your login credential could be invalid");
				throw error;
			});
		},
		watch: {
			user() {
				this.actionRefresh();
			},
		},
		methods: {
			importDataFile(file) {
				if (!file) {
					this.imports.data = null;
					return;
				}
				let reader = new FileReader();
				reader.onload = (event) => {
					this.imports.data = reader.result;

					this.databaseStore.dispatch("imports", { json: reader.result });
				};
				reader.readAsText(file);
			},

			actionAddDatabase() {
				this.addDatabase.isShowing = true;
			},

			actionRefresh() {
				return Promise.resolve()
					.then(() => {
						if (this.user === null || !this.user.isTypeAdmin()) {
							throw new Error();
						}
						return this.databaseStore.dispatch("loadBaseInfo");
					})
					.catch((error) => {
						this.$root.feedback("Error Loading Databases");
						throw error;
					});
			},
		},
	};
</script>

<template>
	<div class="PageDatabase" @scroll="(event) => (scrollTop = event.target.scrollTop)">
		<ActionBarManage
			class="PageDatabase-actionbar"
			:hasShadow="scrollTop > 0"
			:title="$options.title"
			:rightMenus="[
				{
					key: 'refresh',
					title: 'Refresh',
					icon: host.res('icon/refresh-2A4858.svg'),
					click: () => actionRefresh(),
				},
			]"
			@click-drawer-expand="$emit('click-drawer-expand')"
		/>

		<div class="PageDatabase-body" v-if="user && baseInfo && databases.length">
			<div class="PageDatabase-import">
				<span class="PageDatabase-title">Import</span>
				<input
					type="file"
					accept=".json"
					@change="
						(event) => {
							const [file] = event.target.files;
							importDataFile(file);
						}
					"
				/>
				<p v-if="imports.data">{{ imports.data }}</p>
			</div>

			<div class="PageDatabase-baseInfo">
				<span class="PageDatabase-title">Current Database</span>
				<span v-if="baseInfo">{{ baseInfo.currentDatabase }}</span>
			</div>

			<div class="PageDatabase-databases">
				<span class="PageDatabase-title">Databases</span>
				<ItemDatabase
					class="PageDatabase-database"
					v-for="database in databases"
					:key="database.name"
					:database="database"
				/>
			</div>
		</div>

		<Empty v-if="!baseInfo && !databases.length && !isLoading" />

		<PopupWindow
			class="PageDatabase-window"
			:isShowing="addDatabase.isShowing"
			@click-dismiss="addDatabase.isShowing = false"
		>
			<div>
				<span>Create Database</span>

				<label>Database Name</label>
				<input type="text" placeholder="Database Name" />
			</div>
		</PopupWindow>

		<Loadingv1 class="PageDatabase-loading" :isRunning="isLoading" />
	</div>
</template>

<style lang="scss" scoped>
	//Abstract
	.PageDatabase-title {
		font-weight: 900;
		font-size: 1.4rem;
		color: var(--primary-color);
		letter-spacing: 0.1rem;
	}

	.PageDatabase {
		position: relative;
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		overflow: auto;

		.PageDatabase-actionbar {
			z-index: 2;
		}
		.PageDatabase-body {
			z-index: 1;
			width: 100%;
			height: 100%;
			display: flex;
			flex-direction: column;
			align-items: center;
			padding: 4rem;
			padding-bottom: 10rem;
			gap: 5rem;
			position: relative;

			& > * {
				width: 100%;
				max-width: 35rem;
				display: flex;
				flex-direction: column;
				align-items: stretch;
				gap: 0.5rem;
			}
			.PageDatabase-import {
				display: none;
			}
			.PageDatabase-baseInfo {
				font-size: 1.2rem;
			}
		}

		.PageDatabase-window {
			z-index: 3;
			display: none;
		}

		.PageDatabase-loading {
			position: absolute;
			z-index: 1;
			width: 100%;
		}
	}
</style>
