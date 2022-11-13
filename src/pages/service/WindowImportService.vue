<script>
	import Window from "@/components/window/Window.vue";
	import TypeSelector from "@/components/selector/TypeSelector.vue";
	import ServiceState from "@/items/tools/ServiceState.js";
	import ModuleService from "@/items/data/Service.js";
	import BelongingListEdit from "./BelongingListEdit.vue";
	import Input from "@/components/Input.vue";
	import TextArea from "@/components/InputTextArea.vue";
	import LayoutFindCustomer from "./LayoutFindCustomer.vue";

	export default {
		components: {
			Window,
			BelongingListEdit,
			TypeSelector,
			ModuleService,
			Input,
			TextArea,
			LayoutFindCustomer,
		},
		emits: ["click-cancel", "click-ok"],
		data() {
			return {
				ModuleService,
				ServiceState,

				data: {
					nameOfUser: "",
					customer: { name: "", phoneNumber: "" },
					description: "",
					belongings: [],
				},
			};
		},
		computed: {
			user: (c) => c.loginStore.getters.user,
			nameUserType: (c) => {
				if (!c.user) return "";
				if (c.user.isTypeAdmin()) return "Admin";
				if (c.user.isTypeStaff()) return "Staff";
				return "unknowna";
			},
		},
		methods: {
			resetData() {
				this.data = {
					nameOfUser: "",
					customer: { name: "", phoneNumber: "" },
					description: "",
					belongings: [],
				};

				if (!this.state) {
					this.data.state = ModuleService.State.Pending;
				}

				const now = new Date();
				now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
				now.setMilliseconds(null);
				now.setSeconds(null);
				this.$refs.DateTimeInput.value = now.toISOString().slice(0, -1);
			},
			trimData() {
				this.data.nameOfUser = this.data.nameOfUser.trim();
				this.data.customer.name = this.data.customer.name.trim();
				this.data.customer.phoneNumber = this.data.customer.phoneNumber.trim();
				this.data.description = this.data.description.trim();
				this.data.belongings = this.$refs.BelongingListEdit.getResults();
				this.data.time = Date.parse(this.$refs.DateTimeInput.value);

				return this.data;
			},

			onCancel() {
				this.$emit("click-cancel");
				this.resetData();
			},
			onOk() {
				this.data = this.trimData();

				if (Number.isNaN(this.data.time)) {
					this.$root.feedback("Date & Time Not Set");
					return;
				}

				if (!this.data.state) {
					this.$root.feedback("State Not Set");
					return;
				}

				this.serviceStore
					.dispatch("importItem", { data: this.data })
					.then((service) => {
						this.$emit("click-ok", service);
						this.resetData();
					})
					.catch((error) => {
						this.$root.feedback("Failed to import a service");
						console.error(error);
					});
			},

			clickCustomerSuggestion(customer) {
				this.data.customer.name = customer.name;
				this.data.customer.phoneNumber = customer.phoneNumber
					? customer.phoneNumber.toString()
					: "";
			},
		},
		mounted() {
			this.resetData();
		},
	};
</script>

