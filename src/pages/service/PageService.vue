<script>
	import Loadingv1 from "@/components/Loading.vue";
	import PopupWindow from "@/components/window/PopupWindow.vue";
	import WindowRemove from "@/components/window/WindowRemove.vue";
	import PanelServices from "./PanelServices.vue";
	import PanelService from "./PanelService.vue";
	import WindowSearch from "./WindowSearch.vue";
	import WindowImportService from "./WindowImportService.vue";
	import WindowAddService from "./WindowAddService.vue";
	import WindowAddEvent from "./WindowAddEvent.vue";
	import WindowUpdateDescription from "./WindowUpdateDescription.vue";
	import WindowUpdateBelonging from "./WindowUpdateBelonging.vue";
	import WindowViewImage from "./WindowViewImage.vue";
	import WindowUpdateCustomer from "./WindowUpdateCustomer.vue";
	import Drawer from "@/components/Drawer.vue";

	export default {
		key: "service",
		title: "Services",
		icon: { light: "service-FFFFFF", dark: "service-2A4858" },
		userPermissions: ["admin", "staff"],

		components: {
			PanelServices,
			Loadingv1,
			PopupWindow,
			PanelService,
			WindowSearch,
			WindowImportService,
			WindowAddService,
			WindowAddEvent,
			WindowUpdateCustomer,
			WindowViewImage,
			WindowUpdateDescription,
			WindowUpdateBelonging,
			WindowRemove,
			Drawer,
		},
		emits: ["callback-side-expand"],
		data() {
			return {
				actions: {
					onClickClose: () =>
						this.$root.nextRoute({ query: { service: null } }),
					onClickRemove: (x) => this.clickDeleteService(x),
					onClickAddEvent: (x) => this.clickAddEvent(x),
					onClickRemoveEvent: (x) => this.clickRemoveEvent(x),
					onClickOpenImage: (x) => this.clickImage(x),
					onClickRemoveImage: (x) => this.clickRemoveImage(x),
					onClickUpdateCustomer: (x) => this.clickUpdateCustomer(x),
					onClickUpdateDescription: (x) => this.clickUpdateDescription(x),
					onClickUpdateBelongings: (x) => this.clickUpdateBelongings(x),
				},

				popup: {
					search: {
						isShowing: false,
						start: (context, self, data) => (self.isShowing = true),
						dismiss: (context, self, data) => (self.isShowing = false),
					},
					importService: {
						isShowing: false,
						start: (context, self, data) => (self.isShowing = true),
						dismiss: (context, self, data) => (self.isShowing = false),
						ok: (context, self, data) => {
							self.isShowing = false;
							context.clickService(data);
						},
					},
					newService: {
						isShowing: false,
						start: (context, self, data) => (self.isShowing = true),
						dismiss: (context, self, data) => (self.isShowing = false),
						ok: (context, self, data) => {
							context.serviceStore
								.dispatch("addItem", { data })
								.then((result) => {
									self.isShowing = !result;
									context.clickService(result);
								})
								.catch((error) => {
									context.$root.feedback("Failed to create a service");
									throw error;
								});
						},
					},
					removeService: {
						isShowing: false,
						value: null,
						start: (context, self, data) => {
							self.isShowing = true;
							self.value = data;
						},
						dismiss: (context, self, data) => {
							self.isShowing = false;
							self.value = null;
						},
						ok: (context, self, data) => {
							context.serviceStore
								.dispatch("removeItemOfId", { id: data.id })
								.then(() => {
									self.dismiss(context, self);
									if (context.currentServiceId === data.id) {
										context.$root.replaceRoute({ query: { service: null } });
									}
								})
								.catch((error) => {
									context.$root.feedback("Delete Failed");
									throw error;
								});
						},
					},
					newEvent: {
						isShowing: false,
						start: (context, self, data) => (self.isShowing = true),
						dismiss: (context, self, data) => (self.isShowing = false),
						ok: (context, self, data) => {
							context.serviceStore
								.dispatch("addEventToId", {
									serviceID: context.currentService.id,
									data,
								})
								.then((event) => {
									self.dismiss(context, self);
								})
								.catch((error) => {
									context.$root.feedback("Failed to create an event");
									throw error;
								});
						},
					},
					removeEvent: {
						isShowing: false,
						value: null,
						start: (context, self, data) => {
							self.isShowing = true;
							self.value = data;
						},
						dismiss: (context, self, data) => {
							self.isShowing = false;
							self.value = null;
						},
						ok: (context, self, data) => {
							context.serviceStore
								.dispatch("removeEventFromId", {
									serviceID: data.service.id,
									time: data.event.timestamp.time,
								})
								.then((result) => {
									context.clickService(data.service);
									self.dismiss(context, self);
								});
						},
					},
					customer: {
						isShowing: false,
						value: null,
						start: (context, self, data) => {
							self.isShowing = true;
							self.value = data;
						},
						dismiss: (context, self, data) => {
							self.isShowing = false;
							self.value = null;
						},
						ok: (context, self, data) => {
							context.serviceStore
								.dispatch("updateCustomerOfId", {
									serviceID: context.currentService.id,
									customer: data,
								})
								.then((service) => {
									self.dismiss(context, self);
								})
								.catch((error) => {
									context.$root.feedback("Update Customer Failed");
									throw error;
								});
						},
					},
					viewImage: {
						isShowing: false,
						value: null,
						start: (context, self, data) => {
							const imageFiles = context.currentService.imageFiles;
							const index = imageFiles.indexOf(data);

							self.isShowing = true;
							self.value = { imageFiles, index };
						},
						dismiss: (context, self, data) => {
							self.isShowing = false;
							self.value = null;
						},
						ok: (context, self, data) => {
							self.isShowing = false;
						},
					},
					removeImage: {
						isShowing: false,
						value: null,
						start: (context, self, data) => {
							self.isShowing = true;
							self.value = data;
						},
						dismiss: (context, self, data) => {
							self.isShowing = false;
							self.value = null;
						},
						ok: (context, self, data) => {
							context.serviceStore
								.dispatch("removeImageFromId", {
									serviceID: context.currentService.id,
									image: data,
								})
								.then((service) => {
									context.windowAction("viewImage", "dismiss");
									self.dismiss(context, self);
								})
								.catch((error) => {
									context.$root.feedback("Delete Image Failed");
									throw error;
								});
						},
					},
					editDescription: {
						isShowing: false,
						value: "",
						start: (context, self, data) => {
							self.isShowing = true;
							self.value = data;
						},
						dismiss: (context, self, data) => {
							self.isShowing = false;
							self.value = "";
						},
						ok: (context, self, data) => {
							context.serviceStore
								.dispatch("updateDescriptionOfId", {
									serviceID: context.currentService.id,
									description: data,
								})
								.then((service) => {
									self.dismiss(context, self);
								})
								.catch((error) => {
									context.$root.feedback("Update Description Failed");
									throw error;
								});
						},
					},
					belongings: {
						isShowing: false,
						values: [],
						start: (context, self, data) => {
							self.isShowing = true;
							self.values = data;
						},
						dismiss: (context, self, data) => {
							self.isShowing = false;
							self.values = [];
						},
						ok: (context, self, data) => {
							context.serviceStore
								.dispatch("updateBelongingsOfId", {
									serviceID: context.currentService.id,
									belongings: data,
								})
								.then((service) => {
									self.dismiss(context, self);
								})
								.catch((error) => {
									context.$root.feedback("Update Belongings Failed");
									throw error;
								});
						},
					},
				},

				searchResults: [],

				currentService: null,
				drawerService: null,
			};
		},
		computed: {
			itemDrawerEdge: () => Drawer.Edge.RIGHT,
			itemDrawerMode() {
				if (this.isWide) {
					return this.currentService
						? Drawer.Mode.FIXED_EXPAND
						: Drawer.Mode.FIXED_COLLAPSE;
				} else {
					return this.currentService
						? Drawer.Mode.DRAWER_EXPAND
						: Drawer.Mode.DRAWER_COLLAPSE;
				}
			},

			isWide: (c) => c.$root.window.innerWidth > 1200,

			actionMenus() {
				let actionMenus = [];

				if (this.isCurrentStatePending) {
					actionMenus.push({
						key: "add",
						title: "Add",
						icon: this.host.res("icon/add-2A4858.svg"),
						click: this.clickAddService,
					});
				}

				if (
					this.isCurrentStatePending &&
					this.isCurrentUserAdmin &&
					this.isCurrentUserDefault
				) {
					actionMenus.push({
						key: "import",
						title: "Import",
						click: this.clickImportService,
					});
				}

				if (this.currentUser) {
					actionMenus.push({
						key: "refresh",
						title: "Refresh",
						icon: this.host.res("icon/refresh-2A4858.svg"),
						click: this.clickRefresh,
					});
				}

				return actionMenus;
			},

			currentUser() {
				return this.loginStore.getters.user;
			},
			isCurrentUserAdmin() {
				return this.currentUser ? this.currentUser.isTypeAdmin() : false;
			},
			isCurrentUserDefault() {
				return this.currentUser ? this.currentUser.isDefault() : false;
			},

			currentState() {
				return this.$route.query.state;
			},
			isCurrentStatePending() {
				return this.currentState === "pending";
			},

			services() {
				return this.serviceStore.getters.items;
			},
			currentServiceId() {
				return this.$route.query.service;
			},
		},
		watch: {
			services() {
				this.invalidate();
			},
			currentServiceId() {
				this.invalidate();
			},

			currentService() {
				if (!this.currentService) {
					setTimeout(() => {
						this.drawerService = this.currentService;
					}, 700);
				} else {
					this.drawerService = this.currentService;
				}
			},
		},
		mounted() {
			this.invalidate();
			this.serviceStore.dispatch("refresh");
		},
		methods: {
			async invalidate() {
				await this.loginStore.dispatch("refresh");
				await this.invalidateServiceId();
			},
			async invalidateServiceId() {
				this.currentService = null;
				if (this.currentServiceId) {
					const services = await this.serviceStore.dispatch("getItems");
					this.currentService = services.find((service) => {
						return service.id === this.currentServiceId;
					});
				}
			},

			clickRefresh() {
				this.serviceStore.dispatch("refresh");
			},
			clickAddService() {
				this.windowAction("newService", "start");
			},
			clickImportService() {
				this.windowAction("importService", "start");
			},
			clickDeleteService(service) {
				this.windowAction("removeService", "start", service);
			},
			clickService(service) {
				if (this.currentService) {
					this.$root.replaceRoute({
						query: { service: service ? service.id : null },
					});
				} else {
					this.$root.nextRoute({
						query: { service: service ? service.id : null },
					});
				}
			},
			clickAddEvent() {
				this.windowAction("newEvent", "start");
			},
			clickRemoveEvent(event) {
				this.windowAction("removeEvent", "start", event);
			},
			clickUpdateCustomer(customer) {
				this.windowAction("customer", "start", customer);
			},
			clickUpdateDescription(description) {
				this.windowAction("editDescription", "start", description);
			},
			clickUpdateBelongings(belongings) {
				this.windowAction("belongings", "start", belongings);
			},
			clickImage(image) {
				this.windowAction("viewImage", "start", image);
			},
			clickRemoveImage(image) {
				this.windowAction("removeImage", "start", image);
			},

			windowAction(window, action, data) {
				const self = this.popup[window];
				self[action](this, self, data);
			},
		},
	};
