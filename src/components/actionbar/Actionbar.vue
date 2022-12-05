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
		<span class="Actionbar-title">{{ title }}</span>
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
		--actionbar-background-color-translucent: var(--actionbar-background-color);
		--actionbar-background-color-light: var(--actionbar-color);
		--actionbar-background-color-dark: var(--actionbar-color);
		transition: var(--animation-duration);
		color: black;
		background-color: #f3f3f3;

		position: sticky;
		top: 0;

		--height: 3.8rem;

		width: 100%;
		min-height: var(--height);
		max-height: var(--height);
		padding: 0.6rem;

		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		align-items: center;
		justify-content: flex-start;

		.Actionbar-leftMenus {
			min-width: max-content;
		}
		.Actionbar-rightMenus {
			min-width: max-content;
		}
		.Actionbar-title {
			font-size: 1.3rem;
			font-weight: 600;
			white-space: nowrap;
			text-overflow: clip;
			color: inherit;

			margin: 0 0.8rem;
			overflow: hidden;

			display: flex;
			flex-direction: row;
			flex-grow: 1;
			align-items: center;
			justify-content: flex-start;
		}
	}
</style>
