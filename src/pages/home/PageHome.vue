<script>
	import SearchInput from "@/components/SearchInput.vue";
	import PopupWindow from "@/components/window/PopupWindow.vue";
	import Footer from "@/app/footer/Footer.vue";

	import Actionbar from "./PageHome-Actionbar.vue";
	import Header from "./PageHome-Header.vue";

	import SectionProduct from "./PageHome-SectionProduct.vue";
	import SectionContact from "./PageHome-SectionContact.vue";
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
			SectionContact,
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

			classes() {
				if (this.$root.window.innerWidth > 1170) return "Home-isHorizontal";
				return "Home-isVertical";
			},

			contacts() {
				return [
					{
						title: "Support Contact",
						title: "Office (Mobile)",
						description: "014-631 5353",
						links: [
							{
								title: "Call",
								icon: this.host.res("icon/call-color.svg"),
								href: "tel:+60146315353",
							},
							{
								title: "Whatsapp",
								icon: this.host.res("icon/whatsapp-color.svg"),
								href: "https://api.whatsapp.com/send?phone=60146315353",
								target: "__blank,",
							},
							{
								title: "Telegram",
								icon: this.host.res("icon/telegram-color.svg"),
								href: "https://t.me/FreshnetEnterprise",
								target: "__blank",
							},
						],
					},
					{
						title: "Mr Beh",
						description: "016-795 9444",
						links: [
							{
								title: "Call",
								icon: this.host.res("icon/call-color.svg"),
								href: "tel:+60167959444",
							},
							{
								title: "Whatsapp",
								icon: this.host.res("icon/whatsapp-color.svg"),
								href: "https://api.whatsapp.com/send?phone=60167959444",
								target: "__blank,",
							},
						],
					},
					{
						title: "Office 1",
						description: "03-3281 1526",
						links: [
							{
								title: "Telephone",
								icon: this.host.res("icon/telephone-color.svg"),
								href: "tel:+60332811526",
							},
						],
					},
					{
						title: "Office 2",
						description: "03-3289 7297",
						links: [
							{
								title: "Telephone",
								icon: this.host.res("icon/telephone-color.svg"),
								href: "tel:+60332897297",
							},
						],
					},
				];
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
				<Header
					class="Home-header"
					:style="{
						'grid-column': '1 / -1',
						'grid-row': '1 / span 1',
					}"
				/>

				<SectionProduct
					:style="{
						'grid-column': 'auto / span 2',
						'grid-row': 'auto / span 4',
					}"
					:isThin="isThin"
				/>
				<SectionPrint
					:style="{
						'grid-column': 'auto / span 2',
						'grid-row': 'auto / span 2',
					}"
					:isThin="isThin"
				/>
				<SectionLocation
					:style="{
						'grid-column': 'auto / span 2',
						'grid-row': 'auto / span 2',
					}"
					:isThin="isThin"
				/>
				<SectionContact
					v-for="contact of contacts"
					:key="contact.title"
					:style="{
						'grid-column': 'auto / span 1',
						'grid-row': 'auto / span 2',
					}"
					:isThin="isThin"
					:title="contact.title"
					:description="contact.description"
					:links="contact.links"
				/>
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
			</div>

			<Footer />
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
				width: 100%;
				gap: 0.8rem;
			}
		}
	}

	.Home-isVertical {
		--actionbar-height: 6rem;
		.Home-scroll {
			.Home-body {
				padding: 1rem;

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
		.Home-scroll {
			.Home-body {
				height: max-content;
				max-width: 80rem;
				padding: 2rem;

				display: grid;
				// grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
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
