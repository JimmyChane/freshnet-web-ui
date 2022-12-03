<script>
	import Actionbar from "@/components/actionbar/Actionbar.vue";
	import Layer from "./PagePrint_Layer1.vue";
	import Footer from "@/app/footer/Footer.vue";

	class Layer1 {
		constructor(title = "", layers = []) {
			this.title = title;
			this.layers = layers;
		}
	}

	export default {
		key: "print",
		title: "Printing",
		components: { Actionbar, Layer, Footer },
		data() {
			return {
				layers: [
					new Layer1("Photostat", [
						{
							title: "Plain Paper A4",
							icon: this.host.res("icon/paper-a4.svg"),
							size: "210mm x 297mm",
							layers: [
								{
									title: "Black & White",
									icon: this.host.res("icon/palette-bw.svg"),
									layers: [
										{
											title: "1 Side",
											icon: this.host.res("icon/paper-1sided.svg"),
											price: "RM 0.10",
										},
										{
											title: "2 Side",
											icon: this.host.res("icon/paper-2sided.svg"),
											price: "RM 0.20",
										},
										{
											title: "1 Side IC Full Copy",
											icon: this.host.res("icon/paper-a4-1sided-ic.svg"),
											price: "RM 0.20",
										},
									],
								},
								{
									title: "Color",
									icon: this.host.res("icon/palette-cmyk.svg"),
									layers: [
										{
											title: "1 Side",
											icon: this.host.res("icon/paper-1sided.svg"),
											price: "RM 1.00",
										},
										{
											title: "2 Side",
											icon: this.host.res("icon/paper-2sided.svg"),
											price: "RM 2.00",
										},
										{
											title: "1 Side IC Full Copy",
											icon: this.host.res("icon/paper-a4-1sided-ic.svg"),
											price: "RM 2.00",
										},
									],
								},
							],
						},
						{
							title: "Plain Paper A3",
							icon: this.host.res("icon/paper-a3.svg"),
							size: "297mm x 420mm",
							layers: [
								{
									title: "Black & White",
									icon: this.host.res("icon/palette-bw.svg"),
									layers: [
										{
											title: "1 Side",
											icon: this.host.res("icon/paper-1sided.svg"),
											price: "RM 0.20",
										},
										{
											title: "2 Side",
											icon: this.host.res("icon/paper-2sided.svg"),
											price: "RM 0.40",
										},
									],
								},
								{
									title: "Color",
									icon: this.host.res("icon/palette-cmyk.svg"),
									layers: [
										{
											title: "1 Side",
											icon: this.host.res("icon/paper-1sided.svg"),
											price: "RM 2.00",
										},
										{
											title: "2 Side",
											icon: this.host.res("icon/paper-2sided.svg"),
											price: "RM 4.00",
										},
									],
								},
							],
						},
					]),
					new Layer1("Computer Print", [
						{
							title: "Plain Paper A4",
							icon: this.host.res("icon/paper-a4.svg"),
							size: "210mm x 297mm",
							layers: [
								{
									title: "Black & White",
									icon: this.host.res("icon/palette-bw.svg"),
									layers: [
										{
											title: "1 Side",
											icon: this.host.res("icon/paper-1sided.svg"),
											price: "RM 0.50",
										},
										{
											title: "2 Side",
											icon: this.host.res("icon/paper-2sided.svg"),
											price: "RM 1.00",
										},
									],
								},
								{
									title: "Color",
									icon: this.host.res("icon/palette-cmyk.svg"),
									layers: [
										{
											title: "1 Side",
											icon: this.host.res("icon/paper-1sided.svg"),
											price: "RM 1.00",
										},
										{
											title: "2 Side",
											icon: this.host.res("icon/paper-2sided.svg"),
											price: "RM 2.00",
										},
									],
								},
							],
						},
						{
							title: "Plain Paper A3",
							icon: this.host.res("icon/paper-a3.svg"),
							size: "297mm x 420mm",
							layers: [
								{
									title: "Black & White",
									icon: this.host.res("icon/palette-bw.svg"),
									layers: [
										{
											title: "1 Side",
											icon: this.host.res("icon/paper-1sided.svg"),
											price: "RM 1.00",
										},
										{
											title: "2 Side",
											icon: this.host.res("icon/paper-2sided.svg"),
											price: "RM 2.00",
										},
									],
								},
								{
									title: "Color",
									icon: this.host.res("icon/palette-cmyk.svg"),
									layers: [
										{
											title: "1 Side",
											icon: this.host.res("icon/paper-1sided.svg"),
											price: "RM 2.00",
										},
										{
											title: "2 Side",
											icon: this.host.res("icon/paper-2sided.svg"),
											price: "RM 4.00",
										},
									],
								},
							],
						},
						{
							title: "Photo Paper 4R",
							icon: this.host.res("icon/paper-a4.svg"),
							size: "10.2cm x 15.2cm",
							layers: [
								{
									title: "Color Borderless",
									icon: this.host.res("icon/palette-cmyk.svg"),
									layers: [
										{
											title: "1 Side",
											icon: this.host.res("icon/paper-1sided.svg"),
											price: "RM 1.50",
										},
									],
								},
							],
						},
						{
							title: "Photo Paper A4",
							icon: "",
							size: "10.2cm x 15.2cm",
							layers: [
								{
									title: "Color Borderless",
									icon: this.host.res("icon/palette-cmyk.svg"),
									layers: [
										{
											title: "1 Side",
											icon: this.host.res("icon/paper-1sided.svg"),
											price: "RM 4.00",
										},
									],
								},
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
		},
	};
</script>

<template>
	<div class="PagePrint">
		<Actionbar :title="$options.title" :leftMenus="leftMenus" />

		<div class="PagePrint-layers">
			<Layer
				class="PagePrint-layer"
				v-for="layer of layers"
				:key="layer.title"
				:item="layer"
			/>
		</div>

		<Footer />
	</div>
</template>

<style lang="scss" scoped>
	.PagePrint {
		--card-background-color: #eef5f8;

		width: 100%;
		overflow-y: auto;

		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-start;

		.PagePrint-layers {
			width: 100%;
			padding: 1rem;
			gap: 1rem;

			display: grid;
			grid-template-columns: repeat(auto-fit, minmax(20rem, 1fr));
		}
		.PagePrint-layers {
			display: flex;
			flex-direction: column;
			max-width: 30rem;
		}
	}
</style>
