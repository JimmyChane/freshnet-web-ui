<script>
	import Actionbar from "@/components/actionbar/Actionbar.vue";
	import Tabs from "./PagePrint-Tabs.vue";
	import Card from "./PagePrint-Card.vue";
	import Footer from "@/app/footer/Footer.vue";

	import PaperSide from "./PaperSide";
	import Paper from "./Paper";
	import Printout from "./Printout";

	class Layer1 {
		constructor(title = "", layers = []) {
			this.title = title;
			this.layers = layers;
		}
	}

	class Item {
		constructor(paperSide, price) {
			this.title = paperSide.title;
			this.icon = paperSide.icon;
			this.price = price;
		}
	}
	class Preview {
		constructor(printout, items) {
			this.title = printout.toString();
			this.icon = printout.color.icon;
			this.items = items;
		}
	}

	export default {
		key: "print",
		title: "Printing",
		components: { Actionbar, Tabs, Card, Footer },
		data() {
			return {
				layers: [
					new Layer1("Photostat", [
						{
							title: Paper.PlainA4.toString(),
							icon: Paper.PlainA4.paperType.icon,
							size: Paper.PlainA4.paperType,
							layers: [
								new Preview(Printout.BlackWhite, [
									new Item(PaperSide.Front, "RM 0.10"),
									new Item(PaperSide.FrontBack, "RM 0.20"),
									new Item(PaperSide.FrontIc, "RM 0.20"),
								]),
								new Preview(Printout.Colorful, [
									new Item(PaperSide.Front, "RM 1.00"),
									new Item(PaperSide.FrontBack, "RM 1.00"),
									new Item(PaperSide.FrontIc, "RM 2.00"),
								]),
							],
						},
						{
							title: Paper.PlainA3.toString(),
							icon: Paper.PlainA3.paperType.icon,
							size: Paper.PlainA3.paperType,
							layers: [
								new Preview(Printout.BlackWhite, [
									new Item(PaperSide.Front, "RM 0.20"),
									new Item(PaperSide.FrontBack, "RM 0.40"),
								]),
								new Preview(Printout.Colorful, [
									new Item(PaperSide.Front, "RM 2.00"),
									new Item(PaperSide.FrontBack, "RM 4.00"),
								]),
							],
						},
					]),
					new Layer1("Computer Print", [
						{
							title: Paper.PlainA4.toString(),
							icon: Paper.PlainA4.paperType.icon,
							size: Paper.PlainA4.paperType,
							layers: [
								new Preview(Printout.BlackWhite, [
									new Item(PaperSide.Front, "RM 0.50"),
									new Item(PaperSide.FrontBack, "RM 1.00"),
								]),
								new Preview(Printout.Colorful, [
									new Item(PaperSide.Front, "RM 1.00"),
									new Item(PaperSide.FrontBack, "RM 2.00"),
								]),
							],
						},
						{
							title: Paper.PlainA3.toString(),
							icon: Paper.PlainA3.paperType.icon,
							size: Paper.PlainA3.paperType,
							layers: [
								new Preview(Printout.BlackWhite, [
									new Item(PaperSide.Front, "RM 1.00"),
									new Item(PaperSide.FrontBack, "RM 2.00"),
								]),
								new Preview(Printout.Colorful, [
									new Item(PaperSide.Front, "RM 2.00"),
									new Item(PaperSide.FrontBack, "RM 4.00"),
								]),
							],
						},
						{
							title: Paper.Photo4R.toString(),
							icon: Paper.Photo4R.paperType.icon,
							size: Paper.Photo4R.paperType,
							layers: [
								new Preview(Printout.BorderlessColorful, [
									new Item(PaperSide.Front, "RM 1.50"),
								]),
							],
						},
						{
							title: Paper.PhotoA4.toString(),
							icon: Paper.PhotoA4.paperType.icon,
							size: Paper.PhotoA4.paperType,
							layers: [
								new Preview(Printout.BorderlessColorful, [
									new Item(PaperSide.Front, "RM 4.00"),
								]),
							],
						},
					]),
					new Layer1("Laminate Document", [
						{
							layers: [
								{
									layers: [
										{ title: "A4", price: "RM 2.00" },
										{ title: "A3", price: "RM 4.00" },
									],
								},
							],
						},
					]),
					new Layer1("Scan Document", [
						{
							layers: [
								{
									layers: [
										{ title: "A4", price: "RM 0.50" },
										{ title: "A3", price: "RM 0.50" },
									],
								},
							],
						},
					]),
					new Layer1("Binding", [
						{
							layers: [
								{
									title: "Comb",
									layers: [
										{ title: "8mm", price: "RM 1.00" },
										{ title: "10mm", price: "RM 1.00" },
										{ title: "12mm", price: "RM 1.50" },
										{ title: "14mm", price: "RM 2.00" },
										{ title: "16mm", price: "RM 2.00" },
										{ title: "25mm", price: "RM 3.00" },
									],
								},
								{
									layers: [{ title: "Tape & Staple", price: "RM 1.00" }],
								},
							],
						},
					]),
				],

				tab0: null,
				tab1: null,
				tab2: null,
			};
		},
		computed: {
			leftMenus() {
				if (!this.$root.navigation.isDrawer()) return [];

				return [
					{
						title: "Home",
						icon: this.host.res("img/freshnet-enterprise-logo.svg"),
						click: () => this.$router.push("/home"),
					},
					{
						title: "Hamburger Menu",
						icon: this.host.res(`icon/hamburgerMenu-000000.svg`),
						click: () => this.$root.openNavigationDrawer(),
					},
				];
			},

			tabs0() {
				return this.layers.map((layer) => {
					const tab = { title: layer.title };
					tab.isSelected = () => tab === this.tab0;
					tab.click = () => {
						this.tab0 = tab;
						this.tab1 = this.tabs1[0];
					};
					return tab;
				});
			},
			tabs1() {
				if (this.tabs0.length === 0) return [];

				const layer = this.layers.find((layer) => {
					return layer.title === this.tab0.title;
				});

				if (!layer) return [];
				if (!Array.isArray(layer.layers)) return [];
				if (layer.layers.length === 0) return [];

				return layer.layers.map((layer) => {
					const tab = { title: layer.title };
					tab.isSelected = () => tab === this.tab1;
					tab.click = () => (this.tab1 = tab);
					return tab;
				});
			},
			tabs2() {
				if (this.tabs1.length === 0) return [];

				const layer = this.layers
					.find((layer) => layer.title === this.tab0.title)
					.layers.find((layer) => layer.title === this.tab1.title);

				if (!layer) return [];
				if (!Array.isArray(layer.layers)) return [];
				if (layer.layers.length === 0) return [];

				return layer.layers.map((layer) => {
					const tab = { title: layer.title };
					tab.isSelected = () => tab === this.tab2;
					tab.click = () => (this.tab2 = tab);
					return tab;
				});
			},

			currentLayer() {
				if (this.tabs1.length === 0) return null;

				const layer1 = this.layers.find((layer) => {
					return layer.title === this.tab0.title;
				});
				const layer2 = layer1.layers.find((layer) => {
					return layer.title === this.tab1.title;
				});
				const layer3 = layer2.layers.find((layer) => {
					return layer.title === this.tab2.title;
				});

				if (layer2) return layer2;
				if (layer1) return layer1;
				if (layer3) return layer3;

				console.log(layer);

				return layer;
			},
		},
		created() {
			this.tab0 = this.tabs0[0];
			this.tab1 = this.tabs1[0];
			this.tab2 = this.tabs2[0];
		},
	};
</script>

<template>
	<div class="PagePrint">
		<Actionbar
			class="PagePrint-actionbar"
			:title="$options.title"
			:leftMenus="leftMenus"
		/>

		<div class="PagePrint-tabs">
			<Tabs v-if="tabs0.length" :items="tabs0" />
			<Tabs v-if="tabs1.length" :items="tabs1" />
		</div>

		<div class="PagePrint-body" v-if="currentLayer">
			<Card
				v-for="preview of currentLayer.layers"
				:key="preview.title"
				:preview="preview"
			/>
		</div>

		<Footer />
	</div>
</template>

<style lang="scss" scoped>
	.PagePrint {
		width: 100%;
		overflow-y: auto;

		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-start;

		.PagePrint-actionbar {
			z-index: 2;
		}

		.PagePrint-tabs {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: flex-start;
			margin-bottom: 1rem;
		}

		.PagePrint-body {
			z-index: 1;
			gap: 2rem;
			padding: 1rem;

			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			flex-grow: 1;
			align-items: flex-start;
			justify-content: center;
		}
	}
</style>
