<script>
	export default {
		emits: ["click-item-key"],
		props: { items: { type: Array }, defaultKey: { type: String } },
		data() {
			return { list: [], selectedKey: "" };
		},
		watch: {
			items() {
				this.onInvalidateList();
			},
			defaultKey() {
				this.onInvalidateDefaultKey();
			},
		},
		mounted() {
			this.onInvalidateList();
			this.onInvalidateDefaultKey();
		},
		methods: {
			onInvalidateList() {
				this.list = (Array.isArray(this.items) ? this.items : []).map(
					(item) => item,
				);
			},
			onInvalidateDefaultKey() {
				this.selectKey(
					typeof this.defaultKey === "string" ? this.defaultKey : "",
				);
			},

			selectKey(key) {
				this.selectedKey = key;
				this.$emit("click-item-key", this.selectedKey);
			},
		},
	};
</script>

<template>
	<div class="TypeSelector">
		<div class="TypeSelector-list">
			<button
				v-for="item of list"
				:key="item.key"
				class="TypeSelector-item"
				:class="[item.key === selectedKey ? 'TypeSelector-item-selected' : '']"
				:style="{
					'--type-color': item.color ? item.color : 'var(--primary-color)',
				}"
				@click="selectKey(item.key)"
			>
				{{ item.title }}
			</button>
		</div>
	</div>
</template>

<style lang="scss" scoped>
	.TypeSelector {
		display: flex;
		flex-direction: column;
	}
	.TypeSelector-list {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: flex-start;
		flex-wrap: wrap;
		gap: 0.2rem;
		padding-top: 0.8rem;
		padding-bottom: 0.8rem;
		overflow-x: auto;
		.TypeSelector-separator {
			min-width: 1px;
			height: 100%;
			max-height: calc(100% - 0.8rem);
			background-color: hsl(0, 0%, 90%);
			margin-left: 0.8rem;
			margin-right: 0.8rem;
		}
		.TypeSelector-item {
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: center;
			width: 7.5rem;
			min-width: max-content;
			border-width: 1px;
			border-style: solid;
			border-color: var(--type-color);
			border-radius: 2rem;
			font-weight: 600;
			color: var(--type-color);
			padding: 8px 24px;
			background-color: white;
			transition: var(--animation-duration);
			cursor: pointer;
			&:hover,
			&:focus {
				background-color: var(--type-color);
				color: white;
			}
		}
		.TypeSelector-item-selected {
			background-color: var(--type-color);
			color: white;
			cursor: initial;
		}
	}
</style>
