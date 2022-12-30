<script>
	import Window from "@/components/window/Window.vue";
	import Input from "@/components/Input.vue";
	import BodyCustomer from "./WindowUpdateService-customer.vue";

	import LayoutNumpad from "./LayoutNumpad.vue";

	import U from "@/U.js";

	export default {
		components: { Window, Input, BodyCustomer, LayoutNumpad },
		emits: ["callback-cancel", "callback-change"],
		props: {
			value: { type: Object, default: null },
		},
		data() {
			return { customerNames: [], customerPhoneNumbers: [] };
		},
		watch: {
			value() {
				this.onNewValue();
			},
		},
		methods: {
			onNewValue() {
				const value =
					this.value !== null ? this.value : { names: [], phoneNumbers: [] };
				this.customerNames = value.names.map((name) => name);
				this.customerPhoneNumbers = value.phoneNumbers.map((phoneNumber) =>
					phoneNumber.toString(),
				);
			},
			onChange() {
				const ref = this.$refs.bodyCustomer;

				this.$emit("callback-change", {
					names: ref.getValueNames(),
					phoneNumbers: ref.getValuePhoneNumbers(),
				});
			},

			focus() {
				this.$refs.bodyCustomer.focus();
			},
		},
	};
</script>

<template>
	<Window
		class="WindowCustomer"
		title="Edit Customer"
		@click-cancel="$emit('callback-cancel')"
		@click-ok="onChange"
	>
		<BodyCustomer
			ref="bodyCustomer"
			:names="customerNames"
			:phoneNumbers="customerPhoneNumbers"
		/>
	</Window>
</template>

<style lang="scss" scoped>
	.WindowCustomer {
		max-width: 100%;
		width: 35rem;

		.WindowCustomer-input {
			font-size: 1rem;
			border: none;
			background: hsla(0, 0%, 0%, 0.03);
			border-bottom: 1px solid hsl(0, 0%, 70%);
			border-radius: 0.2rem;
			padding: 0.6rem 0.4rem;
			margin-top: 2rem;
		}

		.WindowCustomer-phoneNumber {
			gap: 1rem;

			display: flex;
			flex-direction: row;
			align-items: flex-start;
			justify-content: center;
			flex-wrap: wrap;
		}
	}
</style>
