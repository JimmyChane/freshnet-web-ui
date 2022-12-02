<script>
	export default {
		props: { item: { type: Object } },
	};
</script>

<template>
	<div class="PagePrint-item">
		<img class="PagePrint-item-icon" :src="item.icon" />
		<span class="PagePrint-item-title">{{ item.title }}</span>
		<span class="PagePrint-item-price">{{ item.price }}</span>
	</div>
</template>

<style lang="scss" scoped>
	.PagePrint-item {
		width: 100%;
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 0.5rem;

		.PagePrint-item-icon {
			width: 2rem;
			height: 2rem;
		}
		.PagePrint-item-title {
			flex-grow: 1;
		}
		.PagePrint-item-price {
			margin-left: 2rem;
		}
	}
</style>
