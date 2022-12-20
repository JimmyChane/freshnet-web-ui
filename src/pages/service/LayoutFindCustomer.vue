<script>
	export default {
		props: {
			inputName: { type: String, default: "" },
			inputPhoneNumber: { type: String, default: "" },
		},
		data() {
			return { customerTemplates: [], customerSuggestions: [] };
		},
		watch: {
			inputName() {
				this.input();
			},
			inputPhoneNumber() {
				this.input();
			},
		},
		mounted() {
			this.invalidate();
		},
		methods: {
			async invalidate() {
				this.customerTemplates = [];
				this.customerSuggestions = [];
				const customers = await this.customerStore.dispatch(
					"generateCustomersAcross",
				);

				this.customerTemplates = customers;
				this.input();
			},

			async input() {
				if (this.inputName.length === 0 && this.inputPhoneNumber.length === 0) {
					this.customerSuggestions = [];
					return;
				}

				const name = this.inputName.toLowerCase();
				const phoneNumber = this.inputPhoneNumber;

				const templates = this.customerTemplates.reduce(
					(templates, template) => {
						const isNameInclude = template.name.toLowerCase().includes(name);
						const ePhoneNumber = this.customerPhoneNumberStr(template);
						const isPhoneNumberInclude = ePhoneNumber.includes(phoneNumber);

						if (isNameInclude && isPhoneNumberInclude) templates.push(template);
						return templates;
					},
					[],
				);

				if (templates.length === 0) {
					this.customerSuggestions = [];
					return;
				}
				if (templates.length === 1) {
					const template = templates[0];
					const ePhoneNumber = this.customerPhoneNumberStr(template);
					if (name === template.name && phoneNumber === ePhoneNumber) {
						this.customerSuggestions = templates;
						return;
					}
				}

				this.customerSuggestions = templates;
			},

			clickItem(customer) {
				this.$emit("click-item", customer);
				setTimeout(() => (this.customerSuggestions = []), 200);
			},
			clickClose() {
				this.customerSuggestions = [];
				this.$emit("click-close");
			},

			customerName(customer) {
				return customer.name;
			},
			customerPhoneNumberStr(customer) {
				const { phoneNumber } = customer;
				return phoneNumber ? phoneNumber.toString() : "";
			},
		},
	};
</script>

<template>
	<div class="LayoutFindCustomer" v-if="customerSuggestions.length">
		<div class="LayoutFindCustomer-body">
			<div class="LayoutFindCustomer-header">
				<span class="LayoutFindCustomer-title">Find Customers</span>
				<button class="LayoutFindCustomer-close" @click="() => clickClose()">
					<img
						class="LayoutFindCustomer-close-img"
						:src="host.res('icon/close-000000.svg')"
					/>
				</button>
			</div>
			<div class="LayoutFindCustomer-list">
				<button
					class="LayoutFindCustomer-item"
					v-for="customerSuggestion of customerSuggestions"
					:key="`${customerSuggestion.name}${
						customerSuggestion.phoneNumber
							? customerSuggestion.phoneNumber.toString()
							: ''
					}`"
					@click="() => clickItem(customerSuggestion)"
				>
					<span class="LayoutFindCustomer-item-name">{{
						customerSuggestion.name
					}}</span>
					<div
						class="LayoutFindCustomer-item-dot"
						v-if="
							customerSuggestion.name &&
							customerPhoneNumberStr(customerSuggestion)
						"
					></div>
					<span class="LayoutFindCustomer-item-phoneNumber">{{
						customerSuggestion.phoneNumber
							? customerSuggestion.phoneNumber.toString()
							: ""
					}}</span>
				</button>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
	.LayoutFindCustomer {
		width: 100%;
		display: flex;
		flex-direction: column;
		background-color: white;
		border-radius: 0.6rem;
		box-shadow: 0.2rem 0.4rem 2rem hsla(0, 0%, 0%, 0.4);
		overflow: hidden;

		.LayoutFindCustomer-body {
			width: 100%;
			max-height: 20rem;
			display: flex;
			flex-direction: column;
			overflow-y: auto;
			position: relative;
			padding-bottom: 4rem;
			.LayoutFindCustomer-header {
				position: sticky;
				top: 0;
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: space-between;
				background-color: white;
				padding: 1rem;
				border-bottom: 1px solid hsla(0, 0%, 0%, 0.1);
				.LayoutFindCustomer-title {
					font-size: 1.4rem;
					font-weight: 600;
				}
				.LayoutFindCustomer-close {
					width: 2rem;
					height: 2rem;
					background: none;
					border: none;
					border-radius: 50%;
					display: flex;
					align-items: center;
					justify-content: center;
					cursor: pointer;

					&:hover {
						background-color: hsla(0, 0%, 0%, 0.05);
					}

					.LayoutFindCustomer-close-img {
						width: 1rem;
						height: 1rem;
					}
				}
			}

			.LayoutFindCustomer-list {
				display: flex;
				flex-direction: column;
				gap: 0.2rem;
				padding: 1rem;

				.LayoutFindCustomer-item {
					display: flex;
					flex-direction: row;
					flex-wrap: nowrap;
					align-items: center;
					gap: 0.6rem;
					padding: 0.4rem;

					border: none;
					border: 1px solid hsla(0, 0%, 0%, 0.1);
					background: none;
					transition: var(--transition-duration);
					font-size: 1rem;
					display: flex;
					cursor: pointer;
					border-radius: 0.2rem;
					&:hover {
						background-color: hsla(0, 0%, 0%, 0.05);
					}

					.LayoutFindCustomer-item-dot {
						--size: 4px;
						width: var(--size);
						height: var(--size);
						min-width: var(--size);
						min-height: var(--size);
						max-width: var(--size);
						max-height: var(--size);
						background: hsla(0, 0%, 0%, 0.2);
						border-radius: 50%;
						display: flex;
					}
				}
			}
		}
	}
</style>
