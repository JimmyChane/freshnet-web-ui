<script>
	import { getDay } from "date-fns"; // https://date-fns.org/v2.29.3/docs/Getting-Started
	import Item from "./PageHome-SectionHour-Item.vue";
	import Company from "@/host/Company";

	export default {
		components: { Item },
		props: { isThin: { type: Boolean, default: false } },
		data() {
			return {
				// items: [
				// 	{ index: 1, title: "Monday", content: "9am - 7pm" },
				// 	{ index: 2, title: "Tuesday", content: "9am - 7pm" },
				// 	{ index: 3, title: "Wednesday", content: "9am - 7pm" },
				// 	{ index: 4, title: "Thursday", content: "9am - 7pm" },
				// 	{ index: 5, title: "Friday", content: "9am - 7pm" },
				// 	{ index: 6, title: "Saturday", content: "9am - 7pm" },
				// 	{ index: 0, title: "Sunday", content: "10am - 6:30pm" },
				// ],
				items: Company.BusinessHours.toArray().map((item) => {
					return {
						index: item.day,
						title: item.title,
						content: item.hours.toString(),
					};
				}),
				todayIndex: -1,
			};
		},
		mounted() {
			this.todayIndex = getDay(Date.now());
		},
	};
</script>

<template>
	<div
		:class="['HomeSectionHour', `HomeSectionHour-${isThin ? 'isThin' : 'isWide'}`]"
		:to="{ path: '/print' }"
	>
		<div class="HomeSectionyHour-body">
			<Item
				v-for="item of items"
				:key="item.title"
				:item="item"
				:isToday="item.index === todayIndex"
			/>
		</div>
	</div>
</template>

<style lang="scss" scoped>
	.HomeSectionHour {
		background-color: #f3f3f3;
		overflow: hidden;
		color: black;

		border-radius: 1em;

		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;

		.HomeSectionyHour-body {
			padding: 1.8em;
			gap: 0.5em;

			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
		}
	}
	.HomeSectionHour-isThin {
		width: 100%;
		height: 100%;
		font-size: 1rem;
	}
	.HomeSectionHour-isWide {
		width: 100%;
		height: 100%;
		font-size: 1.2rem;
	}
</style>
