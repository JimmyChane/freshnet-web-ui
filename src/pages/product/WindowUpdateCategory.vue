<script>
	import PopupWindowAction from "@/components/window/PopupWindowAction.vue";
	import Selector3 from "@/components/selector/Selector3.vue";

	export default {
		components: { PopupWindowAction, Selector3 },
		props: {
			isShowing: { type: Boolean, default: false },
			input: { type: Object, default: null },
		},
		data() {
			return { outputCategoryId: "" };
		},
		computed: {
			product: (c) => (c.input ? c.input.product : null),
			categoryId: (c) => (c.input ? c.input.categoryId : ""),
			categories: (c) => c.categoryStore.getters.items,
			items: (c) => [
				{ key: "", title: "None" },
				...c.categories.map((category) => {
					return {
						key: category.id,
						title: category.title,
						icon: category.icon,
					};
				}),
			],
			itemMenus: (c) =>
				c.items.map((item) => ({
					key: item.key,
					title: item.title,
					icon: item.icon ? item.icon.toUrl() : "",
				})),
		},
		watch: {
			categoryId() {
				this.outputCategoryId = this.categoryId;
			},
		},
		methods: {
			clear() {
				this.outputCategoryId = "";
			},

			clickConfirm() {
				if (this.categoryId === this.outputCategoryId) {
					this.$root.feedback("No Changes");
					return;
				}

				let output = {
					product: this.product,
					categoryId: this.outputCategoryId,
				};

				this.$emit("click-confirm", output) && this.clear();
			},
		},
	};
</script>

<template>
	<PopupWindowAction
		class="WindowUpdateCategory"
		title="Edit Category"
		:isShowing="isShowing"
		@click-dismiss="$emit('click-dismiss') && clear()"
		@click-cancel="$emit('click-cancel') && clear()"
		@click-ok="clickConfirm()"
	>
		<div class="WindowUpdateCategory-body">
			<Selector3
				:menus="itemMenus"
				:selectedKey="outputCategoryId"
				@click-menu="
					(menu) => {
						let item = items.find((category) => category.key === menu.key);
						outputCategoryId = item ? item.key : '';
					}
				"
			/>
		</div>
	</PopupWindowAction>
</template>

<style lang="scss" scoped>
	.WindowUpdateCategory-body {
		width: 26rem;
		max-width: 100%;
		display: flex;
		flex-direction: column;
		gap: 10px;
	}
</style>