</script>

<template>
	<div class="PageService">
		<div
			:class="[
				'PageService-panels',
				`PageService-${isWide ? 'isWide' : 'isThin'}`,
			]"
		>
			<PanelServices
				class="PageService-PanelServices"
				:menus="actionMenus"
				:services="services"
				:currentItem="currentService"
				@click-service="(item) => clickService(item)"
				@click-drawer-expand="$emit('click-drawer-expand')"
				@click-search="() => windowAction('search', 'start')"
			/>

			<div class="PageService-PanelRightEmpty">
				<span class="PageService-PanelRightEmpty-text">Select to view</span>
			</div>

			<Drawer
				class="PageService-RightDrawer"
				:class="[isWide ? 'PageService-RightDrawer-isWide' : '']"
				:edge="itemDrawerEdge"
				:mode="itemDrawerMode"
				:isExpand="!!currentService"
				:isDrawer="!isWide || !!drawerService"
				@click-collapse="$root.nextRoute({ query: { service: null } })"
			>
				<PanelService
					class="PageService-PanelRight"
					:service="drawerService"
					:actions="actions"
				/>
			</Drawer>
		</div>

		<WindowSearch
			class="PageService-window"
			:isShowing="popup.search.isShowing"
			:items="services"
			@click-dismiss="() => windowAction('search', 'dismiss')"
			@click-item="(item) => clickService(item)"
		/>

		<!-- View Image Window -->
		<WindowViewImage
			class="PageService-window"
			v-if="drawerService && popup.viewImage.value !== null"
			:isShowing="popup.viewImage.isShowing"
			:imageFiles="popup.viewImage.value.imageFiles"
			:index="popup.viewImage.value.index"
			@click-close="() => windowAction('viewImage', 'dismiss')"
		/>

		<!-- Import Service Window -->
		<PopupWindow
			class="PageService-window"
			:isShowing="popup.importService.isShowing"
			@click-dismiss="() => windowAction('importService', 'dismiss')"
		>
			<WindowImportService
				class="PageService-window-child"
				@click-cancel="() => windowAction('importService', 'dismiss')"
				@click-ok="(service) => windowAction('importService', 'ok', service)"
			/>
		</PopupWindow>

		<!-- Add Service Window -->
		<PopupWindow
			class="PageService-window"
			:isShowing="popup.newService.isShowing"
			@click-dismiss="() => windowAction('newService', 'dismiss')"
		>
			<WindowAddService
				class="PageService-window-child"
				@callback-create="(data) => windowAction('newService', 'ok', data)"
				@callback-cancel="() => windowAction('newService', 'dismiss')"
			/>
		</PopupWindow>

		<!-- Add Event Window -->
		<PopupWindow
			class="PageService-window"
			v-if="drawerService"
			:isShowing="popup.newEvent.isShowing"
			@click-dismiss="() => windowAction('newEvent', 'dismiss')"
		>
			<WindowAddEvent
				class="PageService-window-child"
				@callback-create="(event) => windowAction('newEvent', 'ok', event)"
				@callback-cancel="() => windowAction('newEvent', 'dismiss')"
			/>
		</PopupWindow>

		<!-- Update Service Customer Window -->
		<PopupWindow
			class="PageService-window"
			v-if="drawerService"
			:isShowing="popup.customer.isShowing"
			@click-dismiss="() => windowAction('customer', 'dismiss')"
		>
			<WindowUpdateCustomer
				class="PageService-window-child"
				:value="popup.customer.value"
				@callback-change="
					(customer) => windowAction('customer', 'ok', customer)
				"
				@callback-cancel="() => windowAction('customer', 'dismiss')"
			/>
		</PopupWindow>

		<!-- Update Service Description Window -->
		<PopupWindow
			class="PageService-window"
			v-if="drawerService"
			:isShowing="popup.editDescription.isShowing"
			@click-dismiss="() => windowAction('editDescription', 'dismiss')"
		>
			<WindowUpdateDescription
				class="PageService-window-child"
				:description="popup.editDescription.value"
				@callback-change="
					(description) => windowAction('editDescription', 'ok', description)
				"
				@callback-cancel="() => windowAction('editDescription', 'dismiss')"
			/>
		</PopupWindow>

		<!-- Update Service Belonging Window -->
		<PopupWindow
			class="PageService-window"
			v-if="drawerService"
			:isShowing="popup.belongings.isShowing"
			@click-dismiss="() => windowAction('belongings', 'dismiss')"
		>
			<WindowUpdateBelonging
				class="PageService-window-child"
				:values="popup.belongings.values"
				@callback-change="
					(belongings) => windowAction('belongings', 'ok', belongings)
				"
				@callback-cancel="() => windowAction('belongings', 'dismiss')"
			/>
		</PopupWindow>

		<!-- Remove Service Window -->
		<PopupWindow
			class="PageService-window"
			:isShowing="popup.removeService.isShowing"
			@click-dismiss="() => windowAction('removeService', 'dismiss')"
		>
			<WindowRemove
				class="PageService-window-child"
				title="Delete Service"
				message="After deleting this service, it cannot be reverted."
				:value="popup.removeService.value"
				@click-cancel="() => windowAction('removeService', 'dismiss')"
				@click-ok="(service) => windowAction('removeService', 'ok', service)"
			/>
		</PopupWindow>

		<!-- Remove Event Window -->
		<PopupWindow
			class="PageService-window"
			v-if="drawerService"
			:isShowing="popup.removeEvent.isShowing"
			@click-dismiss="() => windowAction('removeEvent', 'dismiss')"
		>
			<WindowRemove
				class="PageService-window-child"
				title="Delete Event"
				message="After deleting this event, it cannot be reverted."
				:value="popup.removeEvent.value"
				@click-cancel="() => windowAction('removeEvent', 'dismiss')"
				@click-ok="(value) => windowAction('removeEvent', 'ok', value)"
			/>
		</PopupWindow>

		<!-- Remove Image Window -->
		<PopupWindow
			class="PageService-window"
			v-if="drawerService"
			:isShowing="popup.removeImage.isShowing"
			@click-dismiss="() => windowAction('removeImage', 'dismiss')"
		>
			<WindowRemove
				class="PageService-window-child"
				title="Delete Image"
				message="After deleting this image, it cannot be reverted."
				:value="popup.removeImage.value"
				@click-cancel="() => windowAction('removeImage', 'dismiss')"
				@click-ok="(image) => windowAction('removeImage', 'ok', image)"
			/>
		</PopupWindow>

		<Loadingv1
			class="PageService-loading"
			:isRunning="serviceStore.getters.isLoading"
		/>
	</div>
