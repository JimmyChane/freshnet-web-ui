<script>
	import PageProfile from "@/pages/profile/PageProfile.vue";
	import PageCustomer from "@/pages/customer/PageCustomer.vue";
	import PageService from "@/pages/service/PageService.vue";
	import PageOrder from "@/pages/order/PageOrder.vue";
	import PageUsers from "@/pages/users/PageUsers.vue";
	import PageDatabase from "@/pages/database/PageDatabase.vue";
	import PageSetting from "@/pages/setting/PageSetting.vue";

	export default {
		key: "manage",
		name: "Manage",
		title: "Manage",
		icon: { light: "manage-FFFFFF", dark: "manage-000000" },

		_children() {
			return [PageProfile];
		},
		_groups() {
			return [
				{
					key: "record",
					title: "Record",
					children: [PageCustomer, PageService, PageOrder],
				},
				{
					key: "system",
					title: "System",
					children: [PageUsers, PageDatabase, PageSetting],
				},
			];
		},

		userPermissions: ["admin", "staff"],

		computed: {
			user: (c) => c.loginStore.getters.user,
		},
		watch: {
			user(userNow, userWas) {
				if (!userWas.isTypeNone() && userNow.isTypeNone()) {
					this.redirectToLogin();
				}
			},
		},
		methods: {
			clickLogout() {
				if (this.user)
					this.loginStore.dispatch("logout").then(() => this.redirectToLogin());
			},
			redirectToLogin() {
				this.$router.replace({
					path: "/login",
					query: { redirect: this.$router.currentRoute.fullPath },
				});
			},
		},
		async mounted() {
			try {
				const user = await this.loginStore.dispatch("getUser");
				if (user.isTypeNone()) this.redirectToLogin();
			} catch (error) {
				this.redirectToLogin();
			}
		},
	};
</script>

<template>
	<div class="PageManage">
		<router-view
			class="PageManage-view"
			v-if="user"
			@click-drawer-expand="$root.openNavigationDrawer()"
		/>
	</div>
</template>

<style lang="scss" scoped>
	.PageManage {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: row;
		align-items: stretch;
		justify-content: stretch;
		overflow: hidden;

		.PageManage-view {
			width: 100%;
			height: 100%;
			flex-grow: 1;
			display: flex;
			flex-direction: column;
			align-items: stretch;
			justify-content: stretch;
			z-index: 1;
		}
	}
</style>
