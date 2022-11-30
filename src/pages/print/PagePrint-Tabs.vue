<script>
	import Tab from "./PagePrint-Tabs-Tab.vue";

	export default {
		components: { Tab },
		props: { items: { type: Array, default: () => [] } },
		computed: {
			selectedItem() {
				return this.items.find((item) => item.isSelected());
			},
		},
		watch: {
			selectedItem() {
				this.onItemChange();
			},
		},
		methods: {
			onItemChange() {
				const { selectedItem } = this;
				setTimeout(() => {
					if (selectedItem === this.selectedItem)
						this.scrollToItem(selectedItem);
				}, 300);
			},
			scrollToItem(item) {
				const element = this._self.$el;
				const childElement = this._self.$children[this.items.indexOf(item)].$el;

				const parentHalfWidth = element.offsetWidth / 2;
				const childCenter =
					childElement.offsetLeft + childElement.offsetWidth / 2;

				element.scrollTo({
					left: childCenter - parentHalfWidth,
					behavior: "smooth",
				});
			},
		},
	};
</script>

<template>
	<div class="PagePrintTabs">
		<Tab
			v-for="item of items"
			:key="item.title"
			:item="item"
			@click="() => $emit('click-item', item)"
		/>
	</div>
</template>

<style lang="scss" scoped>
	.PagePrintTabs {
		width: 100%;
		min-height: 2.5rem;
		display: flex;
		flex-direction: row;
		align-items: center;
		overflow-x: scroll;
		overflow-y: hidden;
		padding: 0 0.5rem;
	}
	.PagePrintTabs {
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