<template>
	<Window
		class="WindowService"
		title="Import Service"
		:isLoading="serviceStore.getters.isFetching"
		:isClickable="!serviceStore.getters.isFetching"
		@click-cancel="onCancel()"
		@click-ok="onOk()"
	>
		<div class="WindowService-body">
			<div class="WindowService-user">
				<span class="WindowService-title">Who created this?</span>
				<div class="WindowService-user-name-input-body">
					<Input
						class="WindowService-user-name-input WindowService-input"
						:label="`${nameUserType}${
							typeof data.nameOfUser === 'string' &&
							data.nameOfUser.trim() === ''
								? ' (Your name here)'
								: ''
						}`"
						type="text"
						:bindValue="data.nameOfUser"
						:isRequired="true"
						@input="(comp) => (data.nameOfUser = comp.value)"
					/>
				</div>
			</div>

			<div class="WindowService-datetime">
				<span class="WindowService-title">Creation Date & Time</span>
				<div class="WindowService-datetime-body">
					<input
						class="WindowService-datetime-input"
						ref="DateTimeInput"
						type="datetime-local"
					/>
				</div>
			</div>

			<div class="WindowService-state">
				<span class="WindowService-title">States</span>
				<TypeSelector
					class="WindowEvent-type"
					:items="ServiceState.list.map((state) => state)"
					:defaultKey="data.state"
					@click-item-key="(key) => (data.state = key)"
				/>
			</div>

			<div class="WindowService-customer" v-if="data.customer">
				<Input
					class="WindowService-input"
					label="Customer Name"
					:isRequired="true"
					:bindValue="data.customer.name"
					@input="(comp) => (data.customer.name = comp.value)"
				/>
				<Input
					class="WindowService-input"
					label="Customer Phone Number"
					type="tel"
					:bindValue="data.customer.phoneNumber"
					@input="(comp) => (data.customer.phoneNumber = comp.value)"
				/>
			</div>

			<LayoutFindCustomer
				class="WindowService-findCustomers"
				:inputName="data.customer.name"
				:inputPhoneNumber="data.customer.phoneNumber"
				@click-item="(customer) => clickCustomerSuggestion(customer)"
			/>

			<div class="WindowService-description">
				<TextArea
					class="WindowService-input"
					label="Description"
					:isRequired="true"
					:bindValue="data.description"
					@input="(comp) => (data.description = comp.value)"
				/>
			</div>

			<div class="WindowService-belonging">
				<span class="WindowService-title">Belonging</span>
				<BelongingListEdit
					class="WindowService-belonging-list"
					ref="BelongingListEdit"
					:values="data.belongings"
				/>
			</div>
		</div>
	</Window>
</template>

<style lang="scss" scoped>
	.WindowService {
		max-width: 100%;
		width: 35rem;
		display: flex;
		flex-direction: column;

		.WindowService-body {
			width: 100%;
			display: flex;
			flex-direction: column;
			gap: 40px;

			// Abstract
			.WindowService-title {
				font-size: 1.1rem;
				font-weight: 900;
			}
			// Abstract
			.WindowService-input {
				font-size: 1rem;
				border: none;
				background: hsla(0, 0%, 0%, 0.03);
				border-bottom: 1px solid hsl(0, 0%, 70%);
				border-radius: 0.2rem;
				padding: 0.6rem 0.4rem;
			}

			.WindowService-user {
				width: 100%;
				display: flex;
				flex-direction: column;
				align-items: flex-start;
				gap: 0.5rem;

				.WindowService-user-title {
					font-size: 0.9rem;
					font-weight: 400;
					color: hsl(0, 0%, 50%);
				}
				.WindowService-user-name-input-body {
					width: 100%;
					display: flex;
					flex-direction: column;
					& > * {
						width: 12rem;
					}
				}
			}
			.WindowService-datetime {
				width: 100%;
				display: flex;
				flex-direction: column;
				align-items: flex-start;

				.WindowService-datetime-title {
					font-size: 0.9rem;
					font-weight: 400;
					color: hsl(0, 0%, 50%);
				}
				.WindowService-datetime-body {
					display: flex;
					flex-direction: column;
					.WindowService-datetime-input {
						border: 1px solid hsla(0, 0%, 0%, 0.1);
					}
				}
			}
			.WindowService-state {
				width: 100%;
				display: flex;
				flex-direction: column;
				align-items: flex-start;

				.WindowService-state-title {
					font-size: 0.9rem;
					font-weight: 400;
					color: hsl(0, 0%, 50%);
				}
				.WindowEvent-type {
					width: 100%;
				}
			}
			.WindowService-customer {
				width: 100%;
				display: flex;
				flex-direction: column;
				gap: 0.7rem;

				& > * {
					width: 100%;
				}
			}
			.WindowService-findCustomers {
				width: 100%;
				max-height: 20rem;
			}
			.WindowService-description {
				display: flex;
				flex-direction: column;
				gap: 0.7rem;
				& > * {
					height: 8rem;
				}
			}
			.WindowService-belonging {
				display: flex;
				flex-direction: column;
				gap: 0.7rem;
				&-list {
					width: 100%;
				}
			}
		}
	}
</style>
