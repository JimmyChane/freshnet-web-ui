<script>
	import ExportOption from "./PageProductExport-Option.vue";
	import ExportLayoutOption from "./PageProductExport-LayoutOption.vue";
	import ExportButton from "./PageProductExport-Export.vue";

	import LayoutOne from "./PageProductExport-Layout-One.vue";

	export default {
		components: { ExportOption, ExportLayoutOption, ExportButton, LayoutOne },
		data() {
			return {
				product: null,

				options: [
					{
						title: "Orientation",
						items: [{ title: "Portrait" }, { title: "Landscape" }],
						click: () => {
							const items = this.options[0].items;
							const index = items.indexOf(this.orientation);
							const nextIndex = index + 1;
							this.orientation =
								items[nextIndex >= items.length ? 0 : nextIndex];
							this.invalidateCard();
						},
					},
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
							const items = this.options[1].items;
							const index = items.indexOf(this.size);
							const nextIndex = index + 1;
							this.size = items[nextIndex >= items.length ? 0 : nextIndex];
							this.invalidateCard();
						},
					},
					{
						title: "Rows",
						items: [
							{ title: "1", count: 1 },
							{ title: "2", count: 2 },
						],
						click: () => {
							const items = this.options[2].items;
							const index = items.indexOf(this.row);
							const nextIndex = index + 1;
							this.row = items[nextIndex >= items.length ? 0 : nextIndex];
							this.invalidateCard();
						},
					},
					{
						title: "Columns",
						items: [
							{ title: "1", count: 1 },
							{ title: "2", count: 2 },
						],
						click: () => {
							const items = this.options[3].items;
							const index = items.indexOf(this.column);
							const nextIndex = index + 1;
							this.column = items[nextIndex >= items.length ? 0 : nextIndex];
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
				row: null,
				column: null,

				bodyWidth: 0,
				bodyHeight: 0,
				canvasScale: 0,
			};
		},
		computed: {
			user: (c) => c.loginStore.getters.user,
			allowEdit: (c) => c.user.isTypeAdmin() || c.user.isTypeStaff(),

			productId: (context) => context.$route.query.productId,

			isPortrait: (c) => c.orientation.title === "Portrait",
			isLandscape: (c) => c.orientation.title === "Landscape",

			isA5: (c) => c.orientation.title === "A5",
			isA4: (c) => c.orientation.title === "A4",

			canvasWidth: (c) => (c.isPortrait ? c.size.width : c.size.height),
			canvasHeight: (c) => (c.isPortrait ? c.size.height : c.size.width),
			canvasRowCount: (c) => c.row.count,
			canvasColumnCount: (c) => c.column.count,

			itemWidth: (c) => c.canvasWidth / c.canvasColumnCount,
			itemHeight: (c) => c.canvasHeight / c.canvasRowCount,
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
				item.isSelected = () => item === this.orientation;
			});
			this.options[1].items.forEach((item) => {
				item.isSelected = () => item === this.size;
			});
			this.options[2].items.forEach((item) => {
				item.isSelected = () => item === this.row;
			});
			this.options[3].items.forEach((item) => {
				item.isSelected = () => item === this.column;
			});

			this.orientation = this.options[0].items[0];
			this.size = this.options[1].items[1];
			this.row = this.options[2].items[1];
			this.column = this.options[3].items[0];

			window.addEventListener("resize", this.listenerResize);
		},
		async mounted() {
			try {
				const user = await this.loginStore.dispatch("getUser");
				if (user.isTypeNone()) this.redirectToLogin();
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
				const ref = this.$refs.body;
				if (!ref) return;

				this.bodyWidth = ref.offsetWidth;
				this.bodyHeight = ref.offsetHeight;

				const { canvasWidth, canvasHeight } = this;

				const scaleWidth = this.bodyWidth / canvasWidth;
				const scaleHeight = this.bodyHeight / canvasHeight;

				this.canvasScale = scaleWidth > scaleHeight ? scaleHeight : scaleWidth;

				if (repeatTimeout) {
					setTimeout(() => this.invalidateCard(0), repeatTimeout);
				}
			},

			clickExport() {
				const ref = this.$refs.canvas;
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
		<div class="PageProductExport-body" ref="body">
			<div
				class="PageProductExport-canvas"
				ref="canvas"
				:style="{
					'--body-width': `${bodyWidth}px`,
					'--body-height': `${bodyHeight}px`,

					'--canvas-width': `${canvasWidth}px`,
					'--canvas-height': `${canvasHeight}px`,
					'--canvas-scale': `${canvasScale}`,

					'--item-width': `${itemWidth}px`,
					'--item-height': `${itemHeight}px`,

					'--row-count': `${canvasRowCount}`,
					'--column-count': `${canvasColumnCount}`,
				}"
			>
				<LayoutOne :width="itemWidth" :height="itemHeight" :product="product" />
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
			"body layouts"
			"toolbar layouts";
		grid-template-rows: 1fr 4rem;
		grid-template-columns: 1fr;

		.PageProductExport-body {
			grid-area: body;
			display: flex;
			align-items: center;
			justify-content: center;
			position: relative;
			margin: 1rem;

			.PageProductExport-canvas {
				width: var(--canvas-width);
				height: var(--canvas-height);
				min-width: var(--canvas-width);
				min-height: var(--canvas-height);
				max-width: var(--canvas-width);
				max-height: var(--canvas-height);

				background: white;
				box-shadow: 0 0 1rem hsla(0, 0%, 0%, 0.2);
				transform: scale(var(--canvas-scale));
				position: absolute;
				top: calc(0 - var(--canvas-height) * var(--canvas-scale));
				left: calc(0 - var(--canvas-width) * var(--canvas-scale));

				align-items: center;
				justify-content: center;

				display: grid;
				grid-template-rows: repeat(var(--row-count), 1fr);
				grid-template-columns: repeat(var(--column-count), 1fr);

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
	// 	.App {
	// 		visibility: hidden;
	// 	}
	// 	.PageProductExport {
	// 		visibility: hidden;
	// 	}
	// 	.PageProductExport-body {
	// 		visibility: hidden;
	// 	}
	// 	.PageProductExport-canvas,
	// 	.PageProductExport-canvas * {
	// 		visibility: visible;
	// 	}
	// 	.PageProductExport-canvas {
	// 		position: absolute;
	// 		left: 0;
	// 		top: 0;
	// 		transform: scale(1);
	// 	}
	// }
</style>
