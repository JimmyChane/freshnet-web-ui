<script>
	export default { props: { isThin: { type: Boolean, default: false } } };
</script>

<template>
	<a
		:class="[
			'HomeSectionLocation',
			`HomeSectionLocation-${isThin ? 'isThin' : 'isWide'}`,
		]"
		href="https://www.google.com/maps/dir//No.+14,+Ground+Floor,+Freshnet+Enterprise,+Jalan+Melati+3%2F3,+Bandar+Melawati,+45000+Kuala+Selangor,+Selangor/@3.329664,101.256548,15z/data=!4m8!4m7!1m0!1m5!1m1!1s0x31ccf49e980c2d07:0xadf4850c7c433d0a!2m2!1d101.2565481!2d3.3296638"
		target="__blank"
	>
		<div class="HomeSectionLocation-main">
			<span class="HomeSectionLocation-title">Find Us</span>
			<div class="HomeSectionLocation-content">
				<span>No. 14, Ground Floor, Jalan</span>
				<span>Melati 3/3,Bandar Melawati</span>
			</div>
			<span class="HomeSectionLocation-click">Click to Navigate</span>
		</div>

		<img
			class="HomeSectionLocation-img"
			:style="{ 'grid-area': 'img' }"
			:src="host.res('background/store_front.webp')"
		/>
	</a>
</template>

<style lang="scss" scoped>
	.HomeSectionLocation {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;

		background: linear-gradient(101deg, #02b977 0%, #278b73 100%);

		aspect-ratio: 16/7;
		border-radius: 1em;
		overflow: hidden;
		color: white;

		text-decoration: none;
		position: relative;
		transition: var(--animation-duration);

		&:hover,
		&:focus {
			// transform: scale(1.01);
			box-shadow: 0px 0px 1.5rem #278b73;
		}

		.HomeSectionLocation-main {
			display: flex;
			flex-direction: column;
			flex-grow: 1;
			align-items: flex-start;
			padding: 2em;
			height: 100%;
			max-height: 12em;
			gap: 0.5em;
			z-index: 2;

			.HomeSectionLocation-title {
				font-weight: 600;
				font-size: 1.9em;
			}
			.HomeSectionLocation-content {
				font-size: 0.8em;
				opacity: 0.7;
				display: flex;
				flex-flow: column nowrap;
			}
			.HomeSectionLocation-click {
				flex-grow: 1;
				display: flex;
				flex-direction: column;
				justify-content: flex-end;
				text-decoration: underline;
				font-size: 0.8em;
			}
		}
		.HomeSectionLocation-img {
			z-index: 1;
			height: calc(100% - 5em);
			aspect-ratio: 1/1;
			aspect-ratio: 3/2;
			object-fit: cover;
			position: absolute;
			right: 0;
			top: 0;
			bottom: 0;
			border-radius: 0.5rem;
			transition: var(--animation-duration);
		}
	}
	.HomeSectionLocation-isThin {
		width: 100%;
		height: 100%;
		font-size: 0.8rem;
		.HomeSectionLocation-img {
			margin: 2.5em 2em 2.5em 0;
		}
	}
	.HomeSectionLocation-isWide {
		width: 100%;
		height: 100%;
		font-size: 1.2rem;
		.HomeSectionLocation-img {
			margin: 2.5em 2.5em 2.5em 0;
		}
	}
</style>
