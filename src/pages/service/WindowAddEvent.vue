<script>
	import ModuleEvent from "@/items/data/ServiceEvent.js";
	import TypeSelector from "@/components/selector/TypeSelector.vue";
	import Window from "@/components/window/Window.vue";
	import Input from "@/components/Input.vue";
	import TextArea from "@/components/InputTextArea.vue";

	export default {
		components: { Window, TypeSelector, Input, TextArea },
		emits: ["callback-create", "callback-cancel"],
		data() {
			return {
				ModuleEvent,

				nameOfUser: "unknown",
				eventMethod: ModuleEvent.Method.Info,

				eventDescription: "",
				eventStatus: "",
				eventAmount: "",
			};
		},
		computed: {
			user: (c) => c.loginStore.getters.user,
			isUserDefault: (c) => {
				if (!c.user) return false;
				const isUserAdmin = c.user.isTypeAdmin() && c.user.username === "admin";
				const isUserStaff = c.user.isTypeStaff() && c.user.username === "staff";
				return isUserAdmin || isUserStaff;
			},
			isMethodInfo: (c) => c.eventMethod === ModuleEvent.Method.Info,
			isMethodQuotation: (c) => c.eventMethod === ModuleEvent.Method.Quotation,
			isMethodPurchase: (c) => c.eventMethod === ModuleEvent.Method.Purchase,
			nameUserType: (c) => {
				if (!c.user) return "";
				if (c.user.isTypeAdmin()) return "admin";
				if (c.user.isTypeStaff()) return "staff";
				return "unknown";
			},
		},
		watch: {
			user() {
				let user = this.user;
				if (user) {
					this.nameOfUser = this.isUserDefault ? "" : user.name;
				}
			},
			nameOfUser() {
				if (this.nameOfUser.includes(" ")) {
					this.nameOfUser = this.nameOfUser.trim().replace(" ", "");
				}
			},
			eventMethod() {
				setTimeout(() => this.invalidateMethod(), 10);
			},
		},
		mounted() {
			this.reset();
		},
		methods: {
			invalidateMethod() {
				const { InputStatus, InputAmount } = this.$refs;
				if (this.isMethodInfo) InputStatus.focus();
				if (this.isMethodQuotation || this.isMethodPurchase)
					InputAmount.focus();
			},

			reset() {
				this.nameOfUser = "";
				this.eventMethod = ModuleEvent.Method.Info;

				this.eventDescription = "";
				this.eventStatus = "";
				this.eventAmount = "";
			},

			toEvent() {
				let event = {
					timestamp: Date.now(),
					method: this.eventMethod,
					description: this.eventDescription,
				};

				if (this.isMethodInfo) {
					event.status = this.eventStatus;
					return event;
				}

				if (this.isMethodQuotation || this.isMethodPurchase) {
					event.price = {
						amount: this.eventAmount,
						currency: "RM",
					};
					return event;
				}

				return null;
			},
			submit() {
				if (this.isUserDefault && !this.nameOfUser.trim()) {
					this.$root.feedback("You must specify your name");
					return;
				}
				if (!this.eventDescription.trim()) {
					this.$root.feedback('You must specify "Description"');
					return;
				}

				let event = this.toEvent();
				if (this.isUserDefault && this.nameOfUser.trim()) {
					event.nameOfUser = this.nameOfUser;
				}

				if (event) {
					this.$emit("callback-create", event);
					this.reset();
				}
			},

			focus() {
				this.$refs.InputDescription.focus();
			},
		},
	};
</script>

<template>
	<Window
		class="WindowEvent"
		title="New Event"
		@click-cancel="
			() => {
				$emit('callback-cancel');
				reset();
			}
		"
		@click-ok="() => submit()"
	>
		<div class="WindowEvent-body">
			<div class="WindowEvent-user" v-if="isUserDefault">
				<Input
					class="WindowEvent-user-name-input WindowEvent-input"
					:label="`${nameUserType}${
						nameOfUser.trim() === '' ? ' (Your name here)' : ''
					}`"
					:isRequired="true"
					:bindValue="nameOfUser"
					@input="(comp) => (nameOfUser = comp.value)"
				/>
			</div>

			<div class="WindowEvent-description">
				<TextArea
					class="WindowEvent-input"
					label="Description"
					ref="InputDescription"
					:isRequired="true"
					:bindValue="eventDescription"
					@input="(comp) => (eventDescription = comp.value)"
				/>
			</div>

			<div class="WindowEvent-additional">
				<div class="WindowEvent-type">
					<TypeSelector
						class="WindowEvent-type-list"
						:items="[
							{ key: ModuleEvent.Method.Info, title: 'Info', color: '#0771d2' },
							{
								key: ModuleEvent.Method.Quotation,
								title: 'Quotation',
								color: '#961d96',
							},
							{
								key: ModuleEvent.Method.Purchase,
								title: 'Purchase',
								color: '#258915',
							},
						]"
						:defaultKey="eventMethod"
						@click-item-key="(key) => (eventMethod = key)"
					/>
				</div>

				<Input
					class="WindowEvent-status WindowEvent-input"
					v-if="isMethodInfo"
					label="Status"
					:bindValue="eventStatus"
					ref="InputStatus"
					@input="(comp) => (eventStatus = comp.value)"
				/>

				<div
					class="WindowEvent-amount"
					v-else-if="isMethodQuotation || isMethodPurchase"
				>
					<div class="WindowEvent-amount-value">
						<Input
							class="WindowEvent-input"
							label="RM"
							type="number"
							:bindValue="eventAmount"
							ref="InputAmount"
							@input="(comp) => (eventAmount = comp.value)"
						/>
					</div>
				</div>
			</div>
		</div>
	</Window>
</template>

<style lang="scss" scoped>
	.WindowEvent {
		max-width: 100%;
		width: 35rem;
		.WindowEvent-body {
			font-size: 1rem;
			font-weight: 400;
			color: black;
			display: flex;
			flex-direction: column;
			gap: 40px;

			// Abstract
			.WindowEvent-input {
				font-size: 1rem;
				border: none;
				background: hsla(0, 0%, 0%, 0.03);
				border-bottom: 1px solid hsl(0, 0%, 70%);
				border-radius: 0.2rem;
				padding: 0.6rem 0.4rem;
				resize: none;
			}

			.WindowEvent-user {
				width: 100%;
				display: flex;
				flex-direction: column;
				align-items: flex-start;

				.WindowEvent-user-type {
					font-size: 0.9rem;
					font-weight: 400;
					color: hsl(0, 0%, 50%);
				}
				.WindowEvent-user-name-input {
					width: 12rem;
				}
			}
			.WindowEvent-description {
				display: flex;
				flex-direction: column;

				gap: 0.7rem;
				& > * {
					height: 8rem;
				}
			}
			.WindowEvent-additional {
				font-size: 1rem;
				font-weight: 400;
				color: black;
				display: flex;
				flex-direction: column;
				.WindowEvent-type {
					display: flex;
					flex-direction: column;
					gap: 0.7rem;
					&-list {
						width: 100%;
					}
				}
				.WindowEvent-amount {
					display: flex;
					flex-direction: column;
					gap: 0.7rem;
					&-value {
						width: 100%;
						display: flex;
						flex-direction: row;
						align-items: stretch;

						gap: 0.7rem;
						&-currency {
							display: flex;
							flex-direction: row;
							align-items: center;
							border-bottom: 1px solid transparent;
						}
						.WindowEvent-input {
							flex-grow: 1;
						}
					}
				}
				.WindowEvent-result {
					display: flex;
					flex-direction: column;
					gap: 0.7rem;
				}
			}
		}
	}
</style>
