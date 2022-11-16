<script>
	import ItemEvent from "./ItemEvent.vue";
	import { getDay, previousDay, endOfDay, format } from "date-fns";

	export default {
		components: { ItemEvent },
		props: {
			items: { type: Array, default: () => [] },
		},
		computed: {
			groups() {
				return this.items.reduce((groups, item) => {
					const ts = item.timestamp;
					const time = ts.time;

					const isWithinWeek = () => {
						const today = new Date();
						const dayWeek = getDay(today);
						const dayWeekPrevious = previousDay(today, dayWeek);
						const timeStartWeek = endOfDay(dayWeekPrevious);
						return time > timeStartWeek;
					};

					const optGroup = (title) => {
						let group = groups.find((group) => group.title === title);
						if (!group) groups.push((group = { title, items: [] }));
						return group;
					};
					const putItem = (title) => optGroup(title).items.push(item);

					if (ts.isToday()) putItem("Today");
					else if (ts.isYesterday()) putItem("Yesterday");
					else if (isWithinWeek()) putItem(format(time, "EEEE, dd/LL/yyyy"));
					else if (ts.isThisYear()) putItem(format(time, "dd/LL/yyyy"));
					else putItem(ts.getYear().toString());

					return groups;
				}, []);
			},
		},
	};
</script>

<template>
	<div class="ListEvents">
		<div class="ListEvents-group" v-for="group of groups" :key="group.title">
			<span class="ListEvents-group-title" v-if="group.title">{{ group.title }}</span>

			<ItemEvent
				class="ListEvents-group-item"
				v-for="item of group.items"
				:key="item.timestamp.time"
				:item="item"
				@callback-delete="(item) => $emit('click-item-delete', item)"
			/>
		</div>
	</div>
</template>

<style lang="scss" scoped>
	.ListEvents {
		display: flex;
		flex-direction: column;

		.ListEvents-group {
			width: 100%;
			display: flex;
			flex-direction: column;
			align-items: center;

			.ListEvents-group-title {
				width: 100%;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;

				font-size: 0.8rem;
				font-weight: 600;
				background: hsl(0, 0%, 98%);
				border-bottom: 1px solid hsla(0, 0%, 0%, 0.1);
				padding: 0.2rem 0.4rem;
				text-align: center;

				position: sticky;
				top: 0;
				z-index: 3;
			}
			.ListEvents-group-item {
				z-index: 2;
				width: 100%;
			}
		}
	}
</style>
