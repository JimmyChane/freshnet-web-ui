<script>
	import AppHost from "@/host/AppHost.js";
	import Actionbar from "@/components/navigation/actionbar2/Actionbar.vue";
	import LayoutProductViewer from "@/pages/product/LayoutProductViewer/LayoutProductViewer.vue";
	import Tabs from "./PanelProduct-Tabs.vue";

	export default {
		components: { Actionbar, LayoutProductViewer, Tabs },
		emits: [
			"click-dismiss",
			"click-productRemove",
			"click-product-imageRemove",
			"click-product-titleBrandUpdate",
			"click-product-priceUpdate",
			"click-product-descriptionUpdate",
			"click-product-categoryUpdate",
			"click-product-specificationsUpdate",
		],
		props: {
			product: { type: Object, default: () => null },
			productPrevious: { type: Object, default: () => null },
			productNext: { type: Object, default: () => null },

			isWide: { type: Boolean, default: false },
			isEditable: { type: Boolean, default: false },
			isBackable: { type: Boolean, default: true },
		},
		data() {
			return { primaryColor: null, fullTitle: "" };
		},
		computed: {
			settings: (context) => {
				let settings = context.settingStore.getters.items;
				return Array.isArray(settings) ? settings : [];
			},

			actionbarColor() {
				if (this.primaryColor) {
					return this.primaryColor.mix("ffffff", 0.6);
				}
			},

			actionbarLeftMenus() {
				return {
					key: "close",
					title: "Close",
					icon: this.host.res("icon/close-000000.svg"),
					click: () => this.$emit("click-dismiss"),
				};
			},
			actionbarRightMenus() {
				if (!this.product) return [];
				return [
					this.isEditable
						? {
								key: "trash",
								icon: this.host.res("icon/trash-000000.svg"),
								click: () =>
									this.$emit("click-productRemove", { product: this.product }),
						  }
						: null,
					{
						key: "view",
						title: "View",
						icon: this.host.res("icon/view-000000.svg"),
						click: () => this.clickView(),
					},
					{
						key: "copy",
						title: "Copy Link",
						icon: this.host.res("icon/copy-000000.svg"),
						click: () => this.clickCopyLink(),
					},
					// {
					// 	key: "print",
					// 	title: "Print",
					// 	icon: this.host.res("icon/printer-000000.svg"),
					// 	click: () => {
					// 		console.log("print");
					// 		this.$root.print(this.$refs.PanelProduct);
					// 	},
					// },
				];
			},
			refViewer() {
				return this.$refs.viewer;
			},
		},
		watch: {
			product() {
				const { PanelProduct } = this.$refs;
				if (PanelProduct) PanelProduct.scrollTop = 0;
				this.invalidate();
			},
		},
		mounted() {
			this.invalidate();
		},
		methods: {
			async invalidate() {
				this.fullTitle = "";
				if (!this.product) return;
				this.fullTitle = await this.product.fetchFullTitle();
			},

			clickCopyLink() {
				if (!this.product) {
					this.$root.feedback("Cannot Copy");
					return;
				}
				const link = this.product.getLink();
				if (!link) {
					this.$root.feedback("Cannot Copy");
					return;
				}
				this.$root.copyText(link);
				this.$root.feedback({
					icon: this.host.res("icon/copy-FFFFFF.svg"),
					text: "Copied to Clipboard",
					actions: [{ title: "Open", click: () => this.clickView() }],
				});
			},
			clickView() {
				let urlView = `${AppHost.path}/product/view`;

				if (!this.product) {
					this.$root.openLink(urlView);
				} else {
					this.$root.openLink(`${urlView}?productId=${this.product.id}`);
				}
			},
		},
	};
</script>

<template>
	<div class="PanelProduct" ref="PanelProduct">
		<div
			class="PanelProduct-toolbar"
			:style="{ 'background-color': actionbarColor }"
		>
			<Actionbar
				class="PanelProduct-actionbar"
				:leftMenus="actionbarLeftMenus"
				:rightMenus="actionbarRightMenus"
				:style="{ 'background-color': actionbarColor }"
			>
				<span class="PanelProduct-actionbar-title" v-if="fullTitle">{{
					fullTitle
				}}</span>
			</Actionbar>

			<Tabs @click-item="(tab) => refViewer.scrollTo(tab.key)" />
		</div>

		<LayoutProductViewer
			class="PanelProduct-main"
			ref="viewer"
			:isWide="isWide"
			:isEditable="isEditable"
			:product="product"
			:productPrevious="productPrevious"
			:productNext="productNext"
			@change-primaryColor="(x) => (primaryColor = x)"
			@click-product-imageRemove="(x) => $emit('click-product-imageRemove', x)"
			@click-product-titleBrandUpdate="
				(x) => $emit('click-product-titleBrandUpdate', x)
			"
			@click-product-priceUpdate="(x) => $emit('click-product-priceUpdate', x)"
			@click-product-descriptionUpdate="
				(x) => $emit('click-product-descriptionUpdate', x)
			"
			@click-product-categoryUpdate="
				(x) => $emit('click-product-categoryUpdate', x)
			"
			@click-product-specificationsUpdate="
				(x) => $emit('click-product-specificationsUpdate', x)
			"
		/>
	</div>
</template>

<style lang="scss" scoped>
	.PanelProduct {
		width: 100%;
		height: 100%;

		background: white;
		font-size: 1.2rem;

		overflow-y: auto;
		position: relative;

		display: flex;
		justify-content: flex-start;
		flex-direction: column;
		align-items: center;

		.PanelProduct-toolbar {
			z-index: 3;
			width: 100%;
			position: sticky;
			border-bottom: 1px solid hsla(0, 0%, 0%, 0.1);
			top: 0;
			.PanelProduct-actionbar {
				border-bottom: 1px solid hsla(0, 0%, 0%, 0.1);
			}
			.PanelProduct-actionbar-title {
				display: flex;
				flex-direction: column;
				align-items: flex-start;
				justify-content: center;
				gap: 0.1rem;
				line-height: 1.1rem;

				font-weight: 600;
				font-size: 1rem;

				overflow: hidden;
				color: black;
				text-align: start;
				text-overflow: clip;

				white-space: nowrap;

				width: 100%;
			}
			.PanelProduct-tabs {
			}
		}

		.PanelProduct-main {
			z-index: 2;
			flex-grow: 1;
		}
	}
</style>
