<script>
	import Layer from "./PagePrint_Layer4.vue";

	export default {
		components: { Layer },
		props: { item: { type: Object, default: () => null } },
	};
</script>

<template>
	<div class="PagePrint-Layer3">
		<div class="Layer3-header" v-if="item.icon || item.title">
			<span v-if="item.title">{{ item.title }}</span>
			<img class="Layer3-icon" v-if="item.icon" :src="item.icon" />
		</div>

		<div class="Layer3-layers">
			<Layer
				class="Layer3-layer"
				v-for="layer of item.layers"
				:key="layer.title"
				:item="layer"
			/>
		</div>
	</div>
</template>

<style lang="scss" scoped>
	.PagePrint-Layer3 {
		width: 100%;
		padding: 1rem;
		gap: 1.2rem;
		background-color: var(--card-background-color);

		display: flex;
		flex-direction: column;
		flex-wrap: nowrap;
		align-items: flex-start;
		justify-content: flex-start;

		.Layer3-header {
			width: 100%;
			gap: 0.8rem;
			display: flex;
			flex-direction: row;
			flex-wrap: nowrap;
			align-items: center;
			justify-content: space-between;

			font-weight: 900;

			.Layer3-icon {
				--size: 2.5rem;
				width: var(--size);
				height: var(--size);
			}
		}

		.Layer3-layers {
			width: 100%;
			gap: 0.5rem;

			display: flex;
			flex-direction: column;
		}
	}
</style>
