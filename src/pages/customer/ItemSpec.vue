<script>
	import ButtonIcon from "@/components/button/ButtonIcon.vue";
	export default {
		components: { ButtonIcon },
		emits: ["input-content", "change-content", "click-remove"],
		props: { item: { type: Object, default: () => null } },
		computed: {
			specifications: (c) => {
				return [
					{ key: "none", title: "None" },
					...c.specificationStore.getters.items.map((item) => item),
				].map((item) => ({
					key: item.key,
					title: item.title,
					icon: item.icon ? item.icon.toUrl() : "",
				}));
			},

			specType: (c) =>
				c.specifications.find((specType) => specType.key === c.item.typeKey),
			icon: (c) => (c.specType ? c.specType.icon : ""),
			title: (c) => (c.specType ? c.specType.title : ""),
		},
		mounted() {
			this.$refs.ItemSpecInput.focus();
		},
	};
</script>

<template>
	<div class="ItemSpec" @focus="$refs.ItemSpecInput.focus()">
		<input
			class="ItemSpec-input"
			ref="ItemSpecInput"
			type="text"
			v-model="item.content"
			@input="(event) => $emit('input-content', event.target.value)"
			@change="(event) => $emit('change-content', event.target.value)"
		/>

		<div class="ItemSpec-footer">
			<img class="ItemSpec-icon" v-if="icon" :src="icon" />
			<span class="ItemSpec-text" v-if="title">{{ title }}</span>

			<ButtonIcon
				class="ItemSpec-delete"
				:src="host.res('icon/trash-DB4A2A.svg')"
				@click="$emit('click-remove', item)"
			/>
		</div>
	</div>
</template>

<style lang="scss" scoped>
	.ItemSpec {
		width: 100%;
		border-radius: 0.5rem;
		background: hsla(0, 0%, 0%, 0.08);
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		align-items: center;
		column-gap: 0.2rem;
		overflow: hidden;

		.ItemSpec-input {
			flex-grow: 1;

			// width: 100%;
			padding: 0.4rem 0;
			margin: 0 0.6rem;
			margin-top: 0.2rem;
			font-size: 1rem;
			border: none;
			border-bottom: 0.1rem solid;
			border-color: hsla(0, 0%, 0%, 0.1);
			background: none;
			flex-grow: 1;
			transition: var(--animation-duration);

			display: flex;
			flex-direction: row;

			&:hover,
			&:focus {
				border-color: hsla(0, 0%, 0%, 0.3);
			}
		}

		.ItemSpec-footer {
			flex-basis: 9rem;
			width: 100%;
			flex-grow: 0;
			display: flex;
			flex-direction: row;
			align-items: center;
			.ItemSpec-icon {
				padding: 0.6rem 0;
				width: 2rem;
				height: 2rem;
				margin-left: 0.2rem;
			}
			.ItemSpec-text {
				padding: 0.6rem 0;
				font-size: 0.7rem;
				margin-left: 0.2rem;
				color: black;
				flex-grow: 1;
				line-height: 0.8rem;

				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: flex-start;
			}
			.ItemSpec-delete {
				margin-left: 0.2rem;
				opacity: 0;
				pointer-events: none;
			}
		}

		&:hover,
		&:focus-within {
			.ItemSpec-delete {
				opacity: 1;
				pointer-events: initial;
			}
		}
	}
</style>
