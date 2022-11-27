<script>
	import ExportOption from "./PageProductExport-Option.vue";
	import ExportLayoutOption from "./PageProductExport-LayoutOption.vue";
	import ExportButton from "./PageProductExport-Export.vue";

	import ViewerProduct from "@/pages/product/viewerProduct/ViewerProduct.vue";
	import LayoutOne from "./PageProductExport-Layout-One.vue";

	export default {
		components: {
			ExportOption,
			ExportLayoutOption,
			ExportButton,
			ViewerProduct,
			LayoutOne,
		},
		data() {
			return {
				product: null,

				options: [
					{
						title: "size",
						items: [
							{
								title: "A5",
								width: 148.5 * 3.7795275591,
								height: 210 * 3.7795275591,
							},
							{
								title: "A4",
								width: 210 * 3.7795275591,
								height: 297 * 3.7795275591,
							},
						],
						click: () => {
							const items = this.options[0].items;
							const index = items.indexOf(this.size);
							const nextIndex = index + 1;
							this.size = items[nextIndex >= items.length ? 0 : nextIndex];
							this.invalidateCard();
						},
					},
					{
						title: "Orientation",
						items: [{ title: "Portrait" }, { title: "Landscape" }],
						click: () => {
							const items = this.options[1].items;
							const index = items.indexOf(this.orientation);
							const nextIndex = index + 1;
							this.orientation =
								items[nextIndex >= items.length ? 0 : nextIndex];
							this.invalidateCard();
						},
					},
				],
				layouts: [
					{ title: "Layout 1" },
					{ title: "Layout 2" },
					{ title: "Layout 3" },
				],

				size: null,
				orientation: null,

				cardScale: 0,
			};
		},
		computed: {
			user: (c) => c.loginStore.getters.user,
			isUserAdmin: (c) => (c.user ? c.user.isTypeAdmin() : false),
			isUserStaff: (c) => (c.user ? c.user.isTypeStaff() : false),
			allowEdit: (c) => c.isUserAdmin || c.isUserStaff,

			productId: (context) => context.$route.query.productId,

			isPortrait: (c) => c.orientation.title === "Portrait",
			isLandscape: (c) => c.orientation.title === "Landscape",

			isA5: (c) => c.orientation.title === "A5",
			isA4: (c) => c.orientation.title === "A4",

			cardWidth: (c) => (c.isPortrait ? c.size.width : c.size.height),
			cardHeight: (c) => (c.isPortrait ? c.size.height : c.size.width),
		},
		watch: {
			productId() {
				this.invalidate();
			},
			user(userNow, userWas) {
				if (userWas && !userNow) {
					this.redirectToLogin();
				}
			},
		},
		created() {
			this.options[0].items.forEach((item) => {
				item.isSelected = () => item === this.size;
			});
			this.options[1].items.forEach((item) => {
				item.isSelected = () => item === this.orientation;
			});

			this.size = this.options[0].items[0];
			this.orientation = this.options[1].items[1];

			window.addEventListener("resize", this.listenerResize);
		},
		async mounted() {
			try {
				const user = await this.loginStore.dispatch("getUser");
				if (!user) this.redirectToLogin();
			} catch (error) {
				this.redirectToLogin();
			}

			// this.$root.setAppLayout(this.$root.APP_LAYOUT_MODE.FULL);
			// this.$root.setNavigationDrawerVisibiliy(
			// 	this.$root.DRAWER_VISIBILITY.NONE,
			// );

			this.invalidate();
			this.invalidateCard();
		},
		destroyed() {
			window.removeEventListener("resize", this.listenerResize);
		},
		methods: {
			listenerResize() {
				this.invalidateCard();
			},

			async invalidate() {
				this.product = null;

				const product = await this.productStore.dispatch(
					"getItemOfId",
					this.productId,
				);
				if (!product) return;

				document.title = await product.fetchFullTitle();

				this.product = product;
			},
			invalidateCard(repeatTimeout = 300) {
				const ref = this.$refs.canvas;
				if (!ref) return;
				const { offsetWidth, offsetHeight } = ref;
				const { cardWidth, cardHeight } = this;

				const scaleWidth = offsetWidth / cardWidth;
				const scaleHeight = offsetHeight / cardHeight;

				this.cardScale = scaleWidth > scaleHeight ? scaleHeight : scaleWidth;

				if (repeatTimeout) {
					setTimeout(() => this.invalidateCard(0), repeatTimeout);
				}
			},

			clickExport() {
				const ref = this.$refs.card;
				if (!ref) return;
				this.$root.print(ref);
			},

			redirectToLogin() {
				this.$router.replace({
					path: "/login",
					query: { redirect: this.$router.currentRoute.fullPath },
				});
			},
		},
	};
