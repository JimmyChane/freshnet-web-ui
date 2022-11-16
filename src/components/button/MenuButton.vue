<script>
	import OptionContainer from "../components/OptionContainer.vue";

	export default {
		Mode: OptionContainer.Mode,

		components: { OptionContainer },
		props: {
			menus: { type: Array, default: () => [] },
			icon: { type: String, default: "" },
		},
	};
</script>

<template>
	<div class="MenuButton">
		<OptionContainer
			class="MenuButton-main"
			:menus="menus"
			@mode-change="(mode) => $emit('mode-change', mode)"
		>
			<img
				class="MenuButton-main-icon"
				:src="icon ? icon : host.res('icon/option-black.svg')"
			/>
		</OptionContainer>
	</div>
</template>

<style lang="scss" scoped>
	.MenuButton {
		border-radius: 50%;
		transition: all var(--animation-duration) ease-out;
		font-weight: 600;
		font-size: 1rem;

		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;

		.MenuButton-main {
			font-size: inherit;
			border-radius: inherit;
			display: flex;

			.MenuButton-main-icon {
				z-index: 0;
				width: 1.2em;
				height: 1.2em;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
			}
		}
	}
</style>