</template>

<style lang="scss" scoped>
	.PageService {
		display: flex;
		flex-direction: column;
		align-items: stretch;
		justify-content: stretch;
		width: 100%;
		height: 100%;
		max-width: 100%;
		max-height: 100%;
		position: relative;
		background-color: #e5ecee;

		--body-padding: 0.9rem;

		.PageService-panels {
			width: 100%;
			height: 100%;
			z-index: 1;
			overflow: hidden;
			position: relative;

			display: flex;
			flex-direction: row;
			flex-grow: 1;
			align-items: stretch;

			.PageService-PanelServices {
				z-index: 1;
			}
			.PageService-PanelRightEmpty {
				z-index: 2;
				background-color: #adb8bb;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				.PageService-PanelRightEmpty-text {
					font-weight: 900;
					font-size: 1.2rem;
					color: hsl(0, 0%, 84%);
					background: hsla(0, 0%, 0%, 0.04);
					border-radius: 1rem;
					padding: 4rem 5rem;
				}
			}

			.PageService-RightDrawer {
				z-index: 3;
				.PageService-PanelRight {
					width: 100vw;
					max-width: 100%;
				}
			}
		}
		.PageService-isThin {
			.PageService-PanelServices {
				width: 100vw;
				max-width: 100%;
			}
			.PageService-PanelRightEmpty {
				display: none;
			}
			.PageService-RightDrawer {
				width: 100vw;
				max-width: 100%;
			}
		}
		.PageService-isWide {
			.PageService-PanelServices {
				width: 100vw;
				max-width: 50%;
			}
			.PageService-PanelRightEmpty {
				width: 100vw;
				max-width: 50%;
			}
			.PageService-RightDrawer {
				width: 100vw;
				max-width: 50%;
				position: absolute;
			}
		}

		.PageService-window {
			z-index: 4;
			position: absolute;
			.PageService-window-child {
				max-width: 100%;
				height: 100%;
				overflow: auto;
			}
		}

		.PageService-loading {
			z-index: 5;
			bottom: 0;
			position: absolute;
		}
	}
</style>