<script>
	const selectionNone = { key: "", title: "None" };

	export default {
		emits: ["callback-select"],
		props: {
			list: { type: Array, default: () => [] },
			keySelected: { type: String, default: "" },
		},
		data() {
			return {
				expand: false,
				shouldShowIcon: false,

				itemList: [],

				currentSelected: selectionNone,

				selectionNone,
			};
		},
		watch: {
			list: function () {
				this.onList();
			},
			keySelected: function (newKey) {
				this.onSelect(newKey);
			},
		},
		mounted() {
			const spinnerButton = this.$refs["Selector-button"];
			spinnerButton.addEventListener("focusout", () => {
				setTimeout(() => (this.expand = false), 100);
			});

			this.onList();
			this.onSelect(this.keySelected);
		},
		methods: {
			onList() {
				this.shouldShowIcon = false;

				const itemListParsed = this.list.filter((item) => {
					this.shouldShowIcon = !this.shouldShowIcon ? item.icon : true;
					return (
						typeof item == "object" &&
						item.key &&
						this.currentSelected?.key !== item.key
					);
				});

				this.itemList = itemListParsed ? itemListParsed : [];
			},
			onSelect(key) {
				const currentSelectedParsed = this.list.find((item) => {
					return item.key === key;
				});

				this.currentSelected = currentSelectedParsed
					? currentSelectedParsed
					: this.selectionNone;

				this.onList();
			},
		},
	};
</script>

<template>
	<div
		class="Selector-root"
		:style="{
			'--item-color': currentSelected.color
				? currentSelected.color
				: 'hsl(0, 0%, 96%)',
			'--item-font-color':
				currentSelected.color && currentSelected.color ? 'white' : 'black',
		}"
	>
		<button
			:class="['Selector-body', expand ? 'Selector-body-selected' : '']"
			ref="Selector-button"
			@click="expand = !expand"
		>
			<div class="Selector-body-hover Selector-item">
				<img
					class="Selector-icon"
					v-if="shouldShowIcon && currentSelected.icon"
					:style="{ opacity: [currentSelected.icon ? '1' : '0'] }"
					:src="currentSelected.icon ? currentSelected.icon.white : ''"
				/>
				<span class="Selector-title"> {{ currentSelected.title }} </span>
				<div class="Selector-separator" />
				<img
					class="Selector-arrow"
					:src="
						host.res(
							`icon/arrow_down-${currentSelected.color ? 'white' : 'black'}.svg`,
						)
					"
					:style="{
						transform: [expand ? 'rotate(-180deg)' : 'rotate(0deg)'],
					}"
				/>
			</div>
		</button>

		<div
			class="Selector-dropdown"
			:style="{
				transform: [expand ? 'translateY(4px)' : 'translateY(-20px)'],
				'pointer-events': [expand ? 'all' : 'none'],
				opacity: [expand ? '1' : '0'],
			}"
		>
			<button
				class="Selector-item"
				:key="item.key"
				v-for="item in itemList"
				:class="[currentSelected.key === item.key ? 'Selector-item-selected' : '']"
				@click="
					onSelect(item.key);
					$emit('callback-select', item.key);
				"
			>
				<img
					class="Selector-icon"
					v-if="shouldShowIcon"
					:style="{ opacity: [item.icon ? '1' : '0'] }"
					:src="item.icon ? item.icon.color : ''"
				/>
				<span class="Selector-title"> {{ item.title }} </span>
			</button>
		</div>
	</div>
</template>

<style lang="scss" scoped>
	.Selector-root {
		width: 100%;
		--border-radius: 6px;
		--icon-size: 20px;

		--item-color: hsl(0, 0%, 40%);
		--item-font-color: black;

		--root-shadow: 0px 0px 10px 0px hsla(0, 0%, 30%, 0.7);

		font-size: 1rem;
		transition: var(--animation-duration);
		position: relative;
	}

	.Selector-icon {
		width: var(--icon-size);
		height: var(--icon-size);
		padding: 0.1rem;
	}

	.Selector-body {
		width: 100%;
		// max-width: min-content;
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		align-items: center;
		gap: 1em;
		cursor: pointer;
		text-align: start;
		border: none;
		border-radius: var(--border-radius);
		background-color: var(--item-color);
		// box-shadow: 0 0 4px hsl(0, 0%, 70%);
		border: 1px solid hsl(0, 0%, 80%);
		transition: var(--animation-duration);
		overflow: hidden;
		&-selected {
			// box-shadow: var(--root-shadow);
			z-index: 1;
		}

		.Selector-body-hover {
			width: 100%;
			display: flex;
			flex-direction: row;
			flex-wrap: nowrap;
			align-items: stretch;
			gap: 0.6em;
			padding: 0.6em 1em;
			border-radius: 6px;
			color: var(--item-font-color);
			font-weight: 900;
			font-weight: 400;
			font-size: 1rem;
			cursor: pointer;
			transition: var(--animation-duration);
			&:hover {
				background-color: hsla(0, 0%, 0%, 0.1);
			}

			.Selector-title {
				flex-grow: 100;
				transition: var(--animation-duration);
			}
			.Selector-separator {
				min-width: 2px;
				min-height: 100%;
				background-color: hsla(0, 0%, 0%, 0.1);
				display: flex;
				flex-direction: row;
				transition: var(--animation-duration);
			}
			.Selector-arrow {
				width: var(--icon-size);
				height: var(--icon-size);
				padding: 0.3rem;
				transition: var(--animation-duration);
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: center;
			}
		}
	}

	.Selector-dropdown {
		width: 100%;
		z-index: 1;
		max-height: 400px;
		overflow-y: auto;
		position: absolute;
		flex-direction: column;
		background-color: white;
		display: flex;
		transform: translateY(-20px);
		pointer-events: none;
		opacity: 0;
		border-radius: var(--border-radius);
		box-shadow: var(--root-shadow);
		transition: var(--animation-duration) cubic-bezier(1, 0, 0, 1);
		padding: 10px 0;
		.Selector-item {
			width: 100%;
			display: flex;
			flex-direction: row;
			align-items: center;
			gap: 1em;
			padding: 0.6em 1em;
			transition: var(--animation-duration);
			cursor: pointer;
			border: none;
			background-color: transparent;
			text-align: start;
			font-size: 1em;
			&:hover,
			&:focus {
				background-color: hsl(0, 0%, 90%);
			}
		}
		.Selector-item-selected {
			background-color: hsl(0, 0%, 90%);
			transition: var(--animation-duration);
		}
	}
</style>
