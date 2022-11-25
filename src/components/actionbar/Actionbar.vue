<script>
	import ActionbarMenus from "./ActionbarMenus.vue";
	export default {
		components: { ActionbarMenus },
		props: {
			title: { type: String, default: "" },
			leftMenus: { default: () => [] },
			rightMenus: { default: () => [] },
		},
		computed: {
			LeftMenus: (context) => context.parseMenus(context.leftMenus),
			RightMenus: (context) => context.parseMenus(context.rightMenus),
			hasSlot: (context) => !context.$slots.footer,
		},
		methods: {
			parseMenus(menus) {
				if (Array.isArray(menus))
					return menus.filter((menu) => typeof menu === "object" && menu);
				if (typeof menus === "object") return [menus];
				return [];
			},
		},
	};
</script>

<template>
	<div class="Actionbar">
		<ActionbarMenus
			class="Actionbar-leftMenus"
			v-if="LeftMenus.length > 0"
			:menus="LeftMenus"
		/>
		<span class="Actionbar-title" v-if="title">{{ title }}</span>
		<slot v-if="hasSlot" />
		<ActionbarMenus
			class="Actionbar-rightMenus"
			v-if="RightMenus.length"
			:menus="RightMenus"
		/>
	</div>
</template>

<style lang="scss" scoped>
	.Actionbar {
		width: 100%;
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
		position: sticky;
		top: 0;
		padding: 0.6rem 0.8rem;
		transition: var(--animation-duration);
		color: var(--primary-color);

		background-color: #e5ecee;
		--actionbar-background-color-translucent: var(--actionbar-background-color);
		--actionbar-background-color-light: var(--actionbar-color);
		--actionbar-background-color-dark: var(--actionbar-color);

		@media (max-width: 800px) {
			padding: 0.4rem 0.6rem;
		}

		.Actionbar-leftMenus {
			min-width: max-content;
		}
		.Actionbar-rightMenus {
			min-width: max-content;
		}
		.Actionbar-title {
			overflow: hidden;
			display: flex;
			flex-direction: row;
			flex-grow: 0;
			align-items: center;
			justify-content: flex-start;

			font-size: 1rem;
			font-weight: 600;
			white-space: nowrap;
			text-overflow: clip;
			color: inherit;

			@media (max-width: 800px) {
				font-size: 1.4rem;
			}
		}
	}
</style>
