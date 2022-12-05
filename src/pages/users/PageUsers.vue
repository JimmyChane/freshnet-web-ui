<script>
	import Loadingv1 from "@/components/Loading";
	import MenuButton from "@/components/button/MenuButton.vue";
	import Selector from "@/components/selector/Selector.vue";
	import Empty from "@/components/Empty.vue";
	import PopupWindowAction from "@/components/window/PopupWindowAction";
	import Input from "@/components/Input.vue";

	import ActionBarManage from "@/pages/manage/ActionBarManage.vue";

	import User from "@/items/User.js";

	export default {
		key: "users",
		title: "Other Users",
		icon: { light: "users-FFFFFF", dark: "users-000000" },
		userPermissions: ["admin"],

		components: {
			ActionBarManage,
			Loadingv1,
			MenuButton,
			Selector,
			Empty,
			PopupWindowAction,
			Input,
		},
		emits: ["callback-side-expand"],
		data() {
			return {
				scrollTop: 0,
				UserType: User.Type,

				window: {
					addUser: {
						isShowing: false,
						username: "",
						name: "",
						passwordNew: "",
						passwordRepeat: "",
					},
					removeUser: { isShowing: false, user: null },
					changeUserType: { isShowing: false, user: null, userType: "" },
				},
			};
		},
		computed: {
			isLoading: (c) => c.userStore.getters.isLoading,
			user: (c) => c.loginStore.getters.user,
			users: (c) => {
				return (!c.user.isTypeNone() ? c.userStore.getters.items : []).filter(
					(userParse) => {
						return userParse.username !== c.user.username;
					},
				);
			},
		},
		mounted() {
			this.onIntentRefresh();
		},
		methods: {
			getTextByKeyUserType(key) {
				if (key === User.Type.Admin) return "Admin";
				if (key === User.Type.Staff) return "Staff";
				if (key === User.Type.Customer) return "Customer";
				return "Other";
			},
			getKeyUserTypeByText(text) {
				if (text === "Admin") return User.Type.Admin;
				if (text === "Staff") return User.Type.Staff;
				if (text === "Customer") return User.Type.Customer;
				return -1;
			},

			onIntentRefresh() {
				this.userStore.dispatch("refresh").catch((error) => {
					this.$root.feedback("Failed to validate user");
				});
			},

			onIntentAddUser() {
				this.onResetAddUser();
				this.window.addUser.isShowing = true;
			},
			onDismissAddUser() {
				this.window.addUser.isShowing = false;
				this.onResetAddUser();
			},
			onFinishAddUser() {
				this.userStore
					.dispatch("addUser", {
						username: this.window.addUser.username,
						name: this.window.addUser.name,
						passwordNew: this.window.addUser.passwordNew,
						passwordRepeat: this.window.addUser.passwordRepeat,
					})
					.then((user) => {
						if (user) {
							this.window.addUser.isShowing = false;
							this.onResetAddUser();
						} else {
							this.$root.feedback("Failed to add user");
							throw new Error();
						}
					})
					.catch((error) => {
						this.$root.feedback("Error to add user");
					});
			},
			onResetAddUser() {
				this.window.addUser.username = "";
				this.window.addUser.name = "";
				this.window.addUser.passwordNew = "";
				this.window.addUser.passwordRepeat = "";
			},

			onIntentRemoveUser(user) {
				this.onResetRemoveUser();
				this.window.removeUser.user = user;
				this.window.removeUser.isShowing = true;
			},
			onDismissRemoveUser() {
				this.window.removeUser.isShowing = false;
				this.onResetRemoveUser();
			},
			onFinishRemoveUser() {
				const interfaceWindow = this.window.removeUser;
				this.userStore
					.dispatch("removeUserByUsername", {
						username: interfaceWindow.user.username,
					})
					.then((result) => {
						if (result) {
							interfaceWindow.isShowing = false;
							this.onResetRemoveUser();
						} else {
							this.$root.feedback("Failed to remove user");
							throw new Error();
						}
					})
					.catch((error) => {
						this.$root.feedback("Error to remove user");
					});
			},
			onResetRemoveUser() {
				this.window.removeUser.user = null;
			},

			onIntentChangeUserType(user) {
				this.onResetChangeUserType();
				this.window.changeUserType.isShowing = true;
				this.window.changeUserType.user = user;
				this.window.changeUserType.userType = user.userType;
			},
			onDismissChangeUserType() {
				this.window.changeUserType.isShowing = false;
				this.onResetChangeUserType();
			},
			onFinishChangeUserType() {
				return this.userStore
					.dispatch("updateTypeOfUserByUsername", {
						username: this.window.changeUserType.user.username,
						userType: this.window.changeUserType.userType,
					})
					.then((userChange) => {
						if (userChange) {
							this.window.changeUserType.isShowing = false;
							this.onResetChangeUserType();
						} else {
							this.$root.feedback("Failed to change user priviledge");
							throw new Error();
						}
					})
					.catch((error) => {
						this.$root.feedback("Error to change user priviledge");
					});
			},
			onResetChangeUserType() {
				this.window.changeUserType.user = null;
				this.window.changeUserType.userType = "";
			},
		},
	};
