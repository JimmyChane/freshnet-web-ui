<script>
	import Tab from "./LayoutProductViewer-Tabs-Tab.vue";

	export default {
		components: { Tab },
		props: { items: { type: Array, default: () => [] } },
		computed: {
			item() {
				return this.items.find((item) => item.isSelected());
			},
		},
		watch: {
			item() {
				this.onItemChange();
			},
		},
		methods: {
			onItemChange() {
				const { item } = this;
				setTimeout(() => {
					if (item === this.item) this.scrollToItem();
				}, 300);
			},
			scrollToItem() {
				const { item } = this;

				const element = this._self.$el;
				const childElement = this._self.$children[this.items.indexOf(item)].$el;

				const offsetParent = this.getOffset(element);
				const offsetChild = this.getOffset(childElement);

				const parentHalfWidth = offsetParent.width / 2;
				const childCenter = offsetChild.left + offsetChild.width / 2;

				element.scrollTo({
					left: childCenter - parentHalfWidth,
					behavior: "smooth",
				});
			},
			getOffset(target) {
				return {
					width: target.offsetWidth,
					height: target.offsetHeight,
					left: target.offsetLeft,
					top: target.offsetTop,
				};
			},
		},
	};
</script>

<template>
	<div class="LayoutProductViewerTabs">
		<Tab
			v-for="item of items"
			:key="item.title"
			:item="item"
			@click="() => $emit('click-item', item)"
		/>
	</div>
</template>

<style lang="scss" scoped>
	.LayoutProductViewerTabs {
		width: 100%;
		display: flex;
		flex-direction: row;
		align-items: center;
		overflow-x: auto;
		overflow-y: hidden;
		padding: 0 0.5rem;
	}
	.LayoutProductViewerTabs {
		--scrollbar-size: 0;
		--scrollbar-thumb-radius: 0;
		--scrollbar-thumb-radius: 0;
		--scrollbar-track-margin: 0;

		--scrollbar-thumb-color: 0;
		--scrollbar-thumb-color-hover: 0;
		--scrollbar-track-color: 0;
		--scrollbar-track-color-hover: 0;

		scrollbar-width: var(--scrollbar-size);
		scrollbar-color: var(--scrollbar-thumb-color) var(--scrollbar-track-color);
		&::-webkit-scrollbar {
			height: var(--scrollbar-size);
			width: var(--scrollbar-size);
			&-thumb {
				border-radius: var(--scrollbar-thumb-radius);
				background-color: var(--scrollbar-thumb-color);
				&:hover {
					background-color: var(--scrollbar-thumb-color-hover);
				}
			}
			&-track {
				margin: var(--scrollbar-track-margin);
				background-color: var(--scrollbar-track-color);
				&:hover {
					background-color: var(--scrollbar-track-color-hover);
				}
			}
		}
	}
</style>
