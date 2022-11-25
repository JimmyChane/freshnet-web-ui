<script>
	export default {
		props: {
			title: { type: String, default: "" },
			content: { type: String, default: "" },
		},
	};
</script>
<template>
	<div class="PriceEditorItem">
		<span class="PriceEditorItem-title">{{ title }}</span>
		<span class="PriceEditorItem-value">{{ content }}</span>
	</div>
</template>
<style lang="scss" scoped>
	.PriceEditorItem {
		display: flex;
		flex-direction: row;
		align-items: flex-start;
		gap: 1rem;
		background: hsla(0, 0%, 100%, 0.6);
		padding: 1.2rem;

		.PriceEditorItem-title {
			min-width: 5rem;
			min-height: 1rem;
			font-weight: 400;
			font-size: 0.7rem;
		}
		.PriceEditorItem-value {
			min-height: 1rem;
			font-size: 1rem;
		}
	}
</style>
