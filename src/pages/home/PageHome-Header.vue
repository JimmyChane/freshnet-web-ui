<script>
	import Company from "@/host/Company";
	export default {
		data() {
			return {
				companyTitle: Company.name,
				companyCategory: Company.category,
				addressHref: Company.Location.toHref(),
			};
		},
	};
</script>

<template>
	<div class="HomeHeader">
		<span class="HomeHeader-title">
			<span class="HomeHeader-name">{{ companyTitle }}</span>
			<a class="HomeHeader-classification" :href="addressHref" target="__blank"
				>{{ companyCategory }}<br />Kuala Selangor District</a
			>
		</span>
		<!-- <span class="HomeHeader-description"
			>We sell notebooks, printers, repairs, and more</span
		> -->
		<span class="HomeHeader-greeting">Hi, how can we help you?</span>
	</div>
</template>

<style lang="scss" scoped>
	.HomeHeader {
		column-gap: 1em;
		row-gap: 0.4em;
		color: black;
		text-align: center;

		z-index: 2;
		width: 100%;

		display: flex;
		flex-direction: column;
		text-align: center;
		align-items: center;
		justify-content: center;

		margin-top: 2rem;
		font-size: 1rem;

		.HomeHeader-title {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;

			.HomeHeader-name {
				font-weight: 600;
				font-size: 1.6em;
				line-height: 1;
			}
			.HomeHeader-classification {
				font-size: 0.4em;
				line-height: 1em;
				cursor: pointer;
				color: inherit;
				text-decoration: inherit;

				&:hover {
					text-decoration: underline;
				}
			}
		}
		.HomeHeader-description {
			font-size: 1em;
			line-height: 1em;
		}
		.HomeHeader-greeting {
			font-size: 0.7em;

			--height: 6rem;
			min-height: var(--height);
			max-height: var(--height);

			display: flex;
			align-items: inherit;
			justify-content: inherit;
		}

		@media (min-width: 320px) {
			font-size: 1.1rem;
		}
		@media (min-width: 340px) {
			font-size: 1.2rem;
		}
		@media (min-width: 350px) {
			font-size: 1.3rem;
		}
		@media (min-width: 380px) {
			font-size: 1.4rem;
		}
		@media (min-width: 480px) {
			font-size: 1.8rem;
		}
		@media (min-width: 500px) {
			font-size: 1.9rem;
		}
	}
</style>
