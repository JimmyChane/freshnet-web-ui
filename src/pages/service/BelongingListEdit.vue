<script>
	const TimeGetter = {
		lastNowTime: 0,
		getTimeNow() {
			let timeNow = Date.now();
			while (timeNow <= this.lastNowTime) timeNow++;
			this.lastNowTime = timeNow;
			return timeNow;
		},
	};

	const getNewBelongingTemplate = () => ({
		title: "",
		quantity: 0,
		time: TimeGetter.getTimeNow(),
	});
	const isBelongingEmpty = (data) =>
		data.title.trim() === "" && data.quantity <= 0;

	import Input from "@/components/Input.vue";

	export default {
		components: { Input },
		props: { values: { type: Array, default: () => [] } },
		data() {
			return { belongings: [] };
		},
		watch: {
			values() {
				this.onReset();
			},
		},
		mounted() {
			this.onReset();
		},
		methods: {
			onReset() {
				const values = (Array.isArray(this.values) ? this.values : []).map(
					(value) => {
						return {
							title: value.title,
							quantity: value.quantity > 0 ? value.quantity : 1,
							time: TimeGetter.getTimeNow(),
						};
					},
				);

				this.belongings = [...values, getNewBelongingTemplate()];
			},

			onInput() {
				let emptyBelongings = this.belongings.filter((belonging) => {
					return isBelongingEmpty(belonging);
				});

				if (emptyBelongings.length === 0) {
					this.belongings.push(getNewBelongingTemplate());
				} else if (emptyBelongings.length === 1) {
				} else {
					while (emptyBelongings.length > 1) {
						let remove = emptyBelongings.pop();
						let indexRemove = this.belongings.indexOf(remove);
						if (indexRemove !== this.belongings.length - 1) {
							this.belongings.splice(this.belongings.indexOf(remove), 1);
						}
					}
				}

				const last = this.belongings[this.belongings.length - 1];
				if (!isBelongingEmpty(last)) {
					this.belongings.push(getNewBelongingTemplate());
				}
			},

			getResults() {
				return this.belongings.filter((belonging) => {
					if (belonging.time === 0) belonging.time = TimeGetter.getTimeNow();
					return belonging.title.trim() && belonging.quantity;
				});
			},

			focus() {
				// const toFocus = () => {
				// 	const inputs = this.$refs.input;
				// 	console.log(inputs);
				// 	if (inputs.length) {
				// 		inputs[inputs.length - 1].focus();
				// 		return;
				// 	}
				// 	setTimeout(toFocus, 2000);
				// };
				// toFocus();
			},
		},
	};
</script>

<template>
	<div class="BelongingListEdit-list">
		<div
			class="BelongingListEdit-item"
			v-for="belonging in belongings"
			:key="belonging.time"
		>
			<input
				class="BelongingListEdit-item-input"
				ref="input"
				type="text"
				:placeholder="`Item ${belongings.indexOf(belonging) + 1}`"
				:value="belonging.title"
				@input="
					(event) => {
						let value = event.target.value.trim();
						if (value === '') belonging.quantity = 0;
						else
							belonging.quantity =
								belonging.quantity > 0 ? belonging.quantity : 1;

						belonging.title = value;

						onInput();
					}
				"
				@change="
					(event) => {
						let value = event.target.value.trim();
						if (value === '') belonging.quantity = 0;
						else
							belonging.quantity =
								belonging.quantity > 0 ? belonging.quantity : 1;

						onInput();
					}
				"
			/>
			<div class="BelongingListEdit-item-line"></div>
			<input
				class="BelongingListEdit-item-count"
				type="number"
				:value="belonging.quantity"
				@change="
					(event) => {
						let count = Number.parseInt(event.target.value);
						if (Number.isNaN(count)) count = 0;
						if (count < 0) count = 0;
						if (count > 999) count = 999;
						event.target.value = count;
						belonging.quantity = count;
					}
				"
				@input="
					(event) => {
						let count = Number.parseInt(event.target.value);
						if (Number.isNaN(count)) count = 0;
						if (count < 0) count = 0;
						if (count > 999) count = 999;
						event.target.value = count;
						belonging.quantity = count;
					}
				"
			/>
		</div>
	</div>
</template>

<style lang="scss" scoped>
	.BelongingListEdit-list {
		display: flex;
		flex-direction: column;
		row-gap: 0.4rem;
		gap: 0.2rem;

		.BelongingListEdit-item {
			width: 100%;

			display: flex;
			flex-direction: row;

			border: 0.1em solid rgba(0, 0, 0, 0.05);
			border-radius: 2em;
			background: hsla(0, 0%, 0%, 0.03);
			font-weight: 400;
			font-size: 1em;
			color: black;

			.BelongingListEdit-item-input {
				width: 100%;
				padding: 0.8em;
				z-index: 2;

				display: flex;
				flex-grow: 1;

				border: none;
				background: none;
				font-size: inherit;
			}
			.BelongingListEdit-item-line {
				min-width: 1px;
				min-height: calc(100% - 1em);
				margin: 0.5em 0;
				background: rgba(0, 0, 0, 0.1);
			}
			.BelongingListEdit-item-count {
				width: 5rem;
				display: flex;
				align-items: center;
				justify-content: center;
				flex-grow: 0;

				padding: 0.8em;
				border: none;
				background: none;
				font-size: inherit;
				text-align: center;
			}
		}
	}
</style>
