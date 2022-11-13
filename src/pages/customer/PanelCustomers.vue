<script>
	import Actionbar from "./Actionbar.vue";
	import ItemCustomer from "./ItemCustomer.vue";

	import Empty from "@/components/Empty.vue";

	export default {
		components: { Actionbar, ItemCustomer, Empty },
		emits: [
			"click-drawer-expand",
			"click-refresh",
			"click-item-add",
			"click-item-remove",
		],
		props: {
			title: { type: String, default: "" },
			items: { type: Array, default: () => [] },
			itemSelected: { type: Object, default: () => null },
		},
		data() {
			return { scrollTop: 0, itemSelect: null };
		},
		methods: {
			itemKey(item) {
				return `${this.itemName(item)}${this.itemPhoneNumberValue(item)}`;
			},
			itemName(item) {
				if (item) return item.name;
				return "";
			},
			itemPhoneNumberValue(item) {
				if (item && item.phoneNumber) return item.phoneNumber.value;
				return "";
			},
			itemPhoneNumberStr(item) {
				if (item && item.phoneNumber) return item.phoneNumber.toString();
				return "";
			},
		},
	};
</script>

<template>
	<div class="PanelCustomers" @scroll="(event) => (scrollTop = event.target.scrollTop)">
		<Actionbar
			class="PanelCustomers-top"
			:hasShadow="scrollTop > 0"
			:title="title"
			:items="items"
			@click-item-add="() => $emit('click-item-add')"
			@click-refresh="() => $emit('click-refresh')"
			@click-drawer-expand="() => $emit('click-drawer-expand')"
		/>

		<div class="PanelCustomers-body" v-if="items.length">
			<router-link
				class="PanelCustomers-item"
				v-for="item of items"
				:key="itemKey(item)"
				:to="{
					query: {
						name: itemName(item),
						phoneNumber: itemPhoneNumberValue(item),
					},
				}"
			>
				<ItemCustomer
					:item="item"
					:selected="item === itemSelected"
					@click-remove="(param) => $emit('click-item-remove', { item })"
				/>
			</router-link>
		</div>
		<Empty v-if="!items.length && !customerStore.getters.isLoading" />
	</div>
</template>

<style lang="scss" scoped>
	.PanelCustomers {
		width: 100%;
		height: 100%;
		overflow-y: auto;
		display: flex;
		flex-direction: column;
		align-items: stretch;
		justify-content: stretch;
		.PanelCustomers-top {
			z-index: 2;
			position: sticky;
			top: 0;
			left: 0;
			right: 0;
		}
		.PanelCustomers-body {
			z-index: 1;
			padding: 1rem;
			padding-bottom: 10rem;
			display: flex;
			flex-direction: column;
			align-items: center;
			gap: 0.5rem;

			.PanelCustomers-item {
				width: 100%;
				max-width: 35rem;
				max-width: 25rem;
				text-decoration: none;
				font-size: 1rem;
				color: inherit;
			}
		}
	}
</style>
