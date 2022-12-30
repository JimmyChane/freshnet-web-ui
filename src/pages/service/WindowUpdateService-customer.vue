<script>
	import Input from "@/components/Input.vue";

	const TimeGetter = {
		lastNowTime: 0,
		getTimeNow() {
			let timeNow = Date.now();
			while (timeNow <= this.lastNowTime) timeNow++;
			this.lastNowTime = timeNow;
			return timeNow;
		},
	};

	export default {
		components: { Input },
		props: {
			names: { type: Array, default: () => [] },
			phoneNumbers: { type: Array, default: () => [] },
		},
		data() {
			return { valueNames: [], valuePhoneNumbers: [] };
		},
		watch: {
			names() {
				this.onResetNames();
			},
			phoneNumbers() {
				this.onResetPhoneNumbers();
			},
		},
		mounted() {
			this.onResetNames();
			this.onResetPhoneNumbers();
		},
		methods: {
			focus() {
				const ref = Array.isArray(this.$refs.Name)
					? this.$refs.Name[0]
					: this.$refs.Name;
				ref.focus();
			},

			onResetNames() {
				this.valueNames = [...this.names, ""].map((name) => {
					return { time: TimeGetter.getTimeNow(), value: name };
				});
				this.onInputNames(this.valueNames[this.valueNames.length - 1], "");
			},
			onResetPhoneNumbers() {
				this.valuePhoneNumbers = [...this.phoneNumbers, ""].map(
					(phoneNumber) => {
						return { time: TimeGetter.getTimeNow(), value: phoneNumber };
					},
				);
				this.onInputPhoneNumbers(
					this.valuePhoneNumbers[this.valuePhoneNumbers.length - 1],
					"",
				);
			},

			onInputNames(name, value) {
				name.value = value;

				const emptyNames = this.valueNames.filter(
					(name) => name.value.trim().length === 0,
				);

				if (emptyNames.length === 0) {
					this.valueNames.push({ time: TimeGetter.getTimeNow(), value: "" });
					return;
				}

				this.onCleaning(emptyNames, this.valueNames, name);
			},
			onInputPhoneNumbers(phoneNumber, value) {
				phoneNumber.value = value;

				const emptyNames = this.valuePhoneNumbers.filter(
					(phoneNumber) => phoneNumber.value.trim().length === 0,
				);

				if (emptyNames.length === 0) {
					this.valuePhoneNumbers.push({
						time: TimeGetter.getTimeNow(),
						value: "",
					});
					return;
				}

				this.onCleaning(emptyNames, this.valuePhoneNumbers, phoneNumber);
			},
			onCleaning(empties, list, focusItem) {
				if (empties.length > 1) {
					while (empties.length > 1) {
						let remove = empties[empties.length - 1];
						if (focusItem === remove) remove = empties[empties.length - 2];
						if (!remove) return;

						list.splice(list.indexOf(remove), 1);
						empties.splice(empties.indexOf(remove), 1);
					}
				}
			},

			getValueNames() {
				return this.valueNames
					.map((name) => name.value)
					.filter((name) => name.length);
			},
			getValuePhoneNumbers() {
				return this.valuePhoneNumbers
					.map((phoneNumber) => phoneNumber.value)
					.filter((phoneNumber) => phoneNumber.length);
			},
		},
	};
</script>

<template>
	<div class="WindowUpdateService-customer">
		<span class="WindowUpdateService-title">Customer</span>

		<div class="WindowUpdateService-names">
			<Input
				v-for="valueName of valueNames"
				:key="valueName.time"
				class="WindowUpdateService-input"
				ref="Name"
				:label="
					valueNames.length > 1
						? `Name ${valueNames.indexOf(valueName) + 1}`
						: 'Name'
				"
				:isRequired="true"
				:bindValue="valueName.value"
				@input="(comp) => onInputNames(valueName, comp.value)"
			/>
		</div>

		<div class="WindowUpdateService-phoneNumbers">
			<Input
				v-for="valuePhoneNumber of valuePhoneNumbers"
				:key="valuePhoneNumber.time"
				class="WindowUpdateService-input"
				ref="phonenumber"
				:label="
					valuePhoneNumbers.length > 1
						? `Phone Number ${valuePhoneNumbers.indexOf(valuePhoneNumber) + 1}`
						: 'Phone Number'
				"
				type="tel"
				:bindValue="valuePhoneNumber.value"
				@input="(comp) => onInputPhoneNumbers(valuePhoneNumber, comp.value)"
			/>
		</div>
	</div>
</template>

<style lang="scss" scoped>
	.WindowUpdateService-customer {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 0.7rem;

		.WindowUpdateService-title {
			font-size: 1.1rem;
			font-weight: 600;
		}
		.WindowUpdateService-input {
			font-size: 1rem;
			background: hsla(0, 0%, 0%, 0.03);
			border-radius: 0.2rem;
			padding: 0.6rem;
		}

		.WindowUpdateService-names {
			gap: 0.2rem;
			display: grid;
			grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr));
		}
		.WindowUpdateService-phoneNumbers {
			gap: 0.2rem;
			display: grid;
			grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr));
		}
	}
</style>
