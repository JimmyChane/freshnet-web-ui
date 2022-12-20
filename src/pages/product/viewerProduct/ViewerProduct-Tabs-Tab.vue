<script>
	export default {
		props: {
			item: { type: Object, default: () => null },
		},
		computed: {
			title: (context) => context.item.title,
			isSelected: (context) => context.item.isSelected(),
		},
	};
</script>

<template>
	<button
		:class="[
			'Tabs-Tab',
			isSelected ? 'Tabs-Tab-isSelected' : 'Tabs-Tab-isDeselected',
		]"
		@click="$emit('click', item)"
		>{{ title }}</button
	>
</template>

<style lang="scss" scoped>
	.Tabs-Tab {
		min-width: max-content;
		border: none;
		background: none;
		font-weight: 600;
		font-size: 0.9rem;
		padding: 0.5rem 0.7rem;
		transition: var(--transition-duration);
	}
	.Tabs-Tab-isDeselected {
		transform: scale(0.8);
		color: hsla(0, 0%, 0%, 0.5);
		cursor: pointer;
	}
	.Tabs-Tab-isSelected {
		color: black;
	}
</style>
