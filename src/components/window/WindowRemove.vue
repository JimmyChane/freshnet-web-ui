<script>
	import WindowBottom from "./WindowBottom.vue";

	export default {
		components: { WindowBottom },
		emits: ["click-ok", "click-cancel"],
		props: {
			title: { type: String, default: "" },
			message: { type: String, default: "" },
			value: { type: Object, default: null },
		},
	};
</script>

<template>
	<div class="WindowRemove">
		<div class="WindowRemove-header">
			<span class="WindowRemove-header-title">{{ title }}</span>
		</div>

		<div class="WindowRemove-main">
			<span class="WindowRemove-body">{{ message }}</span>
		</div>

		<WindowBottom
			@click-cancel="$emit('click-cancel')"
			@click-ok="$emit('click-ok', value)"
		/>
	</div>
</template>

<style lang="scss" scoped>
	.WindowRemove {
		position: relative;
		width: 100%;
		display: flex;
		flex-direction: column;

		.WindowRemove-header {
			padding: 1.2rem 1.8rem;
			position: sticky;
			top: 0;
			left: 0;
			right: 0;

			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			text-align: start;
			transition: var(--transition-duration);
			border-bottom: 1px solid transparent;

			.WindowRemove-header-title {
				font-weight: 600;
				font-size: 1.5rem;
				color: black;
			}
		}

		.WindowRemove-main {
			width: 100%;
			display: flex;
			flex-direction: column;
			padding: 1.8rem 2.5rem;
			margin-bottom: 1.2rem;
		}
	}
</style>
