<script>
	import ModuleEvent from "@/items/data/ServiceEvent.js";
	import TypeSelector from "@/components/selector/TypeSelector.vue";
	import Window from "@/components/window/Window.vue";
	import TextArea from "@/components/InputTextArea.vue";
	import BodyUser from "./WindowUpdateService-user.vue";
	import BodyDescription from "./WindowUpdateService-description.vue";
	import LabelMenus from "./WindowAddEvent-LabelMenus.vue";
	import chroma from "chroma-js";

	export default {
		components: {
			Window,
			TypeSelector,
			TextArea,
			BodyUser,
			BodyDescription,
			LabelMenus,
		},
		emits: ["callback-create", "callback-cancel"],
		data() {
			return {
				ModuleEvent,

				nameOfUser: "unknown",
				eventMethod: ModuleEvent.Method.Quotation,

				eventDescription: "",
				eventStatus: "",
				eventAmount: 0,
			};
		},
		computed: {
			user: (c) => c.loginStore.getters.user,
			isUserDefault: (c) => {
				if (c.user.isTypeNone()) return false;
				const isUserAdmin = c.user.isTypeAdmin() && c.user.isDefault();
				const isUserStaff = c.user.isTypeStaff() && c.user.isDefault();
				return isUserAdmin || isUserStaff;
			},
			isMethodInfo: (c) => c.eventMethod === ModuleEvent.Method.Info,
			isMethodQuotation: (c) => c.eventMethod === ModuleEvent.Method.Quotation,
			isMethodPurchase: (c) => c.eventMethod === ModuleEvent.Method.Purchase,
			nameUserType: (c) => {
				if (c.user.isTypeAdmin()) return "Admin";
				if (c.user.isTypeStaff()) return "Staff";
				return "unknown";
			},

			methodMenu: (context) =>
				context.methodMenus.find((menu) => menu.key === context.eventMethod),
			methodMenus: (context) => [
				{
					key: ModuleEvent.Method.Quotation,
					title: "Quotation",
					color: chroma("961d96"),
					click: (menu) => (context.eventMethod = menu.key),
				},
				{
					key: ModuleEvent.Method.Purchase,
					title: "Purchase",
					color: chroma("258915"),
					click: (menu) => (context.eventMethod = menu.key),
				},
			],
		},
		watch: {
			user() {
				const user = this.user;
				if (!user.isTypeNone()) {
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
				this.eventMethod = ModuleEvent.Method.Quotation;

				this.eventDescription = "";
				this.eventStatus = "";
				this.eventAmount = 0;
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
		title="Add Event"
		@click-cancel="
			() => {
				$emit('callback-cancel');
				reset();
			}
		"
		@click-ok="() => submit()"
	>
		<div class="WindowEvent-body">
			<BodyUser
				:name="nameOfUser"
				@input-name="(value) => (nameOfUser = value)"
			/>
			<BodyDescription
				ref="InputDescription"
				:description="eventDescription"
				@input-description="(value) => (eventDescription = value)"
			/>
			<div
				class="WindowEvent-amount"
				:style="{ '--primary-color': methodMenu.color }"
			>
				<LabelMenus
					class="WindowEvent-amount-method"
					:primaryColor="methodMenu.color"
					:menu="methodMenu"
					:menus="methodMenus"
				/>
				<span class="WindowEvent-amount-currency">RM</span>
				<div class="WindowEvent-amount-line"></div>
				<input
					class="WindowEvent-amount-input"
					type="number"
					:v-model="eventAmount"
					ref="InputAmount"
					placeholder="0.00"
					@input="
						(event) => {
							let amount = Number.parseFloat(event.target.value);
							if (Number.isNaN(amount)) amount = 0;
							eventAmount = amount;
						}
					"
					@change="
						(event) => {
							let amount = Number.parseFloat(event.target.value);
							if (Number.isNaN(amount)) amount = 0;
							eventAmount = amount;
						}
					"
				/>
			</div>
		</div>
	</Window>
</template>

<style lang="scss" scoped>
	.WindowEvent {
		max-width: 100%;
		width: 35rem;
		.WindowEvent-body {
			display: flex;
			flex-direction: column;
			align-items: center;
			gap: 1rem;
			padding-bottom: 4rem;

			font-size: 1rem;
			font-weight: 400;
			color: black;

			.WindowEvent-amount {
				width: 100%;

				display: flex;
				flex-direction: row;
				flex-wrap: nowrap;
				align-items: center;

				background-color: transparent;
				border: 1px solid var(--primary-color);
				border-radius: 2rem;

				color: black;

				.WindowEvent-amount-method {
					height: calc(100% + 1px);
				}
				.WindowEvent-amount-currency {
					min-width: max-content;
					padding: 0.6rem 1rem;
					font-weight: 600;

					display: flex;
					flex-grow: 0;
					flex-direction: row;
					align-items: center;
					justify-content: center;
					text-align: center;
				}
				.WindowEvent-amount-line {
					width: 1px;
					height: calc(100% - 1rem);
					background-color: rgba(0, 0, 0, 0.1);
				}
				.WindowEvent-amount-input {
					padding: 0.6rem 1rem;
					flex-grow: 1;
					font-size: inherit;
					color: black;
					border: none;
					background: none;
					resize: none;

					&::placeholder{
						color: rgba(0, 0, 0, 0.3);
					}
				}
			}
		}
	}
</style>
