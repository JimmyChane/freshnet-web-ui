<template>
	<div class="HomeHeader-body">
		<span class="HomeHeader-name">Freshnet Enterprise</span>
		<span class="HomeHeader-description">
			We sell notebooks, printers, repairs, and more
		</span>
	</div>
</template>

<style lang="scss" scoped>
	.Home-header {
		z-index: 1;
		width: 100%;
		line-height: 1.2;

		min-height: 10rem;

		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		transition: var(--transition-duration);
		padding: 1rem 2.5rem;
		padding-bottom: 0;
		padding: 1rem;
	}

	.HomeHeader-body {
		z-index: 2;
		width: 100%;

		column-gap: 1em;

		flex-direction: column;
		text-align: center;
		align-items: flex-start;
		justify-content: center;
		color: black;
		row-gap: 0.4em;
		transition: var(--transition-duration);

		.HomeHeader-name {
			font-weight: 600;
			font-size: 1.6rem;
			text-align: start;
			line-height: 1;

			@media (min-width: 320px) {
				font-size: 1.7rem;
			}
			@media (min-width: 340px) {
				font-size: 1.85rem;
			}
			@media (min-width: 380px) {
				font-size: 2rem;
			}
			@media (min-width: 460px) {
				font-size: 2.6rem;
			}
		}
		.HomeHeader-description {
			font-size: 1rem;
			text-align: start;
			line-height: 1;
		}
	}
</style>
