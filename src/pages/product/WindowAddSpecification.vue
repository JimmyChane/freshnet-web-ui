<script>
	import PopupWindowAction from "@/components/window/PopupWindowAction.vue";
	import Spinner from "@/components/selector/Spinner.vue";
	import ProductSpecType from "@/items/ProductSpecType.js";
	import Input from "@/components/Input.vue";

	const keys = Object.keys(ProductSpecType.Key).map((objectKey) => {
		return ProductSpecType.Key[objectKey];
	});

	export default {
		components: { PopupWindowAction, Spinner, Input },
		props: {
			isShowing: { type: Boolean, default: false },
			action: { type: Object, default: null },
		},
		data() {
			return { data: { key: "", content: "" } };
		},
		computed: {
			typeSelections: (c) => {
				return c.specificationStore.getters.items
					.map((item) => ({
						key: item.key,
						title: item.title,
						icon: item.icon ? item.icon.toUrl() : "",
						item: item,
					}))
					.sort((item1, item2) => {
						let key1 = item1.key;
						let key2 = item2.key;

						let index1 = keys.indexOf(key1);
						let index2 = keys.indexOf(key2);

						index1 = index1 >= 0 ? index1 : keys.length;
						index2 = index2 >= 0 ? index2 : keys.length;

						return index1 !== index2 ? index1 - index2 : key1.localeCompare(key2);
					});
			},
		},
		methods: {
			onDismiss() {
				this.action.onDismiss();
				this.data = { key: "", content: "" };
			},
			onCancel() {
				this.action.onCancel();
				this.data = { key: "", content: "" };
			},
			onConfirm() {
				Promise.resolve()
					.then(() => {
						const selection = this.typeSelections.find(
							(typeSelection) => typeSelection.key === this.data.key,
						);
						if (!selection) {
							this.store.dispatch("snackbarShow","Cannot find the matching type");
							throw new Error();
						}

						return {
							type: selection.key,
							content: this.data.content,
						};
					})
					.then((specification) => {
						this.action.onConfirm(specification);
					})
					.catch((error) => {
						this.store.dispatch("snackbarShow","Error While Loading Specification");
					});
				return;
			},
		},
	};
</script>

<template>
	<PopupWindowAction
		class="WindowSpecificationAdd"
		title="Add Specification"
		:isShowing="isShowing"
		@click-dismiss="onDismiss"
		@click-cancel="onCancel"
		@click-ok="onConfirm"
	>
		<div class="WindowSpecificationAdd-body">
			<div class="WindowSpecificationAdd-section">
				<span>Type</span>
				<Spinner
					:list="typeSelections"
					@callback-select="(key) => (data.key = key)"
				/>
			</div>

			<div class="WindowSpecificationAdd-section">
				<Input
					class="WindowSpecificationAdd-input"
					label="Content"
					:isRequired="true"
					:bindValue="data.content"
					@input="(comp) => (data.content = comp.value)"
				/>
			</div>
		</div>
	</PopupWindowAction>
</template>

<style lang="scss" scoped>
	.WindowSpecificationAdd-body {
		width: 26rem;
		height: 35rem;
		max-width: 100%;
		max-height: 100%;
		display: flex;
		flex-direction: column;
		align-items: stretch;
		.WindowSpecificationAdd-section {
			width: 100%;
			display: flex;
			flex-direction: column;
			gap: 20px;
			.WindowSpecificationAdd-input {
				padding-left: 0;
				padding-right: 0;
			}
		}
	}
</style>
