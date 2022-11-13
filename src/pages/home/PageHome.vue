<script>
	import SearchInput from "@/components/SearchInput.vue";
	import PopupWindow from "@/components/window/PopupWindow.vue";
	import Footer from "@/app/Footer.vue";

	import Actionbar from "./PageHome-Actionbar.vue";
	import Header from "./PageHome-Header.vue";

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
			SearchInput,
			PopupWindow,
			Footer,
			Actionbar,
			Header,
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
		},
		computed: {
			whatsappLink: (c) => {
				let phone = "60167959444";
				return `https://api.whatsapp.com/send?phone=${phone}`;
			},

			isThin: (c) => c.$root.navigation.isDrawer(),
			isWide: (c) => !c.$root.navigation.isDrawer(),
			isWider: (c) => c.$root.navigation.isWide(),

			classes() {
				if (this.$root.window.innerWidth > 1170) return "Home-isHorizontal";
				return "Home-isVertical";
			},
		},
		mounted() {
			document.title = "Freshnet Enterprise";
		},
	};
</script>

<template>
	<div :class="['PageHome', classes]">
		<div class="Home-scroll">
			<Actionbar class="Home-actionbar" :isThin="isThin" />

			<div class="Home-body">
				<Header class="Home-header" :style="{ 'grid-area': 'header' }" />

				<SectionProduct :style="{ 'grid-area': 'product' }" :isThin="isThin" />
				<SectionPrint :style="{ 'grid-area': 'print' }" :isThin="isThin" />
				<SectionLocation :style="{ 'grid-area': 'location' }" :isThin="isThin" />
				<SectionAboutUs
					:style="{ 'grid-area': 'about' }"
					:isThin="isThin"
					v-if="false"
				/>
				<SectionFeedback
					:style="{ 'grid-area': 'feedback' }"
					:isThin="isThin"
					v-if="false"
				/>

				<!-- <Footer :style="{ 'grid-area': 'footer' }" /> -->
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
	.PageHome {
		background: linear-gradient(130.76deg, #edeff3 0%, #e4e4e4 100%);

		display: flex;
		flex-direction: row;
		align-items: stretch;
		color: black;

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
			align-items: center;

			.Home-actionbar {
				position: sticky;
				top: 0;
				z-index: 2;
			}
			.Home-body {
				z-index: 1;
				flex-grow: 5;
				width: 100%;
			}
		}
	}

	.Home-isVertical {
		--actionbar-height: 6rem;
		.Home-scroll {
			.Home-body {
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: flex-start;

				max-width: 38.5rem;
				padding: 1rem;
				gap: 1rem;
			}
		}
	}
	.Home-isHorizontal {
		--actionbar-height: 3.5rem;
		.Home-scroll {
			.Home-body {
				display: grid;
				grid-template-areas: "header header" "product print" "product location" "footer footer";
				grid-template-columns: 1fr 1fr;
				grid-template-rows: 10rem 1fr 1fr;
				justify-content: start;

				max-width: 87.5rem;
				gap: 1rem;
				padding: 2rem;
			}
		}
	}
</style>