</script>

<template>
	<div
		class="PageUsers"
		@scroll="(event) => (scrollTop = event.target.scrollTop)"
	>
		<ActionBarManage
			:hasShadow="scrollTop > 0"
			:title="$options.title"
			:rightMenus="[
				{
					key: 'addUser',
					title: 'Add User',
					icon: host.res('icon/add-2A4858.svg'),
					click: onIntentAddUser,
				},
				{
					key: 'refresh',
					title: 'Refresh',
					icon: host.res('icon/refresh-2A4858.svg'),
					click: () => onIntentRefresh(),
				},
			]"
			@click-drawer-expand="$emit('click-drawer-expand')"
		/>

		<div
			class="PageUsers-body"
			v-if="user && user.isTypeAdmin() && users.length"
		>
			<div
				class="PageUsers-user-root"
				v-for="user in users"
				:key="user.username"
			>
				<div
					class="PageUsers-user-root-separator"
					v-if="users.indexOf(user) !== 0"
				/>

				<div class="PageUsers-user">
					<span class="PageUsers-title">{{ user.name }}</span>
					<div class="PageUsers-content">
						<span class="PageUsers-username">{{ user.username }}</span>
						<span class="PageUsers-type">{{
							getTextByKeyUserType(user.userType)
						}}</span>
					</div>
					<MenuButton
						:menus="[
							{
								key: 'changeUserType',
								title: 'Change User Type',
								interact: () => onIntentChangeUserType(user),
							},
							{
								key: 'removeUser',
								title: 'Remove User',
								interact: () => onIntentRemoveUser(user),
							},
						]"
					/>
				</div>
			</div>
		</div>

		<Empty v-if="!users.length && !isLoading" />

		<Loadingv1 class="PageUsers-loading" :isRunning="isLoading" />

		<!-- add user -->
		<PopupWindowAction
			title="Add User"
			:isShowing="window.addUser.isShowing"
			@click-dismiss="onDismissAddUser"
			@click-cancel="onDismissAddUser"
			@click-ok="onFinishAddUser"
		>
			<div class="PageUsers-window">
				<Input
					label="Username"
					:isRequired="true"
					:bindValue="window.addUser.username"
					@input="(comp) => (window.addUser.username = comp.value)"
				/>
				<Input
					label="Name"
					:isRequired="true"
					:bindValue="window.addUser.name"
					@input="(comp) => (window.addUser.name = comp.value)"
				/>
				<Input
					label="Password"
					type="password"
					:isRequired="true"
					:bindValue="window.addUser.passwordNew"
					@input="(comp) => (window.addUser.passwordNew = comp.value)"
				/>
				<Input
					label="Repeat Password"
					type="password"
					:isRequired="true"
					:bindValue="window.addUser.passwordRepeat"
					@input="(comp) => (window.addUser.passwordRepeat = comp.value)"
				/>
			</div>
		</PopupWindowAction>

		<!-- remove user -->
		<PopupWindowAction
			title="Remove User?"
			:isShowing="window.removeUser.isShowing"
			@click-dismiss="onDismissRemoveUser"
			@click-cancel="onDismissRemoveUser"
			@click-ok="onFinishRemoveUser"
		>
			<div class="PageUsers-window">
				<div class="PageUsers-window-main">
					<p class="PageUsers-window-text">Once removed, cannot be undone</p>
				</div>
			</div>
		</PopupWindowAction>

		<!-- change user -->
		<PopupWindowAction
			title="Change User Type"
			:isShowing="window.changeUserType.isShowing"
			@click-dismiss="onDismissChangeUserType"
			@click-cancel="onDismissChangeUserType"
			@click-ok="onFinishChangeUserType"
		>
			<div class="PageUsers-window">
				<div class="PageUsers-window-main">
					<span class="PageUsers-window-text">
						{{
							window.changeUserType.user
								? window.changeUserType.user.name
								: "Unknown"
						}}
						is
						{{
							getTextByKeyUserType(
								window.changeUserType.user
									? window.changeUserType.user.userType
									: "",
							)
						}}</span
					>
				</div>

				<div class="PageUsers-window-main">
					<span class="PageUsers-window-title">New User Type</span>
					<span class="PageUsers-window-required">Required</span>
					<Selector
						:list="[
							{
								key: getTextByKeyUserType(UserType.Admin),
								title: 'Admin',
							},
							{
								key: getTextByKeyUserType(UserType.Staff),
								title: 'Staff',
							},
						]"
						:keySelected="getTextByKeyUserType(window.changeUserType.userType)"
						@callback-select="
							(key) => {
								window.changeUserType.userType = getKeyUserTypeByText(key);
							}
						"
					/>
				</div>
			</div>
		</PopupWindowAction>
	</div>
