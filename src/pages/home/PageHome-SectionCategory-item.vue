<script>
	export default {
		props: {
			title: { type: String, default: "" },
			count: { type: Number, default: 0 },
			icon: { type: String, default: "" },
			to: { default: "" },
		},
		computed: {
			subtitle() {
				if (this.count < 1) return "";
				if (this.count === 0) return "1 Product";
				return `${this.count} Products`;
			},
		},
	};
</script>

<template>
	<router-link class="SectionCategory-item" :to="to">
		<span class="SectionCategory-item-title">{{ title }}</span>
		<span class="SectionCategory-item-count">{{ subtitle }}</span>
		<img class="SectionCategory-item-icon" :src="icon" />
	</router-link>
</template>

<style lang="scss" scoped>
	.SectionCategory-item {
		--icon-size: 40px;

		display: grid;
		grid-template-areas: "title icon" "count icon";
		grid-template-columns: 1fr var(--icon-size);

		background-color: white;
		padding: 1.5rem;
		border-radius: 0.5rem;
		text-decoration: none;
		font-size: 1rem;
		color: black;
		transition: var(--transition-duration);

		&:hover {
			background-color: aqua;
			background-color: var(--accent-color);
			color: white;
		}
	}
	.SectionCategory-item-title {
		grid-area: title;
		display: flex;
		align-items: center;
		font-weight: 600;
	}
	.SectionCategory-item-count {
		grid-area: count;
		display: flex;
		align-items: center;
		font-size: 0.8rem;
	}
	.SectionCategory-item-icon {
		grid-area: icon;
		width: var(--icon-size);
		height: var(--icon-size);
	}
</style>