</script>

<template>
	<div class="PageProductExport" v-if="allowEdit">
		<div class="PageProductExport-canvas" ref="canvas">
			<div
				class="PageProductExport-card"
				ref="card"
				:style="{
					'--width': `${cardWidth}px`,
					'--height': `${cardHeight}px`,
					'--scale': `${cardScale}`,
				}"
			>
				<!-- <ViewerProduct :product="product" :isWide="isLandscape" /> -->
				<LayoutOne :product="product" />
			</div>
		</div>

		<div class="PageProductExport-toolbar">
			<div class="PageProductExport-options">
				<ExportOption
					v-for="option of options"
					:key="option.title"
					:menu="option"
				/>
			</div>

			<ExportButton @click="() => clickExport()" />
		</div>

		<!-- <div class="PageProductExport-layouts">
			<ExportLayoutOption
				v-for="layout of layouts"
				:key="layout.title"
				:title="layout.title"
			/>
		</div> -->
	</div>
</template>

<style lang="scss" scoped>
	.PageProductExport {
		width: 100%;
		height: 100%;

		display: grid;
		grid-template-areas:
			"canvas layouts"
			"toolbar layouts";
		grid-template-rows: 1fr 4rem;
		// grid-template-columns: 1fr 12rem;
		grid-template-columns: 1fr;

		.PageProductExport-canvas {
			grid-area: canvas;
			display: flex;
			align-items: center;
			justify-content: center;
			position: relative;
			margin: 1rem;

			.PageProductExport-card {
				width: var(--width);
				height: var(--height);
				min-width: var(--width);
				min-height: var(--height);
				max-width: var(--width);
				max-height: var(--height);

				background: white;
				box-shadow: 0 0 1rem hsla(0, 0%, 0%, 0.2);
				transform: scale(var(--scale));
				position: absolute;
				top: calc(0 - var(--height) * var(--scale));
				left: calc(0 - var(--width) * var(--scale));

				display: flex;
				align-items: center;
				justify-content: center;

				overflow: hidden;
			}
		}
		.PageProductExport-toolbar {
			grid-area: toolbar;
			border-top: 1px solid hsla(0, 0%, 0%, 0.1);

			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: space-between;
			gap: 0.5rem;
			padding: 0.5rem;

			.PageProductExport-options {
				gap: 0.5rem;

				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: flex-start;
			}
		}
		.PageProductExport-layouts {
			grid-area: layouts;
			background-color: white;
			border-left: 1px solid hsla(0, 0%, 0%, 0.1);
			gap: 0.5rem;
			padding: 1rem;

			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: flex-start;
		}
	}

	// @media print {
	// 	body * {
	// 		visibility: hidden;
	// 	}
	// 	.PageProductExport-card,
	// 	.PageProductExport-card * {
	// 		visibility: visible;
	// 	}
	// 	.PageProductExport-card {
	// 		position: absolute;
	// 		left: 0;
	// 		top: 0;
	// 		transform: scale(1);
	// 	}
	// }
</style>