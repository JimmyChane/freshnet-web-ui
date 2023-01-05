<script>
	import SearchInput from "@/components/SearchInput.vue";
	import Footer from "@/app/footer/Footer.vue";

	import Actionbar from "./PageHome-Actionbar.vue";
	import Header from "./PageHome-Header.vue";

	import SectionProduct from "./PageHome-SectionProduct.vue";
	import SectionContact from "./PageHome-SectionContact.vue";
	import SectionPrint from "./PageHome-SectionPrint.vue";
	import SectionLocation from "./PageHome-SectionLocation.vue";
	import SectionHour from "./PageHome-SectionHour.vue";
	import SectionWhatElse from "./PageHome-SectionWhatElse.vue";
	import SectionAboutUs from "./PageHome-SectionAboutUs.vue";
	import SectionFeedback from "./PageHome-SectionFeedback.vue";

	export default {
		key: "home",
		name: "Home",
		title: "Home",
		icon: { light: "home-FFFFFF", dark: "home-000000" },

		components: {
			SearchInput,
			Footer,
			Actionbar,
			Header,
			SectionProduct,
			SectionContact,
			SectionPrint,
			SectionLocation,
			SectionHour,
			SectionWhatElse,
			SectionAboutUs,
			SectionFeedback,
		},
		data() {
			return { scrollTop: 0 };
		},
		computed: {
			isThin: (c) => c.$root.navigation.isDrawer(),

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
	<div
		:class="['PageHome', classes, scrollTop > 0 ? 'Home-isScrollUp' : '']"
		@scroll="(e) => (scrollTop = e.target.scrollTop)"
	>
		<Actionbar class="Home-actionbar" :isThin="isThin" />

		<div class="Home-body">
			<div>
				<Header class="Home-header" />
			</div>

			<div class="Home-section-1">
				<SectionProduct
					:style="{ 'grid-column': 'auto / span 2', 'grid-row': 'auto / span 4' }"
					:isThin="isThin"
				/>
				<SectionPrint
					:style="{ 'grid-column': 'auto / span 2', 'grid-row': 'auto / span 2' }"
					:isThin="isThin"
				/>
				<SectionLocation
					:style="{ 'grid-column': 'auto / span 2', 'grid-row': 'auto / span 2' }"
					:isThin="isThin"
				/>
			</div>

			<div>
				<span class="Home-section-title">Contact Us</span>
				<SectionContact :isThin="isThin" />
			</div>

			<div>
				<span class="Home-section-title">Business Hours</span>
				<SectionHour :isThin="isThin" />
			</div>

			<div>
				<span class="Home-section-title">What else can we do?</span>
				<SectionWhatElse :isThin="isThin" />
			</div>
		</div>

		<Footer />
	</div>
</template>

<style lang="scss" scoped>
	.PageHome {
		z-index: 1;
		width: 100%;
		height: 100%;

		display: flex;
		flex-grow: 1;
		flex-direction: column;
		align-items: center;
		color: black;

		position: relative;
		overflow-x: hidden;
		overflow-y: auto;

		.Home-actionbar {
			position: sticky;
			top: 0;
			z-index: 2;
			border-bottom: 1px solid transparent;
		}
		.Home-body {
			z-index: 1;
			width: 100%;
			gap: 1rem;

			display: flex;
			flex-direction: column;
			align-items: stretch;

			& > * {
				width: 100%;
				gap: 0.5rem;
				display: flex;
				flex-direction: column;

				.Home-section-title {
					font-size: 1.4rem;
					font-weight: 500;

					font-size: 2rem;
					color: hsl(0, 0%, 13%);

					padding-top: 3rem;
					padding-bottom: 2rem;

					display: flex;
					align-items: center;
					justify-content: center;
					text-align: center;
				}
			}
		}
	}
	.Home-isScrollUp {
		.Home-actionbar {
			border-bottom: 1px solid #0000001a;
		}
	}

	.Home-isVertical {
		--actionbar-height: 6rem;
		.Home-body {
			padding: 1.2rem;

			.Home-section-1 {
				display: grid;
				grid-template-columns: 1fr 1fr;
				grid-auto-flow: row;

				justify-content: center;
				align-items: center;
				justify-items: center;
				align-content: center;
			}
		}
	}
	.Home-isHorizontal {
		--actionbar-height: 3.5rem;
		.Home-body {
			height: max-content;
			max-width: 80rem;
			max-width: 70rem;
			padding: 2rem;

			.Home-section-1 {
				display: grid;
				grid-template-columns: 1fr 1fr 1fr 1fr;
				grid-auto-flow: row;

				justify-content: center;
				align-items: center;
				justify-items: center;
				align-content: center;
			}
		}
	}
</style>
