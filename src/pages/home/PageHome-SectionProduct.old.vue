<script>
	import Section from "./PageHome_Section.vue";
	export default {
		components: { Section },
		props: { isThin: { type: Boolean, default: false } },
	};
</script>

<template>
	<Section :isThin="isThin" title="Product We Sell">
		<div class="HomeSectionProduct-body">
			<router-link class="HomeSectionProduct-button" :to="{ path: '/product' }"
				><img :src="host.res('icon/search-FFFFFF.svg')" /><span
					>Take a Look</span
				></router-link
			>

			<div class="HomeSectionProduct-icons">
				<img :src="host.res('icon/laptop-505050.svg')" />
				<img :src="host.res('icon/monitor-505050.svg')" />
				<img :src="host.res('icon/printer-505050.svg')" />
				<img :src="host.res('icon/keyboard-505050.svg')" />
				<img :src="host.res('icon/desktop-505050.svg')" />
				<img :src="host.res('icon/speaker-505050.svg')" />
			</div>
		</div>
	</Section>
</template>

<style lang="scss" scoped>
	.HomeSectionProduct-body {
		position: relative;
		width: 100%;

		background-color: rgb(237, 239, 243);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-start;

		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: flex-start;
	}
	.HomeSectionProduct-button {
		width: 14.5rem;
		height: 2.8rem;
		max-width: 100%;

		background: #2a26d8;
		color: white;
		cursor: pointer;
		text-decoration: none;
		text-align: center;
		border-radius: 0.3rem;
		font-size: 1rem;
		gap: 0.5rem;

		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		align-items: center;
		justify-content: center;

		img {
			width: 0.9rem;
			height: 0.9rem;
		}
	}
	.HomeSectionProduct-icons {
		margin-top: 1.5rem;
		gap: 0.8rem;

		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;

		opacity: 0.7;

		& > * {
			width: 1rem;
			height: 1rem;
		}
	}
</style>
