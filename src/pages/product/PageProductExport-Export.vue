<template>
	<button class="ExportExport" @click="() => $emit('click')">
		<span>Export</span>
	</button>
</template>

<style lang="scss" scoped>
	.ExportExport {
		background-color: #3e99cd;
		padding: 0.6rem 1.8rem;
		border-radius: 0.5rem;
		color: white;

		font-size: 1rem;
		border: none;
		cursor: pointer;
		transition: var(--transition-duration);

		&:hover {
			background-color: #257bad;
		}
	}
</style>
