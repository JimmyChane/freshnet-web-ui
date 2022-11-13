<script>
	import Layer from "./PagePrint_Layer2.vue";

	export default {
		components: { Layer },
		props: { item: { type: Object, default: () => null } },
	};
</script>

<template>
	<div class="PagePrint-Layer1">
		<div class="Layer1-header" v-if="item.title">{{ item.title }}</div>

		<div class="Layer1-layers">
			<Layer
				class="Layer1-layer"
				v-for="layer of item.layers"
				:key="layer.title"
				:item="layer"
			/>
		</div>
	</div>
</template>

<style lang="scss" scoped>
	.PagePrint-Layer1 {
		gap: 2px;
		height: 100%;

		border-radius: 0.8rem;
		overflow: hidden;

		display: flex;
		flex-direction: column;
		flex-wrap: nowrap;
		align-items: flex-start;
		justify-content: flex-start;

		.Layer1-header {
			width: 100%;
			gap: 0.5rem;
			padding: 1rem;
			background-color: var(--card-background-color);

			display: flex;
			flex-direction: row;
			flex-wrap: nowrap;
			align-items: center;
			justify-content: center;

			font-weight: 900;
			font-size: 1.2rem;
			text-align: center;
		}
		.Layer1-layers {
			width: 100%;
			height: 100%;
			gap: 2px;

			display: flex;
			flex-direction: column;
		}
	}
</style>
