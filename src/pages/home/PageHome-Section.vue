<script>
	export default {
		props: {
			title: { type: String, default: "" },
			isThin: { type: Boolean, default: false },
		},
	};
</script>

<template>
	<div :class="['PageHomeSection', `PageHomeSection-${isThin ? 'isThin' : 'isWide'}`]">
		<div class="PageHomeSection-title" v-if="title">
			<div class="PageHomeSection-title-line"></div>
			<span>{{ title }}</span>
		</div>
		<div class="PageHomeSection-body"><slot /></div>
	</div>
</template>

<style lang="scss" scoped>
	.PageHomeSection {
		width: 100%;
		max-width: 43.75rem;
		display: flex;
		flex-direction: column;
		flex-wrap: nowrap;
		align-items: stretch;
		gap: 1rem;
		transition: var(--animation-duration);
	}

	.PageHomeSection-title {
		width: fit-content;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: center;
		gap: 0.2rem;
		transition: var(--animation-duration);

		font-size: 1.6rem;
		font-weight: 900;
	}
	.PageHomeSection-title-line {
		background: #d8c626;
		min-height: 0.3rem;
		min-width: 33%;
		border-radius: 0.5rem;
	}
	.PageHomeSection-body {
		display: flex;
		flex-direction: column;
		align-items: stretch;
		overflow: hidden;
	}

	.PageHomeSection-isThin {
		padding: 2rem 1rem;
	}
	.PageHomeSection-isWide {
		padding: 2rem;
	}
</style>
