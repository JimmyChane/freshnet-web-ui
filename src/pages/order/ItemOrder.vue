<script>
	import Button1 from "@/components/button/Button1.vue";
	import Order from "@/items/Order";

	import { format } from "date-fns"; // https://date-fns.org/v2.29.3/docs/Getting-Started

	export default {
		name: "Order",
		components: { Button1 },
		emits: ["onPending", "onComplete", "onRemove", "onExpand", "onCollapse"],
		props: {
			order: { type: Object, default: () => null },
			expand: { type: Boolean, default: false },
		},
		data() {
			return { Order, isExpanded: false };
		},
		computed: {
			dateCreated: (c) => {
				return format(new Date(c.order.createdAt), "hh:mmaaa dd/LL/yyyy");
			},

			customer() {
				if (!this.order.customer) return null;
				return this.order.customer;
			},

			name() {
				if (!this.customer) return "";
				return this.customer.name;
			},
			phoneNumber() {
				if (!this.customer) return null;
				return this.customer.phoneNumber;
			},
			phoneNumberValue() {
				if (!this.phoneNumber) return "";
				return this.phoneNumber.value;
			},
			phoneNumberStr() {
				if (!this.phoneNumber) return "";
				return this.phoneNumber.toString();
			},
			content: (c) => c.order.content,
		},
		watch: {
			isExpanded() {
				this.$emit(this.isExpanded ? "onExpanded" : "onCollapsed", this.order);
			},
			expand() {
				this.isExpanded = this.expand;
			},
		},
	};
</script>

<template>
	<div
		:class="['ItemOrder', isExpanded ? 'ItemOrder-showOption' : 'ItemOrder-hideOption']"
		@click="$emit(isExpanded ? 'onCollapse' : 'onExpand')"
	>
		<div class="ItemOrder-main">
			<div class="ItemOrder-main-left">
				<span class="ItemOrder-date" v-if="dateCreated">{{ dateCreated }}</span>

				<router-link
					class="ItemOrder-customer"
					v-if="name"
					:to="{
						path: '/manage/customer',
						query: { name: name, phoneNumber: phoneNumberValue },
					}"
				>
					<span class="ItemOrder-name" v-if="name">{{ name }}</span>
					<span class="ItemOrder-phoneNumber" v-if="phoneNumberValue">{{
						phoneNumberValue
					}}</span>
				</router-link>

				<span class="ItemOrder-content" v-if="content">{{ content }}</span>
			</div>

			<div class="ItemOrder-main-right">
				<img
					class="ItemOrder-button"
					:class="[
						isExpanded ? 'ItemOrder-button-expanded' : 'ItemOrder-button-collapsed',
					]"
					:alt="isExpanded ? 'Expand' : 'Collapse'"
					:src="host.res('icon/down-arrow-grey.svg')"
				/>
			</div>
		</div>

		<div
			class="ItemOrder-option"
			:class="[isExpanded ? 'ItemOrder-option-expand' : '']"
		>
			<Button1
				v-if="order.status === Order.STATUS_COMPLETED"
				color="#25AE88"
				text="Move to Pending"
				@button-click="$emit('onPending')"
			/>
			<Button1
				v-if="order.status === Order.STATUS_PENDING"
				:icon="host.res('icon/success-green.svg')"
				:iconActive="host.res('icon/success-white.svg')"
				color="#25AE88"
				text="Move to Completed"
				@button-click="$emit('onComplete')"
			/>
			<Button1
				:icon="host.res('icon/trash-red.svg')"
				:iconActive="host.res('icon/trash-white.svg')"
				color="#DB4A2A"
				text=""
				@button-click="$emit('onRemove')"
			/>
		</div>
	</div>
</template>

<style lang="scss" scoped>
	.ItemOrder {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: space-between;

		background: none;
		transition: var(--transition-duration);
		text-align: start;
		cursor: pointer;
		border: 1px solid transparent;

		&:hover,
		&:focus {
			background-color: hsla(0, 0%, 0%, 0.05);
		}

		.ItemOrder-main {
			width: 100%;
			display: flex;
			flex-direction: row;
			align-items: stretch;
			justify-content: stretch;
			gap: 0.2rem;

			.ItemOrder-main-left {
				width: 100%;
				display: flex;
				flex-direction: column;
				flex-grow: 1;
				align-items: flex-start;
				justify-content: flex-start;
				gap: 0.5rem;

				.ItemOrder-date {
					flex-grow: 1;
					color: #6f6f6f;
					font-size: 0.8rem;
				}

				.ItemOrder-customer {
					width: max-content;
					display: flex;
					flex-direction: row;
					align-items: center;
					justify-content: center;
					padding: 0.2rem 0.3rem;
					gap: 1rem;

					border: 1px solid #dddddd;
					border-radius: 0.2rem;
					background-color: #f4f4f4;
					text-decoration: none;
					text-align: start;
					color: inherit;

					.ItemOrder-name {
						font-size: 1rem;
						color: black;
					}
					.ItemOrder-phoneNumber {
						font-size: 0.8rem;
						color: #434343;
					}
				}

				.ItemOrder-content {
					width: 60%;
				}
			}
			.ItemOrder-main-right {
				.ItemOrder-button {
					--size: 35px;
					width: var(--size);
					height: var(--size);
					background-color: transparent;
					border: none;
					margin: 0 6px;
					outline: none;
					border-radius: 50%;
					padding: 10px;
					transition: var(--transition-duration);

					padding: 0px;
					--size: 16px;
				}
				.ItemOrder-button-collapsed {
					transform: none;
				}
				.ItemOrder-button-expanded {
					transform: rotate(180deg);
				}
			}
		}

		.ItemOrder-option {
			width: 100%;
			height: 0;
			max-height: 0;
			display: flex;
			flex-direction: row;
			gap: 16px;
			padding: 0;
			margin-top: 0;
			pointer-events: none;
			opacity: 0;
			transition: var(--transition-duration);

			& > * {
				min-height: 100%;
				height: unset;
				max-height: unset;
				padding: 10px;
				flex-grow: 1;
				transition: var(--transition-duration);
			}
		}
		.ItemOrder-option-expand {
			height: unset;
			max-height: unset;
			margin-top: 20px;
			pointer-events: initial;
			opacity: 1;
		}
	}
	.ItemOrder-hideOption {
		box-shadow: none;
		padding: 10px 10px;
		border-radius: 4px;
		margin: 0 0 6px 0;
	}
	.ItemOrder-showOption {
		padding: 25px 16px;
		border-radius: 6px;
		margin: 20px 0;
		font-size: 1.2rem;
		border: 2px solid hsla(0, 0%, 0%, 0.1);
	}
</style>
