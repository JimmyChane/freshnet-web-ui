<script>
	import Window from "@/components/window/Window.vue";
	import Input from "@/components/Input.vue";
	import TextArea from "@/components/InputTextArea.vue";
	import BelongingListEdit from "./BelongingListEdit.vue";
	import LayoutFindCustomer from "./LayoutFindCustomer.vue";

	export default {
		components: {
			Window,
			Input,
			TextArea,
			BelongingListEdit,
			LayoutFindCustomer,
		},
		emits: ["callback-create", "callback-cancel"],
		data() {
			return {
				nameOfUser: "unknown",
				data: {
					customerName: "",
					customerPhoneNumber: "",
					belongings: [],
					description: "",
				},
			};
		},
		computed: {
			user: (c) => c.loginStore.getters.user,
			userIsAdmin: (c) => c.user.isTypeAdmin() && c.user.username === "admin",
			userIsStaff: (c) => c.user.isTypeStaff() && c.user.username === "staff",
			userIsDefault: (c) => c.userIsAdmin || c.userIsStaff,
			nameUserType: (c) => {
				if (c.user.isTypeAdmin()) return "admin";
				if (c.user.isTypeStaff()) return "staff";
				return "unknown";
			},
		},
		watch: {
			user() {
				let user = this.user;
				if (!user.isTypeNone()) {
					this.nameOfUser = this.userIsDefault ? "" : user.name;
				}
			},
		},
		mounted() {
			this.onReset();
			this.onUser();
		},
		methods: {
			clickCustomerSuggestion(customer) {
				this.data.customerName = customer.name;
				this.data.customerPhoneNumber = customer.phoneNumber
					? customer.phoneNumber.toString()
					: "";
			},

			onUser() {
				this.loginStore.dispatch("refresh");
			},
			onReset() {
				this.data = {
					customerName: "",
					customerPhoneNumber: "",
					belongings: [],
					description: "",
				};
			},
			onCreate() {
				const data = {
					customer: {
						name: this.data.customerName.trim(),
						phoneNumber: this.data.customerPhoneNumber.trim(),
					},
					description: this.data.description.trim(),
					belongings: this.$refs.BelongingListEdit.getResults(),
				};

				if (this.userIsDefault && !this.nameOfUser.trim()) {
					this.$root.feedback("You must specify your name");
				} else if (!data.customer.name) {
					this.$root.feedback("You must specify customer name");
				} else if (!data.description) {
					this.$root.feedback("You must specify description");
				} else {
					if (this.userIsDefault && this.nameOfUser.trim()) {
						data.nameOfUser = this.nameOfUser;
					}

					this.$emit("callback-create", data);
					this.onReset();
					this.onUser();
				}
			},

			focus() {
				this.$refs.InputCustomerName.focus();
			},
		},
	};
</script>

<template>
	<Window
		class="WindowService"
		title="Add Service"
		:isLoading="serviceStore.getters.isFetching"
		:isClickable="!serviceStore.getters.isFetching"
		@click-cancel="
			() => {
				$emit('callback-cancel');
				onUser();
				onReset();
			}
		"
		@click-ok="onCreate()"
	>
		<div class="WindowService-body">
			<div class="WindowService-user" v-if="userIsDefault">
				<Input
					class="WindowService-input WindowService-user-input"
					:label="`${nameUserType}${
						nameOfUser.trim() === '' ? ' (Your name here)' : ''
					}`"
					:isRequired="true"
					:bindValue="nameOfUser"
					@input="(comp) => (nameOfUser = comp.value)"
				/>
			</div>

			<div class="WindowService-customer">
				<Input
					class="WindowService-input"
					label="Customer Name"
					ref="InputCustomerName"
					:isRequired="true"
					:bindValue="data.customerName"
					@input="(comp) => (data.customerName = comp.value)"
				/>
				<Input
					class="WindowService-input"
					label="Customer Phone Number"
					type="tel"
					:bindValue="data.customerPhoneNumber"
					@input="(comp) => (data.customerPhoneNumber = comp.value)"
				/>
			</div>

			<LayoutFindCustomer
				class="WindowService-findCustomers"
				:inputName="data.customerName"
				:inputPhoneNumber="data.customerPhoneNumber"
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
				<span class="WindowService-belonging-title">Belonging</span>
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

		.WindowService-body {
			width: 100%;
			display: flex;
			flex-direction: column;
			gap: 40px;

			// Abstract
			.WindowService-input {
				font-size: 1rem;
				background: hsla(0, 0%, 0%, 0.03);
				border-radius: 0.2rem;
				padding: 0.6rem;
			}

			.WindowService-user {
				width: 100%;
				display: flex;
				flex-direction: column;
				align-items: flex-start;

				.WindowService-user-input {
					width: 12rem;
				}
			}
			.WindowService-customer {
				width: 100%;
				display: flex;
				flex-direction: column;
				gap: 0.7rem;
			}
			.WindowService-findCustomers {
				width: 100%;
				max-height: 20rem;
			}
			.WindowService-belonging {
				display: flex;
				flex-direction: column;
				gap: 0.7rem;
				.WindowService-belonging-title {
					font-size: 1.1rem;
					font-weight: 600;
				}
				.WindowService-belonging-list {
					width: 100%;
				}
			}
			.WindowService-description {
				display: flex;
				flex-direction: column;
				gap: 0.7rem;
				& > * {
					height: 8rem;
				}
			}
			.WindowService-type {
				display: flex;
				flex-direction: column;
				gap: 0.7rem;
				&-list {
					display: flex;
					flex-direction: row;
					gap: 0.7rem;
					button {
						min-width: 100px;
						border-width: 3px;
						border-style: solid;
						border-color: var(--type-color);
						border-radius: 50px;
						box-shadow: 0 0 4px hsl(0, 0%, 90%);
						font-weight: 600;
						color: var(--type-color);
						padding: 4px 16px;
						background-color: white;
						transition: var(--transition-duration);
						cursor: pointer;
						&:hover,
						&:focus {
							background-color: var(--type-color);
							color: white;
						}
					}
					.WindowService-type-list-item-selected {
						background-color: var(--type-color);
						color: white;
						cursor: initial;
					}

					&-item-info {
						--type-color: #f0c21d;
					}

					&-item-purchase {
						--type-color: #0771d2;
					}
				}
			}
		}
	}
</style>
