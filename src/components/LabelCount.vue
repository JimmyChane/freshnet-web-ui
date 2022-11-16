<script>
	export default {
		props: {
			title: { type: String, default: "" },
			icon: { type: String, default: "" },
			count: { type: Number, default: 0 },
		},
	};
</script>

<template>
	<div class="LabelCount">
		<img class="LabelCount-icon" v-if="icon" :src="icon" />
		<span class="LabelCount-title" v-if="title">{{ title }}</span>
		<div class="LabelCount-line" v-if="(icon || title) && count"></div>
		<span class="LabelCount-count" v-if="count">{{ count }}</span>
	</div>
</template>

<style lang="scss" scoped>
	.LabelCount {
		width: max-content;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;

		font-size: 0.7rem;
		font-weight: 600;
		color: white;
		padding: 0.15rem 0.3rem;
		border-radius: 0.15rem;
		line-height: 1;
		background-color: var(--primary-color);

		.LabelCount-icon {
			width: 0.7rem;
			height: 0.7rem;
		}
		.LabelCount-title {
			line-height: 1;
			min-height: 0.8rem;
			display: flex;
			align-items: center;
			justify-content: center;
		}
		.LabelCount-count {
			line-height: 1;
			min-height: 0.8rem;
			display: flex;
			align-items: center;
			justify-content: center;
		}
		.LabelCount-line {
			margin: 0 0.3rem;
			min-width: 1px;
			min-height: 0.8rem;
			background-color: hsla(0, 0%, 100%, 0.3);
		}
	}
</style>
