<script>
	import PopupWindowAction from "@/components/window/PopupWindowAction.vue";
	import Input from "@/components/Input.vue";

	export default {
		components: { PopupWindowAction, Input },
		props: {
			isShowing: { type: Boolean, default: false },
			input: { type: Object, default: () => null },
		},
		computed: {
			product: (c) => (c.input ? c.input.product : null),
		},
		data() {
			return { normal: "", promotion: "" };
		},
		watch: {
			input() {
				this.clear();

				if (!this.input) return;

				this.normal = this.input.price.normal.value;
				this.promotion = this.input.price.promotion.value;
			},
		},
		methods: {
			clear() {
				this.normal = "";
				this.promotion = "";
			},

			clickConfirm() {
				let output = {
					product: this.product,
					price: {
						normal: this.normal,
						promotion: this.promotion,
					},
				};

				this.$emit("click-confirm", output) && this.clear();
			},
		},
	};
</script>

<template>
	<PopupWindowAction
		title="Add Price"
		:isShowing="isShowing"
		@click-dismiss="$emit('click-dismiss') && clear()"
		@click-cancel="$emit('click-cancel') && clear()"
		@click-ok="clickConfirm()"
	>
		<div class="WindowUpdatePrice-body">
			<Input
				class="WindowUpdatePrice-input"
				label="Normal (RM)"
				:isRequired="true"
				:bindValue="normal"
				type="number"
				@input="(comp) => (normal = comp.value)"
			/>
			<Input
				class="WindowUpdatePrice-input"
				label="Promotion (RM)"
				:isRequired="true"
				:bindValue="promotion"
				type="number"
				@input="(comp) => (promotion = comp.value)"
			/>
		</div>
	</PopupWindowAction>
</template>

<style lang="scss" scoped>
	.WindowUpdatePrice-body {
		width: 26rem;
		max-width: 100%;
		display: flex;
		flex-direction: column;
		gap: 20px;

		.WindowUpdatePrice-input {
			padding-left: 0;
			padding-right: 0;
			background: hsla(0, 0%, 0%, 0.03);
		}
	}
</style>
