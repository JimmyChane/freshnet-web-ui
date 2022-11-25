<script>
	import SearchInput from "@/components/SearchInput.vue";
	import PopupWindow from "@/components/window/PopupWindow.vue";
	import Footer from "@/app/footer/Footer.vue";

	import Actionbar from "./PageHome-Actionbar.vue";

	import SectionProduct from "./PageHome-SectionProduct.vue";
	import SectionPrint from "./PageHome-SectionPrint.vue";
	import SectionLocation from "./PageHome-SectionLocation.vue";
	import SectionAboutUs from "./PageHome-SectionAboutUs.vue";
	import SectionFeedback from "./PageHome-SectionFeedback.vue";

	import ItemSearchProduct from "./ItemSearchProduct.vue";
	import ItemSearchCategory from "./ItemSearchCategory.vue";
	import ItemSearchBrand from "./ItemSearchBrand.vue";
	import ItemSearchPs2Disc from "./ItemSearchPs2Disc.vue";
	import ItemSearchService from "./ItemSearchService.vue";

	export default {
		key: "home",
		name: "Home",
		title: "Home",
		icon: { light: "home-FFFFFF", dark: "home-2A4858" },

		components: {
			Actionbar,
			PopupWindow,
			SearchInput,
			ItemSearchProduct,
			ItemSearchCategory,
			ItemSearchBrand,
			ItemSearchPs2Disc,
			ItemSearchService,
			SectionProduct,
			SectionPrint,
			SectionLocation,
			SectionAboutUs,
			SectionFeedback,
			Footer,
		},
		data() {
			return { scrollTop: 0 };
		},
		computed: {
			isScrolledDown: (c) => c.scrollTop > 50,
			whatsappLink: (c) => {
				let phone = "60167959444";
				return `https://api.whatsapp.com/send?phone=${phone}`;
			},

			isThin: (c) => c.$root.navigation.isDrawer(),
		},
	};
</script>

<template>
	<div :class="['PageHome', `Home-${isThin ? 'isThin' : 'isWide'}`]">
		<div
			class="Home-scroll"
			@scroll="(event) => (scrollTop = event.target.scrollTop)"
		>
			<div class="Home-header-background">
				<div class="Home-header-background-body">
					<img
						class="Home-header-background-image"
						:style="{ transform: `translateY(${scrollTop / 3}px)` }"
						:src="host.res('background/store_front.webp')"
					/>
					<div class="Home-header-background-tint"></div>
				</div>
			</div>

			<Actionbar
				class="Home-actionbar"
				:isTop="!isScrolledDown"
				:isThin="isThin"
			/>

			<div class="Home-body">
				<div class="Home-header">
					<div class="Home-header-body">
						<div class="Home-header-title">
							<span class="Home-header-title-name">Freshnet Enterprise</span>
							<span class="Home-header-title-description">
								We sell notebooks, printers, repairs, and more
							</span>
						</div>
					</div>
				</div>

				<div class="Home-body-card">
					<div class="Home-sections">
						<SectionProduct :isThin="isThin" />
						<SectionPrint :isThin="isThin" />
						<SectionLocation :isThin="isThin" />
						<SectionAboutUs :isThin="isThin" v-if="false" />
						<SectionFeedback :isThin="isThin" v-if="false" />
					</div>

					<Footer />
				</div>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
	.PageHome {
		background-color: hsl(0, 0%, 90%);

		position: relative;
		display: flex;
		flex-direction: row;
		align-items: stretch;
		color: black;

		--header-background-height: 20rem;

		.Home-scroll {
			flex-grow: 1;
			z-index: 1;
			width: 100%;
			height: 100%;
			position: relative;
			overflow-x: hidden;
			overflow-y: auto;

			display: flex;
			flex-direction: column;
			align-items: stretch;
		}
		.Home-header-background {
			z-index: 1;
			position: absolute;
			width: 100%;
			height: 100%;
			min-height: var(--header-background-height);
			height: var(--header-background-height);

			.Home-header-background-body {
				position: relative;
				width: 100%;
				height: 100%;
				overflow: hidden;
				.Home-header-background-image {
					z-index: 1;
					position: absolute;
					width: 100%;
					height: 100%;
					object-fit: cover;
				}
				.Home-header-background-tint {
					z-index: 2;
					position: absolute;
					width: 100%;
					height: 100%;
					background: hsla(0, 0%, 0%, 0.8);
					background: hsla(202, 86%, 6%, 0.9);
				}
			}
		}

		.Home-actionbar {
			position: sticky;
			top: 0;
			z-index: 2;
		}

		.Home-body {
			z-index: 1;
			flex-grow: 5;
			width: 100%;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: flex-start;
		}
		.Home-header {
			z-index: 1;
			width: 100%;
			line-height: 1.2;
			min-height: calc(
				var(--header-background-height) - var(--actionbar-height)
			);

			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			position: relative;
			transition: var(--animation-duration);

			.Home-header-body {
				z-index: 2;
				width: 100%;
				max-width: 700px;
				padding: 1em 2em;
				padding-bottom: 1.5em;

				display: flex;
				flex-direction: row;
				align-items: stretch;
				justify-content: space-between;
				column-gap: 1em;
				.Home-header-title {
					display: flex;
					flex-direction: column;
					text-align: center;
					align-items: flex-start;
					row-gap: 0.4em;
					color: white;
					transition: var(--animation-duration);

					.Home-header-title-name {
						font-size: 2.7em;
						text-align: start;
						line-height: 1;
					}
					.Home-header-title-description {
						font-size: 1.2em;
						text-align: start;
						line-height: 1;
					}
				}
			}
		}
		.Home-body-card {
			z-index: 2;
			width: 100%;
			display: flex;
			flex-direction: column;
			align-items: center;
			row-gap: 1rem;
			background-color: rgb(237, 239, 243);
			border-radius: 1em 1em 0 0;
			margin-top: -2rem;
			padding-top: 2rem;
			overflow: hidden;
		}
		.Home-sections {
			margin-top: -2em;
			width: 100%;
			display: flex;
			flex-direction: column;
			align-items: center;

			padding: 1rem 0.5rem;
		}
	}

	.Home-isThin {
		--actionbar-height: 6rem;
	}
	.Home-isWide {
		--actionbar-height: 3.5rem;
	}
</style>
