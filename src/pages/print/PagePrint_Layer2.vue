<script>
	import Layer from "./PagePrint_Layer3.vue";

	export default {
		components: { Layer },
		props: { item: { type: Object, default: () => null } },
	};
</script>

<template>
	<div class="PagePrint-Layer2">
		<div class="Layer2-header" v-if="item.title || item.icon">
			<span v-if="item.title">{{ item.title }}</span>
			<img class="Layer2-icon" v-if="item.icon" :src="item.icon" />
		</div>

		<div class="Layer2-layers">
			<Layer
				class="Layer2-layer"
				v-for="layer of item.layers"
				:key="layer.title"
				:item="layer"
			/>
		</div>
	</div>
</template>

<style lang="scss" scoped>
	.PagePrint-Layer2 {
		width: 100%;
		height: 100%;

		display: flex;
		flex-direction: column;
		flex-wrap: nowrap;
		align-items: flex-start;
		justify-content: flex-start;

		.Layer2-header {
			width: 100%;
			padding: 0.6rem 1rem;
			gap: 0.5rem;
			background-color: var(--card-background-color);

			display: flex;
			flex-direction: row;
			flex-wrap: nowrap;
			align-items: center;
			justify-content: space-between;

			font-weight: 900;

			.Layer2-icon {
				--size: 2.5rem;
				width: var(--size);
				height: var(--size);
			}
		}

		.Layer2-layers {
			width: 100%;
			height: 100%;
			gap: 6px;
			padding: 6px;
			background-color: var(--card-background-color);

			display: flex;
			flex-direction: column;
			align-items: center;

			& > * {
				border-radius: 12px;
				border: 1px solid #afc7d1;
			}
		}
	}
</style>
