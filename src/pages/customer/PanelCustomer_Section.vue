<script>
	import ButtonIcon from "@/components/button/ButtonIcon.vue";
	export default {
		components: { ButtonIcon },
		props: {
			title: { type: String, default: "" },
			menus: { default: () => [] },
		},
		computed: {
			theMenus() {
				if (Array.isArray(this.menus)) return this.menus;
				if (typeof this.menus === "object" && this.menus) return [this.menus];
				return [];
			},
		},
	};
</script>

<template>
	<div class="PanelCustomer-section">
		<div class="PanelCustomer-section-body">
			<div class="PanelCustomer-section-header">
				<div class="PanelCustomer-section-title">{{ title }}</div>

				<div class="PanelCustomer-section-menus" v-if="theMenus.length">
					<ButtonIcon
						v-for="menu of theMenus"
						:key="menu.title"
						:src="menu.icon"
						@click="() => menu.click()"
					/>
				</div>
			</div>

			<div class="PanelCustomer-section-main"> <slot /> </div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
	.PanelCustomer-section {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: flex-start;

		.PanelCustomer-section-body {
			width: 100%;
			display: flex;
			flex-direction: column;
			align-items: flex-start;
			justify-content: flex-start;

			background: hsla(0, 0%, 100%, 0.5);
			// border-bottom: 1px solid hsla(0, 0%, 0%, 0.15);
			.PanelCustomer-section-header {
				width: 100%;
				display: flex;
				flex-direction: row;
				flex-wrap: nowrap;
				align-items: flex-start;
				justify-content: space-between;
				min-height: 1.8rem;
				.PanelCustomer-section-title {
					text-align: start;
					font-weight: 900;
					flex-grow: 1;
					font-size: 1.2rem;
					color: hsl(0, 0%, 0%);
					padding: 1rem;
					padding-bottom: 0.4rem;
				}
				.PanelCustomer-section-menus {
					width: max-content;
					display: flex;
					flex-direction: row;
					align-items: center;
					justify-content: flex-end;
					margin-top: 0.2rem;
					margin-right: 0.2rem;
				}
			}
			.PanelCustomer-section-main {
				width: 100%;
				padding: 1rem;
				padding-top: 0.4rem;
			}
		}
	}
</style>