</template>

<style lang="scss" scoped>
	.PageUsers {
		position: relative;
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		overflow-y: auto;

		.PageUsers-body {
			width: 100%;
			height: 100%;
			display: flex;
			flex-direction: column;
			align-items: center;
			padding: 4rem;
		}

		.PageUsers-loading {
			position: absolute;
			width: 100%;
			z-index: 100;
		}

		.PageUsers-user-root {
			width: 100%;
			max-width: 24rem;
			display: flex;
			flex-direction: column;
			align-items: stretch;
			&-separator {
				min-height: 1px;
				background: hsla(0, 0%, 0%, 0.1);
				margin: 1rem 0;
			}
			.PageUsers-user {
				display: flex;
				flex-direction: column;
				flex-direction: row;
				align-items: stretch;
				column-gap: 2rem;
				.PageUsers-title {
					flex-grow: 1;
					font-size: 1rem;
					display: flex;
					flex-direction: row;
					align-items: center;
				}
				.PageUsers-content {
					display: flex;
					flex-direction: row;
					flex-direction: column;
					justify-content: center;
					font-size: 0.8rem;
					color: hsl(0, 0%, 30%);
					line-height: 1.2;
				}
				.PageUsers-buttonOption {
					width: 2.4rem;
					height: 2.4rem;
					padding: 0.6rem;
					display: flex;
					flex-direction: row;
					align-items: center;
					justify-content: center;
					border: none;
					border-radius: 50%;
					background: none;
					cursor: pointer;
					transition: var(--animation-duration);
					&:hover,
					&:focus {
						background: hsla(0, 0%, 0%, 0.1);
					}
					&-icon {
						width: 100%;
						height: 100%;
					}
				}
			}
		}

		.PageUsers-window {
			width: 20rem;
			max-width: 100%;
			display: flex;
			flex-direction: column;
			gap: 2rem;

			.PageUsers-window-main {
				display: flex;
				flex-direction: column;
				gap: 10px;
				.PageUsers-window-title {
					font-size: 1.1rem;
					font-weight: 600;
				}
				.PageUsers-window-inputText {
					flex-grow: 1;
					font-size: 1rem;
					border: none;
					border-bottom: 1px solid hsl(0, 0%, 70%);
					background: none;
					padding: 4px 0;
				}
				.PageUsers-window-text {
					flex-grow: 1;
					font-size: 1rem;
					padding: 4px 0;
				}
				.PageUsers-window-required {
					color: hsl(0, 50%, 50%);
					font-size: 0.8rem;
				}
			}
		}
	}
</style>
